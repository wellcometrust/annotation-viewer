import React, { PropTypes, Component } from 'react';
import hammer from 'hammerjs';

class SliderControl extends Component {

  static propTypes = {
    value: PropTypes.number,
    min: PropTypes.number,
    max: PropTypes.number,
    onChange: PropTypes.func,
    label: PropTypes.string
  };

  goTo(e) {
    if ('ontouchstart' in document.documentElement) {
      const { max } = this.props;
      const leftOffset = e.clientX;
      const sliderRect = this.refs.slider.getBoundingClientRect();
      const pixelsFromLeft = leftOffset - sliderRect.left;
      const percentage = (pixelsFromLeft / (sliderRect.width - 24));
      const page = Math.round(percentage * max);
      this.props.onChange({
        target: {value: page}
      });
    }
  }

  render() {
    const { value = 0, onChange, min = 0, max, label = null } = this.props;
    let num = 400;
    if (window.innerWidth < 450) {
      num = 180;
    } else if (window.innerWidth < 640) {
      num = 300;
    }
    const textLabel = label || `${value + 1} of ${max}`;

    return (
        <div className="player-actions__slider" style={{ position: 'relative', overflow: 'visible' }}>
          <input type="range" value={value}
                 ref="slider"
                 onClick={ (e) => this.goTo(e) }
                 onChange={ onChange } min={min}
                 max={max}/>
          { label && <div className="player-actions__slider-label"
                          style={{ left: ((value / max) * num) + 10 }}>
            {textLabel}
          </div> }
        </div>
    );
  }

}

export default SliderControl;
