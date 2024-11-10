const express = require('express');
const router = express.Router();
const pool = require('../db');


// Registration endpoint
const jwt = require('jsonwebtoken');
const sendVerificationEmail = require('../mailer'); // Ensure you have this file set up
const SECRET_KEY = process.env.JWT_SECRET_KEY; 
// Replace this with an environment variable for security
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
    
    // Create a verification link
    const verificationLink = `https://trabahadoor-front-end.onrender.com/verify-email?token=${token}`;

    // Send the verification email
    sendVerificationEmail(email, verificationLink); // Pass the `email` directly from `req.body`

    // Set session data
    req.session.user = {
      user_id: userId,
      email,
      usertype
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
        user: { user_id: userId, email, usertype }
      });
    });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Email is already in use.' });
  }
});


router.get('/api/verify-email', async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const email = decoded.email;

    // Update user's `isVerified` status in the database
    await User.update({ isVerified: true }, { where: { email } });

    res.status(200).json({ message: 'Email verified successfully!' });
  } catch (error) {
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

      console.log('Session created:', req.session); // Log the session
      const redirectUrl = (() => {
        if (user.usertype === 'jobseeker') {
          return '/home_jobseeker';
        } else if (user.usertype === 'employer') {
          // Check the approve status for employers
          return user.approve === 'no' ? '/waitapproval' : '/home_employer';
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
          approve: user.approve // Include approve in response
        }
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


    // Clear the session cookie
    res.clearCookie('connect.sid');
    res.status(200).json({ message: 'Logged out successfully' });
  });
});


module.exports = router;
