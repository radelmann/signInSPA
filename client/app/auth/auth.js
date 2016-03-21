angular.module('signin.auth', [])

.controller('AuthController', function($scope, $window, $location, $routeParams, Auth) {
  $scope.user = {};

  $scope.info = '';
  $scope.error = '';

  $scope.login = function() {
    Auth.login($scope.user)
      .then(function(token) {
        $window.localStorage.setItem('com.signin', token);
        $location.path('/account');
      })
      .catch(function(error) {
        $scope.error = error.data.message;
      });
  };

  $scope.register = function() {
    //todo field validation
    
    Auth.register($scope.user)
      .then(function(token) {
        $window.localStorage.setItem('com.signin', token);
        $location.path('/account');
      })
      .catch(function(error) {
        $scope.error = error.data.message;
      });
  };

  $scope.forgot = function() {
    Auth.forgot($scope.user)
      .then(function(message) {
        $scope.info = message;
      })
      .catch(function(error) {
        $scope.error = error.data.message;
      });
  };

  $scope.reset = function() {
    Auth.reset($scope.user, $routeParams.token)
      .then(function(message) {
        $scope.info = data.message;
      })
      .catch(function(error) {
        $scope.error = error.data.message;
      });
  };
});