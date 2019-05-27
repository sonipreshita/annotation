module.exports = {

    record: function (req, res) {
        if (req.isSocket) {
            var dataFromClient = req.params.all();
            var projectId = dataFromClient.project_id;
            var screenId = dataFromClient.screen_id;
            var xCords = dataFromClient.x.toString();
            var yCords = dataFromClient.y.toString();
            var room = `${xCords}-${yCords}`;

            console.log('dataFromClient', dataFromClient)
            sails.sockets.join(req, room);

            Comments.find({ screen_id: screenId, x_cords: xCords, y_cords: yCords }).exec(function (err, comment) {
                console.log('dataFromClient comment', comment)
                if (err) {
                    Dataservices.somethingWrong(req, res);
                }
                else {
                    var memberCount = 0;
                    var comments = comment[0].comments;
                    comments.forEach(cmt => {
                        User.findOne({ id: cmt.member_id }, function (err, user) {
                            if (err) {
                                Dataservices.somethingWrong(req, res);
                            }
                            if (user) {
                                cmt.first_name = user.first_name
                                cmt.last_name = user.last_name
                                cmt.email = user.email
                                cmt.id = user.id
                                cmt.status = user.status
                                memberCount++;
                                var memberCheck = checkRes();
                                if (memberCheck !== undefined) {
                                    var responseObj = {
                                        status: 'ok',
                                        comments: comment,
                                    };
                                    return res.json(200, responseObj);
                                }

                            }
                        });
                    });
                    function checkRes() {
                        if (comments.length == memberCount) {
                            return memberCount;
                        }
                    }
                }
            });
        } else {
            return res.badRequest();
        }
    },

    list: function (req, res) {
        if (req.isSocket) {
            var data = req.params.all();
            var screenId = data.screen_id;
            sails.sockets.join(req, screenId);
            Comments.find({ screen_id: screenId }).exec(function (err, comment) {
                if (err) {
                    Dataservices.somethingWrong(req, res);
                }
                else {
                    return res.json(200, { status: 'OK', result: { comments: comment } });
                }
            });
        } else {
            return res.badRequest();
        }
    },

    chat: function (req, res) {
        if (req.isSocket && req.method == 'POST') {
            var postData = req.params.all();
            var screenId = postData.screen_id;
            var projects = postData.project_id;
            var xCords = postData.x_cords.toString();
            var yCords = postData.y_cords.toString();
            sails.sockets.join(req, screenId, function (err) {
                sails.sockets.broadcast(screenId, 'circle', postData);
            });
            Comments.findOne({ screen_id: screenId, x_cords: xCords, y_cords: yCords }).exec(function (err, comment) {
                if (err) {
                    console.log(err);
                }
                if (!comment) {
                    var room = `${xCords}-${yCords}`;
                    Comments.create(postData)
                        .exec(function (err, postData) {
                            if (err) {
                                console.log(err);
                            }
                            if (postData) {
                                var id = postData.comments[0].member_id;
                                User.findOne({ id: id }, function (err, user) {
                                    if (err) {
                                        Dataservices.somethingWrong(req, res);
                                    }
                                    if (user) {
                                        postData.comments[0].first_name = user.first_name
                                        postData.comments[0].last_name = user.last_name
                                        postData.comments[0].email = user.email
                                        postData.comments[0].id = user.id
                                        postData.comments[0].status = user.status

                                        sails.sockets.join(req, room, function (err) {
                                            sails.sockets.broadcast(room, 'createChat', postData);
                                        });
                                    }
                                });
                            }

                            return res.ok();
                        });
                }
                else if (comment) {
                    comments = postData.comments;
                    var room = `${xCords}-${yCords}`;

                    Comments.update({ screen_id: screenId, x_cords: xCords, y_cords: yCords }, { 'comments': comments }).exec(function (err, cmt) {
                        if (err) {
                            console.log('update err:' + err);
                        }
                        if (cmt) {
                            cmnts = cmt[0].comments;
                            var memberCount = 0;
                            cmnts.forEach(comment => {
                                User.findOne({ id: comment.member_id }, function (err, user) {
                                    if (err) {
                                        Dataservices.somethingWrong(req, res);
                                    }
                                    if (user) {
                                        comment.first_name = user.first_name
                                        comment.last_name = user.last_name
                                        comment.email = user.email
                                        comment.id = user.id
                                        comment.status = user.status
                                        //comment.dateNtime = date_time
                                        memberCount++;

                                        var memberCheck = checkRes();
                                        if (memberCheck !== undefined) {

                                            sails.sockets.join(req, room, function () {
                                                sails.sockets.broadcast(room, 'updateChat', cmt);
                                            });

                                        }
                                    }
                                });
                            });
                            function checkRes() {
                                if (comments.length == memberCount) {
                                    return memberCount;
                                }
                            }
                        }
                        return res.ok();
                    });
                }
            });
        }
        else if (req.isSocket) {
            Comments.watch(req.socket);
        } else {
            return res.badRequest();
        }
    },

    one: function () {
        return 'First Function';
    },

    searchCommentByQuery: function (req, res) {
        if (req.method === "GET") {
            var queryText = req.query.commentQuery,
                project_id = req.param('project_id');
            Comments.find({ project_id: project_id }).populateAll().exec(function (err, record) {
                if (err) {
                    return res.json(404, { status: 'NOK', result: { message: err } });
                } else {
                    if (record.length > 0) {
                        var getArr;
                        var newRec = [];
                        for (let item of record) {
                            var commentsArr = item.comments;
                            function filterItems(queryText) {
                                return commentsArr.filter(function (el) {
                                    return el.comment.toLowerCase().indexOf(queryText.toLowerCase()) > -1;
                                })
                            }

                            delete item.comments;
                            getArr = filterItems(queryText)
                            item.comments = getArr;
                            newRec.push(item)
                        }
                        return res.json(200, { status: 'OK',result: { comments: newRec }});
                    } else {
                        return res.json(200, { status: 'OK', record: record, result: { message: "No comments found" } });
                    }
                }
            })
        } else {
            Dataservices.methodNotAllowed(req, res);
        }
    },

    showAllComments: function (req, res) {
        if (req.method === "GET") {
            var project_id = req.param('project_id');

            Comments.find({ project_id: project_id }).populateAll().exec(function (err, list) {
                if (err) {
                    Dataservices.somethingWrong(req, res);
                } else {
                    if (list.length > 0) {
                        // Project.find({ id: list[0].project_id }).exec(function (err1, project) {
                        //     if (err1) {
                        //         Dataservices.somethingWrong(req, res);
                        //     }
                        //     Screen.find({ id: list[0].screen_id }).exec(function (err2, screen) {
                        //         if (err2) {
                        //             Dataservices.somethingWrong(req, res);
                        //         } else {
                        //             return res.json(200, { status: 'OK', result: { comments: list, project: project, screen: screen } });
                        //         }
                        //     })
                        // })
                        return res.json(200, { status: 'OK', result: { comments: list } });

                    } else {
                        return res.json(200, { status: 'OK', result: { comments: [], message: "No comments found" } });
                    }
                }
            });

        } else {
            return res.badRequest();
        }
    },

};