/**
 * AccountController
 *
 * @description :: Server-side logic for managing accounts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var nodemailer = require('nodemailer');
var fs = require('fs');
var bcrypt = require('bcrypt');

module.exports = {

    login: function (req, res) {
        if (req.method == 'GET') {
            return res.view('login', { layout: false });
        } else {
            var email = req.param('email');
            var password = req.param('password');
            var remember = req.param('remember');
            if (email && password) {
                Administrator.findOne({ email: email }).exec(function (err, record) {
                    if (record) {
                        if (!bcrypt.compareSync(password, record.password)) {
                            req.addFlash('error', 'Invalid email or password. Please try again.');
                            res.redirect('account/login');
                        } else {
                            req.session.authenticated = true;
                            req.session.user = record;
                            var obj = { user: [record.email, password, remember] }
                            var newdata = JSON.stringify(obj);
                            res.cookie('remember', newdata);
                            req.addFlash('success', 'You have successfuly logged in.');
                            res.redirect('dashboard');
                        }
                    } else {
                        req.addFlash('error', 'Invalid email or password. Please try again.');
                        res.redirect('account/login');
                    }
                });
            } else {
                req.addFlash('error', 'Username and Password both Required');
                res.redirect('account/login');
            }
        }
    },


    logout: function (req, res) {
        req.session.destroy();
        res.redirect('account/login');
    },

    forgotPassword: function (req, res) {
        return res.view('forgot-password', { layout: false })
    },

    submit: function (req, res, next) {
        if (req.method == 'GET') {
            return res.view('login', { layout: false });
        } else {
            var email = req.param('email');
            if (email) {
                Administrator.find().exec(function (err, record) {
                    Administrator.findOne({ email: email }).exec(function (err, record) {
                        if (!record) {
                            req.addFlash('error', ' You have not registerd with this email');
                            return res.redirect('forgot-password')
                        } else {
                            randomValue = Dataservices.generateToken();
                            var updateUser = {
                                reset_token: randomValue,
                            };

                            Administrator.update({ email: email }, updateUser).exec(function (err, records) {
                                console.log('records',records)
                                if (err) {
                                    return console.log(err);
                                }
                                else {
                                    SendMail.adminForgetPassword(email, randomValue);
                                    req.addFlash('success', 'Password recovery link has been sent to your mail address');
                                    res.redirect('account/login')
                                }
                            });
                        }
                    })

                })
            } else {
                req.addFlash('error', 'Please enter authorised email to recover your password');
                res.view('forgot-password');
            }
        }
    },

    resetPassword: function (req, res) {
        var token = req.params;
        res.view('reset-password', { token: token, layout: false });
    },


    linkToChangePassword: function (req, res) {
        var token = req.params.token;
        var password = req.param('new_password');
        var confpassword = req.param('confirm_password');

        var newPassword = {
            password: password,
            reset_token: "",
        }

        Administrator.findOne({ reset_token: token }).exec(function (err, records) {

            if (records === undefined || records === "" || records == null) {
                req.addFlash('error', 'Token is expired');
                res.redirect('account/login')
            } else {
                let emailId = records.email;
                Administrator.update({ email: emailId }, newPassword).exec(function (err, record) {

                    if (err) {
                        return res.send(err)
                    }
                    return res.redirect('dashboard');
                })
            }
        })
    },


    editprofile: function (req, res) {
        if (req.method == 'GET') {
            var id = req.session.user;
            Administrator.findOne({ id: id.id })
                .exec(function (err, record) {
                    if (record) {
                        return res.view('edit-profile', { admin: record });
                    } else {
                        return res.redirect('404');
                    }
                });
        }
        else {
            var adminId = req.session.user.id,
                username = req.body.username,
                currentPassword = req.body.current_password,
                newPassword = req.body.new_password,
                confirmPassword = req.body.confirm_password,
                email = req.body.email;

            req.file('uploadFile').upload({
                dirname: process.cwd() + '/assets/images/'
            }, function (error, uploadedFiles) {

                if (!error && uploadedFiles.length > 0) {

                    var filename = uploadedFiles[0].fd.substring(uploadedFiles[0].fd.lastIndexOf('/') + 1);
                    var img = require('path').basename(filename);
                    if (sails.config.environment !== 'development') {
                        var uploadLocation = process.cwd() + '/assets/images/' + filename;
                        var tempLocation = process.cwd() + '/.tmp/public/images/' + filename;
                        fs.createReadStream(uploadLocation).pipe(fs.createWriteStream(tempLocation));
                    }
                    var updateProject = {
                        username: username,
                        email: email,
                        image: img
                    };
                    var adminId = req.session.user.id;
                    Administrator.update({ id: adminId }, updateProject).exec(function (err, records) {

                        if (err) {
                            return res.send(err)
                        } else {
                            return res.redirect('dashboard');
                        }
                    });
                } else {

                    if (currentPassword && currentPassword.length > 0) {
                        var adminId = req.session.user.id;
                        Administrator.findOne({ id: adminId, password: currentPassword }).exec(function (err, record) {

                            if (record) {
                                var updateAdmin = {
                                    username: username,
                                    email: email,
                                    password: newPassword,
                                };

                                Administrator.update({ id: adminId }, updateAdmin).exec(function (err, records) {

                                    if (err) {
                                        return res.send(err)
                                    } else {
                                        return res.redirect('dashboard');
                                    }
                                });
                            }
                            else {

                                req.addFlash('error', 'Current password is not matched');
                                res.redirect('/edit-profile');
                            }
                        });
                    }
                    else {
                        var updateProject = {
                            username: username,
                            email: email,
                        };
                        var adminId = req.session.user.id;
                        Administrator.update({ id: adminId }, updateProject).exec(function (err, records) {

                            if (err) {
                                return res.send(err)
                            } else {
                                req.addFlash('update', 'Profile updated successfully');
                                return res.redirect('dashboard');
                            }
                        });
                    }
                }
            });
        }
    },

    quickchangepassword: function (req, res) {
        if (req.method == 'GET') {
            var id = req.session.user.id;
            Administrator.findOne({ id: id })
                .exec(function (err, record) {
                    if (record) {
                        return res.view('change-password', { admin: record });
                    } else {
                        return res.redirect('404');
                    }
                });
        }
    },
    changePassword: function (req, res) {

        if (req.method == 'POST') {


            var adminId = req.session.user.id,
                currentPassword = req.body.current_password,
                newPassword = req.body.new_password,
                confirmPassword = req.body.confirm_password;
            var details = {
                password: req.param('new_password'),
            }

            Administrator.findOne({ id: adminId, password: currentPassword }).exec(function (err, record) {
                if (record) {
                    var updateAdmin = {
                        password: newPassword,

                    };

                    Administrator.update({ id: adminId }, updateAdmin).exec(function (err, records) {
                        if (err) {
                            return res.send(err)
                        } else {
                            req.addFlash('password', 'Password updated successfully');
                            return res.redirect('dashboard');
                        }
                    });
                }
                else {
                    req.addFlash('error', 'Current password is not matcthed');
                    res.redirect('/change-password');
                }
            });
        }
    },
};
