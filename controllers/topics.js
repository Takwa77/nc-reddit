const { selectTopics } = require("../models/topics");

exports.getTopics = (req, res) => {
  //   selectTopics().then((topics) => {
  res.send(200).send(topics);
  //   });
};
