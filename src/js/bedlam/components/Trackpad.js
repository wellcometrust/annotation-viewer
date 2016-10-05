/**
 * Track Pad
 *
 * This is a mutation file. It accesses all sorts of pieces of the DOM.
 * Traditionally not recommended, but its all contained.
 *
 * This is an invisible layer that sits over bedlam when the player is
 * zoomed out. It then acts as a track pad / tablet that you can detect
 * events such as swiping, dragging and pinching.
 *
 * These events are then delegated to other parts of the application
 * through its props.
 *
 * Since this is touching the DOM so often, a visual layer was added
 * and this handle the animation while different gestures are happening.
 *
 * @todo improve pinching and zooming "through" this layer.
 */

import React, { Component, PropTypes } from 'react';
import hammer from 'hammerjs';

export default class Trackpad extends Component {

  componentDidMount() {
    const inst = hammer(this.refs.pad);
    const player = document.querySelector('.osd-player');

    function fadeIn($el, move = true) {
      const el = $el;
      if (el) {
        el.style.opacity = 0;
      }
      const frame = () => {
        if (!el) return;
        el.style.opacity = +el.style.opacity + 0.05;
        el.style.opacity = +el.style.opacity + 0.05;
        if (move) {
          el.style.transform = `scale(${(el.style.opacity * 0.1) + 0.9})`;
        }
        if (+el.style.opacity < 1) {
          if (window.requestAnimationFrame) {
            requestAnimationFrame(frame);
          } else {
            setTimeout(frame, 16);
          }
        }
      };
      setTimeout(frame, 200);
    }

    inst.on('swipeleft', () => {
      player.style.left = 0;
      this.props.onSwipeLeft();
    });
    inst.on('swiperight', () => {
      player.style.left = 0;
      this.props.onSwipeRight();
    });
    inst.on('doubletap', (event) => {
      this.props.onPress();
      if (event.stopPropagation) event.stopPropagation();
      event.preventDefault();
    });
    this.refs.pad.addEventListener('touchstart', (event) => {
      if (event.touches.length > 1) {
        this.props.onPinch();
      }
    });
    inst.on('panmove', (e) => {
      e.preventDefault();
      const delta = e.deltaX;
      const opacity = (window.innerWidth - Math.abs(delta)) / window.innerWidth;
      // player.style.left = `${e.deltaX}px`;
      player.style.transform = `translateX(${e.deltaX}px)`;
      player.style.opacity = opacity;
    });
    inst.on('panend', (e) => {
      e.preventDefault();
      // player.style.left = '0px';
      player.style.transform = 'translateX(0px)';
      fadeIn(player);
      fadeIn(document.querySelector('.player-image__loading'));
    });
    inst.on('pancancel', (e) => {
      e.preventDefault();
      // player.style.left = '0px';
      player.style.transform = 'translateX(0px)';
      fadeIn(player, false);
      fadeIn(document.querySelector('.player-image__loading'));
    });
  }

  render() {
    const { onSwipeLeft, onSwipeRight, onPress, onPinch, ...props } = this.props;
    return <div className="player-gestures" ref="pad" {...props}></div>;
  }
}
