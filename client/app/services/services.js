angular.module('signin.services', [])

.factory('Auth', function($http, $location, $window) {
  var login = function(user) {
    return $http({
        method: 'POST',
        url: '/login',
        data: user
      })
      .then(function(resp) {
        return resp.data;
      });
  };

  var register = function(user) {
    return $http({
        method: 'POST',
        url: '/register',
        data: user
      })
      .then(function(resp) {
        return resp.data;
      });
  };

  var forgot = function(user) {
    return $http({
        method: 'POST',
        url: '/forgot',
        data: user
      })
      .then(function(resp) {
        return resp.data;
      });
  };

  var reset = function(user, token) {
    return $http({
        method: 'POST',
        url: '/reset/' + token,
        data: user
      })
      .then(function(resp) {
        return resp.data;
      });
  };

  var get = function(id) {
    return $http({
        method: 'GET',
        url: '/user/' + id
      })
      .then(function(resp) {
        return resp.data;
      });
  };

  var isAuth = function() {
    return !!$window.localStorage.getItem('com.signin');
  };

  var signout = function() {
    $window.localStorage.removeItem('com.signin');
    $location.path('/#/login');
  };

  return {
    login: login,
    register: register,
    isAuth: isAuth,
    signout: signout,
    forgot: forgot,
    get:get,
    reset: reset
  };
});