/**
 * Annotation Actions.
 *
 * This is for actions that affect the state of the UI displaying the annotations.
 */

export const ACTIVE_STATIC_ANNOTATION = 'ACTIVE_STATIC_ANNOTATION';
export const ADD_STATIC_ANNOTATIONS = 'ADD_STATIC_ANNOTATIONS';
export const ADD_STATIC_CAPTION = 'ADD_STATIC_CAPTION';

export const CAPTION_OPEN = 'CAPTION_OPEN';
export const CAPTION_CLOSE = 'CAPTION_CLOSE';

export function openCaption() {
  return {type: CAPTION_OPEN};
}

export function closeCaption() {
  return {type: CAPTION_CLOSE};
}

export function setActiveAnnotation(item) {
  return {type: ACTIVE_STATIC_ANNOTATION, payload: item};
}

export function addBookAnnotations(items) {
  return {type: ADD_STATIC_ANNOTATIONS, payload: items };
}

export function addBookCaption(item) {
  return {type: ADD_STATIC_CAPTION, payload: item };
}
