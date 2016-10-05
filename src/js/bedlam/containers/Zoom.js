/**
 * @ProvidesModule Zoom
 * @deprecated
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { rotateTo, goTo, zoomBy } from '../../redux/actions/viewerActions';
import { setActiveAnnotation } from '../../redux/actions/annotationActions';
import { nextPage, prevPage, turn, toPage } from '../../redux/actions/bookActions';
import ZoomControl from '../components/ZoomControl';

class Zoom extends Component {

  zoomIn() {
    if (this.props.zoom < 0.0008) {
      this.props.dispatch(zoomBy(1.25));
    }
  }
  zoomOut() {
    if (this.props.zoom > 0.0002) {
      this.props.dispatch(zoomBy(0.8));
    }
  }

  render() {
    return (
        <div id="bedlam-player">
          { this.props.book.currentBook ? (
              <div className="player-title">
                Page title { this.props.book.currentPage + 1 } of { this.props.book.totalPages }
              </div>
          ) : null }
          <div className="player-image" id="image"></div>
          <ZoomControl
              zoomInEnabled={ this.props.zoom < 0.0008 }
              zoomOutEnabled={ this.props.zoom > 0.0002 }
              onZoomIn={ this.zoomIn.bind(this) }
              onZoomOut={ this.zoomOut.bind(this) }
          />
          <div className="player-actions">&nbsp;</div>
        </div>
    );
  }

}

function mapStateToProps(store) {

  return {
    zoom: store.viewer.lastKnown.zoom,
    book: store.book
  };
}

export default connect(mapStateToProps)(Zoom);
