const mongoose = require('mongoose');
const { Schema } = mongoose;
const encrypt = require('mongoose-encryption');

const userSchema = new mongoose.Schema({
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
});


var encKey = process.env.ENC_KEY;
userSchema.plugin(encrypt, { 
    secret: encKey, encryptedFields: ['password'] 
  }
);


const User = mongoose.model('User', userSchema);

module.exports = User;