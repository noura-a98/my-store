const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
require('dotenv').config();

//Enable CORS so frontend (like React) can access this API from another origin
app.use(cors());


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // only log in development
}

// Parse incoming requests with JSON payloads and make it available in req.body
app.use(express.json());

// Route import
const userRouter = require('./routes/userRouter');

// Route usage
app.use('/api/v1/users', userRouter); 

//unhandled routes
app.use((req, res, next) => {

  next(new AppError(`Can't find ${req.originalUrl} on this server!`,404));
});



// add global error handler
app.use(globalErrorHandler);

//export app
module.exports = app;