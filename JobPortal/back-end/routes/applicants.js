const express = require('express');
const router = express.Router();
const pool = require('../db');
const { sendStatusUpdateEmail } = require('../mailer');


router.get('/applicantlist', async (req, res) => {
  const { jobTitle, selectedIndustry } = req.query; // Get query parameters

  try {
    // Base query with initial SELECT statement
    let query = `
      SELECT
        job_seekers.full_name,
        job_seekers.user_id,
        users.email,
        address.location,
        MAX(job_titles.job_title) AS latest_job_title,
        pp.profile_picture_url
      FROM job_seekers
      JOIN users ON job_seekers.user_id = users.user_id
      JOIN address ON job_seekers.address_id = address.address_id
      JOIN job_experience ON job_seekers.user_id = job_experience.user_id
      JOIN job_titles ON job_experience.jobtitle_id = job_titles.jobtitle_id
      JOIN profilepictures pp ON job_seekers.user_id = pp.user_id
    `;

    // Initialize an array to hold values for prepared statements
    const values = [];
    let whereClauses = []; // Array to hold WHERE clauses

    // Check if jobTitle is provided and add to query
    if (jobTitle) {
      whereClauses.push(`job_titles.job_title ILIKE $${values.length + 1}`);
      values.push(`%${jobTitle}%`);
    }

    // Check if selectedIndustry is provided and add to query
    if (selectedIndustry) {
      whereClauses.push(`job_seekers.industry_id = $${values.length + 1}`);
      values.push(selectedIndustry);
    }

    // If there are any WHERE clauses, add them to the query
    if (whereClauses.length > 0) {
      query += ' WHERE ' + whereClauses.join(' AND ');
    }

    // Grouping remains as it is
    query += `
      GROUP BY
        job_seekers.full_name,
        users.email,
        address.location,
        pp.profile_picture_url,
        job_seekers.user_id;
    `;

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/applicantprofile/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params; // Extract user_id from the request parameters


    // Query job seeker data
    const jobSeekerData = await pool.query(`
       SELECT 
        js.full_name, 
        u.email, 
        js.phone_number, 
        js.date_of_birth, 
        js.gender, 
        js.address_id, 
        a.location, 
        js.industry_id, 
        i.industry_name,
        pp.profile_picture_url
      FROM job_seekers js
      LEFT JOIN address a ON js.address_id = a.address_id
      LEFT JOIN industries i ON js.industry_id = i.industry_id
      LEFT JOIN profilepictures pp ON js.user_id = pp.user_id
	    JOIN users u ON js.user_id = u.user_id
      WHERE js.user_id = $1
    `, [user_id]);


    // Query job experience data
    const jobExperienceData = await pool.query(`
      SELECT je.jobtitle_id, jt.job_title, je.company, je.start_date, je.end_date, je.description
      FROM job_experience je
      JOIN job_titles jt ON je.jobtitle_id = jt.jobtitle_id
      WHERE je.user_id = $1;
    `, [user_id]);


    // Query skills data
    const skillsData = await pool.query(`
      SELECT s.skill_name
      FROM js_skills jss
      JOIN skills s ON jss.skill_id = s.skill_id
      WHERE jss.user_id = $1
    `, [user_id]);


    console.log('Job Seeker Data:', jobSeekerData.rows);
    console.log('Job Experience Data:', jobExperienceData.rows);
    console.log('Skills Data:', skillsData.rows);


    // Check if the job seeker data exists
    if (jobSeekerData.rows.length === 0) {
      return res.status(404).json({ message: 'Job seeker not found' });
    }


    // Process the fetched job experience data
    const jobExperiences = jobExperienceData.rows.map(exp => ({
      job_title: exp.job_title || 'Not Specified',
      company: exp.company || 'Not Specified',
      start_date: exp.start_date ? new Date(exp.start_date).toLocaleDateString() : 'Not Provided',
      end_date: exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Not Provided',
      description: exp.description || 'No Description'
    }));


    const jobSeeker = jobSeekerData.rows[0];
    const jobTitle = jobExperiences.length > 0 ? jobExperiences[0].job_title : 'Not Specified';


    // Send the response with all the data
    res.json({
      jobSeeker: {
        full_name: jobSeeker.full_name || 'Not Provided',
        email: jobSeeker.email || 'Not Provided',
        phone_number: jobSeeker.phone_number || 'Not Provided',
        date_of_birth: jobSeeker.date_of_birth ? new Date(jobSeeker.date_of_birth).toLocaleDateString() : null,
        gender: jobSeeker.gender || 'Not Specified',
        address: jobSeeker.location|| 'Address not provided',
        industry: jobSeeker.industry_name || 'Industry not provided',
        image: jobSeeker.profile_picture_url  || 'No Image',
        job_title: jobTitle
      },
      jobExperience: jobExperiences,
      skills: skillsData.rows.map(skill => skill.skill_name) // Extract skill names
    });
  } catch (error) {
    console.error('Error fetching job seeker data:', error.message);
    res.status(500).json({ error: 'Server error: Failed to fetch applicant profile data' });
  }
});

