const mongoose = require('mongoose');

const connectDB = (url) => {
  return mongoose.connect(url)
    .then(() => {
      console.log('Connected to the database successfully');
    })
    .catch((err) => {
      console.log('Error connecting to the database', err);
    });
};

module.exports = connectDB;
