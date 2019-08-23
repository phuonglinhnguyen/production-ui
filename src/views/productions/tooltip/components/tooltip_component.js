import React from 'react';
import PropTypes from 'prop-types';
import Popover from 'material-ui/Popover/Popover';
import Subheader from 'material-ui/Subheader';
import _ from 'lodash'

const ToolTip = props => {

    const { field_tooltip } = props;
    var {  text, anchorEl } = field_tooltip;
    text = _.isArray(text) ? text : [text];
  
    return (
        <div>

            {anchorEl && <Popover
                open={true}
                anchorEl={anchorEl}
                anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                onRequestClose={props.closeTooltip}
                useLayerForClickAway={false}
                children={<Subheader style={{ paddingRight: '16px' }}>{text.map((_item, index) =>
                    <p key={index} style={{ margin: 0 }}>{_item}</p>)}</Subheader>}

            >

            </Popover>
            }
        </div>
    );
};

ToolTip.propTypes = {

    open: PropTypes.bool,

    text: PropTypes.string
};

export default ToolTip;
