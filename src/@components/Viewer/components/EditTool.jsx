import React, { useState } from 'react'
import IconButton from '@material-ui/core/IconButton';
import IconEdit from '@material-ui/icons/Edit'
import AddCircle from '@material-ui/icons/AddCircle'
import IconVisibility from '@material-ui/icons/Visibility'
import { withStyles } from '@material-ui/core';

import { cancelEvent } from '../utils';
const styles = theme => {
   return {

   };
}

const EditTool = (props) => {
   const { draw_polyline, onChange, classes } = props;
   const {edit,adding ,disableAdd} =draw_polyline
   const handleChange = (name, value) => event => {
      cancelEvent(event)
      onChange({ key: name, value: value })
   };
   return (
      <React.Fragment>
         <IconButton disabled={adding} onMouseDown={handleChange("edit", !edit)}>{edit?<IconVisibility fontSize="small"/>: <IconEdit fontSize="small" />}</IconButton>
         {edit&&<IconButton  disabled={adding||disableAdd} onMouseDown={handleChange("adding", !adding)}><AddCircle fontSize="small" /></IconButton>}
         {/* <IconButton aria-label="Delete" size="small" onMouseDown={handleChangeRotateStep(rotate.step - 1)} ><IconTotateLeft fontSize="small" /></IconButton> */}
         {/* <IconButton aria-label="Delete" size="small" onMouseDown={handleChangeRotateStep(rotate.step + 1)} ><IconTotateRight fontSize="small" /></IconButton> */}
      </React.Fragment>
   )
}
export default React.memo(withStyles(styles)(EditTool));




