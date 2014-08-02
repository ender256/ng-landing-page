'use strict';

/**
 * @ngdoc function
 * @name ngTestApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the ngTestApp
 */
angular.module('ngTestApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
