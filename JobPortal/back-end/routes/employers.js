const express = require('express');
const router = express.Router();
const pool = require('../db');

// Create a new employer
router.post('/', async (req, res) => {
  const { companyName, location, industry, dateFounded, description, userID } = req.body;
  try {
    const newEmployer = await pool.query(
      'INSERT INTO Employer (CompanyName, Location, Industry, DateFounded, Description, UserID) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [companyName, location, industry, dateFounded, description, userID]
    );
    res.json(newEmployer.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get all employers
router.get('/', async (req, res) => {
  try {
    const employers = await pool.query('SELECT * FROM Employer');
    res.json(employers.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get an employer by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const employer = await pool.query('SELECT * FROM Employer WHERE EmployerID = $1', [id]);
    res.json(employer.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Update an employer
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { companyName, location, industry, dateFounded, description, userID } = req.body;
  try {
    const updateEmployer = await pool.query(
      'UPDATE Employer SET CompanyName = $1, Location = $2, Industry = $3, DateFounded = $4, Description = $5, UserID = $6 WHERE EmployerID = $7 RETURNING *',
      [companyName, location, industry, dateFounded, description, userID, id]
    );
    res.json(updateEmployer.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Delete an employer
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Employer WHERE EmployerID = $1', [id]);
    res.json({ message: 'Employer deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
