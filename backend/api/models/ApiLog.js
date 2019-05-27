/**
 * ApiLog.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    // tableName: 'member',
    attributes: {
        method_type: {
            type: 'string',
            required: true,
        },
        request_data: {
            type: 'object',
            required: true,
        },
        response_data: {
            type: 'object',
            required: true,
        },
        status: {
            type: 'string',
            required: true
        },
        message: {
            type: 'string',
            //required: true
        },
        
    },
    connection: 'mongodb'
};
