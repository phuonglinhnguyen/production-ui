import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import TablePlus from '../../table_plus/table_plus_component';
import DeleteIcon from '@material-ui/icons/Delete';
import Search from '@material-ui/icons/Search';
import Download from '@material-ui/icons/ArrowDownward';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import * as convertData from '../actions/project_guide_view_convert_data';
import { getDataObject } from '@dgtx/coreui';
import { isEqual } from 'lodash';

const styles = theme => ({
    container: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        maxWidth: '100vh',
        height: '100%',
        maxHeight: 'max-content',
    },
    item1: {
        textAlign: 'center',
        height: '-webkit-fill-available',
        maxHeight: '-webkit-fill-available',
        maxWidth: '100%',
        width: '100vh',
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
    function: false,
    removeAll: false,
    search: true,
    toolbar: true
}
const columnsTable = convertData.convertColumnsData();
const columnsSearchTable = convertData.convertColumnsSearch();

class ProjectGuideViewTabsItemComponent extends Component {
    state = {
        listCheckedItem: [],
        dataTable: []
    }

    componentWillMount = () => {
        const { data } = this.props;
        let dataTable = data.files.map(item => convertData.createRowsData(item));
        this.setState({
            dataTable
        })
    }

    componentWillUnmount = () => {
        this.setState({
            listCheckedItem: [],
            dataTable: []
        })
    }

    componentWillReceiveProps = (nextProps) => {
        let nextGuide = nextProps.data;
        let currentGuide = this.state.dataTable;
        let dataTable = nextGuide.files.map(item => convertData.createRowsData(item));
        if (!isEqual(dataTable, currentGuide)) {
            this.setState({
                dataTable,
                listCheckedItem: [],
            })
        }
    }

    handleCheckboxTable = (checkedList) => {
        this.setState({
            listCheckedItem: checkedList
        })
    }

    handleSearchTable = columns => (data, value) => {
        let arraykeysearch = value.toLowerCase().split(',').map(item => item.trim());
        let keys = arraykeysearch.filter(item => { return item !== '' });
        return data.filter(item => {
            for (let index = 0; index < columns.length; index++) {
                let clo_name = columns[index].name;
                let valueCheck = item[clo_name] && item[clo_name].toString().toLowerCase()
                for (let key of keys) {
                    if (valueCheck && valueCheck.includes(key)) {
                        return true;
                    }
                }
            }
        });
    }

    handleClickFunctionTable = (action, data) => () => {
        const { projectId, actions } = this.props;
        if (action === "Download" && projectId) {
            actions && actions.download(projectId, data);
            return;
        }
        if (action === "View" && projectId) {
            window.open(data.s3Url);
            return;
        }
    }

    render() {
        const { classes, data } = this.props;
        const { listCheckedItem, dataTable } = this.state;
        let folderName = getDataObject("folder_name", data) ? getDataObject("folder_name", data) : '';
        return (
            <React.Fragment>
                <div className={classes.container}>
                    <div className={classes.item1}>
                        {!data || data.length === 0 ? <Typography variant="h3" gutterBottom colorError="red"> No File Uploaded! </Typography> :
                            <Paper elevation={2}>
                                <TablePlus
                                    onSearch={this.handleSearchTable(columnsSearchTable)}
                                    columns={columnsTable}
                                    data={dataTable}
                                    onSelect={this.handleCheckboxTable}
                                    selected={listCheckedItem}
                                    viewActionInRows={viewActionInRowTable}
                                    nameTable={'List Project Guides'}
                                    rowsPerPageOptions={[20, 50, 100]}
                                    rowsPerPage={20}
                                    width_default={450}
                                    width_item={100}
                                    height_table={580}
                                    isHover={true}
                                    buttonActionInToolbar={undefined}
                                    buttonActionsInRow={(item) => {
                                        if (item && item.fileName.split(".")[1] === "pdf") {
                                            return (
                                                <Tooltip
                                                    title={"View File"}
                                                    placement={'bottom-start'}
                                                    enterDelay={300}
                                                >
                                                    <Button name='ViewFile' onClick={this.handleClickFunctionTable('View', item)}
                                                        variant="fab" mini color="primary" >
                                                        <Search />
                                                    </Button>
                                                </Tooltip>
                                            )
                                        }
                                        else {
                                            return (
                                                <Tooltip
                                                    title={"Download File"}
                                                    placement={'bottom-start'}
                                                    enterDelay={300}
                                                >
                                                    <Button name='DownloadFile' onClick={this.handleClickFunctionTable('Download', item)}
                                                        variant="fab" mini color="primary" >
                                                        <Download />
                                                    </Button>
                                                </Tooltip>
                                            )
                                        }
                                    }} />
                            </Paper>
                        }
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default withStyles(styles)(ProjectGuideViewTabsItemComponent);