var bcrypt = require('bcrypt');
var async = require("async");

module.exports = {
    encryptedPassword: function (input) {
        var key = ['K', 'C', 'Q', 'Y', 'A'];
        var output = [];
        for (var i = 0; i < input.length; i++) {
            var charCode = input.charCodeAt(i) ^ key[i % key.length].charCodeAt(0);
            output.push(String.fromCharCode(charCode));
        }
        return output.join("");
    },

    generateToken: function () {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < 23; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    },

    apicallError: function (req, res, responseObj, status) {

        var logs = {
            method_type: req.path,
            request_data: (req.body) == undefined ? {} : req.body,
            response_data: responseObj,
            status: status,
        }
        ApiLog.create(logs, function (err, logs) {
            if (err) {
                return false;
            }
            return true;
        })
    },

    methodNotAllowed: function (req, res) {
        var responseObj = {
            status: 'error',
            message: "Method not allowed"
        }
        Dataservices.apicallError(req, res, responseObj, responseObj.status);
        return res.methodNotAllowed({ message: responseObj.message });
    },

    somethingWrong: function (req, res) {
        var responseObj = {
            status: 'error',
            message: "Something went wrong."
        }
        Dataservices.apicallError(req, res, responseObj, responseObj.status);
        return res.json(400, { status: 'NOK', result: { message: responseObj.message } });
    },

    activitiLogs: function (responseObj) {

        ActivityLog.create(responseObj, function (err, logs) {
            if (err) {
                return false;
            }
            return true;
        })
    },

};
