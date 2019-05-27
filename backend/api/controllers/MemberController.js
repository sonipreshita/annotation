/**
 * MemberController
 *
 * @description :: Server-side logic for managing Administrators
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var jwt = require('jsonwebtoken');
module.exports = {

    add: function (req, res) {
        if (req.method === 'POST') {
            var emailvalid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            var firstname = req.body.firstname,
                lastname = req.body.lastname,
                user_id = req.param('id'),
                email = req.body.email;
            const SEARCH = req.params.query;
            var errorObj = {};
            if (firstname == null || firstname == "") {
                errorObj.firstname = "first name is required";
            }
            if (lastname == null || lastname == "") {
                errorObj.lastname = "last name is required";
            }
            if (email == null || email == "") {
                errorObj.email = "email is required";
            } else if (!emailvalid.test(email)) {
                errorObj.email = "email is not valid";
            }
            if (Object.keys(errorObj).length) {
                errorObj.status = "error"
                var responseObj = {
                    status: errorObj.status,
                }
                Dataservices.apicallError(req, res, errorObj, responseObj.status);
                return res.json(400, { status: 'NOK', result: { message: errorObj } });
            } else {

                User.findOne({ id: req.param('id') }, function (err, user) {
                    if (err) {
                        Dataservices.somethingWrong(req, res);
                    }
                    if (user) {
                        Member.findOne({ email: req.body.email, user_id: req.param('id') }, function (err, member) {

                            if (err) {
                                Dataservices.somethingWrong(req, res);
                            }
                            if (member) {
                                var responseObj = {
                                    status: 'error',
                                    message: "Member already exists."
                                }
                                Dataservices.apicallError(req, res, responseObj, responseObj.status);
                                return res.json(409, { status: 'NOK', result: { message: responseObj.message } });
                            }
                            else {
                                var member_details = {
                                    user_id: req.param('id'),
                                    firstname: req.body.firstname,
                                    lastname: req.body.lastname,
                                    email: req.body.email,
                                    userId: req.param('id'),
                                    //teamId: req.param('id'),
                                }

                                Member.create(member_details, function (err, member) {
                                    if (err) {
                                        Dataservices.somethingWrong(req, res);
                                    }
                                    var responseObj = {
                                        user_id: user_id,
                                        member_id: member.id,
                                        description: "Member added successfully."
                                    }
                                    Dataservices.activitiLogs(responseObj);
                                    return res.json(200, { status: 'OK', member: member, result: { message: responseObj.description } });
                                })

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
                })
            }
        } else {
            Dataservices.methodNotAllowed(req, res);
        }
    },

    showMembers: function (req, res, next) {

        if (req.method == 'GET') {

            Member.findOne({ id: req.param('id') }, function (err, member) {
                if (err) {
                    Dataservices.somethingWrong(req, res);
                }
                if (member) {
                    return res.json(200, { status: 'OK', member: member, result: { message: "Member Found." } });
                }
                else {
                    var responseObj = {
                        status: 'error',
                        message: "Member does not exists."
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
            var emailvalid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            var id = req.param('id'),
                firstname = req.body.firstname,
                lastname = req.body.lastname,
                email = req.body.email;
            var errorObj = {};
            if (firstname == null || firstname == "") {
                errorObj.firstname = "First name is required.";
            }
            if (lastname == null || lastname == "") {
                errorObj.lastname = "Last name is required.";
            }
            if (email == null || email == "") {
                errorObj.email = "Email is required.";
            } else if (!emailvalid.test(email)) {
                errorObj.email = "Email is not valid.";
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

                Member.findOne({ id: id }, function (err, member) {
                    if (err)
                        Dataservices.somethingWrong(req, res);
                    if (member) {
                        if (member.status == "Inactive") {
                            var memberResponse = {
                                status: 'error',
                                message: "Member is inactive, please contact administrator."
                            }
                            Dataservices.apicallError(req, res, memberResponse, memberResponse.status);
                            return res.json(401, { status: 'NOK', result: { message: memberResponse.message } });
                        }
                        else {
                            var updateMember = {
                                firstname: req.param('firstname'),
                                lastname: req.param('lastname'),
                                email: req.param('email'),
                            };

                            Member.update({ id: id }, updateMember).exec(function (err, records) {

                                if (err) {
                                    var responseObj = {
                                        status: 'error',
                                        message: "Email already exists."
                                    }
                                    Dataservices.apicallError(req, res, responseObj, responseObj.status);
                                    return res.json(404, { status: 'NOK', result: { message: responseObj.message } });
                                } else {
                                    var responseObj = {
                                        member_id: id,
                                        description: "Member updated successfully."
                                    }
                                    Dataservices.activitiLogs(responseObj);
                                    return res.json(200, { status: 'OK', result: { message: responseObj.description } });
                                }
                            });
                        }
                    }
                    else {
                        var responseObj = {
                            status: 'error',
                            message: "Member does not exists."
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

    delete: function (req, res, next) {

        if (req.method == 'POST') {
            var memberId = req.param('id');

            Member.findOne({ id: req.param('id') }, function (err, member) {
                if (err) {
                    Dataservices.somethingWrong(req, res);
                }
                if (member) {
                    if (member.status == "Inactive") {
                        var memberResponse = {
                            status: 'error',
                            message: "Member is inactive, please contact administrator."
                        }
                        Dataservices.apicallError(req, res, memberResponse, memberResponse.status);
                        return res.json(401, { status: 'NOK', result: { message: memberResponse.message } });
                    } else {
                        Member.destroy({ id: req.param('id') }).exec(function (err, member) {
                            var responseObj = {
                                user_id: member[0].user_id,
                                member_id: memberId,
                                description: "Member deleted successfully."
                            }
                            Dataservices.activitiLogs(responseObj);
                            return res.json(200, { status: 'OK', result: { message: responseObj.description } });

                        });
                    }
                }
                else {
                    var responseObj = {
                        status: 'error',
                        message: "Member does not exists."
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
        Member.find()
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

                    var memberData = [];

                    if (IDS !== undefined && req.method === 'POST') {
                        Member.update({ id: IDS }, status).
                            exec(function (err, member) {
                                Member.find()
                                    .skip(req.body.start).limit(req.body.length)
                                    .sort({ "_id": -1 })
                                    .exec(function (err, records) {
                                        if (typeof records !== 'undefined' && records.length > 0) {
                                            records.forEach(function (member) {
                                                memberData.push({
                                                    firstname: member.firstname, lastname: member.lastname, email: member.email, status: member.status,
                                                    button: "<a href='members/view/" + member.id + "'" + "class='btn btn-xs blue btn-outline' title='View'>" +
                                                        "<i class='fa fa-eye'></i>" + "View" +
                                                        "</a>" +
                                                        "<a onclick=\"return confirm('Do you want to delete this record?')\" href='/members/deleterecord/" + member.id + "'" + "class='btn btn-xs red btn-outline' title='Delete' data-on-confirm='delete admin' data-toggle='confirmation'>" +
                                                        "<i class='fa fa-trash-o'></i>" + "Delete" +
                                                        "</a>",
                                                    checkbox: '<div class="checker"><span><input type="checkbox" class="group-checkable" name="id[]" value="' + member.id + '"></span></div>',
                                                });
                                            });
                                        }
                                        var json = {
                                            data: memberData,
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
                            order['firstname'] = dir
                        } else if (orderby === '2') {
                            order['email'] = dir
                        } else if (orderby === '3') {
                            order['status'] = dir
                        }

                        var searchMember = new RegExp(req.body.member_name, "i");
                        var searchEmail = new RegExp(req.body.member_email, "i");
                        var memberstatus = req.body.member_status ? req.body.member_status : new RegExp('', 'i');
                        if (memberstatus == 1) { memberstatus = 'Active' }
                        else if (memberstatus == 2) { memberstatus = 'Inactive' }
                        else if (memberstatus == 3) { memberstatus = 'Delete' }
                        Member.find({ email: searchEmail, $or: [{ firstname: searchMember }, { lastname: searchMember }] })
                            .where({ status: memberstatus })
                            .skip(req.body.start).limit(req.body.length)
                            .sort(order)
                            .exec(function (err, records) {
                                if (typeof records !== 'undefined' && records.length > 0) {
                                    records.forEach(function (member) {
                                        memberData.push({
                                            firstname: member.firstname, lastname: member.lastname, email: member.email, status: member.status,
                                            button: "<a href='members/view/" + member.id + "'" + "class='btn btn-xs blue btn-outline' title='View'>" +
                                                "<i class='fa fa-eye'></i>" + "View" +
                                                "</a>" +
                                                "<a onclick=\"return confirm('Do you want to delete this record?')\" href='/members/deleterecord/" + member.id + "'" + "class='btn btn-xs red btn-outline' title='Delete' >" +
                                                "<i class='fa fa-trash-o'></i>" + "Delete" +
                                                "</a>",

                                            checkbox: '<div class="checker"><span><input type="checkbox" class="group-checkable" name="id[]" value="' + member.id + '"></span></div>',
                                        });
                                    });
                                }
                                var json = {
                                    data: memberData,
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

    memberList: function (req, res) {
        if (req.method === 'GET') {
            var memebrs = [];
            var options = {
                "sort": [['firstname', 'asc']]
            }
            User.find({ id: req.param('id') })
                .populate('member', { sort: { '_id': -1 } })
                .exec(function (err, members) {
                    // console.log(members);
                    let membersdata = members;
                    if (err) return res.json(400, { status: 'NOK', result: { message: err } });

                    res.json(200, {
                        status: 'OK',
                        result: { membersdata }
                    });
                });
        } else {
            Dataservices.methodNotAllowed(req, res);
        }
    },

    show: function (req, res) {
        let pageTitle = 'Members' + " | " + sails.config.globals.APP_NAME;
        Member.find({}, function (err, member) {
            if (err) {
                return res.send(err)
            }
            return res.view('members/member', { title: pageTitle, member: member })
        })
    },

    memberDelete: function (req, res, next) {
        //  if (req.session.userPermissions.includes("member_delete")) {
        var id = req.param('id');
        Member.destroy({ id: id }, function (err, members) {
            if (err) {
                return res.send(err)
            }
            TeamMember.destroy({ member_id: id }).exec(function (err, team) {
                req.addFlash('success', 'Member has been deleted.');
                return res.redirect('/members')
            });
        })
        //  }else{
        //         req.addFlash('error', 'You dont have permission to delete member.');
        //         return res.redirect('/members')
        //  }
    },

    addmembers: function (req, res) {

        if (req.method == 'GET') {
            let pageTitle = ' Add | Members' + " | " + sails.config.globals.APP_NAME;
            User.find().exec(function (err, records) {
                return res.view('members/add', { title: pageTitle, users: records });
            });
        } else {
            var user_details = {
                firstname: req.param('fname'),
                lastname: req.param('lname'),
                email: req.param('email'),
                user_id: req.param('user_id'),
            }
            var email = user_details.email;
            Member.findOne({ email: email }, function (err, member) {

                if (member) {

                    req.addFlash('error', 'Email already exists');
                    res.redirect('/members/add');
                } else {
                    Member.create(user_details, function (err, member) {
                        if (err) {
                            return res.view('members/add', { error: err, member: member })
                        }
                        req.addFlash('success', 'Member added successfully.');
                        return res.redirect('/members')
                    })
                }
            });
        }
    },

    view: function (req, res) {

        if (req.method == 'GET') {
            // if (req.session.userPermissions.includes("member_view")) {
            let pageTitle = ' View | Members' + " | " + sails.config.globals.APP_NAME;
            var id = req.param('id');

            Member.findOne({ id: req.params.id })
                .exec(function (err, record) {
                    if (record) {
                        return res.view('members/view/', { title: pageTitle, member: record });
                    } else {
                        return res.redirect('404');
                    }
                });
            // } else {
            //     req.addFlash('error', 'You dont have permission to view member.');
            //     return res.redirect('/members')
            // }
        }
    },

    userlist: function (req, res) {

        User.find({}, function (err, user) {
            if (err) {
                return res.send(err)
            }
            return res.view('members/add', { user: user })
        })
    },
};
