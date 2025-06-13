const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();

//Enable CORS so frontend (like React) can access this API from another origin
app.use(cors());
// Parse incoming requests with JSON payloads and make it available in req.body
app.use(express.json());

// Route import
const userRouter = require('./routes/userRouter');

// Route usage
app.use('/api/v1/users', userRouter); 

//export app
module.exports = app;