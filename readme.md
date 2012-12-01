Object.observe Polyfill/shim
============================
Started as GIST: https://gist.github.com/4173299

Tested against Chromium build with Object.observe and acts EXACTLY the same, though Chromium build is MUCH faster.

Trying to stay as close to the spec as possible, this is a work in progress, feel free to comment/update

http://wiki.ecmascript.org/doku.php?id=harmony:observe

Limits so far
--------------
  Built using polling in combination with getter&setters.  This means that if you do something quick enough it won't get caught.
  
  Example:
```js
var myObject = {};
Object.observe(myObject, console.log);
myObject.foo = "bar";
delete myObject.foo;
```

  The observer function would never see the addition of foo since it was deleted so quickly.

Planned Updates
---------------
  For FireFox using Proxies will result in better performance.  Will look into this more.
  
Examples and Usage
------------------
  See examples folder
  
Latest Updates
--------------
Updated to use getters and setters since these result in more reliable and faster updates for known properties.

Fixed some inconsistancies between Chromium special build and this polyfill:
  * Calculated properties don't get watched (https://mail.mozilla.org/pipermail/es-discuss/2012-August/024759.html)
  * Moved getNotifier to Object.getNotifier()
  * Updated exception messages to match