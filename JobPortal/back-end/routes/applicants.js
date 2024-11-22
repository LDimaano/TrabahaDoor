const express = require('express');
const router = express.Router();
const pool = require('../db');
const { sendStatusUpdateEmail, sendContactNotificationEmail } = require('../mailer');
const { spawn } = require('child_process');



router.get('/applicantlist', async (req, res) => {
  const { jobTitle, selectedIndustry } = req.query; 

  try {
    let query = `
      SELECT
        js.full_name,
        js.user_id,
        u.email,
        a.location,
        MAX(jt.job_title) AS latest_job_title,
        pp.profile_picture_url,
      i.industry_name,
      js.industry_id
    FROM job_seekers js
    JOIN users u ON js.user_id = u.user_id
    JOIN address a ON js.address_id = a.address_id
    JOIN job_experience je ON js.user_id = je.user_id
    JOIN job_titles jt ON je.jobtitle_id = jt.jobtitle_id
    LEFT JOIN profilepictures pp ON js.user_id = pp.user_id
    JOIN industries i ON js.industry_id = i.industry_id
    `;

    const values = [];
    let whereClauses = []; 

    // Check if jobTitle is provided and add to query
    if (jobTitle) {
      whereClauses.push(`jt.job_title ILIKE $${values.length + 1}`);
      values.push(`%${jobTitle}%`);
    }

    // Check if selectedIndustry is provided and add to query
    if (selectedIndustry) {
      whereClauses.push(`js.industry_id = $${values.length + 1}`);
      values.push(selectedIndustry);
    }

    // If there are any WHERE clauses, add them to the query
    if (whereClauses.length > 0) {
      query += ' WHERE ' + whereClauses.join(' AND ');
    }

    query += `
      GROUP BY
      js.full_name,
      js.user_id,
      u.email,
      a.location,
      pp.profile_picture_url,
      js.industry_id,
      i.industry_name
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
    const { user_id } = req.params; 

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


    const jobExperienceData = await pool.query(`
      SELECT 
      je.jobtitle_id, 
      jt.job_title, 
      je.company, 
      je.start_date, 
      je.end_date, 
      je.description,
      je.salary 
      FROM job_experience je
      JOIN job_titles jt ON je.jobtitle_id = jt.jobtitle_id
      WHERE je.user_id = $1;
    `, [user_id]);


    const skillsData = await pool.query(`
      SELECT s.skill_name
      FROM js_skills jss
      JOIN skills s ON jss.skill_id = s.skill_id
      WHERE jss.user_id = $1
    `, [user_id]);

    if (jobSeekerData.rows.length === 0) {
      return res.status(404).json({ message: 'Job seeker not found' });
    }
    console.log(jobExperienceData.rows);
    const jobExperiences = jobExperienceData.rows.map(exp => ({
      job_title: exp.job_title || 'Not Specified',
      company: exp.company || 'Not Specified',
      start_date: exp.start_date ? new Date(exp.start_date).toLocaleDateString() : 'Not Provided',
      end_date: exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Not Provided',
      description: exp.description || 'No Description',
      salary: exp.salary || 'Not Provided'
    }));


    const jobSeeker = jobSeekerData.rows[0];
    const jobTitle = jobExperiences.length > 0 ? jobExperiences[0].job_title : 'Not Specified';

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
      skills: skillsData.rows.map(skill => skill.skill_name) 
    });
  } catch (error) {
    console.error('Error fetching job seeker data:', error.message);
    res.status(500).json({ error: 'Server error: Failed to fetch applicant profile data' });
  }
});

router.get('/appliedapplicants/:jobId', async (req, res) => {
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
              j.job_title,
              a.resume
      FROM applications a
      JOIN users u ON a.user_id = u.user_id
      JOIN job_seekers js ON u.user_id = js.user_id
      LEFT JOIN profilepictures pp ON a.user_id = pp.user_id
      JOIN joblistings jl ON a.job_id = jl.job_id
      JOIN job_titles j ON jl.jobtitle_id = j.jobtitle_id
      WHERE a.job_id = $1;`,
      [jobId]
    );

    res.json(result.rows);
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
    // Validate input
    if (!userId || !hiringStage || !jobId) {
      return res.status(400).json({ error: 'Invalid input: userId, jobId, and hiringStage are required.' });
    }

    // Validate hiring stage
    if (!allowedStages.includes(hiringStage)) {
      return res.status(400).json({ error: `Invalid hiring stage: ${hiringStage}. Must be one of ${allowedStages.join(', ')}.` });
    }

    // Update status and notif_status in the applications table
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

    // If hiring stage is "Filled", update the datefilled in the joblistings table
    if (hiringStage === 'Filled') {
      await pool.query(
        'UPDATE joblistings SET datefilled = CURRENT_DATE WHERE job_id = $1',
        [jobId]
      );
    }

    // Fetch job seeker email, name, and job title for the application
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

    // Send email notification to the job seeker
    await sendStatusUpdateEmail(jobSeekerEmail, jobSeekerName, jobTitle, hiringStage);

    // Emit real-time notification via Socket.io if user is connected
    const notification = {
      message: `Your application for ${jobTitle} has been updated to ${hiringStage}`,
      job_id: jobId,
      status: hiringStage
    };

    if (io.sockets.sockets.has(userId)) {
      io.to(userId).emit('newNotification', notification);
    }

    // Get the count of "Filled" applications for this job
    const filledCountResult = await pool.query(
      `SELECT COUNT(*) AS filled_count, jl.positions
       FROM applications a
       JOIN joblistings jl ON a.job_id = jl.job_id
       WHERE jl.user_id = $1 AND a.status = 'Filled' AND a.job_id = $2`,
      [userId, jobId]
    );

    const filledCount = filledCountResult.rows[0].filled_count;
    const positions = filledCountResult.rows[0].positions;

    // Determine if the job has been filled
    const isJobFilled = filledCount >= positions;

    // Send success response with the filled count and filled status
    res.status(200).json({
      message: 'Hiring stage updated, email sent, and notification sent successfully.',
      filledCount: filledCount,
      isJobFilled: isJobFilled
    });

  } catch (error) {
    // Log the error and send a server error response
    console.error('Error updating hiring stage and sending notifications:', error);
    res.status(500).json({ error: 'Failed to update hiring stage. Please try again later.' });
  }
});


