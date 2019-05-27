/**
 * Rolepermissions.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'rolepermissions',
    attributes: {
       role_id: {
      type: 'string',
    },
    permission_ids: {
      type: 'string',
    },
    // permissionkey:{
    //   type: 'string',
    // },
  },
  connection: 'mongodb'
};
