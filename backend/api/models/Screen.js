/**
 * Screen.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
    tableName: 'screen',
    attributes: {
        user_id: {
            type: 'string',
        },
        project_id: {
            type: 'string'
        },
        name: {
            type: 'string',
            required: true,
            //unique: true
        },
        image: {
            type: 'string',
        },
        notification_status: {
            type: 'string',
            defaultsTo: 'new'
        },
        status: {
            type: 'string',
            defaultsTo: 'Active',
        },
        toJSON: function () {
            var obj = this.toObject();
            obj.image = sails.config.globals.APP_IMG_PATH + this.image;
            return obj;
        },
        user: { collection: 'user', via: 'screen' },
        project: { collection: 'project', via: 'screen' },
        activitylog: { collection: 'screen', via: 'id' },
        comment: { collection: 'screen', via: 'name' },
        //data: { collection: 'activitylog', via:'project' },
    },
    connection: 'mongodb'
};

