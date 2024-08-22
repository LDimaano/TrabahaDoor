const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
app.use(express.json()); // Middleware to parse JSON
app.use(cors()); // Enable CORS

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

app.post('/register-jobseeker', async (req, res) => {
  const { firstName, lastName } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO job_seekers (first_name, last_name) VALUES ($1, $2) RETURNING id',
      [firstName, lastName]
    );
    res.status(200).json({ success: true, id: result.rows[0].id });
  } catch (error) {
    console.error('Error inserting into database:', error);
    res.status(500).json({ success: false, error: 'Database error' });
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
