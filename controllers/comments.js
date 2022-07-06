const { selectCommentsByID } = require("../models/comments");

exports.getCommentsByID = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByID(article_id)
    .then((comments) => {
      console.log({ comments });
      res.status(200).send({ comments });
    })
    .catch(next);
};
