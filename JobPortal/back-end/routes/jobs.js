const express = require('express');
const router = express.Router();
const pool = require('../db');
const { sendApplicationEmail } = require('../mailer');
const AWS = require('aws-sdk');
const multer = require('multer');
const path = require('path');
const multerS3 = require('multer-s3');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');


let io; 
router.setIo = (_io) => {
  io = _io; 
};
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
      return null; 
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
  const contentType = getContentType(fileName);
  if (!contentType) {
    throw new Error('Unsupported file type');
  }
  
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

router.post('/applications', upload.single('resume'), async (req, res) => {
  const { jobId, user_id, additionalInfo } = req.body;

  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Resume file is required' });
    }

    const resumeUrl = await uploadFileToS3(req.file.buffer, req.file.originalname);

    if (!jobId || !user_id || !resumeUrl) {
      return res.status(400).json({ error: 'Job ID, user ID, and resume are required' });
    }

    const result = await pool.query(
      `INSERT INTO applications (job_id, user_id, resume, additional_info, status)
      VALUES ($1, $2, $3, $4, 'new')`,
      [jobId, user_id, resumeUrl, additionalInfo] 
    );

    if (result.rowCount === 1) {
      if (io) {
        io.emit('new-application', {
          message: `A new application has been submitted for job ID ${jobId}`,
        });
      }

      const employerData = await getEmployerEmailByJobId(jobId);

      if (employerData) {
        const applicationData = {
          job_title: employerData.job_title,
          full_name: employerData.full_name, 
        };

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
    skills,
    educations,
    positions // New field added here
  } = req.body;

  console.log('Received request body:', req.body);

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  if (!positions || positions < 1) {
    return res.status(400).json({ error: 'Positions must be a positive number' });
  }

  try {
    const newJobResult = await pool.query(
      `INSERT INTO joblistings (
        user_id, jobtitle_id, industry_id, salaryrange, jobtype, responsibilities, jobdescription, qualifications, positions
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING job_id`,
      [user_id, jobtitle_id, industry_id, SalaryRange, JobType, Responsibilities, JobDescription, Qualifications, positions]
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
  
    for (const education_id of educations) {
      await pool.query(
        `INSERT INTO job_education (
          job_id, education_id, user_id
        )
        VALUES ($1, $2, $3)`,
        [job_id, education_id, user_id]
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

  return result.rows[0]; 
};

//fetch jobinformation
router.get('/fetch-jobinfo/:job_id', async (req, res) => {
  try {
    const { job_id } = req.params;
    
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

    res.json({
      JobDescription: {
        job_id: JobDescription.job_id || 'Not Provided',
        jobtitle_id: JobDescription.jobtitle_id  || 'Not Provided',
        jobtitle_name:  JobDescription.job_title || 'Not Provided',
        industry_id:  JobDescription.industry_id || 'Not Provided',
        industry_name:   JobDescription.industry_name || 'Not Provided',
        salary:   JobDescription.salaryrange || 'Not Provided',
        jobtype:    JobDescription.jobtype || 'Not Provided',
        positions: JobDescription.positions || 'Not Provided',
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
    Positions,
    user_id
  } = req.body;

  console.log({
    Positions
  });

  const { job_id } = req.params;

  const userId = user_id

  try {
    const updateJob = `
      UPDATE joblistings 
      SET jobtitle_id = $1, industry_id = $2, salaryrange = $3, responsibilities = $4, 
      jobdescription = $5, qualifications = $6, jobtype = $7, positions = $8
      WHERE job_id = $9
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
      Positions,
      job_id,
    ]);

    if (jobResult.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found or unauthorized action.' });
    }

    if (skills.length > 0) {
      await pool.query('DELETE FROM job_skills WHERE job_id = $1', [job_id]);

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

//check if applicant already applied
router.post('/applications/check', async (req, res) => {
  const { user_id, jobId } = req.body;

  if (!user_id || !jobId) {
      console.error('Missing required parameters');
      return res.status(400).json({ message: 'Missing required parameters' });
  }

  try {
      const result = await pool.query(
          'SELECT * FROM applications WHERE user_id = $1 AND job_id = $2',
          [user_id, jobId]
      );

      if (result.rows.length > 0) {
          console.log('User has already applied');
          return res.json({ applied: true });
      }
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
    // Base query without any filtering
    let query = `
        SELECT
        joblistings.job_id,
        job_titles.job_title,
        emp_profiles.company_name,
        industries.industry_name,
        joblistings.salaryrange,
        joblistings.datecreated,
        joblistings.jobtype,
        pp.profile_picture_url,
        industries.industry_id
    FROM joblistings
    JOIN job_titles ON joblistings.jobtitle_id = job_titles.jobtitle_id
    JOIN industries ON joblistings.industry_id = industries.industry_id
    JOIN emp_profiles ON joblistings.user_id = emp_profiles.user_id
    LEFT JOIN profilepictures pp ON joblistings.user_id = pp.user_id
    WHERE joblistings.status = 'Hiring'
    `;

    const values = [];

    // Adding search query condition if present
    if (searchQuery) {
      query += ` AND (job_titles.job_title ILIKE $${values.length + 1} OR emp_profiles.company_name ILIKE $${values.length + 1})`;
      values.push(`%${searchQuery}%`);
    }

    // Adding industry filter condition if present
    if (selectedIndustry) {
      query += ` AND joblistings.industry_id = $${values.length + 1}`;
      values.push(selectedIndustry);
    }

    // Adding the order by clause
    query += ` ORDER BY joblistings.datecreated DESC`;

    // Executing the query
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

  const educationsQuery = `
    SELECT e.education_name
    FROM job_education je
    JOIN educations e ON je.education_id = e.education_id
    WHERE je.job_id = $1;
  `;

  try {
    const jobResult = await pool.query(jobQuery, [jobId]);

    if (jobResult.rows.length === 0) {
      console.warn(`Job not found for Job ID: ${jobId}`);
      return res.status(404).json({ error: 'Job not found' });
    }
    const skillsResult = await pool.query(skillsQuery, [jobId]);
    const educationsResult = await pool.query(educationsQuery, [jobId]);

    const jobData = jobResult.rows[0];
    const skills = skillsResult.rows.map(row => row.skill_name);
    const educations = educationsResult.rows.map(row => row.education_name);
   
    console.log('Responding with job data and skills:', { ...jobData, skills });
    res.json({ ...jobData, skills, educations });
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

router.put('/:jobId/status', async (req, res) => {
  const { jobId } = req.params;
  const { status } = req.body; // Get the new status from the request body

  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  const updateQuery = `
    UPDATE joblistings
    SET status = $1
    WHERE job_id = $2
    RETURNING status;
  `;

  try {
    const result = await pool.query(updateQuery, [status, jobId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Return the updated status in the response
    res.json({ status: result.rows[0].status });
  } catch (error) {
    console.error('Error updating job status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Route to update the status of a job
router.patch('/:jobId/status', async (req, res) => {
  const { jobId } = req.params;
  const { status } = req.body; // The new status should be sent in the body of the request
  
  try {
    // Validate that the status is one of the accepted values
    const validStatuses = ['Hiring', 'Filled']; // Modify this list based on your requirements
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    // Fetch the job from the database
    const job = await Job.findByPk(jobId); // Replace with your actual ORM query
    
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }

    // Update the job status in the database
    job.status = status;
    await job.save(); // Save the updated status to the database

    // Send a success response
    res.json({ message: 'Job status updated successfully', status: job.status });
  } catch (error) {
    console.error('Error updating job status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
