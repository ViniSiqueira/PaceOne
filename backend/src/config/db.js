const { Pool } = require('pg');

const pool = new Pool({
  user: 'paceone',        
  host: 'localhost',       
  database: 'PACE_ONE_PRD',
  password: 'paceOne1010',
  port: 5432,             
});

module.exports = pool;
