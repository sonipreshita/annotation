/**
 * User.js
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
  tableName: 'user',
  attributes: {
    first_name: {
      type: 'string',
      required: true,
    },
    last_name: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'string',
      //required: true,
    },
    password: {
      type: 'string',
      required: true,
    },
    reset_token: {
      type: 'string',
    },
    status: {
      type: 'string',
      defaultsTo: 'Active',
    },
    image: {
      type: 'string',
    },
    toJSON: function () {
      var obj = this.toObject();
      delete obj.password;
      return obj;
    },
    member: { collection: 'member', via: 'userId' },
    project: { collection: 'project', via: 'user', dominant: true},
    team: { collection: 'team', via: 'userId' },
    screen: { collection: 'screen', via: 'user' },
    activitylog: { collection: 'user', via: 'id' },
    comment: { collection: 'user', via: 'email'},

    // activity:{collection: 'activitylog', via: 'user'}
  },

  // beforeCreate: function (user, cb) {
  //   bcrypt.genSalt(10, function (err, salt) {
  //     bcrypt.hash(user.password, salt, function (err, hash) {
  //       if (err) {
  //         cb(err);
  //       } else {
  //         user.password = hash;
  //         cb();
  //       }
  //     });
  //   });
  // },

  // beforeUpdate: function (values, next) {
  //   console.log('value',values)
  //   if (values.password) {
  //     hashPassword(values, next);
  //   }
  //   else {
  //     next();
  //   }
  // },
  connection: 'mongodb'
};
