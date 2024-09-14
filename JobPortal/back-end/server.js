const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
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
