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
    profile_picture_url
  } = req.body;

  const defaultProfilePictureUrl = "https://trabahadoor-bucket.s3.amazonaws.com/employer.png";

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
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

    if (profile_picture_url === defaultProfilePictureUrl) {
      await pool.query(
        `INSERT INTO profilepictures (user_id, profile_picture_url)
         VALUES ($1, $2)`,
        [user_id, profile_picture_url]
      );
    }
    
    await pool.query(
      `UPDATE users
       SET is_complete = true
       WHERE user_id = $1`,
      [user_id]
    );

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
      const { company_name, email, contact_person, profile_picture_url } = result.rows[0]; 
      res.json({ company_name, email, contact_person, profile_picture_url }); 
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
    const { userId } = req.params;

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

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
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

    if (updatedEmpProfile.rowCount === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    res.json(updatedEmpProfile.rows[0]);
  } catch (err) {
    console.error('Error updating profile:', err.message);
    res.status(500).send('Server Error');
  }
});

//fetch employer profile for admin update
router.get('/fetchemployer-profileforadmin/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id || isNaN(parseInt(user_id))) {
      return res.status(400).json({ error: 'Invalid or missing user_id' });
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
    `, [user_id]);

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
          jl.status,
          jl.job_id
       FROM
          joblistings jl
       JOIN
          job_titles jt
       ON
          jl.jobtitle_id = jt.jobtitle_id
       WHERE
          jl.user_id = $1
      ORDER BY jl.datecreated desc
          `,
      [userId]
    );
    
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
    const jobSeekerId = application.user_id; 

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
      await pool.query(`
          INSERT INTO archived_joblistings (job_id, user_id, jobtitle_id, industry_id, salaryrange, jobtype, responsibilities, jobdescription, qualifications, datecreated, datefilled)
          SELECT job_id, user_id, jobtitle_id, industry_id, salaryrange, jobtype, responsibilities, jobdescription, qualifications, datecreated, datefilled
          FROM joblistings
          WHERE job_id = $1
      `, [jobId]);

      await pool.query(`
          INSERT INTO archived_job_skills (job_id, skill_id, user_id)
          SELECT job_id, skill_id, user_id
          FROM job_skills
          WHERE job_id = $1
      `, [jobId]);

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

    await client.query(`
      INSERT INTO archived_emp_profiles (user_id, company_name, contact_person, contact_number, website, industry_id, company_address, company_size, founded_year, description)
      SELECT user_id, company_name, contact_person, contact_number, website, industry_id, company_address, company_size, founded_year, description
      FROM emp_profiles
      WHERE user_id = $1
    `, [userId]);

    await client.query(`
      INSERT INTO archived_users (user_id, email, password, usertype, approve, datecreated, is_verified, is_complete)
      SELECT user_id, email, password, usertype, approve, datecreated, is_verified, is_complete
      FROM users
      WHERE user_id = $1
    `, [userId]);   

    await client.query(`
      INSERT INTO archived_profilepictures (user_id, profile_picture_url)
      SELECT user_id, profile_picture_url
      FROM profilepictures
      WHERE user_id = $1
    `, [userId]);

    await client.query(`
      INSERT INTO archived_joblistings (job_id, user_id, jobtitle_id, industry_id, salaryrange, jobtype, responsibilities, jobdescription, qualifications, datecreated, datefilled)
      SELECT job_id, user_id, jobtitle_id, industry_id, salaryrange, jobtype, responsibilities, jobdescription, qualifications, datecreated, datefilled
      FROM joblistings
      WHERE user_id = $1
    `, [userId]);

    await client.query(`
      INSERT INTO archived_job_skills (job_id, skill_id, user_id)
      SELECT job_id, skill_id, user_id
      FROM job_skills
      WHERE user_id = $1
    `, [userId]);

    await client.query('DELETE FROM job_skills WHERE user_id = $1', [userId]);
    await client.query('DELETE FROM joblistings WHERE user_id = $1', [userId]);
    await client.query('DELETE FROM emp_profiles WHERE user_id = $1', [userId]);
    await client.query('DELETE FROM profilepictures WHERE user_id = $1', [userId]);
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


router.post('/upload/:user_id', uploadDocuments, async (req, res) => {
  try {
    const user_id = req.params.user_id;

    if (!user_id) {
      return res.status(400).send('User ID is required');
    }

    const fileUploadPromises = [];

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
            urls[type] = url; 
          });
        fileUploadPromises.push(uploadPromise);
      }
    }

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

router.post('/reupload/:user_id', uploadDocuments, async (req, res) => {
  try {
    const user_id = req.params.user_id;
    console.log(`user_id for reupload: ${user_id}`);

    if (!user_id) {
      return res.status(400).send('User ID is required');
    }

    const fileUploadPromises = [];
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
            urls[type] = url; 
          });
        fileUploadPromises.push(uploadPromise);
      }
    }

    await Promise.all(fileUploadPromises);

    const updateDocumentsQuery = `
      UPDATE documents 
      SET sec_certificate = $2, 
          business_permit = $3, 
          bir_certificate = $4, 
          poea_license = $5, 
          private_recruitment_agency_license = $6, 
          contract_sub_contractor_certificate = $7
      WHERE user_id = $1
      RETURNING *;
    `;

    const updateDocumentsValues = [
      user_id,
      urls.sec_certificate || null,
      urls.business_permit || null,
      urls.bir_certificate || null,
      urls.poea_license || null,
      urls.private_recruitment_agency_license || null,
      urls.contract_sub_contractor_certificate || null
    ];

    const documentResult = await pool.query(updateDocumentsQuery, updateDocumentsValues);

    const updateUserQuery = `
      UPDATE users
      SET approve = 'no'
      WHERE user_id = $1;
    `;

    await pool.query(updateUserQuery, [user_id]);

    res.status(200).send(`Documents uploaded successfully for user ID: ${user_id}. Record ID: ${documentResult.rows[0].id}`);
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

    res.json(rows); 
  } catch (error) {
    console.error('Error fetching gender distribution:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/industry-distribution/:userId', async (req, res) => {
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
	  ORDER BY
		  count desc
    `;

    const { rows } = await pool.query(query, [userId]);

    res.json(rows); 
  } catch (error) {
    console.error('Error fetching industry distribution:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/location-distribution/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const query = `
    SELECT
      a.location,
      COUNT(*) as count
    FROM
      joblistings jl 
    JOIN
      applications app ON jl.job_id = app.job_id
    JOIN
      job_seekers js ON app.user_id = js.user_id
    JOIN
      address a ON js.address_id = a.address_id
    WHERE
      jl.user_id = $1
    GROUP BY
      a.location
	  ORDER BY
	    count desc
    `;
    const { rows } = await pool.query(query, [userId]);

    res.json(rows); 
  } catch (error) {
    console.error('Error fetching location distribution:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/applicants-distribution/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const query = `
    SELECT
      jt.job_title,
      COUNT(*) as count
    FROM
      joblistings jl 
    JOIN
      applications app ON jl.job_id = app.job_id
    JOIN
      job_seekers js ON app.user_id = js.user_id
    JOIN
      job_titles jt ON jl.jobtitle_id = jt.jobtitle_id
    WHERE
      jl.user_id = $1
    GROUP BY
      jt.job_title
	  ORDER BY 
		  count desc
    `;
    const { rows } = await pool.query(query, [userId]);

    res.json(rows); 
  } catch (error) {
    console.error('Error fetching applicants distribution:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



module.exports = router;
