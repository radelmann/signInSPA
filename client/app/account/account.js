angular.module('signin.account', [])

.controller('AccountController', function($scope, $window, $location, $routeParams, Auth) {
  $scope.user = {};

  $scope.info = '';
  $scope.error = '';

  Auth.get($routeParams.id)
    .then(function(data) {
      console.log(data.user)
      $scope.user = data.user ? data.user : {};
      $scope.error = data.error ? data.error : "";
    })
    .catch(function(error) {
      $scope.error = error.data.message;
    });
});