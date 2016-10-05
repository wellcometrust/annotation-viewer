/**
 * @ProvidesModule Image
 */

import React, {PropTypes} from 'react';

const Image = ({id, ...props}) => (
    <div className="image-container">
      <img src={id} {...props} />
    </div>
);

Image.propTypes = {
  id: PropTypes.string.isRequired
};

export default Image;
