const express = require('express');
const router = express.Router();
const pool = require('../db');


router.post('/joblistings', async (req, res) => {
  const {
    user_id,
    jobtitle_id,
    industry_id,
    SalaryRange,
    JobType,
    Responsibilities,
    JobDescription,
    Qualifications,
    skills // Array of skill IDs
  } = req.body;


  // Log the request body to verify data
  console.log('Received request body:', req.body);


  // Check that user_id is provided
  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }


  try {
    // Insert the job listing data into the joblistings table
    const newJobResult = await pool.query(
      `INSERT INTO joblistings (
        user_id, jobtitle_id, industry_id, salaryrange, jobtype, responsibilities, jobdescription, qualifications
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING job_id`,
      [user_id, jobtitle_id, industry_id, SalaryRange, JobType, Responsibilities, JobDescription, Qualifications]
    );


    const job_id = newJobResult.rows[0].job_id;


    // Insert skills data
    for (const skill_id of skills) {
      await pool.query(
        `INSERT INTO job_skills (
          job_id, skill_id, user_id
        )
        VALUES ($1, $2, $3)`,
        [job_id, skill_id, user_id]
      );
    }


    // Send a successful response
    res.json({ message: 'Job posted successfully', job_id });
  } catch (err) {
    // Log error message
    console.error('Error posting job:', err.message);
    res.status(500).send('Server Error');
  }
});


router.get('/postedjobs', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        joblistings.job_id,
        job_titles.job_title,
        industries.industry_name,
        joblistings.salaryrange,
        joblistings.jobtype,
        pp.profile_picture_url
      FROM joblistings
      JOIN job_titles ON joblistings.jobtitle_id = job_titles.jobtitle_id
      JOIN industries ON joblistings.industry_id = industries.industry_id
      JOIN profilepictures pp ON joblistings.user_id = pp.user_id
    `);
   
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching job listings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get('/joblistings/:jobId', async (req, res) => {
  const { jobId } = req.params;
  console.log(`Fetching job details for Job ID: ${jobId}`);


  const jobQuery = `
    SELECT jl.*, jt.job_title, ep.company_name, i.industry_name, pp.profile_picture_url
    FROM joblistings jl
    JOIN job_titles jt ON jl.Jobtitle_id = jt.jobtitle_id
    JOIN emp_profiles ep ON jl.user_id = ep.user_id
    JOIN industries i ON jl.industry_id = i.industry_id
    JOIN profilepictures pp ON jl.user_id = pp.user_id
    WHERE jl.job_id = $1;
  `;


  const skillsQuery = `
    SELECT s.skill_name
    FROM job_skills js
    JOIN skills s ON js.skill_id = s.skill_id
    WHERE js.job_id = $1;
  `;


  try {
    console.log('Executing job query...');
    const jobResult = await pool.query(jobQuery, [jobId]);
    console.log('Job query result:', jobResult.rows);


    if (jobResult.rows.length === 0) {
      console.warn(`Job not found for Job ID: ${jobId}`);
      return res.status(404).json({ error: 'Job not found' });
    }


    console.log('Executing skills query...');
    const skillsResult = await pool.query(skillsQuery, [jobId]);
    console.log('Skills query result:', skillsResult.rows);


    const jobData = jobResult.rows[0];
    const skills = skillsResult.rows.map(row => row.skill_name);
   
    console.log('Responding with job data and skills:', { ...jobData, skills });
    res.json({ ...jobData, skills });
  } catch (error) {
    console.error('Error fetching job details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// GET endpoint to fetch job listing details including company info
router.get('/job-seeker/:userId', async (req, res) => {
  const { userId } = req.params;


  // SQL query to fetch job seeker details
  const jobSeekerQuery = `
    SELECT js.full_name, js.email, js.phone_number, je.job_title, je.start_date, je.end_date, je_description
    FROM job_seekers js
    LEFT JOIN job_experience je ON js.user_id = je.user_id
    WHERE js.user_id = $1;
  `;


  // SQL query to fetch skills
  const skillsQuery = `
    SELECT s.skill_name
    FROM js_skills jss
    JOIN skills s ON jss.skill_id = s.skill_id
    WHERE jss.user_id = $1;
  `;


  try {
    // Execute queries
    const jobSeekerResult = await pool.query(jobSeekerQuery, [userId]);
    const skillsResult = await pool.query(skillsQuery, [userId]);


    // Check if job seeker exists
    if (jobSeekerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Job seeker not found' });
    }


    // Extract job seeker data
    const jobSeekerData = jobSeekerResult.rows[0];
    const skills = skillsResult.rows.map(row => row.skill_name);


    // Calculate work experience in years
    const calculateWorkExperience = (experiences) => {
      const totalYears = experiences.reduce((total, exp) => {
        const startYear = new Date(exp.start_date).getFullYear();
        const endYear = exp.end_date ? new Date(exp.end_date).getFullYear() : new Date().getFullYear();
        return total + (endYear - startYear);
      }, 0);
      return `${totalYears} Years`;
    };


    // Aggregate job experience
    const jobExperience = jobSeekerResult.rows.map(row => ({
      job_title: row.job_title,
      start_date: row.start_date,
      end_date: row.end_date
    }));


    res.json({
      jobSeeker: {
        ...jobSeekerData,
        jobExperience: jobExperience,
        workExperience: calculateWorkExperience(jobExperience),
      },
      skills
    });
  } catch (error) {
    console.error('Error fetching job seeker details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});




router.post('/applications', async (req, res) => {
  const { jobId, user_id, fullName, email, phoneNumber, additionalInfo } = req.body;


  try {
    const result = await pool.query(
      `INSERT INTO applications (job_id, user_id, full_name, email, phone_number, additional_info, status)
      VALUES ($1, $2, $3, $4, $5, $6, 'new')`, // Set status to 'new'
      [jobId, user_id, fullName, email, phoneNumber, additionalInfo]
    );


    if (result.rowCount === 1) {
      // Emit a WebSocket event for the new application
      io.emit('new-application', {
        message: `${fullName} has applied for job ID ${jobId}`
      });
      res.status(201).json({ message: 'Application submitted successfully!' });
    } else {
      res.status(500).json({ error: 'Failed to submit application' });
    }
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'An error occurred while submitting the application', details: error.message });
  }
});


module.exports = router;


