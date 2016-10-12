/**
 * App
 *
 * This should compose components in a logical manner that is reusable by replacing each
 * component separately per-project. The viewer injected must match the actions that are
 * configured in the viewerActions. The same for the annotations, where actions may be
 * added in the future.
 */

import AnnotationHandler from './AnnotationHandler';
import { addTiledImage, addOverlay, bindEvents } from '../redux/actions/viewerActions';

export default class Wellcome {

  constructor(manifestUrl, viewer, createStore, ConfiguredView, Annotation = AnnotationHandler) {
    // Create the store passing the viewer.
    this.store = createStore(viewer);
    // Bind the events for the viewer.
    this.dispatch(bindEvents());
    // Get manifests.
    this.manifest = this.getManifest(manifestUrl);
    this.annotations = this.getAnnotations(this.manifest);
    // Create annotation handler.
    this.annotationHandler = new Annotation(this.annotations, this.store);
    // Generate view model.
    const viewModel = this.annotationHandler.getViewModel();
    // Create view.
    this.view = new ConfiguredView(viewModel, this.store);
  }

  getManifest(manifestUrl) {
    // @todo unstub.
    return manifestUrl;
  }

  getAnnotations(manifest) {
    // @todo unstub.
    return {stubbed: 'annotations list', manifest};
  }

  dispatch(...props) {
    return new Promise((r) => {
      const frame = () => r(this.store.dispatch(...props));
      if (window.requestAnimationFrame) {
        requestAnimationFrame(frame);
      } else {
        setTimeout(frame, 16);
      }
    });
  }

  subscribe(...props) {
    return this.store.subscribe(...props);
  }

  renderImage(manifest) {
    this.dispatch(addTiledImage(manifest || this.manifest));
  }

  mountTo(id) {
    this.view.mountComponent(id);
  }

}
