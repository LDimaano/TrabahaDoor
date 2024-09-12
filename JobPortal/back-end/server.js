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

app.post('/api/profile', async (req, res) => {
  const {
    user_id, // This should be the user_id from the users table
    fullName,
    phoneNumber,
    email,
    dateOfBirth,
    gender,
    address,
    experience, // Array of experience objects
    skills, // Array of skill values
  } = req.body;

  // Log the request body to verify data
  console.log('Received request body:', req.body);

  // Check that user_id is provided
  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Insert the profile data into the job_seekers table
    const newProfileResult = await pool.query(
      `INSERT INTO job_seekers (
        user_id, full_name, phone_number, email, date_of_birth, gender, address
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING jsid`,
      [user_id, fullName, phoneNumber, email, dateOfBirth, gender, address]
    );

    const profileId = newProfileResult.rows[0].jsid;
    // Insert experience data
    for (const exp of experience) {
      await pool.query(
        `INSERT INTO job_experience (
          user_id, job_title, salary, company, location, start_date, end_date, description
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [user_id, exp.jobTitle, exp.salary, exp.company, exp.location, exp.startDate, exp.endDate, exp.description]
      );
    }
    // Insert skills data
    for (const skill of skills) {
      await pool.query(
        `INSERT INTO js_skills (
          user_id, skill_id
        )
        VALUES ($1, $2)`,
        [user_id, skill.skill_id]
      );
    }
    // Send a successful response
    res.json({ message: 'Profile created successfully', profileId });
  } catch (err) {
    // Log error message
    console.error('Error inserting profile:', err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/skills', async (req, res) => {
  try {
    const skills = await pool.query('SELECT skill_id, skill_name FROM skills');
    res.json(skills.rows); // Array of objects { skill_id, skill_name }
  } catch (err) {
    console.error('Error fetching skills:', err);
    res.status(500).json({ error: 'Error fetching skills' });
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
      user_id: user.user_id,
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


app.get('/api/user-info', async (req, res) => {
  console.log('Session data:', req.session);
  if (!req.session.user) {
    return res.status(403).json({ message: 'Not authenticated' });
  }

  const userId = req.session.user.user_id;
  console.log('User ID from session:', userId);

  try {
    const result = await pool.query(
      'SELECT full_name FROM job_seekers WHERE user_id = $1',
      [userId]
    );

    console.log('Database query result:', result.rows);

    if (result.rows.length > 0) {
      const fullName = result.rows[0].full_name;
      res.json({ fullName });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching full name:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


app.get('/api/user-infoemp', async (req, res) => {
  console.log('Session data:', req.session);

  if (!req.session.user) {
    return res.status(403).json({ message: 'Not authenticated' });
  }

  const userId = req.session.user.user_id;
  console.log('User ID from session:', userId);

  try {
    // Use a join to fetch company_name from emp_profiles and email from users
    const result = await pool.query(
      `SELECT emp_profiles.company_name, users.email 
       FROM emp_profiles 
       JOIN users ON emp_profiles.user_id = users.user_id 
       WHERE emp_profiles.user_id = $1`,
      [userId]
    );

    console.log('Database query result:', result.rows);

    if (result.rows.length > 0) {
      const { company_name, email } = result.rows[0]; // Destructure company_name and email
      res.json({ company_name, email }); // Send both company_name and email in the response
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching company info:', error);
    res.status(500).json({ message: 'Server error' });
  }
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

//joblistings
app.post('/api/joblistings', async (req, res) => {
  const {
    user_id,
    JobTitle,
    Industry,
    SalaryRange,
    Skills,
    JobType,
    Responsibilities,
    JobDescription,
    Qualifications
  } = req.body;

  console.log("Received request body: ", req.body)

  if (!user_id){
    return res.status(400).json({error: 'User ID is required'})
  }

  try {
    const result = await pool.query(
      `INSERT INTO joblistings (
        user_id, JobTitle, Industry, SalaryRange, Skills, JobType, Responsibilities, JobDescription, Qualifications
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        user_id,
        JobTitle,
        Industry,
        SalaryRange,
        Skills,
        JobType,
        Responsibilities,
        JobDescription,
        Qualifications
      ]
    );

    res.status(201).json({
      message: 'Job posted successfully!',
      job: result.rows[0]
    });
  } catch (error) {
    console.error('Error posting job:', error);
    res.status(500).json({
      message: 'Failed to post job. Please try again.',
      error: error.message
    });
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
