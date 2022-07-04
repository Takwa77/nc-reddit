const { selectArticleByID, patchArticleVote } = require("../models/articles");

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
  patchArticleVote(article_id, inc_votes).then((article) => {
    res.status(200).send({ article });
  });
};
