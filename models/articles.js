const db = require("../db/connection");

exports.selectArticleByID = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1;`, [article_id])
    .then((article) => {
      article.rows[0];
      if (!article.rows[0]) {
        return Promise.reject({
          status: 404,
          msg: `article ${article_id} does not exist`,
        });
      }
      return article.rows[0];
    });
};
