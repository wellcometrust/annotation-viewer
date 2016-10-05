/**
 * @ProvidesModule Debug
 *
 * This component is a sandbox for the quilt project. It is meant to be a collection of
 * works in progress to aid in development.
 *
 * Its behaviour will eventually be refined and a UI built on top of it.
 */

import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { rotateTo, goTo, goToRect } from '../../redux/actions/viewerActions';
import { setActiveAnnotation, pnpoly } from '../../redux/actions/annotationActions';
import Composite from '../components/Composite';

class Debug extends Component {

  constructor() {
    super();
    this.state = {
      currentNode: null,
      currentTag: null
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

  componentWillReceiveProps(newProps) {
    if (
        newProps.clickPosition !== this.props.clickPosition &&
        newProps.clickPosition.x
    ) {
      const position = newProps.clickPosition;
      // Find the first intersection.
      const item = _.find(this.props.annotation_items, (i) => {
        return pnpoly(
            [
              Math.round(position.x),
              Math.round(position.y)
            ],
            i.target.vector
        );
      });
      // Move annotation into focus.
      if (item) {
        this.props.dispatch(this.handleFullClick(item));
      }
    }
  }

  handleFullClick({ target: { x, y, w, h, rotation }, node, body }) {
    return () => {
      const { dispatch } = this.props;
      dispatch(goToRect(x, y, w, h, rotation));
      dispatch(setActiveAnnotation(body));
      // @todo create proper state machine for this.
      if (this.state.currentNode) {
        this.state.currentNode.style = 'display:none';
      }
      node.style = 'display:block';
      this.setState({currentNode: node});
    };
  }

  itemsByTag(tag) {
    if (!this.props.annotation_items) {
      return null;
    }
    if (tag === null) {
      return this.props.annotation_items.map((value, k) => (
          <button
              style={{margin: 2, color: '#000', border: 'none', background: '#FFF', height: 30, width: 30, borderRadius: '50%'}}
              key={k}
              onClick={ this.handleFullClick(value).bind(this) }>
            { k + 1 }
          </button>
      ));
    }
    return _.filter(this.props.annotation_items, (item) => {
      return _.find(item.body.tagging, {value: tag});
      //console.info(item.body.tagging.indexOf(tag), item.body.tagging);
      //return item.body.tagging && item.body.tagging.indexOf(tag) !== -1;
    }).map((value, k) => {
      return (
          <button
              style={{margin: 2, color: '#000', border: 'none', background: '#FFF', height: 30, width: 30, borderRadius: '50%'}}
              key={k}
              onClick={ this.handleFullClick(value).bind(this) }>
            { k + 1 }
          </button>
      );
    })
  }

  selectTag(tag) {
    this.setState({currentTag: this.state.currentTag === tag ? null : tag});
  }

  mapTags(items, selected) {
    const tags = [];
    for (let item of items) {
      const [ tag, num ] = item;
      if (selected.has(tag)) {
        tags.push(
            <li onClick={() => this.selectTag(tag)}
                style={{ margin: 2, cursor: 'pointer', color: this.state.currentTag === tag ? 'red' : 'green' }}
                key={tag}>{tag} ({num})</li>
        )
      } else {
        tags.push(
            <li onClick={() => this.selectTag(tag)}
                style={{ margin: 2, cursor: 'pointer', color: this.state.currentTag === tag ? 'red' : 'white' }}
                key={tag}>{tag} ({num})</li>
        )
      }
    }
    return tags;
  }

  render() {
    return (
        <div style={{ zIndex: 10000, backgroundColor: '#000', color: '#FFF', position: 'relative', top: 0, bottom: 0 }}>
          <div style={{ padding: 20 }}>
            <input type="range" style={{color: '#000'}} value={this.props.rotation}
                   onChange={ this.changeRange.bind(this) } min="0" max="360"/>
            <p>Rotation: <input readOnly={true} value={ this.props.rotation }/></p>
            { this.itemsByTag(this.state.currentTag) }
            { this.props.selected.describing && <Composite items={this.props.selected.describing}/> }
            { this.props.tags && this.mapTags(this.props.tags, this.props.selected.tags) }
          </div>
        </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    rotation: parseInt(store.viewer.rotation, 10),
    x: store.viewer.lastKnown.x,
    y: store.viewer.lastKnown.y,
    zoom: store.viewer.lastKnown.zoom,
    annotations: store.annotations.list,
    annotation_items: store.annotations.items,
    tags: store.annotations.bodyTaxonomy && store.annotations.bodyTaxonomy.tagging,
    selected: {
      describing: store.annotations.selected.describing || [],
      tags: new Set((store.annotations.selected.tagging && store.annotations.selected.tagging.map((t) => t.value)) || []),
    },
    clickPosition: store.viewer.lastDoubleClick.imagePoint
  };
}

export default connect(mapStateToProps)(Debug);
