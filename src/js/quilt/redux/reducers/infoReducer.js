import { INFO_PANEL_CLOSE, INFO_PANEL_OPEN, INFO_PANEL_TOGGLE } from '../actions/infoActions';

const default_state = {
  isOpen: false
};

export default function infoReducer(state = default_state, action) {
  switch (action.type) {

    case INFO_PANEL_OPEN:
      console.log('OPEN!');
      return Object.assign({}, state, {
        isOpen: true
      });

    case INFO_PANEL_CLOSE:
      return Object.assign({}, state, {
        isOpen: false
      });

    case INFO_PANEL_TOGGLE:
      return Object.assign({}, state, {
        isOpen: !state.isOpen
      });

  }

  return state;
}
