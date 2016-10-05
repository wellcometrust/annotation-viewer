/**
 * ImageBook
 *
 * This is a flat file version of the previous book. It takes an array
 * of images and makes a book! It shows the interoperability of components.
 */

class ImageBookPage {

  constructor(data) {
    this.height = data.height;
    this.width = data.width;
    this.url = data.url;
  }

  getWidth() {
    return this.width;
  }

  getSource() {
    return { type: 'image', url: this.url, tileWidth: this.width, tileHeight: this.height };
  }

  fitTo(page) {
    const height = this.height;
    const width = (this.height / this.width) * page.width;
    return new ImageBookPage({ height, width, ...page });
  }


}

export class ImageBook {

  constructor(pages) {
    this.pages = pages.map(page => new ImageBookPage(page));
  }

  getPageImage(page) {
    return this.pages[page];
  }
}


export function createImageBook(pages) {
  return new ImageBook(pages);
}
