import * as React from 'react'

import { Dialog ,Button} from '@material-ui/core'

import { I18n ,Translate} from 'react-redux-i18n'
type PropsDialog = {
    open: boolean,
    type: 'edit_project' | 'add_project',
    onCancel: Function,
    onSubmit: Function
}

export const DialogConfirm: React.StatelessComponent = (props: PropsDialog) => {
    const {
        open,
        type,
        onCancel,
        onSubmit,
    } = props;
    let message = '', title = '', btn_cancel = 'Cancel', btn_submit = 'Submit'
    switch (type) {
        case 'edit_project':
            title = I18n.t('dashboard.dialog.confirm.out_editing_project.title');
            message = <Translate value='dashboard.dialog.confirm.out_editing_project.message' dangerousHTML/>;
            btn_cancel = I18n.t('dashboard.dialog.confirm.out_editing_project.btn_cancel');
            btn_submit = I18n.t('dashboard.dialog.confirm.out_editing_project.btn_submit');
            break;
        case 'add_project':

            break;
        default:
            break;
    }


    const actions = [
        <Button
            label={btn_cancel}
            primary={true}
            onClick={onCancel}
        />,
        <Button
            label={btn_submit}
            primary={true}
            keyboardFocused={true}
            onClick={onSubmit}
        />,
    ];
    return (
        <Dialog
            title={title}
            actions={actions}
            modal={false}
            open={open}
            onRequestClose={onCancel}
        >
            {message}
        </Dialog>
    )
}