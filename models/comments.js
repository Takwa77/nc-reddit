const db = require("../db/connection");
const format = require("pg-format");

const checkExists = async (table, column, value) => {
  const queryStr = format("SELECT * FROM %I WHERE %I = $1;", table, column);
  const dbOutput = await db.query(queryStr, [value]);
  if (dbOutput.rows.length === 0) {
    return Promise.reject({ status: 404, msg: "article not found" });
  }
};

exports.selectCommentsByID = (article_id) => {
  return checkExists("articles", "article_id", article_id)
    .then((output) => {
      return db.query(
        `SELECT comments.author, comments.body, comments.comment_id, comments.created_at, comments.votes FROM comments WHERE comments.article_id=$1;`,
        [article_id]
      );
    })
    .then((array) => {
      return array.rows;
    });
};

exports.insertComments = (article_id, username, body) => {
  const insertUser = db.query(
    `INSERT INTO users (username, name) 
    VALUES 
    ($1, $1);`,
    [username]
  );
  const insertComment = db.query(
    `INSERT INTO comments 
        (article_id, body, author)
        VALUES
        ($1, $2, $3)
        RETURNING *;`,
    [article_id, body, username]
  );

  return Promise.all([insertUser, insertComment]).then((response) => {
    const comment = response[1].rows[0];
    return comment;
  });
};
