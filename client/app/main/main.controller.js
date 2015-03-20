'use strict';

angular.module('angularCodingChallengeApp')
  .controller('MainCtrl', function ($scope, $http) {
    $scope.users = [];
    $scope.cachedUsers = [];

    $scope.currentPage = 0;
    $scope.perPage = 10;

    // true means asc for _.sortByOrder
    $scope.sortOrder = true;
    $scope.sortField = 'lastName';


    $http.get('/api/users').success(function (users) {
      $scope.users = users;
    });

    $scope.sortUsers = function (field) {
      if ($scope.sortField === field) {
        $scope.sortOrder = !$scope.sortOrder;
      } else {
        $scope.sortField = field;
        $scope.sortOrder = true;
      }
    };

    $scope.sortedUsers = function () {
      return _.sortByOrder($scope.users, $scope.sortField, $scope.sortOrder);
    };

    $scope.visibleUsers = function () {
      return $scope.sortedUsers().slice($scope.currentPage * $scope.perPage,
                                        $scope.currentPage * $scope.perPage + 10);
    };

    $scope.visiblePageRange = function () {
      var firstUser = $scope.currentPage * $scope.perPage + 1;
      var lastUser = (firstUser + 9) > $scope.users.length ? $scope.users.length : (firstUser + 9);
      return firstUser + '-' + lastUser;
    };

    $scope.nextPage = function () {
      $scope.currentPage += 1;
    };

    $scope.previousPage = function () {
      $scope.currentPage -= 1;
    };

    $scope.addUserRow = function () {
      $scope.users.unshift({ editing: true });
    };

    $scope.editUser = function (user) {
      $scope.cachedUsers[$scope.users.indexOf(user)] = angular.copy(user);
      user.editing = true;
    };

    $scope.cancel = function (user) {
      var index = $scope.users.indexOf(user);
      if (user._id) {
        $scope.users[index] = $scope.cachedUsers[index];
      } else {
        $scope.users.splice(index, 1);
      }
    };

    $scope.saveUser = function (user) {
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

    $scope.deleteUser = function (user) {
      $http.delete('/api/users/' + user._id);
    };
  });
