import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { handleChange } from '../../../../@components/FormInput'
import { bindActionCreators } from 'redux';

import Images from './Images'
import { getDataObject } from '@dgtx/coreui';

const getPolysOfRecord=(record)=>{
    let polylines =[]
    Object.keys(record).forEach(sectionName=>{
        let sectionData = record[sectionName]
        sectionData.forEach((rowData,rowId)=>{
            Object.keys(rowData).map(fieldName=>{
               let fieldValue = rowData[fieldName];
               if(fieldValue.words&&fieldValue.words[0]&&fieldValue.words[0].points){
                    polylines.push({data:{sectionName,rowId,fieldName},points:fieldValue.words[0].points,state:"view"})
               }
            })
        })
    })
    return polylines;
} 

const mapStateToProps = (state, ownProps) => {
    const username = getDataObject('user.user.username', state)
    const images = getDataObject('core.resources.form_state.data.task.images', state) || []
    const { active, value, current, values, sections, single } = getDataObject('core.resources.form.data', state) || {};
    let valueField = active && getDataObject(`${active.sectionName}.${active.rowId}.${active.fieldName}`, value) || {}
    let polylines = getPolysOfRecord(value)
    return {
        ...ownProps,
        images,
        valueField,
        current,
        active,
        lines: values.length,
        sections,
        single,
        username,
        polylines
    }
}
const mapDispatchToProps = (dispatch: any) => bindActionCreators({
    handleChange
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(Images)
