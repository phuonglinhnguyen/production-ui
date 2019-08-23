import React from "react";

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from "material-ui/Table";
import RaisedButton from "material-ui/RaisedButton";

import ExpandMoreIcon from "material-ui/svg-icons/navigation/expand-more";
import ExpandLessIcon from "material-ui/svg-icons/navigation/expand-less";

const styles = {
  main: {
    position: "fixed",
    height: 38,
    zIndex: 10,
    bottom: -22,
    width: 122,
    left: "calc(50% - 66px)"
  },
  table: {
    height: 400,
    width: "100%",
    position: "fixed",
    bottom: 0
  }
};

class RecordComponent extends React.PureComponent {
  state = {
    show: false,
    bottom: -22
  };

  render() {
    if (!this.state.show) {
      return (
        <div
          onMouseEnter={() => this.setState({ bottom: 0 })}
          onMouseLeave={() => this.setState({ bottom: -22 })}
          style={{ ...styles.main, bottom: this.state.bottom }}
        >
          <RaisedButton
            label="Records"
            primary={true}
            icon={<ExpandLessIcon />}
            onClick={() => this.setState({ show: true, bottom: -22 })}
          />
        </div>
      );
    }

    return (
      <div style={styles.table}>
        <div
          style={{
            width: 122,
            margin: "auto"
          }}
        >
          <RaisedButton
            label="Records"
            primary={true}
            icon={<ExpandMoreIcon />}
            onClick={() => this.setState({ show: false })}
          />
        </div>
        <div
          style={{
            boxShadow:
              "rgba(0, 0, 0, 0.16) 0px 0px 5px, rgba(0, 0, 0, 0.23) 0px -5px 7px"
          }}
        >
          <Table
            height="304px"
            bodyStyle={{ backgroundColor: "#FFFFFF" }}
            fixedHeader={true}
          >
            <TableHeader>
              <TableRow>
                <TableHeaderColumn>ID</TableHeaderColumn>
                <TableHeaderColumn>Name</TableHeaderColumn>
                <TableHeaderColumn>Status</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableRowColumn>1</TableRowColumn>
                <TableRowColumn>John Smith</TableRowColumn>
                <TableRowColumn>Employed</TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>2</TableRowColumn>
                <TableRowColumn>Randal White</TableRowColumn>
                <TableRowColumn>Unemployed</TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>3</TableRowColumn>
                <TableRowColumn>Stephanie Sanders</TableRowColumn>
                <TableRowColumn>Employed</TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>4</TableRowColumn>
                <TableRowColumn>Steve Brown</TableRowColumn>
                <TableRowColumn>Employed</TableRowColumn>
              </TableRow>
              <TableRow>
                <TableRowColumn>5</TableRowColumn>
                <TableRowColumn>Christopher Nolan</TableRowColumn>
                <TableRowColumn>Unemployed</TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}

export default RecordComponent;
