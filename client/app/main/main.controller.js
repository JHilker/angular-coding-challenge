'use strict';

angular.module('angularCodingChallengeApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.users = [];

    $http.get('/api/users').success(function(users) {
      $scope.users = users;
    });

    $scope.addUser = function() {
      if($scope.newUser === '') {
        return;
      }
      $http.post('/api/users', { name: $scope.newUser });
      $scope.newUser = '';
    };

    $scope.deleteUser = function(user) {
      $http.delete('/api/users/' + user._id);
    };
  });
