import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import Search from '@material-ui/icons/Search';
import Download from '@material-ui/icons/ArrowDownward';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { getDataObject } from '@dgtx/coreui';
import { isEqual } from 'lodash';

import TablePlus from '../../../views/table_plus/table_plus_component';
import * as convertData from './project_list_covert_data';
import _ from "lodash";

const styles = theme => ({
    container: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        height: '100%',
        maxWidth: '100vw',
        maxHeight: 'max-content',
        // backgroundColor: 'green'
    },
    item1: {
        // backgroundColor: 'blue',
        textAlign: 'center',
        height: '-webkit-fill-available',
        maxHeight: '-webkit-fill-available',
        maxWidth: '100%',
        width: '100vw',
    }
    // item1: {
    //     backgroundColor: 'blue',
    //     textAlign: 'center',
    //     height: '-webkit-fill-available',
    //     maxHeight: '-webkit-fill-available',
    //     maxWidth: '30%',
    //     width: '30%',
    // },
    // item2: {
    //     backgroundColor: 'yellow',
    //     textAlign: 'center',
    //     height: '-webkit-fill-available',
    //     maxHeight: '-webkit-fill-available',
    //     maxWidth: '70%',
    //     width: '70%',
    // },
});

const viewActionInRowTable = {
    checkbox: false,
    edit: false,
    removeAll: false,
    search: true,
    toolbar: true
}
const columnsTable = convertData.convertColumnsData();
const columnsSearchTable = convertData.convertColumnsSearch();

class ProjectListTable extends Component {
    state = {
        listCheckedItem: [],
        dataTable: []
    }

    componentWillMount = () => {
        const { data } = this.props;
        let _data = data.map(item => convertData.createRowsData(item));
        let dataTable = _.orderBy(_data, ["priority", "projectName"], ["asc", "asc"]);
        this.setState({
            dataTable
        })
    }

    componentWillReceiveProps = (nextProps) => {
        let nextGuide = nextProps.data;
        let currentGuide = this.state.dataTable;
        let data = nextGuide.map(item => convertData.createRowsData(item));
        let dataTable = _.orderBy(data, ["priority", "projectName"], ["asc", "asc"]);
        if (!isEqual(dataTable, currentGuide)) {
            this.setState({
                dataTable,
                listCheckedItem: [],
            })
        }
    }

    handleClickRowTable = (event, item, index, ) => {
        const { onChange } = this.props;
        onChange && onChange(item.id)
    }

    handleSearchTable = columns => (data, value) => {
        let arraykeysearch = value.toLowerCase().split(',').map(item => item.trim());
        let keys = arraykeysearch.filter(item => { return item !== '' });
        return data.filter(item => {
            for (let index = 0; index < columns.length; index++) {
                let clo_name = columns[index].name;
                let valueCheck = item[clo_name] && item[clo_name].toString().toLowerCase();
                for (let key of keys) {
                    if (valueCheck && valueCheck.includes(key)) {
                        return true;
                    }
                }
            }
        });
    }

    render() {
        const { classes, data } = this.props;
        const { listCheckedItem, dataTable } = this.state;
        return (
            <React.Fragment>
                <div className={classes.container}>
                    <div className={classes.item1}>
                        <TablePlus
                            onSearch={this.handleSearchTable(columnsSearchTable)}
                            columns={columnsTable}
                            data={dataTable}
                            onSelect={undefined}
                            onClickRow={this.handleClickRowTable}
                            selected={listCheckedItem}
                            viewActionInRows={viewActionInRowTable}
                            nameTable={'List Project'}
                            rowsPerPageOptions={[20, 50, 100]}
                            rowsPerPage={20}
                            width_default={'100%'}
                            width_item={100}
                            height_table={560}
                            // height_table={638}
                            buttonActionInToolbar={undefined}
                            buttonActionsInRow={undefined}
                            isHover={true}
                            iconTable={false}
                        />
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(ProjectListTable);