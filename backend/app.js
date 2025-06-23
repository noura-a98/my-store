const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit')
const helmet = require('helmet');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
require('dotenv').config();

const app = express();

// Set security HTTP headers
app.use(helmet());


//Enable CORS so frontend (like React) can access this API from another origin
app.use(cors());


// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // only log in development
}

// limit requests from same IP
const limiter = rateLimit({
  max:150,
  windowMs: 60 *60 * 1000,
  message : 'Too many requests from this IP, please try again in an hour!'
});

app.use('/api',limiter)

// Body parser , reading data from body into req.body
app.use(express.json({limit:'10kb'}));

// Data sanitization against NoSQL query injection
// app.use(mongoSanitize());

// Data protection against xss

// app.use(xss());



// Route import
const userRouter = require('./routes/userRouter');
const productRouter = require('./routes/productRouter')


// Route usage
app.use('/api/v1/users', userRouter); 
app.use('/api/v1/products',productRouter);
//unhandled routes
app.use((req, res, next) => {

  next(new AppError(`Can't find ${req.originalUrl} on this server!`,404));
});



// add global error handler
app.use(globalErrorHandler);

//export app
module.exports = app;