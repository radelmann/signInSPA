angular.module('signin.services', [])

  .factory('Auth', function ($http, $location, $window) {
    var login = function (user) {
      return $http({
          method: 'POST',
          url: '/login',
          data: user
        })
        .then(function (resp) {
          return resp.data.token;
        });
    };

    var register = function (user) {
      return $http({
          method: 'POST',
          url: '/register',
          data: user
        })
        .then(function (resp) {
          return resp.data.token;
        });
    };

    var isAuth = function () {
      return !!$window.localStorage.getItem('com.signin');
    };

    var signout = function () {
      $window.localStorage.removeItem('com.signin');
      $location.path('/signin');
    };

    return {
      login: login,
      register: register,
      isAuth: isAuth,
      signout: signout
    };
  });
