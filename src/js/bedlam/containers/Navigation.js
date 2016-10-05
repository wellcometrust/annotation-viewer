/**
 * @ProvidesModule Navigation
 *
 * @deprecated
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { rotateTo, goTo } from '../../redux/actions/viewerActions';
import { setActiveAnnotation } from '../../redux/actions/annotationActions';

import { nextPage, prevPage, turn, toPage } from '../../redux/actions/bookActions';

class Navigation extends Component {

  constructor() {
    super();
    this.state = {
      debugOpen: true
    };
  }

  changeRange(e) {
    const { dispatch } = this.props;
    dispatch(rotateTo(e.currentTarget.value));
  }

  handleClick(item) {
    return () => {
      const { dispatch } = this.props;
      dispatch(goTo(item.x, item.y, item.zoom, item.rotation));
      dispatch(setActiveAnnotation(item));
    };
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

  handleThumbnailClick(e, page) {
    e.preventDefault();
    e.currentTarget.blur();
    this.refs.current.focus();
    this.goToPage(page);
  }

  toggleDebug() {
    this.setState({
      debugOpen: !this.state.debugOpen
    });
  }

  makePageThumbnail(page, current = false) {
    return this.props.book.currentBook && this.props.book.currentBook.pages[page] ? (
        <a href="#/something" onClick={ (e) => this.handleThumbnailClick(e, page) } ref={ current ? 'current' : null } className={ current ? 'player-actions__slider-thumbnail player-actions__slider-thumbnail--current' : 'player-actions__slider-thumbnail' }>
          <img alt="something image" src={ this.props.book.currentBook.pages[page].getThumbnail() } />
        </a>
    ) : (
        <div style={{ height: 1, width: 20, display: 'inline-block' }}></div>
    );
  }

  render() {
    return (
        <div id="bedlam-player">
          { this.props.book.currentBook ? (
              <div className="player-title">
                Page title { this.props.book.currentPage + 1 } of { this.props.book.totalPages }
              </div>
          ) : null }
          <div className="player-image" id="image">
            { this.props.isLoading && this.props.thumbnail ? (
                <img className="player-image__loading" src={ this.props.thumbnail } />
            ) : null }
          </div>
          <div className="player-actions">
            <div className="player-actions__navigation">
              { this.props.book.currentBook && this.props.book.currentBook.pages[this.props.book.currentPage - 1] ? (
                  <a href={ `#/page/${this.props.book.currentPage - 1}` } onClick={ this.prevPage.bind(this) } className="player-actions__prev-page">
                    <img className="player-actions__navigation-icon" src={ getPath('img/left.svg') }/>
                  </a>
              ) : null }
              { this.props.book.currentBook && (this.props.book.currentPage+1) < this.props.book.totalPages ? (
                  <a href={ `#/page/${this.props.book.currentPage + 1}` } onClick={ this.nextPage.bind(this) } className="player-actions__next-page">
                    <img className="player-actions__navigation-icon" src={ getPath('img/right.svg') }/>
                  </a>
              ) : (
                  <a href="#/page/0" onClick={ () => this.goToPage(0) } className="player-actions__next-page">
                    <span className="player-actions__navigation-text">To start</span>
                  </a>
              )}
            </div>
          </div>
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
    annotations: store.annotations.list,
    selected: store.annotations.selected,
    book: store.book,
    currentPage,
    thumbnail
  };
}

export default connect(mapStateToProps)(Navigation);
