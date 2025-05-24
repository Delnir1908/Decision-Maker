require('dotenv').config();
const fs = require('fs');
const chalk = require('chalk');
const { Client } = require('pg');

const runResetDB = async () => {
  try {
    console.log(chalk.cyan(`-> Connecting to PG on ${process.env.DB_HOST} as ${process.env.DB_USER}...`));

    // Connect to default "postgres" DB to drop/create app DB
    const rootClient = new Client({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT,
      database: 'postgres'
    });
    await rootClient.connect();

    // Terminate connections, drop, and recreate the database
    await rootClient.query(`
      SELECT pg_terminate_backend(pid)
      FROM pg_stat_activity
      WHERE datname = '${process.env.DB_NAME}' AND pid <> pg_backend_pid();
    `);
    await rootClient.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);
    await rootClient.query(`CREATE DATABASE ${process.env.DB_NAME}`);
    await rootClient.end();

    //Connect to app DB
    const client = new Client({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME
    });
    await client.connect();

    // Load only the single schema.sql file
    console.log(chalk.cyan(`-> Loading Schema File ...`));
    const sql = fs.readFileSync('./db/schema/schema.sql', 'utf8');
    console.log(`\t-> Running ${chalk.green('schema.sql')}`);
    await client.query(sql);

    await client.end();
    console.log(chalk.green('Database reset successful!'));
    process.exit();
  } catch (err) {
    console.error(chalk.red(`Failed due to error: ${err}`));
    process.exit(1);
  }
};

runResetDB();
