'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var UserSchema = new Schema({
  firstName: String,
  lastName: String,
  age: Number,
  email: String,
  createdOn: { type: Date, default: Date.now },
  lastEdited: { type: Date, default: Date.now },
  active: Boolean
});

module.exports = mongoose.model('User', UserSchema);
