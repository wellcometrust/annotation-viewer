/**
 * Viewer Actions
 *
 * This contains actions exposed to the application to control the viewer. This allows the
 * viewer itself to be independent. This should be the only file that mutates the player.
 *
 * Where possible any new mutations should also record state in the reducer passing the
 * relevant information in the action.
 *
 * @todo Hijack OpenSeaDragon mouse events and pass them through here. This will allow replay of actions against OSD.
 */

import 'OpenseaDragon';
import {Overlay} from '../../lib/openseadragon-svg';
/* global OpenSeadragon */
export const ADD_OVERLAY = 'ADD_OVERLAY';
export const ROTATE_BY = 'ROTATE_BY';
export const ZOOM_TO = 'ZOOM_TO';
export const ZOOM_BY = 'ZOOM_BY';
export const PAN_TO = 'PAN_TO';
export const LAST_KNOWN_POSITION = 'LAST_KNOWN_POSITION';
export const ROTATE_TO = 'ROTATE_TO';
export const ADD_TILED_IMAGE = 'ADD_TILED_IMAGE';
export const WORLD_RESET = 'WORLD_RESET';
export const WORLD_CLICK = 'WORLD_CLICK';
export const WORLD_DBL_CLICK = 'WORLD_DBL_CLICK';
export const VIEWPORT_HOME = 'VIEWPORT_HOME';

export const IMAGE_LOADING_STATE = 'IMAGE_LOADING_STATE';
export const IMAGE_READY_STATE = 'IMAGE_READY_STATE';

function lastKnownPosition(x, y, zoom = null) {
  // Records basic information from OSD events.
  return {type: LAST_KNOWN_POSITION, payload: {x, y, zoom}};
}

const updateLastKnown = () => (dispatch, state, player) => {
  const { x, y } = player.viewport.getCenter();
  const zoom = player.viewport.getZoom();
  // @todo find a way to move this to a configuration value.
  // START BC BREAK
  if (zoom > state().viewer.minZoom) {
    player.panHorizontal = true;
    player.panVertical = true;
  } else {
    player.panHorizontal = false;
    player.panVertical = false;
  }
  // END BC BREAK
  dispatch(lastKnownPosition(x, y, zoom));
};

export const worldClick = (e, double = false) => (dispatch, state, player) => {
  // The canvas-click event gives us a position in web coordinates.
  var webPoint = e.position;
  // Convert that to viewport coordinates.
  var viewportPoint = player.viewport.pointFromPixel(webPoint);
  // Convert from viewport coordinates to image coordinates.
  var imagePoint = player.viewport.viewportToImageCoordinates(viewportPoint);
  // Dispatch.
  dispatch({
    type: WORLD_CLICK,
    payload: {
      quick: e.quick,
      double: double,
      webPoint,
      viewportPoint,
      imagePoint
    }
  });
};

export const worldDoubleClick = (e) => {
  return worldClick(e, true);
};

export const bindEvents = () => (dispatch, state, player) => {
  // Update on some events.
  player.addHandler('canvas-drag-end', () => dispatch(updateLastKnown()));
  player.addHandler('zoom', () => dispatch(updateLastKnown()));
  player.addHandler('canvas-click', (e) => dispatch(worldClick(e)));
  player.addHandler('canvas-double-click', (e) => dispatch(worldDoubleClick(e)));
  // Add overlay
  // @todo hide behind config, not used on bedlam.
  player.svgOverlay = player.svgOverlay || new Overlay(player);
  // Update to start with.
  dispatch(updateLastKnown());
};

function asyncAddTile(player, args) {
  // This is a wrapper around OSD to bring it inline with the rest of the application.
  return new Promise((success, err) => {
    try {
      player.addTiledImage.call(player, {success, ...args});
    } catch (e) {
      err(e);
    }
  });
}

export const goHome = () => (dispatch, state, player) => {
  // Same functionality as home button on vanilla OSD.
  player.viewport.goHome(true);
  dispatch({type: VIEWPORT_HOME});
};

export const resetWorld = () => (dispatch, state, player) => {
  // Will remove all tile sources.
  player.world.removeAll();
  dispatch({type: WORLD_RESET});
};

export const addImageSource = (tileSource, x, y, width, height) => (dispatch, state, player) => {
  dispatch({type: IMAGE_LOADING_STATE});
  asyncAddTile(player, {tileSource, x, y, width, height})
      .then(() => {
        dispatch({type: ADD_TILED_IMAGE, payload: {tileSource, width, x, y, width, height}});
        // START BC BREAK
        player.panHorizontal = false;
        player.panVertical = false;
        // END BC BREAK
      })
      .then(() => {
        dispatch(goHome());
        setTimeout(() => {
          const minZoom = player.viewport.getZoom();
          player.minZoomLevel = minZoom;
          dispatch({type: IMAGE_READY_STATE, payload: {minZoom}});
        }, 500);
      })
  ;
};


export const addTiledImage = (image) => (dispatch, state, player) => {
  player.open(image);
  dispatch({type: ADD_TILED_IMAGE, payload: {image}});
};

export const addOverlay = (element, height, width, x = 0, y = 0) => (dispatch, state, player) => {
  player.addOverlay({
    element,
    location: player.viewport.imageToViewportRectangle(
        new OpenSeadragon.Rect(0, 0, width, height)
    )
  });
  dispatch({type: ADD_OVERLAY, payload: {element, height, width, x, y}});
};

export const rotateTo = (degrees) => (dispatch, state, player) => {
  player.viewport.setRotation(degrees);
  dispatch({type: ROTATE_TO, payload: {degrees}});
};

export const rotateBy = (degrees) => (dispatch, state, player) => {
  // Not found a use case for this, but works.
  player.viewport.setRotation(degrees);
  dispatch({type: ROTATE_BY, payload: {degrees}});
};

export const zoomTo = (zoom, refPoint = null, immediately = false) => (dispatch, state, player) => {
  player.viewport.zoomTo(zoom, refPoint, immediately);
  dispatch({type: ZOOM_TO, payload: {zoom, refPoint}});
};

export const zoomReset = (refPoint = null, immediately = false) => (dispatch, state, player) => {
  dispatch(zoomTo(player.minZoomLevel));
  setTimeout(() => {
    player.viewport.applyConstraints();
  }, 250);
};

export const zoomBy = (zoom, refPoint = null, immediately = false) => (dispatch, state, player) => {
  player.viewport.zoomBy(zoom, refPoint, immediately);
  dispatch({type: ZOOM_BY, payload: {zoom, refPoint}});
};

export const panTo = (x, y) => (dispatch, state, player) => {
  player.viewport.panTo(new OpenSeadragon.Point(x, y));
  dispatch({type: PAN_TO, payload: {x, y}});
};

export const goToRect = (x, y, w, h, deg = null) => (dispatch, state, player) => {
  // @todo change 0 degrees to be the actual degrees and calculate new x,y corodinates by
  // @todo By rotating around centroid co-ordinates to get bounding box.
  const selectHighlight = player.viewport.imageToViewportRectangle(new OpenSeadragon.Rect(x, y, w, h, 0));
  if (deg !== null) {
    dispatch(rotateTo(deg));
  }
  player.viewport.fitBounds(selectHighlight);
};

export const goTo = (x, y, zoom, deg = null) => (dispatch, state, player) => {
  dispatch(panTo(x, y));
  dispatch(zoomTo(zoom));
  if (deg) {
    dispatch(rotateTo(deg));
  }
};
