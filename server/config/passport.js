var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user.js');
var config = require('./env.js');
var mail = require('../config/mail.js');

module.exports = function(passport) {
  passport.use('local-register', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, email, password, done) {
      process.nextTick(function() {

        User.findOne({
            'email': email,
            'type': 'local'
          })
          .then(function(user) {
            if (user) {
              return done(null, false, 'That email is already in use. Please try again.');
            } else {

              var newUser = new User();
              newUser.name = req.body.name;
              newUser.type = 'local';
              newUser.email = email;
              newUser.password = newUser.generateHash(password);

              newUser.save(function(err, saved) {
                if (err) {
                  done(err);
                }
                //send welcome email
                mail.sendWelcome(saved.email, saved.name, function(err) {
                  return done(err, saved);
                });
              });

            }
          }, function(err) {
            return done(err);
          });
      });
    }));

  passport.use('local-login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password'
    },
    function(email, password, done) {
      User.findOne({
          'email': email,
          'type': 'local'
        })
        .then(function(user) {
          if (!user) {
            return done(null, false, 'Email does not exist. Please try again.');
          }

          if (!user.validPassword(password)) {
            return done(null, false, 'Incorrect password. Please try again.');
          }

          return done(null, user);
        }, function(err) {
          return done(err)
        });
    }));
};