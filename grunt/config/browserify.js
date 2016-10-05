// grunt/config/browserify.js

module.exports = {
  dev: {
    options: {
       transform: [['babelify', {presets: ['es2015', 'react', 'stage-0'], plugins: ["syntax-async-functions","transform-regenerator"]}]]
    },
    src: ['src/js/dev.js'],
    dest: 'build/assets/js/script.js'
  },

  dist: {
    options: {
       transform: [['babelify', {presets: ['es2015', 'react', 'stage-0'], plugins: ["syntax-async-functions","transform-regenerator"]}]]
    },
    src: ['src/js/script.js'],
    dest: 'dist/assets/js/script.js'
  }
}
