var $ = function(idOrName){
  var enl = document.getElementsByName(idOrName), cnl = document.getElementsByClassName(idOrName), elem;
  if((cnl.length||0)>0){
    return cnl;
  }
  if((enl.length||0)>0){
    return cnl;
  }
  if(elem = document.getElementById(idOrName)){
    return elem;
  }
  return false;
};

(function(scope){
  var body = $('listingBody'), i = 0;
  var phoneBook = scope.phoneBook = scope.phoneBook||[];
  var editor = $('editor');
  var updateEditor = function(){
    var first = $('first'), last = $('last'), phone = $('phone');
    if(body.selected){
      editor.style.display = 'block';
      first.value = body.selected.first;
      last.value = body.selected.last;
      phone.value = body.selected.phone||'';
    }else{
      editor.style.display = 'none';
    }
  };

  var addRow = function(monitor, field){
    var tr = document.createElement('tr');
    var td = document.createElement('td');
    var tn = document.createTextNode(monitor[field]);
    tr.appendChild(td);
    td.appendChild(tn);
    monitor.tr = tr;
    Object.observe(monitor, function(updates){
      var i=0, l=updates.length||0;
      td.removeChild(tn);
      tn = document.createTextNode(monitor[field]);
      td.appendChild(tn);
    });
    td.onclick = function(){
      body.selected = monitor;
    };
    body.appendChild(tr);
    body.selected = body.selected||monitor;
  };
  
  var selection;
  Object.defineProperty(body, 'selected', {
    get: function(){
      return selection;
    },
    set: function(row){
      if(row===selection){
        return;
      }
      if(selection){
        selection.tr.className = '';
      }
      selection = row;
      if(selection){
        selection.tr.className = 'selected';
      }
      updateEditor();
    },
    enumerable: true
  });
  
  Object.observe(phoneBook, function(updates){
    var i=0, l=updates.length||0;
    for(i=0;i<l;i++){
      if(updates[i].type==='new'){
        addRow(phoneBook[updates[i].name], 'full');
      }
    }
  });
  
/* for some reason this doesn't work using native Object.observe
  // It does work with the polyfill, so this may be a bug in one or the other
  Object.observe(body, function(updates){
    var i=0, l=updates.length||0;
    for(i=l-1;i>-1;i--){
      if(updates[i].name==='selected'){
        updateEditor();
        i=-1;
      }
    }
  });
//*/

  var Entry = function(first, last){
    var self = this;
    self.first = first;
    self.last = last;
  };
  Object.defineProperty(Entry.prototype, 'full', {
    get: function(){
      return this.last+', '+this.first;
    },
    enumerable: true
  });
  
  var addRecord = function(tmp){
    phoneBook.push(new Entry('First'+tmp, 'Last'));
  };
  
  editor.onsubmit = function(){
    body.selected.first = $('first').value;
    body.selected.last = $('last').value;
    body.selected.phone = $('phone').value;
    return false;
  };
  
  var interval = setInterval(function(){
    addRecord(i++);
    if(i>20){
      clearTimeout(interval);
    }
  }, 100);
})(this);