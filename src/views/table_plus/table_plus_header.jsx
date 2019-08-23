import React from 'react';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { columns, onSelectAllClick, order, orderBy, numSelected, rowCount,
      viewActionInColumns, widthItem } = this.props;
    return (
      <TableHead>
        <TableRow>
          {columns.map(col => {
            let _style_column = col.styleHeader ? col.styleHeader : {}
            if (viewActionInColumns.checkbox && col.id === "checkbox") {
              return (
                <TableCell
                  // padding="checkbox"
                  style={_style_column && {..._style_column} || {
                    // maxWidth: '10px',
                    // padding: '4px 4px 4px 24px',
                    padding: '0px',
                    width: '10px'
                  }}
                >
                  <Checkbox
                    indeterminate={numSelected > 0 && numSelected < rowCount}
                    checked={numSelected}
                    onChange={onSelectAllClick}
                  />
                </TableCell>
              )
            }
            else {
              return (
                <TableCell
                  style={_style_column && {..._style_column} || {
                    width: widthItem,
                    padding: '0px',
                    // textAlign: '-webkit-center',
                  }}
                  key={col.id}
                  numeric={col.numeric}
                  padding={col.disablePadding ? 'none' : 'default'}
                  sortDirection={orderBy === col.id ? order : false}
                >
                  <Tooltip
                    title={col.sort ? "Sort" : ''}
                    placement={col.numeric ? 'bottom-end' : 'bottom-start'}
                    enterDelay={300}
                  >
                    <TableSortLabel
                      active={orderBy === col.id}
                      direction={order}
                      onClick={col.sort ? this.createSortHandler(col.id) : ''}
                    >
                      {col.label}
                    </TableSortLabel>
                  </Tooltip>
                </TableCell>
              );
            }
          }, this)}

        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

export default EnhancedTableHead;