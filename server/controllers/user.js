var crypto = require('crypto');
var User = require('../models/user.js');
var mail = require('../config/mail.js');
var jwt = require('jwt-simple');

var Q = require('q');
var getToken = Q.denodeify(crypto.randomBytes);

module.exports = function(passport) {
  return {
    login: function(req, res, next) {
      passport.authenticate('local-login', {
        session: false
      }, function(err, user, info) {
        if (err) {
          return next(err)
        }

        if (!user) {
          res.status(401);
          res.json({
            message: info
          });
        }

        //user has authenticated correctly thus we create a JWT token 
        //encode user id as token
        var token = jwt.encode({
          id: user._id
        }, 'secret');
        
        res.status(200);

        res.json({
          token: token,
          id: user._id
        });

      })(req, res, next);
    },

    isAuth: function(req, res, next) {
      // checking to see if the user is authenticated
      // grab the token in the header, if any
      // then decode the token, which we end up being the user object
      // check to see if that user exists in the database
      var token = req.headers['x-access-token'];
      if (!token) {
        next(new Error('No token'));
      } else {
        var user_Id = jwt.decode(token, 'secret');
        console.log(user_Id);
        //decode userid as token, attempt to find user
        User.findOne({
            _id: user_Id.id
          })
          .then(function(foundUser) {
            if (foundUser) {
              res.status(200);
              res.json({
                message: "OK"
              });
            } else {
              res.send(401);
              res.json({
                message: "Not Authorized"
              });
            }
          })
          .catch(function(error) {
            next(error);
          });
      }
    },

    register: function(req, res, next) {
      passport.authenticate('local-register', {
        session: false
      }, function(err, user, info) {
        if (err) {
          return next(err)
        }

        if (!user) {
          res.status(401);
          res.json({
            message: info
          });
        }

        //user has authenticated correctly thus we create a JWT token 
        //encode user id as token
        var token = jwt.encode({
          id: user._id
        }, 'secret');
        res.status(200);
        res.json({
          token: token,
          id: user._id
        });

      })(req, res, next);
    },

    forgot: function(req, res, next) {
      getToken(20)
        .then(function(buffer) {
          token = buffer.toString('hex');
          return User.findOne({
            email: req.body.email,
            type: 'local'
          });
        })
        .then(function(user) {
          if (!user) {
            res.status(200);
            res.json({
              error: "No account with that email address exists."
            });
          } else {
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
            return user.save();
          }
        })
        .then(function(user) {
          mail.sendForgot(user.email, req.headers.host, token, function(err, results) {
              res.status(200);
              res.json({
                message: "An e-mail has been sent to " + user.email + " with further instructions."
              });
            })
            .catch(function(err) {
              next(err);
            });
        });
    },

    reset: function(req, res, next) {
      User.findOne({
          resetPasswordToken: req.params.token,
          resetPasswordExpires: {
            $gt: Date.now()
          }
        })
        .then(function(user) {
          if (!user) {
            res.status(200);
            res.json({
              error: 'Password reset token is invalid or has expired.'
            });
          }

          user.password = user.generateHash(req.body.password);
          user.resetPasswordToken = undefined;
          user.resetPasswordExpires = undefined;

          user.save(function(err, saved) {
              if (err) {
                next(err);
              }
              mail.sendReset(user.email, function(err, results) {
                if (err) {
                  next(err);
                }
                res.status(200);
                res.json({
                  info: "Success! Your password has been changed."
                });
              });
            },
            function(err) {
              console.log(err);
              next(err);
            });
        });
    },

    get: function(req, res, next) {
      User.findOne({
          _id: req.params.id
        })
        .then(function(user) {
          if (!user) {
            res.status(404);
            res.json({
              error: 'User not found.'
            });
          }

          res.status(200);
          res.json({user:user});
        })
        .catch(function(err) {
          next(err);
        });
    }
  }
}