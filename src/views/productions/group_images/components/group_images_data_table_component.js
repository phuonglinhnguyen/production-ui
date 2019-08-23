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
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import TextField from "material-ui/TextField";

class GroupImagesDataTable extends React.PureComponent {
  render() {
    const {
      is_empty,
      groups,
      reasons,
      selectReason,
      changeBarcode
    } = this.props;
    if (is_empty) {
      return null;
    }

    return (
      <div>
        <br />
        <Subheader>Groups</Subheader>
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
            <TableRow hovered={true}>
              <TableHeaderColumn>Barcode</TableHeaderColumn>
              <TableHeaderColumn>Range</TableHeaderColumn>
              <TableHeaderColumn>Reason</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {groups.map((data, i) => {
              return (
                <TableRow id={`classify_table_${i}`} key={i}>
                  <TableRowColumn>
                    <TextField
                      name={"barcode" + i}
                      value={data.barcode || ""}
                      onChange={event => {
                        changeBarcode(i, event.target.value);
                      }}
                    />
                  </TableRowColumn>
                  <TableRowColumn>{`${data.start + 1} - ${data.end +
                    1}`}</TableRowColumn>
                  <TableRowColumn>
                    <SelectField
                      value={data.reason}
                      onChange={(event, index, value) => selectReason(i, value)}
                    >
                      <MenuItem key={-1} value={null} primaryText={""} />
                      {reasons.map((option, i) => (
                        <MenuItem
                          key={i}
                          value={option.value}
                          primaryText={option.value}
                        />
                      ))}
                    </SelectField>
                  </TableRowColumn>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
}

export default GroupImagesDataTable;
