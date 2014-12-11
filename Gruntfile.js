
module.exports = function(grunt) {

  require('./lib/index.js')(grunt, {
    customTasksDir: 'test/',

    mapping: {
      taskA: 'ultraman/',
      taskB: 'ultraman/frog.js'
    }
  });

  grunt.initConfig({

    jshint: {
      all: [
        './lib/*.js'
      ],
      options: {
        jshintrc: './.jshintrc'
      }
    }
  });

  grunt.registerTask('default', ['jshint', 'custom', 'taskA', 'taskB']);
};
