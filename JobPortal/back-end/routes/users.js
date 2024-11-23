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

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists in the database
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(userQuery, [email]);

    // If no user is found
    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid Email Or Password' });
    }

    const user = rows[0];

    // Compare the passwords
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid Email Or Password' });
    }

    // Set session data
    req.session.user = {
      user_id: user.user_id,
      email: user.email,
      usertype: user.usertype,
    };

    console.log('user id: ', req.session.user.user_id);

    // Save session and handle redirection
    await req.session.save(err => {
      if (err) {
        console.error('Error saving session:', err);
        return res.status(500).json({ message: 'Session save error' });
      }

      // Determine redirect URL based on user data
      const redirectUrl = (() => {
        if (user.usertype === 'jobseeker') {
          if (user.is_complete && user.is_verified) {
            return '/home_jobseeker';
          } else if (!user.is_complete && user.is_verified) {
            return `/j_profilecreation/${user.user_id}`;
          } else {
            return '/unverified-account';
          }
        } else if (user.usertype === 'employer') {
          if (user.is_verified) {
            if (user.is_complete) {
              if (user.approve === 'yes') {
                return '/home_employer';
              } else if (user.approve === 'no') {
                return '/waitapproval';
              }else if (user.approve === 'rejected') {
                return '/resubmitemployerfiles';
            }
            } else {
              return `/e_profilecreation/${user.user_id}`;
            }
          } else {
            return '/unverified-account';
          }        
        } else {
          return '/admindashboard';
        }
      })();

      res.json({
        redirectUrl,
        user: {
          user_id: user.user_id,
          email: user.email,
          usertype: user.usertype,
          approve: user.approve, 
        },
      });
    });
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
