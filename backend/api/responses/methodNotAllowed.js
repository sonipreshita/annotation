/**
 * 400 (Bad Request) Handler
 *
 * Usage:
 * return res.methodNotAllowed();
 * return res.methodNotAllowed(error);
 * return res.methodNotAllowed(error, 'some/specific/badRequest/view');
 *
 */

module.exports = function methodNotAllowed(error) {

  // Get access to `req`, `res`, & `sails`
  var req = this.req;
  var res = this.res;
  var sails = req._sails;

  // Set status code & success
  res.status(405);
  success = false;

  // response in json
  return res.json({ success, error });


};

