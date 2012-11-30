var updateWatcher = function(prefix){
  return function(updates){
    var i = 0, l = updates.length, update;
    for(i=0; i<l; i++){
      update = updates[i];
      console.log(prefix, update.name, update.type, update.oldValue, '-->', update.value);
    }
  }
};
var tmp = {foo: 'test'};
Object.observe(tmp, updateWatcher(1));
tmp.foo = 'bar';
tmp.foo = 'none';
tmp.foo = 'some';
tmp.bar = "bar added";
Object.observe(tmp, updateWatcher(2));

setTimeout(function(){
  delete tmp.bar;
  tmp.foo = 'another update';
  tmp.getNotifier()._checkPropertyListing();
}, 500);