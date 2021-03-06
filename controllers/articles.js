const {
  selectArticleByID,
  patchArticleVote,
  selectArticles,
} = require("../models/articles");

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleByID(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.updateArticleVote = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  patchArticleVote(article_id, inc_votes)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order_by, filter_by } = req.query;

  selectArticles(sort_by, order_by, filter_by)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
