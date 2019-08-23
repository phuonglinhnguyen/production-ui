import React from 'react';
import { isEqual } from 'lodash';

import Popover from 'material-ui/Popover/Popover';
import { Menu, MenuItem } from 'material-ui/Menu';
import RaisedButton from 'material-ui/RaisedButton';

// import TableX from '../../../../components/common/table-x/components/table';
import NoTaskComponent from './notask_component';
import TableDocument from './table/table'
// import ReactTable from 'react-table'

// import FilterIcon from 'material-ui/svg-icons/content/filter-list';

import DialogRework from './dialog_rework_component';
import DialogApprove from './dialiog_approve_component';

import exportFromJSON from 'export-from-json'
// import "react-table/react-table.css";

// import checkboxHOC from "react-table/lib/hoc/selectTable";

// const CheckboxTable = checkboxHOC(ReactTable);

class DocumentTableComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      anchorEl: null,
      open: false,
      item: {
        s2_url: []
      },
      open_dialog: false,
      open_dialog_approve: false,
      open_filter: false,

      itemSelected: [],
      document_datas: null,
      original_datas: []
    };

    this._addRefTable = this._addRefTable.bind(this);
    this.actionCellClick = this.actionCellClick.bind(this);
    this.getSelectedBatches = this.getSelectedBatches.bind(this);
  }
  shouldComponentUpdate(nextProps, nextState) {
    for (let key in nextProps) {
      if (nextProps.hasOwnProperty(key)) {
        if (
          !key.includes('action') &&
          !isEqual(nextProps[key], this.props[key])
        ) {
          return true;
        }
      }
    }
    for (let key_state in nextState) {
      if (!isEqual(nextState[key_state], this.state[key_state])) {
        return true;
      }
    }

    return false;
  }

  componentWillReceiveProps(nextProps) {
    if (Array.isArray(nextProps.datas)) {
      const documents = nextProps.datas;
      this.setState({
        document_datas: [...documents],
        original_datas: [...documents]
      });
    }
  }

  _addRefTable(node) {
    this._table = node;
  }

  getSelectedBatches() {
    if (this._table) {
      return this._table.getSelectedData();
    }
    return [];
  }

  actionCellClick(data, e) {
    this.setState({
      open: true,
      anchorEl: e.currentTarget,
      item: data
    });
  }

  ExportData2Excel() {
    const { datas, fields, header, batch_datas, project_name } = this.props;
    let data = [];
    if(!datas || datas.length === 0) return;
    for (let row of datas) {
      let temp = {};
      header.forEach(h => {
        temp[h.Header] = row[h.accessor];
        if ((h.Header === "date") && (typeof h.accessor === 'function')) {
          temp[h.Header] = h.accessor(row);
        }
      })
      data.push(temp);
    }
    const fileName = `export_viewKeyData_PJ_${project_name}${data[0]["Batch name"]}_${Date.now().toString()}`
    const exportType = 'csv'

    exportFromJSON({ data, fileName, exportType })

  }


  renderAction() {
    return (
      <React.Fragment>
        {/* <RaisedButton icon={<FilterIcon />} secondary={true} /> */}
        <RaisedButton
          label="Approve all"
          onClick={() => {
            this.setState({ open_dialog_approve: true });
          }}
          primary={true}
          style={{ margin: 5 }}
        />
        <RaisedButton
          label="Rework"
          onClick={() => {
            if (this.getSelectedBatches().length === 0) {
              return;
            }
            this.setState({ open_dialog: true });
          }}
          secondary={true}
        />
        <RaisedButton
          label="Export CSV"
          primary={true}
          onClick={() => {
            this.ExportData2Excel();
          }
          }
          style={{ margin: 5 }}
        />
      </React.Fragment>
    );
  }

  render() {
    const {
      Translate,
      action_openCloseImageViewer,
      action_saveTasks,
      // action_selectDoc,
      datas,
      fields,
      header,
      is_error,
      muiTheme,
      show_image
    } = this.props;
    const {
      anchorEl,
      open,
      item,
      open_dialog,
      document_datas,
      open_dialog_approve
    } = this.state;
    if (is_error) {
      return <NoTaskComponent />;
    }
    let filter  = []
    for (const key in header) {
      const element = header[key];
      filter.push(element.name)
    }
    return (
      <React.Fragment>
        <TableDocument
          action_cellClick={this.actionCellClick}
          action_renderAction={this.renderAction.bind(this)}
          datas={document_datas || datas}
          header={header}
          muiTheme={muiTheme}
          ref={node => this._addRefTable(node)}
          show_image={show_image}
        />
        <Popover
          open={open}
          anchorEl={anchorEl}
          onRequestClose={() => this.setState({ open: false })}
        >
          <Menu>
            <MenuItem
              primaryText="Show/hide imageviewer"
              onClick={() => {
                action_openCloseImageViewer(true, item.s2_url, item.doc_name);
                this.setState({ open: false });
              }}
            />
            <MenuItem
              primaryText="Show image in new tab"
              onClick={() => {
                this.setState({ open: false });
                window.open(`${item.s2_url[0]}`, '_blank');
              }}
            />
          </Menu>
        </Popover>
        <DialogRework
          Translate={Translate}
          action_closeDialog={() => this.setState({ open_dialog: false })}
          action_saveRework={(rework_fields, comment, owner) => {
            this.setState({ open_dialog: false });
            action_saveTasks(
              this.getSelectedBatches(),
              true,
              rework_fields,
              comment,
              owner
            );
          }}
          open_dialog={open_dialog}
          fields={fields}
        />
        <DialogApprove
          Translate={Translate}
          action_closeDialog={() =>
            this.setState({ open_dialog_approve: false })
          }
          action_saveRework={() => {
            this.setState({ open_dialog: false });
            action_saveTasks(datas, false);
          }}
          open_dialog={open_dialog_approve}
        />
      </React.Fragment>
    );
  }
}

export default DocumentTableComponent;
