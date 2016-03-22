angular.module('signin', [
    'signin.services',
    'signin.account',
    'signin.auth',
    'ngRoute'
  ])
  .config(function ($routeProvider, $httpProvider) {
    $routeProvider
      .when('/login', {
        templateUrl: 'app/auth/login.html',
        controller: 'AuthController'
      })
      .when('/register', {
        templateUrl: 'app/auth/register.html',
        controller: 'AuthController'
      })
      .when('/forgot', {
        templateUrl: 'app/auth/forgot.html',
        controller: 'AuthController'
      })
      .when('/reset/:token', {
        templateUrl: 'app/auth/reset.html',
        controller: 'AuthController'
      })
      .when('/account/:id', {
        templateUrl: 'app/account/account.html',
        controller: 'AccountController'
      })
      .otherwise('/login');
    $httpProvider.interceptors.push('AttachTokens');
  })
  .factory('AttachTokens', function ($window) {
    var attach = {
      request: function (object) {
        var jwt = $window.localStorage.getItem('com.signin');
        if (jwt) {
          object.headers['x-access-token'] = jwt;
        }
        object.headers['Allow-Control-Allow-Origin'] = '*';
        return object;
      }
    };
    return attach;
  })
  .run(function ($rootScope, $location, Auth) {
    $rootScope.$on('$routeChangeStart', function (evt, next, current) {
      if (next.$$route && next.$$route.authenticate && !Auth.isAuth()) {
        $location.path('/login');
      }
    });
  });