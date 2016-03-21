angular.module('signin', [
    'signin.services',
    //'signin.account',
    'signin.auth',
    'ngRoute',
    'ui.router'
  ])
  
  .config(function ($routeProvider, $stateProvider, $sceProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/signin')
    $stateProvider
      .state('login', {
        url:'/login',
        templateUrl: 'app/auth/login.html',
        controller: 'AuthController'
      })
      .state('/register', {
        url:'register',
        templateUrl: 'app/auth/register.html',
        controller: 'AuthController'
      })
      .state('/forgot', {
        url:'forgot',
        templateUrl: 'app/auth/forgot.html',
        controller: 'AuthController'
      })
      .state('/reset', {
        url:'reset/:token',
        templateUrl: 'app/auth/reset.html',
        controller: 'AuthController'
      })
      // .state('/account', {
      //   templateUrl: 'app/account/account.html',
      //   controller: 'AccountController'
      // })
    
    $httpProvider.interceptors.push('AttachTokens');
  })
  //todo state and route provider
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