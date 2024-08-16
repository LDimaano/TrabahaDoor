const express = require('express');
const router = express.Router();
const pool = require('../db');

// Create a new job listing
router.post('/', async (req, res) => {
  const { employerID, jobTitle, description, qualification, responsibility, salary, employmentType, categories, skills, datePosted, dateFilled } = req.body;
  try {
    const newJob = await pool.query(
      'INSERT INTO JobListing (EmployerID, JobTitle, Description, Qualification, Responsibility, Salary, EmploymentType, Categories, Skills, DatePosted, DateFilled) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *',
      [employerID, jobTitle, description, qualification, responsibility, salary, employmentType, categories, skills, datePosted, dateFilled]
    );
    res.json(newJob.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all job listings
router.get('/', async (req, res) => {
  try {
    const jobs = await pool.query('SELECT * FROM JobListing');
    res.json(jobs.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get a job listing by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const job = await pool.query('SELECT * FROM JobListing WHERE JobID = $1', [id]);
    res.json(job.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update a job listing
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { employerID, jobTitle, description, qualification, responsibility, salary, employmentType, categories, skills, datePosted, dateFilled } = req.body;
  try {
    const updateJob = await pool.query(
      'UPDATE JobListing SET EmployerID = $1, JobTitle = $2, Description = $3, Qualification = $4, Responsibility = $5, Salary = $6, EmploymentType = $7, Categories = $8, Skills = $9, DatePosted = $10, DateFilled = $11 WHERE JobID = $12 RETURNING *',
      [employerID, jobTitle, description, qualification, responsibility, salary, employmentType, categories, skills, datePosted, dateFilled, id]
    );
    res.json(updateJob.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete a job listing
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM JobListing WHERE JobID = $1', [id]);
    res.json({ message: 'Job listing deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
