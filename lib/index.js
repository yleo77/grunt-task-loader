/* jshint -W084 */

var path = require('path');
var fs = require('fs');

var extend = require('./helper').extend;

var config = {
  mapping: {},
  customTasksDir: 'tasks/'
};

var DIR_PREFIX = ['grunt-', 'grunt-contrib-'];
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
    var tpath;
    if(config.mapping && config.mapping[name]) {

      if((tpath = path.resolve(config.mapping[name])) &&
        fs.existsSync(tpath)){
        return factory(name, tpath);
      } else if((tpath = path.join(NPM_ROOT, config.mapping[name])) &&
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

    for (var i = 0, item; item = DIR_PREFIX[i]; i++) {
      var curr = path.join(NPM_ROOT, item + name, 'tasks');
      if (fs.existsSync(curr)) {
        return factory(name, curr);
      }
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
  }
};
