const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, 'Name should be provided'],
  },

  email: {
    type: String,
    trim: true,
    required: [true, 'Email should be provided'],
    unique: [true, 'Email already exists'],
    match: [/.+\@.+\..+/, 'Please fill a valid email address'],
  },

  password: {
    type: String,
    required: [true, 'Password should not be empty'],
  },

  about: {
    type: String,
    trim: true,
  },

  photo: {
    data: Buffer,
    contentType: String,
  },

  following: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  followers: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
});

module.exports = mongoose.model('User', UserSchema);
