/**
 * DashboardController
 *
 * @description :: Server-side logic for managing Logins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {

    index: function (req, res) {
            let pageTitle = 'Dashbord' + " | " + sails.config.globals.APP_NAME;
        User.find().exec(function (err, user) {
            Project.find().exec(function (err, project) {
                Member.find().exec(function (err, member) {
                    Team.find().exec(function (err, team) {

                        return res.view('dashbord/dashbord',
                            {   title: pageTitle,
                                userCount: user.length,
                                projectCount: project.length,
                                memberCount: member.length,
                                teamCount: team.length,

                            });
                    });
                });
            });
        });
    },
};
