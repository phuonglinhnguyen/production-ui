import React from 'react';

import ReactTable from 'react-table';
import CheckboxTableComponent from './check_box';

import { findIndex, differenceBy } from 'lodash';

import 'react-table/react-table.css';
import './style.css';
const makeDefaultState = () => ({
  sorted: [],
  page: 0,
  pageSize: 10,
  expanded: {},
  resized: [],
  filtered: [],
  selection: [],
  selectAll: false
});

class DocumentTableComponent extends React.Component {
  constructor() {
    super();
    this.state = makeDefaultState();
    this.renderCheckboxHeader = this.renderCheckboxHeader.bind(this);
    this.checkSelected = this.checkSelected.bind(this);
    this.getSelectedData = this.getSelectedData.bind(this);
  }

  checkSelected(table_id) {
    const { selection } = this.state;
    let index = findIndex(selection, _s => _s.table_id === table_id);

    return index > -1;
  }

  clickCheckbox(data, checked) {
    let { selection } = this.state;
    if (checked) {
      let new_data = differenceBy(selection, [data], 'table_id');
      this.setState({
        selection: new_data
      });
      return;
    } else {
      selection.push(data);
      this.setState({
        selection: selection
      });
      return;
    }
  }

  getSelectedData() {
    return this.state.selection;
  }

  renderCheckboxHeader() {
    return <CheckboxTableComponent />;
  }

  renderCheckboxBody(d) {
    let checked = this.checkSelected(d.original.table_id);
    return (
      <CheckboxTableComponent
        checked={checked}
        data={d.original}
        action_selectCheckbox={data => {
          this.clickCheckbox(data, checked);
        }}
      />
    );
  }

  render() {
    const {
      // Translate,
      action_cellClick,
      action_renderAction,
      datas,
      header,
      // muiTheme,
      show_image
    } = this.props;
    return (
      <React.Fragment>
        {action_renderAction()}
        <ReactTable
          ref={r => (this.checkboxTable = r)}
          filterable={true}
          pageSizeOptions={[10, 20, 50, 100, 200]}
          defaultFilterMethod={(filter, row) => {
            let value_data = row[filter.id] || '';
            let filter_value = filter.value || '';
            return value_data
              .toLowerCase()
              .includes(filter_value.toLowerCase());
          }}
          columns={[
            {
              Header: '',
              accessor: 'table_id',
              Cell: d => this.renderCheckboxBody(d),
              sortable: false,
              filterable: false,
              minWidth: 50
            },
            ...header
          ]}
          data={datas}
          style={{
            height: show_image
              ? window.innerHeight - 626
              : window.innerHeight - 226,
            width: window.innerWidth,
            textAlign: 'right',
            borderRight: 'none'
          }}
          // Controlled props
          sorted={this.state.sorted}
          page={this.state.page}
          pageSize={this.state.pageSize}
          expanded={this.state.expanded}
          resized={this.state.resized}
          filtered={this.state.filtered}
          // Callbacks
          onSortedChange={sorted => this.setState({ sorted })}
          onPageChange={page => this.setState({ page })}
          onPageSizeChange={(pageSize, page) =>
            this.setState({ page, pageSize })
          }
          onExpandedChange={expanded => this.setState({ expanded })}
          onResizedChange={resized => this.setState({ resized })}
          onFilteredChange={filtered => this.setState({ filtered })}
          getTdProps={(state, rowInfo, column, instance) => {
            return {
              onClick: e => {
                if (!rowInfo || column.id === 'table_id') return;
                action_cellClick(rowInfo.original, e);
              }
            };
          }}
        />
      </React.Fragment>
    );
  }
}

export default DocumentTableComponent;
