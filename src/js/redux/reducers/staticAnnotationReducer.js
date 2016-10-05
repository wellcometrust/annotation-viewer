import * as Actions from '../actions/staticAnnotationActions';
import { BOOK_TO_PAGE } from '../actions/bookActions';

const default_state = {
  selected: null,
  caption: null,
  list: {}
};

export default function staticAnnotationReducer(state = default_state, action) {
  switch (action.type) {

    case Actions.ACTIVE_STATIC_ANNOTATION:
      return Object.assign({}, state, {
        selected: action.payload
      });

    case Actions.ADD_STATIC_CAPTION:
      return Object.assign({}, state, {
        caption: action.payload
      });

    case Actions.ADD_STATIC_ANNOTATIONS:
      return Object.assign({}, state, {
        list: action.payload
      });

    case BOOK_TO_PAGE:
      return Object.assign({}, state, {
        selected: state.list[parseInt(action.payload.page, 10)] || null
      });

    default:
      return state;

  }
}
