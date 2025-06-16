const AppError = require("../utils/appError");

// Handle database cast errors eg udefiend routes
const handleCastErrorDb = err =>{
  const message = `Invaild ${err.path} : ${err.vlaue}`
  return new AppError(message ,400);
}
// Handle database duplication errors
const handleDuplicateFieldsDb = err => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate field value: '${value}' for '${field}'. Please use another value.`;
  return new AppError(message, 400);
};

// Handle validation errors 
const handleValidationErrorDb = err =>{
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Invaild input data. ${errors.join('. ')}`;
  return new AppError(message,400);
}

const sendErrorDev = (err , res) => {
    res.status(err.statusCode).json({
    status : err.status,
    message: err.message,
    error : err,
    stack : err.stack

  })
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message
    });
  }

  // Log the error
  console.error('ERROR 💥', err);

  // Send generic message
  return res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
};


module.exports = ((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'Error';
  

  if(process.env.NODE_ENV === 'development'){
    sendErrorDev(err,res);
  }else if(process.env.NODE_ENV ==='production'){
  let error = Object.create(err);

    if(error.name == 'CastError') error = handleCastErrorDb(error);
    if(error.code == 11000) error = handleDuplicateFieldsDb(error);
    if(error.name == 'ValidationError') error = handleValidationErrorDb(error);
    sendErrorProd(error,res);

  }  


});
