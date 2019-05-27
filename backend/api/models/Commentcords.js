/**
 * CommentCoordinate.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports = {
    tableName: 'commentcords',
    attributes: {
        project_id: {
            type: 'string',
        },
        coords: {
            type: 'string',
            required: true,
        },
        Status: {
            type: 'string',
            defaultsTo: 'Active'
        },
        comments: {collection: 'comments', via: 'cords'},
    },
    connection: 'mongodb'
};
