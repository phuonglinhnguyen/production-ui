import * as constants from '../constant/tooltip_constants'

export const openTooltip = (text,anchorEl) => ({
    type: constants.TOOLTIP_OPEN,
    text: text,
    anchorEl:anchorEl
});

export const closeTooltip = () => ({
  type: constants.TOOLTIP_CLOSE
});