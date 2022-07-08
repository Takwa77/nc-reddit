const db = require("../db/connection");
const articles = require("../db/data/test-data/articles");

exports.selectArticleByID = (article_id) => {
  return db
    .query(
      `SELECT articles.*, COUNT(comments.article_id) 
      AS comment_count
      FROM comments
      RIGHT JOIN articles
      ON articles.article_id = comments.article_id 
      WHERE articles.article_id=$1
      GROUP BY articles.article_id;`,
      [article_id]
    )
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

exports.selectArticles = (
  sort_by = "created_at",
  order_by = "DESC",
  filter_by
) => {
  const validSortOptions = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "comment_count",
  ];
  const validOrderOptions = ["ASC", "DESC"];

  const queryValues = [];
  let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, COUNT(comments.article_id):: INT AS comment_count 
  FROM articles
  LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (!validSortOptions.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "invalid sort query" });
  }

  if (!validOrderOptions.includes(order_by)) {
    return Promise.reject({ status: 400, msg: "invalid order query" });
  }

  if (filter_by) {
    queryStr += ` WHERE topic=$1`;
    queryValues.push(filter_by);
  }

  queryStr += ` GROUP BY articles.article_id
  ORDER BY ${sort_by} ${order_by}`;

  return db.query(queryStr, queryValues).then((articles) => {
    return articles.rows;
  });
};
