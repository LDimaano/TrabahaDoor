const express = require('express');
const router = express.Router();
const pool = require('../db');
const path = require('path');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

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
  { name: 'sec_certificate', maxCount: 1 },
  { name: 'business_permit', maxCount: 1 },
  { name: 'bir_certificate', maxCount: 1 },
  { name: 'poea_license', maxCount: 1 },
  { name: 'private_recruitment_agency_license', maxCount: 1 },
  { name: 'contract_sub_contractor_certificate', maxCount: 1 }
]);

router.use('/documents', express.static(path.join(__dirname, '..', 'documents')));
router.post('/upload-resume', uploadDocuments, async (req, res) => {
  try {
    const user_id = req.body.userId;

    if (!user_id) {
      return res.status(400).send('User ID is required');
    }

    // Check for resume file in the request
    if (!req.files || !req.files.resume) {
      return res.status(400).send('Resume file is required');
    }

    const resumeFile = req.files.resume[0];
    const uniqueFileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${resumeFile.originalname}`;

    // Upload the resume file to S3
    const resumeUrl = await uploadFileToS3(resumeFile.buffer, uniqueFileName);

    // Insert the resume URL and user ID into the database
    const query = `
      INSERT INTO documents 
      (user_id, resume_url)
      VALUES ($1, $2)
      RETURNING *`;

    const values = [user_id, resumeUrl];

    const result = await pool.query(query, values);

    res.status(200).send(`Resume uploaded successfully for user ID: ${user_id}. Record ID: ${result.rows[0].id}`);
  } catch (error) {
    console.error('Error uploading resume:', error);
    res.status(500).send('Server error');
  }
});

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
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *`,
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

router.get('/user-infoemp/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    console.log('Received userId:', userId);
    
    // Input validation
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    const result = await pool.query(
      `
       SELECT emp_profiles.company_name,
        users.email,
        emp_profiles.contact_person,
        pp.profile_picture_url
       FROM emp_profiles
       JOIN users ON emp_profiles.user_id = users.user_id
       LEFT JOIN profilepictures pp ON users.user_id = pp.user_id
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


//fetch info for update
router.get('/fetchemployer-profile/:userId', async (req, res) => {
  try {
    // Log the userId to see if it's being passed correctly
    const { userId } = req.params;
    console.log('Received userId:', userId);

    // Continue with the query if userId is valid
    if (!userId || isNaN(parseInt(userId))) {
      return res.status(400).json({ error: 'Invalid or missing userId' });
    }

    const EmployerData = await pool.query(`
      SELECT 
        e.*, 
        i.industry_name, 
        pp.profile_picture_url 
      FROM emp_profiles e 
      JOIN industries i ON e.industry_id = i.industry_id 
      LEFT JOIN profilepictures pp ON e.user_id = pp.user_id 
      WHERE e.user_id = $1
    `, [userId]);

    console.log('Fetched update employer data:', EmployerData.rows);

    const employer = EmployerData.rows[0] || {};

    res.json({
      employer: {
        company_name: employer.company_name || 'Not Provided',
        contact_person: employer.contact_person || 'Not Provided',
        contact_number: employer.contact_number || 'Not Provided',
        email: employer.email || 'Not Provided',
        website: employer.website || 'Not Provided',
        industry: employer.industry_id || 'Not Provided',
        company_address: employer.company_address || 'Not Provided',
        company_size: employer.company_size || 'Not Provided',
        foundedYear: employer.founded_year || 'Not Provided',
        description: employer.description || 'Not Provided',
        profilePicture: employer.profile_picture_url || 'No Image',
        industryname: employer.industry_name  || 'Not Provided',
      },
    });
  } catch (error) {
    console.error('Error fetching employer data:', error.message);
    res.status(500).send('Server error');
  }
});

//update profile
router.put('/employer-profile/:userId', async (req, res) => {
  const {
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

  const userId = req.params.userId;

  // Log the request body to verify data
  console.log('Request body for update:', req.body);

  // Check that userId is provided
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // Update the data in the profiles table
    const updatedEmpProfile = await pool.query(
      `UPDATE emp_profiles SET
        company_name = $1,
        contact_person = $2,
        contact_number = $3,
        website = $4,
        industry_id = $5,
        company_address = $6,
        company_size = $7,
        founded_year = $8,
        description = $9
      WHERE user_id = $10
      RETURNING *`,
      [
        companyName,
        contactPerson,
        contactNumber,
        website,
        industry_id,
        companyAddress,
        companySize,
        foundedYear,
        description,
        userId
      ]
    );

    // Check if the update was successful
    if (updatedEmpProfile.rowCount === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    // Send the updated profile back as the response
    res.json(updatedEmpProfile.rows[0]);
  } catch (err) {
    console.error('Error updating profile:', err.message);
    res.status(500).send('Server Error');
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
router.get('/joblistings/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
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

//delete joblistings and put it to archive joblistings
router.delete('/deljoblistings/:jobId', async (req, res) => {
  const { jobId } = req.params;
  console.log(`Deleting job with ID: ${jobId}`);
  try {
      // Archive joblistings data
      await pool.query(`
          INSERT INTO archived_joblistings (job_id, user_id, jobtitle_id, industry_id, salaryrange, jobtype, responsibilities, jobdescription, qualifications, datecreated, datefilled)
          SELECT job_id, user_id, jobtitle_id, industry_id, salaryrange, jobtype, responsibilities, jobdescription, qualifications, datecreated, datefilled
          FROM joblistings
          WHERE job_id = $1
      `, [jobId]);

      // Archive job_skills data
      await pool.query(`
          INSERT INTO archived_job_skills (job_id, skill_id, user_id)
          SELECT job_id, skill_id, user_id
          FROM job_skills
          WHERE job_id = $1
      `, [jobId]);

      // Delete job_skills, applications, and joblistings data
      await pool.query('DELETE FROM job_skills WHERE job_id = $1', [jobId]);
      await pool.query('DELETE FROM applications WHERE job_id = $1', [jobId]);
      await pool.query('DELETE FROM joblistings WHERE job_id = $1', [jobId]);

      res.status(200).json({ message: 'Job listing archived and deleted successfully' });
  } catch (error) {
      console.error('Error archiving and deleting job listing:', error);
      res.status(500).json({ error: 'An error occurred while deleting the job listing' });
  }
});


async function deleteUserAndArchive(userId, password) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Verify password
    const res = await client.query('SELECT password FROM users WHERE user_id = $1', [userId]);
    if (res.rows.length === 0 || res.rows[0].password !== password) {
      throw new Error('Invalid password');
    }

    // Archive employer profiles data
    await client.query(`
      INSERT INTO archived_emp_profiles (user_id, company_name, contact_person, contact_number, website, industry_id, company_address, company_size, founded_year, description)
      SELECT user_id, company_name, contact_person, contact_number, website, industry_id, company_address, company_size, founded_year, description
      FROM emp_profiles
      WHERE user_id = $1
    `, [userId]);

    // Archive users data
    await client.query(`
      INSERT INTO archived_users (user_id, email, password, usertype)
      SELECT user_id, email, password, usertype
      FROM users
      WHERE user_id = $1
    `, [userId]);

    // Archive profile pictures data
    await client.query(`
      INSERT INTO archived_profilepictures (user_id, profile_picture_url)
      SELECT user_id, profile_picture_url
      FROM profilepictures
      WHERE user_id = $1
    `, [userId]);

    // Archive existing Joblisting
    await client.query(`
      INSERT INTO archived_joblistings (job_id, user_id, jobtitle_id, industry_id, salaryrange, jobtype, responsibilities, jobdescription, qualifications, datecreated, datefilled)
      SELECT job_id, user_id, jobtitle_id, industry_id, salaryrange, jobtype, responsibilities, jobdescription, qualifications, datecreated, datefilled
      FROM joblistings
      WHERE user_id = $1
    `, [userId]);

    // Archive existing job_skills
    await client.query(`
      INSERT INTO archived_job_skills (job_id, skill_id, user_id)
      SELECT job_id, skill_id, user_id
      FROM job_skills
      WHERE user_id = $1
    `, [userId]);

    // Delete from dependent tables first
    await client.query('DELETE FROM job_skills WHERE user_id = $1', [userId]);
    await client.query('DELETE FROM joblistings WHERE user_id = $1', [userId]);
    await client.query('DELETE FROM emp_profiles WHERE user_id = $1', [userId]);
    await client.query('DELETE FROM profilepictures WHERE user_id = $1', [userId]);

    // Delete from users table last
    await client.query('DELETE FROM users WHERE user_id = $1', [userId]);

    await client.query('COMMIT');
    return { success: true };
  } catch (err) {
    await client.query('ROLLBACK');
    return { success: false, error: err.message };
  } finally {
    client.release();
  }
}


router.delete('/delete', async (req, res) => {
  const { userId, password } = req.body;

  console.log('User ID archive:', userId);
  console.log('Password archive:', password);

  if (!userId) {
    return res.status(401).json({ message: 'User not logged in' });
  }

  if (!password) {
    return res.status(400).json({ message: 'Password is required' });
  }

  const result = await deleteUserAndArchive(userId, password);

  if (result.success) {
    res.status(200).json({ message: 'Account deleted successfully.' });
  } else {
    res.status(400).json({ message: result.error });
  }
});


router.post('/upload', uploadDocuments, async (req, res) => {
  try {
    const user_id = req.body.userId;

    if (!user_id) {
      return res.status(400).send('User ID is required');
    }

    const fileUploadPromises = [];

    // Loop through each file type and upload to S3
    const fileTypes = [
      'sec_certificate',
      'business_permit',
      'bir_certificate',
      'poea_license',
      'private_recruitment_agency_license',
      'contract_sub_contractor_certificate'
    ];

    const urls = {};

    for (const type of fileTypes) {
      if (req.files[type]) {
        const file = req.files[type][0];
        const uniqueFileName = `${Date.now()}-${Math.round(Math.random() * 1E9)}-${file.originalname}`;
        const uploadPromise = uploadFileToS3(file.buffer, uniqueFileName)
          .then(url => {
            urls[type] = url; // Store the URL for this file
          });
        fileUploadPromises.push(uploadPromise);
      }
    }

    // Wait for all file uploads to finish
    await Promise.all(fileUploadPromises);

    const query = `
      INSERT INTO documents 
      (user_id, sec_certificate, business_permit, bir_certificate, poea_license, private_recruitment_agency_license, contract_sub_contractor_certificate)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *`;

    const values = [
      user_id,
      urls.sec_certificate || null,
      urls.business_permit || null,
      urls.bir_certificate || null,
      urls.poea_license || null,
      urls.private_recruitment_agency_license || null,
      urls.contract_sub_contractor_certificate || null
    ];

    const result = await pool.query(query, values);

    res.status(200).send(`Documents uploaded successfully for user ID: ${user_id}. Record ID: ${result.rows[0].id}`);
  } catch (error) {
    console.error('Error saving to database:', error);
    res.status(500).send('Server error');
  }
});

router.get('/gender-distribution/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const query = `
      SELECT
          js.gender,
          COUNT(*) AS count
      FROM
          joblistings jl 
      JOIN
          applications app ON jl.job_id = app.job_id
      JOIN
          job_seekers js ON app.user_id = js.user_id
      WHERE
          jl.user_id = $1
      GROUP BY
          js.gender;
    `;
    
    const { rows } = await pool.query(query, [userId]);

    res.json(rows); // Send the data as JSON
  } catch (error) {
    console.error('Error fetching gender distribution:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/gender-distribution/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const query = `
          SELECT
      i.industry_name,
        COUNT(*) as count
    FROM
        joblistings jl 
    JOIN
        applications app ON jl.job_id = app.job_id
    JOIN
        job_seekers js ON app.user_id = js.user_id
    JOIN
      industries i ON js.industry_id = i.industry_id
    WHERE
        jl.user_id = $1
    GROUP BY
        js.industry_id,
      i.industry_name
    `;
    
    const { rows } = await pool.query(query, [userId]);

    res.json(rows); // Send the data as JSON
  } catch (error) {
    console.error('Error fetching gender distribution:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
