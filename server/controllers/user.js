//var crypto = require('crypto');
var User = require('../models/user.js');
var mail = require('../config/mail.js');
var jwt = require('jwt-simple');

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
          res.json({message: info});
        }

        //user has authenticated correctly thus we create a JWT token 
        //encode user id as token
        var token = jwt.encode({id: user._id}, 'secret');
        res.status(200);
        res.json({token: token});

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
              res.json({message:"OK"});
            } else {
              res.send(401);
              res.json({message:"Not Authorized"});
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
          res.json({message: info});
        }

        //user has authenticated correctly thus we create a JWT token 
        //encode user id as token
        var token = jwt.encode({id: user._id}, 'secret');
        res.status(200);
        res.json({token: token});

      })(req, res, next);  
    }
  }
}