import React, { Component } from 'react';
import { Translate } from 'react-redux-i18n';
import InputField from './input_field';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';

class FormMulti extends Component {
  getHeader() {
    const { fields } = this.props;

    return fields.map((_field, index) =>
      <TableHeaderColumn key={index} style={{ fontWeight: 600 }}>
        {<Translate value={_field.field_display} />}
      </TableHeaderColumn>
    );
  }
  getRows() {
    const { records, fields, editColumn, indexStart = 0 } = this.props;
    let length = editColumn ? records.length : fields.length;

    return records.map((record, indexRow) => {
      return (
        <TableRow key={`row-record-${indexRow}`}>
          {/* <TableRowColumn>
            {indexRow + 1}
          </TableRowColumn> */}

          {fields.map((_field, index) => {
            let _value = record[_field.name];
            let _tabIndex = editColumn
              ? indexRow + length * index + indexStart
              : indexRow * length + index + indexStart;
            return (
              <TableRowColumn key={index}>

                <InputField
                  focus={index === 0}
                  key={`input-key${_tabIndex}`}
                  field={_field}
                  tabIndex={_tabIndex}
                  value={_value}
                  indexRow={indexRow}
                  {...this.props}
                />
              </TableRowColumn>
            );
          })}
        </TableRow>
      );
    });
  }
  render() {
    const { fields, height, actions } = this.props;
    return (
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        {actions ? actions : ''}
        <Table
          selectable={false}
          height={`${height - 140}px`}
          style={{ minWidth: 350 * fields.length }}
        >
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              {/* <TableHeaderColumn>Index</TableHeaderColumn> */}
              {this.getHeader()}
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            {this.getRows()}
          </TableBody>
        </Table>
      </div>
    );
  }
}
export default FormMulti;
