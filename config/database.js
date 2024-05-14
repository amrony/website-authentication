require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => {
    console.log('DB is connected');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});