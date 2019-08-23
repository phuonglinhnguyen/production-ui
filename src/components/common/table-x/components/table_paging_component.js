import React from 'react';
import PropTypes from 'prop-types';
import { GridList, GridTile } from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';

import ArrowRightIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import ArrowLeftIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

class TablePagingComponent extends React.Component {
  constructor(props) {
    super(props);

    this.itemCount = this.itemCount.bind(this);
    this.renderPageCount = this.renderPageCount.bind(this);
  }
  itemCount() {
    const { currentPage, pageSize, totalCount } = this.props;
    var start = (currentPage - 1) * pageSize + 1;
    var end = currentPage * pageSize;
    end = end > totalCount ? totalCount : end;
    start = start > end ? end : start;
    return (
      <Subheader
        style={{ textAlign: 'center' }}
      >{` ${start} - ${end} of ${totalCount}`}</Subheader>
    );
  }
  remove_duplicates_es6(arr) {
    let s = new Set(arr);
    let it = s.values();
    return Array.from(it);
  }
  renderPageCount() {
    var { currentPage, totalPages } = this.props;

    var items = [currentPage - 1, currentPage, currentPage + 1];
    items = items.filter(item => item >= 1 && item <= totalPages);
    if (totalPages >= 3) {
      if (currentPage === 1) {
        items.push(3);
      } else if (currentPage === totalPages) {
        if (items.indexOf(totalPages - 2) === -1) {
          items.unshift(totalPages - 2);
        }
      }
      if (items[0] > 2) {
        items.unshift(' . . .');
      }
      if (items.indexOf(1) === -1) {
        items.unshift(1);
      }
      if (items[items.length - 2] < totalPages - 1) {
        items.push(' . . .');
      }
      if (items.indexOf(totalPages) === -1) {
        items.push(totalPages);
      }
    }

    return items.map((item, index) => (
      <FlatButton
        hoverColor="rgba(0, 0, 0, 0)"
        style={{ minWidth: 0 }}
        key={index}
        disabled={!Number.isInteger(item) || item === currentPage}
        label={item}
        onClick={() => this.props.onChangeCurrentPage(item)}
      />
    ));
  }

  render() {
    return (
      <GridList
        cellHeight="auto"
        cols={15}
        style={{
          margin: '0 0 15px 15px'
        }}
      >
        <GridTile cols={2}>
          <SelectField
            fullWidth={true}
            value={this.props.pageSize}
            onChange={this.props.onChangePageSize}
          >
            {this.props.allowedPageSizes.map((pageSize, index) => (
              <MenuItem key={index} value={pageSize} primaryText={pageSize} />
            ))}
          </SelectField>
        </GridTile>
        <GridTile cols={3}>{this.itemCount()}</GridTile>
        <GridTile cols={10}>
          <Subheader>
            <FlatButton
              hoverColor="rgba(0, 0, 0, 0)"
              icon={<ArrowRightIcon />}
              disabled={this.props.currentPage === 1}
              style={{ margin: '0', verticalAlign: 'middle', minWidth: 0 }}
              onClick={() =>
                this.props.onChangeCurrentPage(this.props.currentPage - 1)}
            />

            {this.renderPageCount()}
            <FlatButton
              hoverColor="rgba(0, 0, 0, 0)"
              disabled={this.props.currentPage === this.props.totalPages}
              style={{ margin: '0', verticalAlign: 'middle', minWidth: 0 }}
              icon={<ArrowLeftIcon />}
              onClick={() =>
                this.props.onChangeCurrentPage(this.props.currentPage + 1)}
            />
          </Subheader>
        </GridTile>
      </GridList>
    );
  }
}
TablePagingComponent.propTypes = {
  allowedPageSizes: PropTypes.array,
  currentPage: PropTypes.number,
  pageSize: PropTypes.number,
  totalCount: PropTypes.number,
  totalPages: PropTypes.number,
  pagingPosition: PropTypes.string,
  onChangeCurrentPage: PropTypes.func,
  onChangePageSize: PropTypes.func
};

export default TablePagingComponent;
