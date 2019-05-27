/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#!/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/

  // '*': true,

  /***************************************************************************
  *                                                                          *
  * Here's an example of mapping some policies to run before a controller    *
  * and its actions                                                          *
  *                                                                          *
  ***************************************************************************/
  AccountController: {
    'login': 'unsetsessionAuth',
    'logout': 'sessionAuth',
    'logout': 'sessionAuth',
    'updateprofile': 'sessionAuth',
    'editprofile': 'sessionAuth',

  },

  AdministratorsController: {
    'add': 'sessionAuth',
    'create': 'sessionAuth',
    'index': 'sessionAuth',
    'delete': 'sessionAuth',
    'view': 'sessionAuth',
    'edit': 'sessionAuth',
    'update': 'sessionAuth',
    'list': 'sessionAuth',
    'setstatusActive': 'sessionAuth',
    'setstatusInactive': 'sessionAuth',
     'index': ['sessionAuth' ,'checkPermission']
  },
  ProjectController: {

    'delete': 'isAuthorized',
    'create': 'isAuthorized',
    'update': 'isAuthorized',
    'plist': 'sessionAuth',
    'show': 'sessionAuth',
    'list': 'sessionAuth',
    'projectDelete': 'sessionAuth',
    'view': 'sessionAuth',
     'show': ['sessionAuth' ,'checkPermission']

  },

  MemberController: {
    'show': 'sessionAuth',
    'list': 'sessionAuth',
    'memberDelete': 'sessionAuth',
    'view': 'checkPermission',
    'addmembers': 'sessionAuth',
    'show': ['sessionAuth' ,'checkPermission']

  },
  DashbordController: {
    'index': 'sessionAuth',
  },
  TeamController: {

    'showTeams': 'sessionAuth',
    'list': 'sessionAuth',
    'teamdelete': 'sessionAuth',
    'addteams': 'sessionAuth',
    'edit': 'sessionAuth',
    'view': 'sessionAuth',
    'showTeams': ['sessionAuth' ,'checkPermission']
  },
  UserController: {

    'update': 'isAuthorized',
    'changepassword': 'isAuthorized',
    'list': 'sessionAuth',
    'show': 'sessionAuth',
    'userDelete': 'sessionAuth',
    'view': 'sessionAuth',
    'updateuser': 'sessionAuth',
    'edit': 'sessionAuth',
     'show': ['sessionAuth' ,'checkPermission']

  },
  CommentsController: {

    'add': 'isAuthorized',
    'delete': 'isAuthorized',
    'update': 'isAuthorized',
    'show': 'isAuthorized',
    'coordinate': 'isAuthorized',

  },
  DashbordController : {
      'index': ['sessionAuth' ,'checkPermission']
  },
   RoleController : {
     'roleList': ['sessionAuth' ,'checkPermission'],
      'show': ['sessionAuth' ,'checkPermission']
  }

};
