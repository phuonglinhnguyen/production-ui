import * as React from 'react';
import { PageDecorator, getDataObject } from '@dgtx/coreui';
import { withRouter } from 'react-router'
import user_working_dialog_state from './user_working_dialog_state_reducer'
import { handleHideWorkingDetail, loadDataWorkingDetail } from './actions'
import LinearProgress from '@material-ui/core/LinearProgress';
import { withStyles } from '@material-ui/core';
import Tooltip from '@material-ui/core/Tooltip';
import Dialog from '@material-ui/core/Dialog';
import { Translate } from 'react-redux-i18n';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import * as convertData from './user_working_convert_data'
import { TablePlus } from '@dgtx/core-component-ui'
import * as Lodash from 'lodash'
import Typography from '@material-ui/core/Typography';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
const styles = (theme) => {
   return {
      table: {
         minWidth: 700,
      },
      btn_refresh_wp: {
         // position: 'absolute',
         // top: '14px',
         // right: '14px',
      },
      btn_refresh: {
         color: "red"
      },
      chip_warning: {
         margin: theme.spacing.unit,
         background: 'rgba(255,179,0,7)',
         color: "#FFFFFF",
      }
   }
}
let i18nModule = (key) => `reports.working_detail.${key}`
const viewActionInRowTable = {
   checkbox: false,
   function: false,
   removeAll: false,
   search: true,
   toolbar: true
}
const columnsTable = convertData.convertColumnsData();
const columnsSearchTable = convertData.convertColumnsSearch();



class WorkingDetail extends React.Component<Props> {
   state = {
      dataTable: []
   }

   componentWillMount = () => {
      const { loadDataWorkingDetail, match, user_working } = this.props;
      let projectId = getDataObject('params.projectId', match);
      let taskKeyDef = getDataObject('params.taskKeyDef', match);
      loadDataWorkingDetail(projectId, taskKeyDef);
      let nextData = getDataObject('data', user_working) || {};
      let nextIds = getDataObject('list.ids', user_working) || [];
      let dataTable = [];
      if (!Lodash.isEmpty(nextData)) {
         nextIds.map((item) => {
            dataTable.push(convertData.createRowsData(nextData[`${item}`]));
         })
         this.setState({
            dataTable
         })
      }
   }

   componentWillUnmount = () => {
      this.setState({
         dataTable: []
      })
   }

   componentWillReceiveProps = (nextProps) => {
      let nextData = getDataObject('user_working.data', nextProps) || {};
      let nextIds = getDataObject('user_working.list.ids', nextProps) || [];
      let currentData = this.state.dataTable;
      let dataTable = [];
      if (!Lodash.isEmpty(nextData)) {
         nextIds.map((item) => {
            dataTable.push(convertData.createRowsData(nextData[`${item}`]));
         })
         if (!Lodash.isEqual(dataTable, currentData)) {
            this.setState({
               dataTable,
               listCheckedItem: [],
            })
         }
      }

   }
   // shouldComponentUpdate(nextProps: Props, nextState: TM_STATE_TYPE) {

   // }

   componentWillUpdate(nextProps: Props, nextState: TM_STATE_TYPE) {

   }

   componentDidUpdate(prevProps: Props, prevState: TM_STATE_TYPE) {

   }

   componentWillUnmount() {

   }

   handleSearchTable = columns => (data, value) => {
      let arraykeysearch = value.toLowerCase().split(',').map(item => item.trim());
      let keys = arraykeysearch.filter(item => { return item !== '' });
      return data.filter(item => {
         for (let index = 0; index < columns.length; index++) {
            let clo_name = columns[index].name;
            let valueCheck = item[clo_name] && item[clo_name].toString().toLowerCase()
            for (let key of keys) {
               if (valueCheck && valueCheck.includes(key)) {
                  return true;
               }
            }
         }
      });
   }

   handleClose = () => {

   }
   render() {
      const {
         match,
         classes,
         username,
         user_working,
         user_working_detail,
         loadDataWorkingDetail,
         handleHideWorkingDetail,
         user_working_dialog_state,
      } = this.props;
      let fetching = getDataObject('state.fetching', user_working_detail);
      let taskKeyDef = getDataObject('params.taskKeyDef', match);
      let projectId = getDataObject('params.projectId', match);
      const { dataTable } = this.state;
      return (
         <Dialog
            open={!!user_working_dialog_state.show}
            onClose={_ => { handleHideWorkingDetail() }}
            maxWidth={false}
            aria-labelledby="working-detail-dialog-title"
         >
            {fetching ? <LinearProgress /> : ''}
            <TablePlus
               onSearch={this.handleSearchTable(columnsSearchTable)}
               columns={columnsTable}
               data={dataTable}
               onSelect={this.handleCheckboxTable}
               selected={[]}
               viewActionInRows={viewActionInRowTable}
               nameTable={
                  <div style={{display: 'flex', lineHeight: '64px'}}>
                     <Typography color="inherit" variant="h5" style={{lineHeight: '64px'}}>{<Translate dangerousHTML value={i18nModule('title_working_detail')} username={username} />}</Typography>
                     <div className={classes.btn_refresh_wp}>
                        <Tooltip title="Refresh" aria-label="Refresh">
                           <IconButton disabled={fetching} aria-label="Refresh" color="primary" className={classes.color}
                              onClick={_ => { loadDataWorkingDetail(projectId, taskKeyDef) }}>
                              <RefreshIcon fontSize="small" />
                           </IconButton>
                        </Tooltip>
                     </div>
                  </div>
               }
               rowsPerPageOptions={[20, 50, 100]}
               rowsPerPage={20}
               width_default={952}
               width_item={100}
               height_table={630}
               isHover={true}
               buttonActionInToolbar={undefined}
               buttonActionsInRow={undefined}
               onClickRow={undefined}
               onClickCell={undefined}
               onGetStyleCell={undefined}
               refName={undefined}
            />

            <DialogActions>
               <Button 
               onClick={_ => { handleHideWorkingDetail() }}
               color="primary">
                  Close
               </Button>
            </DialogActions>
         </Dialog >
      );
   }
}

export default withRouter(
PageDecorator({
   resources: [{ name: 'user_working_detail' }, user_working_dialog_state],
   actions: {
      handleHideWorkingDetail,
      loadDataWorkingDetail
   },
   mapState: (state) => ({
      username: getDataObject('user.user.username', state),
      user_working: getDataObject('core.resources.user_working_detail', state),
      user_working_dialog_state: getDataObject('core.resources.user_working_dialog_state.data', state) || {}
   })
})(withStyles(styles, { withTheme: true })(WorkingDetail)))
;