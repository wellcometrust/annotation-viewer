/**
 * Kiosk Actions
 *
 * This was abandoned shortly after conception.
 * @deprecated
 */

import { resetToStart, resetAfterSeconds } from './bookActions';

export const dismissResetPrompt = () => (dispatch) => {
  const seconds = 240;
  // ... stuff
  dispatch(resetAfterSeconds(seconds));
};

export const confirmResetPrompt = () => (dispatch) => {
  dispatch(resetToStart());
  dispatch(dismissResetPrompt());
};
