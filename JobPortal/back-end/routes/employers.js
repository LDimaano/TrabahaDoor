const express = require('express');
const router = express.Router();
const pool = require('../db');


router.post('/employer-profile', async (req, res) => {
  const {
    user_id,
    companyName,
    contactPerson,
    contactNumber,
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
        user_id, company_name, contact_person, contact_number, website, industry_id,
        company_address, company_size, founded_year, description
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)     RETURNING *`,
      [
        user_id,
        companyName,
        contactPerson,
        contactNumber,
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


// Endpoint to update application status
router.put('/applications/:userId/:jobId', async (req, res) => {
  const { userId, jobId } = req.params;
  const { hiringStage } = req.body;

  try {
    const result = await pool.query(
      `UPDATE applications
       SET status = $1
       WHERE user_id = $2 AND job_id = $3
       RETURNING *`,
      [hiringStage, userId, jobId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    // Emit notification to job seeker
    const application = result.rows[0];
    const jobSeekerId = application.user_id; // This should be the job seeker's user ID

    // Fetch job title for notification
    const jobResult = await pool.query(
      `SELECT jt.job_title, u.full_name 
       FROM joblistings j 
       JOIN job_titles jt ON j.jobtitle_id = jt.jobtitle_id 
       JOIN users u ON j.user_id = u.user_id 
       WHERE j.job_id = $1`,
      [jobId]
    );

    const jobTitle = jobResult.rows[0]?.job_title || 'your application';
    const fullName = jobResult.rows[0]?.full_name || 'Employer';

    // Emit notification to the job seeker
    io.to(`user_${jobSeekerId}`).emit('applicationUpdate', {
      message: `${fullName} has updated the status of your application for the position of ${jobTitle}.`,
      status: hiringStage,
      job_id: jobId,
    });

    res.json({ message: 'Application status updated', application });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Server Error' });
  }
});

router.get('/jsemployerprofile/:userId', async (req, res) => {
  const { userId } = req.params;

  // Log the entire request object to debug why userId is undefined
  console.log('Request Params:', req.params);
  console.log('Received userId from params:', userId);
  
  try {
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
        company_name: employer.company_name || 'Not Provided',
        contact_person: employer.contact_person || 'Not Provided',
        contact_number: employer.contact_number || 'Not Provided',
        email: employer.email || 'Not Provided',
        website: employer.website || 'Not Provided',
        industry: employer.industry_name || 'Not Provided',
        company_address: employer.company_address || 'Not Provided',
        company_size: employer.company_size || 'Not Provided',
        foundedYear: employer.founded_year || 'Not Provided',
        description: employer.description || 'Not Provided',
        profilePicture: employer.profile_picture_url || 'No Image',
      },
    });
  } catch (error) {
    console.error('Error fetching employer data:', error.message);
    res.status(500).send('Server error');
  }
});



module.exports = router;
