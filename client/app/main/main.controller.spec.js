'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('angularCodingChallengeApp'));

  var MainCtrl,
      scope,
      $httpBackend;

  // Initialize the controller and a mock scope
  beforeEach(inject(function (_$httpBackend_, $controller, $rootScope) {
    $httpBackend = _$httpBackend_;
    $httpBackend.expectGET('/api/users')
      .respond([{ firstName: 'Jacob' }, { firstName: 'Test' }]);

    scope = $rootScope.$new();
    MainCtrl = $controller('MainCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of users to the scope', function () {
    $httpBackend.flush();
    expect(scope.users.length).toBe(2);
  });

  describe('sorting', function () {
    it('should have default values for sortOrder and sortField', function () {
      expect(scope.sortOrder).toBe(true);
      expect(scope.sortField).toBe('lastName');
    });

    describe('sortUsers', function () {
      it('should set sortField if it differs from the current sortField and set sortOrder to asc', function () {
        scope.sortField = 'lastName';
        scope.sortOrder = false;

        scope.sortUsers('age');
        expect(scope.sortField).toBe('age');
        expect(scope.sortOrder).toBe(true);
      });

      it('should set inverse sortOrder when the orderField is unchanged', function () {
        scope.sortField = 'lastName';
        scope.sortOrder = true;

        scope.sortUsers('lastName');
        expect(scope.sortField).toBe('lastName');
        expect(scope.sortOrder).toBe(false);

        scope.sortUsers('lastName');
        expect(scope.sortField).toBe('lastName');
        expect(scope.sortOrder).toBe(true);
      });
    });

    describe('sortedUsers', function () {
      it('should return an array of users sorted using sortField and sortOrder', function () {
        scope.users = [{ firstName: 'Jacob' }, { firstName: 'Test' }];
        scope.sortField = 'firstName';
        scope.sortOrder = true;

        expect(scope.sortedUsers().length).toBe(2);
        expect(scope.sortedUsers()[0].firstName).toBe('Jacob');
        expect(scope.sortedUsers()[1].firstName).toBe('Test');

        scope.sortField = 'firstName';
        scope.sortOrder = false;

        expect(scope.sortedUsers().length).toBe(2);
        expect(scope.sortedUsers()[0].firstName).toBe('Test');
        expect(scope.sortedUsers()[1].firstName).toBe('Jacob');
      });
    });
  });

  describe('pagination', function () {
    beforeEach(function () {
      scope.users = _.times(22, function () {
        return { firstName: 'testUser' };
      });
    });
    it('should have default values for currentPage and perPage', function () {
      expect(scope.currentPage).toBe(0);
      expect(scope.perPage).toBe(10);
    });

    describe('visibleUsers', function () {
      it('should return the proper number of users per page', function () {
        expect(scope.users.length).toBe(22);
        scope.currentPage = 0;
        expect(scope.visibleUsers().length).toBe(10);

        scope.currentPage = 1;
        expect(scope.visibleUsers().length).toBe(10);

        scope.currentPage = 2;
        expect(scope.visibleUsers().length).toBe(2);
      });
    });

  });
});
