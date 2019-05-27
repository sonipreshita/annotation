/**
 * UserLoginController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


var fs = require('fs');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
module.exports = {

    signup: function (req, res, next) {

        if (req.method == 'POST') {
            var passwordValid = /^[A-Za-z0-9_]{4,20}$/,
                emailvalid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            var first_name = req.body.first_name,
                last_name = req.body.last_name,
                project_id = req.body.project_id,
                email = req.body.email,
                password = req.body.password;
            var errorObj = {};
            if (first_name == null || first_name == "") {
                errorObj.first_name = "First name is required.";
            }
            if (last_name == null || last_name == "") {
                errorObj.last_name = "Last name is required.";
            }
            if (email == null || email == "") {
                errorObj.email = "Email is required.";
            } else if (!emailvalid.test(email)) {
                errorObj.email = "Email is not valid.";
            }
            if (password == null || password == "") {
                errorObj.password = "Password is required.";
            }
            else if (!passwordValid.test(password)) {
                errorObj.password = "Password must be minimum four digits.";
            }

            if (Object.keys(errorObj).length) {
                errorObj.status = "error"
                var memberResponse = {
                    status: errorObj.status,
                }
                Dataservices.apicallError(req, res, errorObj, memberResponse.status);
                return res.json(400, { status: 'NOK', result: { message: errorObj } });
            } else {
                if (Object.keys(errorObj).length === 0) {

                    User.findOne({ 'email': email }, function (err, user) {
                        if (err) {
                            Dataservices.somethingWrong(req, res);
                        }
                        if (user) {
                            var memberResponse = {
                                status: 'error',
                                message: "This email already exists."
                            }
                            Dataservices.apicallError(req, res, memberResponse, memberResponse.status);
                            return res.json(409, { status: 'NOK', result: { message: memberResponse.message } });
                        } else {

                            User.create({
                                first_name: req.body.first_name,
                                last_name: req.body.last_name,
                                email: req.body.email,
                                password: password,
                                status: "Active",
                                reset_token: ""
                            }).exec(function (err, user) {
                                if (err) {
                                    Dataservices.somethingWrong(req, res);
                                }
                                else {
                                    SendMail.email(email, password);
                                    if (project_id) {
                                        Project.findOne({ id: project_id }, function (err, project) {
                                            var newIds = project.user_id;
                                            var getIds = newIds.push(user.id);
                                            var xs = newIds; let result = [];
                                            xs.forEach((el) => {
                                                if (!result.includes(el)) result.push(el);
                                            });
                                            var updateData = {
                                                user_id: newIds
                                            }
                                            if (project) {
                                                Project.update({ id: project_id }, updateData).exec(function (err, project) {
                                                    if (err) {
                                                        Dataservices.somethingWrong(req, res);
                                                    } else {
                                                        //return res.json(200, { status: 'OK', result: { message: "Invitation sent successfully." } });
                                                        return res.json(200, { status: 'OK', result: { message: "You have been successfully registered!" } });
                                                    }
                                                })
                                            } else {
                                                return res.json(200, { status: 'OK', result: { message: "No page found for this URL" } });
                                            }
                                        })
                                    } else {
                                        return res.json(200, { status: 'OK', result: { message: "You have been successfully registered!" } });
                                    }
                                }
                            });
                        }
                    });
                }
            }
        }
        else {
            Dataservices.methodNotAllowed(req, res);
        }
    },

    login: function (req, res, next) {

        if (req.method == 'POST') {
            var password = req.body.password,
                email = req.body.email;
            var passwordValid = /^[A-Za-z0-9_]{4,20}$/,
                emailvalid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            var errorObj = {};

            if (email == null || email == "") {
                errorObj.email = "Email is required.";
            } else if (!emailvalid.test(email)) {
                errorObj.email = "Email is not valid.";
            }
            if (password == null || password == "") {
                errorObj.password = "Password is required.";
            }
            else if (!passwordValid.test(password)) {
                errorObj.email = "Password is not valid.";
            }
            if (Object.keys(errorObj).length) {
                errorObj.status = "error"
                var memberResponse = {
                    status: errorObj.status,
                }
                Dataservices.apicallError(req, res, errorObj, memberResponse.status);
                return res.json(400, { status: 'NOK', result: { message: errorObj } });
            }
            // var encrypted = Dataservices.encryptedPassword(password);
            if (Object.keys(errorObj).length === 0) {
                User.findOne({ email: email }).exec(function (err, user) {
                    if (err) {
                        Dataservices.somethingWrong(req, res);
                    }
                    else if (user) {

                        //if (bcrypt.compareSync(password, user.password) === "false") {
                        if (password !== user.password) {
                            var memberResponse = {
                                status: 'error',
                                message: "Authentication failed. Wrong password."
                            }
                            Dataservices.apicallError(req, res, memberResponse, memberResponse.status);
                            return res.json(401, { status: 'NOK', result: { message: memberResponse.message } });
                        } else {
                            if (user.status == "InActive") {
                                var memberResponse = {
                                    status: 'error',
                                    message: "User is inactive, please contact administrator."
                                }
                                Dataservices.apicallError(req, res, memberResponse, memberResponse.status);
                                return res.json(401, { status: 'NOK', result: { message: memberResponse.message } });
                            }
                            else {
                                var token = jwt.sign({ user: user.id }, sails.config.jwtSecret, { expiresIn: sails.config.jwtExpires });
                                return res.json(200, { status: 'OK', result: { user: user, token: token, message: "Logged in successfully." } });
                            }
                        }
                    } else {
                        var memberResponse = {
                            status: 'error',
                            message: "Authentication failed. User not found."
                        }
                        Dataservices.apicallError(req, res, memberResponse, memberResponse.status);
                        return res.json(401, { status: 'NOK', result: { message: memberResponse.message } });
                    }
                });
            }
        }
        else {
            Dataservices.methodNotAllowed(req, res);
        }
    },

    forgotpassword: function (req, res, next) {

        if (req.method == 'POST') {
            var errorObj = {};
            var emailvalid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            var email = req.body.email;

            if (email == null || email == "") {
                errorObj.email = "Email is required.";
            } else if (!emailvalid.test(email)) {
                errorObj.email = "Email is not valid.";
            }
            if (Object.keys(errorObj).length) {
                errorObj.status = "error"
                var memberResponse = {
                    status: errorObj.status,
                }
                Dataservices.apicallError(req, res, errorObj, memberResponse.status);
                return res.json(400, { status: 'NOK', result: { message: errorObj } });
            }
            if (Object.keys(errorObj).length === 0) {

                User.findOne({ 'email': email }, function (err, user) {
                    if (err) {
                        Dataservices.somethingWrong(req, res);
                    }
                    if (!user) {
                        var memberResponse = {
                            status: 'error',
                            message: "Email does not exists."
                        }
                        Dataservices.apicallError(req, res, memberResponse, memberResponse.status);
                        return res.json(404, { status: 'NOK', result: { message: memberResponse.message } });
                    }
                    if (user) {
                        randomValue = Dataservices.generateToken();
                        var updateUser = {
                            reset_token: randomValue,
                        };

                        User.update({ email: req.body.email }, updateUser).exec(function (err, records) {
                            if (err) {
                                Dataservices.somethingWrong(req, res);
                            }
                            else {
                                SendMail.forgotPasswordMail(email, randomValue);
                                return res.json(200, { status: 'OK', result: { message: "Email sent successfully." } });
                            }
                        });
                    }
                });
            }
        }
        else {
            Dataservices.methodNotAllowed(req, res);
        }
    },

    resetpassword: function (req, res, next) {

        if (req.method == 'POST') {
            var passwordValid = /^[A-Za-z0-9_]{4,20}$/;

            var resetPass = req.body.resetPassToken,
                password = req.body.password,
                userPassword2 = req.body.password2;
            var errorObj = {};

            if (password == null || password == "") {
                errorObj.password = "Password is required.";
            }
            else if (!passwordValid.test(password)) {
                errorObj.password = "Password must be minimum four digits.";
            }
            if (userPassword2 == null || userPassword2 == "") {
                errorObj.password2 = "Confirm password is required.";
            }
            else if (!passwordValid.test(userPassword2)) {
                errorObj.password2 = "Confirm password is not valid.";
            }
            if (password != userPassword2) {
                errorObj.password = "Passwords are not matching.";
            }
            if (Object.keys(errorObj).length) {
                errorObj.status = "error"
                var memberResponse = {
                    status: errorObj.status,
                }
                Dataservices.apicallError(req, res, errorObj, memberResponse.status);
                return res.json(400, { status: 'NOK', result: { message: errorObj } });
            } else {
                // var encrypted = Dataservices.encryptedPassword(userPassword1);
                if (Object.keys(errorObj).length === 0) {
                    User.findOne({
                        'reset_token': resetPass
                    }, function (err, user) {
                        let userId = user.id;
                        if (err) {
                            Dataservices.somethingWrong(req, res);
                        }
                        if (!user) {
                            var memberResponse = {
                                status: 'error',
                                message: "User does not exists."
                            }
                            Dataservices.apicallError(req, res, memberResponse, memberResponse.status);
                            return res.json(404, { status: 'NOK', result: { message: memberResponse.message } });

                        } else {

                            var updateUser = {
                                password: password,
                                reset_token: "",
                            };
                            User.update({ id: userId }, updateUser).exec(function (err, user) {
                                if (err) {
                                    Dataservices.somethingWrong(req, res);
                                }
                                if (user) {
                                    return res.json(200, { status: 'OK', result: { message: "Password changed successfully." } });
                                }
                            });
                        }
                    });
                }
            }
        }
        else {
            Dataservices.methodNotAllowed(req, res);
        }
    },

    update: function (req, res, next) {

        if (req.method == 'POST') {
            var user_id = req.param('user_id'),
                first_name = req.body.first_name,
                last_name = req.body.last_name;
            var errorObj = {};
            if (first_name == null || first_name == "") {
                errorObj.first_name = "First name is required.";
            }
            if (last_name == null || last_name == "") {
                errorObj.last_name = "Last name is required.";
            }
            if (Object.keys(errorObj).length) {
                errorObj.status = "error"
                var memberResponse = {
                    status: errorObj.status,
                }
                Dataservices.apicallError(req, res, errorObj, memberResponse.status);
                return res.json(400, { status: 'NOK', result: { message: errorObj } });
            }
            if (Object.keys(errorObj).length === 0) {
                User.findOne({ id: user_id }, function (err, user) {
                    if (err)
                        Dataservices.somethingWrong(req, res);
                    if (user) {
                        req.file('uploadFile').upload({
                            maxBytes: 10000000,
                            dirname: process.cwd() + '/assets/images/'
                        }, function (error, uploadedFiles) {

                            var updateUser = {
                                first_name: req.body.first_name,
                                last_name: req.body.last_name,
                            };
                            if (!error && uploadedFiles.length > 0) {
                                var filename = uploadedFiles[0].fd.substring(uploadedFiles[0].fd.lastIndexOf('/') + 1);

                                var img = require('path').basename(filename);
                                if (sails.config.environment !== 'development') {
                                    var uploadLocation = process.cwd() + '/assets/images/' + filename;
                                    var tempLocation = process.cwd() + '/.tmp/public/images/' + filename;
                                    fs.createReadStream(uploadLocation).pipe(fs.createWriteStream(tempLocation));
                                }
                                updateUser.image = img;
                            }

                            User.update({ id: user_id }, updateUser).exec(function (err, records) {
                                if (err) {
                                    Dataservices.somethingWrong(req, res);
                                } else {
                                    return res.json(200, { status: 'OK', result: { user: records, message: "Profile updated successfully." } });
                                }
                            });
                        });
                    }
                    else {
                        var memberResponse = {
                            status: 'error',
                            message: "User does not exists."
                        }
                        Dataservices.apicallError(req, res, memberResponse, memberResponse.status);
                        return res.json(404, { status: 'NOK', result: { message: memberResponse.message } });
                    }
                });
            }
        }
        else {
            Dataservices.methodNotAllowed(req, res);

        }
    },

    changepassword: function (req, res, next) {

        if (req.method == 'POST') {
            var errorObj = {};
            var passwordValid = /^[A-Za-z0-9_]{4,20}$/;
            var user_id = req.param('user_id'),
                oldpassword = req.body.oldpassword,
                newpassword1 = req.body.newpassword1,
                newpassword2 = req.body.newpassword2;

            if (oldpassword == null || oldpassword == "") {
                errorObj.oldpassword = "Current password is required.";
            }
            if (newpassword1 == null || newpassword1 == "") {
                errorObj.newpassword1 = "New password is required.";
            }
            else if (!passwordValid.test(newpassword1)) {
                errorObj.password1 = "Password must be minimum four digits.";
            }
            if (newpassword2 == null || newpassword2 == "") {
                errorObj.newpassword2 = "Confirm password is required.";
            }
            else if (!passwordValid.test(newpassword2)) {
                errorObj.password1 = "Confirm password must be minimum four digits.";
            }
            if (newpassword1 != newpassword2) {
                errorObj.newpassword1 = "Passwords are not matching.";
            }
            //var encrypted = Dataservices.encryptedPassword(oldpassword);
            // var encrypted1 = Dataservices.encryptedPassword(newpassword1);
            if (Object.keys(errorObj).length) {
                errorObj.status = "error"
                var memberResponse = {
                    status: errorObj.status,
                }
                Dataservices.apicallError(req, res, errorObj, memberResponse.status);
                return res.json(400, { status: 'NOK', result: { message: errorObj } });
            }
            if (Object.keys(errorObj).length === 0) {

                User.findOne({ id: req.param('user_id') }, function (err, user) {
                    if (err) {
                        Dataservices.somethingWrong(req, res);
                    }
                    if (oldpassword !== user.password) {
                        var memberResponse = {
                            status: 'error',
                            message: "Invalid current password."
                        }
                        Dataservices.apicallError(req, res, memberResponse, memberResponse.status);
                        return res.json(404, { status: 'NOK', result: { message: memberResponse.message } });
                    }
                    else {
                        var updateUser = {
                            password: newpassword1,
                        };
                        User.update({ id: req.param('user_id') }, updateUser).exec(function (err, records) {
                            if (err) {
                                Dataservices.somethingWrong(req, res);
                            }
                            else {
                                return res.json(200, { status: 'OK', result: { message: "Password changed successfully." } });
                            }
                        });
                    }
                });
            }
        }
        else {
            Dataservices.methodNotAllowed(req, res);
        }
    },

    show: function (req, res) {
        let pageTitle = 'Users' + " | " + sails.config.globals.APP_NAME;
        User.find({}, function (err, user) {
            if (err) {
                Dataservices.somethingWrong(req, res);
            }
            return res.view('users/user', { title: pageTitle, user: user })
        })
    },

    list: function (req, res) {
        const DEFAULT_PAGE = 1;
        const DEFAULT_PER_PAGE = req.body.length;
        let pageNo = parseInt(req.param('page')) || (typeof req.options.page !== 'undefined' ? parseInt(req.options.page) : DEFAULT_PAGE);
        let perPage = parseInt(req.param('perPage')) || (typeof req.options.page !== 'undefined' ? parseInt(req.options.perPage) : DEFAULT_PER_PAGE);
        var IDS = req.body.id;
        var newstatus = req.body.customActionName ? req.body.customActionName : new RegExp('', 'i');
        if (newstatus == 1) {
            newstatus = 'Active'
        } else if (newstatus == 2) {
            newstatus = 'Inactive'
        }
        var status = { status: newstatus }
        User.find()
            .exec(function (err, records) {
                if (err) return res.badRequest(err);
                if (records.length < 1) {
                    var json = {
                        data: [],
                        recordsTotal: 0,
                        recordsFiltered: 0
                    };
                    return res.json(json);
                } else {
                    var count = records.length;
                    var contPages = Math.ceil(count / perPage);
                    var nextPageChek = (pageNo < contPages ? pageNo + 1 : false);
                    var nextPageChekLink = (pageNo < contPages ? 1 + nextPageChek + '/' + perPage : false);
                    if (pageNo > contPages || pageNo <= 0) return res.notFound({ message: "No page found." });

                    var retuser = [];

                    if (IDS !== undefined && req.method === 'POST') {
                        User.update({ id: IDS }, status).
                            exec(function (err, user) {
                                User.find()
                                    .skip(req.body.start).limit(req.body.length)
                                    .sort({ "_id": -1 })
                                    .exec(function (err, records) {
                                        if (typeof records !== 'undefined' && records.length > 0) {
                                            records.forEach(function (user) {
                                                retuser.push({
                                                    first_name: user.first_name, last_name: user.last_name, email: user.email, status: user.status,
                                                    button: "<a href='users/view/" + user.id + "'" + "class='btn btn-xs blue btn-outline' title='View'>" +
                                                        "<i class='fa fa-eye'></i>" + "View" +
                                                        "</a>" +
                                                        "<a href='users/edit/" + user.id + "'" + " class='btn btn-xs green btn-outline' title='Edit'>" +
                                                        "<i class='fa fa-edit'></i>" + "Edit" +
                                                        "</a>" +
                                                        "<a onclick=\"return confirm('Do you want to delete this record?')\" href='/users/deleterecord/" + user.id + "'" + "class='btn btn-xs red btn-outline' title='Delete'onclick='if (confirm(Are you sure you want to delete))' >" +
                                                        "<i class='fa fa-trash-o'></i>" + "Delete" +
                                                        "</a>",
                                                    checkbox: '<div class="checker"><span><input type="checkbox" class="group-checkable" name="id[]" value="' + user.id + '"></span></div>',
                                                });
                                            });
                                        }
                                        var json = {
                                            data: retuser,
                                            recordsTotal: count,
                                            recordsFiltered: count
                                        };
                                        if (err) return res.badRequest(err);
                                        return res.json(json);
                                    });
                            })
                    } else {
                        var count = records.length;
                        var orderby = req.body.order[0].column;
                        var dir = req.body.order[0].dir;
                        var order = {};
                        if (orderby === '1') {
                            order['first_name'] = dir
                        } else if (orderby === '2') {
                            order['email'] = dir
                        } else if (orderby === '3') {
                            order['status'] = dir
                        }

                        var searchUser = new RegExp(req.body.user_name, "i");

                        var searchEmail = new RegExp(req.body.user_email, "i");
                        var userstatus = req.body.user_status ? req.body.user_status : new RegExp('', 'i');
                        if (userstatus == 1) { userstatus = 'Active' }
                        else if (userstatus == 2) { userstatus = 'Inactive' }

                        User.find({ email: searchEmail, $or: [{ first_name: searchUser }, { last_name: searchUser }] })
                            .where({ status: userstatus })
                            .skip(req.body.start).limit(req.body.length)
                            .sort(order)
                            .exec(function (err, records) {
                                if (typeof records !== 'undefined' && records.length > 0) {
                                    records.forEach(function (user) {
                                        retuser.push({
                                            first_name: user.first_name, last_name: user.last_name, email: user.email, status: user.status,
                                            button: "<a href='users/view/" + user.id + "'" + "class='btn btn-xs blue btn-outline' title='View'>" +
                                                "<i class='fa fa-eye'></i>" + "View" +
                                                "</a>" +
                                                "<a href='users/edit/" + user.id + "'" + " class='btn btn-xs green btn-outline' title='Edit'>" +
                                                "<i class='fa fa-edit'></i>" + "Edit" +
                                                "</a>" +
                                                "<a onclick=\"return confirm('Do you want to delete this record?')\" href='/users/deleterecord/" + user.id + "'" + "class='btn btn-xs red btn-outline' title='Delete' data-on-confirm='delete admin' data-toggle='confirmation'>" +
                                                "<i class='fa fa-trash-o'></i>" + "Delete" +
                                                "</a>",
                                            checkbox: '<div class="checker"><span><input type="checkbox" class="group-checkable" name="id[]" value="' + user.id + '"></span></div>',
                                        });
                                    });
                                }
                                var json = {
                                    data: retuser,
                                    recordsTotal: count,
                                    recordsFiltered: count
                                };
                                if (err) return res.badRequest(err);
                                return res.json(json);
                            });
                    }
                }
            });
    },

    userDelete: function (req, res, next) {
        // if (req.session.userPermissions.includes("user_delete")) {
        var id = req.param('id');
        User.destroy({ id: id }, function (err, user) {
            if (err) {
                return res.send(err)
            }
            req.addFlash('success', 'User has been deleted.');
            return res.redirect('/users')
        })
        // } else {
        //     req.addFlash('error', 'You dont have permission to delete user.');
        //     return res.redirect('/users')
        // }
    },

    view: function (req, res) {
        if (req.method == 'GET') {
            // if (req.session.userPermissions.includes("user_view")) {
            let pageTitle = 'View | Users' + " | " + sails.config.globals.APP_NAME;
            var id = req.param('id');
            User.findOne({ id: req.params.id })
                .exec(function (err, record) {
                    if (record) {
                        return res.view('users/view/', { title: pageTitle, user: record });
                    } else {
                        return res.redirect('404');
                    }
                });
            // }
            // else {
            //     req.addFlash('error', 'You dont have permission to view user.');
            //     return res.redirect('/users')
            // }
        }
    },

    updateuser: function (req, res) {
        var id = req.param('id');
        var user_details = {
            first_name: req.param('fname'),
            last_name: req.param('lname'),
            email: req.param('email'),
        }

        User.update({ id: id }, user_details, function (err, user) {
            if (err) {
                return res.send(err)
            }
            req.addFlash('success', 'User updated successfully.');
            return res.redirect('/users')
        })
    },

    edit: function (req, res) {

        if (req.method == 'GET') {
            // if (req.session.userPermissions.includes("user_update")) {
            let pageTitle = ' Edit | Users' + " | " + sails.config.globals.APP_NAME;
            var id = req.param('id');
            User.findOne({ id: req.params.id })
                .exec(function (err, record) {
                    if (record) {
                        return res.view('users/edit/', { title: pageTitle, user: record });
                    } else {
                        return res.redirect('404');
                    }
                });
            // }
            // else {
            //     req.addFlash('error', 'You dont have permission to update user.');
            //     return res.redirect('/users')
            // }
        }
    },

    getUser: function (req, res) {
        if (req.method == 'GET') {
            var id = req.param('id');
            User.findOne({ id: id }, function (err, user) {
                if (err) {
                    Dataservices.somethingWrong(req, res);
                }
                if (user) {
                    return res.json(200, { status: 'OK', result: { data: user } });
                }
            });
        } else {
            Dataservices.methodNotAllowed(req, res);
        }
    }

};