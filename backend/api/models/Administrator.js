/**
 * Administrator.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt = require('bcrypt');

function hashPassword(values, next) {
  bcrypt.hash(values.password, 10, function (err, hash) {
    if (err) {
      return next(err);
    }
    values.password = hash;
    next();
  });
}

module.exports = {
  tableName: 'administrator',
  attributes: {
    fname: {
      type: 'string',
      required: true,
    },
    lname: {
      type: 'string',
      required: true,
    },
    username: {
      type: 'string',
    },
    email: {
      type: 'string',
      required: true,
      //unique: true,
    },
    password: {
      type: 'string',
      //required: true
    },
    image: {
      type: 'string',
    },
    role: {
      type: 'string',
      //required: true
    },
    reset_token: {
      type: 'string',
    },
    status: {
      type: 'string',
      defaultsTo: 'Active',

    },
    role_id: {
      type: 'string',
      //required: true,
    },
    roleId: { model: 'role' },

  },
  beforeCreate: function (user, cb) {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          cb(err);
        } else {
          user.password = hash;
          cb();
        }
      });
    });
  },

  beforeUpdate: function (values, next) {

    if (values.password) {
      hashPassword(values, next);
    }
    else {

      next();
    }
  },
  seedData: {
    fname: 'preshita',
    lname: 'soni',
    username: 'preshita',
    email: 'preshita.soni@multidots.com',
    password: '123456',
    image:'default.png'
  },
  connection: 'mongodb'
};