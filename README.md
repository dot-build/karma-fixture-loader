# JSON Fixture loader for Karma

In Unit Testing it's a common practice to have fixture files with a content that serves as replacement for real implementations (e.g a backend, a 3rd party API...).

This little module loads your JSON files and provides a simple way to access them in your unit tests.

## Usage

Create a folder in your project somewhere. A common place would be `test/fixture`.

Now open your `karma.conf.js` (Karma configuration) and add the loader script and the fixture files to the file list:

```
// ...
files: [
    // ...

    require.resolve('karma-fixture-loader'),

    {
        // notice the fixture path here
        pattern: 'test/fixture/*.json',
        watched: true,
        served: true,
        included: false
    }
]

```

Your JSON fixtures are now available in your tests via Ajax.

Now, add another file to your project that will configure the module and load your files:

__Vanilla JS with Jasmine:__

```js

// path to your fixtures
window.fixtures.setPath('text/fixture');

beforeAll(function(done) {
    fixtures.load(done);
});

```

__ES6 and Jasmine:__

```js
import { fixtures } from 'karma-fixture-loader';

// path to your fixtures
fixtures.setPath('test/fixture');

beforeAll(done => fixtures.load(done));

export { fixtures }
```

## API

### Fixture.get('filename.json') => Object

Returns an Object parsed from a file called "filename.json" in your fixture folder

```
var users = fixtures.get('users.json');
```

### Fixture.getFirst('filename.json') => Object

If the same fixture above is an array, returns the first item in this array.

```
var bob = fixtures.getFirst('users.json');
```

