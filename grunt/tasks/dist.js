// grunt/tasks/dist.js

module.exports = function(grunt) {
  grunt.registerTask('dist', ['assemble:dist', 'scsslint', 'sass:dist','postcss:dist', 'browserify:dist', /*'accessibility',*/ 'groc', 'modernizr:dist', 'copy:dist', 'copy:quilt_file', 'copy:quilt_assets', 'browserSync:dist']);
};
