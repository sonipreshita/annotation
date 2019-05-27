/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {


  //for admin login,logout,change and reset password

  '/': 'AccountController.login',
  '/login': 'AccountController.login',
  '/logout': 'AccountController.logout',
  '/forgot-password': 'AccountController.forgotPassword',
  '/submit': 'AccountController.submit',
  '/edit-profile': 'AccountController.editprofile',
  '/reset-password/:token': 'AccountController.resetpassword',
  '/change-password/:token': 'AccountController.linkToChangePassword',
  '/change-password': 'AccountController.quickchangepassword',
  '/changed-password/:id': 'AccountController.changePassword',

  //Administartors
  '/administrators/add': 'AdministratorsController.add',
  '/create': 'AdministratorsController.create',
  '/index': 'AdministratorsController.index',
  '/view': 'AdministratorsController.view',
  '/delete': 'AdministratorsController.delete',
  '/edit': 'AdministratorsController.edit',
  '/update': 'AdministratorsController.update',
  '/list': 'AdministratorsController.list',
  '/setstatusActive': 'AdministratorsController.setstatusActive',
  '/setstatusInactive': 'AdministratorsController.setstatusInactive',

  // '/administrators/add': { view: 'administrators/add' },

  //user Controller
  '/api/user/signup': 'UserController.signup',
  '/api/user/login': 'UserController.login',
  '/api/user/forgotpassword': 'UserController.forgotpassword',
  '/api/user/resetpassword': 'UserController.resetpassword',
  '/api/user/update': 'UserController.update',
  '/api/user/changepassword': 'UserController.changepassword',
  '/api/user/get-user': 'UserController.getUser',
  '/users/list': 'UserController.list',
  '/users': 'UserController.show',
  '/users/deleterecord/:id': 'UserController.userDelete',
  '/users/view/:id': 'UserController.view',
  '/updateusers/:id': 'UserController.updateuser',
  '/users/edit/:id': 'UserController.edit',

  //Project Controller
  '/api/project/create': 'ProjectController.create',
  '/api/project/delete': 'ProjectController.delete',
  '/api/project/update': 'ProjectController.update',
  '/api/project/list/:id': 'ProjectController.projectList',
  '/api/project/record': 'ProjectController.record',
  '/api/project/invite': 'ProjectController.inviteMember',
  '/api/project/team_invite': 'ProjectController.inviteTeam',
  '/project/project-list': 'ProjectController.plist',
  '/projects': 'ProjectController.show',
  '/project/deleterecord/:id': 'ProjectController.projectDelete',
  '/api/project/share/:user_id/:project_id': 'ProjectController.shareProject',
  '/projects/view/:id': 'ProjectController.view',
  '/api/project/change_status': 'ProjectController.changeStatus',
  '/api/project_duplicate/:id': 'ProjectController.duplicateProject',
  '/api/projects/search_query': 'ProjectController.searchProjectByQuery',

  //Screen Controller
  '/api/screen/create/:project_id': 'ScreenController.create',
  '/api/screen/delete': 'ScreenController.delete',
  '/api/screen/update': 'ScreenController.update',
  '/api/screen/change_status': 'ScreenController.changeStatus',
  '/api/screen/list/:id': 'ScreenController.screenList',
  '/api/screen/:id': 'ScreenController.screenDetails',
  '/api/screen_duplicate/:project_id/:screen_id': 'ScreenController.duplicateScreen',
  '/api/screens/search_query': 'ScreenController.searchScreenByQuery',
  '/api/screen_workflow': 'ScreenController.workflowScreen',
  // '/api/project/invite': 'ProjectController.inviteMember',
  // '/project/project-list': 'ProjectController.plist',
  // '/projects': 'ProjectController.show',
  // '/project/deleterecord/:id': 'ProjectController.projectDelete',
  // '/api/project/share/:user_id/:project_id': 'ProjectController.shareProject',
  // '/projects/view/:id': 'ProjectController.view',


  //member controller
  '/api/members/add': 'MemberController.add',
  '/api/members/update': 'MemberController.update',
  '/api/members/delete': 'MemberController.delete',
  '/api/members/:id': 'MemberController.showMembers',
  '/members': 'MemberController.show',
  '/members-list': 'MemberController.list',
  '/members/deleterecord/:id': 'MemberController.memberDelete',
  '/members/view/:id': 'MemberController.view',
  '/members/add': 'MemberController.addmembers',
  '/api/members/list/:id': 'MemberController.memberList',

  //Comment Controller
  '/api/comment/add': 'CommentsController.add',
  '/api/comment/update': 'CommentsController.update',
  '/api/comment/list': 'CommentsController.list',
  '/api/comment/chat': 'CommentsController.chat',
  '/api/comment/record': 'CommentsController.record',
  '/api/comments-list': 'CommentsController.showAllComments',
  '/api/comments/search_query': 'CommentsController.searchCommentByQuery',

  //team controller
  '/api/team/create': 'TeamController.create',
  '/api/team/list/:id': 'TeamController.teamList',
  '/api/team/delete': 'TeamController.delete',
  '/api/team/update': 'TeamController.update',
  '/api/team/:id': 'TeamController.show',
  '/teams': 'TeamController.showTeams',
  '/teams/team-list': 'TeamController.list',
  '/team/teamdelete/:id': 'TeamController.teamdelete',
  '/teams/add': 'TeamController.addteams',
  '/teams/edit/:id': 'TeamController.edit',

  //email Template controller

  '/email-template': 'EmailtemplateController.list',
  '/email-templates': 'EmailtemplateController.show',
  '/email-templates/edit/:id': 'EmailtemplateController.edit',
  '/emailtemplates/add': { view: 'emailtemplates/add' },
  '/email-templates/add': 'EmailtemplateController.add',

  //permissions controller

  '/permission': 'PermissionController.list',
  '/permissions': 'PermissionController.show',
  '/permissions/add': { view: 'permissions/add' },
  '/permission/add': 'PermissionController.add',
  '/permission/edit/:id': 'PermissionController.edit',

  //team-member controller
  '/api/team-member/add': 'TeamMemberController.add',
  '/api/team-member': 'TeamMemberController.list',
  '/teams/view/:id': 'TeamController.view',
  //activity controller
  '/api/activity-log/add': 'ActivityLogController.add',
  '/api/activity-log/:project_id': 'ActivityLogController.allActivityLogs',

  //apilog controller
  '/api/api-log/add': 'ApiLogController.add',

  '/dashboard': 'DashbordController.index',

  //role controller

  '/roles': 'RoleController.show',
  '/role-list': 'RoleController.list',
  '/roles/add': { view: 'roles/add' },
  '/role/add': 'RoleController.add',
  '/roles/edit/:id': 'RoleController.edit',
  '/roles/deleterecord/:id': 'RoleController.delete',
};
