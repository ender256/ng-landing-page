'use strict';

describe('Controller: LegalCtrl', function () {

  // load the controller's module
  beforeEach(module('ngTestApp'));

  var LegalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    LegalCtrl = $controller('LegalCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
