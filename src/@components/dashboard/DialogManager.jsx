
import * as React from 'react';
import { getDataObject } from '@dgtx/coreui'
import { Translate, I18n } from 'react-redux-i18n'

import {
    Button,
    Dialog,
    TextField,
} from '@material-ui/core'

import TextUser from './TextUser'

export const DASHBROAD_DIALOG_TYPE_CREATE_GROUP = 'DASHBROAD_DIALOG_TYPE_CREATE_GROUP'
export const DASHBROAD_DIALOG_TYPE_EDIT_GROUP = 'DASHBROAD_DIALOG_TYPE_EDIT_GROUP'
export const DASHBROAD_DIALOG_TYPE_CREATE_PROJECT = 'DASHBROAD_DIALOG_TYPE_CREATE_PROJECT'
export const DASHBROAD_DIALOG_TYPE_EDIT_PROJECT = 'DASHBROAD_DIALOG_TYPE_EDIT_PROJECT'

type Props = {
    showDialog: boolean,
    hideDialog: Function,
    changeData: Function,
    onSubmit: Function,
    dashboard: Object,
    dialogType: string,
    users: Array<Object>,
    groups: Array<Object>,

};


function RenderBody(props) {
    const {
        users,
        dialogType,
        dashboard,
        changeData,
    } = props;
    switch (dialogType) {
        case DASHBROAD_DIALOG_TYPE_CREATE_GROUP:
            return (
                <React.Fragment>
                    <TextField
                        value={
                            getDataObject('data.groupNameEditing', dashboard)
                        }
                        onChange={
                            (event) => {
                                changeData('data.groupNameEditing', event.target.value)
                            }
                        }
                        floatingLabelText={
                            <Translate
                                value='dashboard.form.input_group_name_title'
                            />
                        }
                    /><br />
                </React.Fragment>
            )
        default:
            // let active = getDataObject('data.add_project.active', dashboard);
            return (
                <React.Fragment>
                    <div style={
                        {
                            display: "flex",
                            flexWrap: "nowrap",
                            flexDirection: 'row',
                            width: 'calc(100%)'
                        }
                    }>
                        <div style={
                            {
                                width: 'calc(50% - 16px)',
                                marginRight: 16
                            }
                        }>
                            <TextField
                                fullWidth={true}
                                autoFocus={true}
                                value={getDataObject('data.add_project.name', dashboard)}
                                onChange={
                                    (event) => {
                                        changeData('data.add_project.name', event.target.value)
                                    }
                                }
                                floatingLabelText={
                                    <Translate value='dashboard.form.input_project_name_title' />
                                }
                                hintText={<Translate value='dashboard.form.input_project_name_hint' />}
                                floatingLabelFixed={true}
                            /><br />
                            <TextField
                                fullWidth={true}
                                value={getDataObject('data.add_project.customer', dashboard)}
                                onChange={(event) => { changeData('data.add_project.customer', event.target.value) }}
                                floatingLabelText={<Translate value='dashboard.form.input_customer_name_title' />}
                                hintText={<Translate value='dashboard.form.input_group_name_hint' />}
                                floatingLabelFixed={true}
                            /><br />
                            {/* <Toggle
                                style={{ marginTop: '35px' }}
                                label={active ?
                                    <p style={{ display: 'inline' }}>Status: <span style={{ color: 'green' }}>Active</span></p>
                                    : <p style={{ display: 'inline' }}>Status: <span style={{ color: 'red' }}>Inactive</span></p>
                                }
                                labelPosition="right"
                                defaultToggled={active}
                                onToggle={(event, isInputChecked) => {
                                    changeData('data.add_project.active', isInputChecked)
                                }}
                            /> */}

                            {/* <GroupSelect
                                groups={groups}
                                fullWidth={true}
                                primary1Color={muiTheme.palette.primary1Color}
                                secondaryTextColor={muiTheme.palette.secondaryTextColor}
                                hintText={<Translate value='dashboard.form.input_group_name_hint' />}
                                floatingLabelText={<Translate value='dashboard.form.input_group_name_title' />}
                                floatingLabelFixed={true}
                                
                                group_id={getDataObject('data.add_project.group_id', dashboard)}
                                group_name={getDataObject('data.add_project.group_name', dashboard)}
                                onChange={(id, data) => {
                                    changeData('data.add_project.group_id', data.id)
                                    changeData('data.add_project.group_name', data.name)
                                }}
                            /> */}
                            <br />
                        </div>
                        <div style={{ width: 'calc(50% - 16px)' }}>
                            <TextField
                                fullWidth={true}
                                hintText={<Translate value='dashboard.form.input_project_priority_hint' />}
                                floatingLabelText={<Translate value='dashboard.form.input_project_priority_title' />}
                                floatingLabelFixed={true}
                                value={getDataObject('data.add_project.priority', dashboard)}
                                onChange={
                                    (event) => {
                                        changeData('data.add_project.priority', event.target.value)
                                    }
                                }
                            /><br />
                            <TextField
                                fullWidth={true}
                                hintText={<Translate value='dashboard.form.input_project_path_hint' />}
                                floatingLabelText={<Translate value='dashboard.form.input_project_path_title' />}
                                floatingLabelFixed={true}
                                value={getDataObject('data.add_project.folder', dashboard)}
                                onChange={(event) => { changeData('data.add_project.folder', event.target.value) }}
                            /><br />


                        </div>
                    </div>
                    <TextUser
                        floatingLabelText='PROJECT MANAGERMENT'
                        value={getDataObject('data.add_project.project_managers', dashboard)}
                        onUpdateInput={name => {
                            let value = getDataObject('data.add_project.project_managers', dashboard);
                            value = Array.isArray(value) ? [...value, name] : [name];
                            changeData('data.add_project.project_managers', value);
                        }}
                        onDeleteItem={name => {
                            let value = getDataObject('data.add_project.project_managers', dashboard);
                            value = value.filter(item => item !== name);
                            changeData('data.add_project.project_managers', value);
                        }}
                        users={users}
                    />
                    <br />
                    <TextUser
                        floatingLabelText='PROJECT DESIGNER'
                        value={getDataObject('data.add_project.designers', dashboard)}
                        onUpdateInput={name => {
                            let value = getDataObject('data.add_project.designers', dashboard);
                            value = Array.isArray(value) ? [...value, name] : [name];
                            changeData('data.add_project.designers', value);
                        }}
                        onDeleteItem={name => {
                            let value = getDataObject('data.add_project.designers', dashboard);
                            value = value.filter(item => item !== name);
                            changeData('data.add_project.designers', value);
                        }}
                        users={users}
                    />
                    <br />
                    <TextUser
                        users={users}
                        floatingLabelText='QC ADMIN'
                        value={getDataObject('data.add_project.qc_admins', dashboard)}
                        onUpdateInput={name => {
                            let value = getDataObject('data.add_project.qc_admins', dashboard);
                            value = Array.isArray(value) ? [...value, name] : [name];
                            changeData('data.add_project.qc_admins', value);
                        }}
                        onDeleteItem={name => {
                            let value = getDataObject('data.add_project.qc_admins', dashboard);
                            value = value.filter(item => item !== name);
                            changeData('data.add_project.qc_admins', value);
                        }}
                    />
                    <br />
                </React.Fragment>
            )
    }
}
function DialogManager(props: Props) {
    if (!props.showDialog) {
        return ''
    }
    const handleClose = (event) => {
        event.stopPropagation();
        event.preventDefault()
        props.hideDialog()
    }
    const handleSubmit = (event) => {
        event.stopPropagation();
        event.preventDefault()
        props.onSubmit(props.dialogType)
    }



    let labelSubmit = 'CREATE';
    let titleDialog = I18n.t('dashboard.dialog.create_project_title');
    if (props.dialogType ===
        DASHBROAD_DIALOG_TYPE_EDIT_GROUP ||
        props.dialogType === DASHBROAD_DIALOG_TYPE_EDIT_PROJECT
    ) {
        labelSubmit = 'UPDATE'
    }

    if (props.dialogType === DASHBROAD_DIALOG_TYPE_EDIT_PROJECT) {
        titleDialog = I18n.t('dashboard.dialog.create_project_title');
    } else if (props.dialogType === DASHBROAD_DIALOG_TYPE_CREATE_GROUP) {
        titleDialog = I18n.t('dashboard.dialog.create_group_title');
    } else if (props.dialogType === DASHBROAD_DIALOG_TYPE_EDIT_GROUP) {
        titleDialog = I18n.t('dashboard.dialog.edit_group_title');
    }

    const actions = [
        <Button
            label="Cancel"
            primary={true}
            onClick={handleClose}
        />,
        <Button
            label={labelSubmit}
            primary={true}
            keyboardFocused={true}
            onClick={handleSubmit}
        />,
    ];
    return (
        <Dialog
            title={titleDialog}
            actions={actions}
            modal={true}
            open={props.showDialog}
            onRequestClose={handleClose}
        >
            <RenderBody {...props} />
        </Dialog>
    );
};

export default DialogManager;