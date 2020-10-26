const express = require("express");
const volleyball = require("volleyball");
const cors = require("cors");

const app = express();
require("dotenv").config();

const auth = require("./Routes/auth");
const notes = require("./Routes/notes");
const db = require("./db/connection");
const middlewares = require("./Routes/middlewares");

app.use(volleyball);
app.use(
  cors({
    origin: "http://localhost:8080",
  })
);
app.use(express.json());
app.use(middlewares.checkValidToken);

app.get("/", (req, res) => {
  res.json({
    message: "Hello World!",
    user: req.user,
  });
});

app.use("/auth", auth);
app.use("/api/notes", middlewares.isLoggedIn, notes);

function notFound(req, res, next) {
  res.status(404);
  const error = new Error("Not Found - " + req.originalUrl);
  next(error);
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack,
  });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Listening on port", port);
});
