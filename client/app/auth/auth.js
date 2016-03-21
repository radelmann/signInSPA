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
      .then(function(data) {
        $scope.info = data.message ? data.message : "";
        $scope.error = data.error ? data.error : "";
      })
      .catch(function(error) {
        $scope.error = error.data.message;
      });
  };

  $scope.reset = function() {
    Auth.reset($scope.user, $routeParams.token)
      .then(function(data) {
        $scope.info = data.message ? data.message : "";
        $scope.error = data.error ? data.error : "";
      })
      .catch(function(error) {
        $scope.error = error.data.message;
      });
  };

  var initValidators = function() {
    var password = document.getElementById("password");
    var confirm_password = document.getElementById("confirmPassword");

    $scope.validatePassword = function() {
      if (password.value != confirm_password.value) {
        confirm_password.setCustomValidity("Passwords Don't Match");
      } else {
        confirm_password.setCustomValidity('');
      }
    }

    password.onchange = $scope.validatePassword;
    confirm_password.onkeyup = $scope.validatePassword;
  }
  initValidators();
});