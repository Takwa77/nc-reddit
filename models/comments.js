const db = require("../db/connection");

exports.selectCommentsByID = (article_id) => {
  return db
    .query(
      `SELECT comments.author, comments.body, comments.comment_id, comments.created_at, comments.votes FROM comments WHERE comments.article_id=$1;`,
      [article_id]
    )
    .then((comments) => {
      return comments.rows;
    });
};
