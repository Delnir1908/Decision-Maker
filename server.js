// load .env data into process.env
require('dotenv').config();
const db = require('./db');

// Web server config
const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require('./routes/users-api');
const widgetApiRoutes = require('./routes/widgets-api');
const usersRoutes = require('./routes/users');

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
// Note: Endpoints that return data (eg. JSON) usually start with `/api`
app.use('/api/users', userApiRoutes);
app.use('/api/widgets', widgetApiRoutes);
app.use('/users', usersRoutes);
// Note: mount other resources here, using the same pattern above

// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/:id', async (req, res) => {
  try {
    const pollId = req.params.id;
    const pollQuery = 'SELECT title FROM polls WHERE id = $1';
    const pollResult = await db.pool.query(pollQuery, [pollId]);
    if (pollResult.rows.length === 0) {
      return res.status(404).send("Poll not found");
    }
    const optionsQuery = 'SELECT id, name FROM options WHERE poll_id = $1';
    const optionsResult = await db.pool.query(optionsQuery, [pollId]);
    res.render('vote', {
      pollTitle: pollResult.rows[0].title,
      options: optionsResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get('/:id/voted', async (req, res) => {
  const pollId = req.params.id;
  const poll = await db.getPollById(pollId);
  res.render('voted', { pollId, pollTitle: poll.title });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
