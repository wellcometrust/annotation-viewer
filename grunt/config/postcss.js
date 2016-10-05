// grunt/config/postcss.js

module.exports = {
  options: {

    processors: [
      require('pixrem')(), // add fallbacks for rem units
      require('autoprefixer')({browsers: 'last 2 versions'}), // add vendor prefixes
      require('cssnano')({safe: true}) // minify the result, only use safe options
    ]
  },
  dev: {
    map: true,
    src: 'build/assets/css/*.css'
  },

  /* stylelint
  lint: {
    options: {
      processors: [
        require("stylelint")( { syntax: 'scss' } ),
        require("postcss-reporter")({ clearMessages: true })
      ]
    },
    src: 'src/scss/**\/*.scss'
  },
  */

  dist: {
    map: false,
    src: 'dist/assets/css/*.css'
  }
}
