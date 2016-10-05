/**
 * Librarian
 *
 * This is the composer of the Bedlam player. You set up the Librarian with
 * information about all the books in your collection, and then the librarian
 * will provide redux actions for you to dispatch for viewing each book.
 *
 * This covers the following logic:
 *  - Knowing the different between image number X and page X
 *  - Matching captions to books
 *  - Matching annotations to pages
 *
 *  This is one of the human friendly objects that, alongside Quill, will allow
 *  the composition of very similar projects to use the Bedlam player.
 */

import _ from 'lodash';
import { addBook } from '../redux/actions/bookActions';
import { addBookAnnotations, addBookCaption } from '../redux/actions/staticAnnotationActions';
import { createImageBook } from './ImageBook';
import { createBook } from './Book';

export default class Librarian {

  constructor(books) {
    this.books = books;
  }

  checkOut(book_name, caption = false, annotations = false) {
    if (!this.books[book_name]) return {};
    const coverPages = this.books[book_name].coverPages || 1;
    const startPage = this.books[book_name].page ? (this.books[book_name].page + coverPages) : 0;
    return (dispatch) => {
      // This is the meta data about the book, extracted from the information provided.
      // This can be expanded and used in other places in the application.
      // Information here should affect the presentation, but not the behaviour.
      const meta = { id: book_name, caption, coverPages, startPage, annotations };
      dispatch(addBook(createBook(this.books[book_name].book, false, meta), startPage, coverPages));
      if (annotations) {
        // This is where page-by-page annotations are added.
        dispatch(this.annotate(book_name));
      }
      if (caption) {
        // This is where page-by-page captions are added.
        dispatch(this.caption(book_name));
      }
    };
  }

  caption(book_name) {
    return addBookCaption(this.books[book_name].caption);
  }

  annotate(book_name) {
    const input_annotations = this.books[book_name].annotations;
    const output_annotations = {};
    // This is some logic to aid in composition of books to the librarian.
    for (const annotation_key of Object.keys(input_annotations)) {
      // This allows annotation object keys to be human readable "4 to 10"
      const [from, to] = annotation_key.split(' to ');
      const annotation = input_annotations[annotation_key];
      // We need to add each annotation to each page.
      // This might use more memory, but makes it easier for the
      // Application to just "show the current page annotation"
      // Instead of having to check all ranges.
      for (const page of _.range(from, parseInt(to, 10) + 1)) {
        if (!output_annotations[page]) {
          output_annotations[page] = annotation;
        } else {
          // This is an immutable array push (eqv. output_annotations[page].push(annotation))
          output_annotations[page] = [...output_annotations[page], annotation];
        }
      }
    }
    return addBookAnnotations(output_annotations);
  }

}
