/**
 * Analytic middleware.
 *
 * This middleware is currently tied to Bedlam project. There needs to be a slight
 * refactor if its to be used elsewhere. (Some configuration when injecting it into create store).
 */

import ReactGA from 'react-ga';
import {BOOK_ADD, PAGE_NEXT, PAGE_PREV, PAGE_RANGE, BOOK_TO_START} from '../../../redux/actions/bookActions';
import {CAPTION_OPEN, CAPTION_CLOSE} from '../../../redux/actions/staticAnnotationActions';
import TrackingSchema from '../../../wellcome/TrackingSchema';

class Store {
  static isInit = false;
  static prevAction = null
}

export const ga = (event) => {
  if (process.env.__DEV__) {
    return console.info('[GA]', event);
  }
  if (!Store.isInit) {
    Store.isInit = true;
    ReactGA.initialize('UA-84672230-1');
  }
  return ReactGA.event(event);
};

export const analytics = store => next => action => {
  // You can expand the tracking here, you can listen to any event in the application.
  switch (action.type) {
    case BOOK_ADD:
      ga(TrackingSchema.simplePageLoad(action.meta.startPage, action.meta.coverPages, action.meta.id, window.location.href));
      break;

    case CAPTION_OPEN:
      ga(TrackingSchema.showInfoPanel());
      break;

    case CAPTION_CLOSE:
      ga(TrackingSchema.hideInfoPanel());
      break;

    case PAGE_NEXT:
      ga(TrackingSchema.pageTurnForward());
      break;

    case PAGE_PREV:
      ga(TrackingSchema.pageTurnBack());
      break;

    case BOOK_TO_START:
      ga(TrackingSchema.home());
      break;

    case PAGE_RANGE:
      if (Math.abs(action.meta.from - action.meta.to) > 1 && Store.prevAction !== BOOK_TO_START) {
        ga(TrackingSchema.pageScroll(action.meta.from, action.meta.to));
      }
      break;

    default:
      return next(action);
  }
  // Store previous analytic action.
  Store.prevAction = action.type;
  // Continue.
  return next(action);
};
