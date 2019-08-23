import React from 'react';
import PropTypes from 'prop-types';
import { GridList, GridTile } from 'material-ui/GridList';
import FlatButton from 'material-ui/FlatButton';
import Checkbox from 'material-ui/Checkbox';

import PagingPanel from './table_paging_component';

import NavigationArrowDownward from 'material-ui/svg-icons/navigation/arrow-downward';
import NavigationArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward';

import _ from 'lodash';
import * as constants from './table_constants';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';
import TableSearch from './table_search';
class RowComponent extends React.Component {
  constructor(props) {
    super(props);
    this.renderCheckboxColumn = this.renderCheckboxColumn.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return !_.isEqual(nextProps, this.props);
  }

  renderCheckboxColumn(data) {
    const {
      selectable,
      renderCheckboxCondition,
      onClickCheckboxRow,
      is_check
    } = this.props;
    if (selectable) {
      var display = renderCheckboxCondition
        ? renderCheckboxCondition(data)
        : true;
      return (
        <TableRowColumn style={{ width: '24px' }}>
          {display && (
            <Checkbox
              checked={is_check}
              onClick={() => onClickCheckboxRow(data, !is_check)}
            />
          )}
        </TableRowColumn>
      );
    }
  }

  render() {
    const {
      is_check,
      data,
      columns,
      index,
      action_cellClick,
      action_onRowClick,
      showIndex
    } = this.props;
    return (
      <TableRow
        style={{
          cursor: action_cellClick ? 'pointer' : '',
          backgroundColor: is_check ? '#e0e0e0' : ''
        }}
        onClick={event => {
          action_onRowClick && action_onRowClick(data.rowIndex, data, event);
        }}
      >
        {this.renderCheckboxColumn(data)}
        {showIndex && (
          <TableRowColumn style={{ width: '24px' }}>{index + 1}</TableRowColumn>
        )}
        {columns &&
          columns.length > 0 &&
          columns.map((column, cell_index) => {
            const sty = column.style || {};
            return (
              <TableRowColumn
                style={{
                  ...sty,
                  textAlign: column.align_right ? 'right' : 'left',
                  ...column.style
                }}
                onClick={e => {
                  if (action_cellClick) {
                    action_cellClick(data.rowIndex, cell_index, data, e);
                  }
                }}
                colSpan={column.colSpan ? column.colSpan : 1}
                key={`${column.title}_${index}`}
              >
                {column.render ? column.render(data) : data[column.name]}
              </TableRowColumn>
            );
          })}
      </TableRow>
    );
  }
}

