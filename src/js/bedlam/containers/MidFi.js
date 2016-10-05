/**
 * @ProvidesModule MidFi
 *
 * @deprecated
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { rotateTo, goTo, zoomBy } from '../../redux/actions/viewerActions';
import { setActiveAnnotation } from '../../redux/actions/annotationActions';
import { getPath } from '../../Util';

import { nextPage, prevPage, turn, toPage } from '../../redux/actions/bookActions';
import SliderControl from '../components/SliderControl';
import ZoomControl from '../components/ZoomControl';
import PageTitle from '../components/PageTitle';
import Trackpad from '../components/Trackpad';
import PlayerImage from '../components/PlayerImage';
import Hammer from 'hammerjs';
import _ from 'lodash';

class MidFi extends Component {

  constructor() {
    super();
    this.state = {
      debugOpen: true,
      isActive: false
    };
  }

  zoomIn() {
    if (this.props.zoom < 0.0008) {
      this.props.dispatch(zoomBy(1.25));
    }
  }

  zoomOut() {
    if (this.props.zoom >= this.props.minZoom) {
      this.props.dispatch(zoomBy(0.8));
    }
  }

  nextPage() {
    this.props.dispatch(nextPage());
  }

  prevPage() {
    this.props.dispatch(prevPage());
  }

  goToPage(page) {
    this.props.dispatch(toPage(page));
  }

  turn() {
    this.props.dispatch(turn());
  }

  componentWillReceiveProps(newProps) {
    if (
        this.state.isActive &&
        newProps.minZoom > newProps.zoom
    ) {
      this.setState({isActive: false});
    }
  }

  getAnnotations() {
    const [annotation_title, ...annotation_paragraphs] = this.props.selected;

    return (
        <div className="player-annotations" id="annotation">
          <a href={ this.state.act ? '#annotation' : '#image' }
             className={ this.state.act ? 'action-toggle' : 'action-toggle action-toggle--active' }
             onClick={ () => this.setState({ act: !this.state.act }) }>
            <div className="action-toggle__left-line"></div>
            <div className="action-toggle__right-line"></div>
          </a>
          <div className="player-annotations__title">{ annotation_title }</div>
          <div className="player-annotations__content">
            { annotation_paragraphs.map((Content, k) => {
              if (_.isString(Content)) {
                return <p key={k}>{Content}</p>;
              }
              return <Content key={k}/>;
            }) }
          </div>

        </div>
    );
  }

  render() {
    const { selected } = this.props;
    if (!this.props.book.currentBook) {
      return (
          <PlayerImage
              isLoading={ this.props.isLoading }
              src={ this.props.thumbnail }
          />
      );
    }
    return (
        <div id="bedlam-player">
          <Trackpad
              onPress={() => {
              this.setState({ isActive: true });
              this.zoomIn();
            }}
              onSwipeLeft={ () => this.nextPage() }
              onSwipeRight={ () => this.prevPage() }
              style={{ display: this.state.isActive ? 'none' : 'block' }}/>
          { /* Component: PlayerTitle */ }
          { /* <PageTitle>
           Page title { parseInt(this.props.book.currentPage, 10) + 1 } of { this.props.book.totalPages }
           </PageTitle> */ }
          { /* Component: PlayerImage */ }
          <PlayerImage
              isLoading={ this.props.isLoading }
              src={ this.props.thumbnail }
          />
          <ZoomControl
              zoomInEnabled={ this.props.zoom < 0.0008 }
              zoomOutEnabled={ this.props.zoom > this.props.minZoom }
              onZoomIn={ this.zoomIn.bind(this) }
              onZoomOut={ this.zoomOut.bind(this) }
          />
          { /* Component: PlayerActions */ }
          <div className="player-actions">
            <div className="player-actions__inline-label">
              { this.props.book.currentPage } of { this.props.book.totalPages - 1 }
            </div>
            <SliderControl value={ this.props.book.currentPage }
                           max={ this.props.book.totalPages - 1 }
                           onChange={ (e) => this.goToPage(e.target.value) }/>
            { /* Component: PlayerNavigation */ }
            <div className="player-actions__navigation">
              { this.props.book.currentBook.pages[this.props.book.currentPage - 1] ? (
                  <a href={ `#/page/${this.props.book.currentPage - 1}` } onClick={ this.prevPage.bind(this) }
                     className="player-actions__prev-page">
                    <img className="player-actions__navigation-icon" alt="previous page"
                         src={ getPath('img/left.svg') }/>
                  </a>
              ) : null }
              { (this.props.book.currentPage + 1) < this.props.book.totalPages ? (
                  <a href={ `#/page/${this.props.book.currentPage + 1}` } onClick={ this.nextPage.bind(this) }
                     className="player-actions__next-page">
                    <img className="player-actions__navigation-icon" alt="next page" src={ getPath('img/right.svg') }/>
                  </a>
              ) : (
                  <a href="#/page/0" onClick={ () => this.goToPage(0) } className="player-actions__next-page">
                    <span className="player-actions__navigation-text">start</span>
                  </a>
              )}
            </div>
          </div>
          { /* Component: PlayerHint */ }
          { /* <a href="#annotation" className="player-hint">Click to find out more</a> */ }
          { /* Component: Annotation */ }
          { selected === null || this.getAnnotations() }
        </div>
    );
  }

}

function mapStateToProps(store) {
  let currentPage;
  let thumbnail;
  if (store.book.currentBook && store.book.currentPage) {
    currentPage = store.book.currentBook.pages[store.book.currentPage];
    thumbnail = currentPage.getThumbnail();
  }
  return {
    rotation: parseInt(store.viewer.rotation, 10),
    x: store.viewer.lastKnown.x,
    y: store.viewer.lastKnown.y,
    isLoading: store.viewer.isLoading,
    zoom: store.viewer.lastKnown.zoom,
    annotations: store.staticAnnotations.list,
    selected: store.staticAnnotations.selected || store.staticAnnotations.caption,
    book: store.book,
    minZoom: store.viewer.minZoom,
    currentPage,
    thumbnail
  };
}

export default connect(mapStateToProps)(MidFi);
