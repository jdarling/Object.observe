/*
  Tested against Chromium build with Object.observe and acts EXACTLY the same,
  though Chromium build is MUCH faster

  Trying to stay as close to the spec as possible,
  this is a work in progress, feel free to comment/update
  
  http://wiki.ecmascript.org/doku.php?id=harmony:observe

  Limits so far;
    Built using polling... Will update again with polling/getter&setters to make things better at some point
*/
if(!Object.observe){
  "use strict";
  (function(extend, global){
    var isCallable = (function(toString){
        var s = toString.call(toString),
            u = typeof u;
        return typeof this.alert === "object" ?
            function(f){
                return s === toString.call(f) || (!!f && typeof f.toString == u && typeof f.valueOf == u && /^\s*\bfunction\b/.test("" + f));
            }:
            function(f){
                return s === toString.call(f);
            }
        ;
    })(extend.prototype.toString);

    var validateArguments = function(O, callback){
      if(typeof(O)!=='object'){
        // Throw Error
        throw new TypeError("Invalid Object");
      }
      if(Object.isFrozen(callback)===true){
        // Throw Error
        throw new TypeError("Invalid Callback");
      }
      if(isCallable(callback)===false){
        // Throw Error
        throw new TypeError("Invalid Callback");
      }
    };

    var Observer = (function(){
      var wraped = [];
      var Observer = function(O, callback){
        validateArguments(O, callback);
        O.getNotifier().addListener(callback);
        if(wraped.indexOf(O)===-1){
          wraped.push(O);
        }else{
          O.getNotifier()._checkPropertyListing();
        }
      };
      
      Observer.prototype.deliverChangeRecords = function(O){
        O.getNotifier().deliverChangeRecords();
      };
      
      wraped.lastScanned = 0;
      setInterval((function(wrapped){
        return function(){
          var i = 0, l = wrapped.length, startTime = new Date(), takingTooLong=false;
          for(i=wrapped.lastScanned; (i<l)&&(!takingTooLong); i++){
            wrapped[i].getNotifier()._checkPropertyListing();
            takingTooLong=((new Date())-startTime)>100; // make sure we don't take more than 100 milliseconds to scan all objects
          }
          wrapped.lastScanned=i<l?i:0; // reset wrapped so we can make sure that we pick things back up
        };
      })(wraped), 100);
      
      return Observer;
    })();
    
    var Notifier = function(watching){
      var _listeners = [], _updates = [], _updater = false, properties = [], values = [];
      var self = this;
      Object.defineProperty(self, '_watching', {
                  get: (function(watched){
                    return function(){
                      return watched;
                    };
                  })(watching)
                });
      var wrapProperty = function(object, prop){
        if(prop==='getNotifier'){
          return false;
        }
        var idx = properties.length;
        properties[idx] = prop;
        values[idx] = object[prop];
        return true;
      };
      self._checkPropertyListing = function(dontQueueUpdates){
        var object = self._watching, keys = Object.keys(object), i=0, l=keys.length;
        var newKeys = [], oldKeys = properties.slice(0), updates = [];
        var prop, queueUpdates = !dontQueueUpdates, propType, value, idx;
        for(i=0; i<l; i++){
          prop = keys[i];
          value = object[prop];
          propType = typeof(value);
          if((idx = properties.indexOf(prop))===-1){
            if(wrapProperty(object, prop)&&queueUpdates){
              self.queueUpdate(object, prop, 'new', null, object[prop]);
            }
          }else{
            if(values[idx] !== value){
              if(queueUpdates){
                self.queueUpdate(object, prop, 'updated', values[idx], value);
              }
              values[idx] = value;
            }
            oldKeys.splice(oldKeys.indexOf(prop), 1);
          }
        }
        if(queueUpdates){
          l = oldKeys.length;
          for(i=0; i<l; i++){
            idx = properties.indexOf(oldKeys[i]);
            self.queueUpdate(object, oldKeys[i], 'deleted', values[idx], null);
            properties.splice(idx,1);
            values.splice(idx,1);
          };
        }
      };
      self.addListener = function(callback){
        var idx = _listeners.indexOf(callback);
        if(idx===-1){
          _listeners.push(callback);
        }
      };
      self.removeListener = function(callback){
        var idx = _listeners.indexOf(callback);
        if(idx>-1){
          _listeners.splice(idx, 1);
        }
      };
      self.listeners = function(){
        return _listeners;
      };
      self.queueUpdate = function(what, prop, type, was, is){
        this.queueUpdates([{
          type: type,
          object: what,
          name: prop,
          oldValue: was//,
          //value: is  not to spec :(
        }]);
      };
      self.queueUpdates = function(updates){
        var self = this, i = 0, l = updates.length||0, update;
        for(i=0; i<l; i++){
          update = updates[i];
          _updates.push(update);
        }
        if(_updater){
          clearTimeout(_updater);
        }
        _updater = setTimeout(function(){
          _updater = false;
          self.deliverChangeRecords();
        }, 100);
      };
      self.deliverChangeRecords = function(){
        var i = 0, l = _listeners.length;
        for(i=0; i<l&&((typeof(_listeners[i])==='function')&&(!_listeners[i](_updates))); i++){
        }
        _updates=[];
      };
      self._checkPropertyListing(true);
    };
    
    extend.prototype.getNotifier = function(){
      var _notifier = new Notifier(this);
      this.getNotifier = function(){
        return _notifier;
      };
      (Object.seal||function(){})(_notifier);
      return _notifier;
    };
    extend.prototype.observe = function(O, callback){
      return new Observer(O, callback);
    };
    extend.prototype.unobserve = function(O, callback){
      validateArguments(O, callback);
      O.getNotifier().removeListener(callback);
    };
  })(Object, this);
}