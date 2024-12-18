const express = require('express');
const router = express.Router();
const pool = require('../db');
const { sendActivationEmail, sendRejectionEmail } = require('../mailer');

router.get('/infoadmin/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      if (!userId || isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      const result = await pool.query(
        `
        SELECT 
            *
        FROM users
        WHERE user_id = $1
         `,
        [userId]
      );
  
      console.log('Database query result:', result.rows);
  
      if (result.rows.length > 0) {
        const { email } = result.rows[0]; 
        res.json({ email }); 
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      console.error('Error fetching company info:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

router.get('/viewusers/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      if (!userId || isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
        const result = await pool.query(
            `
            SELECT 
                u.user_id,
                u.email,
                u.usertype,
                pp.profile_picture_url,
                js.full_name,
                e.company_name
            FROM users u
            LEFT JOIN profilepictures pp ON u.user_id = pp.user_id
            LEFT JOIN job_seekers js ON u.user_id = js.user_id
            LEFT JOIN emp_profiles e ON u.user_id = e.user_id
            WHERE u.usertype IN ('jobseeker', 'employer')
			      ORDER BY u.user_id asc;
            `
        );

        console.log('Database query result:', result.rows);

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching employers:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/applicantprofile/:user_id', async (req, res) => {
    try {
      const { user_id } = req.params; 

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
        SELECT je.jobtitle_id, jt.job_title, je.company, je.start_date, je.end_date, je.description, je.salary
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

      const EducationsData = await pool.query(`
        SELECT
          e.education_id, 
          e.education_name 
          FROM js_education je
          JOIN educations e ON je.education_id = e.education_id
        WHERE je.user_id = $1
      `, [user_id]);
  
      if (jobSeekerData.rows.length === 0) {
        return res.status(404).json({ message: 'Job seeker not found' });
      }
  
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
        skills: skillsData.rows.map(skill => skill.skill_name),
        educations: EducationsData.rows.map(education => education.education_name)
      });
    } catch (error) {
      console.error('Error fetching job seeker data:', error.message);
      res.status(500).json({ error: 'Server error: Failed to fetch applicant profile data' });
    }
  });

  router.get('/employerprofile/:user_id', async (req, res) => {
    try {
        const { user_id } = req.params;

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
        `, [user_id]);

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
  
router.get('/viewemployers/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const result = await pool.query(`
      SELECT
        e.id,
        e.company_name,
        e.contact_person,
        e.user_id,
        pp.profile_picture_url
      FROM emp_profiles e
      LEFT JOIN profilepictures pp ON e.user_id = pp.user_id
      JOIN users u ON e.user_id = u.user_id
      WHERE u.approve = 'yes'
	    ORDER BY e.company_name ASC
    `);

    console.log('Database query result:', result.rows);

    res.json(result.rows.length ? result.rows : []);
  } catch (error) {
    console.error('Error fetching employers:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/viewjobseekers/:userId', async (req, res) => {
    try {
      const { userId } = req.params;

    if (!userId || isNaN(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
        const result = await pool.query(
            `
            SELECT
                j.jsid,
                j.user_id,
                j.full_name,
                pp.profile_picture_url
            FROM job_seekers j
            LEFT JOIN profilepictures pp ON j.user_id = pp.user_id
			      ORDER BY j.full_name asc
            `
        );
        console.log('Database query result:', result.rows);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching employers:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/viewjoblisting/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      if (!userId || isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
        const result = await pool.query(
            `
            SELECT 
                jl.job_id,
                pp.profile_picture_url,
                jt.job_title,
                e.contact_person,
                e.company_name
            FROM joblistings jl
            LEFT JOIN profilepictures pp ON jl.user_id = pp.user_id
            JOIN job_titles jt ON jl.jobtitle_id = jt.jobtitle_id
            JOIN emp_profiles e ON jl.user_id = e.user_id
		      	ORDER BY jt.job_title asc
            `
        );

        console.log('Database query result:', result.rows);

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching joblistings:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get('/viewapplicantlist/:userId/:jobId', async (req, res) => {
    const { userId, jobId } = req.params;
    console.log('Session data:', req.session);
    

    try {
        const result = await pool.query(
            `
            SELECT 
                jl.job_id,
                pp.profile_picture_url,
                jt.job_title,
                e.contact_person,
                e.company_name
            FROM joblistings jl
            LEFT JOIN profilepictures pp ON jl.user_id = pp.user_id
            JOIN job_titles jt ON jl.jobtitle_id = jt.jobtitle_id
            JOIN emp_profiles e ON jl.user_id = e.user_id
            `
        );

        console.log('Database query result:', result.rows);

        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching joblistings:', error);
        res.status(500).json({ message: 'Server error' });
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
              j.job_title
      FROM applications a
      JOIN users u ON a.user_id = u.user_id
      JOIN job_seekers js ON u.user_id = js.user_id
      LEFT JOIN profilepictures pp ON a.user_id = pp.user_id
      JOIN joblistings jl ON a.job_id = jl.job_id
      JOIN job_titles j ON jl.jobtitle_id = j.jobtitle_id
      WHERE a.job_id = $1`,
        [jobId]
      );
  
      res.json(result.rows);
    } catch (error) {
      console.error('Error fetching applicants:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });

  router.get('/viewdocuments/:user_id', async (req, res) => {
    const { user_id } = req.params;
    console.log("userId for view documents", user_id);

  try {
    const query = `
      SELECT 
        sec_certificate AS "SEC Certificate", 
        business_permit AS "Business Permit", 
        bir_certificate AS "BIR Certificate", 
        poea_license AS "POEA License", 
        private_recruitment_agency_license AS "Private Recruitment Agency License", 
        contract_sub_contractor_certificate AS "Contract Sub Contractor Certificate"
      FROM documents
      WHERE user_id = $1;
    `;

    const result = await pool.query(query, [user_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No documents found for this user.' });
    }

    res.json(result.rows[0]); 
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});
  

router.get('/joblistings/:jobId', async (req, res) => {
    const { jobId } = req.params;
    console.log(`Fetching job details for Job ID: ${jobId}`);
  
    const jobQuery = `
      SELECT jl.*, jt.job_title, ep.company_name, ep.website, i.industry_name, pp.profile_picture_url
      FROM joblistings jl
      JOIN job_titles jt ON jl.Jobtitle_id = jt.jobtitle_id
      JOIN emp_profiles ep ON jl.user_id = ep.user_id
      JOIN industries i ON jl.industry_id = i.industry_id
      LEFT JOIN profilepictures pp ON jl.user_id = pp.user_id
      WHERE jl.job_id = $1
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
  
  router.get('/topindustries', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
              i.industry_name, 
              COUNT(jl.job_id) AS job_count
            FROM joblistings jl
            JOIN industries i ON jl.industry_id = i.industry_id
            GROUP BY i.industry_name
            ORDER BY job_count DESC;
        `);
        
        res.json(result.rows); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/topcompanies', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT 
                e.company_name,
                COUNT(jl.job_id) AS job_count,
                pp.profile_picture_url
            FROM joblistings jl
            JOIN emp_profiles e ON jl.user_id = e.user_id
            LEFT JOIN profilepictures pp ON e.user_id = pp.user_id
            GROUP BY e.company_name, pp.profile_picture_url
            ORDER BY job_count DESC;
        `);

        res.json(result.rows); 
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

router.get('/dashboard-data', async (req, res) => {
  try {
    // Query the count of job seekers
    const jobSeekerCountQuery = 'SELECT COUNT(*) as count FROM job_seekers';
    const jobSeekerResult = await pool.query(jobSeekerCountQuery);
    console.log('Job Seeker Result:', jobSeekerResult.rows);

    // Query the count of employers
    const employerCountQuery = 'SELECT COUNT(*) as count FROM emp_profiles';
    const employerResult = await pool.query(employerCountQuery);
    console.log('Employer Result:', employerResult.rows);

    // Query the count of job listings
    const jobListingCountQuery = `
        SELECT COUNT(*) as count 
        FROM joblistings
        WHERE status = 'Hiring'`;
    const jobListingResult = await pool.query(jobListingCountQuery);
    console.log('Job Listing Result:', jobListingResult.rows);

    res.json({
      jobSeekerCount: jobSeekerResult.rows[0].count,
      employerCount: employerResult.rows[0].count,
      jobListingCount: jobListingResult.rows[0].count,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/viewarchivedusers/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
      if (!userId || isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
    const result = await pool.query(`
      SELECT
        au.user_id,
        au.email,
        au.usertype,
        app.profile_picture_url,
        ajs.full_name,
        aep.company_name
      FROM archived_users au
      LEFT JOIN archived_profilepictures app ON au.user_id = app.user_id
      LEFT JOIN archived_job_seekers ajs ON au.user_id = ajs.user_id
      LEFT JOIN archived_emp_profiles aep ON au.user_id = aep.user_id
      WHERE au.usertype IN ('jobseeker', 'employer')
    `);

    console.log('Database archived user result:', result.rows);

    res.json(result.rows.length ? result.rows : []);
  } catch (error) {
    console.error('Error fetching archived users:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/viewunapprovedemp/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
      if (!userId || isNaN(userId)) {
        return res.status(400).json({ message: 'Invalid user ID' });
      }
      const result = await pool.query(
          `
      SELECT 
        d.user_id,
        pp.profile_picture_url,
        e.company_name,
        d.sec_certificate,
        d.business_permit,
        d.bir_certificate,
        d.poea_license,
        d.private_recruitment_agency_license,
        d.contract_sub_contractor_certificate
      FROM documents d
      JOIN emp_profiles e ON d.user_id = e.user_id
      LEFT JOIN profilepictures pp ON d.user_id = pp.user_id
      JOIN users u ON d.user_id = u.user_id
      WHERE u.approve = 'no'
          `
      );

      res.json(result.rows);
  } catch (error) {
      console.error('Error fetching unapproved emp:', error);
      res.status(500).json({ message: 'Server error' });
  }
});

router.put('/approve/:userId', async (req, res) => {
    const { userId } = req.params;
    console.log(`Approved userId: ${userId}`);

    try {
        const result = await pool.query(
            `UPDATE users SET approve = 'yes' WHERE user_id = $1 RETURNING *`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result.rows[0];
        console.log('User approval result:', user);

        // Send an email to the employer that their account is activated
        await sendActivationEmail(user.email);

        res.status(200).json({ message: 'Employer approved successfully', user });
    } catch (error) {
        console.error('Error approving employer:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/reject/:userId', async (req, res) => {
  const { userId } = req.params;
  console.log('Request body:', req.body); // Debugging log

  const { reason } = req.body;

  if (!reason) {
    return res.status(400).json({ message: 'Rejection reason is required' });
  }

  console.log(`Rejecting userId: ${userId} with reason: ${reason}`);

  try {
    const result = await pool.query(
      `UPDATE users SET approve = 'rejected' WHERE user_id = $1 RETURNING *`,
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];
    console.log('User rejection result:', user);

    // Send an email to the employer that their account is rejected
    await sendRejectionEmail(user.email, reason);

    res.status(200).json({ message: 'Employer rejected successfully', user });
  } catch (error) {
    console.error('Error rejecting employer:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


router.get('/gender-distribution', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT gender, COUNT(*) AS count
      FROM job_seekers
      GROUP BY gender;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching gender distribution data:", error);
    res.status(500).json({ error: 'Database query error' });
  }
});

router.get('/location-distribution', async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT
      a.location,
      COUNT(*) as count
    FROM
      job_seekers js
    JOIN
      address a ON js.address_id = a.address_id
    GROUP BY
      a.location
	  Order by
	    count desc
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching location distribution data:", error);
    res.status(500).json({ error: 'Database query error' });
  }
});

router.get('/jsindustry-distribution', async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT
      i.industry_name,
      COUNT(*) as count
    FROM
      job_seekers js
    JOIN
      industries i ON js.industry_id = i.industry_id
    GROUP BY
      i.industry_name
	  Order BY
	    count desc
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching jobseeker industry distribution data:", error);
    res.status(500).json({ error: 'Database query error' });
  }
});

router.get('/empindustry-distribution', async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT
      i.industry_name,
      COUNT(*) as count
    FROM
      emp_profiles e
    JOIN
      industries i ON e.industry_id = i.industry_id
    GROUP BY
      i.industry_name
	  Order BY
	    count desc
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching employer industry distribution data:", error);
    res.status(500).json({ error: 'Database query error' });
  }
});



module.exports = router;