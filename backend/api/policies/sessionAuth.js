/**
 * sessionAuth
 *
 * @module      :: Policy
 * @description :: Simple policy to allow any authenticated user
 *                 Assumes that your login action in one of your controllers sets `req.session.authenticated = true;`
 * @docs        :: http://sailsjs.org/#!/documentation/concepts/Policies
 *
 */

module.exports = function(req, res, next) {

  if (req.session.authenticated) {
     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    return next();
  }
  else {
    
		req.addFlash('error', 'Authentication Required.');
		res.redirect('account/login');
		return;
	}
        
};
