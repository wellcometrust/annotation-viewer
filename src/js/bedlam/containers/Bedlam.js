/**
 * @ProvidesModule Bedlam
 *
 * @todo split more of the components out.
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Hammer from 'hammerjs';
import _ from 'lodash';

import { getPath } from '../../Util';
import { rotateTo, goTo, zoomBy, zoomReset } from '../../redux/actions/viewerActions';
import { setActiveAnnotation } from '../../redux/actions/annotationActions';
import { nextPage, prevPage, turn, toPage, resetToStart } from '../../redux/actions/bookActions';
import {openCaption, closeCaption} from '../../redux/actions/staticAnnotationActions';
import SliderControl from '../components/SliderControl';
import ZoomControl from '../components/ZoomControl';
import PageTitle from '../components/PageTitle';
import Trackpad from '../components/Trackpad';
import PlayerImage from '../components/PlayerImage';

class Bedlam extends Component {

  constructor() {
    super();
    this.state = {
      debugOpen: true,
      isActive: false,
      isTouch: ('ontouchstart' in document.documentElement)
    };
  }

  resetZoom() {
    this.props.dispatch(zoomReset());
  }

  zoomIn() {
    if (this.props.zoom < 0.0008) {
      this.props.dispatch(zoomBy(1.25));
    }
  }

  zoomOut() {
    if (this.props.zoom >= (this.props.minZoom * 1.25)) {
      this.props.dispatch(zoomBy(0.8));
    } else {
      this.props.dispatch(zoomReset());
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

  resetToStart() {
    this.props.dispatch(resetToStart());
  }

  turn() {
    this.props.dispatch(turn());
  }

  componentWillReceiveProps(newProps) {
    if (
        this.state.isActive && (
            newProps.minZoom >= newProps.zoom ||
            newProps.book.currentPage !== this.props.book.currentPage
        )
    ) {
      this.setState({isActive: false});
    }
    if (this.state.isActive === false && (
            newProps.minZoom < newProps.zoom
        )) {
      this.setState({isActive: true});
    }
  }

  toggleAnnotation() {
    const { act } = this.state;
    const { dispatch } = this.props;

    if (this.state.act) {
      dispatch(closeCaption());
    } else {
      dispatch(openCaption());
    }
    this.setState({act: !act});
  }

  getAnnotations() {
    const [annotation_title, ...annotation_paragraphs] = this.props.selected;

    return (
        <div className="player-annotations" id="annotation">
          <a href={ this.state.act ? '#annotation' : '#image' }
             className={ this.state.act ? 'action-toggle' : 'action-toggle action-toggle--active' }
             onClick={ () => this.toggleAnnotation() }>
            <div className="action-toggle__left-line"></div>
            <div className="action-toggle__right-line"></div>
          </a>
          <a href={ this.state.act ? '#annotation' : '#image' }
             className="player-annotations__title"
             onClick={ () => this.toggleAnnotation() }>{ annotation_title }</a>
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

  getCurrentPage() {
    const { book } = this.props;
    const realPage = book.currentPage - book.coverPages;
    if (realPage <= 0) {
      return false;
    }
    return realPage;
  }

  getTotalPages() {
    const { book } = this.props;
    return book.totalPages - book.coverPages - 1;
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
              onPinch={() => {
                this.setState({ isActive: true });
              }}
              onSwipeLeft={ () => this.nextPage() }
              onSwipeRight={ () => this.prevPage() }
              style={{ display: this.state.isActive ? 'none' : 'block' }}/>

          { this.props.book.currentBook.pages[this.props.book.currentPage - 1] ? (
              <div onClick={ this.prevPage.bind(this) } className="player-paddle player-paddle--left"></div>
          ) : null }
          { (this.props.book.currentPage + 1) < this.props.book.totalPages ? (
              <div onClick={ this.nextPage.bind(this) } className="player-paddle player-paddle--right"></div>
          ) : null }
          { /* Component: PlayerTitle */ }
          { /* <PageTitle>
           Page title { parseInt(this.props.book.currentPage, 10) + 1 } of { this.props.book.totalPages }
           </PageTitle> */ }
          { /* Component: PlayerImage */ }
          <PlayerImage
              isLoading={ this.props.isLoading }
              src={ this.props.thumbnail }
          />
          { !this.state.isTouch || (this.props.book.currentPage !== this.props.book.startPage) ?
              <a className="player-home-button"
                 href="#home"
                 onClick={ () => this.resetToStart() }
                 style={{ opacity: (this.props.book.currentPage === this.props.book.startPage) ?  .2 : 1 }}>
                <img className="player-actions__navigation-icon player-actions__navigation-icon--small"
                     alt="back to initial page"
                     src={ getPath('img/left.svg') }/>
              </a>
              : null }
          <ZoomControl
              zoomInEnabled={ this.props.zoom < 0.0008 }
              zoomOutEnabled={ this.props.zoom > this.props.minZoom }
              onResetZoom={ ((!this.state.isTouch) || this.props.zoom > this.props.minZoom) ? this.resetZoom.bind(this) : null }
              resetEnabled={ this.props.zoom > this.props.minZoom }
              onZoomIn={ this.state.isTouch ? null : this.zoomIn.bind(this) }
              onZoomOut={ this.state.isTouch ? null : this.zoomOut.bind(this) }
          />
          { /* Component: PlayerActions */ }
          <div className="player-actions">
            <div className="player-actions__inline-label">
              {
                this.getCurrentPage() ?
                    `${this.getCurrentPage()} of ${this.getTotalPages()}` :
                    'Cover'
              }
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

export default connect(mapStateToProps)(Bedlam);
