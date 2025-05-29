const db = require('../connection');

const getPolls = () => {
  return db.query('SELECT * FROM polls;')
    .then(data => {
      return data.rows;
    });
};

const createPoll =  (data) => {
  return db.query(
    'INSERT INTO polls (title, requires_name, creator_name, creator_email) VALUES ($1, $2, $3, $4) RETURNING *', 
    [data.title, data.requires_name, data.creator, data.email])
    .then((result) => {
      console.log('New poll ID:', result.rows[0].id);
      return result.rows[0].id;
    })
    .catch(err => {
      console.log(err.message);
      throw err;
    });
};

const addOptions = (pollId, options) => {
  const promises = options.map((option) => {
    return db.query(
      'INSERT INTO options (poll_id, name, description) VALUES ($1, $2, $3) RETURNING *',
      [pollId, option.name, option.description || null]);
  });

  return Promise.all(promises)
    .then((results) => {
    console.log(results.map(result => result.rows));
  }).catch(err => {
    console.log(err.message);
    throw err;
  });
};

module.exports = { getPolls, createPoll, addOptions };
