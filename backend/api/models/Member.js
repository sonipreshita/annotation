/**
 * Member.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
   // tableName: 'member',
    attributes: {
        user_id: {
            type: 'string',
            required: true,
        },
        firstname: {
            type: 'string',
            required: true,
        },
        lastname: {
            type: 'string',
            required: true,
        },
        email: {
            type: 'email',
            required: true,
           // unique: true
            //email:true
        },
        status: {
            type: 'string',
            defaultsTo: 'Active',
        },
        userId: { model: 'user' },
        teamId: { model: 'team' },
        //teamMember: { model: 'teammember' },
         teamMember: { collection: 'member', via:'id' },
        //data: { collection: 'TeamMember', via:'member' },
    },
    connection: 'mongodb'
};
