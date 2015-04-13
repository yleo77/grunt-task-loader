# grunt-task-loader

[![Build Status](https://travis-ci.org/yleo77/grunt-task-loader.svg)](https://travis-ci.org/yleo77/grunt-task-loader)  [![NPM version](https://badge.fury.io/js/grunt-task-loader.svg)](http://badge.fury.io/js/grunt-task-loader)

**Speed up task loading** and **load npm grunt tasks automatically**

### Before:

```js
// gruntfile.js
module.exports = function(grunt) {

  // configure tasks

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-...');
  grunt.loadTasks('foo');
  grunt.loadTasks('bar');
  grunt.loadTasks('...');
}
```

### After:

```js
// gruntfile.js
module.exports = function(grunt) {

  require('grunt-task-loader')(grunt);

  // configure tasks
}
```

### Sample time output before:

```js
// output by time-grunt
Execution Time (2014-10-14 07:32:26 UTC)
loading tasks  6.7s  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 98%
reset           130ms  ▇▇ 2%
Total 6.83s
```

### Sample time output after:

```js
Execution Time (2014-10-14 07:33:32 UTC)
loading tasks  156ms  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 52%
loading reset   14ms  ▇▇▇ 5%
reset           130ms  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 43%
Total 318ms
```

## Install

```bash
npm install grunt-task-loader --save-dev
```

## Usage

#### Simple:

```js
// Must go at the top of your gruntfile, before the task config.
require('grunt-task-loader')(grunt);
```

#### With Options:

```js
require('grunt-task-loader')(grunt, {
  customTasksDir: '__CUSTOM_DIR__',   // or ['__CUSTOM_DIR__'],
  mapping: {
    taskA: 'another_tasks_dirs/', // custom task 'taskA' from custom tasks directory (load by grunt.loadTasks API)
    taskB: 'ultraman/frog.js',    // custom task from file
    cachebreaker: 'grunt-cache-breaker' // taskname mapping to package-name. will look in node_modules.
  }
});
```

## Options

#### customTasksDir
- Type: `string`,`array`
- Default: `[]`

#### mapping
- Type: `object`
- Default: `{}`

Key is the grunt task name (as referenced in grunt config for that task), and value is the name of that task's package as it can be found in the filesystem.

##### mappingExample:

```js
require('grunt-task-loader')(grunt, {
  mapping: {
    express: 'grunt-express-server'
  }
});
```

#### convertCamelCase
- Type: `boolean`
- Default: `true`

Automatically handles grunt tasks whose task names
have been defined in `camelCase` while their package names are in `param-case`
(this could also be handled per-task in custom mappings).
Examples: [ngAnnotate](https://github.com/mzgol/grunt-ng-annotate), [includeSource](https://github.com/jwvdiermen/grunt-include-sourceincludeSource), etc.

<br><br>
See **Gruntfile.js** for more live examples.

<br><br>
### Help: task not found
grunt-task-loader optimizes task loading by only loading the tasks needed for the current task list, instead of loading all of the 'grunt-' prefixed tasks in the package.json.
To do this, it reads the task names from the grunt config.  Sometimes, grunt task authors give the grunt task a name that doesn't correspond to the npm package they publish the plugin under.
Example:
`grunt-express-server` is configured with:

```js
grunt.initConfig({
  express: { // not express-server
    // options
  }
});
```

So in this case, pass the name mapping in the options argument to grunt-task-loader:
```js
require('grunt-task-loader')(grunt, {
  mapping: {
    express: 'grunt-express-server'
  }
});
```
You can also submit a PR to add this name mapping to the plugin defaults.

Package names that are simply prefixed with 'grunt-' or 'grunt-contrib-' are automatically handled, and so are mappings like `ngAnnotate` to `grunt-ng-annotate`, if `convertCamelCase` is `true`.


## License

MIT
