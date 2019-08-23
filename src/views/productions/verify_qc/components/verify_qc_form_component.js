import React, { Component } from 'react'
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
// import { List, makeSelectable } from 'material-ui/List';
import TextField from 'material-ui/TextField';
import muiThemeable from 'material-ui/styles/muiThemeable';

class QcFormComponent extends Component {

    onCellClick(row, column) {
    }

    render() {


        return (<div >
            <Table
                multiSelectable={false}
                selectable={false}
                onCellClick={this.onCellClick}
            >
                <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
                    <TableRow>
                        <TableHeaderColumn style={{ width: '10%' }}>Doc Name</TableHeaderColumn>
                        <TableHeaderColumn>Field Name</TableHeaderColumn>
                        <TableHeaderColumn>Key Data</TableHeaderColumn>
                        <TableHeaderColumn>Qc Data</TableHeaderColumn>
                        <TableHeaderColumn>Verify Data</TableHeaderColumn>
                        <TableHeaderColumn>Error Type</TableHeaderColumn>
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    <TableRow>
                        <TableRowColumn style={{ width: '10%' }}>Doc 1</TableRowColumn>
                        <TableRowColumn>Field Name</TableRowColumn>
                        <TableRowColumn>Key Data</TableRowColumn>
                        <TableRowColumn>Qc Data</TableRowColumn>
                        <TableRowColumn><TextField

                            hintText="Hint Text"
                        /></TableRowColumn>
                        <TableRowColumn>Error Type</TableRowColumn>
                    </TableRow>
                    <TableRow>
                        <TableRowColumn style={{ width: '10%' }}>Doc 1</TableRowColumn>
                        <TableRowColumn>Field Name</TableRowColumn>
                        <TableRowColumn>Key Data</TableRowColumn>
                        <TableRowColumn>Qc Data</TableRowColumn>
                        <TableRowColumn><TextField

                            hintText="Hint Text"
                        /></TableRowColumn>
                        <TableRowColumn>Error Type</TableRowColumn>
                    </TableRow>

                </TableBody>
            </Table>

        </div>

        )
    }
}
export default muiThemeable()(QcFormComponent);
