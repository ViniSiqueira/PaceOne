const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',        
  host: 'localhost',       
  database: 'pace_one_prd',
  password: 'postgres',
  port: 5433,             
});

module.exports = pool;
