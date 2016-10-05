/**
 * @ProvidesModule InfoButton
 */

import React, {PropTypes} from 'react';
import { getPath } from '../../Util';

const InfoButton = (props) => (
    <button className={props.isOpen ? 'icon-button info-button--hidden' : 'icon-button info-button'} aria-haspopup="true" onClick={props.onClick} title={props.title}>
      <img src={getPath('img/ic_info_outline_black_24px.svg')} />
    </button>
);

InfoButton.propTypes = {
  title: PropTypes.string
  //id: PropTypes.string.isRequired
};

export default InfoButton;
