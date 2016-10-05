import {
    JOURNEY_GO_TO,
    JOURNEY_START,
    JOURNEY_EXIT,
    JOURNEY_DETAIL_OPEN,
    JOURNEY_DETAIL_CLOSE,
    JOURNEY_DETAIL_TOGGLE,
    JOURNEY_NEXT,
    JOURNEY_PREV
} from '../actions/journeyActions';

const default_state = {
  isActive: false,
  expanded: true,
  totalItems: 0,
  currentIndex: null
};

export default function journeyReducer(state = default_state, action) {
  switch (action.type) {

    case JOURNEY_START:
      return Object.assign({}, state, {
        isActive: action.payload.totalItems !== 0,
        totalItems: action.payload.totalItems,
        currentIndex: action.payload.startAt || 0
      });

    case JOURNEY_GO_TO:
      return Object.assign({}, state, {
        currentIndex: action.payload.index
      });

    case JOURNEY_NEXT:
      return Object.assign({}, state, {
        currentIndex: state.isActive ? (state.currentIndex === (state.totalItems - 1) ? 0 : state.currentIndex + 1) : null
      });

    case JOURNEY_PREV:
      return Object.assign({}, state, {
      currentIndex: state.isActive ? (state.currentIndex === 0 ? 0 : state.currentIndex - 1) : null
      });

    case JOURNEY_DETAIL_OPEN:
      return Object.assign({}, state, {
        expanded: true
      });

    case JOURNEY_DETAIL_CLOSE:
      return Object.assign({}, state, {
        expanded: false
      });

    case JOURNEY_DETAIL_TOGGLE:
      return Object.assign({}, state, {
        expanded: !state.expanded
      });

    case JOURNEY_EXIT:
      return default_state;
  }

  return state;
}
