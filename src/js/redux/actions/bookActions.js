/**
 * Book Actions
 *
 * These control the navigation through a book, through pages and at different orientations.
 */

import _ from 'lodash';
import { addImageSource, resetWorld, goHome, IMAGE_LOADING_STATE } from './viewerActions';

export const BOOK_ADD = 'BOOK_ADD';
export const BOOK_TO_PAGE = 'BOOK_TO_PAGE';
export const BOOK_TO_START = 'BOOK_TO_START';

// The values of these constants are quite important!
// Amount of pages to move by when flipping.
// Amount of pages that are on screen.
// Page number for first page.
// etc..
export const ORIENTATION_LANDSCAPE = 2;
export const ORIENTATION_PORTRAIT = 1;

export const PAGE_NEXT = 'PAGE_NEXT';
export const PAGE_PREV = 'PAGE_PREV';
export const PAGE_RANGE = 'PAGE_RANGE';

let orientation = ORIENTATION_PORTRAIT;
export function getOrientation() {
  return orientation;
  // @todo fix bugs with loading of thumbnails side by side before re-enabling this.
  // return Math.abs(window.orientation) === 90 ? ORIENTATION_LANDSCAPE : ORIENTATION_PORTRAIT;
}

export function getBookFromState(state) {
  return state.book.currentBook;
}

/**
 * State machine
 *
 * This is a performance tweak that will stop the PAGE_RANGE event
 * being fired more than once per second. This was for GA event
 * tracking.
 *
 * It is not the most elegant design, and breaks the rules. Could use
 * some TLC to improve.
 */

class State {
  static from;
}

const setSourcePage = _.debounce((from) => {
  State.from = from;
}, 1000, {
  leading: true,
  trailing: false
});

const setTargetPage = _.debounce((dispatch, to) => {
  if (State.from !== parseInt(to, 10)) {
    dispatch({ type: PAGE_RANGE, meta: { from: State.from, to } });
  }
}, 900, {
  leading: false,
  trailing: true
});

export const toPage = (page) => (dispatch, state, viewer) => {
  if (
      page !== state().book.startPage &&
      state().book.currentPage === page
  ) return;
  // Set `from` with debounce of 1s
  setSourcePage(state().book.currentPage);
  // Set `to` with debounce of 0.9s
  setTargetPage(dispatch, page);
  // Add loading state.
  dispatch({ type: IMAGE_LOADING_STATE });
  // Reset world to begin with
  dispatch(resetWorld());
  // Grab orientation and book object.
  const orientation = getOrientation();
  const book = getBookFromState(state());
  // add first page (imageSource).
  const firstPage = book.getPageImage(page);
  dispatch(addImageSource(firstPage.getSource(), 0, 0, firstPage.getWidth()));
  // If we are in landscape, and not on the cover page...
  if (orientation === ORIENTATION_LANDSCAPE && page !== 0) {
    // add second page (imageSource with offset)
    const secondPage = firstPage.fitTo(book.getPageImage(page + 1));
    dispatch(addImageSource(secondPage.getSource(), firstPage.getWidth(), 0, secondPage.getWidth()));
  }
  // dispatch updated page number
  dispatch({ type: BOOK_TO_PAGE, payload: { page } }); // Reducer will then update annotation based on this event.
};

export const nextPage = () => (dispatch, state) => {
  dispatch({ type: PAGE_NEXT });
  // We only move one page regardless if we are on the cover.
  if (state().book.currentPage === 0) {
    dispatch(toPage(1));
  } else {
    // Move one or two pages depending on orientation.
    dispatch(toPage(state().book.currentPage + getOrientation()));
  }
};

export const prevPage = () => (dispatch, state) => {
  dispatch({ type: PAGE_PREV });
  // If we are on the second page, or first page
  if (state().book.currentPage <= 1) {
    // Go to first page.
    dispatch(toPage(0));
  } else {
    // Go to previous page.
    dispatch(toPage(state().book.currentPage - getOrientation()));
  }
};

// Go back to start.
export const resetToStart = () => (dispatch, state) => {
  dispatch({ type: BOOK_TO_START });
  dispatch(toPage(state().book.startPage));
};

// Add book, wrapped up in a promise.
export const addBook = (bookPro, startPage = 0, coverPages = 1) => (dispatch) => {
  Promise.resolve(bookPro)
      .then((book) => {
        dispatch({ type: BOOK_ADD, payload: { book, startPage, coverPages }, meta: book.__META__ });
      })
      .then(() => {
        dispatch(toPage(startPage));
        // Remove once reset is done.
        // dispatch(resetAfterSeconds(10));
      })
  ;
};

export function turn() {
  orientation = orientation === ORIENTATION_LANDSCAPE ? ORIENTATION_PORTRAIT : ORIENTATION_LANDSCAPE;
  // Remove the below for device..
  // @todo see orientation above for explanation.
  // const orientation = getOrientation();

  return (dispatch, state) => {
    if (state().book.currentPage === 0) {
      dispatch(toPage(0));
    } else {
      // This will figure out which pages are to be loaded based on orientation.
      // Can't remember how it works!
      dispatch(toPage((Math.ceil(state().book.currentPage / orientation) * orientation) - (orientation - 1)));
    }
  };
}

// @todo Again another use-case for global state, this should be moved to a redux-friendly approach.
let timeout;
export function resetAfterSeconds(seconds) {
  // Clear timeout
  // Set timeout
  // Reset in timeout
  // Create new resetAfterSeconds(x) in timeout fn.
  return (dispatch, state) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      dispatch(resetToStart());
      dispatch(resetAfterSeconds(seconds));
    }, seconds * 1000);
  };
}
