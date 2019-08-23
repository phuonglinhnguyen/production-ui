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
        maxWidth: '100vw',
        height: '100%',
        maxHeight: 'max-content',
        backgroundColor: 'green'
    },
    item1: {
        backgroundColor: 'blue',
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
    checkbox: true,
    function: true,
    removeAll: true,
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
        // console.log("componentWillMount data: ", data)
        let dataTable = data.files.map(item => convertData.createRowsData(item));
        this.setState({
            dataTable
        })
    }

    componentWillReceiveProps = (nextProps) => {
        let nextGuide = nextProps.data;
        let currentGuide = this.state.dataTable;
        let dataTable = nextGuide.files.map(item => convertData.createRowsData(item));
        // console.log("componentWillReceiveProps nextGuide: ", nextGuide)
        // console.log("componentWillReceiveProps currentGuide: ", currentGuide)
        // console.log("componentWillReceiveProps dataTable: ", dataTable)
        if (!isEqual(dataTable, currentGuide)) {
            this.setState({
                dataTable,
                listCheckedItem: [],
            })
        }
    }

    handleCheckboxTable = (checkedList) => {
        // console.log("checkedList: ", checkedList)
        this.setState({
            listCheckedItem: checkedList
        })
    }

    handleSearchTable = () => {

    }

    handleClickFunctionTable = (action,data) => {
        //console.log(data);
        const {projectId, actions} = this.props;
        if(action === "RemoveAll")
        if(action === "Remove"){
            
        }
        if(action === "Download"){
            actions && actions.download(projectId,data);
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
                                    width_default={700}
                                    width_item={100}
                                    height_table={580}
                                    buttonActionInToolbar={
                                        <React.Fragment>
                                            <Tooltip
                                                title={"Remove All"}
                                                placement={'bottom-start'}
                                                enterDelay={300}
                                            >
                                                <Button name='RemoveAll' onClick={this.handleClickFunctionTable('RemoveAll')}
                                                    mini color="secondary">
                                                    <DeleteIcon />
                                                </Button>
                                            </Tooltip>
                                        </React.Fragment>
                                    }
                                    buttonActionsInRow={(item) => {
                                        return (
                                            <React.Fragment>
                                                <Tooltip
                                                    title={"Remove"}
                                                    placement={'bottom-start'}
                                                    enterDelay={300}
                                                >
                                                    <Button style={{ marginRight: '10px' }} name='Remove' onClick={this.handleClickFunctionTable('Remove', item)}
                                                        variant="fab" mini color="secondary" >
                                                        <DeleteIcon />
                                                    </Button>
                                                </Tooltip>
                                                {item && item.fileName.split(".")[1] === "pdf" ?
                                                    <Tooltip
                                                        title={"View File"}
                                                        placement={'bottom-start'}
                                                        enterDelay={300}
                                                    >
                                                        <Button name='ViewFile' onClick={window.open(item.s3Url) }
                                                            variant="fab" mini color="primary" >
                                                            <Search />
                                                        </Button>
                                                    </Tooltip>
                                                    :
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
                                                }

                                            </React.Fragment>
                                        )
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