async function getFilledCountForEmployer(userId) {
  const query = `
    SELECT jl.job_id, jt.job_title, jl.positions, COUNT(*) AS filled_count
    FROM applications a
    JOIN joblistings jl ON a.job_id = jl.job_id
    JOIN job_titles jt ON jl.jobtitle_id = jt.jobtitle_id
    WHERE jl.user_id = $1 AND a.status = 'Filled'
    GROUP BY jl.job_id, jt.job_title, jl.positions
    ORDER BY filled_count DESC;
  `;
  
  const result = await pool.query(query, [userId]);

  return result.rows.map(row => {
    const isFilled = row.filled_count >= row.positions; // Compare `positions` with `filled_count`
    return {
      jobId: row.job_id,
      jobTitle: row.job_title,
      positions: row.positions,
      filledCount: row.filled_count,
      isFilled, // True if the position has been filled, else false
    };
  });
}

router.get('/applications/filledCount/:userId', async (req, res) => {
  const { userId } = req.params; // Change employerId to userId if it's the same for job seekers/employers

  try {
    // Get the count of "Filled" applications for the employer's jobs
    const filledCount = await getFilledCountForEmployer(userId);

    // Return the data with criteria for whether each job has been filled
    res.status(200).json({ userId, filledCount });
  } catch (error) {
    console.error('Error fetching filled count:', error);
    res.status(500).json({ error: 'Failed to fetch filled count. Please try again later.' });
  }
});

const { spawn } = require('child_process');
const path = require('path');

