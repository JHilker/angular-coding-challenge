/**
 * Populate DB with sample data on server start
 * to disable, edit config/environment/index.js, and set `seedDB: false`
 */

'use strict';

var User = require('../api/user/user.model');


User.find({}).remove(function() {
  User.create({
    firstName: 'Jacob',
    lastName: 'Hilker',
    age: 24,
    email: 'hilker.j@gmail.com',
    createdOn: Date.parse('03-19-2015'),
    active: true
  }, {
    firstName: 'Test',
    lastName: 'Person',
    age: 50,
    email: 'test@example.com',
    createdOn: Date.parse('01-01-2015'),
    active: true
  });
});
