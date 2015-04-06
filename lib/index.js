/* jshint -W084 */

var path = require('path');
var fs = require('fs');

var helper = require('./helper');

var config = {
  mapping: {
    // add more known differences in common plugins
    express: 'grunt-express-server',
  },
  customTasksDir: [],
  convertCamelCase: true
};

// For most case, searching plugin in `DIR_PREFIX` is enough.
// So, split the opportunity of searching the two kinds of dirs
var DIR_PREFIX = ['grunt-', 'grunt-contrib-'];
// scoped package prefix
var SCOPED_PREFIX = '@';
var NPM_ROOT = path.resolve('./node_modules/');

module.exports = function(grunt, options) {

  options = options || {};

  if (options.customTasksDir) {
    options.customTasksDir = helper.arrayify(options.customTasksDir);
  }

  helper.extend(config, options);
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
    // priority: mapping > convertCamelCase > custom > npm grunt plugin
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

    if (config.convertCamelCase) {
      name = name.replace(/([a-z])([A-Z])/g, '$1-$2');
    }

    if (config.customTasksDir.length) {

      result = config.customTasksDir.some(function(relpath) {
        tpath = path.join(path.resolve(relpath), name);
        if (fs.existsSync(tpath)) {
          return factory(name, tpath);
        } else if (fs.existsSync(tpath + '.js')) {
          return factory(name, tpath + '.js');
        }
        return false;
      });

      if (result) {
        return true;
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
    grunt.log.writeln(('Warning: Task "' + name + '" not found.').red);
    grunt.log.writeln(('Are you sure that task exists?\n').yellow);
    grunt.log.writeln(('If the task name is correct, then this could be a grunt-task-loader issue.').yellow);
    grunt.log.writeln(('This is easy to fix: https://github.com/yleo77/grunt-task-loader/blob/master/README.md#help-task-not-found').yellow);
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
