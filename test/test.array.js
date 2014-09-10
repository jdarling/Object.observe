'use strict';

describe('Array tests', function(){

  it('Should observe arrays', function(done){
    var handler = function(){
        },
        subject = [];
    Object.observe(subject, handler);
    Object.unobserve(subject, handler);
    done();
  });

  it('Should notify when a new item is added with push', function(done){
    var handler = function(changes){
          Object.unobserve(subject, handler);
          assert(changes.length===2); // 1 for the change and one for the length change
          aChangeMatches(changes, {type: 'add', name: '0'});
          aChangeMatches(changes, {type: 'update', name: 'length', oldValue: 0});
          done();
        },
        subject = [];
    Object.observe(subject, handler);
    subject.push(1);
  });

  it('Should notify when a new item is added with unshift', function(done){
    var handler = function(changes){
          Object.unobserve(subject, handler);
          assert(changes.length===2); // 1 for the change and one for the length change
          aChangeMatches(changes, {type: 'add', name: '0'});
          aChangeMatches(changes, {type: 'update', name: 'length', oldValue: 0});
          done();
        },
        subject = [];
    Object.observe(subject, handler);
    subject.unshift(1);
  });

  it('Should notify when a new item is added by next index', function(done){
    var handler = function(changes){
          Object.unobserve(subject, handler);
          assert(changes.length===2); // 1 for the change and one for the length change
          aChangeMatches(changes, {type: 'add', name: '0'});
          aChangeMatches(changes, {type: 'update', name: 'length', oldValue: 0});
          done();
        },
        subject = [];
    Object.observe(subject, handler);
    subject[subject.length] = 1;
  });

  it('Should notify when a new item is added by any index', function(done){
    var handler = function(changes){
          Object.unobserve(subject, handler);
          assert(changes.length===2); // 1 for the change and one for the length change
          aChangeMatches(changes, {type: 'add', name: '5'});
          aChangeMatches(changes, {type: 'update', name: 'length', oldValue: 0});
          done();
        },
        subject = [];
    Object.observe(subject, handler);
    subject[5] = 1;
  });

  it('Should notify when items are removed from the array using pop', function(done){
    var handler = function(changes){
          Object.unobserve(subject, handler);
          console.log(changes.length);
          assert(changes.length===2); // 1 for the delete and one for the length change
          aChangeMatches(changes, {type: 'delete', name: '2', oldValue: 3});
          aChangeMatches(changes, {type: 'update', name: 'length', oldValue: 3});
          done();
        },
        subject = [1, 2, 3];
    Object.observe(subject, handler);
    subject.pop();
  });

  it('Should notify when items are removed from the array using shift', function(done){
    var handler = function(changes){
          Object.unobserve(subject, handler);
          assert(changes.length===4); // 3 for the removal change and 1 for the length change
          aChangeMatches(changes, {type: 'update', name: '0', oldValue: 1});
          aChangeMatches(changes, {type: 'update', name: '1', oldValue: 2});
          aChangeMatches(changes, {type: 'delete', name: '2', oldValue: 3})
          aChangeMatches(changes, {type: 'update', name: 'length', oldValue: 3});
          done();
        },
        subject = [1, 2, 3];
    Object.observe(subject, handler);
    subject.shift();
  });

  it('Should notify when items are removed from the array using delete', function(done){
    var handler = function(changes){
          Object.unobserve(subject, handler);
          assert(changes.length===1); // 1 for the delete, no change in length
          aChangeMatches(changes, {type: 'delete', name: '1', oldValue: 2})
          done();
        },
        subject = [1, 2, 3];
    Object.observe(subject, handler);
    delete subject[1];
  });

  it('Should notify when items are removed from the array using splice', function(done){
    var handler = function(changes){
          Object.unobserve(subject, handler);
          assert(changes.length===3); // 1 for the change and one for the length change
          aChangeMatches(changes, {type: 'update', name: '1', oldValue: 2});
          aChangeMatches(changes, {type: 'delete', name: '2', oldValue: 3});
          aChangeMatches(changes, {type: 'update', name: 'length', oldValue: 3});
          done();
        },
        subject = [1, 2, 3];
    Object.observe(subject, handler);
    subject.splice(1, 1);
  });

  it('Should notify when an array item is updated', function(done){
    var handler = function(changes){
          Object.unobserve(subject, handler);
          assert(changes.length===1); // 1 for the change and one for the length change
          aChangeMatches(changes, {type: 'update', name: '1', oldValue: 2});
          done();
        },
        subject = [1, 2, 3];
    Object.observe(subject, handler);
    subject[1] = 4;
  });
});
