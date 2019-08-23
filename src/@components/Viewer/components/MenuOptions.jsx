import React, { useState } from 'react'
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconSettings from '@material-ui/icons/Settings'
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {  IconButton, Popover, withStyles } from '@material-ui/core'
import Slider, { defaultValueReducer } from '@material-ui/lab/Slider';
import { cancelEvent } from '../utils';
const ITEM_HEIGHT = 48;
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

const options = [
   {
      name: 'draw',
      title: 'Drawing Grid',
   },
   {
      name: 'focusField',
      title: 'Focus Field',
   },
   {
      name: 'focusLine',
      title: 'Focus Line',
   }
]

const MenuOptions = (props) => {
   const { config, onChange, classes } = props
   const [anchor, setAnchor] = useState()
   const handleOpen = (isOpen) => (event) => {
      cancelEvent(event)
      if (isOpen) {
         setAnchor(event.currentTarget)
      } else {
         setAnchor()
      }
   }
   const handleChange = name => event => {
      cancelEvent(event)
      onChange({ key: name, value: event.target.checked })
   };
   return (
      <React.Fragment>
         <IconButton size="small" onMouseDown={handleOpen(true)}><IconSettings fontSize="small" /></IconButton>
         <Menu
            id="long-menu"
            anchorEl={anchor}
            open={Boolean(anchor)}
            onClose={handleOpen(false)}
            PaperProps={{
               style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: 200,
               },
            }}
         >
            {options.map(option => (
               <MenuItem key={option.name}
                  onMouseDown={event => {
                     cancelEvent(event);
                     onChange({ key: option.name, value: !Boolean(config[option.name]) })
                     }
                  }>
                  <FormControlLabel
                     control={
                        <Checkbox
                           checked={Boolean(config[option.name])}
                           // onChange={handleChange(option.name)}
                           // value={option.name}
                        />
                     }
                     label={option.title}
                  />
               </MenuItem>
            ))}
         </Menu>
      </React.Fragment>
   )
}
export default React.memo(withStyles(styles)(MenuOptions));

