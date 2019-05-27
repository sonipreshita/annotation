module.exports = {

    show: function (req, res) {
        let pageTitle = 'Permission ' + " | " + sails.config.globals.APP_NAME;

        Permission.find({}, function (err, permission) {
            if (err) {
                Dataservices.somethingWrong(req, res);
            }
            return res.view('permissions/permissions', { title: pageTitle, permission: permission })
        })
    },

    list: function (req, res) {

        const DEFAULT_PAGE = 1;
        const DEFAULT_PER_PAGE = req.body.length;
        let pageNo = parseInt(req.param('page')) || (typeof req.options.page !== 'undefined' ? parseInt(req.options.page) : DEFAULT_PAGE);
        let perPage = parseInt(req.param('perPage')) || (typeof req.options.page !== 'undefined' ? parseInt(req.options.perPage) : DEFAULT_PER_PAGE);

        Permission.find()
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
                        order['title'] = dir
                    } else if (orderby === '2') {
                        order['description'] = dir
                    } else if (orderby === '3') {
                        order['permissionkey'] = dir
                    }
                    var searchtitle = new RegExp(req.body.subject, "i");
                    var searchDesc = new RegExp(req.body.description, "i");
                    var searchController = new RegExp(req.body.permissionkey, "i");

                    Permission.find({ title: searchtitle, description: searchDesc, permissionkey: searchController })
                        .skip(req.body.start).limit(req.body.length)
                        .sort(order)
                        .exec(function (err, records) {
                            if (err) return res.badRequest(err);
                            if (typeof records !== 'undefined' && records.length > 0) {
                                records.forEach(function (admin) {
                                    retuser.push({
                                        title: admin.title, description: admin.description, permissionkey: admin.permissionkey,
                                        button:
                                        "<a href='/email-templates/edit/" + admin.id + "'" + " class='btn btn-xs green btn-outline' title='Edit'>" +
                                        "<i class='fa fa-edit'></i>" + "Edit" +
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

        var addPermissions = {
            title: req.param('per_title'),
            description: req.param('per_description'),
            controller: req.param('per_controller'),
            action: req.param('per_action'),
        };
        let permKey = addPermissions.controller + "_" + addPermissions.action;
        addPermissions.permissionkey = permKey;

        Permission.findOne({ permissionkey: permKey }, function (err, records) {
            if (records) {
                req.addFlash('error', 'Permission already exists.');
                res.redirect('/permissions/add');
            } else {

                Permission.create(addPermissions).exec(function (err, records) {
                    if (err) {
                        return res.badRequest(err)
                    } else {
                        req.addFlash('success', 'Permission added successfully.');
                        return res.redirect('/permissions');
                    }
                });
            }
        });

    },

    edit: function (req, res) {
        let objPermission = {};
        if (req.method == 'GET') {
            let pageTitle = ' Edit | Permission' + " | " + sails.config.globals.APP_NAME;
            let id = req.param('id');

            Permission.find()
                .exec(function (err, record) {
                    if (record) {
                        record.roll_id = id;
                        var allpermissionIds = record;
                        var saveallPermId = [];
                        allpermissionIds.forEach(function (item) {
                            saveallPermId.push(item.id);
                        });
                        objPermission.saveallPermId = saveallPermId;


                        RolePermissions.findOne({ role_id: id }, function (err, role) {
                            if (typeof role !== 'undefined') {
                                objPermission.permission = record;
                                objPermission.role = role;
                                var saveData = role.permission_ids;
                                
                            if (saveData != null) {
                                var savepermission_ids = [];

                                savepermission_ids.push(saveData);
                                objPermission.savepermission_ids = savepermission_ids;
                                if (typeof savepermission_ids !== 'undefined') {
                                    var permissionIdmap = [];
                                    savepermission_ids.forEach(function (val) {
                                        var split = val.split(",");
                                        for (var i = 0; i < split.length; i++) {
                                            permissionIdmap.push({
                                                id: split[i],
                                            });
                                        }
                                    });

                                    objPermission.permissionIdmap = permissionIdmap;
                                }
                            }
                                return res.view('permissions/view/', { title: pageTitle, permission: objPermission });
                            }
                            else {
                                objPermission.permission = record;
                                objPermission.role = 0;
                                return res.view('permissions/view/', { title: pageTitle, permission: objPermission });
                            }
                        })
                    } else {
                        return res.redirect('404');
                    }
                });
        }
        else {

            var addPermissions = {
                role_id: req.param('role_id'),
                permission_ids: req.param('permission_ids')

            };
            let permissionIds = addPermissions.permission_ids;
            let rollId = addPermissions.role_id;

            RolePermissions.findOne({ role_id: rollId }, function (err, role) {
                if (role == undefined)
                    Permissionutils(req, res, permissionIds);
                else {

                    RolePermissions.findOne({ role_id: rollId }, function (err, rolepermissions) {

                        RolePermissions.destroy({ role_id: rollId }).exec(function (err, role) {
                            var addPermissions = {
                                role_id: req.param('role_id'),
                                permission_ids: req.param('permission_ids')

                            };
                            let permissionIds = addPermissions.permission_ids;
                            Permissionutils(req, res, permissionIds);
                        });

                    });
                }
            });
        }
    },


};
function Permissionutils(req, res, permissionIds) {
    var addPermissions = {
        role_id: req.param('role_id'),
        permission_ids: req.param('permission_ids')

    };

    Permission.find({ id: permissionIds }, function (err, permission) {
        var allpermissionIds = permission;
        var permission_Key = [];
        allpermissionIds.forEach(function (item) {
            permission_Key.push({
                id: item.id,
                key: item.permissionkey,
            });
        });
        addPermissions.permission_Key = permission_Key;

        RolePermissions.create(addPermissions).exec(function (err, records) {
            if (err) {
                return res.badRequest(err)
            } else {
                    req.addFlash('success', 'Permission updated successfully.');
                return res.redirect('/roles');
            }
        });
    });

}

