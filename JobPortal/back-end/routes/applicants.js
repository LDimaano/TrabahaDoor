const express = require('express');
const router = express.Router();
const pool = require('../db');

router.get('/applicantlist', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        job_seekers.jsid,
        job_seekers.full_name, 
        users.email, 
        job_seekers.address
      FROM job_seekers
      JOIN users ON job_seekers.user_id = users.user_id
    `);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching job listings:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
