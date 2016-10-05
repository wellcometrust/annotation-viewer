/**
 * Annotation Reducer
 * ----------------------------------------------------------------------------------------
 * This is where we record the state of the annotations. This will include adding the
 * annotations initially and also recording the state when the annotations are being
 * viewed.
 */

import { ACTIVE_ANNOTATION, W3C_IMPORT_ANNOTATION } from '../actions/annotationActions';

const default_state = {
  selected: {
    describing: []
  },
  bodyTaxonomy: {},
  items: []
};

// This will take the W3C annotations and parse them into lists of purposes.
// Was built for tags, but will take any purpose that is a text value and
// store them in a key value. The key is the purpose (tagging) and the value
// is the amount of items in the store that has them.
function parseBodyTaxonomy(purposes, body) {
  for (let key in body) {
    if (body.hasOwnProperty(key)) {
      const items = body[key];
      for (let item of items) {
        if (item.purpose && item.type === 'TextualBody') {
          purposes[item.purpose] = purposes[item.purpose] || new Map();
          if (purposes[item.purpose].has(item.value)) {
            purposes[item.purpose].set(item.value, purposes[item.purpose].get(item.value)+1);
          } else {
            purposes[item.purpose].set(item.value, 1);
          }
        }
      }
    }
  }
  return purposes;
}

export default function annotationReducer(state = default_state, action) {
  switch (action.type) {

    case ACTIVE_ANNOTATION:
      return Object.assign({}, state, {
        selected: action.payload
      });

    case W3C_IMPORT_ANNOTATION:
      return Object.assign({}, state, {
        items: [...state.items, action.payload ],
        bodyTaxonomy: parseBodyTaxonomy(state.bodyTaxonomy, action.payload.body)
      });

    default:
      return state;

  }
}
