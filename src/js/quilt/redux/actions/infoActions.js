export const INFO_PANEL_OPEN = 'INFO_PANEL_OPEN';
export const INFO_PANEL_CLOSE = 'INFO_PANEL_CLOSE';
export const INFO_PANEL_TOGGLE = 'INFO_PANEL_TOGGLE';


export const openInfoPanel = () => ({ type: INFO_PANEL_OPEN });
export const closeInfoPanel = () => ({ type: INFO_PANEL_CLOSE });
export const toggleInfoPanel = () => ({ type: INFO_PANEL_TOGGLE });
