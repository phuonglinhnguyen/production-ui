import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// import { componentPropType } from '@material-ui/core/utils';
import formControlState from '@material-ui/core/FormControl/formControlState';
import withFormControlContext from '@material-ui/core/FormControl/withFormControlContext';
import withStyles from '@material-ui/core/styles/withStyles';

export const styles = theme => ({
   /* Styles applied to the root element. */
   root: {
      height: '48px',
      // padding: '3px 3px !important',
      // position: "relative",
      // borderRight: '1px solid rgba(224, 224, 224, 1)',
      // borderBottom: '1px solid rgba(224, 224, 224, 1)',
      // verticalAlign: 'initial'
   },
   error: {
      // boxShadow: '0px 0px 0px 1px rgba(255, 0, 0, 0.2), 0px 0px 10px 1px rgba(255, 0, 0, 0.14), 0px 3px 14px 3px rgba(255, 0, 0, 0.12) inset',
   },
   warning:{
      // boxShadow: '0px 0px 0px 1px rgba(255, 179, 0, 0.2), 0px 0px 10px 1px rgba(255, 179, 0, 0.14), 0px 3px 14px 3px rgba(255, 179, 0, 0.12) inset',
   },
   disabled: {},
   focused: {
      boxShadow: '0px 5px 5px -3px rgba(0, 0, 0, 0.2),0px 8px 10px 1px rgba(0, 0, 0, 0.14),0px 3px 14px 2px rgba(0, 0, 0, 0.12)',
   },
   filled: {},
   required: {},
});

function InputLableInlineWrapper(props) {
   const {
      classes,
      className: classNameProp,
      component: Component,
      disabled,
      error,
      filled,
      focused,
      margin,
      muiFormControl,
      required,
      variant,
      warning,
      active,
      children,
      ...other
   } = props;

   const fcs = formControlState({
      props,
      muiFormControl,
      states: ['variant', 'margin', 'disabled', 'error', 'filled', 'focused', 'required'],
   });
   return (
      <Component
         className={classNames(
            classes.root,
            {
               [classes.disabled]: fcs.disabled,
               [classes.error]: fcs.error,
               [classes.warning]: warning,
               [classes.filled]: fcs.filled,
               [classes.focused]: active,
               [classes.required]: fcs.required,
            },
            classNameProp,
         )}
         {...other}
      >
            {children}
      </Component>
   );
}

InputLableInlineWrapper.propTypes = {
   /**
    * The content of the component.
    */
   children: PropTypes.node,
   /**
    * Override or extend the styles applied to the component.
    * See [CSS API](#css-api) below for more details.
    */
   classes: PropTypes.object.isRequired,
   /**
    * @ignore
    */
   className: PropTypes.string,
   /**
    * The component used for the root node.
    * Either a string to use a DOM element or a component.
    */
   // component: componentPropType,
   /**
    * If `true`, the helper text should be displayed in a disabled state.
    */
   disabled: PropTypes.bool,
   /**
    * If `true`, helper text should be displayed in an error state.
    */
   error: PropTypes.bool,
   /**
    * If `true`, the helper text should use filled classes key.
    */
   filled: PropTypes.bool,
   /**
    * If `true`, the helper text should use focused classes key.
    */
   focused: PropTypes.bool,
   /**
    * If `dense`, will adjust vertical spacing. This is normally obtained via context from
    * FormControl.
    */
   margin: PropTypes.oneOf(['dense']),
   /**
    * @ignore
    */
   muiFormControl: PropTypes.object,
   /**
    * If `true`, the helper text should use required classes key.
    */
   required: PropTypes.bool,
   /**
    * The variant to use.
    */
   variant: PropTypes.oneOf(['standard', 'outlined', 'filled']),
};

InputLableInlineWrapper.defaultProps = {
   component: 'tr',
};

export default withStyles(styles, { name: 'MuiFormInputLableInlineWrapper' })(
   withFormControlContext(InputLableInlineWrapper),
);
