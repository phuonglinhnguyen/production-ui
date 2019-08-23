import * as React from 'react'
import { isEqual } from 'lodash';
import { I18n } from 'react-redux-i18n'
import TableX from '../../../../components/common/table-x/components/table';

import NoTaskComponent from './notask_component'
import RaisedButton  from 'material-ui/RaisedButton'
export class BatchDetail extends React.Component {
    state = {
        columns: [
          {
            name: 'id',
            title: I18n.t('productions.rework_batch.doc_id'),
            style: { width: "20%" },
            sort: true
          },
          {
            name: 'doc_uri',
            title: I18n.t('productions.rework_batch.path'),
            style: { width: "50%" },
            align_right: false,
            sort: true
          },{
            name: 'layout_name',
            title: I18n.t('productions.rework_batch.layout_name'),
            style: { width: "10%" },
            align_right: false,
            sort: true
          },
          {
            name: 'section_name',
            title: I18n.t('productions.rework_batch.section'),
            style: { width: "10%" },
            align_right: true,
            sort: true
          },{
            name: 'user',
            title: I18n.t('productions.rework_batch.username'),
            style: { width: "10%" },
            align_right: true,
            sort: true
          }
        ]
      };
      render() {
        const { data, is_error, muiTheme, onSelectBatch, selectTasks } = this.props;
        const { columns } = this.state;
        return (
          <TableX
            muiTheme={muiTheme}
            columns={columns}
            datas={data.docs || []}
            paging={true}
            showRowHover={true}
            ref="table"
            search_keys={['batch_name']}
            multiSelectable={false}
            showIndex={true}
            pagingPosition={'bottom'}
            searchHintText={'Search'}
            selectable={false}
            tableActions={() => (
                <RaisedButton
                  label="Back To List"
                  primary={true}
                  onClick={event=>{selectTasks()}}
                />
              )}
            tableStyle={{
              bodyStyle: { height: window.innerHeight - 326, overflowY: 'scroll' },
              headerStyle: { marginRight: 16 }
            }}
          />
        );
      }
}




