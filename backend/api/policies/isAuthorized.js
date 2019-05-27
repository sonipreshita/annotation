var jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  
  if (!req.headers.jwtoken && !req.headers.authorization) {
  var memberResponse = {
      status: 'error',
      message: "You are not permitted to perform this action!"
    }
    Dataservices.apicallError(req, res, memberResponse, memberResponse.status);
    return res.json(403, { status: 'NOK', result: { message: memberResponse.message } });
  }
  var authorizationToken = req.headers.jwtoken ? req.headers.jwtoken : req.headers.authorization;
  jwt.verify(authorizationToken, sails.config.jwtSecret, function (err, decoded) {
    if (err) {
      var memberResponse = {
        status: 'error',
        message: "Failed to authenticate token!"
      }
      Dataservices.apicallError(req, res, memberResponse, memberResponse.status);
      return res.json(403, { status: 'NOK', result: { message: memberResponse.message } });
    } else {
      User.findOne({ id: decoded.user }).exec(function (err, records) {
        if (err) {
          return res.json({ success: false, message: "No data found" });
        }
        if (!records) {
           var memberResponse = {
           status: 'error',
           message: "You are not permitted to perform this action!"
          }
          Dataservices.apicallError(req, res, memberResponse, memberResponse.status);
          return res.json(403, { status: 'NOK', result: { message: memberResponse.message } });
          //return res.forbidden('You are not permitted to perform this action.');
        }
        req.currentUserDetails = records;
        next();
      });
    }
  });
};