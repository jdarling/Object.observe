[![Build Status](https://travis-ci.org/jdarling/Object.observe.svg?branch=master)](https://travis-ci.org/jdarling/Object.observe)

Other Options
=============

MaxArt2501 has started his own Object.observe polyfill, and a look at his commit history and reasoning makes me think it will probably be well supported.  If your looking for an Object.observe solution you should take a look at https://github.com/MaxArt2501/object-observe

Needs a maintainer
==================

I'd like to find someone who is willing to take this library over.  I've had no time to work with and/or maintain the library.  Honestly I have little need for Object.observe making it hard to justify time spent against it.

So, if your using this shim, feel comfortable with the code, and would like to maintain it, let me know.

If your curious why I don't have much use for the library, this http://markdalgleish.github.io/presentation-a-state-of-change-object-observe/ pretty well sums it up.  I worked in native development when two way data binding caused all sorts of issues with application development, and I see the same coming out of Object.observe at the end of the day.

Hopefully, someone will want to maintain this work in the future.

Oh, and if you take it over, feel free to relicense it within reason as it seems no one likes unlicense :).  Also feel free to follow up on the polyfill-service integration if you so see fit (https://github.com/Financial-Times/polyfill-service/pull/81#issuecomment-66382432).

Object.observe Polyfill/shim
============================
Thanks to my new job I have a lot more time to devote to things like this library.  It has gone a REALLY long time without updates and there is a lot that can be done to make it more functional.  I hope to be spending more time on it soon, but for now I've fixed all the bugs that I know of and have been reported.  Thanks to everyone for their reports, and keep them coming if you find one.

Started as GIST: https://gist.github.com/4173299

Tested against Chromium build with Object.observe and acts EXACTLY the same for the basics, though Chromium build is MUCH faster.

Trying to stay as close to the spec as possible, this is a work in progress, feel free to comment/update

http://wiki.ecmascript.org/doku.php?id=harmony:observe

TODO
----

The spec has changed a lot since I origionally wrote this, need to go back and add in a lot of things like custom update types and other fun.  For now though it seems to suffice.

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

Testing
-------

To run the tests first make sure you have Node.js installed.  Then use NPM to install Karam and all dependencies:

```
npm install
```

Finally run the tests with:

```
npm test
```

Planned Updates
---------------
  For FireFox using Proxies will result in better performance.  Will look into this more.

Examples and Usage
------------------
  See examples folder

Latest Updates
--------------

    * Memory leak fixed with PR #16
    * Tests added to project thanks to mikeb1rd also part of PR #16
    * Added Notifier.notify() with custom types support by klimlee
    * Added accept list support by klimlee
    * Stopped monitoring DOM nodes, Canary can't do it and neither should the shim.
    * Added in support for setImmediate if it is available.
    * Memory leak fix by Moshemal
    * Array length now reports as an update when it changes
    * Added enumerable flag to defineProperty
