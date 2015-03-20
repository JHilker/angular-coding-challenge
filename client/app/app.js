'use strict';

angular.module('angularCodingChallengeApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'ui.bootstrap',
  'angularMoment'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });

// Hackish way to get the confirmation working since $rootScope.$on('$stateChangeStart') wasn't triggering
window.onbeforeunload = function() {
  if (_.some(angular.element('.container').scope().users, 'editing')) {
    return 'Are you sure you want to navigate away? You have unsaved changes';
  }
}
