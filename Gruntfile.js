
module.exports = function(grunt) {

  require('./lib/index.js')(grunt, {

    // customTasksDir: 'test/', // string
    customTasksDir: ['test/', 'another_custom/'],    // array

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
