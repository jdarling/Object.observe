var data = {
  first: 'Some',
  last: 'Person'
};
Object.defineProperty(data, 'full', {
  get: function(){
    return this.last+', '+this.first;
  },
  enumerable: true
});

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

var LabeledView = function(buildIn, data, caption, field){
  var self = this;
  var container = document.createElement('div'),
      lbl = document.createElement('label'),
      span = document.createElement('span'),
      lblCap, spanCap;
  lbl.style.fontWeight  = 'bold';
  container.appendChild(lbl);
  container.appendChild(span);
  var updateFunct = function(){
    self.refresh();
  };
  self.refresh = function(){
    if(lblCap){
      lbl.removeChild(lblCap);
    }
    if(spanCap){
      span.removeChild(spanCap);
    }
    lblCap = document.createTextNode(caption);
    spanCap = document.createTextNode(data[field]);
    lbl.appendChild(lblCap);
    span.appendChild(spanCap);
  };
  self.removeSelf = function(){
    buildIn.removeChild(container);
    Object.unobserve(data, updateFunct);
  };
  buildIn.appendChild(container);
  Object.observe(data, updateFunct);
  self.refresh();
};

var ProperNameView = function(buildIn, data){
  LabeledView.call(this, buildIn, data, 'Full Name: ', 'full');
};

var FirstLastNameView = function(buildIn, data){
  var self = this;
  var c = document.createElement('div'),
      first = new LabeledView(c, data, 'First: ', 'first'),
      last = new LabeledView(c, data, 'Last: ', 'last');
  
  self.refresh = function(){
    first.refresh();
    last.refresh();
  };
  
  buildIn.appendChild(c);
  self.refresh(data);
};

var AllInfoView = function(buildIn, data){
  var self = this, keys = Object.keys(data), i=0, l=keys.length, watchers = {};
  var friendlyNames = {
    first: 'First Name: ',
    last: 'Last Name: ',
    full: 'Proper Name: '
  };
  var div, key;
  var addViewOf = function(key){
    switch(typeof(data[key])){
      case('object'):
      case('function'):
        break;
      default:
        div = document.createElement('div');
        var lv = new LabeledView(div, data, friendlyNames[key]||(key+': '), key);
        buildIn.appendChild(div);
        watchers[key]=div;
        div.removeSelf = function(){
          var self = this;
          self.parentNode.removeChild(self);
          lv.removeSelf();
        };
    }
  };
  for(i=0; i<l; i++){
    addViewOf(keys[i]);
  }
  Object.observe(data, function(updates){
    var i=0, l=updates.length;
    for(i=0; i<l; i++){
      switch(updates[i].type){
        case('new'):
          addViewOf(updates[i].name);
          break;
        case('deleted'):
          var div = watchers[updates[i].name];
          if(div){
            //buildIn.removeChild(div);
            div.removeSelf();
            delete watchers[updates[i].name];
          }
          break;
      }
    }
  });
};

(function(){
  var applyView = function(containerType, viewType){
    var containers = $(containerType), i, l=containers.length||1, container, j;
    for(i = 0; i<l; i++){
      container=containers[i]||containers;
      j = container.childElementCount-1;
      for(; j>=0; j--){
        container.removeChild(container.children[j]);
      }
      new viewType(container, data);
    }
  };
  var updateLog = $('updateLog');
  Object.observe(data, function(updates){
    var i = 0, l = updates.length, update, entry, p;
    for(i=0; i<l; i++){
      update = updates[i];
      entry = [update.name, update.type, update.oldValue, '-->', update.object[update.name]].join(' ');
      p = document.createElement('p');
      p.appendChild(document.createTextNode(entry));
      p.className = 'entry';
      updateLog.appendChild(p);
    }
  });
  applyView('proper', ProperNameView);
  applyView('firstlast', FirstLastNameView);
  applyView('all', AllInfoView);
  $('dataUpdater').onsubmit = function(){
    data.first = $('first').value;
    data.last = $('last').value;
    return false;
  };
  $('addTest').onclick = function(){
    data['Another Property'] = 'Some value';
    return false;
  };
  $('deleteTest').onclick = function(){
    delete data['Another Property'];
    return false;
  };
  $('first').value = data.first;
  $('last').value = data.last;
  data["New Property"] = 'test';
})();
