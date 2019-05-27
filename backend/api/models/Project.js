/**
 * Project.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  tableName: 'project',
  attributes: {
    user_id: {
      type: 'array',
      // required: true,
    },
    name: {
      type: 'string',
      required: true,
      //unique: true
    },
    description: {
      type: 'string',
      required: true,
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
    user: { collection: 'user', via: 'project' },
    screen: { collection: 'screen', via: 'project' },
    activitylog: { collection: 'project', via: 'id' },
    comment: { collection: 'project', via: 'name' },
    //data: { collection: 'activitylog', via:'project' },
  },
  connection: 'mongodb'
};

