/**
 * TeamMember.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'teammember',
    attributes: {
        team_id: {
            type: 'string',
            required: true,
        },
        member_id: {
            //type: 'string',
            //required: true,
            model:'member'
           // foreignKey: true,
           // references: 'team',
        },
         
         //teamMember: { collection: 'member', via:'teamMember' },
        //team: { model: 'Team' },
       // member: { model: 'Member'},
    },
    connection: 'mongodb'
};