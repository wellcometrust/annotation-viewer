/**
 * @ProvidesModule NavButton
 */

import React, {PropTypes} from 'react';
import cx from 'classnames';

const NavButton = ({ align, children, ...props}) => (
    <button className={cx({
      'quilt-nav-bar__item': true,
      'quilt-nav-bar__item--left': align === 'left',
      'quilt-nav-bar__item--right': align === 'right'
    })} {...props}>
      { children }
    </button>
);

NavButton.propTypes = {
  align: PropTypes.string.isRequired
};

export default NavButton;
