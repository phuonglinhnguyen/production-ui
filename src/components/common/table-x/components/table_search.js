import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
class TableSearchComponent extends Component {
    componentWillReceiveProps(netxProps) {

        this.setState({ searchInput: netxProps.searchText })
    }


    constructor(props) {
        super(props);

        this.state = {
            searchInput: props.searchText,

        };


    }
    handleSearchChange(e) {
        var { datas, search_keys } = this.props;
        this.setState({
            searchInput: e.target.value
        });

        datas = this.filterDatas(search_keys, e.target.value, datas);

        this.props.onSearch(datas, e.target.value)
    }
    filterData(data_labels, key, data) {
        for (const data_label of data_labels) {
            if (!key || (data[data_label] && data[data_label].toString().toLowerCase().includes(key.toLowerCase()))) {
                return true;
            }
        }
        return false;
    }
    filterDatas(data_labels, key, datas) {

        datas.forEach(
            data => (data.hidden = !this.filterData(data_labels, key, data))
        );
        return datas;
    }
    render() {


        return (
            <TextField
                onChange={this.handleSearchChange.bind(this)}
                value={this.state.searchInput}
                hintText={this.props.searchHintText}
                ref={input => {
                    this.searchInput = input;
                }}
                fullWidth={true}

                name="search"
            />




        );

    }
}

TableSearchComponent.propTypes = {
    datas: PropTypes.array.isRequired,
    search_keys: PropTypes.array.isRequired,
    onSearch: PropTypes.func.isRequired,
    searchHintText: PropTypes.string
};

export default TableSearchComponent;
