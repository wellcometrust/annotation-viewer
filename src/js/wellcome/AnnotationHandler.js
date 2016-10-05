/**
 * @deprecated Please use normal redux for storing and processing annotations.
 */
export default class AnnotationHandler {

  constructor(annotations, store) {
    this.annotations = annotations;
    this.store = store;
    // @todo dispatch(addOverlay) for d3.
    // @todo populate store with annotations.
  }

  dispatch(...props) {
    this.store.dispatch(...props);
  }

  getState(...props) {
    this.store.getState(...props);
  }

  getViewModel() {

  }

}
