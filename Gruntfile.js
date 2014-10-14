
module.exports = function(grunt) {

  require('./lib/index.js')(grunt, {
    customTasksDir: 'test'
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

  grunt.registerTask('default', ['jshint', 'custom']);
};
