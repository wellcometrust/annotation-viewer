/**
 * @ProvidesModule NavBar
 */

import React, {PropTypes} from 'react';

const NavBar = ({ children, ...props }) => (
    <div className="quilt-nav-bar">{ children }</div>
);

NavBar.propTypes = {
  //id: PropTypes.string.isRequired
};

export default NavBar;
