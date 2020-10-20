const express = require("express");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

const schema2 = Joi.object({
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
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
        const error = new Error("This user is already exist");
        res.status(409);
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
    res.status(422);
    next(result.error);
  }
});

function rspondError422(res, next) {
  res.status(422);
  const error = new Error("Unable to login");
  next(error);
}

router.post("/login", (req, res, next) => {
  const result = schema2.validate(req.body);
  if (result.error === undefined) {
    User.findOne({ email: result.value.email }).then((user) => {
      if (user) {
        bcrypt.compare(result.value.password, user.password).then((result) => {
          if (result) {
            const payload = {
              _id: user._id,
              email: user.email,
            };
            console.log(process.env.TOKEN_SECRET);
            jwt.sign(
              payload,
              process.env.TOKEN_SECRET,
              { expiresIn: "1d" },
              (err, token) => {
                if (err) {
                  console.log("zby");
                } else {
                  res.send({ token });
                }
              }
            );
          } else {
            rspondError422(res, next);
          }
        });
      } else {
        rspondError422(res, next);
      }
    });
  } else {
    rspondError422(res, next);
  }
});

module.exports = router;
