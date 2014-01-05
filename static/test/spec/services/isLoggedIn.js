'use strict';

describe('Service: isLoggedIn', function () {

  // load the service's module
  beforeEach(module('retrospectApp'));

  // instantiate service
  var isLoggedIn;
  beforeEach(inject(function (_isLoggedIn_) {
    isLoggedIn = _isLoggedIn_;
  }));

  it('should do something', function () {
    expect(!!isLoggedIn).toBe(true);
  });

});
