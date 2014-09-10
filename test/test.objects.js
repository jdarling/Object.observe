'use strict';

describe('single', function() {

    beforeEach(function() {

        sinon.spy(Object, 'observe');
        sinon.spy(Object, 'unobserve');
    });

    afterEach(function() {

        Object.observe.restore();
        Object.unobserve.restore();
    });

    it('should call the handler when an object property is added', function(done) {

        var subject = {},
            handler = sinon.stub();

        Object.observe(subject, handler);

        subject.foobar = 123;

        setTimeout(function() {
            sinon.assert.calledOnce(handler);
            sinon.assert.calledWithMatch(handler, numberOfChangesMatching(1));
            sinon.assert.calledWithMatch(handler, aChangeMatching('add', 'foobar', 123));
            done();
        }, 100);
    });

    it('should not call the handler when an object property is added to the prototype', function(done) {

        var subject = new Subject(),
            handler = sinon.stub();

        function Subject() {}

        Object.observe(subject, handler);

        Subject.prototype.foobar = 123;

        setTimeout(function() {
            assert.property(subject, 'foobar');
            assert.propertyVal(subject, 'foobar', 123);
            sinon.assert.notCalled(handler);
            done();
        }, 100);
    });

    it('should call the handler when an object property is updated', function(done) {

        var subject = {},
            handler = sinon.stub();

        subject.foo = 'bar';

        Object.observe(subject, handler);

        subject.foo = 'barbar';

        setTimeout(function() {
            sinon.assert.calledOnce(handler);
            sinon.assert.calledWithMatch(handler, numberOfChangesMatching(1));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'foo', 'barbar', 'bar'));
            done();
        }, 100);
    });

    it('should not call the handler when an object property is updated on the prototype', function(done) {

        var subject = new Subject(),
            handler = sinon.stub();

        function Subject() {}
        Subject.prototype.foo = 'bar';

        assert.property(subject, 'foo');
        assert.propertyVal(subject, 'foo', 'bar');

        Object.observe(subject, handler);

        Subject.prototype.foo = 'barbar';

        setTimeout(function() {
            assert.property(subject, 'foo');
            assert.propertyVal(subject, 'foo', 'barbar');
            sinon.assert.notCalled(handler);
            done();
        }, 100);
    });

    it('should call the handler when an object property is deleted', function(done) {

        var subject = {},
            handler = sinon.stub();

        subject.foo = undefined;

        Object.observe(subject, handler);

        delete subject.foo;

        setTimeout(function() {
            sinon.assert.calledOnce(handler);
            sinon.assert.calledWithMatch(handler, numberOfChangesMatching(1));
            sinon.assert.calledWithMatch(handler, aChangeMatching('delete', 'foo', undefined, undefined));
            done();
        }, 100);
    });

    it('should not call the handler when an object property is deleted on the prototype', function(done) {

        var subject = new Subject(),
            handler = sinon.stub();

        function Subject() {}
        Subject.prototype.foo = 123;

        assert.property(subject, 'foo');
        assert.propertyVal(subject, 'foo', 123);

        Object.observe(subject, handler);

        delete Subject.prototype.foo;

        setTimeout(function() {
            assert.notProperty(subject, 'foo');
            sinon.assert.notCalled(handler);
            done();
        }, 100);
    });

});
