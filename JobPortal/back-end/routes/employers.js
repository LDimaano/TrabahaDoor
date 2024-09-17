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
    industry_id,
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
        user_id, company_name, contact_person, contact_number, email, website, industry_id,
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
        industry_id,
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
      `SELECT emp_profiles.company_name, users.email, emp_profiles.contact_person
       FROM emp_profiles 
       JOIN users ON emp_profiles.user_id = users.user_id 
       WHERE emp_profiles.user_id = $1`,
      [userId]
    );

    console.log('Database query result:', result.rows);

    if (result.rows.length > 0) {
      const { company_name, email, contact_person } = result.rows[0]; // Destructure company_name and email
      res.json({ company_name, email, contact_person }); // Send both company_name and email in the response
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching company info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

//show joblisting
router.get('/joblistings', async (req, res) => {
  console.log('Session data:', req.session);

  if (!req.session.user) {
    return res.status(403).json({ message: 'Not authenticated' });
  }

  const userId = req.session.user.user_id;
  console.log('User ID from session:', userId);

  try {
    const result = await pool.query(
      `SELECT 
          jl.datecreated,
          jt.job_title
       FROM 
          joblistings jl
       JOIN 
          job_titles jt
       ON 
          jl.jobtitle_id = jt.jobtitle_id
       WHERE 
          jl.user_id = $1`,
      [userId]
    );

    console.log('Database query result:', result.rows);

    if (result.rows.length > 0) {
      res.json(result.rows);
    } else {
      res.status(404).json({ message: 'No job listings found for this user' });
    }
  } catch (error) {
    console.error('Error fetching job listings:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/notifications/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query(
      `SELECT a.full_name, jt.job_title, j.job_id, a.status
       FROM applications a
       JOIN joblistings j ON a.job_id = j.job_id
       JOIN job_titles jt ON j.jobtitle_id = jt.jobtitle_id
       JOIN users u ON j.user_id = u.user_id
       WHERE u.user_id = $1
       ORDER BY a.date_applied DESC;`,
      [userId]
    );

    console.log('Query Result:', result.rows); // Debugging: Check if query returns rows

    // Create notifications with both new and viewed statuses
    const notifications = result.rows.map(row => ({
      message: `${row.full_name} has applied to be a ${row.job_title}`,
      job_id: row.job_id,
      status: row.status, // Include the notification status
    }));

    console.log('Notifications:', notifications); // Debugging: Check if notifications are created

    // Update the status of new notifications only
    const newJobIds = notifications.filter(n => n.status === 'new').map(n => n.job_id);
    if (newJobIds.length > 0) {
      const formattedJobIds = newJobIds.map(id => `'${id}'`).join(', ');
      await pool.query(
        `UPDATE applications
         SET status = 'viewed'
         WHERE status = 'new' AND job_id IN (${formattedJobIds})`
      );
    }

    res.json({ notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});



module.exports = router;
