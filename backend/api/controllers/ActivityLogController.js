/**
 * ActivityLogController
 *
 * @description :: Server-side logic for managing Administrators
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    add: function (req, res) {
        if (req.method === 'POST') {
            User.findOne({ id: req.param('user_id') }, function (err, member) {
                if (err) {
                    res.send(err)
                }
                Project.findOne({ id: req.param('project_id') }, function (err, team) {
                    if (err) {
                        res.send(err)
                    }
                })
                var description = req.body.description;
                var log = {
                    user_id: req.param('user_id'),
                    project_id: req.param('project_id'),
                    description: req.body.description,
                }
                ActivityLog.create(log).exec(function (err, record) {
                    if (err) {
                        res.send(err)
                    }
                    res.json(200, {
                        status: 'OK',
                        message: 'Acitvity-Log added!',
                        status: 'success'
                    });
                })
            })
        }
        else {
            res.json(404, {
                status: 'NOK',
                message: 'There is an error !',
            });
        }
    },

    show: function (req, res) {
        User.find({}, function (err, user) {
            if (err) {
                return res.send(err)
            }
            return res.view('users/user', { user: user })
        })
    },

    update: function (req, res) {
        var id = req.param('id');
        var user_details = {
            fname: req.param('fname'),
            lname: req.param('lname'),
            email: req.param('email'),
        }
        User.update({ id: id }, user_details, function (err, user) {
            if (err) {
                return res.send(err)
            }

            return res.redirect('/users')
        })
    },

    edit: function (req, res) {
        if (req.method == 'GET') {
            var id = req.param('id');
            User.findOne({ id: req.params.id })
                .exec(function (err, record) {
                    if (record) {
                        return res.view('users/edit/', { user: record });
                    } else {
                        return res.redirect('404');
                    }
                });
        }
    },

    view: function (req, res) {
        if (req.method == 'GET') {
            var id = req.param('id');
            User.findOne({ id: req.params.id })
                .exec(function (err, record) {
                    if (record) {
                        return res.view('users/view/', { user: record });
                    } else {
                        return res.redirect('404');
                    }
                });

        }
    },

    delete: function (req, res) {
        var id = req.param('id');
        User.destroy({ id: id }, function (err, user) {
            if (err) {
                return res.send(err)
            }
            return res.redirect('/users')
        })
    },

    allActivityLogs: function (req, res) {
        if (req.method === "GET") {
            var project_id = req.param('project_id');

            ActivityLog.find({
                projectId: project_id
            }).populate('user_id').populate('project_id').populate('screen_id').exec(function (err, logs) {
                if (err) {
                    res.send(err)
                }
                res.json(200, {
                    status: 'success',
                    logs: logs
                });
            })
        } else {
            res.json(404, {
                status: 'NOK',
                message: 'There is an error !',
            });
        }
    }
};
