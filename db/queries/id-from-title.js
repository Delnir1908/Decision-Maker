const db = require('../connection');

const idFromTitle = (data) => {
  return db.query('SELECT id FROM polls WHERE title=$1;', [data])
    .then(data => {
      return data.rows;
    });
};

module.exports = { idFromTitle };