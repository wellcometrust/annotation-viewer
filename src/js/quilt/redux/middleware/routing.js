import { JOURNEY_GO_TO, JOURNEY_NEXT, JOURNEY_PREV, JOURNEY_START, JOURNEY_READY, startJourneyAt } from '../../redux/actions/journeyActions';
import { IMAGE_READY_STATE } from '../../../redux/actions/viewerActions';

function push(hash) {
  if (history.pushState) {
    history.pushState(null, null, `#${hash}`);
  }
  else {
    location.hash = `#${hash}`;
  }
}

function getHash() {
  if (window.location.hash) {
    return parseInt(window.location.hash.substring(1), 10);
  }
}

export const routing = store => next => action => {
  const state = store.getState().journey;
  const anno_state = store.getState().annotations;
  // You can expand the tracking here, you can listen to any event in the application.
  switch (action.type) {
    case JOURNEY_READY:
      const hash = getHash();
      if (hash && hash != -1 && anno_state.items[hash]) {
        store.dispatch(startJourneyAt(hash, anno_state.items.length));
      }
      break;

    case JOURNEY_GO_TO:
      push(action.payload.index);
      break;

    case JOURNEY_NEXT:
      push(state.isActive ? (state.currentIndex === (state.totalItems - 1) ? 0 : state.currentIndex + 1) : null);
      break;

    case JOURNEY_PREV:
      push(state.isActive ? (state.currentIndex === 0 ? 0 : state.currentIndex - 1) : null);
      break;

    case JOURNEY_START:
      push(action.payload.startAt || 0);
      break;

  }
  return next(action);
};
