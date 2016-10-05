/**
 * Tracking Schema
 *
 * This will most likely not be able to be used on other projects, but if the schema is similar
 * it can be expanded and used elsewhere. This doesn't call google analytics, but it does offer
 * a mapping to different calls.
 *
 * This pattern will allow other parts of the application (via middleware) to easily send these
 * events using google analytics without knowing about the actual strings sent. It also offers
 * a centralised place to maintain these events without changing application code.
 */

export default class TrackingSchema {

  static getTime() {
    return Math.round(new Date().getTime() / 1000);
  }

  static id;
  static coverPages;

  /** @internal */
  static pageLoad(index, format, institution, identifier, digicode, collection_code, uri) {
    TrackingSchema.id = identifier;
    return TrackingSchema.event('Pageload', `Index: ${index}, Format: ${format}, Institution: ${institution}, Identifier: ${identifier}, Digicode: ${digicode}, Collection code: ${collection_code}, Uri: ${uri}, Time: ${TrackingSchema.getTime()}`);
  }

  static simplePageLoad(index, coverPages, identifier, uri) {
    TrackingSchema.id = identifier;
    TrackingSchema.coverPages = coverPages;
    return TrackingSchema.event('Pageload', `Index: ${index}, Identifier: ${identifier}, Uri: ${uri}, Time: ${TrackingSchema.getTime()}`);
  }

  static showInfoPanel() {
    return TrackingSchema.event('Info panel', `show, Identifier: ${TrackingSchema.id}, Time: ${TrackingSchema.getTime()}`);
  }

  static hideInfoPanel() {
    return TrackingSchema.event('Info panel', `hide, Identifier: ${TrackingSchema.id}, Time: ${TrackingSchema.getTime()}`);
  }

  static pageTurnForward() {
    return TrackingSchema.event('Page turn', `forward, Identifier: ${TrackingSchema.id}, Time: ${TrackingSchema.getTime()}`);
  }

  static pageTurnBack() {
    return TrackingSchema.event('Page turn', `back, Identifier: ${TrackingSchema.id}, Time: ${TrackingSchema.getTime()}`);
  }

  static pageScroll(from, to) {
    return TrackingSchema.event('Page scroll', `From: ${from - TrackingSchema.coverPages}, To: ${to - TrackingSchema.coverPages}, Identifier: ${TrackingSchema.id}, Time: ${TrackingSchema.getTime()}`);
  }

  static timeout(timeout_length) {
    return TrackingSchema.event('Timeout', `Identifier: ${TrackingSchema.id}, Time: ${TrackingSchema.getTime()}, Timelimit: ${timeout_length}`);
  }

  /** @internal */
  static itemLoad(format, institution, identifier, digicode, collection_code, uri) {
    TrackingSchema.id = identifier;
    return TrackingSchema.event('Itemload', `Format: ${format}, Institution: ${institution}, Identifier: ${identifier}, Digicode: ${digicode}, Collection code: ${collection_code}, Uri: ${uri}`);
  }

  static home() {
    return TrackingSchema.event('Home', `Identifier: ${TrackingSchema.id}, Time: ${TrackingSchema.getTime()}`);
  }

  static event(action, label) {
    return {
      category: 'Bedlam Player',
      action,
      label
    };
  }


}
