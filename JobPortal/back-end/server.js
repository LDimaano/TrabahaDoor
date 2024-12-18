const express = require('express');
const http = require('http');
const session = require('express-session');
const sharedSession = require('socket.io-express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const pool = require('./db');
const { spawn } = require('child_process');
const bodyParser = require('body-parser');

const app = express();
const server = require('http').createServer(app);


// Middleware to parse JSON and cookies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const allowedOrigins = [
  'https://trabahadoor-pesosanjose.com',
  'https://trabahadoor-front-end.onrender.com',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        // Allow the request if origin is in the list or no origin (e.g., server-to-server requests)
        callback(null, true);
      } else {
        // Reject the request for unauthorized origins
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'a2f4b9c0e5d',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, 
    httpOnly: true,
    maxAge: 60 * 60 * 1000 // 1 hour session expiration
  }
}));

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || 'a2f4b9c0e5d',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, 
    httpOnly: true,
    maxAge: 60 * 60 * 1000 // 1 hour session expiration
  }
});

app.use(sessionMiddleware);

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'https://trabahadoor-pesosanjose.com',
      'https://trabahadoor-front-end.onrender.com',
    ];

    if (allowedOrigins.includes(origin) || !origin) {
      // Allow the request if origin is in the list or if it's a server-to-server request (no origin)
      callback(null, true);
    } else {
      // Reject the request for unauthorized origins
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  credentials: true,
};


app.use(cors(corsOptions));

// Initialize Socket.IO with CORS options
const io = require('socket.io')(server, {
  cors: {
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

// Use the session middleware with Socket.IO
io.use(sharedSession(sessionMiddleware, {
  autoSave: true
}));

io.on('connection', (socket) => {
  console.log('a user connected');
  const session = socket.handshake.session;
  console.log(session)

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



app.use('/documents', express.static(path.join(__dirname, 'documents')));

app.use(express.static(path.join(__dirname, '../front-end/build')));


// Set up multer to store files in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Utility function to get the content type based on file extension
const getContentType = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'pdf':
      return 'application/pdf';
    default:
      return null; 
  }
};

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Function to upload to S3
const uploadFileToS3 = async (fileBuffer, fileName) => {
  const contentType = getContentType(fileName);
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType, 
  });

  try {
    const response = await s3Client.send(command);
    console.log('File uploaded successfully:', response);
    return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file to S3');
  }
};


// Profile picture upload endpoint
app.post('/api/upload-profile-picture/:userId', upload.single('profilePicture'), async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'File upload failed. No file was provided.' });
    }

    // Upload file to S3
    const profilePictureUrl = await uploadFileToS3(file.buffer, file.originalname);

    // Insert the profile picture URL into the database
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

//update  profile picture endpoint
app.post('/api/update-profile-picture/:userId', upload.single('profilePicture'), async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'File upload failed. No file was provided.' });
    }

    // Upload file to S3
    const profilePictureUrl = await uploadFileToS3(file.buffer, file.originalname);

    // Update the profile picture URL into the database
    const result = await pool.query(
      'UPDATE profilepictures SET profile_picture_url = $1 WHERE user_id = $2',
      [profilePictureUrl, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'Profile picture updated successfully', profilePictureUrl });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
});


