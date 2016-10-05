/**
 * Book
 *
 * This is the original Book implementation that is used in Bedlam.
 * It wraps around a IIIF resource and opens up different pieces of the
 * information from the info.json file.
 *
 * Using this as a contract it is possible to create other implementations
 * that will fetch from other resources. (see ImageBook).
 */

class BookPage {

  constructor(data) {
    Object.assign(this, data);
  }

  getWidth() {
    return this.width;
  }

  getThumbnail() {
    // The logic here can be anything, as long as it provides a link to a thumbnail.
    // This is used for speedy-scrubbing through images.
    // This is compatible with non-wellcome resources, but without a thumbnail service
    // it may be slower. Mileage may vary.
    let id;
    if (this.thumbnail) {
      if (this.thumbnail['@id']) {
        return this.thumbnail['@id'];
      }
      return this.thumbnail;
    }
    else if (id = this.getSourceId()) {
      return `${id}/full/64,/0/default.jpg`;
    }
  }

  getSourceId() {
    // Safety first!
    if (
        !this.images[0] ||
        !this.images[0].resource ||
        !this.images[0].resource.service ||
        !this.images[0].resource.service['@id']
    ) {
      return null;
    }
    return this.images[0].resource.service['@id'];
  }

  getSource() {
    // Not found a use for this yet, but if there was a resource
    // That was an aggregation of more than one book, this may be
    // used to get a single one to be used as a pager / master.
    // Note: This gets passed directly to the player (default OSD)
    // so this would need to be a valid resource for that.
    // See ImageBook for another example of this.
    return `${this.getSourceId()}/info.json`;
  }

  fitTo(page) {
    // This is what ensures each page is the same height.
    const height = this.height;
    const width = (this.height / this.width) * page.width;
    return new BookPage({ height, width, ...page });
  }

}

export class Book {

  constructor(data) {
    Object.assign(this, data);

    this.pages = this.sequences[0].canvases.map(page => new BookPage(page));
  }

  setMeta(meta) {
    this.__META__ = meta;
  }

  getPageImage(page) {
    return this.pages[page];
  }
}


export function createBook(url, optimise = true, meta = {}) {
  return fetch(url)
      .then(data => data.json())
      .then(json => new Book(json))
      .then(book => {
        // This is a toggle-able meta section set by the
        // librarian.
        book.setMeta(meta);
        return book;
      })
      .then(book => {
        // This section here will preload all thumbnails
        // This should be used when an application is in a
        // long running Kiosk mode, and won't refresh often.
        // This can use up a lot of memory, and with a poor
        // network on here or on the host will be slow!!
        if (optimise) {
          const images = [];
          for (const page of book.pages) {
            const thumbnail = page.getThumbnail();
            if (thumbnail) {
              images.push(new Promise(resolve => {
                const image = new Image();
                image.src = thumbnail;
                image.onload = e => resolve(e);
              }));
            }
          }
          return Promise.all(images).then(() => book);
        }
        // Since book is already a promise, it is compatible
        // with the above.
        return book;
      })
  ;
}
