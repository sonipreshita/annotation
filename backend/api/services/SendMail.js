module.exports = {
    email: function (email, password) {
        var api_key = 'key-22acd47c75e8da04c80d9dececf7c717';
        var domain = 'mg.dev1.in';
        var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });

        var data = {
            from: 'Welcome to AnnotationTool <preshita.soni@multidots.com>',
            to: email,
            subject: 'Welcome to AnnotationTool!',
            html: "<b>Hi!</b> <br/><br/>Welcome to AnnotationTool <br/><br/>Your free AnnotationTool account has been created and is ready to use. " +
                " <br/><br/><b>Email </b>: " + email +
                " <br/><br/><b>Password </b>:" + password
        };

        mailgun.messages().send(data, function (error, body) {
        });
    },

    adminForgetPassword: function (email, randomValue) {
        var api_key = 'key-22acd47c75e8da04c80d9dececf7c717';
        var domain = 'mg.dev1.in';
        var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });

        var textEmail = sails.config.globals.request_url + "/reset-password/" + randomValue + ""
        var data = {
            from: '"Reset your Password 👻" <preshita.soni@multidots.com>',
            to: email,
            subject: "Your AnnotationTool.com account - Password Recovery Link",
            html: "<b>Hi!</b> <br/><br/>You initiated a request to help with your Account Password. Click the link below to set a new password." +
                " <br/><br/><b>Email</b>: " + email +
                " <br/><br/><b>Password reset Link  </b>" + textEmail
        };

        mailgun.messages().send(data, function (error, body) {

        });
    },

    forgotPasswordMail: function (email, randomValue) {
        var api_key = 'key-22acd47c75e8da04c80d9dececf7c717';
        var domain = 'mg.dev1.in';
        var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });

        var textEmail = sails.config.globals.WEB_URL + "/reset-password/" + randomValue + ""
        var data = {
            from: '"Reset your Password 👻" <preshita.soni@multidots.com>',
            to: email,
            subject: "Your AnnotationTool.com account - Password Recovery Link",
            html: "<b>Hi!</b> <br/><br/>You initiated a request to help with your Account Password. Click the link below to set a new password." +
                " <br/><br/><b>Email</b>: " + email +
                " <br/><br/><b>Password reset Link  </b>" + textEmail
        };

        mailgun.messages().send(data, function (error, body) {

        });
    },

    inviteMember: function (user, project, member) {
        var api_key = 'key-22acd47c75e8da04c80d9dececf7c717';
        var domain = 'mg.dev1.in';
        var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });
        var userName = `${user.first_name} ${user.last_name}`;

        var data = {
            from: '"' + userName + ' (AnnotationTool)" <preshita.soni@multidots.com>',
            to: member.email,
            subject: '' + userName + ' has invited you to collaborate on a project',
            html: "<b>" + userName + "</b> wants to collaborate on a project <b>" + project.name + "</b>.<br /><br />Accept the invite to become a collaborater on a project <b>" + project.name + "</b>" +
                //"<a href='http://localhost:1337/api/project/share/"+ member.id +"/"+ project.id +"'>Accept</a>"
                //"<a href='http://192.168.1.113:3000/share-details/"+ project.id +"'>Accept</a>"
                "<a href='" + sails.config.globals.SHARE_APP_PATH + "/projects'>Accept</a>"
            //"<a href='http://localhost:3000/projects'>Accept</a>"
        };

        mailgun.messages().send(data, function (error, body) {

        });
    },

    askToRegisterUser: function (user, project, member) {
        var api_key = 'key-22acd47c75e8da04c80d9dececf7c717';
        var domain = 'mg.dev1.in';
        var mailgun = require('mailgun-js')({ apiKey: api_key, domain: domain });
        var userName = `${user.first_name} ${user.last_name}`;

        var data = {
            from: '"' + userName + ' (AnnotationTool)" <preshita.soni@multidots.com>',
            to: member,
            subject: '' + userName + ' has invited you to collaborate on a project',
            html: "<b>" + userName + "</b> has added you as a collaborator on a prototype called <b>" + project.name + "</b>.<br /><br />Accept the invite to become a collaborater on a project <b>" + project.name + "</b>" +
                //"<a href='http://localhost:1337/api/project/share/"+ member.id +"/"+ project.id +"'>Accept</a>"
                "<a href='" + sails.config.globals.SHARE_APP_PATH + "/register/" + project.id + "'>Accept</a>"
            //"<a href='http://localhost:3000/projects'>Accept</a>"
        };

        mailgun.messages().send(data, function (error, body) {

        });
    }
};

