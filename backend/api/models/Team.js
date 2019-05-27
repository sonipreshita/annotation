/**
 * Team.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'team',
    attributes: {
        user_id: {
            type: 'string',
           
        },
        member_id: {
            type: 'string',
            //required: true,
        },
        name: {
            type: 'string',
            required: true,
            unique: true
        },
        status: {
            type: 'string',
            defaultsTo: 'Active',
        },
        member: { collection: 'member', via: 'teamId' },
        userId: { model: 'user' },
        //member: { collection: 'member', via: 'holder' },
    },
  
    connection: 'mongodb'
};