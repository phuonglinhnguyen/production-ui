// @flow strict
import * as React from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core'
import { isFilled, isAdornedStart } from '@material-ui/core/InputBase/utils';
import { isMuiElement } from '@material-ui/core/utils/reactHelpers';
import FormControlContext from '@material-ui/core/FormControl/FormControlContext';

type Props = {
   children: any,
   classes: Object,
   className: string,
   component: any,
   disabled: boolean,
   error: boolean,
   fullWidth: boolean,
   margin: 'none' | 'dense' | 'normal',
   required: boolean,
   variant: 'standard' | 'inlined' | 'cell',
};


export const styles = {
   /* Styles applied to the root element. */
   root: {
      display: 'inline-flex',
      flexDirection: 'column',
      position: 'relative',
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


@withStyles(styles, { name: 'MuiFormControl' })
class FormControl extends React.Component<Props> {
   static getDerivedStateFromProps(props, state) {
      if (props.disabled && state.focused) {
         return { focused: false };
      }
      return null;
   }
   constructor(props: Props) {
      super(props);
      this.state = {
         adornedStart: false,
         filled: false,
         focused: false,
      };
      const { children } = props;
   }

   handleFocus = () => {
      this.setState(state => (!state.focused ? { focused: true } : null));
   };

   handleBlur = () => {
      this.setState(state => (state.focused ? { focused: false } : null));
   };

   handleDirty = () => {
      if (!this.state.filled) {
         this.setState({ filled: true });
      }
   };

   handleClean = () => {
      if (this.state.filled) {
         this.setState({ filled: false });
      }
   };

   render() {
      const {
         classes,
         className,
         component: Component,
         disabled,
         error,
         fullWidth,
         margin,
         required,
         variant,
         ...other
      } = this.props;;
      const { adornedStart, filled, focused } = this.state;

      const childContext = {
         adornedStart,
         disabled,
         error,
         filled,
         focused,
         margin,
         onBlur: this.handleBlur,
         onEmpty: this.handleClean,
         onFilled: this.handleDirty,
         onFocus: this.handleFocus,
         required,
         variant,
      };
      return (
         <FormControlContext.Provider value={childContext}>
            <Component
               className={classNames(
                  classes.root,
                  {
                     [classes.fullWidth]: fullWidth,
                  },
                  className,
               )}
               {...other}
            />
         </FormControlContext.Provider>
      );
   }
}
FormControl.defaultProps = {
   component: 'div',
   disabled: false,
   error: false,
   fullWidth: false,
   margin: 'none',
   required: false,
   variant: 'standard',
};

export default FormControl;