/**
 * Comment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'comment',
    attributes: {
        user_id: {
            // type: 'string',
            // required: true,
            model:'user'
        },
        project_id: {
            model: 'project'
            //type: 'string',
        },
        screen_id: {
            model: 'screen'
            // type: 'string',
        },
        x_cords: {
            type: 'string',
            required: true,
        },
        y_cords: {
            type: 'string',
            required: true,
        },
        comments: {
            type: 'array',
            required: true,
        },
        Status: {
            type: 'string',
            defaultsTo: 'Active',
        },
        cords: { model: 'commentcords' },

    },
    connection: 'mongodb'
};
