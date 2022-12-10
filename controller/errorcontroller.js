const AppError = require('./../Utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const message = `Duplicate field value`;

  return new AppError(message, 400);
};

const handlejwtError = (err) => {
  const message = `invalid token login again`;
  return new AppError(message, 401);
};

const handleJwtexprie = (err) =>
  new AppError('your token expered! login again', 401);

// development error
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

// production error
const sendErrorProd = (err, res) => {
  //Operational , trusted error : send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }

  //Programming or other unknown error: don't leak error details
  else {
    // log error
    console.error('error', err);

    //send message to client
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong !',
    });
  }
};

module.exports = (err, req, res, next) => {
  console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  ///
  else if (process.env.NODE_ENV === 'production') {
    let er = { ...err };

    if (err.name === 'CastError') {
      err = handleCastErrorDB(err);
    }

    if (err.code === 11000) {
      err = handleDuplicateFieldsDB(err);
    }

    if (err.name === 'JsonWebTokenError') {
      err = handlejwtError(err);
    }

    if (err.name === 'TokenExpiredError') {
      err = handleJwtexprie(err);
    }

    sendErrorProd(err, res);
  }
};
