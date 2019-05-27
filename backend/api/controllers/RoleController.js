module.exports = {

    show: function (req, res) {
        let pageTitle = 'Role' + " | " + sails.config.globals.APP_NAME;

        Role.find({}, function (err, email) {
            if (err) {
                Dataservices.somethingWrong(req, res);
            }
            return res.view('roles/roles', { title: pageTitle, email: email })
        })
    },

    list: function (req, res) {

        const DEFAULT_PAGE = 1;
        const DEFAULT_PER_PAGE = req.body.length;
        let pageNo = parseInt(req.param('page')) || (typeof req.options.page !== 'undefined' ? parseInt(req.options.page) : DEFAULT_PAGE);
        let perPage = parseInt(req.param('perPage')) || (typeof req.options.page !== 'undefined' ? parseInt(req.options.perPage) : DEFAULT_PER_PAGE);

        Role.find()
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
                    var count = records.length;
                    var orderby = req.body.order[0].column;
                    var dir = req.body.order[0].dir;
                    var order = {};

                    if (orderby === '1') {
                        order['rolename'] = dir
                    } else if (orderby === '2') {
                        order['description'] = dir
                    }
                    var searchRole = new RegExp(req.body.rolename, "i");
                    var searchDesc = new RegExp(req.body.description, "i");

                    Role.find({ rolename: searchRole, description: searchDesc })
                        .skip(req.body.start).limit(req.body.length)
                        .sort(order)
                        .exec(function (err, records) {
                            if (err) return res.badRequest(err);
                            if (typeof records !== 'undefined' && records.length > 0) {
                                records.forEach(function (admin) {
                                    retuser.push({
                                        rolename: admin.rolename, description: admin.description,
                                        button:
                                        "<a href='/roles/edit/" + admin.id + "'" + " class='btn btn-xs green btn-outline' title='Edit'>" +
                                        "<i class='fa fa-edit'></i>" + "Edit" +
                                        "</a>" +
                                        "<a onclick=\"return confirm('Do you want to delete this record?')\" href='/roles/deleterecord/" + admin.id + "'" + "class='btn btn-xs red btn-outline' title='Delete' >" +
                                        "<i class='fa fa-trash-o'></i>" + "Delete" +
                                        "</a>"+
                                         "<a href='/permission/edit/" + admin.id + "'" + " class='btn btn-xs blue btn-outline' title='Permission'>" +
                                        "<i class='fa fa-cog'></i>" + "Permission" +
                                        "</a>" 

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
            });
    },

    add: function (req, res) {

        if (req.method == 'POST') {

            Role.findOne({
                rolename: req.param('rolename'),
            }, function (err, role) {
                if (role) {
                          req.addFlash('error', 'Rolename already exists');
                          res.redirect('/roles/add');
                } else {
                    var addRole = {
                        rolename: req.param('rolename'),
                        description: req.param('description'),
                    };

                    Role.create(addRole).exec(function (err, records) {
                        if (err) {
                            return res.badRequest(err)
                        } else {
                             req.addFlash('success', 'Role created successfully');
                            return res.redirect('/roles');
                        }
                    });
                }
            });
        }
    },

    edit: function (req, res) {

        if (req.method == 'GET') {
            var id = req.param('id');
            let pageTitle = 'Edit | Role ' + " | " + sails.config.globals.APP_NAME;

            Role.findOne({ id: req.params.id })
                .exec(function (err, record) {
                    if (err) return res.badRequest(err);
                    if (record) {
                        return res.view('roles/edit/', { title: pageTitle, admin: record });
                    } else {
                        
                        return res.redirect('404');
                    }
                });
        }
        else {
            var roleId = req.param('id');
            var updateRole = {
                rolename: req.param('rolename'),
                description: req.param('description'),
            };

            Role.update({ id: roleId }, updateRole).exec(function (err, record) {
                if (err) {
                    req.addFlash('error', 'Rolename already exists');
                    res.redirect('/roles/edit/' + roleId);
                } else {
                    req.addFlash('success', 'Role updated successfully');
                    return res.redirect('/roles')
                }
            })
        }
    },

    delete: function (req, res, next) {
        var id = req.param('id');

        Role.destroy({ id: id }, function (err, roles) {
            if (err) {
                 return res.badRequest(err)
            } else {
                req.addFlash('success', 'Role has been deleted..');
                return res.redirect('/roles')
            }
        })
    },
};