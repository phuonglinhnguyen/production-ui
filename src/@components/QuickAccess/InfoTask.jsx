import * as React from 'react'
import { darkBlack } from 'material-ui/styles/colors';
import { PageDecorator, getDataObject, crudGetOne } from '@dgtx/coreui';
import { withRouter } from 'react-router'
import { numberForReport } from '../../utils/format_number';
import IconButton from '@material-ui/core/IconButton';
import RefreshIcon from '@material-ui/icons/Refresh';
import Tooltip from '@material-ui/core/Tooltip';
class InfoTask extends React.Component {
   state = {
      hover: false
   }

   componentWillMount = () => {
      const { crudGetOne, match } = this.props;
      let taskKeyDef = getDataObject('params.taskKeyDef', match);
      let projectId = getDataObject('params.projectId', match);
      crudGetOne("user_task_info", { projectId, taskKeyDef }, {
         onSuccess: () => { },
         onFailure: () => { }
      })
   }

   componentDidMount() {
      const { crudGetOne, match } = this.props;
      let taskKeyDef = getDataObject('params.taskKeyDef', match);
      let projectId = getDataObject('params.projectId', match);
      // this.timer = setInterval(() => {
      //    crudGetOne("user_task_info", { projectId, taskKeyDef }, {
      //       onSuccess: () => { },
      //       onFailure: () => { }
      //    })
      // }, 30000);
   }

   handleClickRefresh = () => {
      const { crudGetOne, match } = this.props;
      const { hover } = this.state;
      let taskKeyDef = getDataObject('params.taskKeyDef', match);
      let projectId = getDataObject('params.projectId', match);
      crudGetOne("user_task_info", { projectId, taskKeyDef }, {
         onSuccess: () => { },
         onFailure: () => { }
      })
   }

   handleHoverOver = () => {
      this.setState({ hover: true });
   }

   handleHoverOut = () => {
      this.setState({ hover: false });
   }

   render() {
      const { docName, batchName, data, ids } = this.props;
      const { hover } = this.state;
      const item = data[`${ids[0]}`] || {};
      const { total_document = 0, total_characters = 0, speed = 0 } = item;
      return (
         <div style={{
            padding: '1px 0px 1px 16px',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
         }}>
            <table>
               <tr>
                  <td><span style={{ color: darkBlack }}>Batch Name: </span>{batchName}</td>
                  <td>
                     <span style={hover ? { color: 'red' } : { color: darkBlack }}>
                        Total Characters:
                        {numberForReport(total_characters)}
                     </span>
                  </td>
                  <td><span style={hover ? { color: 'red' } : { color: darkBlack }}>
                     Speed: {speed.toFixed(2)}</span></td>
               </tr>

               <tr>
                  <td><span style={{ color: darkBlack }}>Doc  Name:  </span>{docName}</td>
                  <td><span style={hover ? { color: 'red' } : { color: darkBlack }}>Total Doc: {numberForReport(total_document)}</span></td>
                  <td onMouseOver={this.handleHoverOver} onMouseOut={this.handleHoverOut}>
                     <Tooltip title="Overall working daily report" aria-label="Refresh">
                        <IconButton
                           aria-label="Refresh" color="primary"
                           onClick={this.handleClickRefresh}
                           onMou
                        >
                           <RefreshIcon fontSize="small" />
                        </IconButton>
                     </Tooltip>
                  </td>
               </tr>
            </table>
         </div>
      )
   }
}
export default withRouter(PageDecorator({
   resources: [
      { name: 'user_task_info' },
   ],
   actions: {
      crudGetOne
   },
   mapState: (state) => {
      return {
         data: getDataObject('core.resources.user_task_info.data', state) || {},
         ids: getDataObject('core.resources.user_task_info.list.ids', state) || []
      }
   }
})(InfoTask))