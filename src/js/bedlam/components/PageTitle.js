import React, { PropTypes } from 'react';

const PageTitle = ({ children, ...props }) => (
    <div className="player-title" {...props}>{ children }</div>
);

export default PageTitle;
