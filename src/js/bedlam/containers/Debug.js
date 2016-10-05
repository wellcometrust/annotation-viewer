/**
 * @ProvidesModule App
 *
 * @deprecated
 */

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { rotateTo, goTo } from '../../redux/actions/viewerActions';
import { setActiveAnnotation } from '../../redux/actions/annotationActions';

import { nextPage, prevPage, turn, toPage } from '../../redux/actions/bookActions';

class App extends Component {

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

  goToPage(e) {
    this.props.dispatch(toPage(e.currentTarget.value));
  }

  turn() {
    this.props.dispatch(turn());
  }

  toggleDebug() {
    this.setState({
      debugOpen: !this.state.debugOpen
    });
  }

  render() {
    return (
        <div>
          <div
              style={{ position: 'fixed', bottom: 10, right: 10, backgroundColor: '#444', color: '#FFF', padding: 5, borderRadius: 5, cursor: 'pointer' }}
              onClick={ this.toggleDebug.bind(this) }>Debug
          </div>
          <div style={{ opacity: this.state.debugOpen ? 100 : 0 }}>
            <h3>Rotation: </h3>
            <input type="range" value={this.props.rotation} onChange={ this.changeRange.bind(this) } min="0" max="360"/>
            <h3>Vars:</h3>
            <p>X: <input readOnly={true} value={ this.props.x }/></p>
            <p>Y: <input readOnly={true} value={ this.props.y }/></p>
            <p>Zoom: <input readOnly={true} value={ this.props.zoom }/></p>
            <p>Rotation: <input readOnly={true} value={ this.props.rotation }/></p>
            <ul>
              { this.props.annotations.map((value, k) => (
                  <li key={k}>
                    <button onClick={ this.handleClick(value).bind(this) }>{ value.name }</button>
                  </li>
              ))}
            </ul>
            <p>
              { JSON.stringify(this.props.selected, null, 4) }
            </p>
            <h3>Page slider: </h3>
            { this.props.book ?
                <input type="range" value={this.props.book.currentPage} onChange={ this.goToPage.bind(this) } min="0"
                       max={this.props.book.totalPages}/>
                : null }
            <button onClick={ this.prevPage.bind(this) }>
              { this.props.book.currentBook && this.props.book.currentBook.pages[this.props.book.currentPage - 1] ?
                  <img src={ this.props.book.currentBook.pages[this.props.book.currentPage - 1].getThumbnail() }/>
              : null }
              Prev page
            </button>
            <button onClick={ this.nextPage.bind(this) }>
              { this.props.book.currentBook && this.props.book.currentBook.pages[this.props.book.currentPage + 1] ?
                  <img src={ this.props.book.currentBook.pages[this.props.book.currentPage + 1].getThumbnail() }/>
                  : null }
              Next page
            </button>
            <button onClick={ this.turn.bind(this) }>Turn</button>
          </div>
          { this.props.isLoading && this.props.thumbnail ? (
              <div style={{ top: 30, left: 0, bottom: 0, right: 0, textAlign: 'center', filter: 'blur(80px)', position: 'fixed' }}>
                <img style={{ height: '100%', margin: '0 auto' }} src={ this.props.thumbnail } />
              </div>
          ) : null }
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

export default connect(mapStateToProps)(App);
