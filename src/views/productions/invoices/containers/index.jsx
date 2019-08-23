import * as React from 'react'
import { crudGetOne, crudGetList, getDataObject } from '@dgtx/coreui'
import MainInvoice from './MainInvoice'
import { PageDecorator, showNotification } from '@dgtx/coreui';
import { loadData } from '../actions/formActions'
import { setSectionsForm, handleChange } from '../../../../@components/FormInput'
import { claimTask, setStoreDataRecent } from '../actions/taskActions'
import FormState from '../reducers/formState'
const options = {
    resources: [
        { name: 'keying_task' },
        
        FormState
    ],
    actions: {
        crudGetOne,
        crudGetList,
        setSectionsForm,
        handleChange,
        loadData,
        showNotification,
        claimTask,
        setStoreDataRecent,
    },
    mapState: (state) => {
        const hasTask = !!getDataObject('core.resources.form_state.data.ready', state)
        const validating = !!getDataObject('core.resources.form.data.validating', state)
        const loadingData = !!getDataObject('core.resources.form_state.data.loading', state)

        return {
            hasTask,
            loadingData,
            validating,
        };
    }
}
export default PageDecorator(options)(MainInvoice)
