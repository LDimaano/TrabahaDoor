const express = require('express');
const router = express.Router();
const pool = require('../db');


// Registration endpoint
router.post('/submit-form', async (req, res) => {
  const { email, password, usertype } = req.body;


  // Validate input
  if (!email || !password || !usertype) {
    return res.status(400).json({ error: 'All fields are required' });
  }


  try {
    // Insert user into database
    const query = 'INSERT INTO users (email, password, usertype) VALUES ($1, $2, $3) RETURNING user_id';
    const values = [email, password, usertype];
    const result = await pool.query(query, values);
    const userId = result.rows[0].user_id;


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


      console.log('Session created:', req.session); // Log the session
      res.status(201).json({
        message: 'User registered successfully',
        userId,
        user: { user_id: userId, email, usertype }
      });
    });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Email is already in use.' });
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
