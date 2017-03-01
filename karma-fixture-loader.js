(function(exports) {
    var fixturesPath = 'fixture/';
    var loaded = false;

    var fixtures = {
        get: getFixture,
        getFirst: getFirst,
        getFiltered: getFilteredFixture,
        load: load,
        setPath: setPath,
        _cache: {}
    };

    /**
     * Get a fixture from the preloaded cache of data fixtures
     * @param {String} name A fixture name, like "Content.json"
     */
    function getFixture(name) {
        if (name in fixtures._cache === false || typeof fixtures._cache[name] !== 'object') {
            throw new Error('Missing fixture: ' + name);
        }

        return JSON.parse(JSON.stringify(fixtures._cache[name]));
    }

    /**
     * Returns the first item in the array of objects declared
     * in a fixture
     */
    function getFirst(name) {
        var fixtures = getFixture(name);
        return Array.isArray(fixtures) ? fixtures[0] : fixtures;
    }

    /**
     * Gets a list of objects in a fixture, filtering the items with a
     * given function
     */
    function getFilteredFixture(name, filterFn) {
        return getFixture(name).filter(filterFn);
    }

    function loadFixture(name, done) {
        if (!name) {
            throw new Error('Invalid fixture file!');
        }

        var request = new XMLHttpRequest();

        request.onload = function() {
            var json;

            try {
                json = JSON.parse(request.responseText);
            } catch (e) {}

            fixtures._cache[name] = json || null;
            done();
        };

        // karma base path + fixtures path + actual file name
        request.open('GET', 'base/' + fixturesPath + name);
        request.send(null);
    }

    /**
     * Loads all fixture files before tests
     */
    function load(done) {
        if (loaded) {
            return done();
        }

        var index = -1;

        // get fixture list from file list loaded by karma
        var fixtureFiles = Object.keys(window.__karma__.files).filter(function(file) {
            return file.slice(-5) === '.json' && file.indexOf(fixturesPath) !== -1;
        });

        if (!fixtureFiles.length) {
            console.warn('No fixtures to load were found');
            return done();
        }

        fixtureFiles = fixtureFiles.map(function(file) {
            return file.split(fixturesPath)[1];
        });

        function next() {
            index++;

            if (index === fixtureFiles.length) {
                loaded = true;
                return done();
            }

            var name = fixtureFiles[index];

            loadFixture(name, next);
        }

        next();
    }

    function setPath(path) {
        // remove leading slash
        if (path.charAt(0) === '/') {
            path = path.slice(1);
        }

        fixturesPath = path;

        // add trailing slash
        if (fixturesPath.slice(-1) !== '/') {
            fixturesPath += '/';
        }
    }

    exports.fixtures = fixtures;

})(typeof module !== 'undefined' && module.exports || this);
