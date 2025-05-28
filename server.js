// load .env data into process.env
require('dotenv').config();
const db = require('./db');

// Web server config
const express = require('express');
const morgan = require('morgan');

//mailgun api
const FormData = require('form-data');
const Mailgun =require("mailgun.js");

const PORT = process.env.PORT || 8080;
const app = express();

app.set('view engine', 'ejs');

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const userApiRoutes = require('./routes/users-api');
const widgetApiRoutes = require('./routes/widgets-api');
const usersRoutes = require('./routes/users');
const { createPoll, addOptions } = require('./db/queries/polls');
const { idFromTitle } = require('./db/queries/id-from-title');

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

app.post('/polls', (req, res) => {
  createPoll(req.body)
    .then((pollId) => {
      return addOptions(pollId, req.body.options).then(() => pollId);
    })
    .then((pollId) => {
      res.json({ redirectTo: `/${pollId}/admin` });
    })
    .catch((error) => {
      console.error('Error creating poll:', error);
      res.status(500).send('Error creating poll.');
    });
});

app.get('/:pollId/admin', (req, res) => {
  const { pollId } = req.params;
  res.render('admin', { pollId });
})

app.get('/:id', async (req, res) => {
  try {
    const pollId = req.params.id;
    const pollQuery = 'SELECT title, requires_name FROM polls WHERE id = $1';
    const pollResult = await db.pool.query(pollQuery, [pollId]);
    if (pollResult.rows.length === 0) {
      return res.status(404).send("Poll not found");
    }
    const optionsQuery = 'SELECT id, name, description FROM options WHERE poll_id = $1';
    const optionsResult = await db.pool.query(optionsQuery, [pollId]);
    res.render('vote', {
      pollId,
      pollTitle: pollResult.rows[0].title,
      requiresName: pollResult.rows[0].requires_name,
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

async function sendSimpleMessage(poll, pollId) {
  const mailgun = new Mailgun(FormData);
  const mg = mailgun.client({
    username: "api",
    key: process.env.API_KEY || "API_KEY",
  });
  try {
    const creatorName = poll.creator_name;
    const creatorEmail = poll.creator_email;
    const data = await mg.messages.create("sandboxe956d6a4be9d4cfa9216113749d2267f.mailgun.org", {
      from: "Mailgun Sandbox <postmaster@sandboxe956d6a4be9d4cfa9216113749d2267f.mailgun.org>",
      to: [`${creatorName} <${creatorEmail}>`],
      subject: `New vote cast on your poll.`,
      text: `
        Hello ${creatorName},
        Your poll has been updated with a new vote.
        Please see the results at http://localhost:8080/${pollId}/results
        And your admin link at http://localhost:8080/${pollId}/admin
        Cheers!
      `,
    });
    console.log(data);
  } catch (error) {
    console.log(error);
  }
}

app.post('/:id/voted', async (req, res) => {
  const pollId = req.params.id;
  const poll = await db.getPollById(pollId);
  const { voterName, rankedOptions } = req.body;

  if (!poll) {
    return res.status(404).send('Poll not found');
  }
  if (!Array.isArray(rankedOptions)) {
    return res.status(400).send('Invalid ranked options');
  }

  try {
    for (let i = 0; i < rankedOptions.length; i++) {
      const optionId = rankedOptions[i];
      const score = rankedOptions.length - i;
      await db.pool.query(
        `INSERT INTO votes (poll_id, option_id, voter_name, score)
         VALUES ($1, $2, $3, $4)`,
        [pollId, optionId, voterName || null, score]
      );
    }
    await sendSimpleMessage(poll, pollId);
    res.redirect(`/${pollId}/voted`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


app.get('/:id/results', async (req, res) => {
  const pollId = req.params.id;

  // Get poll title
  const pollResult = await db.pool.query('SELECT title FROM polls WHERE id = $1', [pollId]);
  if (pollResult.rows.length === 0) {
    return res.status(404).send("Poll not found");
  }

  // Get ranked options with total scores
  const optionsQuery = `
    SELECT
      options.id,
      options.name,
      options.description,
      SUM(votes.score) AS total_score
    FROM options
    LEFT JOIN votes ON votes.option_id = options.id AND votes.poll_id = options.poll_id
    WHERE options.poll_id = $1
    GROUP BY options.id, options.name, options.description
    ORDER BY total_score DESC, options.name DESC;
  `;
  const optionsResult = await db.pool.query(optionsQuery, [pollId]);

  const options = [];
  for (let i = 0; i < optionsResult.rows.length; i++) {
    const opt = optionsResult.rows[i];
    options.push({
      id: opt.id,
      name: opt.name,
      description: opt.description,
      total_score: opt.total_score,
      rank: i + 1
    });
  }

  res.render('results', {
    pollTitle: pollResult.rows[0].title,
    options
  });
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
