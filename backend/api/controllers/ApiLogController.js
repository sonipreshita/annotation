/**
 * MemberController
 *
 * @description :: Server-side logic for managing Administrators
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    add: function (req, res) {
        var api_logs = {
            method_type: req.method_type,
            request_data: req.request_data,
            response_data: req.response_data,
            status: req.status
        }
        ApiLog.create(api_logs, function (err, log) {
            if (err) {
                //res.json(403, res.response)
                res.send(err)
            }
            res.json(200, res.response)
        })
    },
};
