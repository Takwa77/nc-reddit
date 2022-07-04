const { selectTopics } = require("../models/topics");

exports.getTopics = (req, res) => {
  console.log("im in controllers");
  //   selectTopics().then((topics) => {
  res.send(200).send(topics);
  //   });
};
