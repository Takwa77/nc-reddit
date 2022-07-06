const { insertComments, selectCommentsByID } = require("../models/comments");

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  console.log(article_id, username, body);
  insertComments(article_id, username, body).then((comment) => {
    res.status(201).send({ comment });
  });
};

exports.getCommentsByID = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByID(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};
