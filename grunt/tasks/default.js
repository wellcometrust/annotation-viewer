// grunt/tasks/default.js

module.exports = function(grunt) {
  grunt.registerTask('default', ['assemble:dev', 'scsslint','sass:dev', 'postcss:dev', 'browserify:dev', 'modernizr:dev', 'copy:dev', 'browserSync:dev', 'watch']);
};
