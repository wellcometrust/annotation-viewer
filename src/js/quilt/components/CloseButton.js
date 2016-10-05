/**
 * @ProvidesModule CloseButton
 */

import React, {PropTypes} from 'react';
import { getPath } from '../../Util';

const CloseButton = (props) => (
    <button className="icon-button close-button" {...props}>
      <img height="30" src={getPath('img/ic_zoom_out_map_black_24px.svg')} />
    </button>
);

CloseButton.propTypes = {
  //id: PropTypes.string.isRequired
};

export default CloseButton;
