/**
 * AdministratorsController
 *
 * @description :: Server-side logic for managing administrators
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	index: function (req, res) {
		let pageTitle = ' Administrators' + " | " + sails.config.globals.APP_NAME;
		Administrator.find().exec(function (err, records) {
			var response = {};
			response.admin = records;
			Role.find({}, function (err, record) {
				response.role = record;
				return res.view('administrators/index', { title: pageTitle, data: response });
			});
		});
	},

	add: function (req, res) {

		if (req.method == 'GET') {
			let pageTitle = ' Add | Administrators' + " | " + sails.config.globals.APP_NAME;
			Role.find().exec(function (err, records) {
				return res.view('administrators/add', { title: pageTitle, roles: records });
			});
		} else {
		var newAdmin = {
				fname: req.body.fname,
				lname: req.body.lname,
				email: req.body.email,
				password: req.body.password,
				roleId: req.param('role_id'),

			};

		
			req.file('avatar').upload({
				dirname: process.cwd() + '/assets/images/',
				maxBytes: 5000000
						}, function (error, uploadedFiles) {
				if (!error && uploadedFiles.length > 0) {
					var filename = uploadedFiles[0].fd.substring(uploadedFiles[0].fd.lastIndexOf('/') + 1);
					var uploadLocation = process.cwd() + '/assets/images/' + filename;
					var tempLocation = process.cwd() + '/.tmp/public/images/' + filename;
					var img = require('path').basename(filename);
					if (sails.config.environment !== 'development') {
						fs.createReadStream(uploadLocation).pipe(fs.createWriteStream(tempLocation));
					}
					newAdmin.image = img;
					Administrator.findOne({
						'email': req.param('email')
					}, function (err, admin) {
						if (admin) {
							req.addFlash('error', 'Email already exists');
							res.redirect('/administrators/add');
						} else {
	
							Administrator.create(newAdmin).exec(function (err, records) {
								if (err) {
									return res.badRequest(err)
								} else {
									req.addFlash('success', 'Administrator Successfully added');
									res.redirect('administrators');
								}
							});
						}
					});
				}
				else {

					Administrator.findOne({
						'email': req.param('email')
					}, function (err, admin) {
						if (admin) {
							req.addFlash('error', 'Email already exists');
							res.redirect('/administrators/add');
						} else {
						
							Administrator.create(newAdmin).exec(function (err, records) {
								if (err) {
									res.redirect('/administrators/add');
								} else {
									req.addFlash('success', 'Administrator Successfully added');
									res.redirect('administrators');
								}
							});
						}
					})
				}
			});
		}
	},

	delete: function (req, res) {

		Administrator.findOne({ id: req.params.id }).exec(function (err, records) {
			if (err) return res.send(err, 500);
			if (records) {
				Administrator.destroy({ id: req.params.id }).exec(function (err) {
					req.addFlash('success', 'Administrator Successfully Deleted');
					res.redirect('administrators');
				});
			} else {
				return res.redirect('404');
			}
		})
	},

	edit: function (req, res) {
		if (req.method == 'GET') {
			var id = req.param('id');
			let pageTitle = 'Edit | Administrators ' + " | " + sails.config.globals.APP_NAME;

			Role.find({}, function (err, records) {
				var response = {};
				response.role = records;
				Administrator.findOne({ id: req.params.id })
					.exec(function (err, record) {
						response.admin = record;
						if (record) {
							return res.view('administrators/edit/', { title: pageTitle, data: response });
						} else {
							return res.redirect('404');
						}
					});
			});
		}
	},

	update: function (req, res) {
		var id = req.param('id');
		var newAdmin = {
			fname: req.body.fname,
			lname: req.body.lname,
			email: req.body.email,
		    roleId: req.param('role_id'),
		};

		req.file('avatar').upload({
			dirname: process.cwd() + '/assets/images/'
		}, function (error, uploadedFiles) {
			if (!error && uploadedFiles.length > 0) {
				var filename = uploadedFiles[0].fd.substring(uploadedFiles[0].fd.lastIndexOf('/') + 1);
				var uploadLocation = process.cwd() + '/assets/images/' + filename;
				var tempLocation = process.cwd() + '/.tmp/public/images/' + filename;
				var img = require('path').basename(filename);
				if (sails.config.environment !== 'development') {
					fs.createReadStream(uploadLocation).pipe(fs.createWriteStream(tempLocation));
				}
				newAdmin.image = img;
			
						Administrator.update({ id: id }, newAdmin).exec(function (err, records) {
							if (err) {
								     res.badRequest(err)
                   					 res.redirect('/administrators/edit/' + id);
							} else {
								req.addFlash('success', 'Administrator Successfully Updated');
								res.redirect('administrators');
							}
						});
			}
			else {
				
				Administrator.update({ id: req.params.id }, newAdmin).exec(function (err, records) {
					if (err) {
						 res.badRequest(err)
                   		 res.redirect('/administrators/edit/' + id);
					} else {
						req.addFlash('success', 'Administrator Successfully Updated');
						res.redirect('administrators');
					}
				});
			}
		});
	},

	view: function (req, res) {
		if (req.method == 'GET') {
			var id = req.param('id');
			let pageTitle = 'View | Administrators ' + " | " + sails.config.globals.APP_NAME;

			Administrator.findOne({ id: req.params.id })
				.exec(function (err, record) {
					if (record) {
						return res.view('administrators/view/', { title: pageTitle, admin: record });
					} else {
						return res.redirect('404');
					}
				});
		}
	},

	search: function (req, res) {
		Administrator.findOne({ name: fname, email: email }).exec(function (err, records) {
			if (err) return res.send(err, 500);
			if (record) {
				return res.view('administrators/edit/', { title: pageTitle, admin: record });
			} else {
				return res.redirect('404');
			}
		})
	},

	setstatusInactive: function (req, res) {
		var id = req.param('id');
		let pageTitle = 'View' + " | " + 'Administrators';
		var updateAdmin = {
			status: "Inactive"
		};
		Administrator.update({ id: req.params.id }, updateAdmin).exec(function (err, record) {
			if (record) {
				Administrator.findOne({ id: req.params.id })
					.exec(function (err, record) {
						if (record) {
							return res.view('administrators/view/', { title: pageTitle, admin: record });
						} else {
							return res.redirect('404');
						}
					});
			} else {
				return res.redirect('404');
			}
		});
	},

	setstatusActive: function (req, res) {
		var id = req.param('id');
		let pageTitle = 'View' + " | " + 'Administrators';
		var updateAdmin = {
			status: "Active"
		};
		Administrator.update({ id: req.params.id }, updateAdmin).exec(function (err, record) {
			if (record) {
				Administrator.findOne({ id: req.params.id })
					.exec(function (err, record) {
						if (record) {
							return res.view('administrators/view/', { title: pageTitle, admin: record });
						} else {
							return res.redirect('404');
						}
					});
			} else {
				return res.redirect('404');
			}
		});
	},

	list: function (req, res) {
		const DEFAULT_PAGE = 1;
		const DEFAULT_PER_PAGE = req.body.length;
		let pageNo = parseInt(req.param('page')) || (typeof req.options.page !== 'undefined' ? parseInt(req.options.page) : DEFAULT_PAGE);
		let perPage = parseInt(req.param('perPage')) || (typeof req.options.page !== 'undefined' ? parseInt(req.options.perPage) : DEFAULT_PER_PAGE);
		var IDS = req.body.id;
		var role = req.body.role_id ? req.body.role_id : null;
		var searchEmail = new RegExp(req.body.administrator_email, "i");
		var searchAdmin = new RegExp(req.body.administrator_name, "i");
		 var condition = {};
        if (role) {
             condition.roleId = role;
        }
        if (searchEmail) {
		
            condition.email = searchEmail;
        }
        if (searchAdmin) {
            condition.fname = searchAdmin;
        }
		else { 
            condition.lname = searchAdmin;
        }
		var newstatus = req.body.customActionName ? req.body.customActionName : new RegExp('', 'i');
		if (newstatus == 1) {
			newstatus = 'Active'
		} else if (newstatus == 2) {
			newstatus = 'Inactive'
		}
		else if (newstatus == 0) {
			newstatus = req.body.customActionName;
		}
		var status = { status: newstatus }
		Administrator.find().populate('roleId', { sort: { '_id': -1 } })
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
					Administrator.update({ id: IDS }, status).
						exec(function (err, user) {
							Administrator.find().populate('roleId', { sort: { '_id': -1 } })
								.skip(req.body.start).limit(req.body.length)
								.sort({ "_id": -1 })
								.exec(function (err, records) {
									if (typeof records !== 'undefined' && records.length > 0) {
										records.forEach(function (admin) {
											  var rolename ;
                                        if (admin.hasOwnProperty('roleId')) {
                                            var rolename = admin.roleId == undefined ? '-':  admin.roleId.rolename  ;
                                        }
											retuser.push({
												fname: admin.fname, lname: admin.lname, role: rolename, email: admin.email, status: admin.status,
												button: "<a href='/administrators/view/" + admin.id + "'" + "class='btn btn-xs blue btn-outline' title='View'>" +
												"<i class='fa fa-eye'></i>" + "View" +
												"</a>" +
												"<a href='/administrators/edit/" + admin.id + "'" + " class='btn btn-xs green btn-outline' title='Edit'>" +
												"<i class='fa fa-edit'></i>" + "Edit" +
												"</a>" +
												"<a onclick=\"return confirm('Do you want to delete this record?')\" href='administrators/delete/" + admin.id + "'" + "class='btn btn-xs red btn-outline' title='Delete' data-on-confirm='delete admin' data-toggle='confirmation'>" +
												"<i class='fa fa-trash-o'></i>" + "Delete" +
												"</a>",
												checkbox: '<input type="checkbox" name="id[]" value="' + admin.id + '">',
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
						order['firstname'] = dir
					} else if (orderby === '2') {
						order['email'] = dir
					} else if (orderby === '3') {
						order['status'] = dir
					}

					var userstatus = req.body.status ? req.body.status : new RegExp('', 'i');
					if (userstatus == 1) {
						userstatus = 'Active'
					} else if (userstatus == 2) {
						userstatus = 'Inactive'
					}
					Administrator.find(condition).populate('roleId', { sort: { '_id': -1 } })
						.where({ status: userstatus})
						.skip(req.body.start).limit(req.body.length)
						.sort(order)
						.exec(function (err, records) {
							if (typeof records !== 'undefined' && records.length > 0) {
								records.forEach(function (admin) {
								  var rolename ;
                                        if (admin.hasOwnProperty('roleId')) {
                                            var rolename = admin.roleId == undefined ? '-':  admin.roleId.rolename  ;
                                        }
									retuser.push({
										fname: admin.fname, lname: admin.lname, role: rolename, email: admin.email, status: admin.status,
										button: "<a href='/administrators/view/" + admin.id + "'" + "class='btn btn-xs blue btn-outline' title='View'>" +
										"<i class='fa fa-eye'></i>" + "View" +
										"</a>" +
										"<a href='/administrators/edit/" + admin.id + "'" + " class='btn btn-xs green btn-outline' title='Edit'>" +
										"<i class='fa fa-edit'></i>" + "Edit" +
										"</a>" +
										"<a onclick=\"return confirm('Do you want to delete this record?')\" href='administrators/delete/" + admin.id + "'" + "class='btn btn-xs red btn-outline' title='Delete' data-on-confirm='delete admin' data-toggle='confirmation'>" +
										"<i class='fa fa-trash-o'></i>" + "Delete" +
										"</a>",
										checkbox: '<input type="checkbox" name="id[]" value="' + admin.id + '">',
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

};
