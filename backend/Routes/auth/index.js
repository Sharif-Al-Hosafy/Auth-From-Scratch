const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcrypt");

const router = express.Router();

const User = require("../../db/users");

const schema = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
  username: Joi.string()
    .pattern(new RegExp("^[a-zA-Z0-9_]+$"))
    .min(3)
    .max(30)
    .required(),
  password: Joi.string().trim().min(10).required(),
});

router.get("/", (req, res) => {
  res.json({
    message: "Get auth",
  });
});

router.post("/signup", (req, res, next) => {
  const result = schema.validate(req.body);
  console.log;
  if (result.error === undefined) {
    User.findOne({ email: result.value.email }).then((user) => {
      if (user) {
        const error = new Error("This username is already exist");
        next(error);
      } else {
        bcrypt.hash(result.value.password.trim(), 12).then((hashedPassword) => {
          const newUser = new User({
            email: result.value.email,
            username: result.value.username,
            password: hashedPassword,
          });

          newUser.save().then((saved) => {
            res.send({ saved });
          });
        });
      }
    });
  } else {
    next(result.error);
  }
});
module.exports = router;
