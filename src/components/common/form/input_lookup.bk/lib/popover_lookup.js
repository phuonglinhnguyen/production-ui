import React from 'react'
import Popover from 'material-ui/Popover/Popover';
import LinearProgress from 'material-ui/LinearProgress';
export const PopoverLookup = (props) => {
    const {
        loading,
        anchorEl,
        canAutoPosition,
        anchorOrigin,
        targetOrigin,
        openPopoverLookup,
        popoverProps,
        onClosePopover,
        children,
     } = props;
    const { style: popoverStyle, ...popoverOther } = popoverProps || {};
    const getLoading = (isLoading) => {
        return isLoading ? (
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '5px', zIndex: 10 }}>
                <LinearProgress mode="indeterminate" />
            </div>) : '';
    }
    return (
        <Popover
            style={Object.assign(
                { background: 'rgba(255,255,255,0.95)' },
                { width: anchorEl.clientWidth },
                popoverStyle,
                { minHeight: '50px' }
            )}
            canAutoPosition={canAutoPosition}
            anchorOrigin={anchorOrigin}
            targetOrigin={targetOrigin}
            open={openPopoverLookup}
            anchorEl={anchorEl}
            useLayerForClickAway={false}
            onRequestClose={this.handleRequestClose}
            animated={animated}
            animation={animation}
            onRequestClose={onClosePopover}
            {...popoverOther}
        >
            {getLoading(loading)}
            {children}
        </Popover>
    )
}

export default PopoverLookup;