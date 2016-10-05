/**
 * @ProvidesModule NavItem
 */

import React, {PropTypes} from 'react';
import cx from 'classnames';

const NavItem = ({ align, children, ...props}) => (
    <div className={cx({
      'quilt-nav-bar__item': true,
      'quilt-nav-bar__item--left': align === 'left',
      'quilt-nav-bar__item--right': align === 'right'
    })} {...props}>
      { children }
    </div>
);

NavItem.propTypes = {
  align: PropTypes.string.isRequired
};

export default NavItem;
