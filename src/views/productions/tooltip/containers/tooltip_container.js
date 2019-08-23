import { connect } from 'react-redux';

import ToolTipComponent from '../components/tooltip_component';

import { closeTooltip } from '../actions/tooltip_actions';


const mapStateToProps = state => {
    const { field_tooltip } = state;

    return { field_tooltip };
};

const mapDispatchToProps = dispatch => ({
    closeTooltip: () => {
        dispatch(closeTooltip());
    }
});

export default connect(mapStateToProps, mapDispatchToProps) (ToolTipComponent);
