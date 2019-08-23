import React from 'react';
import { isEqual } from 'lodash';
import { I18n } from 'react-redux-i18n';

import TableX from '../../../../components/common/table-x/components/table';
import NoTaskComponent from './notask_component';


class BatchTableComponent extends React.Component {
  state = {
    columns: [
      {
        name: 'batch_id',
        title: I18n.t('productions.data_viewer.batch_id'),
        sort: true
      },
      {
        name: 'batch_name',
        title: I18n.t('productions.data_viewer.batch_name'),
        sort: true
      },
      {
        name: 'count',
        title: I18n.t('productions.data_viewer.total_doc'),
        align_right: true,
        sort: true
      }
    ]
  };

  shouldComponentUpdate(nextProps) {
    return (
      !isEqual(nextProps.muiTheme.palette, this.props.muiTheme.palette) ||
      !isEqual(nextProps.datas, this.props.datas)
    );
  }

  render() {
    const { datas, is_error, muiTheme, action_selectBatch } = this.props;
    const { columns } = this.state;
    if (is_error || datas.length === 0) {
      return <NoTaskComponent />;
    }
    return (
      <TableX
        action_cellClick={(...p) =>{
          action_selectBatch(p[2])
        } }
        action_onRowClick={(index,data,event)=>{
          action_selectBatch(data)
        }}
        muiTheme={muiTheme}
        columns={columns}
        datas={datas || []}
        paging={true}
        showRowHover={true}
        ref="table"
        search_keys={['batch_name','batch_id']}
        multiSelectable={false}
        showIndex={true}
        pagingPosition={'bottom'}
        searchHintText={'Search'}
        selectable={false}
        tableStyle={{
          bodyStyle: { height: window.innerHeight - 326, overflowY: 'scroll' },
          headerStyle: { marginRight: 16 }
        }}
      />
    );
  }
}

export default BatchTableComponent;
