const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
app.use(express.json());

const pool = new Pool({
  user: process.env.REDSHIFT_USER,
  host: process.env.REDSHIFT_HOST,
  database: process.env.REDSHIFT_DATABASE,
  password: process.env.REDSHIFT_PASSWORD,
  port: 5439,
});

app.get('/api/company_page', async (req, res) => {
    try {
      const queryResult = await pool.query(`SELECT name, industries, round, amount, round_valuation_usd, growth_stage, launch_year, total_rounds_number, current_company_valuation FROM coadata.master_table_stg`);
      res.json(queryResult.rows); 
    } catch (err) {
      console.error('Error executing query:', err.stack);
    res.status(500).send('Error fetching data'); 
    }
  });

app.get('/api/map', async (req, res) => {
    try {
      const queryResult = await pool.query(`SELECT latitude, longitude FROM coadata.locations`);
      res.json(queryResult.rows); 
    } catch (err) {
      console.error('Error executing query:', err.stack);
      res.status(500).send('Error fetching data'); 
    }
  });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;

