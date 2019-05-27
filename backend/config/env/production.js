/**
 * Production environment settings
 *
 * This file can include shared settings for a production environment,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {

  /***************************************************************************
   * Set the default database connection for models in the production        *
   * environment (see config/connections.js and config/models.js )           *
   ***************************************************************************/

  models: {
    connection: 'someMysqlServer',
    jwtSecret: 'mysuperdevsecret',
    jwtExpires: 50000000000000,
    hookTimeout: 400000,
    publicKey: '1de816f8-b48e-4d19-108c-51de830nkl-md',
    WEB_URL : 'http://annotation.dev1.in',
    APP_IMG_PATH: 'http://annotation.dev1.in/images/'
  },

  /***************************************************************************
   * Set the port in the production environment to 80                        *
   ***************************************************************************/

  // port: 80,

  /***************************************************************************
   * Set the log level in production environment to "silent"                 *
   ***************************************************************************/

  // log: {
  //   level: "silent"
  // }

};
