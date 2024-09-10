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
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
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
app.post('/submit-form', async (req, res) => {
  const { email, password, usertype } = req.body;


  if (!email || !password || !usertype) {
    return res.status(400).json({ error: 'All fields are required' });
  }


  try {
    const query = 'INSERT INTO users (email, password, usertype) VALUES ($1, $2, $3) RETURNING user_id';
    const values = [email, password, usertype];
   
    const result = await pool.query(query, values);
    const userId = result.rows[0].user_id;


    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Error inserting data' });
  }
});


// Login route using session
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;


  try {
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(userQuery, [email]);


    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }


    const user = rows[0];


    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }


    // Set session data
    req.session.user = {
      id: user.user_id,
      email: user.email,
      usertype: user.usertype
    };


    const redirectUrl = user.usertype === 'jobseeker' ? '/home_jobseeker' : '/applicantlist';


    res.json({ redirectUrl });
  } catch (err) {
    console.error('Server error during login:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Route to fetch user info using session
app.get('/api/user-info', (req, res) => {
  if (!req.session.user) {
    return res.status(403).json({ message: 'Not authenticated' });
  }


  res.json({ email: req.session.user.email });
});


// Logout route to destroy session
app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Failed to log out' });
    }


    res.clearCookie('connect.sid'); // Clear session cookie
    res.json({ message: 'Logged out successfully' });
  });
});

app.post('/api/employer-profile', async (req, res) => {
  const {
    user_id,
    companyName,
    contactPerson,
    contactNumber,
    email,
    website,
    industry,
    companyAddress,
    companySize,
    foundedYear,
    description,
  } = req.body;
  // Log the request body to verify data
  console.log('Request body:', req.body);
  // Check that userId is provided
  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  try {
    // Insert the data into the profiles table and return the inserted row
    const newEmpProfile = await pool.query(
      `INSERT INTO emp_profiles (
        user_id, company_name, contact_person, contact_number, email, website, industry,
        company_address, company_size, founded_year, description
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *`,
      [
        user_id,
        companyName,
        contactPerson,
        contactNumber,
        email,
        website,
        industry,
        companyAddress,
        companySize,
        foundedYear,
        description,
      ]
    );
    // Send the newly created profile back as the response
    res.json(newEmpProfile.rows[0]);
  } catch (err) {
    console.error('Error inserting profile:', err.message);
    res.status(500).send('Server Error');
  }
});


app.post('/api/profile', async (req, res) => {
  const {
    fullName,
    phoneNumber,
    email,
    dateOfBirth,
    gender,
    address,
    jobTitle,
    salary,
    company,
    location,
    startDate,
    endDate,
    description,
    skills,
  } = req.body;


  try {
    // Insert the data into the profiles table
    const newProfile = await pool.query(
      `INSERT INTO job_seeker (
        full_name, phone_number, email, date_of_birth, gender, address,
        job_title, salary, company, location, start_date, end_date, description, skills
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      RETURNING *`,
      [fullName, phoneNumber, email, dateOfBirth, gender, address, jobTitle, salary, company, location, startDate, endDate, description, skills]
    );


    // Send the newly created profile back as the response
    res.json(newProfile.rows[0]);
  } catch (err) {
    console.error('Error inserting profile:', err.message);
    res.status(500).send('Server Error');
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
