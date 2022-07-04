const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.js");

app.get("/api/topics", getTopics);

app.use("*", (req, res) => {
  res.status(404).send({ msg: "invalid path" });
});

module.exports = app;
