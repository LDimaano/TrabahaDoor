const express = require('express');
const router = express.Router();
const pool = require('../db');

// Create a new application
router.post('/', async (req, res) => {
  const { jobID, seekerID, info, status } = req.body;
  try {
    const newApplication = await pool.query(
      'INSERT INTO Application (JobID, SeekerID, Info, Status) VALUES ($1, $2, $3, $4) RETURNING *',
      [jobID, seekerID, info, status]
    );
    res.json(newApplication.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all applications
router.get('/', async (req, res) => {
  try {
    const applications = await pool.query('SELECT * FROM Application');
    res.json(applications.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get an application by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const application = await pool.query('SELECT * FROM Application WHERE ApplicationID = $1', [id]);
    res.json(application.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update an application
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { jobID, seekerID, info, status } = req.body;
  try {
    const updateApplication = await pool.query(
      'UPDATE Application SET JobID = $1, SeekerID = $2, Info = $3, Status = $4 WHERE ApplicationID = $5 RETURNING *',
      [jobID, seekerID, info, status, id]
    );
    res.json(updateApplication.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete an application
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Application WHERE ApplicationID = $1', [id]);
    res.json({ message: 'Application deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
