import React from 'react'
import compose from 'recompose/compose';
import { connect } from 'react-redux'

import { Toolbar, Typography, IconButton } from '@material-ui/core';
import { withStyles } from '@material-ui/core';
import { Settings } from '@material-ui/icons'
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import HistoryIcon from '@material-ui/icons/History';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import InfoShortCut from './ShortCutInfo';
import HoldInfo from './HoldInfo';
import { bindActionCreators } from 'redux';
import { getDataObject } from '@dgtx/coreui';
import { handleShowWorkingDetail } from '../../views/productions/user_working_detail/actions'
import { withRouter } from 'react-router'
const styles = (theme) => {
   return {
      root: {
         minHeight: '48px',
         display: "flex",
         position: 'relative',
         alignIitems: 'center'
      },
      grow: {
         flexGrow: 1
      },
      menuButton: {
         // position: "absolute",
         // left: '50%',
         // dis
         // top: 0
      },
   };
}


function ToolbarForm(props) {
   const { classes, infoWord, total, showeds, current, handleShowWorkingDetail, match, username } = props;
   return (
      <Toolbar variant="dense" disableGutters={true} style={{ paddingLeft: 14 }}>
         <Typography variant="h6" color="inherit">
            Record: {current + 1}  | {showeds}/{total}
         </Typography>
         <div className={classes.grow} >
         </div>
         <HoldInfo infoWord={infoWord} />
         <div className={classes.grow} >
         </div>
         <div>
            <IconButton color="inherit" aria-label="Menu">
               <Settings />
            </IconButton>
            <IconButton
               aria-owns={'material-appbar'}
               aria-haspopup="true"
               color="inherit"
               onClick={_ => { handleShowWorkingDetail(match.params.projectId, username) }}
            >
               <HistoryIcon />
            </IconButton>
            <InfoShortCut />
         </div>
      </Toolbar>
   )
}

const mapStateToProps = (state) => {
   const { fields=[], recordsTouched={}, current=0 } = getDataObject('core.resources.form.data', state) ||{};
   const {
      task: {
         hold_count,
         comment,
         rework_comment,
         rework } = {}
   } = getDataObject('core.resources.form_state.data', state)||{};
   const username = getDataObject('user.user.username', state)||'';
   return {
      total: fields.length || 1,
      showeds: Object.keys(recordsTouched).length,
      current,
      username,
      infoWord: {
         comment,
         hold_count,
         rework_comment,
         rework,
      },
   }
}
const enhance = compose(
   withRouter,
   connect(
      mapStateToProps,
      (dispatch) => bindActionCreators({ handleShowWorkingDetail }, dispatch), // Avoid connect passing dispatch in props,
   ),
   withStyles(styles, { withTheme: true })
);

export default enhance(ToolbarForm)