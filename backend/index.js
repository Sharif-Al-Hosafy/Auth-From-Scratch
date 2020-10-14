const express = require('express');
const volleyball = require('volleyball');
const auth = require("./Routes/auth")
 
const app = express();

app.use(volleyball)

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World!'
  });
});

app.use("/auth", auth);

function notFound(req, res, next) {
  res.status(404);
  const error = new Error('Not Found - ' + req.originalUrl);
  next(error);
}

function errorHandler(err, req, res, next) {
  res.status(res.statusCode || 500);
  res.json({
    message: err.message,
    stack: err.stack
  });
}

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Listening on port', port);
});