process.env.__DEV__ = false;
require("babel-polyfill");

switch (window.wellcome_application) {
  case 'bedlam':
    require('./bedlam');
    break;
  case 'quilt':
    require('./quilt');
    break;
  default:
    console.error('unknown application');
}
