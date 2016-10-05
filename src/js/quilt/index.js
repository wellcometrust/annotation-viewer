/* global OpenSeadragon */
/* eslint new-cap: 0 */
import 'OpenSeadragon';
import 'whatwg-fetch';
import View from './View';
import Wellcome from '../wellcome/Wellcome';
import annotations from './w3annotations.json';
import { importW3cAnnotations } from '../redux/actions/annotationActions';
import createStore from './redux/createStore';

const app = new Wellcome(
    'https://dlcs.io/iiif-img/4/21/quilt/info.json',
    OpenSeadragon({
      id: 'player',
      defaultZoomLevel: 0,
      animationTime: 0.8,
      blendTime: 0,
      constrainDuringPan: true,
      showSequenceControl: false,
      showNavigationControl: false,
      showZoomControl: false,
      showHomeControl: false,
      showFullPageControl: false,
      gestureSettingsMouse:   { scrollToZoom: true,  clickToZoom: false,  dblClickToZoom: false, pinchToZoom: false, flickEnabled: false, flickMinSpeed: 120, flickMomentum: 0.25, pinchRotate: true },
      gestureSettingsTouch:   { scrollToZoom: false, clickToZoom: false, dblClickToZoom: false, pinchToZoom: true,  flickEnabled: true,  flickMinSpeed: 120, flickMomentum: 0.25, pinchRotate: true },
      gestureSettingsPen:     { scrollToZoom: false, clickToZoom: false,  dblClickToZoom: false, pinchToZoom: false, flickEnabled: false, flickMinSpeed: 120, flickMomentum: 0.25, pinchRotate: true },
      gestureSettingsUnknown: { scrollToZoom: false, clickToZoom: false, dblClickToZoom: false, pinchToZoom: true,  flickEnabled: true,  flickMinSpeed: 120, flickMomentum: 0.25, pinchRotate: true },
    }),
    createStore,
    View
);

// Import annotations
app.dispatch(importW3cAnnotations(annotations.items));

// Render the image.
app.renderImage();

// Mount to screen.
app.mountTo(document.getElementById('drawer'));

