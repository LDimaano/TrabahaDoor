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
      `
       SELECT emp_profiles.company_name,
        users.email,
        emp_profiles.contact_person,
        pp.profile_picture_url
       FROM emp_profiles
       JOIN users ON emp_profiles.user_id = users.user_id
       JOIN profilepictures pp ON users.user_id = pp.user_id
       WHERE emp_profiles.user_id = $1
       `,
      [userId]
    );


    console.log('Database query result:', result.rows);


    if (result.rows.length > 0) {
      const { company_name, email, contact_person, profile_picture_url } = result.rows[0]; // Destructure company_name and email
      res.json({ company_name, email, contact_person, profile_picture_url }); // Send both company_name and email in the response
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching company info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/employerprofile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;


    const EmployerData = await pool.query(`
      SELECT
        e.company_name,
        e.contact_person,
        e.contact_number,
        u.email,
        e.website,
        i.industry_name,
        e.company_address,
        e.company_size,
        e.founded_year,
        e.description,
        pp.profile_picture_url
      FROM emp_profiles e
      LEFT JOIN users u ON e.user_id = u.user_id
      LEFT JOIN industries i ON e.industry_id = i.industry_id
      LEFT JOIN profilepictures pp ON e.user_id = pp.user_id
      WHERE e.user_id = $1


    `, [userId]);


    console.log('Fetched employer data:', EmployerData.rows);
   
    const employer = EmployerData.rows[0] || {};
   
    res.json({
      employer: {
        company_name:  employer.company_name || 'Not Provided',
        contact_person: employer.contact_person || 'Not Provided',
        contact_number: employer.contact_number || 'Not Provided',
        email: employer.email || 'Not Provided',
        website: employer.website || 'Not Provided',
        industry: employer.industry_name  || 'Not Provided',
        company_address: employer.company_address || 'Not Provided',
        company_size: employer.company_size || 'Not Provided',
        foundedYear: employer.founded_year || 'Not Provided',
        description:  employer.description || 'Not Provided',
        profilePicture: employer.profile_picture_url || 'No Image',
      },
    });
  } catch (error) {
    console.error('Error fetching employer data:', error.message);
    res.status(500).send('Server error');
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
      `
      SELECT
          jl.datecreated,
          jt.job_title,
      jl.job_id
       FROM
          joblistings jl
       JOIN
          job_titles jt
       ON
          jl.jobtitle_id = jt.jobtitle_id
       WHERE
          jl.user_id = $1
          `,
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


router.get('/notifications', async (req, res) => {
  const userId = req.session.userId; // Access userId from session storage


  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: No user ID found in session' });
  }


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


    const notifications = result.rows.map(row => ({
      message: `${row.full_name} has applied to be a ${row.job_title}`,
      job_id: row.job_id,
      status: row.status,
    }));


    const newJobIds = notifications.filter(n => n.status === 'new').map(n => n.job_id);
    const newCount = newJobIds.length; // Count of new notifications


    if (newJobIds.length > 0) {
      const formattedJobIds = newJobIds.map(id => `'${id}'`).join(', ');
      await pool.query(
        `UPDATE applications
         SET status = 'viewed'
         WHERE status = 'new' AND job_id IN (${formattedJobIds})`
      );


      // Emit real-time notifications to the employer's room
      io.to(`user_${userId}`).emit('newNotification', { notifications, newCount });
    }


    res.json({ notifications, newCount });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});




module.exports = router;
