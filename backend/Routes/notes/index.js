const express = require("express");
const User = require("../../db/users");

const router = express.Router();

router.get("/", (req, res) => {
  User.find({ email: req.user.email }).then((user) => {
    res.send(user[0].notes);
  });
});

router.post("/", (req, res) => {
  const note = req.body;
  res.send({ note });
  User.findOne({ email: req.user.email }).then((user) => {
    user.notes.push(note);
    user.save((e, u) => {
      console.log("Post Saved");
    });
  });
});

module.exports = router;
