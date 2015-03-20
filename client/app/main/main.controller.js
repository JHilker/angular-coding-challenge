'use strict';

angular.module('angularCodingChallengeApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.users = [];
    $scope.cachedUsers = [];

    $scope.currentPage = 0;
    $scope.perPage = 10;

    $scope.orderBy = 'lastName';
    $scope.sortOrder = 'asc';

    $http.get('/api/users').success(function(users) {
      $scope.users = users;
    });

    $scope.editUser = function(user) {
      $scope.cachedUsers[$scope.users.indexOf(user)] = angular.copy(user);
      user.editing = true;
    };


    $scope.cancel = function(user) {
      var index = $scope.users.indexOf(user);
      if (user._id) {
        $scope.users[index] = $scope.cachedUsers[index]
      } else {
        $scope.users.splice(index, 1);
      }
    };

    $scope.addUserRow = function() {
      $scope.users.unshift({ editing: true });
    };

    $scope.sortUsers = function(field) {
      $scope.users = _.sortBy($scope.users, field);
    };


    $scope.saveUser = function(user) {
      if (user.editing !== false) {
        user.lastEdited = moment();
        if (user._id) {
          $http.put('/api/users/' + user._id, user);
        } else {
          user.createdOn = user.lastEdited;
          $http.post('/api/users', user);
        }

        user.editing = false;
      }
    };

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

    $scope.visibleUsers = function() {
      return $scope.users.slice($scope.currentPage * $scope.perPage, $scope.currentPage * $scope.perPage + 10);
    };

    $scope.visiblePageRange = function() {
      var firstUser = $scope.currentPage * $scope.perPage + 1;
      var lastUser = (firstUser + 9) > $scope.users.length ? $scope.users.length : (firstUser + 9);
      return firstUser + '-' + lastUser;
    }

    $scope.previousPage = function() {
      $scope.currentPage -= 1;
    }

    $scope.nextPage = function() {
      $scope.currentPage += 1;
    };
  });
