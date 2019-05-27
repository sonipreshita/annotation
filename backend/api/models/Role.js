/**
 * Role.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'role',
    attributes: {
       rolename: {
      type: 'string',
      unique: true
    },
    description: {
      type: 'string',
    },
      administrator: { collection: 'administrator', via: 'roleId' },
  },
  connection: 'mongodb'
};
