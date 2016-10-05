// grunt/tasks/dist.js

module.exports = function(grunt) {
  grunt.registerTask('dist', ['assemble:dist', 'scsslint', 'sass:dist','postcss:dist', 'browserify:dist', 'accessibility', 'groc', 'modernizr:dist', 'copy:dist', 'browserSync:dist']);
};