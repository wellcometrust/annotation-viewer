// grunt/config/browsersync.js

module.exports = {
  options: {
    configFile: 'eslint.json'
  },
  target: ['NO/src/js/**/*.js', '!src/js/vendor/**/*.js']
}
