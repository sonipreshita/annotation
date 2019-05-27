module.exports = {

    show: function (req, res) {
        let pageTitle = 'Email Templates' + " | " + sails.config.globals.APP_NAME;

        EmailTemplate.find({}, function (err, email) {
            if (err) {
                Dataservices.somethingWrong(req, res);
            }
            return res.view('emailtemplates/emailtemplates', { title: pageTitle, email: email })
        })
    },

    list: function (req, res) {

        const DEFAULT_PAGE = 1;
        const DEFAULT_PER_PAGE = req.body.length;
        let pageNo = parseInt(req.param('page')) || (typeof req.options.page !== 'undefined' ? parseInt(req.options.page) : DEFAULT_PAGE);
        let perPage = parseInt(req.param('perPage')) || (typeof req.options.page !== 'undefined' ? parseInt(req.options.perPage) : DEFAULT_PER_PAGE);

        EmailTemplate.find()
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
                        order['firstname'] = dir
                    } else if (orderby === '2') {
                        order['email'] = dir
                    } else if (orderby === '3') {
                        order['status'] = dir
                    }
                    var searchSubject = new RegExp(req.body.subject, "i");
                    var searchDesc = new RegExp(req.body.description, "i");
                    var searchSlug = new RegExp(req.body.Slug, "i");

                    EmailTemplate.find({ subject: searchSubject, description: searchDesc, slug: searchSlug })
                        .skip(req.body.start).limit(req.body.length)
                        .sort(order)
                        .exec(function (err, records) {
                            if (err) return res.badRequest(err);
                            if (typeof records !== 'undefined' && records.length > 0) {
                                records.forEach(function (admin) {
                                    retuser.push({
                                        subject: admin.subject, description: admin.description, slug: admin.slug,
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
    
        var addTemplate = {
            subject: req.param('subject'),
            description: req.param('description'),
            emaildata: req.param('emaildata'),
            slug: req.param('slug'),
        };

        EmailTemplate.create(addTemplate).exec(function (err, records) {
            if (err) {
                return res.badRequest(err)
            } else {
                return res.redirect('/email-templates');
            }
        });

    },

    edit: function (req, res) {

        if (req.method == 'GET') {
            var id = req.param('id');
            let pageTitle = 'Edit | Email Template ' + " | " + sails.config.globals.APP_NAME;

            EmailTemplate.findOne({ id: req.params.id })
                .exec(function (err, record) {
                    if (err) return res.badRequest(err);
                    if (record) {
                        return res.view('emailtemplates/edit/', { title: pageTitle, admin: record });
                    } else {
                        return res.redirect('404');
                    }
                });
        }
        else {
            var updateTemplate = {
                subject: req.param('subject'),
                description: req.param('description'),
            };
            let emaildata = req.param('emaildata');
            let trimData = JSON.parse(JSON.stringify(emaildata).replace(/"\s+|\s+"/g, '"'));
            updateTemplate.emaildata = trimData;

            EmailTemplate.update({ id: req.param('id') }, updateTemplate).exec(function (err, record) {
                if (err) {
                    return res.badRequest(err)
                } else {
                    return res.redirect('/email-templates')
                }
            });
        }
    },

};