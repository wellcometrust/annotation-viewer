// grunt/config/copy.js

module.exports = {
  dev: {
    expand: true,
    cwd: 'src/asset-files',
    src: ['**'],
    dest: 'build/assets'
  },

  dist: {
    expand: true,
    cwd: 'src/asset-files',
    src: ['**'],
    dest: 'dist/assets'
  },

  quilt_file: {
    expand: true,
    cwd: 'dist',
    src: ['quilt.html'],
    dest: 'quilt/index.html',
  },
  quilt_assets: {
    expand: true,
    cwd: 'dist/assets',
    src: ['**'],
    dest: 'dist/quilt/assets',
  },
};
