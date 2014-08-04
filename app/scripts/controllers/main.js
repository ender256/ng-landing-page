'use strict';


/**
 * @ngdoc function
 * @name ngTestApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the ngTestApp
 */
angular.module('ngTestApp')
	.controller('MainCtrl', function($scope, $document, $http) {
		
		/*
		 * Scroll-to links
		 */
		$scope.floatingHeaderHeight = 90;
		$scope.scrollTo = function(tag) {
			$document.find('html,body').animate({
				scrollTop: $document.find('#anchor_' + tag).offset().top - $scope.floatingHeaderHeight
			}, 1000);
		};
		
		/*
		 * Comment functionality
		 */
		
		// prepop existing comments
		$scope.comments = [];
		$http.get('/data/comments.json')
			.success(function(result){
				$scope.comments = result;
	        })
	        .error(function() {
	        	console.log('comments not returned!');
	        });
		
		// add new comment
		$scope.comment = {};
		$scope.addComment = function() {

			if( $scope.comment.email !== undefined && $scope.comment.email.length > 0 ) {
				if( $scope.comment.message !== undefined && $scope.comment.message.length > 0 ) {
					
					// finish out the comment object & push onto array
					if( $scope.comment.anonymous ) {
						$scope.comment.email = 'XXXXX' + $scope.comment.email.substring( $scope.comment.email.indexOf('@') );
					}
					$scope.comment.timestamp = Date.now();
					$scope.comments.push($scope.comment);
					
					$document.find('html,body').animate({
						scrollTop: $document.height()
					}, 500);
					
					$scope.comment = {};
				}
			}
		};
	})
	
	/*
	 * Element Directives
	 */
	.directive('header', function() {
		return {
			restrict: 'E',
			replace: true,
			templateUrl: 'views/partials/header.html',
			controller: 'MainCtrl'
		};
	})
	.directive('teammate', function() {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				member: '=info'
			},
			templateUrl: 'views/partials/teammate.html'
		};
	})
	
	
	/*
	 * Attribute Directives
	 */
	.directive('parallax', function($window) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var speed = parseFloat(attrs.parallax);
				if( isNaN(speed) ) {
					speed = 0.15;
				}
				angular.element($window).bind('scroll', function() {
					element.css({top: speed * this.pageYOffset});
					if( !scope.$$phase ) {
						scope.$apply();
					}
				});
			}
		};
	})
	.directive('stickToTop', function($window) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var parent = attrs.$$element.parent();
				
				angular.element($window).bind('scroll', function() {
					var parentTop = parent.offset().top;
					if( this.pageYOffset > parentTop ) {
						element.css({position: 'fixed'});
					} else {
						element.css({position: 'absolute'});
					}
					if( !scope.$$phase ) {
						scope.$apply();
					}
				});
			}
		};
	})
	.directive('onScrollVisible', function($window) {
		return {
			restrict: 'A',
			link: function(scope, element, attrs) {
				var buffer = parseFloat(attrs.onScrollVisible);
				
				angular.element($window).bind('scroll', function() {
					var element = attrs.$$element;
					var elementTop = element.offset().top;
					var screenHeight = angular.element($window).height();
					if( this.pageYOffset + screenHeight >= elementTop + buffer ) {
						if( !element.hasClass('scrollActive') ) {
							element.addClass('scrollActive');
						}
					} else {
						if( element.hasClass('scrollActive') ) {
							element.removeClass('scrollActive');
						}
					}
					if( !scope.$$phase ) {
						scope.$apply();
					}
				});
			}
		};
	});
