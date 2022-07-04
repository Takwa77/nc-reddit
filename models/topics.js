const db = require("../db/connection");

exports.selectTopics = () => {
  console.log("im in models");
  return db.query(`SELECT * FROM topics;`).then((topics) => {
    return topics.rows;
  });
};
