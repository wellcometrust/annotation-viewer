/**
 * @ProvidesModule TextualBody
 */

import React, {PropTypes} from 'react';

const TextualBody = ({value, ...props}) => (
    <p className="textual-body" {...props}>
      {value}
    </p>
);

TextualBody.propTypes = {
  value: PropTypes.string.isRequired
};

export default TextualBody;
