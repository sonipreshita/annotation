/**
 * TeamController
 *
 * @description :: Server-side logic for managing Administrators
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    create: function (req, res) {

        if (req.method === 'POST') {
            var errorObj = {};
            var teamName = req.body.name;
            var userId = req.param('user_id');
            var memberIds = req.param('member_ids');
            if (teamName == null || teamName == "") {
                errorObj.teamName = "Team Name is required";
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

                        Member.find({ id: memberIds }, function (err, member) {
                            if (err) {

                                Dataservices.somethingWrong(req, res);
                            }
                            if (!member) {
                                var responseObj = {
                                    status: 'error',
                                    message: "Member does not exists."
                                }
                                Dataservices.apicallError(req, res, responseObj, responseObj.status);
                                return res.json(404, { status: 'NOK', result: { message: responseObj.message } });
                            }
                            else {
                                var foundMembers = member;
                                var saveDataMember = [];
                                foundMembers.forEach(function (item) {
                                    saveDataMember.push(item.id);
                                });

                                var MemberCount = saveDataMember.length;
                                var teamDataObj = {
                                    // user_id: userId,
                                    name: req.body.name,
                                    userId: userId,
                                    members: MemberCount,
                                }

                                Team.create(teamDataObj).exec(function (err, teams) {
                                    if (err) {

                                        var responseObj = {
                                            status: 'error',
                                            message: "Team name already exists."
                                        }
                                        Dataservices.apicallError(req, res, responseObj, responseObj.status);
                                        return res.json(409, { status: 'NOK', result: { message: responseObj.message } });
                                    }
                                    else {
                                        var responseObj = {
                                            // user_id: userId,
                                            member_id: memberIds,
                                            team_id: teams.id,
                                            description: "Team created successfully."
                                        }
                                        Dataservices.activitiLogs(responseObj);
                                        var saveDataArr = [];
                                        var asyncLoop = require('node-async-loop')
                                        asyncLoop(saveDataMember, function (memberId, next) {
                                            saveDataArr.push({
                                                member_id: memberId,
                                                user_id: userId,
                                                team_id: teams.id,
                                                name: teamName,
                                                //userId: userId,
                                            });
                                            next();
                                        }, function () {

                                            TeamMember.create(saveDataArr).exec(function (err, teams) {
                                                if (err) {

                                                    Dataservices.somethingWrong(req, res);
                                                }
                                                else {
                                                    return res.json(200, {
                                                        status: 'OK', teams: teams,
                                                        result: { message: "Team created successfully." },

                                                    });
                                                }
                                            });
                                        })
                                    }
                                });
                            }
                        });
                    }
                })
            }
        }
        else {
            Dataservices.methodNotAllowed(req, res);
        }
    },

    delete: function (req, res, next) {

        if (req.method == 'POST') {
            var teamId = req.param('team_id');

            Team.findOne({ id: teamId }, function (err, team) {
                if (err) {
                    Dataservices.somethingWrong(req, res);
                }
                if (team) {
                    if (team.status == "Inactive") {
                        var memberResponse = {
                            status: 'error',
                            message: "Team is inactive, please contact administrator."
                        }
                        Dataservices.apicallError(req, res, memberResponse, memberResponse.status);
                        return res.json(401, { status: 'NOK', result: { message: memberResponse.message } });
                    } else {


                        Team.destroy({ id: teamId }).exec(function (err, team) {
                            if (err) {
                                Dataservices.somethingWrong(req, res);
                            }
                            else {

                                TeamMember.destroy({ team_id: teamId }).exec(function (err, team) {

                                    if (err) {
                                        Dataservices.somethingWrong(req, res);
                                    }
                                    else {
                                        var foundMembers = team;
                                        var saveDataMember = [];
                                        foundMembers.forEach(function (item) {
                                            saveDataMember.push(item.member_id);
                                        });
                                        var responseObj = {
                                            user_id: team[0].user_id,
                                            team_id: teamId,
                                            member_id: saveDataMember,
                                            description: "Team deleted successfully."
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
                        message: "Team does not exists."
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

            var userId = req.param('user_id'),
                teamId = req.param('team_id'),
                memberIds = req.param('member_ids'),
                teamName = req.body.name;
            var errorObj = {};
            if (teamName == null || teamName == "") {
                errorObj.teamName = "Please entrer Team name.";
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

                User.findOne({ id: userId }, function (err, user) {

                    if (err)

                        Dataservices.somethingWrong(req, res);
                    if (user) {

                        Member.find({ id: memberIds }, function (err, member) {

                            if (err) {

                                Dataservices.somethingWrong(req, res);
                            }
                            if (member) {
                                var foundMembers = member;
                                var saveDataMember = [];
                                foundMembers.forEach(function (item) {
                                    saveDataMember.push(item.id);
                                });

                                Team.findOne({ id: teamId }, function (err, team) {

                                    if (err) {

                                        Dataservices.somethingWrong(req, res);
                                    }
                                    if (team) {
                                        var MemberCount = saveDataMember.length;
                                        var updateTeam = {
                                            name: teamName,
                                            members: MemberCount,
                                        };

                                        Team.update({ id: teamId }, updateTeam).exec(function (err, team) {

                                            if (err) {

                                                var responseObj = {
                                                    status: 'error',
                                                    message: "Team name already exists."
                                                }
                                                Dataservices.apicallError(req, res, responseObj, responseObj.status);
                                                return res.json(409, { status: 'NOK', result: { message: responseObj.message } });
                                            } else {

                                                TeamMember.destroy({ team_id: teamId }).exec(function (err, team) {

                                                    if (err) {

                                                        Dataservices.somethingWrong(req, res);
                                                    }
                                                    else {
                                                        var saveDataArr = [];
                                                        var asyncLoop = require('node-async-loop')
                                                        asyncLoop(saveDataMember, function (memberId, next) {
                                                            saveDataArr.push({
                                                                member_id: memberId,
                                                                //user_id: userId,
                                                                team_id: teamId,
                                                                name: teamName,
                                                                userId: userId,
                                                            });
                                                            next();
                                                        }, function () {

                                                            TeamMember.create(saveDataArr).exec(function (err, teams) {

                                                                if (err) {

                                                                    Dataservices.somethingWrong(req, res);
                                                                }
                                                                else {
                                                                    var responseObj = {
                                                                        //user_id: userId,
                                                                        userId: userId,
                                                                        member_id: memberIds,
                                                                        member_id: teamId,
                                                                        description: "Team updated successfully."
                                                                    }
                                                                    Dataservices.activitiLogs(responseObj);
                                                                    return res.json(200, {
                                                                        status: 'OK', teams: teams,
                                                                        result: { message: responseObj.description },
                                                                    });
                                                                }
                                                            });
                                                        })
                                                    }
                                                });
                                            }
                                        });
                                    }
                                    else {
                                        var responseObj = {
                                            status: 'error',
                                            message: "Team does not exists."
                                        }
                                        Dataservices.apicallError(req, res, responseObj, responseObj.status);
                                        return res.json(404, { status: 'NOK', result: { message: responseObj.message } });
                                    }
                                });
                            }
                            else {
                                var responseObj = {
                                    status: 'error',
                                    message: "Member does not exists."
                                }
                                Dataservices.apicallError(req, res, responseObj, responseObj.status);
                                return res.json(404, { status: 'NOK', result: { message: responseObj.message } });
                            }
                        })
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


    teamList: function (req, res, next) {

        if (req.method == 'GET') {
            var userId = req.param('id');
            var memebrs = [];
            var user = [];

            User.find({ id: userId })
                .populate('team', { sort: { '_id': -1 } })
                .exec(function (err, members) {
                    console.log('members',members)
                    if (err) {
                        return res.json(400, { status: 'NOK', result: { message: err } });
                    }
                    if (!members) {
                        var responseObj = {
                            status: 'error',
                            message: "User does not exists."
                        }
                        Dataservices.apicallError(req, res, responseObj, responseObj.status);
                        return res.json(404, { status: 'NOK', result: { message: responseObj.message } });
                    }
                    else {
                        if(members.length > 0){
                        user.push({
                            id: members[0].id,
                            first_name: members[0].first_name,
                            last_name: members[0].last_name,
                            email: members[0].email,
                            status: members[0].status,
                        })
                        members[0].team.forEach(function (item) {
                            memebrs.push({
                                id: item.id,
                                name: item.name,
                                members: item.members,
                            });
                        });
                        return res.json(200, { status: 'OK', result: { Team: memebrs, user } });
                    }else{
                        return res.json(200, { status: 'OK', result: { message:'No team members' } });
                    }
                }
                });
        }
        else {
            Dataservices.methodNotAllowed(req, res);
        }
    },

    show: function (req, res, next) {

        if (req.method == 'GET') {
            var teams = [];
            var teammembers = [];
            Team.findOne({ id: req.param('id') }, function (err, team) {

                if (err) {
                    Dataservices.somethingWrong(req, res);
                }
                if (team) {
                    teams.push({
                        id: team.id,
                        user_id: team.user_id,
                        name: team.name,
                        members: team.members,
                        status: team.status,
                    });

                    TeamMember.find({ team_id: req.param('id') }, function (err, teammember) {
                        var memberArr = [];
                        var asyncLoop = require('node-async-loop')
                        asyncLoop(teammember, function (member, next) {
                            memberArr.push(member.member_id)
                            next();
                        }, function () {
                            Member.find({ select: ['id', 'user_id', 'firstname', 'lastname'], id: memberArr }, function (err, memberData) {
                                if (err) {
                                    Dataservices.somethingWrong(req, res);
                                } else {
                                    return res.json(200, { status: 'OK', result: teams, memberData });
                                }
                            });
                        });

                    });
                }
                else {
                    var responseObj = {
                        status: 'error',
                        message: "Team does not exists."
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

    showTeams: function (req, res) {
        let pageTitle = 'Teams' + " | " + sails.config.globals.APP_NAME;
        Team.find({}, function (err, team) {
            if (err) return res.badRequest(err);
            return res.view('teams/team', { title: pageTitle, team: team })
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

        Team.find().populate('userId', { sort: { '_id': -1 } })
            .exec(function (err, records) {
                if (err) return res.badRequest(err);
                if (records < 1) {
                    var json = {
                        data: [],
                        recordsTotal: 0,
                        recordsFiltered: 0
                    };
                    return res.json(json);
                } else {
                    var contPages = Math.ceil(count / perPage);
                    var nextPageChek = (pageNo < contPages ? pageNo + 1 : false);
                    var nextPageChekLink = (pageNo < contPages ? 1 + nextPageChek + '/' + perPage : false);
                    if (pageNo > contPages || pageNo <= 0) return res.notFound({ message: "No page found." });
                    var retuser = [];

                    if (IDS !== undefined && req.method === 'POST') {

                        Team.update({ id: IDS }, status).
                            exec(function (err, team) {

                                Team.find().populate('userId', { sort: { '_id': -1 } })
                                    .skip(req.body.start).limit(req.body.length)
                                    .exec(function (err, records) {
                                        if (err) return res.badRequest(err);
                                        if (typeof records !== 'undefined' && records.length > 0) {
                                            records.forEach(function (team) {
                                                retuser.push({
                                                    name: team.name, members: team.members, firstname: team.userId.first_name, lastname: team.userId.last_name, status: team.status,
                                                    button: "<a href='teams/view/" + team.id + "'" + "class='btn btn-xs blue btn-outline' title='View'>" +
                                                        "<i class='fa fa-eye'></i>" + "View" +
                                                        "</a>" +
                                                        "<a href='teams/edit/" + team.id + "'" + " class='btn btn-xs green btn-outline' title='Edit'>" +
                                                        "<i class='fa fa-edit'></i>" + "Edit" +
                                                        "<a onclick=\"return confirm('Do you want to delete this record?')\" href='/team/teamdelete/" + team.id + "'" + "class='btn btn-xs red btn-outline' title='Delete' data-on-confirm='delete admin' data-toggle='confirmation'>" +
                                                        "<i class='fa fa-trash-o'></i>" + "Delete" +
                                                        "</a>",
                                                    checkbox: '<div class="checker"><span><input type="checkbox" class="group-checkable" name="id[]" value="' + team.id + '"></span></div>',
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
                            order['name'] = dir
                        } else if (orderby === '2') {
                            order['members'] = dir
                        } else if (orderby === '3') {
                            order['firstname'] = dir
                        }
                        else if (orderby === '4') {
                            order['status'] = dir
                        }

                        var searchTeam = new RegExp(req.body.team_name, "i");
                        var teamstatus = req.body.team_status ? req.body.team_status : new RegExp('', 'i');
                        if (teamstatus == 1) { teamstatus = 'Active' }
                        else if (teamstatus == 2) { teamstatus = 'Inactive' }

                        Team.find({ name: searchTeam, status: teamstatus }).populate('userId', { sort: { '_id': -1 } })
                            .skip(req.body.start).limit(req.body.length)
                            .sort(order)
                            .exec(function (err, records) {
                                if (err) return res.badRequest(err);
                                if (typeof records !== 'undefined' && records.length > 0) {
                                    records.forEach(function (team) {
                                        console.log('team : ', team)
                                        var firstname = '-';
                                        var lastname = '';
                                        // if (team.hasOwnProperty('userId')) {
                                        //     firstname = team.userId.hasOwnProperty('first_name') ? team.userId.first_name : '-';
                                        //     lastname = team.userId.hasOwnProperty('last_name') ? team.userId.last_name : '-';
                                        // }

                                        retuser.push({
                                            name: team.name, members: team.members, firstname: firstname, lastname: lastname, status: team.status,
                                            button: "<a href='teams/view/" + team.id + "'" + "class='btn btn-xs blue btn-outline' title='View'>" +
                                                "<i class='fa fa-eye'></i>" + "View" +
                                                "</a>" +
                                                "<a href='teams/edit/" + team.id + "'" + " class='btn btn-xs green btn-outline' title='Edit'>" +
                                                "<i class='fa fa-edit'></i>" + "Edit" +
                                                "<a onclick=\"return confirm('Do you want to delete this record?')\" href='/team/teamdelete/" + team.id + "'" + "class='btn btn-xs red btn-outline' title='Delete' data-on-confirm='delete admin' data-toggle='confirmation'>" +
                                                "<i class='fa fa-trash-o'></i>" + "Delete" +
                                                "</a>",
                                            checkbox: '<div class="checker"><span><input type="checkbox" class="group-checkable" name="id[]" value="' + team.id + '"></span></div>',
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

                // });
            });
    },

    teamdelete: function (req, res) {
        var teamId = req.param('id');

        Team.destroy({ id: teamId }).exec(function (err, team) {
            if (err) return res.badRequest(err);
            else {

                TeamMember.destroy({ team_id: teamId }).exec(function (err, team) {
                    if (err) {
                        Dataservices.somethingWrong(req, res);
                    }
                    else {
                        var foundMembers = team;
                        var saveDataMember = [];
                        foundMembers.forEach(function (item) {
                            saveDataMember.push(item.member_id);
                        });
                        req.addFlash('success', 'Team has been deleted..');
                        return res.redirect('/teams');

                    }
                });
            }
        });
    },

    view: function (req, res) {
        if (req.method == 'GET') {
            var teams = [];
            var teammembers = [];
            let objTeam = {};
            let pageTitle = ' View | Teams' + " | " + sails.config.globals.APP_NAME;

            Team.findOne({ id: req.param('id') }, function (err, team) {
                if (err) return res.badRequest(err);
                if (team) {
                    teams.push({
                        id: team.id,
                        //user_id: team.user_id,
                        name: team.name,
                        members: team.members,
                        status: team.status,
                        userId: team.user_id
                    });
                    var array = teams,
                        teamArrray = Object.assign({}, ...array);
                    let userId = team.userId;

                    User.findOne({ id: userId }, function (err, user) {
                        let userName = user.first_name + " " + user.last_name;

                        TeamMember.find({ team_id: req.param('id') }, function (err, teammember) {
                            if (teammember.length > 0) {
                                var memberArr = [];
                                var asyncLoop = require('node-async-loop')
                                asyncLoop(teammember, function (member, next) {
                                    memberArr.push(member.member_id)
                                    next();
                                }, function () {

                                    Member.find({ select: ['id', 'user_id', 'email', 'firstname', 'lastname'], id: memberArr }, function (err, memberData) {
                                        var MemberCount = memberData.length;

                                        if (err) {
                                            Dataservices.somethingWrong(req, res);
                                        } else {
                                            objTeam.user = userName;
                                            objTeam.team = teamArrray;
                                            objTeam.member = MemberCount;
                                            objTeam.teamMember = memberData;
                                            return res.view('teams/view/', { title: pageTitle, team: objTeam });

                                        }
                                    });
                                });
                            }
                            else {
                                objTeam.user = userName;
                                objTeam.team = teamArrray;
                                objTeam.member = 0;
                                return res.view('teams/view/', { title: pageTitle, team: objTeam });
                            }

                        });
                    });
                }
                else {
                    return res.redirect('404');
                }
            });
        }
    },

    addteams: function (req, res) {
        let objTeam = {};
        if (req.method == 'GET') {
            let pageTitle = ' Add | Teams' + " | " + sails.config.globals.APP_NAME;

            User.find({}, function (err, records) {
                if (err) return res.badRequest(err);

                Member.find({}, function (err, member) {
                    if (err) return res.badRequest(err);
                    objTeam.user = records;
                    objTeam.member = member;
                    return res.view('teams/add', { title: pageTitle, team: objTeam });
                });
            });
        } else {

            var saveDataMember = req.param('member_id');

            if (!Array.isArray(saveDataMember)) {
                var saveDataMember = [];
                saveDataMember.push(req.param('member_id'));
            }
            var MemberCount = saveDataMember.length;
            var teamDataObj = {
                name: req.param('teamname'),
                user_id: req.param('user_id'),
                members: MemberCount,
                userId: req.param('user_id'),

            }

            Team.create(teamDataObj).exec(function (err, teams) {
                if (err) {
                    req.addFlash('error', 'team already exists');
                    res.redirect('/teams/add');
                }
                else {
                    var saveDataArr = [];
                    var asyncLoop = require('node-async-loop')
                    asyncLoop(saveDataMember, function (memberId, next) {
                        saveDataArr.push({
                            member_id: memberId,
                            user_id: teamDataObj.user_id,
                            team_id: teams.id,
                            name: teamDataObj.name,
                        });
                        next();
                    }, function () {

                        TeamMember.create(saveDataArr).exec(function (err, teams) {

                            if (err) return res.badRequest(err);
                            else {
                                req.addFlash('success', 'Team added successfully.');
                                return res.redirect('/teams');
                            }
                        });
                    })
                }
            });
        }
    },

    edit: function (req, res) {
        if (req.method == 'GET') {
            if (req.param('id')) {
                var team_id = req.param('id');
                let pageTitle = ' Edit | Teams' + " | " + sails.config.globals.APP_NAME;
                User.find({}, function (err, records) {
                    var response = {};
                    response.user = records;

                    Team.findOne({ id: req.params.id })
                        .exec(function (err, record) {
                            if (err) return res.badRequest(err);
                            if (record) {
                                response.team = record;

                                TeamMember.find({ team_id: req.param('id') }).exec(function (err, teammembers) {
                                    var foundMembers = teammembers;
                                    var saveMemberId = [];
                                    foundMembers.forEach(function (item) {
                                        saveMemberId.push(item.member_id);
                                    });
                                    response.teammembers = teammembers;
                                    Member.find({ select: ['email'], id: saveMemberId }, function (err, memberData) {

                                        if (err) return res.badRequest(err);
                                        var foundMembers = memberData;
                                        var saveDataMember = [];
                                        foundMembers.forEach(function (item) {
                                            saveDataMember.push(item.email);
                                        });
                                        response.email = memberData;

                                        Member.find({ email: { $nin: saveDataMember } }, function (err, member) {
                                            if (err) return res.badRequest(err);
                                            response.member = member;
                                            return res.view('teams/edit/', { title: pageTitle, data: response });
                                        });
                                    });
                                });

                            } else {
                                return res.redirect('404');
                            }
                        });
                });
            }
        } else {

            var saveDataMember = req.param('member_id');

            if (!Array.isArray(saveDataMember)) {
                var saveDataMember = [];
                saveDataMember.push(req.param('member_id'));
            }
            var MemberCount = saveDataMember.length;
            var updateTeam = {
                name: req.param('teamname'),
                userId: req.param('user_id'),
                members: MemberCount,
            }
            var teamId = req.param('id');
            Team.update({ id: teamId }, updateTeam).exec(function (err, team) {
                if (err) {
                    req.addFlash('error', 'Team already exists');
                    res.redirect('/teams/edit/' + teamId);
                } else {

                    TeamMember.destroy({ team_id: teamId }).exec(function (err, team) {
                        if (err) return res.badRequest(err);
                        else {
                            var saveDataArr = [];
                            var asyncLoop = require('node-async-loop')

                            asyncLoop(saveDataMember, function (memberId, next) {
                                saveDataArr.push({
                                    member_id: memberId,
                                    user_id: req.param('user_id'),
                                    team_id: teamId,
                                    name: req.param('teamname'),

                                });
                                next();
                            }, function () {
                                TeamMember.create(saveDataArr).exec(function (err, teams) {
                                    if (err) return res.badRequest(err);
                                    else {
                                        req.addFlash('success', 'Team has been updated.');
                                        return res.redirect('/teams');
                                    }
                                });
                            })
                        }
                    });
                }
            });
        }
    },


}