// Function to calculate time to fill and send to Python
async function calculateTimeToFillForEmployer(userId) {
  const query = `
    SELECT jl.job_id, jl.industry_name, jl.datecreated, a.datefilled, jl.positions, COUNT(*) AS filled_count
    FROM applications a
    JOIN joblistings jl ON a.job_id = jl.job_id
    WHERE jl.user_id = $1 AND a.status = 'Filled'
    GROUP BY jl.job_id, jl.industry_name, jl.datecreated, a.datefilled, jl.positions
    ORDER BY jl.datecreated;
  `;

  try {
    // Get filled job data
    const result = await pool.query(query, [userId]);

    // Prepare the data to be sent to Python
    const jobData = result.rows.map(row => ({
      job_id: row.job_id,
      industry_name: row.industry_name,
      datecreated: row.datecreated,
      datefilled: row.datefilled,
      positions: row.positions,
      filled_count: row.filled_count,
    }));

    // Send data to Python for "time to fill" calculation
    return new Promise((resolve, reject) => {
      const pythonProcess = spawn('python', [
        path.join(__dirname, 'time_to_fill_emp.py'),
      ]);

      // Send job data to Python
      pythonProcess.stdin.write(JSON.stringify(jobData));
      pythonProcess.stdin.end();

      let resultData = '';

      pythonProcess.stdout.on('data', (data) => {
        resultData += data.toString();
      });

      pythonProcess.stderr.on('data', (error) => {
        console.error('Error in Python process:', error.toString());
      });

      pythonProcess.on('close', (code) => {
        if (code === 0) {
          resolve(JSON.parse(resultData));
        } else {
          reject(new Error('Python process failed'));
        }
      });
    });

  } catch (error) {
    console.error('Error fetching job data for time to fill calculation:', error);
    throw error;
  }
}

// di pa to nalalagay sa frontend
router.get('/applications/timeToFill/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const timeToFill = await calculateTimeToFillForEmployer(userId);

    res.status(200).json({
      userId,
      timeToFill,
    });
  } catch (error) {
    console.error('Error calculating time to fill:', error);
    res.status(500).json({ error: 'Failed to calculate time to fill analysis' });
  }
});

const getJobPostings = async (userId) => {
  const query = `
    SELECT 
      joblistings.job_id,
      job_titles.job_title,
      industries.industry_name,
      joblistings.salaryrange,
      joblistings.jobtype,
      pp.profile_picture_url,
      ARRAY_AGG(DISTINCT skills.skill_name) AS required_skills
    FROM joblistings
    JOIN job_titles ON joblistings.jobtitle_id = job_titles.jobtitle_id
    JOIN industries ON joblistings.industry_id = industries.industry_id
    JOIN job_skills ON joblistings.job_id = job_skills.job_id
    JOIN skills ON job_skills.skill_id = skills.skill_id
    LEFT JOIN profilepictures pp ON joblistings.user_id = pp.user_id
    WHERE joblistings.user_id = $1
    GROUP BY 
      joblistings.job_id,
      job_titles.job_title,
      industries.industry_name,
      joblistings.salaryrange,
      joblistings.jobtype,
      pp.profile_picture_url;  
  `;

  const { rows } = await pool.query(query, [userId]);

  if (rows.length === 0) {
    console.log(`No job postings found for user ${userId}`);
    return [];
  }

  const joblistingData = rows.map(row => ({
    job_id: row.job_id,
    job_title: row.job_title,
    industry_name: row.industry_name,
    salaryrange: row.salaryrange,
    jobtype: row.jobtype,
    required_skills: row.required_skills || [] 
  }));

  console.log(`Retrieved ${joblistingData.length} job postings for user ${userId}`);
  return joblistingData; 
};

