const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
require('dotenv').config();

//Enable CORS so frontend (like React) can access this API from another origin
app.use(cors());



if(process.env.NODE_ENV === 'developemt'){
    app.use(morgan('dev')); //only log when we are in production
}
// Parse incoming requests with JSON payloads and make it available in req.body
app.use(express.json());

// Route import
const userRouter = require('./routes/userRouter');

// Route usage
app.use('/api/v1/users', userRouter); 

//export app
module.exports = app;