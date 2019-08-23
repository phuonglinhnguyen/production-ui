import * as React from 'react'
import { isEqual } from 'lodash'
import { withStyles, Checkbox } from '@material-ui/core';
import { matchPath } from 'react-router'
import SplitPane from 'react-split-pane'
import FormInvoice from './FormInvoice';
import { AutoSizer } from '../../../../@components/common';
import Paper from '@material-ui/core/Paper';
import { KEYING_TASK } from '../../../../providers/resources';
import ImageEmpty from '../compenents/ImageEmpty';
import { getDataObject } from '@dgtx/coreui';
import ImageConnetor from './ImageConnetor';
import ReasonConnector from './ReasonConnector';
import TrySaveConnector from './TrySaveConnector.';

import { AutoSizer as AutoSizerVir } from 'react-virtualized';
import TableRecordsConnector from './TableRecordsConnector'

import { WorkingDetail } from '../../user_working_detail'

const Wrapper = (Taget) => (props) => {
    return (
        <div style={{ width: '100vw', height: 'calc(100vh - 64px)', marginTop: '64px' }}>
            <Taget {...props} />
        </div>
    )
}

class MainInvoice extends React.Component {
    state = {
        stateView: 0,
        stateViewH: 10,
        typeView: true,
    }
    componentWillMount() {
        const {
            setSectionsForm,
            crudGetList,
            showNotification,
            viewType,
            user: { username },
            match: { params: { projectId, taskKeyDef, layoutName, sectionName } }
        } = this.props;
        if (viewType) {
            if (viewType === "keyings") {
                this.setState({ showRecords: true })
            }
        }
        let sections = []
        if (sectionName) {
            sections = sectionName.split(',')
        }
        crudGetList('section', {
            projectId,
            layoutName,
        }, {
                onSuccess: ({ dispatch, result: { data } }) => {
                    if (sections.length) {
                        setSectionsForm(data.filter(item => sections.includes(item.name)))
                    } else {
                        setSectionsForm(data)
                    }
                },
                onFailure: (data) => {
                    showNotification('messages.error.cant_get_sections', 'error', { i18n: true, duration: 2500 })
                }
            })
    }
    handleGetTask = () => {
        const {
            claimTask,
            user: { username },
            match: { params: { projectId, layoutName, taskKeyDef } }
        } = this.props;
        claimTask({
            username,
            projectId,
            taskKeyDef,
            layoutName
        })
    }
    componentDidMount() {
        // this.handleGetTask();
        try {
          window.addEventListener('beforeunload', this.handleClosePage)
          window.location.hash = "no-back-button";
          window.location.hash = "Again-No-back-button";//again because google chrome don't insert first hash into history
          window.onhashchange = function () { window.location.hash = "no-back-button"; }
        } catch (e) { }
    }
    componentWillUnmount = () => {
        const { setStoreDataRecent } = this.props;
        setStoreDataRecent && setStoreDataRecent();
        try {
            window.removeEventListener('beforeunload', this.handleClosePage)
            window.location.hash = "";
            window.location.hash = "";//again because google chrome don't insert first hash into history
            window.onhashchange = function () { window.location.hash = ""; }
          } catch (e) {
          }
    }
    shouldComponentUpdate = (nextProps, nextState) => {
        return !isEqual(this.props, nextProps) || !isEqual(this.state, nextState)
    }
    handleClosePage = (event) => {
        let dialogText = 'Dư liệu của bạn đã lưu chưa?. Bạn có chắc muốn rồi khỏi trang này?';
        event.returnValue = dialogText;
        return dialogText;
    }
    render() {
        const {
            match,
            width,
            hasTask,
            loadingData,
            viewType,
            validating,
        } = this.props;
        const { stateView, stateViewH, typeView, showRecords, height } = this.state;
        const basePath = match.url;
        let _view = typeView ? "vertical" : "horizontal"
        let loading = loadingData;
        let _userRecords = false;
        if (viewType) {
            if (viewType === "keyings") {
                _userRecords = true;
            }
        }
        return (
            <div style={{
                position: 'relative',
                width: '100%',
                height: '100%', display: 'flex',
                flex: '1 1 0%',
            }} >
                <WorkingDetail  validating={validating}/>
                <SplitPane
                    split="horizontal"
                    minSize={50}
                    defaultSize={showRecords ? "20%" : "100%"}
                    className="primary"
                    primary={showRecords ? "second" : "first"}
                    // onChange={stateViewH => {
                    //     this.setState({ stateViewH })

                    // }}
                    onDragFinished={(stateViewH) => {
                        this.setState({ stateViewH, stateView: stateViewH })
                    }}
                >
                    <SplitPane split={_view} maxSize={width - 350} defaultSize="50%" minSize={50}
                        // onChange={stateView => {
                        //     this.setState({ stateView })

                        // }}
                        onDragFinished={(stateView) => {
                            this.setState({ stateView })
                        }}
                    >
                        <Paper style={
                            {
                                width: 'calc(100% - 12px)',
                                height: 'calc(100% - 12px)',
                                margin: '8px 0px 0px 8px',
                                position: 'relative',
                            }
                        } >
                            {!hasTask ?
                                <ImageEmpty loading={loading} getTask={this.handleGetTask} />
                                : <ImageConnetor stateView={stateView} validating={validating} />
                            }
                        </Paper>
                        {/* <FormInvoice stateView={stateView} /> */}
                        <FormInvoice stateView={stateView} disabled={!hasTask}  validating={validating}/>
                    </SplitPane>
                    {_userRecords ? <TableRecordsConnector  validating={validating} showRecords={showRecords} stateView={stateView} disabled={!hasTask} /> : ""}
                </SplitPane>
                <ReasonConnector />
                <TrySaveConnector />
            </div>
        )
    }
}
export default Wrapper(AutoSizer(MainInvoice))