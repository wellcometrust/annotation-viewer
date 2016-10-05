// grunt/config/sass.js

module.exports = {

  dev: {
    options: {
      outputStyle: 'expanded',
      sourceMap: true
    },
    files: {
      'build/assets/css/bedlam.css': 'src/scss/bedlam.scss',
      'build/assets/css/quilt.css': 'src/scss/quilt.scss'
    }
  },

  dist: {
    options: {
      outputStyle: 'compressed',
      sourceMap: false
    },
    files: {
      'dist/assets/css/bedlam.css': 'src/scss/bedlam.scss',
      'dist/assets/css/quilt.css': 'src/scss/quilt.scss'
    }
  }

};
