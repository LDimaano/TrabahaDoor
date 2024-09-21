const express = require('express');
const http = require('http');
const session = require('express-session');
const sharedSession = require('socket.io-express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const pool = require('./db');
require('dotenv').config();


const app = express();
const server = http.createServer(app);


// Configure CORS and Socket.IO
const io = require('socket.io')(server, {
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
      `SELECT a.full_name, jt.job_title, j.job_id, a.status
       FROM applications a
       JOIN joblistings j ON a.job_id = j.job_id
       JOIN job_titles jt ON j.jobtitle_id = jt.jobtitle_id
       JOIN users u ON j.user_id = u.user_id
       WHERE u.user_id = $1
       ORDER BY a.date_applied DESC;`,
      [userId]
    );


    const notifications = result.rows.map(row => ({
      message: `${row.full_name} has applied to be a ${row.job_title}`,
      job_id: row.job_id,
      status: row.status
    }));


    // Update status of 'new' notifications
    const newJobIds = notifications.filter(n => n.status === 'new').map(n => n.job_id);
   
    if (newJobIds.length > 0) {
      await pool.query(
        `UPDATE applications
         SET status = 'viewed'
         WHERE status = 'new' AND job_id = ANY($1::int[])`,
        [newJobIds]
      );
    }


    // Emit the notifications to the client in real-time
    io.to(userId).emit('notifications', notifications);


    res.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});


// Handle new application submissions
app.post('/api/apply', async (req, res) => {
  const { userId, jobId, fullName } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO applications (user_id, job_id, full_name, status) VALUES ($1, $2, $3, 'new')`,
      [userId, jobId, fullName]
    );


    if (result.rowCount === 1) {
      io.emit('new-application', {
        message: `${fullName} has applied for job ID ${jobId}`
      });
      res.status(200).json({ message: 'Application submitted successfully' });
    } else {
      res.status(500).json({ error: 'Failed to submit application' });
    }
  } catch (error) {
    console.error('Error applying for job:', error);
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


app.use('/api/users', userRoutes);
app.use('/api/jobseekers', jobSeekerRoutes);
app.use('/api/employers', employerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applicants', applicantsRoutes);


// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


