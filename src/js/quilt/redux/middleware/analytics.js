/**
 * Analytic middleware.
 *
 * This middleware is currently tied to Quilt project.
 */

import ReactGA from 'react-ga';
import TrackingSchema from '../../../wellcome/TrackingSchema';
import {JOURNEY_START, JOURNEY_EXIT, JOURNEY_NEXT, JOURNEY_PREV} from '../actions/journeyActions';
import {WORLD_CLICK} from '../../../redux/actions/viewerActions';

class Store {
  static isInit = false;
  static prevAction = null;
  static prevId = null;
  static prevIndex = null;
}

export const ga = (event) => {
  if (process.env.__DEV__) {
    if (!event) {
      console.warn('[GA] Empty Event', event);
    }
    return console.info('[GA]', event);
  }
  if (!Store.isInit) {
    Store.isInit = true;
    TrackingSchema.setCategory('Quilt');
    ReactGA.initialize('UA-55614-6');
  }
  if (event) {
    return ReactGA.event(event);
  }
};

export const analytics = store => next => action => {
  // You can expand the tracking here, you can listen to any event in the application.
  switch (action.type) {

    case JOURNEY_START:
      // If journey was started via a click and not the same as current.
      if (Store.prevAction === WORLD_CLICK && Store.prevId !== action.payload.startAt) {
        ga(TrackingSchema.uriEvent('Story click', window.location.href, action.payload.startAt));
        Store.prevId = action.payload.startAt;
      }
      break;

    case JOURNEY_NEXT:
      const previousIndex = store.getState().journey.currentIndex;
      if (previousIndex && previousIndex !== Store.prevIndex) {
        ga(TrackingSchema.uriEvent('Right scroll', window.location.href, previousIndex));
        Store.prevIndex = previousIndex;
      }
      break;

    case JOURNEY_PREV:
      if (store.getState().journey.currentIndex) {
        ga(TrackingSchema.uriEvent('Left scroll', window.location.href, store.getState().journey.currentIndex));
      }
      break;

    case JOURNEY_EXIT:
      ga(TrackingSchema.uriEvent('View full', window.location.href, store.getState().journey.currentIndex));
      break;

  }
  // Store previous analytic action.
  Store.prevAction = action.type;
  // Continue.
  return next(action);
};
