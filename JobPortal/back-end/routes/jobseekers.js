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
          user_id, jobtitle_id, salary, company, location, start_date, end_date, description
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

router.get('/job-seeker/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Query job seeker data
    const jobSeekerData = await pool.query(`
      SELECT js.full_name, js.email, js.phone_number, js.date_of_birth, js.gender, js.address
      FROM job_seekers js
      WHERE js.user_id = $1
    `, [userId]);

    // Query job experience data
    const jobExperienceData = await pool.query(`
      SELECT je.jobtitle_id, jt.job_title, je.company, je.start_date, je.end_date, je.description
      FROM job_experience je
      JOIN job_titles jt ON je.jobtitle_id = jt.jobtitle_id
      WHERE je.user_id = $1;
    `, [userId]);

    // Query skills data
    const skillsData = await pool.query(`
      SELECT s.skill_name
      FROM js_skills jss
      JOIN skills s ON jss.skill_id = s.skill_id
      WHERE jss.user_id = $1
    `, [userId]);

    // Aggregate job experiences
    const jobExperiences = jobExperienceData.rows.map(exp => ({
      job_title: exp.job_title || 'Not Specified',
      company: exp.company || 'Not Specified',
      start_date: exp.start_date ? new Date(exp.start_date).toLocaleDateString() : 'Not Provided',
      end_date: exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Not Provided',
      description: exp.description || 'No Description'
    }));

    // Process job seeker data
    const jobSeeker = jobSeekerData.rows[0] || {};
    // Assuming job_title from the first job experience or a fallback value
    const jobTitle = jobExperiences.length > 0 ? jobExperiences[0].job_title : 'Not Specified';

    res.json({
      jobSeeker: {
        full_name: jobSeeker.full_name || 'Not Provided',
        email: jobSeeker.email || 'Not Provided',
        phone_number: jobSeeker.phone_number || 'Not Provided',
        date_of_birth: jobSeeker.date_of_birth ? new Date(jobSeeker.date_of_birth).toLocaleDateString() : null,
        gender: jobSeeker.gender || 'Not Specified',
        address: jobSeeker.address || 'Address not provided',
        job_title: jobTitle // Set the job title from the first job experience
      },
      jobExperience: jobExperiences, // Return all job experiences
      skills: skillsData.rows // Return all skills
    });
  } catch (error) {
    console.error('Error fetching job seeker data:', error.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
