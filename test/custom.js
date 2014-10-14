
module.exports = function(grunt) {

  grunt.registerTask('custom', 'this\'s a custom task', function() {
    console.log('bingo');
  });
};
