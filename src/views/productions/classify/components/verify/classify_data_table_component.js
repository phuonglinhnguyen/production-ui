import React from "react";

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table";
import Checkbox from "material-ui/Checkbox";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";

class ClassifyDataTableComponent extends React.PureComponent {
  render() {
    const {
      selected_index_document,
      primary1Color,
      accent1Color,
      data_tasks,

      action_changeAllApproved,
      action_changeApproved,
      action_showDocSelected
    } = this.props;

    if (!data_tasks || data_tasks.length < 1) {
      return null;
    }
    return (
      <div>
        {/* <br />
        <Subheader>Tasks</Subheader> */}

        <SelectField
          onChange={(event, index, value) => {
            action_changeAllApproved(value);
          }}
          floatingLabelText="Approve All"
        >
          <MenuItem value={false} primaryText="Uncheck all" />
          <MenuItem value={true} primaryText="Check all" />
        </SelectField>

        <Table
          selectable={false}
          multiSelectable={false}
          style={{
            background: "transparent"
          }}
          onCellClick={(r, c) => {
            if (c === 2) {
              return;
            }
            action_showDocSelected(r);
          }}
        >
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            enableSelectAll={false}
          >
            <TableRow hovered={true}>
              <TableHeaderColumn style={{ width: "40%" }}>
                Doc Id
              </TableHeaderColumn>
              <TableHeaderColumn style={{ width: "40%" }}>
                Layout
              </TableHeaderColumn>
              <TableHeaderColumn style={{ width: "20%" }}>
                Approve
              </TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {data_tasks.map((data, i) => {
              let style = { cursor: "pointer" };
              let styleCheck = {};
              if (i === selected_index_document) {
                style = {
                  backgroundColor: primary1Color,
                  color: "#FFFFFF",
                  cursor: "pointer"
                };
                styleCheck = {
                  fill: "#FFFFFF"
                };
              } else if (data.approved) {
                style = {
                  backgroundColor: accent1Color,
                  color: "#FFFFFF",
                  cursor: "pointer"
                };
                styleCheck = {
                  fill: "#FFFFFF"
                };
              }

              return (
                <TableRow id={`classify_table_${i}`} key={i} style={style}>
                  <TableRowColumn style={{ width: "40%" }} title={data.doc_id}>
                    {data.doc_id}
                  </TableRowColumn>
                  <TableRowColumn style={{ width: "40%" }}>
                    {data.layout_name}
                  </TableRowColumn>
                  <TableRowColumn style={{ width: "20%" }}>
                    <Checkbox
                      iconStyle={styleCheck}
                      checked={data.approved}
                      onCheck={e => {
                        action_changeApproved(i);
                      }}
                    />
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

export default ClassifyDataTableComponent;
