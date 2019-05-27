/**
 * UserController
 *
 * @description :: Server-side logic for managing Administrators
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

    add: function (req, res) {
        if (req.method === 'POST') {
            Member.findOne({ id: req.param('member_id')}, function (err, member) {
                if (err) {
                    res.send(err)
                }
                Team.findOne({id:req.param('team_id')},function(err,team){
                    if (err) {
                        res.send(err)
                    }
                })
                var team = {
                    member_id: req.param('member_id'),
                    team_id:req.param('team_id')
                }
                TeamMember.create(team).exec(function (err, record) {
                    if (err) {
                        res.send(err)
                    }
                    res.json(200, {
                        status: 'OK',
                        message: 'Team-Member added!',
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

    list : function (req, res) {
        TeamMember.find().populateAll().exec(function (err, record) {
            if (err) {
                res.send(err)
            }
            res.json(200, {
                status: 'OK',
                message: 'Team-Member added!',
                record: record
            });
        })
    }
};
