import React from 'react';
import ReactDOM from 'react-dom';
import warning from 'warning';
import PropTypes from 'prop-types';
import { Input, FormControl, InputLabel, FormHelperText } from '@material-ui/core'

export default class TextFieldInline extends React.Component {
   constructor(props) {
      super(props);
      this.labelRef = React.createRef();
   }
   render() {
      const {
         autoComplete,
         autoFocus,
         children,
         className,
         defaultValue,
         error,
         FormHelperTextProps,
         fullWidth,
         helperText,
         id,
         InputLabelProps,
         inputProps,
         InputProps,
         inputRef,
         label,
         multiline,
         name,
         onBlur,
         onChange,
         onFocus,
         placeholder,
         required,
         rows,
         rowsMax,
         select,
         SelectProps,
         type,
         value,
         variant,
         ...other
      } = this.props;
      const helperTextId = helperText && id ? `${id}-helper-text` : undefined;

      const InputElement = (
         <Input
            autoComplete={autoComplete}
            autoFocus={autoFocus}
            defaultValue={defaultValue}
            fullWidth={fullWidth}
            multiline={multiline}
            name={name}
            rows={rows}
            rowsMax={rowsMax}
            type={type}
            value={value}
            id={id}
            inputRef={inputRef}
            onBlur={onBlur}
            onChange={onChange}
            onFocus={onFocus}
            placeholder={placeholder}
            inputProps={inputProps}
            //   {...InputMore}
            {...InputProps}
         />
      );
      return (
         <FormControl
            aria-describedby={helperTextId}
            className={className}
            error={error}
            fullWidth={fullWidth}
            required={required}
            variant={variant}
            {...other}
         >
            {
               InputElement
            }
            {helperText && (
               <FormHelperText id={helperTextId} {...FormHelperTextProps}>
                  {helperText}
               </FormHelperText>
            )}
         </FormControl>
      );
   }

}