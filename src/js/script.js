process.env.__DEV__ = false;

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

