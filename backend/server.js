const mongoose = require('mongoose');
const dotenv = require('dotenv'); 

dotenv.config({path :'./env'});

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
