const { selectTopics } = require("../models/topics");

exports.getTopics = (req, res) => {
  selectTopics().then((topics) => {
    console.log(topics);
    res.status(200).send(topics);
  });
};
