var sanitize = require('mongo-sanitize');

var isAuth = function(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}

var cleanInput = function(req, res, next) {
  req.params = sanitize(req.params);
  req.body = sanitize(req.body);
  next();
}

module.exports = function(app, passport) {
  var user = require('./controllers/user.js')(passport);

  app.post('/register', cleanInput, user.register);

  app.post('/login', cleanInput, user.login);

  // app.post('/login', cleanInput, passport.authenticate('local-login', {
  //   sessioin:false
  // }),user.login);
}