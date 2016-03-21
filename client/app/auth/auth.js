angular.module('signin.auth', [])

.controller('AuthController', function($scope, $window, $location, $routeParams, Auth) {
  $scope.user = {};

  $scope.login = function() {
    Auth.login($scope.user)
      .then(function(token) {
        $window.localStorage.setItem('com.signin', token);
        $location.path('/account');
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.register = function() {
    Auth.register($scope.user)
      .then(function(token) {
        $window.localStorage.setItem('com.signin', token);
        $location.path('/account');
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.forgot = function() {
    Auth.forgot($scope.user)
      .then(function(data) {
        //todo display message
      })
      .catch(function(error) {
        console.error(error);
      });
  };

  $scope.reset = function() {
    Auth.reset($scope.user, $routeParams.token)
      .then(function(data) {
        //todo display message
      })
      .catch(function(error) {
        console.error(error);
      });
  };
});