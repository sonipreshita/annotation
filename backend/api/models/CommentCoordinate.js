/**
 * CommentCoordinate.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
module.exports = {
    tableName: 'commentCoordinate',
    attributes: {
        comment_id: {
            type: 'string',
        },
        coords: {
            type: 'string',
            required: true,
        },
    },
    connection: 'mongodb'
};
