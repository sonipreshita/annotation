/**
 * Admin.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'admin',
  attributes: {
    username: {
      type: 'string',
      required: true,
    },
    email: {
      type: 'string',
      required: true,
      //unique: true
    },
    password: {
      type: 'string',
      //required: true
    },
    reset_token: {
      type: 'string',
      //required: true,
    },
    image: {
      type: 'string',

    },
  },
  connection: 'mongodb'
};
