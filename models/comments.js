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
  if (!username || !body || !article_id) {
    return Promise.reject({ status: 400, msg: "bad request" });
  }
  return db
    .query(`SELECT * FROM users WHERE username=$1;`, [username])
    .then((user) => {
      if (user.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "user not found" });
      }
      return db.query(`SELECT * FROM articles WHERE article_id=$1;`, [
        article_id,
      ]);
    })
    .then((articles) => {
      if (articles.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article not found" });
      }
      return db.query(
        `INSERT INTO comments
            (article_id, body, author)
            VALUES
            ($1, $2, $3)
            RETURNING *;`,
        [article_id, body, username]
      );
    })
    .then((comment) => {
      return comment.rows[0];
    });
};

exports.deleteComment = (comment_id) => {
  comment_id = parseInt(comment_id);
  console.log(comment_id);
  return db.query(`SELECT comment_id FROM comments`).then((comment_ids) => {
    console.log(comment_ids.rows[comment_id]);
    console.log(typeof comment_id);
    if (!comment_ids.rows[comment_id]) {
      if (Number.isNaN(comment_id)) {
        return Promise.reject({
          status: 400,
          msg: `comment ID should be a number`,
        });
      } else {
        return Promise.reject({
          status: 404,
          msg: `comment ${comment_id} does not exist`,
        });
      }
    }
    return db.query(`DELETE FROM comments WHERE comment_id=$1`, [comment_id]);
  });
};
