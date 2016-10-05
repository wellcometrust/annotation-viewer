/**
 * Viewer Reducer
 *
 * This is the state for the viewer, it is synced FROM the viewer implementation and
 * relies on events bound to whatever viewer implementation that's been set up.
 *
 * This file serves as a 'contract' for UI builders so whatever state is in here can be
 * used for displaying a user interface.
 */

import {
    PAN_TO,
    ZOOM_TO,
    ROTATE_BY,
    ROTATE_TO,
    LAST_KNOWN_POSITION,
    IMAGE_LOADING_STATE,
    IMAGE_READY_STATE,
    WORLD_CLICK
} from '../actions/viewerActions';


const default_click = {
  webPoint: null,
  viewportPoint: null,
  imagePoint: null
};
const default_state = {
  rotation: 0,
  lastKnown: {
    x: 0,
    y: 0
  },
  lastClick: default_click,
  lastPress: default_click,
  lastDoubleClick: default_click,
  minZoom: 0,
  isLoading: false
};

export default function viewerReducer(state = default_state, action) {
  let degrees = 0;
  if (action.payload && action.payload.degrees) {
    degrees = action.payload.degrees;
    while (degrees < 0) {
      degrees += 360;
    }
  }

  switch (action.type) {

    case IMAGE_LOADING_STATE:
      return Object.assign({}, state, {
        isLoading: true
      });

    case WORLD_CLICK:
      return Object.assign({}, state, {
        lastClick: action.payload.quick ? {
          webPoint: action.payload.webPoint,
          viewportPoint: action.payload.viewportPoint,
          imagePoint: action.payload.imagePoint
        } : state.lastClick,
        lastPress: action.payload.quick ? state.lastPress : {
          webPoint: action.payload.webPoint,
          viewportPoint: action.payload.viewportPoint,
          imagePoint: action.payload.imagePoint
        },
        lastDoubleClick: action.payload.double ? {
          webPoint: action.payload.webPoint,
          viewportPoint: action.payload.viewportPoint,
          imagePoint: action.payload.imagePoint
        } : state.lastDoubleClick
      });

    case IMAGE_READY_STATE:
      return Object.assign({}, state, {
        isLoading: false,
        minZoom: action.payload.minZoom
      });

    case LAST_KNOWN_POSITION:
      return Object.assign({}, state, {
        lastKnown: {
          x: action.payload.x,
          y: action.payload.y,
          zoom: action.payload.zoom
        }
      });

    case PAN_TO:
      return Object.assign({}, state, {
        x: action.payload.x,
        y: action.payload.y
      });

    case ZOOM_TO:
      return Object.assign({}, state, {
        zoom: action.payload.zoom
      });

    case ROTATE_BY:
      return Object.assign({}, state, {
        rotation: (state.rotation + action.payload.degrees) % 360
      });

    case ROTATE_TO:
      return Object.assign({}, state, {
        rotation: degrees % 360
      });

    default:
      return state;
  }
}