// Real-time notification route
app.get('/api/notifications/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

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
        emp_profiles.company_name,
        job_titles.job_title,
        industries.industry_name,
        job_skills.skill_id,
        skills.skill_name,
		    job_education.education_id,
		    educations.education_name,
        joblistings.salaryrange,
        joblistings.jobtype,
        pp.profile_picture_url
    FROM joblistings
    JOIN emp_profiles ON joblistings.user_id = emp_profiles.user_id
    JOIN job_titles ON joblistings.jobtitle_id = job_titles.jobtitle_id
    JOIN industries ON joblistings.industry_id = industries.industry_id
    JOIN job_skills ON joblistings.job_id = job_skills.job_id
    JOIN skills ON job_skills.skill_id = skills.skill_id
    LEFT JOIN job_education ON job_education.job_id = joblistings.job_id
    LEFT JOIN educations ON job_education.education_id = educations.education_id
    LEFT JOIN profilepictures pp ON joblistings.user_id = pp.user_id
    WHERE joblistings.status = 'Hiring';
    `);

    // Transform job data to include education name
    const jobData = res.rows.reduce((acc, row) => {
      const {
        job_id,
        company_name,
        job_title,
        industry_name,
        skill_name,
        education_name,
        salaryrange,
        jobtype,
        profile_picture_url,
      } = row;

      if (!acc[job_id]) {
        acc[job_id] = {
          job_id,
          company_name,
          job_title,
          industry_name,
          required_skills: [],
          salaryrange,
          jobtype,
          education_names: [], // Use an array for education names to include all of them
          profile_picture_url,
        };
      }

      if (skill_name) {
        acc[job_id].required_skills.push(skill_name);
      }

      if (education_name) {
        acc[job_id].education_names.push(education_name);
      }

      return acc;
    }, {});

    // Convert the object back to an array, since you may need the array format for further processing
    const transformedData = Object.values(jobData);

    return transformedData;
  } catch (err) {
    console.error('Error fetching job data:', err);
    throw err;
  }
};

const getSimilarJobSeekers = async (jobTitles) => {
  try {
    // Debugging log
    console.log('Received Job Titles:', JSON.stringify(jobTitles, null, 2));

    // Extract job titles from the input
    const titleNames = Array.isArray(jobTitles)
      ? jobTitles.map(title => (typeof title === 'string' ? title.trim() : title.job_title?.trim()))
      : [];

    // Filter out null or empty job titles
    const filteredJobTitles = titleNames.filter(title => title);

    if (filteredJobTitles.length === 0) {
      console.warn('No valid job titles provided.');
      return [];
    }

    // Fetch job seekers who have similar job titles and their applied jobs
    const res = await pool.query(
      `
      SELECT 
          js.user_id, 
          STRING_AGG(DISTINCT applications.job_id::text, ', ') AS job_ids,
          STRING_AGG(DISTINCT job_titles.job_title, ', ') AS job_titles
      FROM 
          js_skills 
      JOIN 
          job_seekers js ON js_skills.user_id = js.user_id
      LEFT JOIN 
          applications ON js.user_id = applications.user_id  
      JOIN 
          job_experience ON job_experience.user_id = js.user_id
      JOIN 
          job_titles ON job_titles.jobtitle_id = job_experience.jobtitle_id
      WHERE 
          job_titles.job_title ILIKE ANY ($1)
      GROUP BY 
          js.user_id;
      `,
      [filteredJobTitles.map(title => `%${title}%`)] // Format for ILIKE
    );

    // Process results and group similar job seekers with their applied jobs
    const similarJobSeekers = res.rows.map(row => ({
      user_id: row.user_id,
      applied_jobs: row.job_ids
        ? row.job_ids.split(', ').map(id => ({ job_id: id }))
        : [],
      job_titles: row.job_titles
        ? row.job_titles.split(', ')
        : []
    }));

    return similarJobSeekers;
  } catch (err) {
    console.error('Error fetching similar job seekers:', err);
    throw err;
  }
};


app.get('/api/getskills/:userId', async (req, res) => {
  const { userId } = req.params; 

  try {
    const skills = await pool.query(`
      SELECT skills.skill_name, js_skills.skill_id
      FROM js_skills
      JOIN skills ON js_skills.skill_id = skills.skill_id
      WHERE js_skills.user_id = $1`, [userId]);

    res.json(skills.rows); 
  } catch (err) {
    console.error('Error fetching skills:', err);
    res.status(500).json({ error: 'Error fetching skills' });
  }
});

app.get('/api/geteducation/:userId', async (req, res) => {
  const { userId } = req.params; 

  try {
    const educations = await pool.query(`
      SELECT 
        e.education_name, 
        je.education_id
      FROM js_education je
      JOIN educations e ON je.education_id = e.education_id
      WHERE je.user_id = $1
      `, [userId]);

    res.json(educations.rows); 
  } catch (err) {
    console.error('Error fetching education:', err);
    res.status(500).json({ error: 'Error fetching education' });
  }
});


app.post('/api/recommend', async (req, res) => {
  const {
    skills: jobSeekerSkills,        
    education: jobSeekerEducations, 
    industry: jobSeekerIndustry,    
    jobTitles: jobSeekerJobTitles,  
    salaryRange: jobSeekerSalary    
  } = req.body;
  
  try {
    // Fetch job data
    const jobData = await getJobData();

    // Fetch similar job seekers based on job titles
    const similarJobSeekers = await getSimilarJobSeekers(jobSeekerJobTitles);

    // Log details for debugging
    console.log('Job Data:', JSON.stringify(jobData, null, 2));
    console.log('Job Seeker Skills:', JSON.stringify(jobSeekerSkills, null, 2));
    console.log('Job Seeker Education:', JSON.stringify(jobSeekerEducations, null, 2));
    console.log('Job Seeker Industry:', jobSeekerIndustry);
    console.log('Job Seeker Job Titles:', JSON.stringify(jobSeekerJobTitles, null, 2));
    console.log('Job Seeker Salary Range:', JSON.stringify(jobSeekerSalary, null, 2));
    console.log('Similar Job Seekers:', JSON.stringify(similarJobSeekers, null, 2));

    // Spawn the Python process to generate recommendations
    const pythonProcess = spawn('python', [
      'python_scripts/recommendations.py', 
      JSON.stringify(jobData), 
      JSON.stringify(jobSeekerSkills), 
      JSON.stringify(jobSeekerEducations), 
      JSON.stringify(jobSeekerIndustry),  // Ensure industry is a string
      JSON.stringify(jobSeekerJobTitles),
      JSON.stringify(jobSeekerSalary),
      JSON.stringify(similarJobSeekers) // Pass similar job seekers to Python
    ]);

    // Log arguments passed to Python
    console.log('Arguments passed to Python:', [
      JSON.stringify(jobData), 
      JSON.stringify(jobSeekerSkills), 
      JSON.stringify(jobSeekerEducations), 
      JSON.stringify(jobSeekerIndustry),
      JSON.stringify(jobSeekerJobTitles),
      JSON.stringify(jobSeekerSalary),
      JSON.stringify(similarJobSeekers)
    ]);

    let pythonOutput = '';
    
    // Collect output from Python process
    pythonProcess.stdout.on('data', (data) => {
      pythonOutput += data.toString();
      console.log('Raw Python Output:', data.toString());
    });

    // Log any errors from Python process
    pythonProcess.stderr.on('data', (data) => {
      console.error('Python error:', data.toString());
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('Python process exited with code:', code);
        return res.status(500).send('An error occurred while processing your request.');
      }
      if (!pythonOutput) {
        console.error('Empty output from Python process');
        return res.status(500).send('No recommendations returned from Python.');
      }
      try {
        const recommendations = JSON.parse(pythonOutput);
        res.json({ recommendations });
      } catch (parseError) {
        console.error('Error parsing Python output:', parseError, 'Output:', pythonOutput);
        return res.status(500).send('Error processing recommendations.');
      }
    });
  } catch (error) {
    console.error('Error during recommendation processing:', error);
    return res.status(500).send('An error occurred while processing your request.');
  }
});

const getJobPostings = async (userId) => {
  const query = `
     SELECT 
        joblistings.job_id,
        job_titles.job_title,
        industries.industry_name,
        joblistings.salaryrange,
        joblistings.jobtype,
        skills.skill_name,
        educations.education_name,
        pp.profile_picture_url
    FROM joblistings
    JOIN job_titles ON joblistings.jobtitle_id = job_titles.jobtitle_id
    JOIN industries ON joblistings.industry_id = industries.industry_id
    JOIN job_skills ON joblistings.job_id = job_skills.job_id
    JOIN skills ON job_skills.skill_id = skills.skill_id
    LEFT JOIN profilepictures pp ON joblistings.user_id = pp.user_id
    LEFT JOIN job_education ON job_education.job_id = joblistings.job_id
    LEFT JOIN educations ON job_education.education_id = educations.education_id
    WHERE joblistings.user_id = $1
  `;

  const { rows } = await pool.query(query, [userId]);

  if (rows.length === 0) {
    console.log(`No job postings found for user ${userId}`);
    return [];
  }

  // Transform job data to include only the necessary information
  const joblistingData = rows.reduce((acc, row) => {
    const { job_id, job_title, industry_name, skill_name, education_name, salaryrange, jobtype, profile_picture_url } = row;

    // Create a job object if it doesn't already exist
    if (!acc[job_id]) {
      acc[job_id] = {
        job_id,
        job_title,
        industry_name,
        required_skills: [], 
        required_educations: [],
        salaryrange,
        jobtype,
        profile_picture_url
      };
    }

    // Add skill to the job's required skills
    if (skill_name) {
      acc[job_id].required_skills.push(skill_name);
    }

    // Add education to the job's required educations
    if (education_name) {
      acc[job_id].required_educations.push(education_name);
    }

    return acc;
  }, {});

  console.log(`Retrieved ${Object.keys(joblistingData).length} job postings for user ${userId}`);
  return Object.values(joblistingData); 
};


// Function to get applicants
const getApplicants = async () => {
  const query = `
          SELECT
          js.full_name,
          js.user_id,
          u.email,
          a.location,
          ARRAY_AGG(DISTINCT jt.job_title) AS job_titles,
          ARRAY_AGG(DISTINCT s.skill_name) AS skills,
          ARRAY_AGG(DISTINCT educations.education_name) AS js_education,
          pp.profile_picture_url,
          js.industry_id,
          i.industry_name AS industry
      FROM job_seekers js
      JOIN users u ON js.user_id = u.user_id
      JOIN address a ON js.address_id = a.address_id
      JOIN job_experience je ON js.user_id = je.user_id
      JOIN job_titles jt ON je.jobtitle_id = jt.jobtitle_id
      LEFT JOIN profilepictures pp ON js.user_id = pp.user_id
      LEFT JOIN js_education ON js_education.user_id = js.user_id
      LEFT JOIN educations ON js_education.education_id = educations.education_id
      JOIN js_skills jsk ON jsk.user_id = js.user_id
      JOIN skills s ON jsk.skill_id = s.skill_id
      JOIN industries i ON js.industry_id = i.industry_id
      GROUP BY 
          js.full_name,
          js.user_id,
          u.email,
          a.location,
          pp.profile_picture_url,
          js.industry_id,
          i.industry_name;
      `;
    
  const { rows } = await pool.query(query); 
  return rows; 
};

const getContactHistory = async (empUserId) => {
  const query = `
    SELECT 
      ec.js_user_id, 
      ec.emp_user_id,
      ind.industry_name,
      js.full_name, 
      u.email, 
      ARRAY_AGG(DISTINCT s.skill_name) AS skills,
      jt.job_title, 
      pp.profile_picture_url,
      ARRAY_AGG(DISTINCT jt_posted.job_title) AS empjoblistings 
    FROM emp_contact ec
    JOIN users u ON ec.js_user_id = u.user_id
    JOIN js_skills jk ON u.user_id = jk.user_id
    JOIN job_seekers js ON u.user_id = js.user_id
    JOIN skills s ON jk.skill_id = s.skill_id
    JOIN emp_profiles ep ON ep.user_id = ec.emp_user_id
    JOIN industries ind ON ep.industry_id = ind.industry_id
    JOIN joblistings jl ON jl.user_id = ec.emp_user_id
    JOIN job_titles jt ON jt.jobtitle_id = (SELECT jobtitle_id FROM job_experience WHERE user_id = u.user_id LIMIT 1)
    LEFT JOIN profilepictures pp ON pp.user_id = u.user_id
    LEFT JOIN joblistings jl_posted ON jl_posted.user_id = ec.emp_user_id 
    LEFT JOIN job_titles jt_posted ON jt_posted.jobtitle_id = jl_posted.jobtitle_id 
    WHERE ec.emp_user_id = $1  
    GROUP BY ec.js_user_id, js.full_name, u.email, jt.job_title, pp.profile_picture_url, ec.emp_user_id, ind.industry_name
    ORDER BY emp_user_id ASC;
  `;

  const { rows } = await pool.query(query, [empUserId]);  
  return rows;
};



app.post('/api/recommend-candidates', async (req, res) => {
  const { userId, jobTitle, selectedIndustry } = req.body; // Assume filters are passed in request

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required.' });
  }

  try {
    let jobPostings = await getJobPostings(userId); // Fetch job postings
    let applicants = await getApplicants(); // Fetch applicants

    // Apply job title and industry filter if provided
    if (jobTitle) {
      jobPostings = jobPostings.filter(post => post.job_title.toLowerCase().includes(jobTitle.toLowerCase()));
      applicants = applicants.filter(applicant => applicant.job_titles.some(title => title.toLowerCase().includes(jobTitle.toLowerCase())));
    }

    if (selectedIndustry) {
      jobPostings = jobPostings.filter(post => post.industry_name === selectedIndustry);
      applicants = applicants.filter(applicant => applicant.industry_name === selectedIndustry);
    }

    // Fetch contact history
    const contactHistory = await getContactHistory(userId);

    if (jobPostings.length === 0 || applicants.length === 0) {
      return res.status(404).json({ error: 'No job postings or applicants found.' });
    }

    const pythonProcess = spawn('python', ['python_scripts/recommend_candidates.py']);

    const dataToSend = JSON.stringify({
      job_postings: jobPostings,
      applicants: applicants,
      contact_history: contactHistory
    });

    pythonProcess.stdin.write(dataToSend + '\n');
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', (data) => {
      try {
        const recommendations = JSON.parse(data.toString().trim()); // Includes `match_percentage` from Python
        res.json({ recommendations }); // Send back to the client
      } catch (error) {
        console.error('Error parsing recommendations:', error);
        res.status(500).json({ error: 'Error parsing recommendations.' });
      }
    });
    
    pythonProcess.stderr.on('data', (error) => {
      console.error(`Python error: ${error.toString()}`);
      res.status(500).json({ error: 'Internal Server Error', details: error.toString() });
    });

    pythonProcess.on('exit', (code) => {
      if (code !== 0) {
        console.error(`Python process exited with code ${code}`);
        res.status(500).json({ error: 'Internal Server Error', details: 'Python script failed' });
      }
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//time to fill analysis
app.get('/api/timetofill', async (req, res) => {
  try {
    const jobListings = await pool.query(`
      SELECT
        i.industry_name, 
        jl.datecreated::date AS datecreated, 
        jl.datefilled::date AS datefilled
      FROM joblistings jl
      JOIN industries i ON i.industry_id = jl.industry_id
      WHERE jl.datefilled IS NOT NULL
    `);

    const python = spawn('python', ['python_scripts/time_to_fill_analysis.py']);

    // Send data to Python script
    python.stdin.write(JSON.stringify(jobListings.rows));
    python.stdin.end();

    // Capture output from Python
    let dataToSend = '';
    python.stdout.on('data', (data) => {
      dataToSend += data.toString();
    });

    python.on('close', (code) => {
      // Log the output from Python before sending the response
      console.log('Output from Python script:', dataToSend); // Log Python output
      try {
        const result = JSON.parse(dataToSend); // Try parsing the Python output
        res.json(result); // Send the parsed result to the client
      } catch (error) {
        console.error('Failed to parse Python output as JSON', error);
        res.status(500).json({ error: 'Failed to process the data' });
      }
    });
  } catch (err) {
    console.error('Error fetching job listings:', err.message); 
    res.status(500).send('Server Error');
  }
});

app.get('/api/allnotifications/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

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
      LEFT JOIN profilepictures pp ON js.user_id = pp.user_id
      WHERE u.user_id = $1 
      ORDER BY a.date_applied DESC;
        `,
      [userId]
    );

    const notifications = result.rows.map(row => ({
      message: `${row.full_name} has applied to be a ${row.job_title}`,
      job_id: row.job_id,
      jobId: row.job_id,
      status: row.status,
      date_applied: row.date_applied,
      profile_picture: row.profile_picture_url
    }));
    res.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});


