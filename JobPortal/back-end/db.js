const { Pool } = require('pg');
const { connectionString } = require('pg/lib/defaults');
require("dotenv").config();

// const devConfig = {
//     user: process.env.PG_USER,
//     host: process.env.PG_HOST,
//     database: process.env.PG_DATABASE,
//     password: process.env.PG_PASSWORD,
//     port: process.env.PG_PORT,
// }

const devConfig = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`

const proConfig = process.env.DATABASE_URL

const pool = new Pool({
  connectionString : process.env.NODE_ENV === "production" ? proConfig : devConfig
});

module.exports = pool;
