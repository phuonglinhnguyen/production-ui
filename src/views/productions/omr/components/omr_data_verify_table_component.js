import React from "react";

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table";

class OMRDataVerifyTable extends React.PureComponent {
  render() {
    const { accent1Color, primary1Color, section } = this.props;
    return (
      <div
        style={{
          height: "calc(100vh - 114px)",
          overflow: "auto",
          textAlign: "center"
        }}
      >
        <Table
          selectable={false}
          multiSelectable={false}
          style={{
            background: "transparent"
          }}
        >
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}
          >
            <TableRow>
              <TableHeaderColumn>Field</TableHeaderColumn>
              <TableHeaderColumn>Data 1</TableHeaderColumn>
              <TableHeaderColumn>Data 2</TableHeaderColumn>
              <TableHeaderColumn>Final data</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {section.fields.map((data, i) => (
              <TableRow
                key={i}
                style={
                  !data.is_not_empty ? { backgroundColor: accent1Color } : null
                }
              >
                <TableRowColumn>{data.field_display}</TableRowColumn>
                <TableRowColumn>{data.value_output_one}</TableRowColumn>
                <TableRowColumn>{data.value_output_two}</TableRowColumn>
                <TableRowColumn
                  style={{ color: primary1Color, fontWeight: 600 }}
                >
                  {data.value}
                </TableRowColumn>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default OMRDataVerifyTable;
