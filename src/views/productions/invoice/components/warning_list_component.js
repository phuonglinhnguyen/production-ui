import React from 'react';

import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import Divider from 'material-ui/Divider';

import { I18n } from 'react-redux-i18n';

import TableX from '../../../../components/common/table-x/components/table';

class WarningListComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        {
          name: 'section_name',
          title: I18n.t('productions.keying_invoice.section_name'),
          sort: true,
          style: { width: 100 }
        },
        {
          name: 'section_index',
          title: I18n.t('productions.keying_invoice.item_index'),
          sort: true,
          style: { width: 30 }
        },
        {
          name: 'field_name',
          title: I18n.t('productions.keying_invoice.field_name'),
          sort: true,
          style: { width: 100 }
        },
        {
          name: 'warning_detail',
          title: I18n.t('productions.keying_invoice.warning_detail'),
          sort: true,
          style: { width: 300 }
        }
      ]
    };
  }
  render() {
    const {
      Translate,
      muiTheme,
      action_closeWarningList,
      action_warning_list = () => undefined,
      warning_field,
      warning_list
    } = this.props;
    const actions = [
      <FlatButton
        label="Cancel"
        primary={true}
        onClick={() => action_closeWarningList()}
      />,
      <FlatButton
        label={'Ok'}
        keyboardFocused={true}
        primary={true}
        onClick={() => {
          action_closeWarningList();
          action_warning_list();
        }}
      />
    ];

    return (
      <Dialog
        title={<Translate value="productions.keying_invoice.warning_title" />}
        titleStyle={{ marginTop: 24 }}
        actions={actions}
        modal={false}
        open={true}
        contentStyle={{ width: 800 }}
        onRequestClose={() => action_closeWarningList()}
      >
        <div>
          <Divider />
          {warning_field.map((_w, i) => (
            <div key={`warning-item-${i}`}>{_w}</div>
          ))}
          {warning_field.length === 0 && (
            <TableX
              columns={this.state.columns}
              datas={warning_list || []}
              muiTheme={muiTheme}
              multiSelectable={false}
              paging={true}
              pagingPosition={'bottom'}
              ref="table"
              searchHintText={'Search'}
              selectable={false}
              showIndex={true}
              showRowHover={false}
              tableStyle={{
                bodyStyle: { maxHeight: '300px' }
              }}
            />
          )}
        </div>
      </Dialog>
    );
  }
}

export default WarningListComponent;
