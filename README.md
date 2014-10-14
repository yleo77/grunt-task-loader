# grunt-task-loader  

[![Build Status](https://travis-ci.org/yleo77/grunt-task-loader.svg)](https://travis-ci.org/yleo77/grunt-task-loader)  [![NPM version](https://badge.fury.io/js/grunt-task-loader.svg)](http://badge.fury.io/js/grunt-task-loader)

A task loader for **Speed up Load Task** and **Autoload Task** for Grunt. 

In most case Gruntfile.js is looks like this.

```javascript
grunt.loadNpmTasks('grunt-contrib-uglify');
grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.loadNpmTasks('grunt-contrib-cssmin');
grunt.loadNpmTasks('grunt-contrib-watch');
grunt.loadNpmTasks('grunt-contrib-...');
grunt.loadNpmTasks('grunt-contrib-...');
grunt.loadTasks('foo');
grunt.loadTasks('bar');
grunt.loadTasks('...');
grunt.loadTasks('...');
// and others tasks.
```

When you run `grunt jshint` in cli, Grunt load **All Tasks** writen in Gruntfile.js, But in fact We don't need these tasks except *jshint* task.

The result is that it spent too much time at **Load Tasks** period.

For example

```
// output by time-grunt
Execution Time (2014-10-14 07:32:26 UTC)
loading tasks  6.7s  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 98%
reset           130ms  ▇▇ 2%
Total 6.83s
```

With **grunt-task-loader**, you can collapse that down to the following one-liner. it should looks like this:

```javascript
// Gruntfile.js
module.exports = function(grunt) {
    
  require('grunt-task-loader')(grunt);
  
  grunt.initConfig({
    //...
  });
  
  // Remove grunt.loadNpmTasks and grunt.loadTasks calls.
};
```
*Note: be sure to put it at the top position.*

ALL DONE. 

After requiring the plugin, it will autoload the task that you really use.

Now you can check how long it takes for tasks. Far faster is the result, especially you have lots of grunt tasks.

```
Execution Time (2014-10-14 07:33:32 UTC)
loading tasks  156ms  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 52%
loading reset   14ms  ▇▇▇ 5%
reset           130ms  ▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇▇ 43%
Total 318ms
```



## Install

```
npm install grunt-task-loader --save-dev
```

## Usage 

just put code into your Gruntfile.js

```
// First argument: the grunt instance. **required**.
// Second argument: {Object} options, Optional. If your task in a custom dir, you should set it.
require('grunt-task-loader')(grunt, {
  // customTasksDir: '__CUSTOM_DIR__'
});
```


## License

MIT
