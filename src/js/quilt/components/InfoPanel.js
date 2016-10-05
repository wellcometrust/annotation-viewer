/**
 * @ProvidesModule InfoPanel
 */

import React, {PropTypes} from 'react';
import { getPath } from '../../Util';

const InfoPanel = (props) => (
    <div className={props.isOpen ? 'info-panel info-panel--active' : 'info-panel'}>
      <button className="icon-button info-panel__close-button" onClick={props.onClose} title={props.buttonTitle}><img src={getPath('img/ic_close_black_24px.svg')} /></button>
      <div className="info-panel__content">
      {props.children}
      </div>
    </div>
);

InfoPanel.propTypes = {
  //id: PropTypes.string.isRequired
};

export default InfoPanel;