//fetching applied applicants
router.get('/appliedapplicants/:jobId', async (req, res) => {
  if (!req.session.user) {
    return res.status(403).json({ message: 'Not authenticated' });
  }

  const jobId = req.params.jobId;

  try {
    const result = await pool.query(
      `SELECT 
              a.application_id,
              a.job_id,
              a.user_id,
              js.full_name,
              u.email,
              js.phone_number,
              a.additional_info,
              a.status AS hiring_stage,
              a.date_applied,
              pp.profile_picture_url,
              j.job_title
      FROM applications a
      JOIN users u ON a.user_id = u.user_id
      JOIN job_seekers js ON u.user_id = js.user_id
      LEFT JOIN profilepictures pp ON a.user_id = pp.user_id
      JOIN joblistings jl ON a.job_id = jl.job_id
      JOIN job_titles j ON jl.jobtitle_id = j.jobtitle_id
      WHERE a.job_id = $1;`,
      [jobId]
    );

    res.json(result.rows);  // Always return the rows, even if it's an empty array.
  } catch (error) {
    console.error('Error fetching applicants:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// API to update application hiring stage and send notification
router.put('/applications/:userId/:jobId', async (req, res) => {
  const { userId, jobId } = req.params;
  const { hiringStage } = req.body;

  const allowedStages = ['Received', 'In review', 'For interview', 'Filled'];

  try {
    // Step 1: Validate input
    if (!userId || !hiringStage || !jobId) {
      return res.status(400).json({ error: 'Invalid input: userId, jobId, and hiringStage are required.' });
    }

    // Validate hiring stage
    if (!allowedStages.includes(hiringStage)) {
      return res.status(400).json({ error: `Invalid hiring stage: ${hiringStage}. Must be one of ${allowedStages.join(', ')}.` });
    }

    // Step 2: Update status and notif_status in the applications table
    let updateAppQuery = `
      UPDATE applications 
      SET status = $1, notif_status = $2 
      WHERE user_id = $3 AND job_id = $4
    `;
    
    const queryParams = [hiringStage, 'new', userId, jobId];
    const result = await pool.query(updateAppQuery, queryParams);

    // Check if the record was updated
    if (result.rowCount === 0) {
      return res.status(404).json({ error: `No record found for userId ${userId} and jobId ${jobId}.` });
    }

    // Step 3: If hiring stage is "Filled", update the datefilled in the joblistings table
    if (hiringStage === 'Filled') {
      await pool.query(
        'UPDATE joblistings SET datefilled = CURRENT_DATE WHERE job_id = $1',
        [jobId]
      );
    }

    // Step 4: Fetch job seeker email, name, and job title for the application
    const appResult = await pool.query(
      `SELECT u.email, js.full_name, jt.job_title
       FROM users u
       JOIN applications a ON u.user_id = a.user_id
       JOIN joblistings jl ON jl.job_id = a.job_id
       JOIN job_titles jt ON jt.jobtitle_id = jl.jobtitle_id
       JOIN job_seekers js ON js.user_id = u.user_id
       WHERE a.user_id = $1 AND a.job_id = $2`,
      [userId, jobId]
    );

    // Ensure the user and job were found
    if (appResult.rowCount === 0) {
      return res.status(404).json({ error: 'Job seeker or job details not found.' });
    }

    const jobSeekerEmail = appResult.rows[0].email;
    const jobSeekerName = appResult.rows[0].full_name;
    const jobTitle = appResult.rows[0].job_title;

    // Step 5: Send email notification to the job seeker
    await sendStatusUpdateEmail(jobSeekerEmail, jobSeekerName, jobTitle, hiringStage);

    // Step 6: Emit real-time notification via Socket.io if user is connected
    const notification = {
      message: `Your application for ${jobTitle} has been updated to ${hiringStage}`,
      job_id: jobId,
      status: hiringStage
    };

    if (io.sockets.sockets.has(userId)) {
      io.to(userId).emit('newNotification', notification);
    }

    // Step 7: Send success response
    res.status(200).json({ message: 'Hiring stage updated, email sent, and notification sent successfully.' });

  } catch (error) {
    // Log the error and send a server error response
    console.error('Error updating hiring stage and sending notifications:', error);
    res.status(500).json({ error: 'Failed to update hiring stage. Please try again later.' });
  }
});



module.exports = router;
