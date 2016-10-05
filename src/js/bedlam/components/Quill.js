/**
 * Quill
 *
 * More of a pattern than a pre-built tool.
 * Allow user-accessible styling of text (in library.js)
 */

import React from 'react';

export const title = (children) => (props) => <h3 {...props}>{children}</h3>;
export const strong = (children) => (props) => <p><strong {...props}>{children}</strong></p>;
