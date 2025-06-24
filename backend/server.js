const mongoose = require('mongoose');
const dotenv = require('dotenv'); 

// Handle uncaught exceptions exp undefied value
process.on('uncaughtException' , err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥 Shutting down ...');
    //here we are ending all the process after we handle the server handles pending requests
    process.exit(1);

});

dotenv.config({path :'./.env'});

const app = require('./app');

const DB = process.env.MONGO_URI.replace(
  '<PASSWORD>',
  process.env.PASSWORD,
);

mongoose.connect(DB).then(() => {
  console.log('DB connection successful');
});


const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});

// Handling unhandled rjections

process.on('unhandledRejection' , err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥 Shutting down ...');
  // gracfully close the server
  server.close(() => {
    //here we are ending all the process after we handle the server handles pending requests
    process.exit(1);
  });
});

