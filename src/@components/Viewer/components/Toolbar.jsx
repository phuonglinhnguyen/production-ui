import React, { useState } from 'react';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import IconTotateLeft from '@material-ui/icons/RotateLeft'
import IconTotateRight from '@material-ui/icons/RotateRight'
import { withStyles } from '@material-ui/core';
import { cancelEvent } from '../utils';
import RotateTangle from './RotateTangle'
import MenuOptions from './MenuOptions'
import EditTool from './EditTool'
import Draggable from 'react-draggable';
import { fade,lighten } from '@material-ui/core/styles/colorManipulator';
const styles = theme => {
   return {
      wrapper: {
         bottom: 16,
         left: 'calc(50% - 90px)',
         position: 'absolute',
         textAlign: 'center',
         cursor: 'move',
      },
      bg_base: {
         background: fade("#FFFFFF",0.6),
         // background: 'rgba(0,0,0,0.06)',
         shadow: theme.shadows[12],
         borderRadius: '32px',
         padding:'0px 8px 0px 8px'

      },
      bg_active:{
         // background: 'rgba(0,0,0,0.2)',
         background: fade("#FFFFFF",0.9),
         boxShadow: theme.shadows[24],
         // boxShadow: '4px 6px 4px rgba(0, 0, 0, 0.45)',
         borderRadius: '32px',
         padding:'0px 8px 0px 8px'
      }
   }
}
export const EVENT_TOOLBAR = {
   CHANGE_ROTATE_STEP: "change_rotate_step",
   CHANGE_ROTATE_TANGLE: "change_rotate_tange",
   CHANGE_OPTIONS: "change_options",
   CHANGE_EDIT_POLY: "change_edit_poly",
}


const ToolbarView = (props) => {
   const { classes, config = {}, draw_polyline, rotate = {}, onChange, editable } = props;
   const handleChangeRotateStep = (step) => (event) => {
      cancelEvent(event)
      step = step > 3 ? 0 : step < 0 ? 3 : step;
      onChange(EVENT_TOOLBAR.CHANGE_ROTATE_STEP, step)
   }
   const handleChangeRotateTangle = (tangle) => {
      onChange(EVENT_TOOLBAR.CHANGE_ROTATE_TANGLE, tangle)
   }
   const handleChangeOptions = (data) => {
      onChange(EVENT_TOOLBAR.CHANGE_OPTIONS, data)
   }
   const handleChangeEditPoly = (data) => {
      onChange(EVENT_TOOLBAR.CHANGE_EDIT_POLY, data)
   }
   const [visible,setVisible] = useState(false) 
   return (
      // <Draggable bounds="parent" ref="toolbar">
      <div className={clsx(classes.wrapper, { [classes.bg_base]: !visible ,  [classes.bg_active]: visible})}
          onMouseEnter={()=>{
            setVisible(true)
          }}
          onMouseLeave={()=>{
            setVisible(false)
          }}
      >
         <IconButton aria-label="Delete" size="small" onMouseDown={handleChangeRotateStep(rotate.step - 1)} ><IconTotateLeft fontSize="small" /></IconButton>
         <IconButton aria-label="Delete" size="small" onMouseDown={handleChangeRotateStep(rotate.step + 1)} ><IconTotateRight fontSize="small" /></IconButton>
         <RotateTangle tangle={rotate.tangle || 0} onChange={handleChangeRotateTangle} />
         <MenuOptions config={config} onChange={handleChangeOptions} />
         {editable && <EditTool draw_polyline={draw_polyline} onChange={handleChangeEditPoly} />}
      </div>
      // </Draggable>
   )
}

export default React.memo(withStyles(styles)(ToolbarView))
