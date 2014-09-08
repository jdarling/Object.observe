'use strict';

var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

var pathToModule = function(path) {
    return path.replace(/^\/base\//, '../').replace(/\.js$/, '');
};

// start require auto stubbing

function test(name, exceptions, callback) {

    describe(name, function() {

        var context = {},
            definitions = [];

        beforeEach(function(done) {

            definitions = [];

            require.onResourceLoad = function(resourceContext) {

                var resourceName;

                for (resourceName in resourceContext.defined) {
                    if (resourceName.substr(-5) != '.test' && definitions.indexOf(resourceName) == -1) {
                        definitions.push(resourceName);
                    }
                }
            };

            require([name].concat(exceptions), function() {

                // require.onResourceLoad has now filled the definitions array
                delete require.onResourceLoad;

                var i;

                for (i = 0; i < definitions.length; i++) {

                    if (definitions[i].substr(-5) != '.test') {

                        require.undef(definitions[i]);

                        if (definitions[i] != name && exceptions.indexOf(definitions[i]) == -1) {
                            define(definitions[i], [], function() {
                                return sinon.stub();
                            });
                        }
                    }
                }

                require(definitions, function() {

                    for (i = 0; i < definitions.length; i++) {
                        context[definitions[i]] = arguments[i];
                    }

                    done();
                });
            });
        });

        afterEach(function() {

            var name,
                i;

            for (name in context) {
                delete context[name];
            }

            for (i = 0; i < definitions.length; i++) {
                require.undef(definitions[i]);
            }

            definitions = [];
        });

        callback.call(null, function(name) {

            if (!context.hasOwnProperty(name)) {
                context[name] = sinon.stub();
            }

            return context[name];
        });
    });
}

// end require auto stubbing

Object.keys(window.__karma__.files).forEach(function(file) {
    if (TEST_REGEXP.test(file)) {
        // Normalize paths to RequireJS module names.
        allTestFiles.push(pathToModule(file));
    }
});

require.config({

    // Karma serves files under /base, which is the basePath from your config file
    baseUrl: '/base/lib',

    // dynamically load all test files
    deps: allTestFiles,

    // we have to kickoff mocha, as it is asynchronous
    callback: window.__karma__.start,

    paths: {
        'd3': '../ext/d3',
        'cassowary': '../ext/cassowary',
        'moment': '../ext/moment',
        'moment-timezone': '../ext/moment-timezone-with-data'
    }
});
