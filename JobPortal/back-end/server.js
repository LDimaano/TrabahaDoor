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
const applicationRoutes = require('./routes/applications');

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

app.get('/api/postedjobs', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        joblistings.job_id, 
        job_titles.job_title, 
        joblistings.industry, 
        joblistings.salaryrange
      FROM joblistings
      JOIN job_titles ON joblistings.jobtitle_id = job_titles.jobtitle_id
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching job listings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get job listing details including company info
app.get('/api/joblistings/:jobId', async (req, res) => {
  const { jobId } = req.params;
  const jobQuery = `
    SELECT jl.*, jt.job_title, ep.company_name
    FROM joblistings jl
    JOIN job_titles jt ON jl.Jobtitle_id = jt.jobtitle_id
    JOIN emp_profiles ep ON jl.user_id = ep.user_id
    WHERE jl.job_id = $1;
  `;
  const skillsQuery = `
    SELECT s.skill_name
    FROM job_skills js
    JOIN skills s ON js.skill_id = s.skill_id
    WHERE js.job_id = $1;
  `;
  
  try {
    const jobResult = await pool.query(jobQuery, [jobId]);
    const skillsResult = await pool.query(skillsQuery, [jobId]);
    
    if (jobResult.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    const jobData = jobResult.rows[0];
    const skills = skillsResult.rows.map(row => row.skill_name);
    
    res.json({ ...jobData, skills });
  } catch (error) {
    console.error('Error fetching job details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Use routes
app.use('/api/users', userRoutes);
app.use('/api/jobseekers', jobSeekerRoutes);
app.use('/api/employers', employerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
