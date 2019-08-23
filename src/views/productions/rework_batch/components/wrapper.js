import * as React from 'react';
import { Translate } from 'react-redux-i18n'
import { Loading } from './loading'
import { BatchList } from './batch_list'
import { BatchDetail } from './batch_detail'
import SwipeableViews from 'react-swipeable-views';
import Snackbar from "material-ui/Snackbar";
import DialogRework from '../components/dialog_rework_component'
import DialogClose from '../components/dialiog_approve_component'
export const ReworkBatchWapper = (props) => {
    const {
        reworkBatch,
        username,
        // history,
        // location,
        match,
        muiTheme,
        getTask,
        saveTask,
        closeSnackBar,
        selectTasks,
        showBatchDetail,
        // showSnackBar,
        showDialog,
        hideDialog,
        fields,
        sections
    } = props;
    const { 
        // isFetchingTask = false,
        isSaving = false,
        dataTasks,
        selectedTasks,
        // dataTasksLength = 0,
        // showDetail,
        // isFetchingDetail,
        dataTask,
        statusText,
        showError = false,
        dialogType
    } = reworkBatch || {};
    const { projectId, taskKeyDef } = match.params;
    const style_main = {
        height: "calc(100vh - 98px)",
        width: '100%',
        display: 'flex',
        minWidth: "680px",
        minHeight: "680px",
        flexWrap: "wrap",
        flexDirection: 'row',
        flexGrow: 1,
        padding: 16,
        backgroundColor:muiTheme.palette.background1Color,
    };
    if (!dataTasks) {
        return (
            <div style={style_main}>
                <Loading
                    onInitial={() => {
                        getTask({ projectId, username, taskKeyDef })
                    }}
                />
            </div>
        )
    }
    return (
        <div style={style_main}>
         <Snackbar
          open={showError}
          message={<Translate value={statusText} />}
          onRequestClose={closeSnackBar}
        />
        <DialogClose
        Translate={Translate}
        action_closeDialog={() => hideDialog()}
        action_saveRework={() => {
          saveTask({projectId,taskKeyDef, type:'close', username,fields:[] })
        }}
        open_dialog={dialogType ==='close'}
        />
         <DialogRework
          Translate={Translate}
          action_closeDialog={() => hideDialog()}
          action_saveRework={(sectionsRework, rework_fields, comment, owner) => {
            saveTask({projectId,taskKeyDef, type:'rework', username, sections: sectionsRework, fields:rework_fields.map(item=>item.name) })
          }}
          sections={sections}
          open_dialog={dialogType ==='rework'}
          fields={fields}
        />
            <SwipeableViews index={dataTask?1:0}>
                <div >
                    <BatchList
                        datas={dataTasks}
                        selectTasks={selectTasks}
                        selectedTasks={selectedTasks}
                        onSelectBatch={(data) => {
                            if(isSaving){
                                return
                            }
                            showBatchDetail(projectId, data)
                        }}
                        isSaving={isSaving}
                        onSubmit={type=>{
                            showDialog(type);
                            // if(type==='rework'){
                            //     showDialog(type);
                            // }
                            // saveTask({projectId,taskKeyDef,type,username})
                        }}
                        muiTheme={muiTheme}
                    />
                </div>
                <div>
                    <BatchDetail  selectTasks={showBatchDetail} data={dataTask||{}} muiTheme={muiTheme} />
                </div>
            </SwipeableViews>
        </div>
    );
}