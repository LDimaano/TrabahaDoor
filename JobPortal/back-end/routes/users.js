const express = require('express');
const router = express.Router();
const pool = require('../db');
const jwt = require('jsonwebtoken');
const {sendVerificationEmail} = require('../mailer'); 
const SECRET_KEY = process.env.JWT_SECRET_KEY;

router.post('/submit-form', async (req, res) => {
  const { email, password, usertype } = req.body;

  // Validate input
  if (!email || !password || !usertype) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Insert user into the database
    const query = 'INSERT INTO users (email, password, usertype, is_verified) VALUES ($1, $2, $3, false) RETURNING user_id';
    const values = [email, password, usertype];
    const result = await pool.query(query, values);
    const userId = result.rows[0].user_id;

    // Generate a verification token
    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1d' });

    console.log(`the token for verification: ${token}`);
    // Create a verification link
    const verificationLink = `https://trabahadoor-front-end.onrender.com/verify-email?token=${token}`;

    // Send the verification email
    await sendVerificationEmail(email, verificationLink); 

    // Set session data
    req.session.user = {
      user_id: userId,
      email,
      usertype,
    };

    // Save the session and send a response
    req.session.save(err => {
      if (err) {
        console.error('Error saving session:', err);
        return res.status(500).json({ message: 'Session save error' });
      }

      res.status(201).json({
        message: 'User registered successfully. Please check your email to verify your account.',
        userId,
        user: { user_id: userId, email, usertype },
      });
    });
  } catch (error) {
    if (error.code === '23505') {  
      res.status(409).json({ error: 'Email is already in use.' });
    } else {
      console.error('Error inserting data:', error);
      res.status(500).json({ error: 'Server error. Please try again later.' });
    }
  }
});


router.get('/verify-email', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  try {
    // Verify the token and decode it
    const decoded = jwt.verify(token, SECRET_KEY);
    const email = decoded.email;

    const result = await pool.query(
      'UPDATE users SET is_verified = true WHERE email = $1 RETURNING *',
      [email] 
    );

    if (result.rowCount === 0) {  
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ message: 'Email verified successfully!' });
  } catch (error) {
    console.log('Error verifying token:', error); 
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
});

async function reactivateJobSeeker(archivedUser) {
  // Step 1: Reactivate the user by inserting them into the active users table first
  await pool.query(
    `INSERT INTO users (user_id, email, password, usertype, approve, datecreated, is_verified, is_complete)
     SELECT user_id, email, password, usertype, approve, datecreated, is_verified, is_complete
     FROM archived_users
     WHERE user_id = $1`, 
    [archivedUser.user_id]
  );

  // Step 2: Transfer profile picture to the active table
  await pool.query(`
    INSERT INTO profilepictures (user_id, profile_picture_url)
    SELECT user_id, profile_picture_url
    FROM archived_profilepictures
    WHERE user_id = $1
  `, [archivedUser.user_id]);

  // Step 3: Insert data into active tables (job_seekers, js_skills, etc.)
  await pool.query(
    `INSERT INTO job_seekers (user_id, full_name, phone_number, date_of_birth, gender, address_id, industry_id)
     SELECT user_id, full_name, phone_number, date_of_birth, gender, address_id, industry_id
     FROM archived_job_seekers
     WHERE user_id = $1`, 
    [archivedUser.user_id]
  );

  await pool.query(`
    INSERT INTO job_experience (user_id, jobtitle_id, salary, company, location, start_date, end_date, description)
    SELECT user_id, jobtitle_id, salary, company, location, start_date, end_date, description
    FROM archived_job_experience
    WHERE user_id = $1
  `, [archivedUser.user_id]);

  
  await pool.query(
    `INSERT INTO js_skills (skill_id, user_id)
     SELECT skill_id, user_id
     FROM archived_js_skills
     WHERE user_id = $1`, 
    [archivedUser.user_id]
  );

  // Step 4: Delete related data from archived tables (this ensures no foreign key issues)
  await pool.query('DELETE FROM archived_profilepictures WHERE user_id = $1', [archivedUser.user_id]);
  await pool.query('DELETE FROM archived_js_skills WHERE user_id = $1', [archivedUser.user_id]);
  await pool.query('DELETE FROM archived_job_experience WHERE user_id = $1', [archivedUser.user_id]);
  await pool.query('DELETE FROM archived_job_seekers WHERE user_id = $1', [archivedUser.user_id]);
  await pool.query('DELETE FROM archived_joblistings WHERE user_id = $1', [archivedUser.user_id]);

  // Step 5: Finally, delete the user from the archived_users table
  await pool.query('DELETE FROM archived_users WHERE user_id = $1', [archivedUser.user_id]);
}


