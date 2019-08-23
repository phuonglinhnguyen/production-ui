import React from 'react'
import classNames from 'classnames';
import { withStyles } from '@material-ui/core'
import { capitalize } from '@material-ui/core/utils/helpers';
export const styles = {
   /* Styles applied to the root element. */
   root: {
     display: 'inline-flex',
     flexDirection: 'column',
     position: 'relative',
     // Reset fieldset default style.
     minWidth: 0,
     padding: 0,
     margin: 0,
     border: 0,
     verticalAlign: 'top', // Fix alignment issue on Safari.
   },
   /* Styles applied to the root element if `margin="normal"`. */
   marginNormal: {
     marginTop: 16,
     marginBottom: 8,
   },
   /* Styles applied to the root element if `margin="dense"`. */
   marginDense: {
     marginTop: 8,
     marginBottom: 4,
   },
   /* Styles applied to the root element if `fullWidth={true}`. */
   fullWidth: {
     width: '100%',
   },
 };


const WrapperCell = (props) => {
   const {
      disabled,
      error,
      fullWidth,
      margin,
      required,
      variant,
      filled,
      focused,
      className,
       ...other } = props;
   return (
      <div
         className={classNames(
            classes.root,
            {
               [classes[`margin${capitalize(margin)}`]]: margin !== 'none',
               [classes.fullWidth]: fullWidth,
            },
            className,
         )}
         {...other}
      />
   )
}
export default withStyles(styles, { name: 'MuiFormControlWrapperCell' }); 
