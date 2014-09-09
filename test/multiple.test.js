'use strict';

describe('multiple', function() {

    beforeEach(function() {

        sinon.spy(Object, 'observe');
        sinon.spy(Object, 'unobserve');
    });

    afterEach(function() {

        Object.observe.restore();
        Object.unobserve.restore();
    });

    it('should not aggregate an add then update to a single add for an object', function(done) {

        var subject = {},
            value1 = sinon.stub(),
            value2 = sinon.stub(),
            handler = sinon.stub();

        Object.observe(subject, handler);

        subject.foo = value1;
        subject.foo = value2;

        setTimeout(function() {
            sinon.assert.calledOnce(handler);
            sinon.assert.calledWithMatch(handler, numberOfChangesMatching(2));
            sinon.assert.calledWithMatch(handler, aChangeMatching('add', 'foo', value2));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'foo', value2, value1));
            done();
        }, 100);
    });

    it('should not aggregate an add then update to a single add for an array', function(done) {

        var subject = [],
            value1 = sinon.stub(),
            value2 = sinon.stub(),
            handler = sinon.stub();

        Object.observe(subject, handler);

        subject.push(value1);
        subject[0] = value2;

        setTimeout(function() {
            sinon.assert.calledOnce(handler);
            sinon.assert.calledWithMatch(handler, numberOfChangesMatching(3));
            sinon.assert.calledWithMatch(handler, aChangeMatching('add', '0', value2));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'length', 1, 0));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', '0', value2, value1));
            done();
        }, 100);
    });

    it('should not aggregate an add then delete to nothing for an object', function(done) {

        var subject = {},
            value = sinon.stub(),
            handler = sinon.stub();

        Object.observe(subject, handler);

        subject.foo = value;
        delete subject.foo;

        setTimeout(function() {
            sinon.assert.calledOnce(handler);
            sinon.assert.calledWithMatch(handler, numberOfChangesMatching(2));
            sinon.assert.calledWithMatch(handler, aChangeMatching('add', 'foo', undefined));
            sinon.assert.calledWithMatch(handler, aChangeMatching('delete', 'foo', undefined, value));
            done();
        }, 100);
    });

    it('should not aggregate an add then delete to nothing for an array', function(done) {

        var subject = [],
            value = sinon.stub(),
            handler = sinon.stub();

        Object.observe(subject, handler);

        subject.push(value);
        subject.pop();

        setTimeout(function() {
            sinon.assert.calledOnce(handler);
            sinon.assert.calledWithMatch(handler, numberOfChangesMatching(4));
            sinon.assert.calledWithMatch(handler, aChangeMatching('add', '0', undefined));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'length', 0, 0));
            sinon.assert.calledWithMatch(handler, aChangeMatching('delete', '0', undefined, value));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'length', 0, 1));
            done();
        }, 100);
    });

    it('should not aggregate an add then update then delete to nothing for an object', function(done) {

        var subject = {},
            value1 = sinon.stub(),
            value2 = sinon.stub(),
            handler = sinon.stub();

        Object.observe(subject, handler);

        subject.foo = value1;
        subject.foo = value2;
        delete subject.foo;

        setTimeout(function() {
            sinon.assert.calledOnce(handler);
            sinon.assert.calledWithMatch(handler, numberOfChangesMatching(3));
            sinon.assert.calledWithMatch(handler, aChangeMatching('add', 'foo', undefined));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'foo', undefined, value1));
            sinon.assert.calledWithMatch(handler, aChangeMatching('delete', 'foo', undefined, value2));
            done();
        }, 100);
    });

    it('should not aggregate an add then update then delete to nothing for an array', function(done) {

        var subject = [],
            value1 = sinon.stub(),
            value2 = sinon.stub(),
            handler = sinon.stub();

        Object.observe(subject, handler);

        subject.push(value1);
        subject[0] = value2;
        subject.pop();

        setTimeout(function() {
            sinon.assert.calledOnce(handler);
            sinon.assert.calledWithMatch(handler, numberOfChangesMatching(5));
            sinon.assert.calledWithMatch(handler, aChangeMatching('add', '0', undefined));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'length', 0, 0));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', '0', undefined, value1));
            sinon.assert.calledWithMatch(handler, aChangeMatching('delete', '0', undefined, value2));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'length', 0, 1));
            done();
        }, 100);
    });

    it('should not aggregate an add then update then update then delete to nothing for an object', function(done) {

        var subject = {},
            value1 = sinon.stub(),
            value2 = sinon.stub(),
            handler = sinon.stub();

        Object.observe(subject, handler);

        subject.foo = value1;
        subject.foo = value2;
        subject.foo = value1;
        delete subject.foo;

        setTimeout(function() {
            sinon.assert.calledOnce(handler);
            sinon.assert.calledWithMatch(handler, numberOfChangesMatching(4));
            sinon.assert.calledWithMatch(handler, aChangeMatching('add', 'foo', undefined));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'foo', undefined, value1));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'foo', undefined, value2));
            sinon.assert.calledWithMatch(handler, aChangeMatching('delete', 'foo', undefined, value1));
            done();
        }, 100);
    });

    it('should not aggregate an add then update then update then delete to nothing for an array', function(done) {

        var subject = [],
            value1 = sinon.stub(),
            value2 = sinon.stub(),
            handler = sinon.stub();

        Object.observe(subject, handler);

        subject.push(value1);
        subject[0] = value2;
        subject[0] = value1;
        subject.pop();

        setTimeout(function() {
            sinon.assert.calledOnce(handler);
            sinon.assert.calledWithMatch(handler, numberOfChangesMatching(6));
            sinon.assert.calledWithMatch(handler, aChangeMatching('add', '0', undefined));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'length', 0, 0));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', '0', undefined, value1));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', '0', undefined, value2));
            sinon.assert.calledWithMatch(handler, aChangeMatching('delete', '0', undefined, value1));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'length', 0, 1));
            done();
        }, 100);
    });

    it('should not aggregate an update then delete to a single delete for an object', function(done) {

        var subject = {},
            value1 = sinon.stub(),
            value2 = sinon.stub(),
            handler = sinon.stub();

        subject.foo = value1;

        Object.observe(subject, handler);

        subject.foo = value2;
        delete subject.foo;

        setTimeout(function() {
            sinon.assert.calledOnce(handler);
            sinon.assert.calledWithMatch(handler, numberOfChangesMatching(2));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'foo', undefined, value1));
            sinon.assert.calledWithMatch(handler, aChangeMatching('delete', 'foo', undefined, value2));
            done();
        }, 100);
    });

    it('should not aggregate an update then delete to a single delete for an array', function(done) {

        var subject = [],
            value1 = sinon.stub(),
            value2 = sinon.stub(),
            handler = sinon.stub();

        subject.push(value1);

        Object.observe(subject, handler);

        subject[0] = value2;
        subject.pop();

        setTimeout(function() {
            sinon.assert.calledOnce(handler);
            sinon.assert.calledWithMatch(handler, numberOfChangesMatching(3));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', '0', undefined, value1));
            sinon.assert.calledWithMatch(handler, aChangeMatching('delete', '0', undefined, value2));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'length', 0, 1));
            done();
        }, 100);
    });

    it('should not aggregate an add then update then delete then add to a single add for an object', function(done) {

        var subject = {},
            value1 = sinon.stub(),
            value2 = sinon.stub(),
            value3 = sinon.stub(),
            handler = sinon.stub();

        Object.observe(subject, handler);

        subject.foo = value1;
        subject.foo = value2;
        delete subject.foo;
        subject.foo = value3;

        setTimeout(function() {
            sinon.assert.calledOnce(handler);
            sinon.assert.calledWithMatch(handler, numberOfChangesMatching(4));
            sinon.assert.calledWithMatch(handler, aChangeMatching('add', 'foo', value3));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'foo', value3, value1));
            sinon.assert.calledWithMatch(handler, aChangeMatching('delete', 'foo', value3, value2));
            sinon.assert.calledWithMatch(handler, aChangeMatching('add', 'foo', value3));
            done();
        }, 100);
    });

    it('should not aggregate an add then update then delete then add to a single add for an array', function(done) {

        var subject = [],
            value1 = sinon.stub(),
            value2 = sinon.stub(),
            value3 = sinon.stub(),
            handler = sinon.stub();

        Object.observe(subject, handler);

        subject.push(value1);
        subject[0] = value2;
        subject.pop();
        subject.push(value3);

        setTimeout(function() {
            sinon.assert.calledOnce(handler);
            sinon.assert.calledWithMatch(handler, numberOfChangesMatching(7));
            sinon.assert.calledWithMatch(handler, aChangeMatching('add', '0', value3));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'length', 1, 0));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', '0', value3, value1));
            sinon.assert.calledWithMatch(handler, aChangeMatching('delete', '0', value3, value2));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'length', 1, 1));
            sinon.assert.calledWithMatch(handler, aChangeMatching('add', '0', value3));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'length', 1, 0));
            done();
        }, 100);
    });

    it('should not aggregate an add then update then delete then add then update to a single add for an object', function(done) {

        var subject = {},
            value1 = sinon.stub(),
            value2 = sinon.stub(),
            value3 = sinon.stub(),
            value4 = sinon.stub(),
            handler = sinon.stub();

        Object.observe(subject, handler);

        subject.foo = value1;
        subject.foo = value2;
        delete subject.foo;
        subject.foo = value3;
        subject.foo = value4;

        setTimeout(function() {
            sinon.assert.calledOnce(handler);
            sinon.assert.calledWithMatch(handler, numberOfChangesMatching(5));
            sinon.assert.calledWithMatch(handler, aChangeMatching('add', 'foo', value4));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'foo', value4, value1));
            sinon.assert.calledWithMatch(handler, aChangeMatching('delete', 'foo', value4, value2));
            sinon.assert.calledWithMatch(handler, aChangeMatching('add', 'foo', value4));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'foo', value4, value3));
            done();
        }, 100);
    });

    it('should not aggregate an add then update then delete then add then update to a single add for an array', function(done) {

        var subject = [],
            value1 = sinon.stub(),
            value2 = sinon.stub(),
            value3 = sinon.stub(),
            value4 = sinon.stub(),
            handler = sinon.stub();

        Object.observe(subject, handler);

        subject.push(value1);
        subject[0] = value2;
        subject.pop();
        subject.push(value3);
        subject[0] = value4;

        setTimeout(function() {
            sinon.assert.calledOnce(handler);
            sinon.assert.calledWithMatch(handler, numberOfChangesMatching(8));
            sinon.assert.calledWithMatch(handler, aChangeMatching('add', '0', value4));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'length', 1, 0));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', '0', value4, value1));
            sinon.assert.calledWithMatch(handler, aChangeMatching('delete', '0', value4, value2));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'length', 1, 1));
            sinon.assert.calledWithMatch(handler, aChangeMatching('add', '0', value4));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'length', 1, 0));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', '0', value4, value3));
            done();
        }, 100);
    });

    it('should not aggregate a delete then add to a single update for an object', function(done) {

        var subject = {},
            value1 = sinon.stub(),
            value2 = sinon.stub(),
            handler = sinon.stub();

        subject.foo = value1;

        Object.observe(subject, handler);

        delete subject.foo;
        subject.foo = value2;

        setTimeout(function() {
            sinon.assert.calledOnce(handler);
            sinon.assert.calledWithMatch(handler, numberOfChangesMatching(2));
            sinon.assert.calledWithMatch(handler, aChangeMatching('delete', 'foo', value2, value1));
            sinon.assert.calledWithMatch(handler, aChangeMatching('add', 'foo', value2));
            done();
        }, 100);
    });

    it('should not aggregate a delete then add to a single update for an array', function(done) {

        var subject = [],
            value1 = sinon.stub(),
            value2 = sinon.stub(),
            handler = sinon.stub();

        subject.push(value1);

        Object.observe(subject, handler);

        subject.pop();
        subject.push(value2);

        setTimeout(function() {
            sinon.assert.calledOnce(handler);
            sinon.assert.calledWithMatch(handler, numberOfChangesMatching(4));
            sinon.assert.calledWithMatch(handler, aChangeMatching('delete', '0', value2, value1));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'length', 1, 1));
            sinon.assert.calledWithMatch(handler, aChangeMatching('add', '0', value2));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'length', 1, 0));
            done();
        }, 100);
    });

    it('should not aggregate a delete then add then update to a single update for an object', function(done) {

        var subject = {},
            value1 = sinon.stub(),
            value2 = sinon.stub(),
            value3 = sinon.stub(),
            handler = sinon.stub();

        subject.foo = value1;

        Object.observe(subject, handler);

        delete subject.foo;
        subject.foo = value2;
        subject.foo = value3;

        setTimeout(function() {
            sinon.assert.calledOnce(handler);
            sinon.assert.calledWithMatch(handler, numberOfChangesMatching(3));
            sinon.assert.calledWithMatch(handler, aChangeMatching('delete', 'foo', value3, value1));
            sinon.assert.calledWithMatch(handler, aChangeMatching('add', 'foo', value3));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'foo', value3, value2));
            done();
        }, 100);
    });

    it('should not aggregate a delete then add then update to a single update for an array', function(done) {

        var subject = [],
            value1 = sinon.stub(),
            value2 = sinon.stub(),
            value3 = sinon.stub(),
            handler = sinon.stub();

        subject.push(value1);

        Object.observe(subject, handler);

        subject.pop();
        subject.push(value2);
        subject[0] = value3;

        setTimeout(function() {
            sinon.assert.calledOnce(handler);
            sinon.assert.calledWithMatch(handler, numberOfChangesMatching(5));
            sinon.assert.calledWithMatch(handler, aChangeMatching('delete', '0', value3, value1));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'length', 1, 1));
            sinon.assert.calledWithMatch(handler, aChangeMatching('add', '0', value3));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'length', 1, 0));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', '0', value3, value2));
            done();
        }, 100);
    });

    it('should not aggregate a delete then add then update then delete to a single delete for an object', function(done) {

        var subject = {},
            value1 = sinon.stub(),
            value2 = sinon.stub(),
            value3 = sinon.stub(),
            handler = sinon.stub();

        subject.foo = value1;

        Object.observe(subject, handler);

        delete subject.foo;
        subject.foo = value2;
        subject.foo = value3;
        delete subject.foo;

        setTimeout(function() {
            sinon.assert.calledOnce(handler);
            sinon.assert.calledWithMatch(handler, numberOfChangesMatching(4));
            sinon.assert.calledWithMatch(handler, aChangeMatching('delete', 'foo', undefined, value1));
            sinon.assert.calledWithMatch(handler, aChangeMatching('add', 'foo', undefined));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'foo', undefined, value2));
            sinon.assert.calledWithMatch(handler, aChangeMatching('delete', 'foo', undefined, value3));
            done();
        }, 100);
    });

    it('should not aggregate a delete then add then update then delete to a single delete for an array', function(done) {

        var subject = [],
            value1 = sinon.stub(),
            value2 = sinon.stub(),
            value3 = sinon.stub(),
            handler = sinon.stub();

        subject.push(value1);

        Object.observe(subject, handler);

        subject.pop();
        subject.push(value2);
        subject[0] = value3;
        subject.pop();

        setTimeout(function() {
            sinon.assert.calledOnce(handler);
            sinon.assert.calledWithMatch(handler, numberOfChangesMatching(7));
            sinon.assert.calledWithMatch(handler, aChangeMatching('delete', '0', undefined, value1));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'length', 0, 1));
            sinon.assert.calledWithMatch(handler, aChangeMatching('add', '0', undefined));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'length', 0, 0));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', '0', undefined, value2));
            sinon.assert.calledWithMatch(handler, aChangeMatching('delete', '0', undefined, value3));
            sinon.assert.calledWithMatch(handler, aChangeMatching('update', 'length', 0, 1));
            done();
        }, 100);
    });
});
