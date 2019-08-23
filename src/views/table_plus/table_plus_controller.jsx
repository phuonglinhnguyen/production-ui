import React from 'react';
import { isEqual } from 'lodash'
class EnhancedTableController extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    data_view: [],
    dataBegin: [],
    page: 0,
    rowsPerPage: 20,
    columns: [],
    keySearchs: [],
    onSelectedUser: 'TeamMember',
    checkSelectAll: 0,
  };

  componentWillMount = () => {
    const { data = [], columns = [], rowsPerPage = 5 } = this.props;
    this.setState({
      data_view: data,
      dataBegin: data,
      columns,
      rowsPerPage
    });
  }

  componentWillReceiveProps = (nextProps) => {
    if (!isEqual(this.props.data, nextProps.data)) {
      this.setState({
        data_view: nextProps.data || [],
        dataBegin: nextProps.data || [],
        columns: nextProps.columns || [],
        selected: nextProps.selected ? nextProps.selected : this.state.selected,
      });
    } else {
      this.setState({
        columns: nextProps.columns || [],
        selected: nextProps.selected ? nextProps.selected : this.state.selected,
      });
    }
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  // select all row in table
  handleSelectAllClick = event => {
    const { rowsPerPage, page, data_view, selected, checkSelectAll } = this.state;
    const { onSelect } = this.props;
    let _ids = [],
      endSelect = 0,
      beginSelect = 0,
      _checkSelectAll = checkSelectAll + 1
      ;

    if (data_view.length <= rowsPerPage) {
      _checkSelectAll = _checkSelectAll + 1;
    }
    // check 1 page
    if (_checkSelectAll === 1) {
      endSelect = rowsPerPage * (page + 1);
      if (page === 0) {
        beginSelect = 0;
        endSelect = rowsPerPage;
      }
      else {
        beginSelect = endSelect - rowsPerPage;
      }
      _ids = data_view.filter((item, index) => index < endSelect && index >= beginSelect)
        .map(item => item.id)
    }
    // check ALL page
    else if (_checkSelectAll === 2) {
      _ids = data_view.map(n => n.id)
    }
    // UNcheck ALL page
    else {
      _checkSelectAll = 0
    }

    let check = onSelect(_ids);
    this.setState({
      selected: _ids,
      checkSelectAll: _checkSelectAll
    });

  }

  // select one by one row in table
  handleClick = (event, id) => {
    const { selected } = this.state;
    const { onSelect } = this.props;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    let check = onSelect(newSelected);
    this.setState({ selected: newSelected });
  };

  handleClickRow = (event, item, indexItem) =>{
    const { onClickRow } = this.props;
    onClickRow && onClickRow(event, item, indexItem);
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  // search
  handleSearch = (event) => {
    const { dataBegin } = this.state;
    const { onSearch } = this.props;
    this.setState({
      keySearchs: event.target.value
    })

    if (event.target.value) {
      let data = onSearch(dataBegin, event.target.value);
      this.setState({ data_view: data })
    } else {
      let data = this.state.dataBegin;
      this.setState({ data_view: data })
    }
  }

  onClickEdit = (id) => () => {
    const { onClickEditTaskAssign } = this.props;
    onClickEditTaskAssign(id);
  }
}

export default EnhancedTableController;
