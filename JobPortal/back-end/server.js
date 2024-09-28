const express = require('express');
const http = require('http');
const session = require('express-session');
const sharedSession = require('socket.io-express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const pool = require('./db');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');

const app = express();
const server = http.createServer(app);

// Declare io globally
let io;

// Configure CORS and Socket.IO
io = require('socket.io')(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});



// Middleware to parse JSON and cookies
app.use(express.json());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cookieParser());
app.use(bodyParser.json());
// Session configuration
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'a2f4b9c0e5d',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 60 * 60 * 1000 // 1 hour session expiration
  }
});

// Use the session middleware with Express
app.use(sessionMiddleware);

// Use the session middleware with Socket.IO
io.use(sharedSession(sessionMiddleware, {
  autoSave: true
}));

io.on('connection', (socket) => {
  const session = socket.handshake.session;

  if (!session || !session.user || !session.user.user_id) {
    console.error('No session or user ID found for the connected socket');
    return;
  }

  console.log('Session ID:', session.id);
  console.log('Session data:', session);
  console.log(`User ID from session: ${session.user.user_id}`);

  socket.join(session.user.user_id);

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Serve static files from 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});
const upload = multer({ storage });

// Real-time notification route
app.get('/api/notifications', async (req, res) => {
  const userId = req.session.user.user_id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: No user ID found in session' });
  }

  try {
    const result = await pool.query(
      `
    SELECT 
        js.full_name, 
        jt.job_title, 
        j.job_id, 
        a.status, 
        a.date_applied
    FROM applications a
    JOIN joblistings j ON a.job_id = j.job_id
    JOIN job_titles jt ON j.jobtitle_id = jt.jobtitle_id
    JOIN users u ON j.user_id = u.user_id
    JOIN job_seekers js ON a.user_id = js.user_id
    WHERE u.user_id = $1 AND a.status = 'new'
    ORDER BY a.date_applied DESC;
      `,
      [userId]
    );

    const notifications = result.rows.map(row => ({
      message: `${row.full_name} has applied to be a ${row.job_title}`,
      job_id: row.job_id,
      status: row.status,
      date_applied: row.date_applied,
    }));

    res.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

const getJobData = async () => {
  try {
    const res = await pool.query(`
      SELECT
        joblistings.job_id,
        job_titles.job_title,
        industries.industry_name,
        joblistings.salaryrange,
        joblistings.jobtype,
        pp.profile_picture_url,
        industries.industry_id,
        job_skills.skill_id,
        skills.skill_name
      FROM joblistings
      JOIN job_titles ON joblistings.jobtitle_id = job_titles.jobtitle_id
      JOIN industries ON joblistings.industry_id = industries.industry_id
      JOIN job_skills ON joblistings.job_id = job_skills.job_id
      JOIN skills ON job_skills.skill_id = skills.skill_id
      JOIN profilepictures pp ON joblistings.user_id = pp.user_id;
    `);

    // Transform job data to include required skills as a list
    const jobData = res.rows.reduce((acc, row) => {
      const { job_id, job_title, industry_name, salaryrange, jobtype, profile_picture_url, skill_name } = row;

      // Create a job object if it doesn't already exist
      if (!acc[job_id]) {
        acc[job_id] = {
          job_id,
          job_title,
          industry_name,
          salaryrange,
          jobtype,
          profile_picture_url,
          required_skills: []  // Initialize an array for skills
        };
      }

      // Add skill to the job's required skills
      if (skill_name) {
        acc[job_id].required_skills.push(skill_name);
      }

      return acc;
    }, {});

    return Object.values(jobData);  // Return as an array
  } catch (err) {
    console.error('Error fetching job data:', err);
    throw err;
  }
};

app.get('/api/getskills/:userId', async (req, res) => {
  const { userId } = req.params; // Get userId from request parameters

  try {
    const skills = await pool.query(`
      SELECT skills.skill_name, js_skills.skill_id
      FROM js_skills
      JOIN skills ON js_skills.skill_id = skills.skill_id
      WHERE js_skills.user_id = $1`, [userId]); // Use parameterized query

    res.json(skills.rows); // Respond with the retrieved skills
  } catch (err) {
    console.error('Error fetching skills:', err);
    res.status(500).json({ error: 'Error fetching skills' });
  }
});


app.post('/api/recommend', async (req, res) => {
  if (!req.body.skills || !Array.isArray(req.body.skills) || req.body.skills.length === 0) {
    return res.status(400).json({ error: 'Skills must be a non-empty array.' });
  }

  const jobSeekerSkills = req.body.skills;

  try {
    const jobData = await getJobData(); 
    console.log('Job Data:', jobData); // Log job data for debugging

    const pythonProcess = spawn('python', ['python_scripts/recommendations.py', JSON.stringify(jobData), JSON.stringify(jobSeekerSkills)]);

    let pythonOutput = '';
    
    pythonProcess.stdout.on('data', (data) => {
      pythonOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error('Python error:', data.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).send('An error occurred while processing your request.');
      }
      try {
        const recommendations = JSON.parse(pythonOutput);
        res.json({ recommendations });
      } catch (parseError) {
        console.error('Error parsing Python output:', parseError);
        res.status(500).send('Error processing recommendations.');
      }
    });
  } catch (error) {
    console.error('Error fetching job data:', error);
    res.status(500).send('An error occurred while fetching job data.');
  }
});




app.get('/api/allnotifications', async (req, res) => {
  const userId = req.session.user.user_id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: No user ID found in session' });
  }

  try {
    // Fetch only new notifications
    const result = await pool.query(
      `
      SELECT 
          js.full_name, 
          jt.job_title, 
          j.job_id, 
          a.status, 
          a.date_applied,
          pp.profile_picture_url
      FROM applications a
      JOIN joblistings j ON a.job_id = j.job_id
      JOIN job_titles jt ON j.jobtitle_id = jt.jobtitle_id
      JOIN users u ON j.user_id = u.user_id
      JOIN job_seekers js ON a.user_id = js.user_id
      Join profilepictures pp ON js.user_id = pp.user_id
      WHERE u.user_id = $1 
      ORDER BY a.date_applied DESC;
        `,
      [userId]
    );

    const notifications = result.rows.map(row => ({
      message: `${row.full_name} has applied to be a ${row.job_title}`,
      job_id: row.job_id,
      status: row.status,
      date_applied: row.date_applied,
      profile_picture: row.profile_picture_url
    }));

    // Return all notifications (can filter or paginate in the frontend)
    res.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});


// Endpoint to mark a notification as read
app.post('/api/notifications/mark-as-viewed', async (req, res) => {
  const { jobIds } = req.body;
  const userIdFromSession = req.session.user?.user_id; 
  // Optional chaining to avoid crashes

  // Check if the user is authenticated
  if (!userIdFromSession) {
    return res.status(401).json({ error: 'Unauthorized: No user ID found in session' });
  }

  // Check if any job IDs are provided
  if (!jobIds || jobIds.length === 0) {
    return res.status(400).json({ error: 'No job IDs provided' });
  }

  try {
    // Update applications where job_id is in the list and status is 'new'
    await pool.query(
      `UPDATE applications
       SET status = 'viewed'
       WHERE job_id = ANY($1) AND status = 'new';`,
      [jobIds]
    );

    res.status(200).json({ message: 'Notifications marked as viewed' });
  } catch (error) {
    console.error('Error marking notifications as viewed:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});


app.get('/api/jsnotifications', async (req, res) => {
  const userId = req.session.user.user_id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: No user ID found in session' });
  }

  try {
    // Fetch notifications for job seeker
    const result = await pool.query(
      `
      SELECT 
          js.full_name, 
          jt.job_title, 
          j.job_id, 
          a.status, 
          a.date_applied, 
          a.notif_status, 
          a.application_id
      FROM applications a
      JOIN joblistings j ON a.job_id = j.job_id
      JOIN job_titles jt ON j.jobtitle_id = jt.jobtitle_id
      JOIN job_seekers js ON a.user_id = js.user_id
      WHERE a.user_id = $1 AND a.notif_status = 'new'
      ORDER BY a.date_applied DESC;
      `,
      [userId]
    );

    const notifications = result.rows.map(row => ({
      message: `Your application for ${row.job_title} has been updated to ${row.status}`,
      job_id: row.job_id,
      application_id: row.application_id,
      notif_status: row.notif_status,
      date_applied: row.date_applied,
    }));
    console.log('Database result:', result.rows);


    res.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications for job seeker:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

app.patch('/api/jsnotifications/mark-as-viewed', async (req, res) => {
  const { applicationIds } = req.body; // Update the variable name to applicationIds
  const userIdFromSession = req.session.user?.user_id;

  // Check for user authentication
  if (!userIdFromSession) {
    return res.status(401).json({ error: 'Unauthorized: No user ID found in session' });
  }

  // Validate that application IDs are provided
  if (!applicationIds || applicationIds.length === 0) {
    return res.status(400).json({ error: 'No application IDs provided' });
  }

  try {
    // Update applications based on application IDs
    await pool.query(
      `UPDATE applications
       SET notif_status = 'read'
       WHERE application_id = ANY($1) AND user_id = $2 AND notif_status = 'new';`, // Filtering by user_id too
      [applicationIds, userIdFromSession]
    );
    console.log('Rows affected:', result.rowCount);
    console.log('User ID from session:', userIdFromSession);
    res.status(200).json({ message: 'Notifications marked as viewed' });
  } catch (error) {
    console.error('Error marking notifications as viewed:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});


app.get('/api/alljsnotifications', async (req, res) => {
  const userId = req.session.user.user_id;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: No user ID found in session' });
  }

  try {
    // Fetch notifications for job seeker
    const result = await pool.query(
     `SELECT 
          js.full_name, 
          jt.job_title, 
          j.job_id, 
          a.status, 
          a.date_applied, 
          a.notif_status, 
          a.application_id,
		  pp.profile_picture_url
      FROM applications a
      JOIN joblistings j ON a.job_id = j.job_id
      JOIN job_titles jt ON j.jobtitle_id = jt.jobtitle_id
      JOIN job_seekers js ON a.user_id = js.user_id
	  JOIN profilepictures pp ON j.user_id = pp.user_id
      WHERE a.user_id = $1 
      ORDER BY a.date_applied DESC;
      `,
      [userId]
    );

    const notifications = result.rows.map(row => ({
      message: `Your application for ${row.job_title} has been updated to ${row.status}`,
      job_id: row.job_id,
      status: row.status,
      date_applied: row.date_applied,
      profile_picture: row.profile_picture_url
    }));

    res.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications for job seeker:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});


// API endpoint to update application status
app.post('/api/applications/:applicationId/status', async (req, res) => {
  const applicationId = req.params.applicationId;
  const { status } = req.body; // e.g., 'in review', 'interview', 'hired', etc.
  const userId = req.session.user.user_id; // Fetch the employer's user ID from the session

  // Check if the employer's user ID is available in the session
  if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: No user ID found in session' });
  }

  try {
      // Step 1: Update the application status
      const result = await pool.query(
          `UPDATE applications
           SET status = $1
           WHERE application_id = $2 AND job_id IN (SELECT job_id FROM joblistings WHERE user_id = $3)`,
          [status, applicationId, userId]
      );

      // If no rows were updated, the application might not exist or be unauthorized
      if (result.rowCount === 0) {
          return res.status(404).json({ error: 'Application not found or unauthorized' });
      }

      // Step 2: Fetch the job seeker’s user ID, email, job title, and full name
      const appResult = await pool.query(
          `SELECT u.user_id, u.email, js.full_name, jt.job_title
           FROM users u
           JOIN applications a ON u.user_id = a.user_id
           JOIN joblistings jl ON jl.job_id = a.job_id
           JOIN job_titles jt ON jt.jobtitle_id = jl.jobtitle_id
           JOIN job_seekers js ON js.user_id = u.user_id
           WHERE a.application_id = $1`,
          [applicationId]
      );

      // Ensure the application and user were found
      if (appResult.rowCount > 0) {
          const jobSeekerId = appResult.rows[0].user_id; // The job seeker's user ID
          const jobSeekerEmail = appResult.rows[0].email; // The job seeker's email
          const jobSeekerName = appResult.rows[0].full_name; // The job seeker's full name
          const jobTitle = appResult.rows[0].job_title; // The job title they applied for

          // Step 3: Emit notification to the job seeker using Socket.io
          const notification = {
              message: `${jobSeekerName}, Your application for ${jobTitle} has been updated to ${status}`,
              application_id: applicationId,
              status,
          };
          io.to(jobSeekerId).emit('newNotification', notification);

          // Step 4: Send an email notification to the job seeker
          await sendStatusUpdateEmail(jobSeekerEmail, jobSeekerName, jobTitle, status);
      }

      // Respond with success message
      res.json({ message: 'Application status updated and notification sent successfully' });
  } catch (error) {
      // Catch any errors and respond with a server error message
      console.error('Error updating application status:', error);
      res.status(500).json({ error: 'Server Error' });
  }
});


    
// Profile picture upload endpoint
app.post('/api/upload-profile-picture/:userId', upload.single('profilePicture'), async (req, res) => {
  console.log('Request received to upload profile picture');
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'File upload failed. No file was provided.' });
    }

    const profilePictureUrl = `http://localhost:5000/uploads/${file.filename}`;

    const result = await pool.query(
      'INSERT INTO profilepictures (user_id, profile_picture_url) VALUES ($1, $2)',
      [userId, profilePictureUrl]
    );
   
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ profilePictureUrl });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
});

// Route to get skills
app.get('/api/skills', async (req, res) => {
  try {
    const skills = await pool.query('SELECT skill_id, skill_name FROM skills');
    res.json(skills.rows);
  } catch (err) {
    console.error('Error fetching skills:', err);
    res.status(500).json({ error: 'Error fetching skills' });
  }
});

// Route to get job titles
app.get('/api/jobtitles', async (req, res) => {
  try {
    const jobTitles = await pool.query('SELECT jobtitle_id, job_title FROM job_titles');
    res.json(jobTitles.rows);
  } catch (err) {
    console.error('Error fetching job titles:', err);
    res.status(500).json({ error: 'Error fetching job titles' });
  }
});

// Route to get addresses
app.get('/api/addresses', async (req, res) => {
  try {
    const addresses = await pool.query('SELECT address_id, location FROM address');
    res.json(addresses.rows);
  } catch (err) {
    console.error('Error fetching addresses:', err);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

// Route to get industries
app.get('/api/industries', async (req, res) => {
  try {
    const industries = await pool.query('SELECT industry_id, industry_name FROM industries');
    res.json(industries.rows);
  } catch (err) {
    console.error('Error fetching industries:', err);
    res.status(500).json({ error: 'Failed to fetch industries' });
  }
});



// Use routes
const userRoutes = require('./routes/users');
const jobSeekerRoutes = require('./routes/jobseekers');
const employerRoutes = require('./routes/employers');
const jobRoutes = require('./routes/jobs');
const applicantsRoutes = require('./routes/applicants');
const adminRoutes = require('./routes/admin');

jobRoutes.setIo(io);

app.use('/api/users', userRoutes);
app.use('/api/jobseekers', jobSeekerRoutes);
app.use('/api/employers', employerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applicants', applicantsRoutes);
app.use('/api/admin', adminRoutes)

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { io };
