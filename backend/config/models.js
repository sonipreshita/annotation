/**
 * Default model configuration
 * (sails.config.models)
 *
 * Unless you override them, the following properties will be included
 * in each of your models.
 *
 * For more info on Sails models, see:
 * http://sailsjs.org/#!/documentation/concepts/ORM
 */

module.exports.models = {

  /***************************************************************************
  *                                                                          *
  * Your app's default connection. i.e. the name of one of your app's        *
  * connections (see `config/connections.js`)                                *
  *                                                                          *
  ***************************************************************************/
  connection: 'mongodb',

  /***************************************************************************
  *                                                                          *
  * How and whether Sails will attempt to automatically rebuild the          *
  * tables/collections/etc. in your schema.                                  *
  *                                                                          *
  * See http://sailsjs.org/#!/documentation/concepts/ORM/model-settings.html  *
  *                                                                          *
  ***************************************************************************/
  migrate: 'alter',

  /**
   * This method adds records to the database
   *
   * To use add a variable 'seedData' in your model and call the
   * method in the bootstrap.js file
   */
  seedObject: function (callback) {
    let self = this;
    let modelName = self.adapter.identity.charAt(0).toUpperCase() + self.adapter.identity.slice(1);

    self.find()
      .exec(function (err, admin) {
        if (err) {
          sails.log.debug('err : ', err);
          callback();
        } else {
          console.log('results length :', admin.length)
          if (admin.length === 0) {
            self.create(self.seedData).exec(function (err, results) {
              if (err) {
                sails.log.debug('err : ', err);
                callback();
              } else {
                sails.log.debug(modelName + ' seed planted');
                callback();
              }
            });
          } else {
            callback();
          }
        }
      });
  }

};