class TableComponent extends React.Component {
  componentWillReceiveProps(nextProps) {
    const {
      search_keys,
      actions,
      columns,
      paging,
      selectable,
      itemSelected,
      renderCheckboxCondition,
      multiSelectable,
      pagingPosition
    } = nextProps;
    var { datas } = nextProps;
    datas = this.addRowIndex(datas);
    const { currentSortColumn } = this.state;
    if (currentSortColumn) {
      datas = _.orderBy(
        datas,
        [currentSortColumn.name],
        currentSortColumn.type
      );
    }
    const totalPages = this.getTotalPages(datas, this.state.pageSize);
    const selectedDatas = itemSelected
      ? [...itemSelected]
      : this.state.selectedDatas;
    this.setState({
      data_shows: datas,
      datas: datas,
      columns: columns,
      paging: paging,
      totalPages: totalPages,
      totalCount: datas.length,
      selectable: selectable || false,
      multiSelectable: multiSelectable || false,
      pagingPosition: pagingPosition || 'top',
      selectedDatas: [...selectedDatas],
      selectedRows: [
        ...this.getRowIndexSelected(datas, selectedDatas, search_keys[0])
      ],
      search_keys: search_keys,
      actions: actions,
      renderCheckboxCondition: renderCheckboxCondition,
      searchText: '',
      is_filter: false
    });
  }
  addRowIndex(datas) {
    return _.map(datas).map(function (data, index) {
      return _.assign(data, {
        rowIndex: index + 1
      });
    });
  }
  getRowIndexSelected(datas = [], selected = [], filter_key) {
    let rowIndexs = [];
    if (datas.length === 0 || selected.length === 0 || !filter_key) {
      return rowIndexs;
    }
    const data_intersecter = _.intersectionBy(datas, selected, filter_key);
    for (let key in data_intersecter) {
      let element = data_intersecter[key];
      rowIndexs.push(element.rowIndex);
    }
    return rowIndexs;
  }
  constructor(props) {
    super(props);
    var { datas } = props;
    datas = datas || [];
    datas = this.addRowIndex(datas);
    this.state = {
      columns: props.columns || [],
      datas: datas || [],
      data_shows: datas || [],
      paging: props.paging || false,
      pagingPosition: props.pagingPosition || 'top',
      allowedPageSizes: [10, 20, 50],
      currentPage: 1,
      pageSize: 50,
      totalPages: this.getTotalPages(datas, 50) || 1,
      totalCount: datas.length,
      currentSortColumn: {},
      selectable: props.selectable || false,
      multiSelectable: props.multiSelectable || false,
      renderCheckboxCondition: props.renderCheckboxCondition,
      selectedRows: [],
      selectedDatas: [],
      search_keys: props.search_keys || [],
      actions: props.actions,
      is_filter: false,
      searchText: '',
      defaultSort: ''
    };
    this.renderHeader = this.renderHeader.bind(this);
    this.renderBody = this.renderBody.bind(this);
    this.renderCheckboxHeader = this.renderCheckboxHeader.bind(this);
    this.onChangePageSize = this.onChangePageSize.bind(this);
    this.onChangeCurrentPage = this.onChangeCurrentPage.bind(this);
    this.onSort = this.onSort.bind(this);
    this.getDataDisplay = this.getDataDisplay.bind(this);
    this.onClickCheckboxHeader = this.onClickCheckboxHeader.bind(this);
    this.onClickCheckboxRow = this.onClickCheckboxRow.bind(this);
    this.isCheckAll = this.isCheckAll.bind(this);
    this.isCheckRow = this.isCheckRow.bind(this);
    this.getSelectedData = this.getSelectedData.bind(this);
    this.onSearch = this.onSearch.bind(this);
    this.defaultSort = this.defaultSort.bind(this);
  }
  getDataDisplay() {
    const { data_shows, paging, currentPage, pageSize } = this.state;

    var start = 0,
      end = data_shows.length - 1;
    if (paging) {
      start = (currentPage - 1) * pageSize;
      end = currentPage * pageSize;
      end = end > data_shows.length ? data_shows.length : end;
    }

    return data_shows.slice(start, end);
  }
  renderBody() {
    const { columns, selectable, renderCheckboxCondition } = this.state;
    const { action_cellClick, showIndex = false, action_onRowClick } = this.props;
    const dataDisplays = this.getDataDisplay();

    return dataDisplays.map((data, index) => (
      <RowComponent
        key={'row_index_' + index}
        index={index}
        showIndex={showIndex}
        selectable={selectable}
        renderCheckboxCondition={renderCheckboxCondition}
        is_check={this.isCheckRow(data)}
        onClickCheckboxRow={this.onClickCheckboxRow}
        action_cellClick={action_cellClick}
        action_onRowClick={action_onRowClick}
        data={data}
        columns={columns}
      />
    ));
  }
  defaultSort() {
    const { defaultSort } = this.state;
    if (defaultSort) {
      const { columns } = this.state;
      const column = columns.find(item => item.name === defaultSort);
      this.onSort(column);
    }
  }
  onSort(column) {
    const { currentSortColumn, datas } = this.state;
    var type = constants.TABLE_SORT_ASC;
    if (
      currentSortColumn &&
      column.name === currentSortColumn.name &&
      currentSortColumn.type === constants.TABLE_SORT_ASC
    ) {
      type = constants.TABLE_SORT_DESC;
    }

    var dataSort = _.orderBy(datas, [column.name], type);
    // if (type === constants.TABLE_SORT_DESC) {
    //     dataSort = dataSort.reverse();
    // }
    var data_shows = dataSort.filter(function (data) {
      return !data.hidden;
    });

    this.setState({
      data_shows: data_shows,
      datas: dataSort,
      currentSortColumn: { ...column, type: type }
    });
  }
  onClickCheckboxHeader(isInputChecked) {
    const { onCheckRows } = this.props;
    var { selectedRows, selectedDatas } = this.state;

    const dataDisplays = this.getDataDisplay();

    if (isInputChecked) {
      _.forEach(dataDisplays, function (data) {
        var index = selectedRows.findIndex(row => data.rowIndex === row);
        if (index === -1) {
          selectedRows.push(data.rowIndex);
          selectedDatas.push(data);
        }
      });
    } else {
      _.forEach(dataDisplays, function (data) {
        var index = selectedRows.findIndex(row => data.rowIndex === row);
        if (index !== -1) {
          selectedRows.splice(index, 1);
          selectedDatas.splice(index, 1);
        }
      });
    }
    this.setState({
      selectedRows: selectedRows,
      selectedDatas: selectedDatas
    });
    onCheckRows && onCheckRows(selectedRows, selectedDatas)
    // if (this.props.onCheckAll) {
    //     this.props.onCheckAll(dataDisplays, isInputChecked)
    // }
  }
  isCheckAll() {
    const { selectedRows } = this.state;
    const dataDisplays = this.getDataDisplay();

    var rs = true;
    _.forEach(dataDisplays, function (data) {
      const index = selectedRows.findIndex(row => data.rowIndex === row);

      if (index === -1) {
        rs = false;
        return;
      }
    });

    return rs;
  }
  isCheckRow(data) {
    const { selectedRows } = this.state;

    if (selectedRows.findIndex(row => data.rowIndex === row) === -1) {
      return false;
    }

    return true;
  }
  getSelectedData() {
    var { selectedDatas, renderCheckboxCondition } = this.state;
    if (renderCheckboxCondition) {
      return selectedDatas.filter(data => renderCheckboxCondition(data));
    }

    return selectedDatas;
  }
  getDataFilter() {
    return this.state.data_shows;
  }
  onClickCheckboxRow(data, isInputChecked) {
    const { onCheckRows } = this.props;
    var { selectedRows, selectedDatas, multiSelectable } = this.state;

    if (!multiSelectable) {
      if (isInputChecked) {
        selectedRows = [data.rowIndex];
        selectedDatas = [data];
      } else {
        selectedRows = [];
        selectedDatas = [];
      }
    } else {
      var index = selectedRows.findIndex(row => data.rowIndex === row);
      if (index === -1) {
        selectedRows.push(data.rowIndex);
        selectedDatas.push(data);
      } else {
        selectedRows.splice(index, 1);
        selectedDatas.splice(index, 1);
      }
    }
    this.setState({
      selectedRows: selectedRows,
      selectedDatas: selectedDatas
    });
    onCheckRows && onCheckRows(selectedRows, selectedDatas)
  }
  renderCheckboxHeader() {
    const { selectable, multiSelectable } = this.state;
    if (selectable) {
      if (multiSelectable) {
        const is_check = this.isCheckAll();
        return (
          <TableHeaderColumn style={{ width: '24px' }}>
            <Checkbox
              checked={is_check}
              onClick={() => this.onClickCheckboxHeader(!is_check)}
            />
          </TableHeaderColumn>
        );
      }
      return <TableHeaderColumn />;
    }
  }
  renderSortColumn(currentSortColumn, column, index) {
    const iconStyle = {
      color: this.props.muiTheme.palette.shadowColor,
      height: 16,
      width: 16,
      marginLeft: 5
    };
    const spanStyle = {
      color: this.props.muiTheme.palette.textColor,
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center'
    };
    let icon = null;
    if (currentSortColumn && currentSortColumn.name === column.name) {
      if (currentSortColumn.type === 'asc') {
        icon = (
          <NavigationArrowUpward
            key={`${column.name}-icon-${index}`}
            style={iconStyle}
          />
        );
      } else {
        icon = (
          <NavigationArrowDownward
            key={`${column.name}-icon-${index}`}
            style={iconStyle}
          />
        );
      }
    }
    if (!icon) {
      return <span key={`${column.name}-unsort-yet`}>{column.title}</span>;
    }
    if (column.align_right) {
      return (
        <span style={spanStyle} key={`${column.name}-right`}>
          {icon}
          {column.title}
        </span>
      );
    } else {
      return (
        <span style={spanStyle} key={`${column.name}-left`}>
          {column.title}
          {icon}
        </span>
      );
    }
  }

