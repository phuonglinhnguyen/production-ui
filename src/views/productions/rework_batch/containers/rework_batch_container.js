import * as React from 'react'

import {
    getTask,
    saveTask,
    closeSnackBar,
    selectTasks,
    showBatchDetail,
    showSnackBar,
    showDialog,
    hideDialog,
    resetReworBatch,
} from '../actions/rework_batch_actions'
import { bindActionCreators } from "redux";
// import muiThemeable from "material-ui/styles/muiThemeable";
import { ReworkBatchWapper } from '../components/wrapper'
import { connect } from 'react-redux'


class ReworkBatchesContainer extends React.Component{
    componentWillUnmount=()=>{
        const {resetReworBatch} = this.props;
        resetReworBatch&&resetReworBatch();
    }
    render(){
          return  <ReworkBatchWapper {...this.props}/>
    }
}
const mapStateToProps = (state,ownProps) => {
    let projectId ='';
    try {
        projectId = ownProps.match.params.projectId
    } catch (error) {
        
    }
    return {
        reworkBatch: state.production.reworkBatch,
        username: state.user.user.username,
        fields: state.field_list.fields,
        sections:state.production.sections.data[projectId]||[]

    }
}
const mapDispatchToProps = dispatch => {
    return bindActionCreators({
        getTask,
        saveTask,
        closeSnackBar,
        selectTasks,
        showBatchDetail,
        showSnackBar,
        showDialog,
        hideDialog,
        resetReworBatch,
    }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(ReworkBatchesContainer);