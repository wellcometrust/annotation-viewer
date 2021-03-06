export const JOURNEY_START = 'JOURNEY_START';
export const JOURNEY_EXIT = 'JOURNEY_EXIT';
export const JOURNEY_NEXT = 'JOURNEY_NEXT';
export const JOURNEY_PREV = 'JOURNEY_PREV';
export const JOURNEY_GO_TO = 'JOURNEY_GO_TO';
export const JOURNEY_DETAIL_OPEN = 'JOURNEY_DETAIL_OPEN';
export const JOURNEY_DETAIL_CLOSE = 'JOURNEY_DETAIL_CLOSE';
export const JOURNEY_DETAIL_TOGGLE = 'JOURNEY_DETAIL_TOGGLE';
export const JOURNEY_READY = 'JOURNEY_READY';

export const startJourney = (totalItems) => ({type: JOURNEY_START, payload: {totalItems}});
export const startJourneyAt = (startAt, totalItems) => ({type: JOURNEY_START, payload: {totalItems, startAt}});
export const openDetails = () => ({type: JOURNEY_DETAIL_OPEN});
export const closeDetails = () => ({type: JOURNEY_DETAIL_CLOSE});
export const toggleDetails = () => ({type: JOURNEY_DETAIL_TOGGLE});
export const stopJourney = () => ({type: JOURNEY_EXIT});
export const journeyGoTo = index => ({type: JOURNEY_GO_TO, payload: {index}});
export const journeyNext = () => ({type: JOURNEY_NEXT});
export const journeyPrev = () => ({type: JOURNEY_PREV});
export const journeyReady = () => ({type: JOURNEY_READY});
