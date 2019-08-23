import React from "react";

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table";
import Subheader from "material-ui/Subheader";

class ClassifyDataTableComponent extends React.PureComponent {
  render() {
    const {
      selected_index_document,
      primary1Color,
      accent1Color,
      data_tasks,

      action_showDocSelected
    } = this.props;

    if (!data_tasks || data_tasks.length < 1) {
      return null;
    }
    return (
      <div>
        <br />
        <Subheader>Tasks</Subheader>
        <Table
        height={'350px'}
        fixedHeader={true}
          selectable={false}
          multiSelectable={false}
          style={{
            background: "transparent"
          }}
          onCellClick={(r, c) => action_showDocSelected(r)}
        >
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}
          >
            <TableRow hovered={true}>
            <TableHeaderColumn style={{ width: '40%' }}>Batch Name</TableHeaderColumn> 
              <TableHeaderColumn style={{ width: '40%' }}>Doc Id</TableHeaderColumn> 
              <TableHeaderColumn style={{ width: '20%' }}>Layout</TableHeaderColumn> 
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {data_tasks.map((data, i) => {
              let layout_name;
              if (data.layout) {
                layout_name = data.layout.name;
              }
              let style = { cursor: "pointer" };
              if (i === selected_index_document) {
                style = {
                  backgroundColor: primary1Color,
                  color: "#FFFFFF",
                  cursor: "pointer"
                };
              } else if (!layout_name) {
                style = {
                  backgroundColor: accent1Color,
                  color: "#FFFFFF",
                  cursor: "pointer"
                };
              }

              return (
                <TableRow id={`classify_table_${i}`} key={i} style={style}>
                  <TableRowColumn style={{ width: '40%' }} title={data.batch_name}>{data.batch_name}</TableRowColumn> 
                  <TableRowColumn style={{ width: '40%' }} title={data.doc_id}>{data.doc_id}</TableRowColumn> 
                  <TableRowColumn style={{ width: '20%' }} title={layout_name}>{layout_name}</TableRowColumn>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default ClassifyDataTableComponent;
