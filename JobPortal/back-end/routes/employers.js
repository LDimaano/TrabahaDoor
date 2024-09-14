const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/employer-profile', async (req, res) => {
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

  // Check that user_id is provided
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

router.get('/user-infoemp', async (req, res) => {
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

module.exports = router;
