'use strict';

describe('method', function() {

  beforeEach(function() {
    sinon.spy(Object, 'observe');
    sinon.spy(Object, 'unobserve');
  });

  afterEach(function() {
    Object.observe.restore();
    Object.unobserve.restore();
  });

  it('should not throw an error when observing an array', function() {
    var subject = [],
        handler = sinon.stub();

    assert.doesNotThrow(function() {
      Object.observe(subject, handler);
    });
  });

  it('should not throw an error when observing an object', function() {
    var subject = {},
        handler = sinon.stub();

    assert.doesNotThrow(function() {
      Object.observe(subject, handler);
    });
  });

  it('should not throw an error when unobserving an array', function() {
    var subject = [],
        handler = sinon.stub();

    Object.observe(subject, handler);

    assert.doesNotThrow(function() {
      Object.unobserve(subject, handler);
    });
  });

  it('should not throw an error when unobserving an object', function() {
    var subject = {},
        handler = sinon.stub();

    Object.observe(subject, handler);

    assert.doesNotThrow(function() {
        Object.unobserve(subject, handler);
    });
  });

  it('should throw an error when observing a number', function(){
    var handler = sinon.stub();

    assert.throws(function(){
      Object.observe(1234);
    });
  });

  it('should throw an error when observing a string', function(){
    var handler = sinon.stub();

    assert.throws(function(){
      Object.observe('1234');
    });
  });
});
