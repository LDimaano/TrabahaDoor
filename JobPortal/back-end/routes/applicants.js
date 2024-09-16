const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/applicantlist', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        job_seekers.jsid,
        job_seekers.user_id,
        job_seekers.full_name, 
        users.email, 
        address.location
      FROM job_seekers
      JOIN users ON job_seekers.user_id = users.user_id
	  JOIN address ON job_seekers.address_id = address.address_id
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching job listings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/applicantprofile/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params; // Extract user_id from the request parameters

    // Query job seeker data
    const jobSeekerData = await pool.query(`
      SELECT js.full_name, js.email, js.phone_number, js.date_of_birth, js.gender, address.location
      FROM job_seekers js
      JOIN address ON js.address_id = address.address_id
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
        address: jobSeeker.address || 'Address not provided',
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


module.exports = router;
