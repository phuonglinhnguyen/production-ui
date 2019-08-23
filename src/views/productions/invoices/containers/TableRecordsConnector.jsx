
import * as React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TableRecords from '../compenents/TableRecords/TableRecords';
import { getDataObject } from '@dgtx/coreui';
import { handleChangeRecord } from '../../../../@components/FormInput'

export default connect((state, ownProps) => {
    const showRecords = Boolean(getDataObject('core.resources.form_state.data.showRecords', state));
    const {
       values=[],
       fields=[],
       sections=[],
       current=0,
       recordsTouched={}
    } = getDataObject('core.resources.form.data', state)||{};
    return {
      showRecords,
      values,
      fields,
      sections,
      current,
      recordsTouched
    }
},
    (dispatch: any) => bindActionCreators({
      handleChangeRecord
   }, dispatch)
)(TableRecords)
