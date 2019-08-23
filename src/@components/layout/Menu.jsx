import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// import inflection from 'inflection';
import compose from 'recompose/compose';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
// import DefaultIcon from '@material-ui/icons/ViewList';
const styles = {
    main: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        width: 250,
    },
};

// const translatedResourceName = (resource, translate) =>
//     translate(`resources.${resource.name}.name`, {
//         smart_count: 2,
//         _:
//             resource.options && resource.options.label
//                 ? translate(resource.options.label, {
//                       smart_count: 2,
//                       _: resource.options.label,
//                   })
//                 : inflection.humanize(inflection.pluralize(resource.name)),
//     });

const Menu = ({
    classes,
    className,
    dense,
    hasDashboard,
    onMenuClick,
    pathname,
    resources,
    translate,
    logout,
    ...rest
}) => (
    <div className={classnames(classes.main, className)} {...rest}>
       
    </div>
);

Menu.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    dense: PropTypes.bool,
    hasDashboard: PropTypes.bool,
    logout: PropTypes.element,
    onMenuClick: PropTypes.func,
    pathname: PropTypes.string,
    resources: PropTypes.array.isRequired,
    translate: PropTypes.func.isRequired,
};

Menu.defaultProps = {
    onMenuClick: () => null,
};

const mapStateToProps = state => ({
    resources: state.resources,
    pathname: state.routing.location.pathname, // used to force redraw on navigation
});

const enhance = compose(
    connect(
        mapStateToProps,
        {}, // Avoid connect passing dispatch in props,
        null,
        {
            areStatePropsEqual: (prev, next) =>
                prev.resources.every(
                    (value, index) => value === next.resources[index] // shallow compare resources
                ) && prev.pathname === next.pathname,
        }
    ),
    withStyles(styles)
);

export default enhance(Menu);
