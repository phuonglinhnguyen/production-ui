import React, { useState } from 'react'
import { Button, IconButton, Popover, withStyles } from '@material-ui/core'
import Slider, { defaultValueReducer } from '@material-ui/lab/Slider';
import { cancelEvent } from '../utils';

const styles = (theme) => {
   return {
      paper: {
         padding: theme.spacing.unit,
         height: 100,
         width: 40,
         overflow: 'hidden'
      },
      root: {
         display: 'flex',
         height: 70,
      },
      slider: {
         padding: '8px 20px',
      },
   }
}
function valueReducer(rawValue, props, event) {
   const { disabled, max, min, step } = props;
 
   function roundToStep(number) {
     return Math.round(number / step) * step;
   }
 
   if (!disabled && step) {
     if (rawValue > min && rawValue < max) {
       if (rawValue === max - step) {
         // If moving the Slider using arrow keys and value is formerly an maximum edge value
         return roundToStep(rawValue + step / 2);
       }
       if (rawValue === min + step) {
         // Same for minimum edge value
         return roundToStep(rawValue - step / 2);
       }
       return roundToStep(rawValue);
     }
     return rawValue;
   }
 
   return defaultValueReducer(rawValue, props, event);
 }
const RotateTangle = (props) => {
   const { tangle, onChange ,classes } = props
   const [anchor, setAnchor] = useState()
   const handleOpen = (isOpen) => (event) => {
      cancelEvent(event)
      if (isOpen) {
         setAnchor(event.currentTarget)
      } else {
         setAnchor()
      }
   }
   return (
      <React.Fragment>
         <IconButton size="small" title={'Tangle'} onMouseDown={handleOpen(true)}>{tangle / 100}</IconButton>
         <Popover
            classes={{
               paper: classes.paper,
            }}
            open={Boolean(anchor)}
            anchorEl={anchor}
            anchorOrigin={{
               vertical: 'top',
               horizontal: 'left',
            }}
            transformOrigin={{
               vertical: 'bottom',
               horizontal: 'left',
            }}
            onClose={handleOpen(false)}
            disableRestoreFocus
         >
            <div className={classes.root}>
               <Slider
                  valueReducer={valueReducer}
                  classes={{ container: classes.slider }}
                  min={0}
                  max={9000}
                  step={1}
                  vertical
                  value={tangle}
                  aria-labelledby="label"
                  onChange={(event, value) => { onChange(value) }}
               />
            </div>
         </Popover>
      </React.Fragment>
   )
}
export default React.memo(withStyles(styles)(RotateTangle));