const getApplicantsForJob = async (jobId) => {
  if (!jobId) {
    throw new Error("Job ID must be provided.");
  }

  const query = `
    SELECT
      ap.application_id,
      ap.user_id,
      js.full_name,
      u.email,
      js.phone_number,
      a.location,
      ap.resume,
      ap.additional_info,
      ARRAY_AGG(DISTINCT jt.job_title) AS job_titles,
      ARRAY_AGG(DISTINCT s.skill_name) AS skills,
      pp.profile_picture_url,
      js.industry_id,
      ap.status,
      ap.date_applied
    FROM job_seekers js
    JOIN users u ON js.user_id = u.user_id
    JOIN address a ON js.address_id = a.address_id
    JOIN job_experience je ON js.user_id = je.user_id
    JOIN job_titles jt ON je.jobtitle_id = jt.jobtitle_id
    LEFT JOIN profilepictures pp ON js.user_id = pp.user_id
    JOIN js_skills jk ON js.user_id = jk.user_id
    JOIN skills s ON jk.skill_id = s.skill_id
    JOIN applications ap ON u.user_id = ap.user_id
    WHERE ap.job_id = $1
    GROUP BY 
      ap.application_id,
      js.full_name,
      js.user_id,
      u.email,
      js.phone_number,
      a.location,
      pp.profile_picture_url,
      js.industry_id,
      ap.status,
      ap.date_applied;
  `;

  try {
    const { rows } = await pool.query(query, [jobId]);

    const relevantData = rows.map(row => ({
      user_id: row.user_id,
      email: row.email || '',
      profile_picture_url: row.profile_picture_url || 'no image',
      job_titles: row.job_titles || [],
      skills: row.skills || [],
      resume: row.resume,
      additional_info: row.additional_info,
      industry: row.industry_id,
      full_name: row.full_name || 'No Name Provided', 
      phone_number: row.phone_number || '',
      status: row.status || '',
      date_applied: row.date_applied || '',
      application_id: row.application_id || ''
    }));

    return relevantData;
  } catch (error) {
    console.error("Error fetching applicants for job:", error);
    throw error;
  }
};

router.post('/recommend-candidates/:jobId', async (req, res) => {
  const { jobId } = req.params;
  const { userId } = req.body;
  try {
    const jobPostings = await getJobPostings(userId);
    const applicants = await getApplicantsForJob(jobId);

    if (jobPostings.length === 0 || applicants.length === 0) {
      return res.status(404).json({ error: 'No job postings or applicants found.' });
    }

    const pythonProcess = spawn('python', ['python_scripts/recos_per_job.py']);
    const dataToSend = JSON.stringify({ job_postings: jobPostings, applicants: applicants });

    pythonProcess.stdin.write(dataToSend + '\n');
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', (data) => {
      try {
        const recommendations = JSON.parse(data.toString().trim());
        res.json({ recommendations });
      } catch (error) {
        res.status(500).json({ error: 'Error parsing recommendations.' });
      }
    });

    pythonProcess.stderr.on('data', (error) => {
      res.status(500).json({ error: 'Internal Server Error', details: error.toString() });
    });

    pythonProcess.on('exit', (code) => {
      if (code !== 0) {
        res.status(500).json({ error: 'Internal Server Error', details: 'Python script failed' });
      }
    });

  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/contact/:user_id', async (req, res) => {
  const { user_id: js_user_id } = req.params;
  const { userId: emp_user_id, message } = req.body; 

  try {
    if (!js_user_id || !emp_user_id) {
      return res.status(400).json({ message: "Missing user IDs." });
    }

    // Insert a new record into the emp_contact table with message
    const newContact = await pool.query(
      `INSERT INTO emp_contact (js_user_id, emp_user_id, message) 
       VALUES ($1, $2, $3) 
       RETURNING *`,
      [js_user_id, emp_user_id, message]
    );

    // Fetch jobseeker email and name from the database
    const jobseeker = await pool.query(
      `SELECT 
        u.email, 
        js.full_name 
      FROM job_seekers js
      JOIN users u ON js.user_id = u.user_id
      WHERE js.user_id = $1`,
      [js_user_id]
    );

    // Fetch employer name from the database
    const employer = await pool.query(
      `SELECT company_name FROM emp_profiles WHERE user_id = $1`,
      [emp_user_id]
    );

    if (jobseeker.rows.length > 0 && employer.rows.length > 0) {
      const js_email = jobseeker.rows[0].email;
      const js_name = jobseeker.rows[0].full_name;
      const company_name = employer.rows[0].company_name;

      // Send an email to the jobseeker with the message
      await sendContactNotificationEmail(js_email, js_name, company_name, message);
    }

    // Send the newly created contact as a response
    res.status(201).json(newContact.rows[0]);
    
  } catch (err) {
    console.error('Error while inserting contact or sending email:', err.message);
    res.status(500).json({ message: "Server error" });
  }
});



module.exports = router;