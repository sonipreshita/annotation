/**
 * ActivityLog.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'activitylog',
    attributes: {
        user_id: {
            model: 'user'
        },
        project_id: {
            model: 'project'
        },
        projectId:{
            type:'string'
        },
        screen_id: {
            model: 'screen'
        },
        member_id: {
            type: 'string',
            //required: true,
        },
        description: {
            type: 'string',
            required: true,
        },
        // users: { model: 'user' },
        // projects: { model: 'project' },
        // screens: { model: 'screen' }
    },
    connection: 'mongodb'
};