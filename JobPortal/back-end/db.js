const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'trabahadoor',
    password: 'password',
    port: 5432,
  });

module.exports = pool;
