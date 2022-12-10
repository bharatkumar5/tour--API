const { json } = require('express');
const express = require('express');
const { request } = require('http');
const morgan = require('morgan');

const AppError = require('./Utils/appError');
const tourRouter = require('./routes/tours');
const userRouter = require('./routes/user');
const GlobalErrorHandler = require('./controller/errorcontroller');
const { captureStackTrace } = require('./Utils/appError');

const app = express();
console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'development') {
  // app.use(morgan('dev'));
}

app.use(express.json());

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers);

  next();
});

//    Routes

app.use('/api/v1/tours', tourRouter);

app.use('/api/v1/user', userRouter);

app.all('*', (req, res, next) => {
  // const err = new Error(`can't find ${req.originalUrl} on this server`);
  console.log(StackTrace);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`can't find ${req.originalUrl} on this server!`, 404));
});

app.use(GlobalErrorHandler);

module.exports = app;
