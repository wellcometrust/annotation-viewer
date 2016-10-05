/**
 * @ProvidesModule AnnotationPanel
 */

import React, {PropTypes} from 'react';
import cx from 'classnames';
import { getPath } from '../../Util';

const AnnotationPanel = ({ title, isOpen, toggleOpen, children, ...props }) => (
    <div className={ cx({
      'annotation-panel': true,
      'annotation-panel--active': isOpen
    }) }>
      <div className="annotation-panel__inner">
        <div className="annotation-panel__toggle" onClick={() => toggleOpen(isOpen)}>
          <img src={ getPath('img/left-black.svg') }/>
        </div>
        <div className="annotation-panel__title" onClick={() => toggleOpen(isOpen)}>{ title }</div>
        <div className="annotation-panel__body">{ children }</div>
      </div>
    </div>
);

AnnotationPanel.propTypes = {
  isOpen: PropTypes.bool.isRequired

};

export default AnnotationPanel;
