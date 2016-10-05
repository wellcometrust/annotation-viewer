import React, { PropTypes } from 'react';

const PlayerImage = ({ isLoading, src }) => (
    <div className="player-image" id="image">
      { (isLoading && src) && (
          <img className="player-image__loading" src={ src }/>
      ) }
    </div>
);

PlayerImage.propTypes = {
  isLoading: PropTypes.bool,
  src: PropTypes.string
};

export default PlayerImage;