  renderHeader() {
    const { currentSortColumn, columns } = this.state;
    const { showIndex = false } = this.props;
    return (
      <TableRow>
        {this.renderCheckboxHeader()}
        {showIndex && (
          <TableHeaderColumn style={{ width: '24px' }}>
            {'Index'}
          </TableHeaderColumn>
        )}
        {columns && columns.length > 0 ? (
          columns.map((column, index) => (
            <TableHeaderColumn
              colSpan={column.colSpan ? column.colSpan : 1}
              style={{
                textAlign: column.align_right ? 'right' : 'left',
                ...column.style
              }}
              key={index}
              tooltip={column.sort ? 'Sort' : ''}
            >
              {column.sort ? (
                <FlatButton
                  style={{
                    textAlign: column.align_right ? 'right' : 'left',
                    paddingRight: 12
                  }}
                  key={`header-sort-${index}`}
                  labelPosition="before"
                  hoverColor="rgba(0, 0, 0, 0)"
                  disableTouchRipple={true}
                  children={this.renderSortColumn(
                    currentSortColumn,
                    column,
                    index
                  )}
                  onClick={() => this.onSort(column)}
                />
              ) : (
                  <span key={`header-unsort-${index}`}>{column.title}</span>
                )}
            </TableHeaderColumn>
          ))
        ) : (
            <TableHeaderColumn />
          )}
      </TableRow>
    );
  }
  // <IconButton >
  //   </IconButton>
  getTotalPages(datas, pageSize) {
    var totalPages = Math.floor(datas.length / pageSize);
    if (datas.length % pageSize !== 0 || totalPages === 0) {
      totalPages++;
    }
    return totalPages;
  }

