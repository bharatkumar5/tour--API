const { json } = require('express');
const express = require('express');
const { request } = require('http');
const morgan = require('morgan');
const tourRouter = require('./routes/tours');
const userRouter = require('./routes/user');

const app = express();
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  // app.use(morgan('dev'));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('hello from middleware');

  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();

  next();
});

app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/user', userRouter);

module.exports = app;
