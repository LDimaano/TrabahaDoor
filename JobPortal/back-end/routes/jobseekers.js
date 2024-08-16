const express = require('express');
const router = express.Router();
const pool = require('../db');

// Create a new jobseeker
router.post('/', async (req, res) => {
  const { resumeID, fullName, phoneNumber, email, dob, gender, address, userID } = req.body;
  try {
    const newJobSeeker = await pool.query(
      'INSERT INTO JobSeeker (ResumeID, FullName, PhoneNumber, Email, DOB, Gender, Address, UserID) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [resumeID, fullName, phoneNumber, email, dob, gender, address, userID]
    );
    res.json(newJobSeeker.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all jobseekers
router.get('/', async (req, res) => {
  try {
    const jobSeekers = await pool.query('SELECT * FROM JobSeeker');
    res.json(jobSeekers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get a jobseeker by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const jobSeeker = await pool.query('SELECT * FROM JobSeeker WHERE SeekerID = $1', [id]);
    res.json(jobSeeker.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a jobseeker
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { resumeID, fullName, phoneNumber, email, dob, gender, address, userID } = req.body;
  try {
    const updateJobSeeker = await pool.query(
      'UPDATE JobSeeker SET ResumeID = $1, FullName = $2, PhoneNumber = $3, Email = $4, DOB = $5, Gender = $6, Address = $7, UserID = $8 WHERE SeekerID = $9 RETURNING *',
      [resumeID, fullName, phoneNumber, email, dob, gender, address, userID, id]
    );
    res.json(updateJobSeeker.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a jobseeker
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM JobSeeker WHERE SeekerID = $1', [id]);
    res.json({ message: 'JobSeeker deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
