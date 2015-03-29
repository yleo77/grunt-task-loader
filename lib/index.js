/* jshint -W084 */

var path = require('path');
var fs = require('fs');

var extend = require('./helper').extend;

var config = {
  mapping: {},
  customTasksDir: 'tasks/'
};

// For most case, searching plugin in `DIR_PREFIX` is enough.
// So, split the opportunity of searching the two kinds of dirs
var DIR_PREFIX = ['grunt-', 'grunt-contrib-'];
// scoped package prefix
var SCOPED_PREFIX = '@';
var NPM_ROOT = path.resolve('./node_modules/');

module.exports = function(grunt, options) {

  extend(config, options || {});

  if (config.customTasksDir) {
    config.customTasksDir = path.resolve(config.customTasksDir);
  }

  var run = grunt.util.task.Task.prototype.run;

  grunt.util.task.Task.prototype.run = function() {
    var args = [].slice.call(arguments, 0);
    this.parseArgs(arguments).forEach((function(item) {
      var taskname = item.split(':')[0];
      if (!this._tasks[taskname]) {
        load(taskname);
      }
    }).bind(this));
    run.apply(this, args);
  };

  function load(name) {
    // priority: mapping > custom > npm grunt plugin
    var tpath,
      result;
    if (config.mapping && config.mapping[name]) {

      if ((tpath = path.resolve(config.mapping[name])) &&
        fs.existsSync(tpath)) {
        return factory(name, tpath);
      } else if ((tpath = path.join(NPM_ROOT, config.mapping[name])) &&
        fs.existsSync(tpath)) {
        return factory(name,
          fs.existsSync(tpath + '/tasks') ? (tpath + '/tasks') : tpath
        );
      }
    }

    if (config.customTasksDir) {
      tpath = path.join(config.customTasksDir, name);
      if (fs.existsSync(tpath)) {
        return factory(name, tpath);
      } else if (fs.existsSync(tpath + '.js')) {
        return factory(name, tpath + '.js');
      }
    }

    result = search(NPM_ROOT, name);
    if (result) {
      return true;
    }

    result = fs.readdirSync(NPM_ROOT).some(function(subpath) {

      return (subpath.indexOf(SCOPED_PREFIX) !== 0) ? false :
        search(path.join(NPM_ROOT, subpath), name);
    });

    if (result) {
      return true;
    }

    // send a message with grunt's warning style and exit
    grunt.log.writeln(('Warning: Task "' + name + '" not found.').yellow);
    grunt.log.writeln().fail('Aborted due to warnings.');
    grunt.util.exit(0);

    function factory(name, tpath) {

      // cache task info
      var _nameArgs = grunt.task.current.nameArgs;
      var _write = grunt.log._write;

      grunt.task.current.nameArgs = 'loading ' + name;
      if (!grunt.option('verbose')) {
        grunt.log._write = function() {};
      }
      grunt.log.header('Loading "' + name + '" plugin');
      grunt.log._write = _write;

      fs.statSync(tpath).isFile() ?
        require(tpath)(grunt, grunt) :
        grunt.loadTasks(tpath);

      grunt.task.current.nameArgs = _nameArgs;

      return true;
    }

    function search(abspath, name) {
      if (arguments.length === 1) {
        name = abspath;
        abspath = NPM_ROOT;
      }
      return DIR_PREFIX.some(function(item) {
        var curr = path.join(abspath, item + name, 'tasks');
        if (fs.existsSync(curr)) {
          return factory(name, curr);
        }
        return false;
      });
    }
  }
};
