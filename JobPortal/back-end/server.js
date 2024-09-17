const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const multer = require('multer')
const path = require('path');;
const pool = require('./db'); // Your database pool

// Use environment variables for secrets
require('dotenv').config();

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Enable CORS for your frontend with credentials
// Middleware for parsing cookies
app.use(cookieParser());

// Middleware for session management
app.use(session({
  secret: process.env.SESSION_SECRET || 'a2f4b9c0e5d', // Use environment variable for session secret
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: false, // Use secure cookies in production
    httpOnly: true, // Protect cookie from client-side JS
    maxAge: 60 * 60 * 1000 // 1 hour session expiration
  }
}));

// Import routes
const userRoutes = require('./routes/users');
const jobSeekerRoutes = require('./routes/jobseekers');
const employerRoutes = require('./routes/employers');
const jobRoutes = require('./routes/jobs');
const applicantsRoutes = require('./routes/applicants');

// Define routes

app.get('/api/skills', async (req, res) => {
  try {
    const skills = await pool.query('SELECT skill_id, skill_name FROM skills');
    res.json(skills.rows); // Array of objects { skill_id, skill_name }
  } catch (err) {
    console.error('Error fetching skills:', err);
    res.status(500).json({ error: 'Error fetching skills' });
  }
});

app.get('/api/jobtitles', async (req, res) => {
  try {
    // Query the job_titles table
    const jobTitles = await pool.query('SELECT jobtitle_id, job_title FROM job_titles');
    
    // Send the job titles as a JSON response
    res.json(jobTitles.rows); // Array of objects { id, job_title }
  } catch (err) {
    console.error('Error fetching job titles:', err);
    res.status(500).json({ error: 'Error fetching job titles' });
  }
});

app.get('/api/addresses', async (req, res) => {
  try {
    const Adresses = await pool.query('SELECT address_id, location FROM address');
    res.json(Adresses.rows);
  } catch (err) {
    console.error('Error fetching addresses:', err);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

app.get('/api/industries', async (req, res) => {
  try {
    const Industries = await pool.query('SELECT industry_id, industry_name FROM industries');
    res.json(Industries.rows);
  } catch (err) {
    console.error('Error fetching industries:', err);
    res.status(500).json({ error: 'Failed to fetch industries' });
  }
});

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
});

app.post('/api/upload-profile-picture/:userId', upload.single('profilePicture'), async (req, res) => {
  try {
    const userId = req.params.userId; // Get userId from URL parameters
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: 'File upload failed' });
    }

    const profilePictureUrl = `http://localhost:5000/uploads/${file.filename}`;

    // Log to verify file path and userId
    console.log('File uploaded:', profilePictureUrl);
    console.log('User ID:', userId);

    // Update profile_picture_url in the database
    const result = await pool.query(
      'UPDATE job_seekers SET profile_picture_url = $1 WHERE user_id = $2',
      [profilePictureUrl, userId]
    );

    // Check if the update was successful
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ profilePictureUrl });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
});




// Route to get profile picture URL by user ID
app.get('/api/profile-picture/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      'SELECT profile_picture_url FROM job_seekers WHERE user_id = $1',
      [userId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const profilePictureUrl = result.rows[0].profile_picture_url;
    res.json({ profilePictureUrl });
  } catch (err) {
    console.error('Error fetching profile picture URL:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/jobseekers', jobSeekerRoutes);
app.use('/api/employers', employerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applicants', applicantsRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
