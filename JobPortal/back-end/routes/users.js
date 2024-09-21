const express = require('express');
const router = express.Router();
const pool = require('../db');

router.post('/submit-form', async (req, res) => {
  const { email, password, usertype } = req.body;
  if (!email || !password || !usertype) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const query = 'INSERT INTO users (email, password, usertype) VALUES ($1, $2, $3) RETURNING user_id';
    const values = [email, password, usertype];
   
    const result = await pool.query(query, values);
    const userId = result.rows[0].user_id;
    res.status(201).json({ message: 'User registered successfully', userId });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ error: 'Error inserting data' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const userQuery = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await pool.query(userQuery, [email]);

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const user = rows[0];

    // Directly compare the passwords (assuming plain text)
    if (password !== user.password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Set session data on the server-side (if needed)
    req.session.user = {
      user_id: user.user_id,
      email: user.email,
      usertype: user.usertype,
    };

    // Save session and handle errors
    req.session.save(err => {
      if (err) {
        console.error('Error saving session:', err);
        return res.status(500).json({ message: 'Session save error' });
      }

      // Determine the redirect URL
      let redirectUrl;
      if (user.usertype === 'jobseeker') {
        redirectUrl = '/home_jobseeker';
      } else if (user.usertype === 'employer') {
        redirectUrl = '/home_employer';
      } else if (user.usertype === 'admin') {
        redirectUrl = '/admindashboard';
      } else {
        redirectUrl = '/'; // Fallback case, you can customize this
      }

      // Send the user data along with the redirect URL
      res.json({ 
        redirectUrl,
        user: {
          user_id: user.user_id,
          email: user.email,
          usertype: user.usertype
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

    res.clearCookie('connect.sid'); // Clear the session cookie if you're using it
    res.status(200).json({ message: 'Logged out successfully' });
  });
});

module.exports = router;
