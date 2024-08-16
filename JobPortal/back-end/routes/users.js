const express = require('express');
const router = express.Router();
const pool = require('../db');

// Create a new user
router.post('/', async (req, res) => {
  const { username, password, email, userType } = req.body;
  try {
    const newUser = await pool.query(
      'INSERT INTO users (Username, Password, Email, UserType) VALUES ($1, $2, $3, $4) RETURNING *',
      [username, password, email, userType]
    );
    res.json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all users
router.get('/', async (req, res) => {
  try {
    const users = await pool.query('SELECT * FROM users');
    res.json(users.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get a user by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await pool.query('SELECT * FROM users WHERE UserID = $1', [id]);
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { username, password, email, userType } = req.body;
  try {
    const updateUser = await pool.query(
      'UPDATE users SET Username = $1, Password = $2, Email = $3, UserType = $4 WHERE UserID = $5 RETURNING *',
      [username, password, email, userType, id]
    );
    res.json(updateUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM users WHERE UserID = $1', [id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
