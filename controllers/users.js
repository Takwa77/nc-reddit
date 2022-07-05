const { selectUsers } = require("../models/users");

exports.getUsers = (req, res, next) => {
  console.log("im in controllers");
  selectUsers().then((users) => {
    res.status(200).send(users);
  });
};
