/**
 * @ProvidesModule Quilt
 */

import React, { Component } from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';
import { rotateTo, goTo, goToRect, zoomBy } from '../../redux/actions/viewerActions';
import { setActiveAnnotation, pnpoly } from '../../redux/actions/annotationActions';
import Composite from '../components/Composite';
import { getPath } from '../../Util';
import cx from 'classnames';

import AnnotationPanel from '../components/AnnotationPanel';
import CloseButton from '../components/CloseButton';
import InfoButton from '../components/InfoButton';
import InfoPanel from '../components/InfoPanel';
import NavBar from '../components/NavBar';
import NavItem from '../components/NavItem';
import NavButton from '../components/NavButton';

import { toggleInfoPanel, closeInfoPanel, openInfoPanel } from '../redux/actions/infoActions';
import { startJourney, journeyNext, journeyPrev, stopJourney, startJourneyAt, toggleDetails } from '../redux/actions/journeyActions';

class Quilt extends Component {

  componentWillReceiveProps(newProps) {
    const { annotation_items, dispatch, journey } = this.props;
    // Page change.
    if (newProps.journey.currentIndex !== journey.currentIndex) {
      const { currentIndex } = newProps.journey;
      if (annotation_items[currentIndex]) {
        const { target: { x, y, w, h, rotation } } = annotation_items[currentIndex];
        dispatch(goToRect(x, y, w, h, rotation));
      }
    }
    // Click on the canvas.
    if (
        newProps.clickPosition !== this.props.clickPosition &&
        newProps.clickPosition.x
    ) {
      const position = newProps.clickPosition;
      // Find the first intersection.
      const item = _.findIndex(annotation_items, (i) => {
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
        dispatch(startJourneyAt(item, annotation_items.length));
      }
    }
  }

  start() {
    // For now...
    this.props.dispatch(startJourney(this.props.annotation_items.length));
  }

  next() {
    const { dispatch, journey: { currentIndex, totalItems }, annotation_items } = this.props;
    dispatch(journeyNext());
  }

  toggleAnnotationOpen() {
    const { dispatch } = this.props;
    dispatch(toggleDetails());
  }

  render() {
    const {
        dispatch,
        journey: { isActive: journeyStarted, expanded: isAnnotationVisible, currentIndex, totalItems },
        selected: { describing, naming, title }
        } = this.props;

    return (
        <div className="quilt-container__inner">
          <InfoButton isOpen={this.props.isOpen} title="Information about The Quilt" onClick={ () => dispatch(openInfoPanel()) } />
          <InfoPanel isOpen={this.props.isOpen} buttonTitle="Close" onClose={ ()=> dispatch(closeInfoPanel()) }>
            <p>As part of our &lsquo;<a href="https://wellcomecollection.org/exhibitions/states-mind-tracing-edges-consciousness" target="_blank">States of Mind</a>&rsquo; exhibition, the <a href="https://wellcomecollection.org/sleepstories/" target="_blank">Sleep Stories</a> quilt was made in Wellcome Collection by visitors who shared and stitched their stories of what happens while they're asleep.</p>
          </InfoPanel>
          { /* The `else` part of the if statement is temporary. */ }
          { journeyStarted ? (
              <div className={cx({
                "journey-container": true,
                "journey-container--active": journeyStarted
              })}>
                <CloseButton title="Zoom out and browse the Quilt" onClick={ () => { dispatch(stopJourney()); dispatch(zoomBy(.75));} } />
                <AnnotationPanel
                    toggleOpen={() => this.toggleAnnotationOpen()}
                    isOpen={isAnnotationVisible}
                    title={ title }
                >

                  { /* These could potentially be <AnnotationTitle /> and <AnnotationBody /> */ }
                  <Composite items={describing}/>
                </AnnotationPanel>
                <NavBar>
                  <NavItem align="left" type="text">{ currentIndex + 1 } of { totalItems }</NavItem>
                  <NavItem align="right" type="prev" onClick={ () => this.next() }>
                    <img height="30" src={ getPath('img/right-black.svg') } />
                  </NavItem>
                  <NavItem align="right" type="next" onClick={ () => this.props.dispatch(journeyPrev()) }>
                    <img style={{ opacity: currentIndex === 0 ? .1 : 1 }} height="30" src={ getPath('img/left-black.svg') } />
                  </NavItem>
                </NavBar>
              </div>
          ): <NavButton className="icon-button start-journey" align="left" title="Start journey" onClick={ () => this.start() } type="text">Start Journey</NavButton> }
        </div>
    );
  }
}

function mapStateToProps(store) {
  return {
    // New
    journey: store.journey,
    rotation: parseInt(store.viewer.rotation, 10),
    x: store.viewer.lastKnown.x,
    y: store.viewer.lastKnown.y,
    zoom: store.viewer.lastKnown.zoom,
    annotations: store.annotations.list,
    annotation_items: store.annotations.items,
    tags: store.annotations.bodyTaxonomy && store.annotations.bodyTaxonomy.tagging,
    selected: store.journey.isActive ? {
      title: store.annotations.items[store.journey.currentIndex].body.naming ? store.annotations.items[store.journey.currentIndex].body.naming[0].value : [],
      describing: store.annotations.items[store.journey.currentIndex].body.describing || [],
      naming: store.annotations.items[store.journey.currentIndex].body.naming || [],
      tags: new Set((store.annotations.items[store.journey.currentIndex].body.tagging && store.annotations.items[store.journey.currentIndex].body.tagging.map((t) => t.value)) || [])
    } : {},
    clickPosition: store.viewer.lastClick.imagePoint,
    isOpen: store.info.isOpen
  };
}

export default connect(mapStateToProps)(Quilt);
