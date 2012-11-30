Object.observe Polyfill/shim
============================
Started as GIST: https://gist.github.com/4173299

Tested against Chromium build with Object.observe and acts EXACTLY the same, though Chromium build is MUCH faster.

Trying to stay as close to the spec as possible, this is a work in progress, feel free to comment/update

http://wiki.ecmascript.org/doku.php?id=harmony:observe

Limits so far
--------------
  Built using polling... Will update again with polling/getter&setters to make things better at some point

Examples and Usage:
-------------------
  See examples folder