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

    $scope.search = '';

    $http.get('/api/users').success(function (users) {
      $scope.users = users;
    });

    $scope.filtering = function () {
      if ($scope.filteredUsers().length < ($scope.currentPage * $scope.perPage + 1)) {
        $scope.currentPage = 0;
      }
    };

    $scope.filteredUsers = function () {
      var filter = $scope.search.toLowerCase();
      return _.filter($scope.users, function (user) {
        return ((user.newUser) ||
                (user.lastName && user.lastName.toLowerCase().search(filter) >= 0) ||
                (user.firstName && user.firstName.toLowerCase().search(filter) >= 0) ||
                (user.age && user.age.toString().search(filter) >= 0) ||
                (user.email && user.email.toLowerCase().search(filter) >= 0) ||
                (moment(user.createdOn).format('MM/DD/YYYY hh:mm:ss A').search(filter) >= 0) ||
                (moment(user.lastEdited).format('MM/DD/YYYY hh:mm:ss A').search(filter) >= 0));
      });
    };

    $scope.sortUsers = function (field) {
      if ($scope.sortField === field) {
        $scope.sortOrder = !$scope.sortOrder;
      } else {
        $scope.sortField = field;
        $scope.sortOrder = true;
      }
    };

    $scope.sortedUsers = function () {
      // Always put new entries at the top
      return _.sortByOrder($scope.filteredUsers(), ['newUser', $scope.sortField], [true, $scope.sortOrder]);
    };

    $scope.visibleUsers = function () {
      return $scope.sortedUsers().slice($scope.currentPage * $scope.perPage,
                                        $scope.currentPage * $scope.perPage + 10);
    };

    $scope.visiblePageRange = function () {
      if ($scope.sortedUsers().length > 0) {
        var firstUser = $scope.currentPage * $scope.perPage + 1;
        var lastUser = (firstUser + 9) > $scope.sortedUsers().length ? $scope.sortedUsers().length : (firstUser + 9);
        return firstUser + '-' + lastUser;
      } else {
        return '0-0';
      }
    };

    $scope.nextPage = function () {
      $scope.currentPage += 1;
    };

    $scope.previousPage = function () {
      $scope.currentPage -= 1;
    };

    $scope.userValid = function (user) {
      return user.firstName && user.lastName && user.email && $scope.uniqueEmail(user) ? true : false;
    };

    $scope.uniqueEmail = function (user) {
      return _.filter($scope.users, 'email', user.email).length <= 1;
    }

    $scope.addUserRow = function () {
      $scope.users.push({ editing: true, newUser: true });
    };

    $scope.editUser = function (user) {
      if (!user.editing) {
        $scope.cachedUsers[$scope.users.indexOf(user)] = angular.copy(user);
        user.editing = true;
      }
    };

    $scope.cancel = function (user, $event) {
      var index = $scope.users.indexOf(user);
      if (user._id) {
        $scope.users[index] = $scope.cachedUsers[index];
      } else {
        $scope.users.splice(index, 1);
      }
      $event.stopImmediatePropagation();
    };

    $scope.saveUser = function (user, $event) {
      if (user.editing && $scope.userValid(user)) {
        user.lastEdited = moment();
        if (user._id) {
          $http.put('/api/users/' + user._id, user);
        } else {
          user.createdOn = user.lastEdited;
          $http.post('/api/users', user).success(function (respUser) {
            var user = _.find($scope.users, 'email', respUser.email);
            user._id = respUser._id;
          });
          delete user.newUser;
        }
        user.editing = false;
      }
      $event.stopImmediatePropagation();
    };

    $scope.deleteUser = function (user) {
      $http.delete('/api/users/' + user._id);
    };
  });
