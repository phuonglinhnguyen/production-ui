import React, { Component } from 'react';
import Viewer from '../../../../components/common/viewer/components_multiple/viewer';
import Wrapper from '../../../../components/common/layout/wrapper';
import LayoutSeparate from '../../../../components/common/layout/layout_separate';
import AutoResize from '../../../../components/common/layout/auto_size_decorator';
import FormWrapper from './form_wrapper_component';
import OverFlowGetTask from './overflow_get_task';
import FormValidationHOC from '../../../../components/common/form_validation';
import RuluesTranformsHOC from '../../../../components/common/form_transform_rules';
import Recordscomponent from './records_component';
import { isEqual } from 'lodash';
import Paper from 'material-ui/Paper';
const FormValidation = FormValidationHOC(FormWrapper)
const FormValidationTranForm =RuluesTranformsHOC(FormValidation);
const ViewerAutoResize = AutoResize(Viewer);
class Keying extends Component {
  state={
    stateView:{},
    viewer:null,
    showMask:true,
    showRectangle:true,
  }
  shouldComponentUpdate(nextProps,nextState) {
    return !isEqual(this.props, nextProps)||!isEqual(this.state,nextState);
  }
  handleGetNextTask = () => {
    const { taskActions, info, task } = this.props;
    taskActions.claimNextTask(info, task);
  }
  handleGetTask = () => {
    const { taskActions, info, task } = this.props;
    taskActions.claimTask(info, task);
  }
  handleGoBack = () => {
    const { router } = this.props;
    // router.history.push('/');
  }
  getImageURL=(task)=>{
    try {
      let _image = task.item ? task.item.doc.s2_url : '';
      if(Array.isArray(_image)){
        _image = _image[0]||'';
      }
      if(_image.length>0){
        _image=_image+'?action=thumbnail&width=3072'
      }
      return _image;
    } catch (error) {
      return '';
    }
  }
  handleChangeStateView=(state)=>{
    this.setState({stateView:state})
  }
  handleInitViewer=(viewer)=>{
    this.setState({viewer})
  }
  handleChangeShowMask=()=>{
    this.setState({showMask:!this.state.showMask})
  }
  render() {
    const { view, task, muiTheme, router, layout,taskActions,viewActions,info,project } = this.props;
    const {showRectangle,showMask} = this.state;
    const { focusPosition } = view;
    let _image = this.getImageURL(task);
    let mask = task.item && task.item.task ? task.item.task.mask : {};
    let _fields = layout.item ? layout.item.fields : [];
    let componentFirst;
    let section =[];
    let showControlFocus =false;
    if(layout.item&&layout.item.section){
      section = Array.isArray(layout.item.section)?layout.item.section:[layout.item.section]
      try {
       if(section[0].settings.multiple){
        showControlFocus=true;
       }
      } catch (error) {
      }
    }
    let noOfLine =0;
    try {
      noOfLine = task.records.length
    } catch (e) {
    
    }
    if (task.item && !task.didInValidation) {
      componentFirst = (
        <ViewerAutoResize
          stateView={0}
          initRef={this.handleInitViewer}
          imageUrl={_image}
          rectangle={focusPosition}
          line={task.record_selecting}
          section={section[0]}
          isTraining={info.isTraining}
          noOfLine={noOfLine}
          focusLine={showMask}
          showRectangle={showMask}
          showMask={showMask}
          lineHeightOriginal={mask.lineHeightOriginal}
          offsetTop={mask.offsetTop}
          onChangeStateView={this.handleChangeStateView}
          onChangeMask={taskActions.onChangeMask}
        // autoZoom // optional
        // strokeStyle={'rgba(47,242,47,0.9)'} // optional
        // lineWidth={10}// optional
        />
      );
    } else {
      componentFirst = (
        <OverFlowGetTask
          task={task}
          goBack={this.handleGoBack}
          getTask={this.handleGetNextTask}
        />
      );
    }
    if (task)
      return (
        <div>
        <Wrapper muiTheme={muiTheme} offset={{ top: 70, left: 4 }}>
          <LayoutSeparate
            viewType={1}
            first={
              <Paper style={{width:'calc(100% - 16px)',height:'calc(100% - 26px)', margin:'16px 0 0 16px'}} zDepth={1} >
              {componentFirst}
              </Paper>
            }
            second={
              <FormValidationTranForm
              {...this.props}
              project={project}
              showControlFocus={showControlFocus}
              onChangeShowMask={this.handleChangeShowMask}
              showMask={showMask}
              muiTheme={muiTheme}
              stateView={this.state.stateView}
              viewer={this.state.viewer}
              router={router}
              claimTask={this.handleGetTask}
              claimNextTask={this.handleGetNextTask}
              recordsInput={task.records}
              fieldsValidation={_fields}
              sectionsValidation={section}
              fields={_fields}
            />
          }
          />
        </Wrapper>
        {
          task.item?
                    <Recordscomponent
                    record_input={mask.record_input}
                    selectRecord={taskActions.setNextRecordWaiting} 
                    setViewRecords={viewActions.setViewRecords}
                    showRecord={view.view_records}
                    record_selecting={task.record_selecting} 
                    records={task.recordsCheckedData}
                    recordsChecked={task.recordsChecked}
                    fields={_fields}
                    />
                  :''}
      </div>
      );
  }
}
export default Keying;
