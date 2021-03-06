/* global OpenSeadragon */
/* eslint new-cap: 0 */
import 'OpenSeadragon';
import 'whatwg-fetch';
import { library } from './library';
import View from './View';
import Wellcome from '../wellcome/Wellcome';
import createStore from './redux/createStore';

process.env.__DEV__ = false;

const app = new Wellcome(
    'https://wellcomelibrary.org/iiif-img/b21001455-0/629a5524-0345-48a7-a5b6-524f0db88cbf/info.json',
    OpenSeadragon({
      id: 'player',
      defaultZoomLevel: 0,
      animationTime: 0.8,
      blendTime: 0,
      constrainBound: true,
      minPixelRatio: 0.5,
      visibilityRatio: 1.0,
      constrainDuringPan: true,
      showSequenceControl: false,
      showNavigationControl: false,
      showZoomControl: false,
      showHomeControl: false,
      showFullPageControl: false
    }),
    createStore,
    View
);

app.dispatch(
    library.checkOut(window.current_book || 'Inferno', true)
);

app.mountTo(document.getElementById('drawer'));