// Endpoint to mark a notification as read
app.post('/api/notifications/mark-as-viewed/:userId', async (req, res) => {
  const { jobIds } = req.body;
  const { userId } = req.params;

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ message: 'Invalid user ID' });
  }

  if (!jobIds || jobIds.length === 0) {
    return res.status(400).json({ error: 'No job IDs provided' });
  }

  try {
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


app.get('/api/jsnotifications/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    const applicationResult = pool.query(
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

    const contactResult = pool.query(
      `
      SELECT
          c.contact_id, 
          e.company_name, 
          c.created_at,
          c.notifstatus
      FROM emp_contact c
      JOIN emp_profiles e ON c.emp_user_id = e.user_id
      WHERE c.js_user_id = $1 AND c.notifstatus = 'new' 
      ORDER BY c.created_at DESC;
      `,
      [userId]
    );

    const [applicationResultData, contactResultData] = await Promise.all([applicationResult, contactResult]);

    // Format application notifications
    const applicationNotifications = applicationResultData.rows.map(row => ({
      message: `Your application for ${row.job_title} has been updated to ${row.status}`,
      job_id: row.job_id,
      application_id: row.application_id,
      notif_status: row.notif_status,
      date_applied: row.date_applied,
    }));

    // Format employer contact notifications
    const contactNotifications = contactResultData.rows.map(row => ({
      message: `${row.company_name} wants to connect with you`,
      contact_id: row.contact_id,
      notif_status: row.notifstatus,
      created_at: row.created_at,
    }));

    // Combine both notification types
    const notifications = [...applicationNotifications, ...contactNotifications];

    // Log the fetched notifications
    console.log('Fetched notifications:', notifications);

    // Return all notifications
    res.json({ notifications });

  } catch (error) {
    console.error('Error fetching notifications for job seeker:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});


app.patch('/api/jsnotifications/mark-as-viewed/:userId', async (req, res) => {
  const { applicationIds, contactIds } = req.body; 
  const { userId } = req.params;
    
  if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

  // Validate that application IDs are provided
  if ((!applicationIds || applicationIds.length === 0) && (!contactIds || contactIds.length === 0)) {
    return res.status(400).json({ error: 'No application or contact IDs provided' });
  }

  try {
    // Update applications based on application IDs
    const applicationResult = await pool.query(
      `UPDATE applications
       SET notif_status = 'read'
       WHERE application_id = ANY($1) AND user_id = $2 AND notif_status = 'new';`,
      [applicationIds, userId]
    );

    console.log('Rows affected in applications:', applicationResult.rowCount);
    console.log('User ID from session:', userId);

    // Check if contactIds are provided and update emp_contact notifications as well
      const contactResult = await pool.query(
        `UPDATE emp_contact
         SET notifstatus = 'read'
         WHERE js_user_id = $1 AND notifstatus = 'new';`,
        [userId] 
      );

    res.status(200).json({ message: 'Notifications marked as viewed' });
  } catch (error) {
    console.error('Error marking notifications as viewed:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});


app.get('/api/alljsnotifications/:userId', async (req, res) => {
  const { userId } = req.params;
    
  if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

  try {
    // Fetch application-related notifications
    const applicationResult = pool.query(
      ` SELECT 
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
      LEFT JOIN profilepictures pp ON j.user_id = pp.user_id
      WHERE a.user_id = $1
      ORDER BY a.date_applied DESC;
      `,
      [userId]
    );

    // Fetch employer contact notifications
    const contactResult = pool.query(
      `
      SELECT
          c.contact_id, 
          e.company_name, 
          c.created_at,
          c.emp_user_id,
          c.notifstatus,
          pp.profile_picture_url
      FROM emp_contact c
      JOIN emp_profiles e ON c.emp_user_id = e.user_id
      LEFT JOIN profilepictures pp ON c.emp_user_id = pp.user_id
      WHERE c.js_user_id = $1 
      ORDER BY c.created_at DESC;
      `,
      [userId]
    );

    // Wait for both queries to complete
    const [applicationResultData, contactResultData] = await Promise.all([applicationResult, contactResult]);

    // Format application notifications
    const applicationNotifications = applicationResultData.rows.map(row => ({
      message: `Your application for ${row.job_title} has been updated to ${row.status}`,
      job_id: row.job_id,
      application_id: row.application_id,
      notif_status: row.notif_status,
      date_applied: row.date_applied,
      profile_picture: row.profile_picture_url
    }));

    // Format employer contact notifications
    const contactNotifications = contactResultData.rows.map(row => ({
      message: `${row.company_name} wants to connect with you`,
      contact_id: row.contact_id,
      userId: row.emp_user_id,
      notif_status: row.notifstatus,
      date_applied: row.created_at,
      profile_picture: row.profile_picture_url
    }));

    // Combine both notification types
    const notifications = [...applicationNotifications, ...contactNotifications];

    // Return all notifications
    res.json({ notifications });

  } catch (error) {
    console.error('Error fetching notifications for job seeker:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

// API endpoint to update application status
app.post('/api/applications/:applicationId/status', async (req, res) => {
  const applicationId = req.params.applicationId;
  const { status } = req.body; 
  const userId = req.session.user.user_id; 

  // Check if the employer's user ID is available in the session
  if (!userId) {
      return res.status(401).json({ error: 'Unauthorized: No user ID found in session' });
  }

  try {
      // Update the application status
      const result = await pool.query(
          `UPDATE applications
           SET status = $1
           WHERE application_id = $2 AND job_id IN (SELECT job_id FROM joblistings WHERE user_id = $3)`,
          [status, applicationId, userId]
      );

      if (result.rowCount === 0) {
          return res.status(404).json({ error: 'Application not found or unauthorized' });
      }

      // Fetch the job seeker’s user ID, email, job title, and full name
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

          // Emit notification to the job seeker using Socket.io
          const notification = {
              message: `${jobSeekerName}, Your application for ${jobTitle} has been updated to ${status}`,
              application_id: applicationId,
              status,
          };
          io.to(jobSeekerId).emit('newNotification', notification);

          // Send an email notification to the job seeker
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

// Route to get skills
app.get('/api/skills', async (req, res) => {
  try {
    const skills = await pool.query('SELECT skill_id, skill_name FROM skills Order by skill_name asc');
    res.json(skills.rows);
  } catch (err) {
    console.error('Error fetching skills:', err);
    res.status(500).json({ error: 'Error fetching skills' });
  }
});

// Route to get job titles
app.get('/api/jobtitles', async (req, res) => {
  try {
    const jobTitles = await pool.query('SELECT jobtitle_id, job_title FROM job_titles Order By job_title asc');
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
    const industries = await pool.query('SELECT industry_id, industry_name FROM industries Order by industry_name asc');
    res.json(industries.rows);
  } catch (err) {
    console.error('Error fetching industries:', err);
    res.status(500).json({ error: 'Failed to fetch industries' });
  }
});

// Route to get educations
app.get('/api/educations', async (req, res) => {
  try {
    const educations = await pool.query('SELECT education_id, education_name FROM educations');
    res.json(educations.rows);
  } catch (err) {
    console.error('Error fetching industries:', err);
    res.status(500).json({ error: 'Failed to fetch industries' });
  }
});


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
console.log('Socket URL:', process.env.REACT_APP_SOCKET_URL);
console.log('Database URL:', process.env.DATABASE_URL ); 
console.log('API URL:', process.env.REACT_APP_API_URL); 

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../front-end/build', 'index.html')); 
});

const PORT = process.env.PORT || 3000; 
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


module.exports = { io };
