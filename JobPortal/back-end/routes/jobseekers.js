const express = require('express');
const router = express.Router();
const pool = require('../db');


router.post('/profile', async (req, res) => {
  const {
    user_id, 
    fullName,
    phoneNumber,
    dateOfBirth,
    gender,
    address_id, 
    industry_id,
    educations,
    experience,
    skills,
  } = req.body;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  if (!address_id) {
    return res.status(400).json({ error: 'Address ID is required' });
  }

  try {
    const newProfileResult = await pool.query(
      `INSERT INTO job_seekers (
        user_id, full_name, phone_number, date_of_birth, gender, address_id, industry_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING jsid`,
      [user_id, fullName, phoneNumber, dateOfBirth, gender, address_id, industry_id]
    );

    const profileId = newProfileResult.rows[0].jsid;

    for (const exp of experience) {
      await pool.query(
        `INSERT INTO job_experience (
          user_id, jobtitle_id, salary, company, location, start_date, end_date, description
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [user_id, exp.jobTitle, exp.salary, exp.company, exp.location, exp.startDate, exp.endDate, exp.description]
      );
    }

    for (const skill_id of skills) {
      await pool.query(
        `INSERT INTO js_skills (
          user_id, skill_id
        )
        VALUES ($1, $2)`,
        [user_id, skill_id]
      );
    }

    for (const education_id of educations) {
      await pool.query(
        `INSERT INTO js_education (
          user_id, education_id
        )
        VALUES ($1, $2)`,
        [user_id, education_id]
      );
    }

    // Mark user profile as complete
    await pool.query(
      `UPDATE users
       SET is_complete = true
       WHERE user_id = $1`,
      [user_id]
    );

    res.json({ message: 'Profile created successfully', profileId });
  } catch (err) {
    console.error('Error inserting profile:', err.message);
    res.status(500).send('Server Error');
  }
});



router.get('/user/skills/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query('SELECT skill_id FROM js_skills WHERE user_id = $1', [userId]);
    const skills = result.rows.map(row => row.skill_id);
    res.json(skills);
  } catch (err) {
    console.error('Error fetching skills:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET route to fetch user full name based on session user_id
router.get('/user-info/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate the user ID
    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    // Query to fetch user information
    const result = await pool.query(
      `
      SELECT 
          js.full_name,
          js.user_id,
          js.industry_id,
          i.industry_name,
          je.salary,
          ARRAY_AGG(DISTINCT jt.job_title) AS job_titles,
          ARRAY_AGG(DISTINCT educations.education_name) AS education
      FROM 
          job_seekers js
      JOIN 
          job_experience je ON js.user_id = je.user_id
      JOIN 
          industries i ON js.industry_id = i.industry_id
      JOIN 
          job_titles jt ON je.jobtitle_id = jt.jobtitle_id
      LEFT JOIN 
          js_education ON js_education.user_id = js.user_id
      LEFT JOIN 
          educations ON js_education.education_id = educations.education_id
      WHERE 
          js.user_id = $1
      GROUP BY 
          js.user_id, js.full_name, js.industry_id, i.industry_name, je.salary;
      `,
      [userId]
    );

    // Check if a user was found
    if (result.rows.length > 0) {
      const userInfo = result.rows[0];

      // Construct response object
      const response = {
        fullName: userInfo.full_name,
        industryName: userInfo.industry_name,
        salaryRange: userInfo.salary,
        jobTitles: userInfo.job_titles || [],
        education: userInfo.education || [], // Include education in the response
      };

      res.json(response);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error fetching user info:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/fetchjobseeker-profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || isNaN(parseInt(userId))) {
      return res.status(400).json({ error: 'Invalid or missing userId' });
    }

    // Query to fetch job seeker profile data, skills, and job experiences
    const jobSeekerData = await pool.query(`
      SELECT 
        js.*, 
        i.industry_name, 
        a.location
      FROM job_seekers js
      JOIN industries i ON js.industry_id = i.industry_id
      JOIN address a ON js.address_id = a.address_id
      WHERE js.user_id = $1
    `, [userId]);

    const jobSeeker = jobSeekerData.rows[0] || {};

    // Query to fetch job experiences
    const jobExperienceData = await pool.query(`
      SELECT
        je.*,
        jt.job_title
      FROM job_experience je
      JOIN job_titles jt ON je.jobtitle_id = jt.jobtitle_id
      WHERE je.user_id = $1
    `, [userId]);

    const jobExperiences = jobExperienceData.rows.map(exp => ({
      jobTitleId: exp.jobtitle_id || 'Not Provided',
      jobTitleName: exp.job_title || 'Not Provided',
      salary: exp.salary  || 'Not Provided',
      companyName: exp.company || 'Not Provided',
      location: exp.location  || 'Not Provided',
      startDate: exp.start_date || 'Not Provided',
      endDate: exp.end_date || 'Not Provided',
      description: exp.description || 'Not Provided',
    }));

    // Query to fetch job seeker skills
    const skillData = await pool.query(`
      SELECT
        s.skill_id, 
        s.skill_name 
        FROM js_skills jss
        JOIN skills s ON jss.skill_id = s.skill_id
      WHERE jss.user_id = $1
    `, [userId]);

    const skills = skillData.rows.map(skill => ({
      skillId: skill.skill_id || 'Not Provided',
      skillName: skill.skill_name || 'Not Provided',
    }));

    const EducationsData = await pool.query(`
      SELECT
        e.education_id, 
        e.education_name 
        FROM js_education je
        JOIN educations e ON je.education_id = e.education_id
      WHERE je.user_id = $1
    `, [userId]);

    const educations = EducationsData.rows.map(educations => ({
      educationId: educations.education_id || 'Not Provided',
      educationName: educations.education_name || 'Not Provided',
    }));


    res.json({
      jobSeeker: {
        fullName: jobSeeker.full_name || 'Not Provided',
        phoneNumber: jobSeeker.phone_number || 'Not Provided',
        dateOfBirth: jobSeeker.date_of_birth || 'Not Provided',
        gender: jobSeeker.gender || 'Not Provided',
        industry_id: jobSeeker.industry_id || 'Not Provided',
        industry_name: jobSeeker.industry_name || 'Not Provided',
        address_id: jobSeeker.address_id || 'Not Provided',
        address_name: jobSeeker.location || 'Not Provided',
        experiences: jobExperiences,
        skills: skills, 
        educations: educations
      },
    });
  } catch (error) {
    console.error('Error fetching job seeker data:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/update-jobseeker-profile/:userId', async (req, res) => {
  const client = await pool.connect();
  try {
    const { userId } = req.params;
    const {
      fullName,
      phoneNumber,
      dateOfBirth,
      gender,
      industry_id,
      educations,
      address_id,
      experiences,
      skills
    } = req.body;

    console.log('Received experiences:', experiences);

    if (!userId || isNaN(parseInt(userId))) {
      return res.status(400).json({ error: 'Invalid or missing userId' });
    }

    await client.query('BEGIN');

    // Update job seeker profile
    await client.query(`
      UPDATE job_seekers
      SET full_name = $1,
          phone_number = $2,
          date_of_birth = $3,
          gender = $4,
          industry_id = $5,
          address_id = $6
      WHERE user_id = $7
    `, [fullName, phoneNumber, dateOfBirth, gender, industry_id, address_id, userId]);

    // Update job experiences
    if (experiences && Array.isArray(experiences)) {
      await client.query(`DELETE FROM job_experience WHERE user_id = $1`, [userId]);
      for (const exp of experiences) {
        if (!exp.jobTitle) {
          throw new Error(`Job title ID is required for all experiences.`);
        }
        await client.query(`
          INSERT INTO job_experience (user_id, jobtitle_id, salary, company, location, start_date, end_date, description)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [userId, exp.jobTitle, exp.salary, exp.company, exp.location, exp.startDate, exp.endDate, exp.description]);
      }
    }

    // Update skills
    if (skills && Array.isArray(skills)) {
      await client.query(`DELETE FROM js_skills WHERE user_id = $1`, [userId]);
      for (const skillId of skills) {
        await client.query(`
          INSERT INTO js_skills (user_id, skill_id)
          VALUES ($1, $2)
        `, [userId, skillId]);
      }
    }

    // Update educations
    if (educations && Array.isArray(educations)) {
      await client.query(`DELETE FROM js_education WHERE user_id = $1`, [userId]);
      for (const education_id of educations) {
        await client.query(`
          INSERT INTO js_education (user_id, education_id)
          VALUES ($1, $2)
        `, [userId, education_id]);
      }
    }

    await client.query('COMMIT');
    res.json({ message: 'Job seeker profile updated successfully' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating job seeker profile:', error.message);
    res.status(500).json({ error: 'Server error: ' + error.message });
  } finally {
    client.release();
  }
});

//fetch info for admin update
router.get('/fetchjobseeker-profileadmin/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id || isNaN(parseInt(user_id))) {
      return res.status(400).json({ error: 'Invalid or missing userId' });
    }

    // Query to fetch job seeker profile data, skills, and job experiences
    const jobSeekerData = await pool.query(`
      SELECT 
        js.*, 
        i.industry_name, 
        a.location
      FROM job_seekers js
      JOIN industries i ON js.industry_id = i.industry_id
      JOIN address a ON js.address_id = a.address_id
      WHERE js.user_id = $1
    `, [user_id]);

    const jobSeeker = jobSeekerData.rows[0] || {};

    const jobExperienceData = await pool.query(`
      SELECT
        je.*,
        jt.job_title
      FROM job_experience je
      JOIN job_titles jt ON je.jobtitle_id = jt.jobtitle_id
      WHERE je.user_id = $1
    `, [user_id]);

    const jobExperiences = jobExperienceData.rows.map(exp => ({
      jobTitleId: exp.jobtitle_id || 'Not Provided',
      jobTitleName: exp.job_title || 'Not Provided',
      salary: exp.salary  || 'Not Provided',
      companyName: exp.company || 'Not Provided',
      location: exp.location  || 'Not Provided',
      startDate: exp.start_date || 'Not Provided',
      endDate: exp.end_date || 'Not Provided',
      description: exp.description || 'Not Provided',
    }));

    // Query to fetch job seeker skills
    const skillData = await pool.query(`
      SELECT
        s.skill_id, 
        s.skill_name 
        FROM js_skills jss
        JOIN skills s ON jss.skill_id = s.skill_id
      WHERE jss.user_id = $1
    `, [user_id]);

    const skills = skillData.rows.map(skill => ({
      skillId: skill.skill_id || 'Not Provided',
      skillName: skill.skill_name || 'Not Provided',
    }));

    const EducationsData = await pool.query(`
      SELECT
        e.education_id, 
        e.education_name 
        FROM js_education je
        JOIN educations e ON je.education_id = e.education_id
      WHERE je.user_id = $1
    `, [user_id]);

    const educations = EducationsData.rows.map(educations => ({
      educationId: educations.education_id || 'Not Provided',
      educationName: educations.education_name || 'Not Provided',
    }));

    res.json({
      jobSeeker: {
        fullName: jobSeeker.full_name || 'Not Provided',
        phoneNumber: jobSeeker.phone_number || 'Not Provided',
        dateOfBirth: jobSeeker.date_of_birth || 'Not Provided',
        gender: jobSeeker.gender || 'Not Provided',
        industry_id: jobSeeker.industry_id || 'Not Provided',
        industry_name: jobSeeker.industry_name || 'Not Provided',
        address_id: jobSeeker.address_id || 'Not Provided',
        address_name: jobSeeker.location || 'Not Provided',
        experiences: jobExperiences,
        skills: skills, 
        educations: educations
      },
    });
  } catch (error) {
    console.error('Error fetching job seeker data:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/job-seeker/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

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
	    JOIN users u ON js.user_id = u.user_id
      LEFT JOIN address a ON js.address_id = a.address_id
      LEFT JOIN industries i ON js.industry_id = i.industry_id
      LEFT JOIN profilepictures pp ON js.user_id = pp.user_id
      WHERE js.user_id = $1
    `, [userId]);
    
    // Query job experience data
    const jobExperienceData = await pool.query(`
      SELECT je.jobtitle_id, jt.job_title, je.company, je.start_date, je.end_date, je.description, je.salary
      FROM job_experience je
      JOIN job_titles jt ON je.jobtitle_id = jt.jobtitle_id
      WHERE je.user_id = $1
    `, [userId]);

    // Query skills data
    const skillsData = await pool.query(`
      SELECT s.skill_name
      FROM js_skills jss
      JOIN skills s ON jss.skill_id = s.skill_id
      WHERE jss.user_id = $1
    `, [userId]);

    // Query skills data
    const educationData = await pool.query(`
      SELECT e.education_name
      FROM js_education je
      JOIN educations e ON je.education_id = e.education_id
      WHERE je.user_id = $1
    `, [userId]);

    // Aggregate job experiences
    const jobExperiences = jobExperienceData.rows.map(exp => ({
      job_title: exp.job_title || 'Not Specified',
      company: exp.company || 'Not Specified',
      start_date: exp.start_date ? new Date(exp.start_date).toLocaleDateString() : 'Not Provided',
      end_date: exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Not Provided',
      description: exp.description || 'No Description',
      salary: exp.salary || 'Not Provided'
    }));

    // Process job seeker data
    const jobSeeker = jobSeekerData.rows[0] || {};
    const jobTitle = jobExperiences.length > 0 ? jobExperiences[0].job_title : 'Not Specified';
    res.json({
      jobSeeker: {
        full_name: jobSeeker.full_name || 'Not Provided',
        email: jobSeeker.email || 'Not Provided',
        phone_number: jobSeeker.phone_number || 'Not Provided',
        date_of_birth: jobSeeker.date_of_birth ? new Date(jobSeeker.date_of_birth).toLocaleDateString() : null,
        gender: jobSeeker.gender || 'Not Specified',
        address: jobSeeker.location || 'Address not provided',
        industry: jobSeeker.industry_name || 'Industry not provided',
        image: jobSeeker.profile_picture_url  || 'No Image',
        job_title: jobTitle 
      },
      jobExperience: jobExperiences, 
      skills: skillsData.rows,
      educations: educationData.rows
    });
  } catch (error) {
    console.error('Error fetching job seeker data:', error.message);
    res.status(500).send('Server error');
  }
});

// fetching jobseeker's joblistings
router.get('/getUserJobListings', async (req, res) => {
  const userId = req.query.user_id;

  console.log(`User ID received: ${userId}`);
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const query = `
     SELECT 
      jl.job_id,
      jl.user_id AS emp_id,
      emp.company_name,
      a.application_id,
      pp.profile_picture_url,
	    jl.status AS job_status,
      jt.job_title,
      a.date_applied,
      a.status,
      a.user_id AS js_id
    FROM applications a
    JOIN joblistings jl ON a.job_id = jl.job_id
    JOIN emp_profiles emp ON jl.user_id = emp.user_id
    LEFT JOIN profilepictures pp ON jl.user_id = pp.user_id
    JOIN job_titles jt ON jl.jobtitle_id = jt.jobtitle_id
    WHERE a.user_id = $1
  `;

  try {
    const result = await pool.query(query, [userId]);
    console.log('Backend Query Result:', result.rows);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching job listings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//delete applications
router.delete('/deleteApplication', async (req, res) => {
  const { application_id } = req.query; 
  try {
    await pool.query(
      'DELETE FROM applications WHERE application_id = $1',
      [application_id]
    );
    res.status(200).json({ message: 'Application deleted successfully' });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//get emp joblistings
router.get('/jsempjoblistings/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const EmpJoblisting = await pool.query(`
      SELECT 
        jl.job_id,
        jl.jobtitle_id,
        jt.job_title,
        pp.profile_picture_url
      FROM joblistings jl
      JOIN job_titles jt ON jl.jobtitle_id = jt.jobtitle_id
      LEFT JOIN profilepictures pp ON jl.user_id = pp.user_id
      WHERE jl.user_id = $1
    `, [userId]);

    res.status(200).json(EmpJoblisting.rows);
  } catch (error) {
    console.error('Error fetching job listings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


//archive jobseeker
async function deleteUserAndArchive(userId, password) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Verify password
    const res = await client.query('SELECT password FROM users WHERE user_id = $1', [userId]);
    if (res.rows.length === 0 || res.rows[0].password !== password) {
      throw new Error('Invalid password');
    }

    // Archive job seekers data
    await client.query(`
      INSERT INTO archived_job_seekers (user_id, full_name, phone_number, date_of_birth, gender, address_id, industry_id)
      SELECT user_id, full_name, phone_number, date_of_birth, gender, address_id, industry_id
      FROM job_seekers
      WHERE user_id = $1
    `, [userId]);

    // Archive job experience data
    await client.query(`
      INSERT INTO archived_job_experience (user_id, jobtitle_id, salary, company, location, start_date, end_date, description)
      SELECT user_id, jobtitle_id, salary, company, location, start_date, end_date, description
      FROM job_experience
      WHERE user_id = $1
    `, [userId]);

    // Archive job skills data
    await client.query(`
      INSERT INTO archived_js_skills (skill_id, user_id)
      SELECT skill_id, user_id
      FROM js_skills
      WHERE user_id = $1
    `, [userId]);

    await client.query(`
      INSERT INTO archived_users (user_id, email, password, usertype, approve, datecreated, is_verified, is_complete)
      SELECT user_id, email, password, usertype, approve, datecreated, is_verified, is_complete
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

    // Delete from original tables
    await client.query('DELETE FROM job_seekers WHERE user_id = $1', [userId]);
    await client.query('DELETE FROM job_experience WHERE user_id = $1', [userId]);
    await client.query('DELETE FROM js_skills WHERE user_id = $1', [userId]);
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
    res.status(200).json({ message: 'Account deactivated successfully.' });
  } else {
    res.status(400).json({ message: result.error });
  }
});


module.exports = router;
