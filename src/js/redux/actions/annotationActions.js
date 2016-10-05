/**
 * Annotation Actions.
 * ----------------------------------------------------------------------------------------
 *
 * This is for actions that affect the state of the UI displaying the annotations.
 *
 * Currently it supports a very basic implementation of W3C Annotation standard.
 * It does not guard against or work with all implementations of this standard, but
 * can be updated as other examples crop up.
 */

import pointInSvgPolygon from 'point-in-svg-polygon';

export const ACTIVE_ANNOTATION = 'ACTIVE_ANNOTATION';

export const W3C_IMPORT_ANNOTATION = 'W3C_IMPORT_ANNOTATION';

export function setActiveAnnotation(item) {
  return {type: ACTIVE_ANNOTATION, payload: item};
}

export function importAnnotation(annotation) {
  return {
    type: W3C_IMPORT_ANNOTATION,
    payload: annotation
  };
}

function parseAnnotationBody(body) {
  const groups = {};
  for (let item of body) {
    const purpose = item.purpose || 'describing';
    groups[purpose] = groups[purpose] || [];
    groups[purpose].push(item);
  }
  return groups;
}

function addOverlay(id, player, node) {
  node.id = id;
  player.svgOverlay.node().appendChild(node);
  return node;
}

export const pnpoly = ([ x, y ], vector) => {
  // ray-casting algorithm based on
  // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
  let inside = false;
  for (var i = 0, j = vector.length - 1; i < vector.length; j = i++) {
    const xi = vector[i][0];
    const yi = vector[i][1];
    const xj = vector[j][0];
    const yj = vector[j][1];

    var intersect = ((yi > y) != (yj > y))
        && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
};

export const importW3cAnnotations = (list) => (dispatch, getState, player) => {
  for (let item of list) {
    const { id, type, body, target: { source, within, 'sc:naturalAngle': rotation, selector } } = item;
    // @todo if (selector is svg polygon)
    // The SVG Polygon
    const svg = (new DOMParser()).parseFromString(selector.value, "image/svg+xml");
    // The points from the polygon.
    const points = svg.documentElement.firstChild.getAttribute('points');
    // The node appended to the screen for the overlay
    // @todo make new polygon with smaller dimensions (perf)
    const node = addOverlay(id, player, svg.documentElement.firstChild);
    // Polygon points ("1,1 1,2 1,5") to vector ([ [1,1], [1,2], [1,5] ])
    const vector = points
        .trim()
        .split(' ')
        .map(
            (s) => s
                .split(',')
                .map(
                    (i) => parseInt(i)
                )
        );
    // Lists of all X and Y points.
    const xs = [];
    const ys = [];
    for (let point of vector) {
      xs.push(point[0]);
      ys.push(point[1]);
    }
    // Top left corner XY
    const x = Math.min(...xs);
    const y = Math.min(...ys);
    // Height that contains all points.
    const h = Math.max(...ys) - Math.min(...ys);
    const w = Math.max(...xs) - Math.min(...xs);
    // @todo endif.
    dispatch({
      type: W3C_IMPORT_ANNOTATION,
      payload: {
        id,
        type,
        within,
        // @todo use ID for grabbing node instead of storing node in state.
        node,
        body: parseAnnotationBody(body),
        target: {source, x, y, w, h, rotation, vector}
      }
    });
  }
};
