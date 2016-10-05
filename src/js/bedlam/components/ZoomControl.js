import React, { PropTypes } from 'react';
import { getPath } from '../../Util';

const ZoomControl = ({ onZoomOut, onZoomIn, onResetZoom, zoomInEnabled = true, zoomOutEnabled = false, resetEnabled = false }) => (
    <div className="zoom-control">
      { onResetZoom ? (
          <a href="#resetZoom"
             onClick={ onResetZoom }
             className={ resetEnabled ? 'player-reset-button' : 'player-reset-button zoom-control__button--disabled'}>
            <img className="player-actions__navigation-icon player-actions__navigation-icon--small" alt="next page"
                 src={ getPath('img/reset.svg') }/>
          </a>
      ) : null }
      { onZoomOut ? (
          <a href="#zoomOut"
             onClick={ onZoomOut }
             className={ zoomOutEnabled ? 'zoom-control__button' : 'zoom-control__button zoom-control__button--disabled'}>
            –
          </a>
      ) : null }
      { onZoomIn ? (
          <a href="#zoomIn"
             onClick={ onZoomIn }
             className={ zoomInEnabled ? 'zoom-control__button' : 'zoom-control__button zoom-control__button--disabled'}>
            +
          </a>
      ) : null }
    </div>
);

ZoomControl.propTypes = {
  onZoomIn: PropTypes.func.isRequired,
  onZoomOut: PropTypes.func.isRequired,
  zoomInEnabled: PropTypes.bool,
  zoomOutEnabled: PropTypes.bool
};

export default ZoomControl;
