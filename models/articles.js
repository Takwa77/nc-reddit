const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");

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

exports.patchArticleVote = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles
  SET votes =votes+$1 WHERE article_id=$2 RETURNING *;`,
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.selectArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comments.article_id):: INT AS comment_count 
      FROM articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      GROUP BY articles.article_id
      ORDER BY articles.created_at DESC;`
    )
    .then((articles) => {
      console.log(articles.rows);
      return articles.rows;
    });
};