async function reactivateEmployer(archivedUser) {

  await pool.query(`
    INSERT INTO users (user_id, email, password, usertype, approve, datecreated, is_verified, is_complete)
    SELECT user_id, email, password, usertype, approve, datecreated, is_verified, is_complete
    FROM archived_users
     WHERE user_id = $1
  `, [archivedUser.user_id]);

  // Step 3: Transfer profile picture to the active table
  await pool.query(`
    INSERT INTO profilepictures (user_id, profile_picture_url)
    SELECT user_id, profile_picture_url
    FROM archived_profilepictures
    WHERE user_id = (SELECT user_id FROM archived_users WHERE user_id = $1)
  `, [archivedUser.user_id]);

  // Step 4: Insert employer profile data into the active tables
  await pool.query(`
    INSERT INTO emp_profiles (user_id, company_name, contact_person, contact_number, website, industry_id, company_address, company_size, founded_year, description)
    SELECT user_id, company_name, contact_person, contact_number, website, industry_id, company_address, company_size, founded_year, description
    FROM archived_emp_profiles
    WHERE user_id = (SELECT user_id FROM archived_users WHERE user_id = $1)
  `, [archivedUser.user_id]);

  // Step 5: Insert job listings into the active tables
  await pool.query(`
    INSERT INTO joblistings (job_id, user_id, jobtitle_id, industry_id, salaryrange, jobtype, responsibilities, jobdescription, qualifications, datecreated, datefilled)
    SELECT job_id, user_id, jobtitle_id, industry_id, salaryrange, jobtype, responsibilities, jobdescription, qualifications, datecreated, datefilled
    FROM archived_joblistings
    WHERE user_id = (SELECT user_id FROM archived_users WHERE user_id = $1)
  `, [archivedUser.user_id]);

  // Step 6: Insert job skills into the active tables
  await pool.query(`
    INSERT INTO job_skills (job_id, skill_id, user_id)
    SELECT job_id, skill_id, user_id
    FROM archived_job_skills
    WHERE user_id = (SELECT user_id FROM archived_users WHERE user_id = $1)
  `, [archivedUser.user_id]);

  await pool.query('DELETE FROM archived_profilepictures WHERE user_id = $1', [archivedUser.user_id]);
  await pool.query('DELETE FROM archived_job_skills WHERE user_id = $1', [archivedUser.user_id]);
  await pool.query('DELETE FROM archived_joblistings WHERE user_id = $1', [archivedUser.user_id]);
  await pool.query('DELETE FROM archived_emp_profiles WHERE user_id = $1', [archivedUser.user_id]);
  await pool.query('DELETE FROM archived_users WHERE user_id = $1', [archivedUser.user_id]);

  return { success: true };
}



// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check active users
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    let { rows } = await pool.query(userQuery, [email]);
    let user = rows[0];

    if (!user) {
      // Check archived users if not found in active users
      const archivedUserQuery = 'SELECT * FROM archived_users WHERE email = $1';
      const archivedResult = await pool.query(archivedUserQuery, [email]);

      if (archivedResult.rows.length === 0) {
        return res.status(400).json({ message: 'Invalid Email Or Password' });
      }

      const archivedUser = archivedResult.rows[0];

      // Check plain text password match for archived user
      if (password !== archivedUser.password) {
        return res.status(400).json({ message: 'Invalid Email Or Password' });
      }

      // Reactivate user and move them to the active tables
      await pool.query('BEGIN');
      try {
        if (archivedUser.usertype === 'jobseeker') {
          await reactivateJobSeeker(archivedUser);
        } else if (archivedUser.usertype === 'employer') {
          await reactivateEmployer(archivedUser);
        }
        await pool.query('DELETE FROM archived_users WHERE user_id = $1', [archivedUser.user_id]);
        await pool.query('COMMIT');
      } catch (err) {
        await pool.query('ROLLBACK');
        throw err;
      }
      // Treat reactivated user as active
      user = archivedUser;
    }

    // Validate plain text password for active users
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid Email Or Password' });
    }

    // Set session for authenticated user
    req.session.user = { user_id: user.user_id, email: user.email, usertype: user.usertype };

    // Determine redirect URL based on usertype and account status
    const redirectUrl = (() => {
      if (user.usertype === 'jobseeker') {
          // Reactivated users go to home_jobseeker
          return user.is_complete && user.is_verified ? '/home_jobseeker' : `/j_profilecreation/${user.user_id}`;
      } else if (user.usertype === 'employer') {
          // Check if the user is verified first
          if (user.is_verified) {
              // Check if the user's profile is complete
              if (user.is_complete) {
                  // Check approval status
                  if (user.approve === 'no') {
                      return '/waitapproval';  // Awaiting approval
                  }
                  if (user.approve === 'yes') {
                      return '/home_employer';  // Approved, go to home
                  }
              } else {
                  // If profile is not complete, go to profile creation
                  return `/e_profilecreation/${user.user_id}`;
              }
          } else {
              // If the user is not verified, go to unverified account page
              return '/unverified-account';
          }
      } else {
          return '/admindashboard';  // Default for admin
      }
  })();  
    res.json({ redirectUrl, user });
  } catch (err) {
    console.error('Server error during login:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Logout endpoint
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error destroying session:', err);
      return res.status(500).json({ message: 'Failed to log out' });
    }
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out successfully' });
  });
});


module.exports = router;
