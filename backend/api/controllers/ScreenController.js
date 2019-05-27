/**
 * ProjectController
 *
 * @description :: Server-side logic for managing Projects
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require('fs');
var jwt = require('jsonwebtoken');
module.exports = {
    create: function (req, res, next) {
        if (req.method == 'POST') {
            var screen_name = req.body.screen_name,
                user_id = req.body.user_id,
                project_id = req.param('project_id');
            var errorObj = {};

            if (screen_name == null || screen_name == "") {
                errorObj.screen_name = "Screen name is required";
            }

            if (Object.keys(errorObj).length) {
                errorObj.status = "error"
                var responseObj = {
                    status: errorObj.status,
                }
                Dataservices.apicallError(req, res, errorObj, responseObj.status);
                return res.json(400, { status: 'NOK', result: { message: errorObj } });
            } else {
                if (Object.keys(errorObj).length === 0) {

                    Project.findOne({ id: req.param('project_id') }, function (err, project) {
                        if (err) {
                            Dataservices.somethingWrong(req, res);
                        }
                        if (project) {

                            Screen.findOne({ name: screen_name, project_id: project_id }).exec(function (err, record) {
                                if (record) {
                                    var responseObj = {
                                        status: 'error',
                                        message: "Screen name already exists."
                                    }
                                    Dataservices.apicallError(req, res, responseObj, responseObj.status);
                                    return res.json(409, { status: 'NOK', result: { message: responseObj.message } });

                                } else {
                                    req.file('uploadFile').upload({
                                        dirname: process.cwd() + '/assets/images/'
                                    }, function (error, uploadedFiles) {
                                        if (!error && uploadedFiles.length > 0) {
                                            var dir = process.cwd() + '/.tmp/public/images/';
                                            if (!fs.existsSync(dir)) {
                                                fs.mkdirSync(dir);
                                            }
                                            var filename = uploadedFiles[0].fd.substring(uploadedFiles[0].fd.lastIndexOf('/') + 1);
                                            var uploadLocation = process.cwd() + '/assets/images/' + filename;
                                            var tempLocation = process.cwd() + '/.tmp/public/images/' + filename;
                                            var img = require('path').basename(filename);
                                            //if (sails.config.environment !== 'development') {
                                            fs.createReadStream(uploadLocation).pipe(fs.createWriteStream(tempLocation));
                                            //}
                                            var newScreen = {
                                                user_id: user_id,
                                                name: screen_name,
                                                project_id: req.param('project_id'),
                                                image: img
                                            };

                                            Screen.create(newScreen).exec(function (err, screen) {
                                                if (err) {
                                                    return res.json(409, { status: 'NOK', result: { message: err } });
                                                }
                                                else {
                                                    project.screen.add(screen.id);

                                                    project.save(function (err) {
                                                        if (err) {
                                                            Dataservices.somethingWrong(req, res);
                                                        } else {
                                                            var responseObj = {
                                                                user_id: project.user_id,
                                                                project_id: project.id,
                                                                projectId: project.id,
                                                                screen_id: screen.id,
                                                                description: "Screen created successfully."
                                                            }
                                                            Dataservices.activitiLogs(responseObj);
                                                            return res.json(200, { status: 'OK', screen: screen, result: { message: responseObj.description } });
                                                        }
                                                    });
                                                }
                                            });

                                        } else {

                                            Screen.create({ name: screen_name, user_id: user_id, project_id: req.param('project_id'), image: '' }).exec(function (err, screen) {
                                                if (err) {
                                                    return res.json(409, { status: 'NOK', result: { message: err } });
                                                } else {
                                                    project.screen.add(screen.id);

                                                    project.save(function (err) {
                                                        if (err) {
                                                            Dataservices.somethingWrong(req, res);
                                                        } else {
                                                            var responseObj = {
                                                                user_id: project.user_id,
                                                                project_id: project.id,
                                                                projectId: project.id,
                                                                screen_id: screen.id,
                                                                description: "Screen created successfully."
                                                            }
                                                            Dataservices.activitiLogs(responseObj);
                                                            return res.json(200, { status: 'OK', screen: screen, result: { message: responseObj.description } });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            var responseObj = {
                                status: 'error',
                                message: "Project does not exists."
                            }
                            Dataservices.apicallError(req, res, responseObj, responseObj.status);
                            return res.json(404, { status: 'NOK', result: { message: responseObj.message } });
                        }
                    });
                }
            }
        }
        else {
            Dataservices.methodNotAllowed(req, res);
        }
    },

    delete: function (req, res) {

        if (req.method == 'POST') {
            var screen_id = req.param('id');

            Screen.findOne({ 'id': screen_id }, function (err, screen) {
                if (err) {
                    Dataservices.somethingWrong(req, res);
                }
                if (screen) {
                    if (screen.status == "Inactive") {
                        var memberResponse = {
                            status: 'error',
                            message: "Screen is inactive, please contact administrator."
                        }
                        Dataservices.apicallError(req, res, memberResponse, memberResponse.status);
                        return res.json(401, { status: 'NOK', result: { message: memberResponse.message } });
                    } else {
                        Screen.destroy({ id: screen_id }).exec(function (err, screen) {
                            var responseObj = {
                                user_id: screen[0].user_id,
                                project_id: screen[0].project_id,
                                projectId: screen[0].project_id,
                                screen_id: screen_id,
                                description: "Screen deleted successfully."
                            }
                            Dataservices.activitiLogs(responseObj);
                            return res.json(200, { status: 'OK', result: { message: responseObj.description } });
                        });
                    }
                }
                else {
                    var responseObj = {
                        status: 'error',
                        message: "Screen does not exists."
                    }
                    Dataservices.apicallError(req, res, responseObj, responseObj.status);
                    return res.json(404, { status: 'NOK', result: { message: responseObj.message } });
                }
            });
        }
        else {
            Dataservices.methodNotAllowed(req, res);
        }
    },

    update: function (req, res) {
        if (req.method == 'POST') {
            var project_id = req.param('project_id'),
                screen_id = req.param('screen_id'),
                user_id = req.body.user_id,//req.param('user_id'),
                screen_name = req.body.screen_name;
            var errorObj = {};
            if (screen_name == null || screen_name == "") {
                errorObj.screen_name = "Screen name is required";
            }

            if (Object.keys(errorObj).length) {
                errorObj.status = "error"
                var responseObj = {
                    status: errorObj.status
                }
                Dataservices.apicallError(req, res, errorObj, responseObj.status);
                return res.json(400, { status: 'NOK', result: { message: errorObj } });
            }
            if (Object.keys(errorObj).length === 0) {

                Project.findOne({ id: project_id }, function (err, project) {
                    if (err)
                        Dataservices.somethingWrong(req, res);
                    if (project) {

                        Screen.findOne({ id: screen_id }, function (err, screen) {
                            if (err) {
                                Dataservices.somethingWrong(req, res);
                            }
                            if (screen) {
                                if (screen.status == "Inactive") {
                                    var memberResponse = {
                                        status: 'error',
                                        message: "Screen is inactive, please contact administrator."
                                    }
                                    Dataservices.apicallError(req, res, memberResponse, memberResponse.status);
                                    return res.json(401, { status: 'NOK', result: { message: memberResponse.message } });
                                } else {
                                    Screen.findOne({ name: screen_name, project_id: project_id }).exec(function (err, record) {
                                        if (record.id !== screen_id) {
                                            var responseObj = {
                                                status: 'error',
                                                message: "Screen name already exists."
                                            }
                                            Dataservices.apicallError(req, res, responseObj, responseObj.status);
                                            return res.json(409, { status: 'NOK', result: { message: responseObj.message } });
                                        } else {
                                            req.file('uploadFile').upload({
                                                maxBytes: 10000000,
                                                dirname: process.cwd() + '/assets/images/'
                                            }, function (error, uploadedFiles) {

                                                var updateScreen = {
                                                    name: req.body.screen_name
                                                };
                                                if (!error && uploadedFiles.length > 0) {
                                                    var dir = process.cwd() + '/.tmp/public/images/';
                                                    if (!fs.existsSync(dir)) {
                                                        fs.mkdirSync(dir);
                                                    }
                                                    var filename = uploadedFiles[0].fd.substring(uploadedFiles[0].fd.lastIndexOf('/') + 1);
                                                    var img = require('path').basename(filename);
                                                    //if (sails.config.environment !== 'development') {
                                                    var uploadLocation = process.cwd() + '/assets/images/' + filename;
                                                    var tempLocation = process.cwd() + '/.tmp/public/images/' + filename;
                                                    fs.createReadStream(uploadLocation).pipe(fs.createWriteStream(tempLocation));
                                                    //}
                                                    updateScreen.image = img;

                                                    Screen.update({ id: screen_id }, updateScreen).exec(function (err, records) {
                                                        if (err) {
                                                            return res.json(409, { status: 'NOK', result: { message: err } });
                                                        } else {
                                                            var responseObj = {
                                                                user_id: user_id,
                                                                project_id: project_id,
                                                                projectId: project_id,
                                                                screen_id: screen_id,
                                                                description: "Screen updated successfully."
                                                            }
                                                            Dataservices.activitiLogs(responseObj);
                                                            return res.json(200, { status: 'OK', result: { message: responseObj.description } });
                                                        }
                                                    });

                                                } else {
                                                    var updateScreen = {
                                                        name: req.body.screen_name
                                                    };

                                                    Screen.update({ id: screen_id }, updateScreen).exec(function (err, records) {
                                                        if (err) {
                                                            return res.json(409, { status: 'NOK', result: { message: err } });
                                                        } else {
                                                            var responseObj = {
                                                                user_id: user_id,
                                                                project_id: project_id,
                                                                projectId: project_id,
                                                                screen_id: screen_id,
                                                                description: "Screen updated successfully."
                                                            }
                                                            Dataservices.activitiLogs(responseObj);
                                                            return res.json(200, { status: 'OK', result: { message: responseObj.description } });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            }
                            else {
                                var responseObj = {
                                    status: 'error',
                                    message: "Project does not exists."
                                }
                                Dataservices.apicallError(req, res, responseObj, responseObj.status);
                                return res.json(404, { status: 'NOK', result: { message: responseObj.message } });
                            }
                        });
                    }
                    else {
                        var responseObj = {
                            status: 'error',
                            message: "Project does not exists."
                        }
                        Dataservices.apicallError(req, res, responseObj, responseObj.status);
                        return res.json(404, { status: 'NOK', result: { message: responseObj.message } });
                    }
                });
            }
        }
        else {
            Dataservices.methodNotAllowed(req, res);
        }
    },

    slist: function (req, res) {
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
        Project.find()
            .exec(function (err, records) {
                if (err) return res.badRequest(err);
                if (records < 1) return res.notFound({ message: "No Project found." });
                var count = records.length;
                var contPages = Math.ceil(count / perPage);
                var nextPageChek = (pageNo < contPages ? pageNo + 1 : false);
                var nextPageChekLink = (pageNo < contPages ? 1 + nextPageChek + '/' + perPage : false);
                if (pageNo > contPages || pageNo <= 0) return res.notFound({ message: "No page found." });

                var projectData = [];

                if (IDS !== undefined && req.method === 'POST') {
                    Project.update({ id: IDS }, status).
                        exec(function (err, project) {
                            Project.find()
                                .skip(req.body.start).limit(req.body.length)
                                .sort({ "_id": -1 })
                                .exec(function (err, records) {
                                    records.forEach(function (project) {
                                        projectData.push({
                                            name: project.name, image: project.image, status: project.status,
                                            description: project.description, notification_status: project.notification_status,
                                            button: "<a href='/project/view/" + project.id + "'" + "class='btn btn-xs blue btn-outline' title='View'>" +
                                                "<i class='fa fa-eye'></i>" + "View" +
                                                "</a>" +
                                                "<a onclick=\"return confirm('Do you want to delete this record?')\" href='/project/deleterecord/" + project.id + "'" + "class='btn btn-xs red btn-outline' title='Delete' data-on-confirm='delete admin' data-toggle='confirmation'>" +
                                                "<i class='fa fa-trash-o'></i>" + "Delete" +
                                                "</a>",
                                            checkbox: '<div class="checker"><span><input type="checkbox" class="group-checkable" name="id[]" value="' + project.id + '"></span></div>',
                                        });
                                    });
                                    var json = {
                                        data: projectData,
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
                        order['name'] = dir
                    } else if (orderby === '3') {
                        order['status'] = dir
                    } else if (orderby === '4') {
                        order['notification_status'] = dir
                    }
                    else if (orderby === '5') {
                        order['description'] = dir
                    }
                    var searchProject = new RegExp(req.body.project_name, "i");
                    var searchDesc = new RegExp(req.body.project_desc, "i");
                    var projectstatus = req.body.project_status ? req.body.project_status : new RegExp('', 'i');
                    if (projectstatus == 1) { projectstatus = 'Active' }
                    else if (projectstatus == 2) { projectstatus = 'Inactive' }

                    var notiStatus = req.body.notification_status ? req.body.notification_status : new RegExp('', 'i');
                    if (notiStatus == 1) { notiStatus = 'On hold' }
                    else if (notiStatus == 2) { notiStatus = 'In Progress' }
                    else if (notiStatus == 3) { notiStatus = 'Need to Review' }
                    else if (notiStatus == 4) { notiStatus = 'Approved' }


                    Project.find({ name: searchProject, description: searchDesc, status: projectstatus })
                        .skip(req.body.start).limit(req.body.length)
                        .sort(order)
                        .exec(function (err, records) {
                            records.forEach(function (project) {
                                projectData.push({
                                    name: project.name, image: project.image, status: project.status,
                                    description: project.description, notification_status: project.notification_status,
                                    button: "<a href='/projects/view/" + project.id + "'" + "class='btn btn-xs blue btn-outline' title='View'>" +
                                        "<i class='fa fa-eye'></i>" + "View" +
                                        "</a>" +
                                        "<a onclick=\"return confirm('Do you want to delete this record?')\" href='/project/deleterecord/" + project.id + "'" + "class='btn btn-xs red btn-outline' title='Delete' data-on-confirm='delete admin' data-toggle='confirmation'>" +
                                        "<i class='fa fa-trash-o'></i>" + "Delete" +
                                        "</a>",
                                    checkbox: '<div class="checker"><span><input type="checkbox" class="group-checkable" name="id[]" value="' + project.id + '"></span></div>',
                                });
                            });
                            var json = {
                                data: projectData,
                                recordsTotal: count,
                                recordsFiltered: count
                            };
                            if (err) return res.badRequest(err);
                            return res.json(json);
                        });
                }
            });
    },

    screenDetails: function (req, res) {
        if (req.method == 'GET') {
            Screen.findOne({ id: req.param('id'), }, function (err, screen) {
                if (err) {
                    Dataservices.somethingWrong(req, res);
                }
                if (!screen) {
                    var responseObj = {
                        status: 'error',
                        message: "Screen does not exists."
                    }
                    Dataservices.apicallError(req, res, responseObj, responseObj.status);
                    return res.json(404, { status: 'NOK', result: { message: responseObj.message } });
                }
                else {
                    return res.json(200, { status: 'OK', result: { screen: screen } });
                }
            })
        }
        else {
            Dataservices.methodNotAllowed(req, res);
        }
    },

    screenList: function (req, res) {
        if (req.method == 'GET') {
            Project.find({ id: req.param('id') })
                .populate('screen', { status: 'Active' })
                .exec(function (err, screens) {
                    if (err) {
                        Dataservices.somethingWrong(req, res);
                    }
                    if (screens) {
                        return res.json(200, { status: 'OK', result: { list: screens } });
                    }
                });
        } else {
            Dataservices.methodNotAllowed(req, res);
        }
    },

    shareProject: function (req, res, next) {
        if (req.method == 'GET') {
            var user_id = req.param('user_id'),
                project_id = req.param('project_id'),
                screen_id = req.param('screen_id');

            Screen.findOne({ id: screen_id }, function (err, screen) {
                if (err) {
                    Dataservices.somethingWrong(req, res);
                }
                if (screen) {
                    if (screen.status == "Inactive") {
                        var memberResponse = {
                            status: 'error',
                            message: "Screen is inactive, please contact administrator."
                        }
                        Dataservices.apicallError(req, res, memberResponse, memberResponse.status);
                        return res.json(401, { status: 'NOK', result: { message: memberResponse.message } });
                    } else {

                        User.findOne({ id: userId }, function (err, user) {
                            if (err) {
                                Dataservices.somethingWrong(req, res);
                            }
                            if (user) {
                                user.project.add(projectId);

                                user.save(function (err) {
                                    if (err) {
                                        Dataservices.somethingWrong(req, res);
                                    } else {
                                        var responseObj = {
                                            user_id: userId,
                                            project_id: projectId,
                                            projectId: projectId,
                                            description: "Project shared successfully."
                                        }
                                        console.log(responseObj);
                                        Dataservices.activitiLogs(responseObj);
                                        return res.redirect(sails.config.globals.APP_PATH + '/projects');
                                        // return res.json(200, { status: 'OK', result: { message: responseObj.description } });
                                    }
                                });
                            }
                        });
                    }
                }
                else {
                    var responseObj = {
                        status: 'error',
                        message: "Project does not exists."
                    }
                    Dataservices.apicallError(req, res, responseObj, responseObj.status);
                    return res.json(404, { status: 'NOK', result: { message: responseObj.message } });
                }
            });

        } else {
            Dataservices.methodNotAllowed(req, res);
        }

    },

    show: function (req, res) {
        let pageTitle = 'Screens' + " | " + sails.config.globals.APP_NAME;
        Screen.find({}, function (err, screen) {
            if (err) {
                Dataservices.somethingWrong(req, res);
            }
            return res.view('screens/screen', { title: pageTitle, screen: screen })
        })
    },

    screenDelete: function (req, res, next) {
        var id = req.param('id');
        Screen.destroy({ id: id }, function (err, project) {
            if (err) {
                return res.send(err)
            }
            req.addFlash('delete', 'Screen has been deleted..');
            return res.redirect('/screens')
        })

    },

    view: function (req, res) {
        if (req.method == 'GET') {
            let pageTitle = ' View | Screens' + " | " + sails.config.globals.APP_NAME;
            Screen.findOne({ id: req.param('id') })
                .exec(function (err, record) {
                    if (record) {
                        return res.view('screens/view/', { title: pageTitle, screen: record });
                    } else {
                        return res.redirect('404');
                    }
                });

        }
    },

    inviteMember: function (req, res) {
        if (req.method == 'POST') {
            var dataFromClient = req.params.all();
            var userId = dataFromClient.userId;
            var projId = dataFromClient.projId;
            var email = dataFromClient.email;

            User.findOne({ id: userId }, function (err, user) {
                if (err) {
                    Dataservices.somethingWrong(req, res);
                }
                if (!user) {
                    var responseObj = {
                        status: 'error',
                        message: "User does not exists."
                    }
                    Dataservices.apicallError(req, res, responseObj, responseObj.status);
                    return res.json(404, { status: 'NOK', result: { message: responseObj.message } });
                }
                if (user) {

                    Project.findOne({ id: projId }, function (err, project) {
                        if (err) {
                            Dataservices.somethingWrong(req, res);
                        }
                        if (project) {
                            if (project.status == "Inactive") {
                                var memberResponse = {
                                    status: 'error',
                                    message: "Project is inactive, please contact administrator."
                                }
                                Dataservices.apicallError(req, res, memberResponse, memberResponse.status);
                                return res.json(401, { status: 'NOK', result: { message: memberResponse.message } });
                            } else {

                                Member.findOne({ email: email }, function (err, member) {
                                    if (err) {
                                        Dataservices.somethingWrong(req, res);
                                    }
                                    if (member) {
                                        SendMail.inviteMember(user, project, member);
                                        return res.json(200, { status: 'OK', result: { message: "Invitation sent successfully." } });
                                    }
                                });
                            }
                        }
                        else {
                            var responseObj = {
                                status: 'error',
                                message: "Project does not exists."
                            }
                            Dataservices.apicallError(req, res, responseObj, responseObj.status);
                            return res.json(404, { status: 'NOK', result: { message: responseObj.message } });
                        }
                    });
                }
            });

        }
        else {
            Dataservices.methodNotAllowed(req, res);
        }
    },

    changeStatus: function (req, res) {
        if (req.method === "POST") {
            var screen_id = req.param('id'),
                screen_status = req.body.status,
                screen_notification_status = req.body.workflow_status,
                user_id = req.body.user_id;

            Screen.findOne({ id: screen_id })
                .exec(function (err, record) {
                    if (record) {
                        var updateScreen;

                        if (screen_status && screen_notification_status) {
                            updateScreen = {
                                status: screen_status,
                                notification_status: screen_notification_status
                            }
                        } else if (screen_status) {
                            updateScreen = {
                                status: screen_status
                            }
                        } else if (screen_notification_status) {
                            updateScreen = {
                                notification_status: screen_notification_status
                            }
                        } else {
                            updateScreen = record
                        }

                        Screen.update({ id: screen_id }, updateScreen).exec(function (err, screen) {
                            if (err) {
                                return res.json(409, { status: 'NOK', result: { message: err } });
                            } else {
                                var responseObj = {
                                    user_id: user_id,
                                    project_id: screen.project_id,
                                    projectId: screen.project_id,
                                    screen_id: screen_id,
                                    description: "Status has been changed."
                                }
                                Dataservices.activitiLogs(responseObj);
                                return res.json(200, { status: 'OK', result: { message: responseObj.description } });
                            }
                        });
                    } else {
                        Dataservices.somethingWrong(req, res);
                        return res.redirect('404');
                    }
                });
        } else {
            Dataservices.methodNotAllowed(req, res);
        }
    },

    duplicateScreen: function (req, res) {
        if (req.method === "POST") {
            var screen_id = req.param('screen_id'),
                user_id = req.body.user_id,
                date = new Date(),
                timeStamp = date.getTime(),
                lastDigits = timeStamp.toString().substr(-6);
            Project.findOne({ id: req.param('project_id') }, function (err, project) {
                Screen.findOne({ id: screen_id })
                    .exec(function (err, record) {
                        var dir = process.cwd() + '/.tmp/public/images/';
                        if (!fs.existsSync(dir)) {
                            fs.mkdirSync(dir);
                        }
                        var filename = record.image
                        let getExt = filename.split('.').pop();
                        let newFileName = timeStamp + '-copy-123.' + getExt;
                        var uploadLocation = process.cwd() + '/assets/images/' + filename;
                        var uploadLocationCopy = process.cwd() + '/assets/images/' + newFileName;
                        var tempLocation = process.cwd() + '/.tmp/public/images/' + newFileName;

                        //if (sails.config.environment !== 'development') {
                        fs.createReadStream(uploadLocation).pipe(fs.createWriteStream(uploadLocationCopy));
                        fs.createReadStream(uploadLocation).pipe(fs.createWriteStream(tempLocation));
                        //}

                        var newScreen = {
                            user_id: user_id,
                            name: record.name + lastDigits,
                            //description: description,
                            project_id: record.project_id,
                            image: newFileName
                        };
                        Screen.create(newScreen).exec(function (err, screen) {
                            if (err) {
                                return res.json(404, { status: 'NOK', result: { message: err } });
                            }
                            else {
                                project.screen.add(screen.id);

                                project.save(function (err) {
                                    if (err) {
                                        Dataservices.somethingWrong(req, res);
                                    } else {
                                        var responseObj = {
                                            user_id: user_id,
                                            project_id: record.project_id,
                                            projectId: record.project_id,
                                            screen_id: screen.id,
                                            description: "Screen duplication successful."
                                        }
                                        Dataservices.activitiLogs(responseObj);
                                        return res.json(200, { status: 'OK', screen: screen, result: { message: responseObj.description } });
                                    }
                                });
                                //return res.json(200, { status: 'OK', screen: screen, result: { message: "Screen duplication successful." } });
                            }
                        });
                    });
            });
        } else {
            Dataservices.methodNotAllowed(req, res);
        }
    },

    searchScreenByQuery: function (req, res) {
        if (req.method === "GET") {
            var queryText = req.query.screenQuery,
                project_id = req.param('project_id');
            Screen.find({
                name: {
                    'contains': queryText
                }, project_id: project_id, status: 'Active'
            }).exec(function (err, record) {
                if (err) {
                    return res.json(404, { status: 'NOK', result: { message: err } });
                } else {
                    return res.json(200, { status: 'OK', screen: record, result: { message: "Total " + record.length + " records found" } });
                }
            })
        } else {
            Dataservices.methodNotAllowed(req, res);
        }
    },

    workflowScreen: function (req, res) {
        if (req.method === "GET") {
            var project_id = req.param('project_id');

            Screen.find({ notification_status: 'new', project_id: project_id, status: 'Active' }).exec(function (err, newScreen) {
                Screen.find({ notification_status: 'in_progress', project_id: project_id, status: 'Active' }).exec(function (err, progressScreen) {
                    Screen.find({ notification_status: 'on_hold', project_id: project_id, status: 'Active' }).exec(function (err, onholdScreen) {
                        Screen.find({ notification_status: 'approved', project_id: project_id, status: 'Active' }).exec(function (err, approvedScreen) {
                            var screenData = {
                                newScreen: newScreen,
                                progressScreen: progressScreen,
                                onholdScreen: onholdScreen,
                                approvedScreen: approvedScreen
                            }
                            return res.json(200, { status: 'OK', screenData: screenData, result: { message: "All srceen status" } });
                        })
                    })
                })
            })
        } else {
            Dataservices.methodNotAllowed(req, res);
        }
    }
};
