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
  return db
    .query(
      `SELECT comments.author, comments.body, comments.comment_id, comments.created_at, comments.votes FROM comments WHERE comments.article_id=$1;`,
      [article_id]
    )
    .then((comments) => {
      return Promise.all([
        checkExists("articles", "article_id", article_id),
        comments,
      ]);
    })
    .then((array) => {
      return array[1].rows;
    });
};
