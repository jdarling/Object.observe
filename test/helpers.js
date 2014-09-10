function numberOfChangesMatching(number) {

    return sinon.match(function(changes) {
        return changes.length === number;
    }, 'number of changes matching ' + number);
}

function aChangeMatches(changes, options){
  var found = false, i=0, l = changes.length, change;
  var test = function(change){
    var result=true;
    var checkFor = function(prop){
      if(typeof(options[prop])!=='undefined'){
        return change[prop]===options[prop];
      }
      return true;
    };
    result = checkFor('name');
    result = result && checkFor('type');
    result = result && checkFor('oldValue');
    result = result && checkFor('newValue');
    return result;
  };
  for(i=0; i<l && !found; i++){
    change = changes[i];
    found = test(change);
  }
  if(!found){
    console.log(changes);
    throw new Error('A change matching type: ' + options.type + ', name: ' + options.name + ', newValue: ' + options.newValue + ', oldValue: ' + options.oldValue + ' not found!');
  }
}

function aChangeMatching(type, name, newValue, oldValue) {

    var args = arguments;

    return sinon.match(function(changes) {
        return changes.length > 0 && changes.some(function(change) {
            return change.type === type && change.name === name && change.object[change.name] === newValue && (args.length === 3 || change.oldValue === oldValue);
        });
    }, 'a change matching type: ' + type + ', name: ' + name + ', newValue: ' + newValue + ', oldValue: ' + oldValue);
}

function aggregate(handler) {

    return function(changes) {

        var i,
            key,
            aggregate = {},
            results = [];

        for (i = 0; i < changes.length; i++) {
            key = changes[i].name;
            if (!aggregate[key] || (aggregate[key].type != 'delete' && changes[i].type == 'add') || (aggregate[key].type != 'add' && (changes[i].type == 'update' || changes[i].type == 'delete'))) {
                aggregate[key] = {
                    type: changes[i].type,
                    oldValue: aggregate[key] ? aggregate[key].oldValue : changes[i].oldValue,
                    object: changes[i].object
                }
            } else if (changes[i].type == 'add' && aggregate[key].type == 'delete') {
                aggregate[key].type = 'update';
                aggregate[key].object = changes[i].object;
            } else if (changes[i].type == 'delete' && aggregate[key].type == 'add') {
                delete aggregate[key];
            }
        }

        for (key in aggregate) {
            if (aggregate[key].type == 'add') {
                results.push({
                    type: 'add',
                    name: key,
                    object: aggregate[key].object
                });
            } else if (aggregate[key].type == 'update') {
                if (aggregate[key].oldValue !== aggregate[key].object[key]) {
                    results.push({
                        type: 'update',
                        name: key,
                        oldValue: aggregate[key].oldValue,
                        object: aggregate[key].object
                    });
                }
            } else if (aggregate[key].type == 'delete') {
                results.push({
                    type: 'delete',
                    name: key,
                    oldValue: aggregate[key].oldValue,
                    object: aggregate[key].object
                });
            }
        }

        if (results.length > 0) {
            handler(results);
        }
    };
}
