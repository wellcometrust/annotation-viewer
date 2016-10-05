/**
 * Book Reducer
 *
 * This is where we record the state of the book.
 */

import * as c from '../actions/bookActions';

const default_state = {
  currentBook: null,
  currentPage: 0,
  startPage: 0
};

export default function bookReducer(state = default_state, action) {
  switch (action.type) {

    case c.BOOK_ADD:
      return Object.assign({}, state, {
        currentBook: action.payload.book,
        startPage: parseInt(action.payload.startPage, 10),
        currentPage: parseInt(action.payload.startPage, 10),
        coverPages: parseInt(action.payload.coverPages, 10),
        totalPages: parseInt(action.payload.book.pages.length, 10)
      });

    case c.BOOK_TO_PAGE:
      return Object.assign({}, state, {
        currentPage: parseInt(action.payload.page, 10)
      });


    default:
      return state;

  }
}
