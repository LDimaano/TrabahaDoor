const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/profile', async (req, res) => {
  const {
    user_id, // This should be the user_id from the users table
    fullName,
    phoneNumber,
    email,
    dateOfBirth,
    gender,
    address,
    experience, // Array of experience objects
    skills // Array of skill IDs or skill objects containing skill_id
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

    // Insert skills data - assuming skills array contains skill_id directly
    for (const skill_id of skills) {
      await pool.query(
        `INSERT INTO js_skills (
          user_id, skill_id
        )
        VALUES ($1, $2)`,
        [user_id, skill_id]
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

// GET route to fetch user full name based on session user_id
router.get('/user-info', async (req, res) => {
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


module.exports = router;
