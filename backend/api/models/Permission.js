/**
 * Permission.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'permission',
    attributes: {
       title: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    controller: {
      type: 'string',
    },
      action: {
      type: 'string',
    },
     permissionkey: {
      type: 'string',
      unique:true,
    },
  },
  connection: 'mongodb'
};
