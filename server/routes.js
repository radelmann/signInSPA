var sanitize = require('mongo-sanitize');

var cleanInput = function(req, res, next) {
  req.params = sanitize(req.params);
  req.body = sanitize(req.body);
  next();
}

module.exports = function(app, passport) {
  var user = require('./controllers/user.js')(passport);

  app.post('/register', cleanInput, user.register);
  app.post('/login', cleanInput, user.login);
  app.post('/isAuth', user.isAuth);
  app.post('/forgot', cleanInput, user.forgot);
  app.post('/reset/:token', cleanInput, user.reset);

  app.get('/user/:id',user.isAuth, user.get);
}