const { insertComments } = require("../models/comments");

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  console.log(article_id, username, body);
  insertComments().then((comment) => {
    res.status(201).send(comment);
  });
};
