const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL || 'postgresql://trabahadoor_user:MqZ99x2H9cbtQFM03FtXNdyQwUDeE7am@dpg-cs4v7s08fa8c73ad2oqg-a/trabahadoor';

const pool = new Pool({
    connectionString: connectionString,
    ssl: {
        rejectUnauthorized: false,
    }
});

module.exports = pool;