  onChangePageSize(event, index, value) {
    var { currentPage, data_shows } = this.state;
    const totalPages = this.getTotalPages(data_shows, value);
    currentPage = currentPage > totalPages ? totalPages : currentPage;

    this.setState({
      totalPages: totalPages,
      pageSize: value,
      currentPage: currentPage
    });
  }
  onChangeCurrentPage(value) {
    this.setState({ currentPage: value });
  }
  onSearch(dataSearch, searchText) {
    var data_shows = dataSearch.filter(function (data) {
      return !data.hidden;
    });
    const totalPages = this.getTotalPages(data_shows, this.state.pageSize);
    const currentPage =
      this.state.currentPage > totalPages ? totalPages : this.state.currentPage;

    const is_filter = searchText && searchText.trim().length !== 0;

    this.setState({
      datas: dataSearch,
      data_shows: data_shows,
      totalPages: totalPages,
      totalCount: data_shows.length,
      currentPage: currentPage,
      is_filter: is_filter,
      searchText: searchText
    });
  }

  render() {
    const { search_keys, datas } = this.state;
    const {
      tableActions,
      searchHintText,
      tableStyle,
      tableBodyStyle
    } = this.props;

    return (
      <div>
        <GridList cols={6} cellHeight="auto" padding={0}>
          <GridTile style={{ margin: '15px' }} cols={4}>
            {tableActions && tableActions()}
          </GridTile>

          <GridTile style={{ margin: '15px 15px 0 0' }} cols={2}>
            {search_keys && search_keys.length > 0 ? (
              <TableSearch
                datas={datas}
                searchText={this.state.searchText}
                search_keys={search_keys}
                searchHintText={searchHintText}
                onSearch={this.onSearch}
              />
            ) : (
                <div />
              )}
          </GridTile>
        </GridList>
        {this.state.paging &&
          this.state.pagingPosition === 'top' && (
            <PagingPanel
              {...this.state}
              onChangeCurrentPage={this.onChangeCurrentPage}
              onChangePageSize={this.onChangePageSize}
            />
          )}
        <Table
          fixedHeader={true}
          {...tableStyle}
          selectable={false}
          multiSelectable={false}
        >
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            {this.renderHeader()}
          </TableHeader>
          <TableBody {...tableBodyStyle} displayRowCheckbox={false}>
            {this.renderBody()}
          </TableBody>
        </Table>
        {this.state.paging &&
          this.state.pagingPosition === 'bottom' && (
            <PagingPanel
              {...this.state}
              onChangeCurrentPage={this.onChangeCurrentPage}
              onChangePageSize={this.onChangePageSize}
            />
          )}
      </div>
    );
  }
}
TableComponent.propTypes = {
  datas: PropTypes.array.isRequired,
  search_keys: PropTypes.array,
  actions: PropTypes.func,
  columns: PropTypes.array,
  paging: PropTypes.bool,
  selectable: PropTypes.bool,
  renderCheckboxCondition: PropTypes.func,
  multiSelectable: PropTypes.bool,
  allowedPageSizes: PropTypes.array,
  pagingPosition: PropTypes.string,
  tableActions: PropTypes.func
};
export default TableComponent;
