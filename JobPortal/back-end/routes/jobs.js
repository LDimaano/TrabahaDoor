const express = require('express');
const router = express.Router();
const pool = require('../db');
const { sendApplicationEmail } = require('../mailer');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

// Method to set io instance
let io; // Declare io variable outside to be accessible
32
router.setIo = (_io) => {
  io = _io; // Set the io instance
};


const getContentType = (fileName) => {
  const extension = fileName.split('.').pop().toLowerCase();
  switch (extension) {
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'png':
      return 'image/png';
    case 'pdf':
      return 'application/pdf';
    default:
      return null; // Return null for unsupported types
  }
};

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const uploadFileToS3 = async (fileBuffer, fileName) => {
  const contentType = getContentType(fileName); // Make sure this function is defined to return the correct content type
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: fileBuffer,
    ContentType: contentType,
  });

  try {
    const response = await s3Client.send(command);
    console.log('File uploaded successfully:', response);
    return `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;
  } catch (error) {
    console.error('Error uploading file:', error);
    throw new Error('Failed to upload file to S3');
  }
};

const storage = multer.memoryStorage();
const uploadDocuments = multer({ storage }).fields([
  { name: 'resume', maxCount: 1 },
]);

router.use('/resume', express.static(path.join(__dirname, '..', 'resume')));


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

  console.log('Received request body:', req.body);

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const newJobResult = await pool.query(
      `INSERT INTO joblistings (
        user_id, jobtitle_id, industry_id, salaryrange, jobtype, responsibilities, jobdescription, qualifications
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING job_id`,
      [user_id, jobtitle_id, industry_id, SalaryRange, JobType, Responsibilities, JobDescription, Qualifications]
    );

    const job_id = newJobResult.rows[0].job_id;

    for (const skill_id of skills) {
      await pool.query(
        `INSERT INTO job_skills (
          job_id, skill_id, user_id
        )
        VALUES ($1, $2, $3)`,
        [job_id, skill_id, user_id]
      );
    }

    res.json({ message: 'Job posted successfully', job_id });
  } catch (err) {
    console.error('Error posting job:', err.message);
    res.status(500).send('Server Error');
  }
});

const getEmployerEmailByJobId = async (jobId) => {
  const result = await pool.query(
      ` SELECT
		     u.email,
        jt.job_title,
        js.full_name
      FROM joblistings jl
      JOIN job_titles jt ON jl.jobtitle_id = jt.jobtitle_id
      JOIN applications a ON jl.job_id = a.job_id
      JOIN users u ON jl.user_id = u.user_id  
	    JOIN job_seekers js ON a.user_id = js.user_id 
      WHERE jl.job_id = $1`,
      [jobId]
  );

  return result.rows[0]; // Return the entire row (email, job_title, full_name)
};

//fetch jobinformation
router.get('/fetch-jobinfo/:job_id', async (req, res) => {
  try {
    const { job_id } = req.params;
    console.log('Received jobId:', job_id);

    // Validate job_id
    if (!job_id || isNaN(parseInt(job_id))) {
      return res.status(400).json({ error: 'Invalid or missing job_id' });
    }

    const jobInfo = await pool.query(`
      SELECT 
        jl.*,
        i.industry_name,
        jt.job_title
      FROM joblistings jl
      JOIN industries i ON jl.industry_id = i.industry_id
      JOIN job_titles jt ON jl.jobtitle_id = jt.jobtitle_id
      WHERE job_id = $1
      `,[job_id]);

    console.log('Fetched job info data:', jobInfo.rows);

    const JobDescription = jobInfo.rows[0] || {};

    // Query to fetch skills
    const jobSkill = await pool.query(`
      SELECT
        js.skill_id,
        s.skill_name
      FROM job_skills js
      JOIN skills s ON js.skill_id = s.skill_id
      WHERE job_id = $1
    `, [job_id]);

    const skills = jobSkill.rows.map(skill => ({
      skillId: skill.skill_id || 'Not Provided',
      skillName: skill.skill_name || 'Not Provided',
    }));
    console.log('Fetched skills:', skills);

    res.json({
      JobDescription: {
        job_id: JobDescription.job_id || 'Not Provided',
        jobtitle_id: JobDescription.jobtitle_id  || 'Not Provided',
        jobtitle_name:  JobDescription.job_title || 'Not Provided',
        industry_id:  JobDescription.industry_id || 'Not Provided',
        industry_name:   JobDescription.industry_name || 'Not Provided',
        salary:   JobDescription.salaryrange || 'Not Provided',
        jobtype:    JobDescription.jobtype || 'Not Provided',
        responsibilities:  JobDescription.responsibilities || 'Not Provided',
        description:   JobDescription.jobdescription || 'Not Provided',
        qualifications:   JobDescription.qualifications || 'Not Provided',
        skills: skills, 
      },
    });
  } catch (error) {
    console.error('Error fetching jobInfo:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

//update joblistings
router.put('/updatejoblistings/:job_id', async (req, res) => {
  const {
    jobtitle_id,
    industry_id,
    SalaryRange,
    skills,
    Responsibilities,
    JobDescription,
    Qualifications,
    JobType,
    user_id
  } = req.body;

  const { job_id } = req.params;
  console.log(`Job ID for update: ${job_id}`);

  const userId = user_id
  console.log(`userID for update: ${userId}`);

  try {
    // Update the job listing in the joblistings table
    const updateJob = `
      UPDATE joblistings 
      SET jobtitle_id = $1, industry_id = $2, salaryrange = $3, responsibilities = $4, 
      jobdescription = $5, qualifications = $6, jobtype = $7
      WHERE job_id = $8 
      RETURNING *;
    `;

    const jobResult = await pool.query(updateJob, [
      jobtitle_id,
      industry_id,
      SalaryRange,
      Responsibilities,
      JobDescription,
      Qualifications,
      JobType,
      job_id,
    ]);

    // If no rows are returned, job doesn't exist or user is not authorized
    if (jobResult.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found or unauthorized action.' });
    }

    // Update job skills if needed (assuming you have a separate job_skills table)
    if (skills.length > 0) {
      // First delete existing skills related to the job
      await pool.query('DELETE FROM job_skills WHERE job_id = $1', [job_id]);

      // Insert updated skills with user_id
      const insertSkillsQuery = `
        INSERT INTO job_skills (job_id, skill_id, user_id) 
        SELECT $1, unnest($2::int[]), $3;
      `;
      await pool.query(insertSkillsQuery, [job_id, skills, userId]);
    }

    res.json({ message: 'Job updated successfully', job: jobResult.rows[0] });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

router.post('/applications', upload.single('resume'), async (req, res) => {
  const { jobId, user_id, additionalInfo } = req.body;

  try {
    const resumeUrl = req.file?.location; // Get the S3 file URL from multer's S3 storage

    // Ensure that all required data is present
    if (!jobId || !user_id || !resumeUrl) {
      return res.status(400).json({ error: 'Job ID, user ID, and resume are required' });
    }

    const result = await pool.query(
      `INSERT INTO applications (job_id, user_id, resume, additional_info, status)
      VALUES ($1, $2, $3, $4, 'new')`,
      [jobId, user_id, resumeUrl, additionalInfo] // Include resumeUrl in your query
    );

    if (result.rowCount === 1) {
      if (io) {
        io.emit('new-application', {
          message: `A new application has been submitted for job ID ${jobId}`,
        });
      }

      // Fetch employer's email, job_title, and applicant's full name from the database
      const employerData = await getEmployerEmailByJobId(jobId);

      if (employerData) {
        // Send the email notification
        const applicationData = {
          job_title: employerData.job_title,
          full_name: employerData.full_name, // Job seeker's full name
        };

        // Pass employerEmail, fullName, and jobTitle to the email sending function
        await sendApplicationEmail(employerData.email, applicationData.full_name, applicationData.job_title);
      }

      res.status(201).json({ message: 'Application submitted successfully!' });
    } else {
      res.status(500).json({ error: 'Failed to submit application' });
    }
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'An error occurred while submitting the application', details: error.message });
  }
});

//check if applicant already applied
router.post('/applications/check', async (req, res) => {
  const { user_id, jobId } = req.body;

  // Debugging logs to check values
  console.log('Received request to check application status');
  console.log('user_id:', user_id);
  console.log('jobId:', jobId);

  if (!user_id || !jobId) {
      console.error('Missing required parameters');
      return res.status(400).json({ message: 'Missing required parameters' });
  }

  try {
      // Query the database to check if the user has already applied for this job
      const result = await pool.query(
          'SELECT * FROM applications WHERE user_id = $1 AND job_id = $2',
          [user_id, jobId]
      );

      // Log the result of the query
      console.log('Query result:', result.rows);

      if (result.rows.length > 0) {
          // If the result contains any rows, it means the user has already applied
          console.log('User has already applied');
          return res.json({ applied: true });
      }

      // No application found, so the user has not applied yet
      console.log('User has not applied yet');
      res.json({ applied: false });
  } catch (error) {
      console.error('Error checking application status:', error);
      res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch posted jobs
router.get('/postedjobs', async (req, res) => {
  const { searchQuery, selectedIndustry } = req.query;

  try {
    let query = `
      SELECT
        joblistings.job_id,
        job_titles.job_title,
        emp_profiles.company_name,
        industries.industry_name,
        joblistings.salaryrange,
        joblistings.jobtype,
        pp.profile_picture_url,
        industries.industry_id
      FROM joblistings
      JOIN job_titles ON joblistings.jobtitle_id = job_titles.jobtitle_id
      JOIN industries ON joblistings.industry_id = industries.industry_id
      JOIN emp_profiles ON joblistings.user_id = emp_profiles.user_id
      LEFT JOIN profilepictures pp ON joblistings.user_id = pp.user_id
      WHERE 1=1
    `;

    const values = [];

    // Search by either job title or company name using a single searchQuery
    if (searchQuery) {
      query += ` AND (job_titles.job_title ILIKE $${values.length + 1} OR emp_profiles.company_name ILIKE $${values.length + 1})`; 
      values.push(`%${searchQuery}%`); // Use ILIKE for case-insensitive matching
    }

    // Filter by selected industry
    if (selectedIndustry) {
      query += ` AND joblistings.industry_id = $${values.length + 1}`;
      values.push(selectedIndustry);
    }

    const result = await pool.query(query, values);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching job listings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get job details by job ID
router.get('/joblistings/:jobId', async (req, res) => {
  const { jobId } = req.params;
  console.log(`Fetching job details for Job ID: ${jobId}`);

  const jobQuery = `
    SELECT jl.*, jt.job_title, ep.company_name, i.industry_name, pp.profile_picture_url
    FROM joblistings jl
    JOIN job_titles jt ON jl.jobtitle_id = jt.jobtitle_id
    JOIN emp_profiles ep ON jl.user_id = ep.user_id
    JOIN industries i ON jl.industry_id = i.industry_id
    LEFT JOIN profilepictures pp ON jl.user_id = pp.user_id
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

// GET endpoint to fetch job seeker details
router.get('/job-seeker/:userId', async (req, res) => {
  const { userId } = req.params;

  const jobSeekerQuery = `
    SELECT js.full_name, js.email, js.phone_number, je.job_title, je.start_date, je.end_date
    FROM job_seekers js
    LEFT JOIN job_experience je ON js.user_id = je.user_id
    WHERE js.user_id = $1;
  `;

  const skillsQuery = `
    SELECT s.skill_name
    FROM js_skills jss
    JOIN skills s ON jss.skill_id = s.skill_id
    WHERE jss.user_id = $1;
  `;

  try {
    const jobSeekerResult = await pool.query(jobSeekerQuery, [userId]);
    const skillsResult = await pool.query(skillsQuery, [userId]);

    if (jobSeekerResult.rows.length === 0) {
      return res.status(404).json({ error: 'Job seeker not found' });
    }

    const jobSeekerData = jobSeekerResult.rows[0];
    const skills = skillsResult.rows.map(row => row.skill_name);

    res.json({
      jobSeeker: {
        ...jobSeekerData,
      },
      skills
    });
  } catch (error) {
    console.error('Error fetching job seeker details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
