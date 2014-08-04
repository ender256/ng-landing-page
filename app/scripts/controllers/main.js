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
		$scope.now = Date.now();
		
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
		 * Fetch team
		 */
		$scope.teammates = [];
		$http.get('/data/team.json')
			.success(function(result){
				$scope.teammates = result;
	        })
	        .error(function() {
	        	console.log('teammates not returned!');
	        });
		
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
				
				// get class name to add
				var className = attrs.onScrollVisible;
				
				// get buffer (optional) that must scroll past top before activating
				var buffer = parseFloat(attrs.onScrollVisibleBuffer);
				if( isNaN(buffer) ) {
					buffer = 0;
				}
				
				// get the test (this) and target elements (optionally not this)
				var testElement = attrs.$$element;	// element scroll relates to
				var targetElement = testElement;	// element class added to
				if( attrs.onScrollVisibleTarget !== undefined ) {
					targetElement = angular.element(attrs.onScrollVisibleTarget).last();
				}
				
				// bind to scroll event
				angular.element($window).bind('scroll', function() {
					var testElementTop = testElement.offset().top;
					var screenHeight = angular.element($window).height();
					
					// in case targetElement not set yet (maybe added to DOM late), try now...
					if( attrs.onScrollVisibleTarget !== undefined ) {
						if( targetElement.length === 0 ) {
							targetElement = angular.element(attrs.onScrollVisibleTarget).last();
						}
					}
					
					// if there is a target, can check about manipulating it...
					if( targetElement.length === 1 ) {
						if( this.pageYOffset + screenHeight >= testElementTop + buffer ) {
							if( !targetElement.hasClass(className) ) {
								targetElement.addClass(className);
							}
						} else {
							if( targetElement.hasClass(className) ) {
								targetElement.removeClass(className);
							}
						}
						if( !scope.$$phase ) {
							scope.$apply();
						}
					}
				});
			}
		};
	});
