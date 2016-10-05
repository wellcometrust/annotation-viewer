/**
 * @ProvidesModule Composite
 *
 * This component is the representation of annotation bodies. It can be expanded to detect different type such
 * as audio and video as needed. These match up to the type in the W3C spec currently.
 */

import React, {PropTypes} from 'react';

import TextualBody from './TextualBody';
import Image from './Image';

export const makeComposite = (type) => (props) => {
  switch (type) {
    case 'TextualBody':
      return <TextualBody {...props}/>;
      break;

    case 'Image':
      return <Image {...props}/>;
      break;

    case 'Composite':
      return <Composite root={false} {...props}/>;
      break;
  }
};

const Composite = ({ items, root = true }) => (
    <div className={root ? 'annotation-root' : 'annotation-composite'}>
      { items.map(({ type, ...props }, k) => {
        const Comp = makeComposite(type);
        return <Comp key={k} {...props} />
      }) }
    </div>
);

Composite.propTypes = {
  items: PropTypes.array.isRequired
};

export default Composite;
