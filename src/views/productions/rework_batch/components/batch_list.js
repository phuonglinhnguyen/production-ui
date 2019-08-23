import * as React from 'react'
import { isEqual } from 'lodash';
import { I18n } from 'react-redux-i18n'
import TableX from '../../../../components/common/table-x/components/table';
import NoTaskComponent from './notask_component'
import RaisedButton from 'material-ui/RaisedButton'
import FlatButton from 'material-ui/FlatButton'
export class BatchList extends React.Component {
  // shouldComponentUpdate(nextProps) {
  //   return (
  //     !isEqual(nextProps.muiTheme.palette, this.props.muiTheme.palette) ||
  //     !isEqual(nextProps.datas, this.props.datas)
  //     // !isEqual(nextProps.is_error, this.props.is_error)
  //     // !isEqual(nextProps.selectedTasks, this.props.selectedTasks)
  //   );
  // }
  render() {
    const { datas, is_error,isSaving, muiTheme, onSelectBatch, selectedTasks, selectTasks, onSubmit } = this.props;
    if (is_error || datas.length === 0) {
      return <NoTaskComponent />;
    }
  let disabledSave = !(selectedTasks.length>0&&selectedTasks.every((item)=>item.totalDocRework>0))

  const columns = [
      {
        name: 'batchId',
        title: I18n.t('productions.rework_batch.batch_id'),
        sort: true
      },
      {
        name: 'batchName',
        title: I18n.t('productions.rework_batch.batch_name'),
        sort: true
      },
      {
        name: 'totalDoc',
        title: I18n.t('productions.rework_batch.total_doc'),
        align_right: true,
        sort: true
      }, {
        name: 'totalDocRework',
        title: I18n.t('productions.rework_batch.total_doc_rework'),
        align_right: true,
        sort: true
      },
       {
        name: 'status',
        title: I18n.t('productions.rework_batch.status'),
        align_right: true,
        sort: true,
        render:(batch)=>{
          if(batch.status === 0){
            return <span style={{color:'green'}}> Ready</span>
          }else{
            return <span>Not Ready</span>
          }
        }
      },
      {
        name: 'actions',
        title: I18n.t('productions.rework_batch.actions'),
        align_right: true,
        sort: false,
        render:(batch)=>{
          return (
            <FlatButton
              label={I18n.t('productions.rework_batch.btn_detail')}
              title={I18n.t('productions.rework_batch.btn_detail')}
              primary={true}
              onClick={event => onSelectBatch(batch)}
            />
          ) 
        }
      }
    ]

    return (
      <TableX
        // action_cellClick={(...p) => onSelectBatch(p[2])}
        muiTheme={muiTheme}
        columns={columns}
        // onCheckRows={(...param)=>{
        //   console.log('==============paramparamparam======================');
        //   console.log(param);
        //   console.log('====================================');
        // }}
        onCheckRows={selectTasks}
        datas={datas || []}
        paging={true}
        showRowHover={true}
        ref="table"
        search_keys={['batchName','batchId']}
        multiSelectable={true}
        showIndex={true}
        pagingPosition={'bottom'}
        searchHintText={'Search'}
        selectable={true}
        tableActions={() => {
          return  (
            <div>
              <RaisedButton
              disabled={(selectedTasks.length===0)||isSaving}
                style={{ marginRight: 5 }}
                label={I18n.t('productions.rework_batch.btn_submit_close')}
                secondary={true}
                onClick={event => { onSubmit('close') }}
              />
              <RaisedButton
              disabled={disabledSave||isSaving}
                label={I18n.t('productions.rework_batch.btn_submit_rework')}
                primary={true}
                onClick={event => { onSubmit('rework') }}
              />
            </div>
          )
        }
        }
        tableStyle={{
          bodyStyle: { height: window.innerHeight - 326, overflowY: 'scroll' },
          headerStyle: { marginRight: 16 }
        }}
      />
    );
  }
}




