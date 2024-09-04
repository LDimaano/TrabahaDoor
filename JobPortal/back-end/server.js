const express = require('express');
const cors = require('cors');
const pool = require('./db');
const jwt = require('jsonwebtoken'); 

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.use(cors()); // Enable CORS

// Secret key for JWT
const JWT_SECRET = '7f3e1d7c-7a1b-4c4b-8b2d-e8d2aef55f35';

// Import routes
const userRoutes = require('./routes/users');
const jobSeekerRoutes = require('./routes/jobseekers');
const employerRoutes = require('./routes/employers');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');

// Define routes
app.post('/submit-form', async (req, res) => {
  const { email, password, usertype } = req.body;

  console.log('Received data:', { email, password, usertype }); // Check values here

  if (!email || !password || !usertype) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const query = 'INSERT INTO users (email, password, usertype) VALUES ($1, $2, $3)';
    const values = [email, password, usertype];
    
    await pool.query(query, values);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Error inserting data' });
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
      `INSERT INTO profiles (
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

app.post('/api/employer-profile', async (req, res) => {
  const {
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
    logo
  } = req.body;

  try {
    // Insert the data into the profiles table and return the inserted row
    const newEmpProfile = await pool.query(
      `INSERT INTO emp_profiles (
        company_name, contact_person, contact_number, email, website, industry, 
        company_address, company_size, founded_year, description
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
      RETURNING *`,
      [
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
        // logo ? logo.filename : null
      ]
    );

    // Send the newly created profile back as the response
    res.json(newEmpProfile.rows[0]);
  } catch (err) {
    console.error('Error inserting profile:', err.message);
    res.status(500).send('Server Error');
  }
});

app.post('/api/student-profile', async (req, res) => {
  const {
    fullName,
    phoneNumber,
    email,
    dateOfBirth,
    gender,
    address,
    school,
    degree,
    industry,
    internship,
    startDate,
    endDate,
    description,
    skills,
  } = req.body;

  try {
    // Insert the data into the profiles table
    const newProfile = await pool.query(
      `INSERT INTO stu_profiles (
        full_name, phone_number, email, date_of_birth, gender, address, 
        school, degree, industry, internship, start_date, end_date, description, skills
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) 
      RETURNING *`,
      [fullName, phoneNumber, email, dateOfBirth, gender, address, school, degree, industry, internship, startDate, endDate, description, skills]
    );

    // Send the newly created profile back as the response
    res.json(newProfile.rows[0]);
  } catch (err) {
    console.error('Error inserting profile:', err.message);
    res.status(500).send('Server Error');
  }
});



app.post('/register-jobseeker', async (req, res) => {
  const { firstName, lastName, location, jobTitle, workType, salary, industry, company } = req.body;
  
  try {
    await pool.query(
      'INSERT INTO job_seekers (first_name, last_name, location, job_title, work_type, salary, industry, company) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
      [firstName, lastName, location, jobTitle, workType, salary, industry, company]
    );
    res.status(201).json({ message: 'Jobseeker registered successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


app.post('/register-student', async (req, res) => {
  const { firstName, lastName, location, school, yearLevel, specialization } = req.body;

  try {
    await pool.query(
      'INSERT INTO students (first_name, last_name, location, school, year_level, specialization) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [firstName, lastName, location, school, yearLevel, specialization]
    );
    res.status(201).json({ message: 'Jobseeker registered successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

//employer
app.post('/employer_registration', async (req, res) => {
  const { companyName, industry, location, dateFounded, description, jobTitle } = req.body;
  try {
    await pool.query(
      'INSERT INTO employer (companyname, location, industry, datefounded, description, jobtitle) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [companyName, industry, location, dateFounded, description, jobTitle]
    );
    res.status(201).json({ message: 'employer registered successfully' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

//Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch user from the database by email
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(userQuery, [email]);

    // Check if user exists
    if (rows.length === 0) {
      console.log('User not found'); // Debugging log
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];

    // Compare plain text passwords
    if (password !== user.password) {
      console.log('Password does not match'); // Debugging log
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT and decide redirection based on usertype
    const token = jwt.sign({ id: user.id, usertype: user.usertype }, JWT_SECRET, { expiresIn: '1h' });
    const redirectUrl = user.usertype === 'jobseeker' ? '/home_jobseeker' : '/joblisting';

    console.log('Login successful, redirecting to:', redirectUrl); // Debugging log
    res.json({ token, redirectUrl });
  } catch (err) {
    console.error('Server error during login:', err);
    res.status(500).json({ message: 'Server error' });
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
