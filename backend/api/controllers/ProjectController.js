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
            var proj_name = req.body.proj_name,
                description = req.body.description,
                user_id = req.param('id');
            var errorObj = {};
            if (proj_name == null || proj_name == "") {
                errorObj.proj_name = "Project name is required";
            }
            if (description == null || description == "") {
                errorObj.description = "Project description is required";
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

                    User.findOne({ id: req.param('id') }, function (err, user) {
                        if (err) {
                            Dataservices.somethingWrong(req, res);
                        }
                        if (user) {
                            req.file('uploadFile').upload({
                                dirname: process.cwd() + '/assets/images/',
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
                                    // if (sails.config.environment !== 'development') {
                                    fs.createReadStream(uploadLocation).pipe(fs.createWriteStream(tempLocation));
                                    // }
                                    var newProject = {
                                        user_id: req.param('id'),
                                        name: proj_name,
                                        description: description,
                                        userId: req.param('id'),
                                        image: img
                                    };

                                    Project.create(newProject).exec(function (err, project) {
                                        if (err) {
                                            var responseObj = {
                                                status: 'error',
                                                message: err
                                            }
                                            Dataservices.apicallError(req, res, responseObj, responseObj.status);
                                            return res.json(409, { status: 'NOK', result: { message: responseObj.message } });
                                        }
                                        else {
                                            user.project.add(project.id);

                                            user.save(function (err) {
                                                if (err) {
                                                    Dataservices.somethingWrong(req, res);
                                                } else {
                                                    var responseObj = {
                                                        user_id: user_id,
                                                        project_id: project.id,
                                                        projectId: project.id,
                                                        description: "Project created successfully."
                                                    }
                                                    console.log('responseObj', responseObj)
                                                    Dataservices.activitiLogs(responseObj);
                                                    return res.json(200, { status: 'OK', project: project, result: { message: responseObj.description } });
                                                }
                                            });
                                        }
                                    });
                                } else {

                                    Project.create({ name: proj_name, user_id: req.param('id'), description: description, image: '' }).exec(function (err, project) {
                                        if (err) {
                                            var responseObj = {
                                                status: 'error',
                                                message: "Project name already exists."
                                            }
                                            Dataservices.apicallError(req, res, responseObj, responseObj.status);
                                            return res.json(409, { status: 'NOK', result: { message: responseObj.message } });
                                        } else {
                                            user.project.add(project.id);

                                            user.save(function (err) {
                                                if (err) {
                                                    Dataservices.somethingWrong(req, res);
                                                } else {
                                                    var responseObj = {
                                                        user_id: user_id,
                                                        project_id: project.id,
                                                        projectId: project.id,
                                                        description: "Project created successfully."
                                                    }
                                                    console.log('responseObj', responseObj)
                                                    Dataservices.activitiLogs(responseObj);
                                                    return res.json(200, { status: 'OK', project: project, result: { message: responseObj.description } });
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
                                message: "User does not exists."
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

    delete: function (req, res, next) {

        if (req.method == 'POST') {
            var project_id = req.param('project_id');

            Project.findOne({ 'id': project_id }, function (err, project) {
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
                        Project.destroy({ id: project_id }).exec(function (err, project) {
                            var responseObj = {
                                user_id: project[0].user_id,
                                project_id: project.id,
                                projectId: project_id,
                                description: "Project deleted successfully."
                            }
                            Dataservices.activitiLogs(responseObj);
                            return res.json(200, { status: 'OK', result: { message: responseObj.description } });
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
            Dataservices.methodNotAllowed(req, res);
        }
    },

    update: function (req, res, next) {

        if (req.method == 'POST') {
            var project_id = req.param('project_id'),
                user_id = req.param('user_id'),
                proj_name = req.body.proj_name,
                description = req.body.description;
            var errorObj = {};

            if (proj_name == null || proj_name == "") {
                errorObj.proj_name = "Project name is required";
            }
            if (description == null || description == "") {
                errorObj.description = "Description is required";
            }
            if (Object.keys(errorObj).length) {
                errorObj.status = "error"
                var responseObj = {
                    status: errorObj.status,
                }
                Dataservices.apicallError(req, res, errorObj, responseObj.status);
                return res.json(400, { status: 'NOK', result: { message: errorObj } });
            }
            if (Object.keys(errorObj).length === 0) {

                User.findOne({ id: req.body.user_id }, function (err, user) {
                    if (err)
                        Dataservices.somethingWrong(req, res);
                    if (user) {

                        Project.findOne({ id: project_id, user_id: user_id }, function (err, project) {

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

                                    req.file('uploadFile').upload({
                                        maxBytes: 10000000,
                                        dirname: process.cwd() + '/assets/images/'
                                    }, function (error, uploadedFiles) {

                                        var updateProject = {
                                            name: req.body.proj_name,
                                            description: req.body.description,
                                        };
                                        if (!error && uploadedFiles.length > 0) {
                                            var dir = process.cwd() + '/.tmp/public/images/';
                                            if (!fs.existsSync(dir)) {
                                                fs.mkdirSync(dir);
                                            }
                                            var filename = uploadedFiles[0].fd.substring(uploadedFiles[0].fd.lastIndexOf('/') + 1);
                                            var img = require('path').basename(filename);
                                            // if (sails.config.environment !== 'development') {
                                            var uploadLocation = process.cwd() + '/assets/images/' + filename;
                                            var tempLocation = process.cwd() + '/.tmp/public/images/' + filename;
                                            fs.createReadStream(uploadLocation).pipe(fs.createWriteStream(tempLocation));
                                            // }
                                            updateProject.image = img;

                                            Project.update({ id: project_id }, updateProject).exec(function (err, records) {
                                                if (err) {
                                                    var responseObj = {
                                                        status: 'error',
                                                        message: "Project name already exists."
                                                    }
                                                    Dataservices.apicallError(req, res, responseObj, responseObj.status);
                                                    return res.json(409, { status: 'NOK', result: { message: responseObj.message } });
                                                } else {
                                                    var responseObj = {
                                                        user_id: user_id,
                                                        project_id: project_id,
                                                        projectId: project_id,
                                                        description: "Project updated successfully."
                                                    }
                                                    Dataservices.activitiLogs(responseObj);
                                                    return res.json(200, { status: 'OK', result: { message: responseObj.description } });
                                                }
                                            });
                                        } else {
                                            var updateProject = {
                                                name: req.body.proj_name,
                                                description: req.body.description,
                                            };

                                            Project.update({ id: project_id }, updateProject).exec(function (err, records) {
                                                if (err) {
                                                    var responseObj = {
                                                        status: 'error',
                                                        message: "Project name already exists."
                                                    }
                                                    Dataservices.apicallError(req, res, responseObj, responseObj.status);
                                                    return res.json(409, { status: 'NOK', result: { message: responseObj.message } });
                                                } else {
                                                    var responseObj = {
                                                        user_id: user_id,
                                                        project_id: project_id,
                                                        projectId: project_id,
                                                        description: "Project updated successfully."
                                                    }
                                                    Dataservices.activitiLogs(responseObj);
                                                    return res.json(200, { status: 'OK', result: { message: responseObj.description } });
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
                            message: "User does not exists."
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

    plist: function (req, res) {
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

    record: function (req, res, next) {
        if (req.method == 'GET') {
            var userId = req.param('user_id');

            Project.find({ user_id: userId, status: 'Active' }, function (err, project) {
                if (err) {
                    Dataservices.somethingWrong(req, res);
                }
                if (!project) {
                    var responseObj = {
                        status: 'error',
                        message: "Project does not exists."
                    }
                    Dataservices.apicallError(req, res, responseObj, responseObj.status);
                    return res.json(404, { status: 'NOK', result: { message: responseObj.message } });
                }
                else {
                    return res.json(200, { status: 'OK', result: { project: project } });
                }
            })
        }
        else {
            Dataservices.methodNotAllowed(req, res);
        }
    },

    projectList: function (req, res, next) {
        User.find({ id: req.param('id') })
            .populate('project', { status: 'Active' })
            .exec(function (err, projects) {
                if (err) {
                    Dataservices.somethingWrong(req, res);
                }
                if (projects) {
                    return res.json(200, { status: 'OK', result: { list: projects } });
                }
            });
    },

    shareProject: function (req, res, next) {
        if (req.method == 'GET') {
            var userId = req.param('user_id'),
                projectId = req.param('project_id');
            console.log(userId, projectId)

            Project.findOne({ id: projectId }, function (err, project) {
                if (err) {
                    Dataservices.somethingWrong(req, res);
                }
                if (project) {
                    if (project.status == "InActive") {
                        var memberResponse = {
                            status: 'error',
                            message: "Project is inactive, please contact administrator."
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
        let pageTitle = 'Projects' + " | " + sails.config.globals.APP_NAME;
        Project.find({}, function (err, project) {
            if (err) {
                Dataservices.somethingWrong(req, res);
            }
            return res.view('projects/project', { title: pageTitle, project: project })
        })
    },

    projectDelete: function (req, res, next) {
        var id = req.param('id');
        Project.destroy({ id: id }, function (err, project) {
            if (err) {
                return res.send(err)
            }
            req.addFlash('delete', 'Project has been deleted..');
            return res.redirect('/projects')
        })

    },

    view: function (req, res) {
        if (req.method == 'GET') {
            let pageTitle = ' View | Projects' + " | " + sails.config.globals.APP_NAME;
            Project.findOne({ id: req.param('id') })
                .exec(function (err, record) {
                    if (record) {
                        return res.view('projects/view/', { title: pageTitle, project: record });
                    } else {
                        return res.redirect('404');
                    }
                });

        }
    },

    inviteteam: function (req, res) {
        if (req.method == 'POST') {
            var dataFromClient = req.params.all();
            var userId = dataFromClient.userId;
            var projId = dataFromClient.projId;
            var teamId = dataFromClient.teamId;

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
                            if (project.status == "InActive") {
                                var memberResponse = {
                                    status: 'error',
                                    message: "Project is inactive, please contact administrator."
                                }
                                Dataservices.apicallError(req, res, memberResponse, memberResponse.status);
                                return res.json(401, { status: 'NOK', result: { message: memberResponse.message } });
                            } else {

                                TeamMember.find({ team_id: teamId }).populateAll().exec(function (err, list) {
                                    if (err) {
                                        Dataservices.somethingWrong(req, res);
                                    }
                                    else {
                                        var asyncLoop = require('node-async-loop')
                                        let check;
                                        asyncLoop(list, function (team, next) {

                                            check = { email: team.member_id.email };

                                            User.findOne(check, function (err, existMember) {
                                                if (err) {
                                                    Dataservices.somethingWrong(req, res);
                                                }
                                                if (!existMember) {
                                                    SendMail.askToRegisterUser(user, project, check.email);
                                                    //return res.json(200, { status: 'OK', result: { message: "Request sent successfully." } });
                                                } else {
                                                    SendMail.inviteMember(user, project, existMember);
                                                    var newIds = project.user_id;
                                                    var getIds = newIds.push(existMember.id);
                                                    var xs = newIds; let result = [];
                                                    xs.forEach((el) => {
                                                        if (!result.includes(el)) result.push(el);
                                                    });
                                                    var updateData = {
                                                        user_id: newIds
                                                    }
                                                    Project.update({ id: projId }, updateData).exec(function (err, project) {
                                                        if (err) {
                                                            Dataservices.somethingWrong(req, res);
                                                        }
                                                        //return res.json(200, { status: 'OK', result: { message: "Invitation sent successfully." } });
                                                    })
                                                }
                                            })
                                            next();
                                        }, function () {
                                            return res.json(200, { status: 'OK', result: { message: "Invitation sent successfully." } });
                                        })
                                    }
                                })
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
                            if (project.status == "InActive") {
                                var memberResponse = {
                                    status: 'error',
                                    message: "Project is inactive, please contact administrator."
                                }
                                Dataservices.apicallError(req, res, memberResponse, memberResponse.status);
                                return res.json(401, { status: 'NOK', result: { message: memberResponse.message } });
                            } else {
                                User.findOne({ email: email }, function (err, existMember) {
                                    if (err) {
                                        Dataservices.somethingWrong(req, res);
                                    }
                                    if (!existMember) {
                                        SendMail.askToRegisterUser(user, project, email);
                                        return res.json(200, { status: 'OK', result: { message: "Request sent successfully." } });
                                    } else {
                                        SendMail.inviteMember(user, project, existMember);
                                        var newIds = project.user_id;
                                        var getIds = newIds.push(existMember.id)
                                        var xs = newIds; let result = [];
                                        xs.forEach((el) => {
                                            if (!result.includes(el)) result.push(el);
                                        });
                                        var updateData = {
                                            user_id: result
                                        }
                                        Project.update({ id: projId }, updateData).exec(function (err, project) {
                                            if (err) {
                                                Dataservices.somethingWrong(req, res);
                                            } else {
                                                return res.json(200, { status: 'OK', result: { message: "Invitation sent successfully." } });
                                            }
                                        })
                                    }
                                })
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
            var project_id = req.param('id'),
                project_status = req.body.status,
                //project_notification_status = req.body.workflaw_status,
                user_id = req.body.user_id;

            Project.findOne({ id: project_id })
                .exec(function (err, record) {
                    if (record) {
                        var updateProject;
                        // if (project_status && project_notification_status) {
                        //     updateProject = {
                        //         status: project_status,
                        //         notification_status: project_notification_status
                        //     }
                        // } else
                        if (project_status) {
                            updateProject = {
                                status: project_status
                            }
                        } else {
                            updateProject = record
                        }
                        //  else if (project_notification_status) {
                        //     updateProject = {
                        //         notification_status: project_notification_status
                        //     }
                        // } else {
                        //     updateProject = record
                        // }
                        Project.update({ id: project_id }, updateProject).exec(function (err, project) {
                            if (err) {
                                return res.json(409, { status: 'NOK', result: { message: err } });
                            } else {
                                var responseObj = {
                                    user_id: user_id,
                                    project_id: project_id,
                                    projectId: project_id,
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

    duplicateProject: function (req, res) {
        if (req.method === "POST") {
            var project_id = req.param('id'),
                user_id = req.body.user_id,
                date = new Date(),
                timeStamp = date.getTime(),
                lastDigits = timeStamp.toString().substr(-6);
            User.findOne({ id: user_id }, function (err, user) {
                if (err) {
                    Dataservices.somethingWrong(req, res);
                }
                if (user) {
                    Project.findOne({ id: project_id })
                        .exec(function (err, project) {
                            var dir = process.cwd() + '/.tmp/public/images/';
                            if (!fs.existsSync(dir)) {
                                fs.mkdirSync(dir);
                            }
                            var filename = project.image;
                            var timeStamp = date.getTime();
                            let getExt = filename.split('.').pop();
                            let newFileName = timeStamp + '-project-copy-123.' + getExt;
                            var uploadLocation = process.cwd() + '/assets/images/' + filename;
                            var uploadLocationCopy = process.cwd() + '/assets/images/' + newFileName;
                            var tempLocation = process.cwd() + '/.tmp/public/images/' + newFileName;

                            //if (sails.config.environment !== 'development') {
                            fs.createReadStream(uploadLocation).pipe(fs.createWriteStream(uploadLocationCopy));
                            fs.createReadStream(uploadLocation).pipe(fs.createWriteStream(tempLocation));
                            //}
                            var newProject = {
                                user_id: user_id,
                                name: project.name + lastDigits,
                                description: project.description,
                                userId: user_id,
                                image: newFileName
                            };

                            Project.create(newProject).exec(function (err, project) {
                                if (err) {
                                    return res.json(404, { status: 'NOK', result: { message: err } });
                                }
                                else {
                                    user.project.add(project.id);

                                    user.save(function (err) {
                                        if (err) {
                                            Dataservices.somethingWrong(req, res);
                                        } else {
                                            var responseObj = {
                                                user_id: user_id,
                                                project_id: project.id,
                                                description: "Project created successfully."
                                            }
                                            Dataservices.activitiLogs(responseObj);
                                            Screen.find({ project_id: project_id }).exec(function (errScreen, records) {
                                                if (errScreen) {
                                                    return res.json(404, { status: 'NOK', result: { message: err } });
                                                } else {
                                                    if (records.length > 0) {
                                                        records.forEach(record => {
                                                            var screenfilename = record.image
                                                            let getExt1 = screenfilename.split('.').pop();
                                                            let newScreenFileName = timeStamp + record.id + '-copy-sc.' + getExt1;
                                                            var uploadLocation1 = process.cwd() + '/assets/images/' + screenfilename;
                                                            var uploadLocationCopy1 = process.cwd() + '/assets/images/' + newScreenFileName;
                                                            var tempLocation1 = process.cwd() + '/.tmp/public/images/' + newScreenFileName;

                                                            //if (sails.config.environment !== 'development') {
                                                            fs.createReadStream(uploadLocation1).pipe(fs.createWriteStream(uploadLocationCopy1));
                                                            fs.createReadStream(uploadLocation1).pipe(fs.createWriteStream(tempLocation1));
                                                            //}

                                                            var newScreen = {
                                                                user_id: user_id,
                                                                name: record.name + lastDigits,
                                                                project_id: project.id,
                                                                image: newScreenFileName
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
                                                                            var responseObj1 = {
                                                                                user_id: user_id,
                                                                                project_id: project.id,
                                                                                projectId: project.id,
                                                                                screen: screen.id,
                                                                                description: "Screen created successfully."
                                                                            }
                                                                            Dataservices.activitiLogs(responseObj1);
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        })
                                                        return res.json(200, { status: 'OK', project: project, result: { message: "Project duplication successful." } });
                                                    } else {
                                                        return res.json(200, { status: 'OK', project: project, result: { message: "Project duplication successful." } });
                                                    }
                                                }

                                            })
                                            //return res.json(200, { status: 'OK', project: project, result: { message: responseObj.description } });
                                        }
                                    });

                                }
                            });
                        });
                }
            });
        } else {
            Dataservices.methodNotAllowed(req, res);
        }
    },

    searchProjectByQuery: function (req, res) {
        if (req.method === "GET") {
            var queryText = req.query.projectQuery;
            Project.find({
                name: {
                    'contains': queryText
                }, status: 'Active'
            }).exec(function (err, record) {
                if (err) {
                    return res.json(404, { status: 'NOK', result: { message: err } });
                } else {
                    return res.json(200, { status: 'OK', project: record, result: { message: "Total " + record.length + " records found" } });
                }
            })
        } else {
            Dataservices.methodNotAllowed(req, res);
        }
    }
};
