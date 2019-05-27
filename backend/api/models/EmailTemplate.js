/**
 * EmailTemplate.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'emailtemplate',
    attributes: {
       subject: {
      type: 'string',
    },
    description: {
      type: 'string',
    },
    slug: {
      type: 'string',
    },
      emaildata: {
      type: 'string',
    },
  },
  connection: 'mongodb'
};
