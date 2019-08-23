import React, { Component } from 'react';
import { Translate } from 'react-redux-i18n';
import RaisedButton from 'material-ui/RaisedButton';
import { limeA200 } from 'material-ui/styles/colors';
import { BEGIN_INDEX_FROM } from '../constants';
import ButtonActions from '../../common/button_actions';
import CircularProgress from "material-ui/CircularProgress";


export default class FormToolbar extends Component {

    render() {
        const {
            view,
            task,
            onSubmit,
            setNextTask,
            access,
            fields,
            isSaving,
            claimNextTask,
            claimTask
        } = this.props;
        let _reason = task.item&&task.item.complete_option?task.item.complete_option:[];
        try {
            if(task.item.task.hold_count===5){
                _reason =_reason.filter(item =>item.value!=='Hold')
            }
        } catch (error) {
            
        }
        let index_submit = fields.length + BEGIN_INDEX_FROM + 1;
        return (
            <div style={{width:'calc(100% - 32px)', margin:'8px 0 0 16px'}}>
                {!task.item || access ?
                    <ButtonActions
                        ref='btn_actions'
                        is_disabled={!task.item || isSaving}
                        is_saving={isSaving}
                        next={view.isNext}
                        reasons={_reason}
                        updateNextTask={(...params) => { setNextTask(!view.isNext) }}
                        saveTask={(event)=>onSubmit(null,event)}
                        saveTaskWithReason={onSubmit}
                    /> :
                    task.isFetching ?
                        <RaisedButton
                            secondary={true}
                            fullWidth={true}
                            label={<Translate value={"productions.keying.button.label.claiming"} />}
                            icon={<CircularProgress size={25} />}
                        /> :
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                marginBottom: 4
                            }}
                        >
                            <div style={{ flex: 1, paddingRight: 2 }}>
                                <RaisedButton
                                    label={<Translate value='productions.keying.button.label.claim_this_task' />}
                                    backgroundColor={(task.claim && !task.access) ? limeA200 : ''}
                                    labelPosition="before"
                                    disabled={!!task.claimInvalidate || (task.item.task.assignee && !task.access)}
                                    tabIndex={
                                        index_submit
                                    }
                                    onClick={claimTask}
                                >
                                </RaisedButton>
                            </div>
                            <div style={{ flex: 2, paddingRight: 2 }}>
                                <RaisedButton
                                    label={<Translate value='productions.keying.button.label.claim_next_task' />}
                                    labelPosition="before"
                                    tabIndex={index_submit}
                                    secondary={true}
                                    onClick={claimNextTask}
                                >
                                </RaisedButton>
                            </div>
                        </div>
                }
            </div>
        );
    }
}
