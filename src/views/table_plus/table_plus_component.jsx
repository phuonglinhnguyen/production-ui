import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import TablePlusHeader from './table_plus_header';
import TablePlusToolbar from './table_plus_toolbar';
import red from '@material-ui/core/colors/red';
import TablePlusController from './table_plus_controller'
import { TableChart } from '@material-ui/icons'
import FormControlLabel from '@material-ui/core/FormControlLabel';
function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}
const styles = theme => ({
  root: {
    width: '100%',
    height: '100%',
    // marginTop: theme.spacing.unit * 3,
    // marginRight: theme.spacing.unit * 1,
    overflowX: 'visible',
  },
  iconHover: {
    '&:hover': {
      color: red[800],
    },
  },
  spacer: {
    flex: '1 1 auto',
  },
  icons: {
    marginRight: 10,
  }
});

class TablePlusComponent extends TablePlusController {
  render() {
    const { keySearchs, order, orderBy, selected, rowsPerPage, page, columns, data_view } = this.state;
    const { classes, buttonActionInToolbar, selectView, viewActionInRows, buttonActionsInRow, nameTable,
      rowsPerPageOptions, isHover, styleTableBody,
      width_default, width_item, height_table, iconTable
    } = this.props;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data_view.length - page * rowsPerPage);
    let _styleTableBody = styleTableBody && styleTableBody || {};
    const columnCount = viewActionInRows.checkbox ? columns.length + 1 : 1;
    let widthItem = (width_item && width_item) || 150;
    let widthDefault = (width_default && width_default) || 945;
    let widthTable = (columnCount * widthItem) >= widthDefault ? (columnCount * widthItem) : widthDefault;
    return (
      <React.Fragment>
       {/* <Paper > */}
        <Toolbar>
          <FormControlLabel
            control={
              iconTable ? <TableChart className={classes.icons} /> : <Typography />
            }
            label={<Typography color="inherit" variant="title">{nameTable}</Typography>}
          />
        </Toolbar>
        {viewActionInRows.toolbar ?
          <TablePlusToolbar
            numSelected={selected.length}
            keySearchs={keySearchs}
            handleSearch={this.handleSearch}
            buttonActions={buttonActionInToolbar}
            selectView={selectView}
            viewActionToolbar={viewActionInRows}
          /> : ''}

        <div style={{ overflowX: "auto", width: '100%', height: '100%' }} >
          <div style={{marginRight: '18px'}}>
            <Table style={{ minWidth: widthTable}}>
              <TablePlusHeader
                numSelected={selected.length}
                selected={selected}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={data_view.length}
                columns={columns}
                rowsVisable={data_view}
                viewActionInColumns={viewActionInRows}
                widthItem={widthItem}
              />
            </Table>
          </div>
          <div style={{
            overflowY: 'auto', overflowX: 'hidden',
            maxHeight: height_table,
            width: '100%',
          }}>
            <Table style={{ minWidth: widthTable, overflowY: 'auto', overflowX: 'hidden', }}>
              <TableBody>
                {
                  stableSort(data_view, getSorting(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((n, indexItem) => {
                      if (viewActionInRows.checkbox) {
                        const isSelected = this.isSelected(n.id);
                        let _style_column = n.styleRowBody ? n.styleRowBody : {}
                        return (
                          <TableRow
                            hover={(isHover && isHover) || false}
                            onClick={event => this.handleClick(event, n.id)}
                            role="checkbox"
                            aria-checked={isSelected}
                            tabIndex={-1}
                            key={n.id}
                            selected={isSelected}
                          >
                            {columns.map((item) => (
                              item.id === 'checkbox' ?
                                <TableCell
                                  style={item.styleRowBody && { ...item.styleRowBody } || {
                                    // maxWidth: '9px',
                                    // padding: '4px 4px 4px 24px',
                                    width: '9px',
                                    padding: '0px',
                                  }}
                                >
                                  <Checkbox checked={isSelected} />
                                </TableCell>
                                :
                                item.Action ?
                                  <TableCell
                                    style={item.styleRowBody && { ...item.styleRowBody } || {
                                      width: widthItem,
                                      // padding: '0px',
                                      // textAlign: '-webkit-center',
                                      height: '30px',
                                    }}
                                  > {buttonActionsInRow ? buttonActionsInRow(n) : ''}</TableCell> :
                                  <TableCell
                                    // numeric={n[item.numeric]}
                                    style={item.styleRowBody && { ...item.styleRowBody } || {
                                      width: widthItem,
                                      // padding: '0px',
                                      // textAlign: '-webkit-center',
                                      height: '30px',
                                    }}
                                  > {n[item.id]}</TableCell>
                            ))}
                          </TableRow>
                        );
                      } else {
                        return (
                          <TableRow
                            tabIndex={-1}
                            key={n.id}
                            hover={(isHover && isHover) || false}
                            onClick={event => this.handleClickRow(event, n, indexItem)}
                          >
                            {columns.map((item) => (
                              item.Action ?
                                <TableCell
                                  style={item.styleRowBody && { ...item.styleRowBody } || {
                                    width: widthItem,
                                    // padding: '0px',
                                    // textAlign: '-webkit-center',
                                    height: '30px',
                                  }}
                                > {buttonActionsInRow ? buttonActionsInRow(n) : ''}</TableCell> :
                                <TableCell
                                  // numeric={n[item.numeric]}
                                  style={item.styleRowBody && { ...item.styleRowBody } || {
                                    width: widthItem,
                                    // padding: '0px',
                                    // textAlign: '-webkit-center',
                                    height: '30px',
                                  }}
                                > {n[item.id]}</TableCell>
                            ))}
                          </TableRow>
                        );
                      }
                    })
                }
                {
                  emptyRows > 0 && (
                    <TableRow style={{ height: 49 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )
                }
              </TableBody>
            </Table>
          </div>
        </div>
        <TablePagination
          component="div"
          count={data_view.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
          rowsPerPageOptions={(rowsPerPageOptions && rowsPerPageOptions) || [20, 50, 100]}
        />
      {/* </Paper> */}
        </React.Fragment>
    );
  }
}

TablePlusComponent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(TablePlusComponent);