import React, { Component } from 'react';
import Viewer from '../../../../components/common/viewer/components/viewer';
import Wrapper from '../../../../components/common/layout/wrapper';
import LayoutSeparate from '../../../../components/common/layout/layout_separate';
import AutoResize from '../../../../components/common/layout/auto_size_decorator';
import FormWrapper from './form_wrapper_component';
import OverFlowGetTask from './overflow_get_task';
import FormValidationHOC from '../../../../components/common/form_validation';
import RuluesTranformsHOC from '../../../../components/common/form_transform_rules';
import { isEqual } from 'lodash';
import Paper from 'material-ui/Paper';
const FormValidation = FormValidationHOC(FormWrapper)
const FormValidationTranForm =RuluesTranformsHOC(FormValidation);
const ViewerAutoResize = AutoResize(Viewer);
class Keying extends Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(this.props, nextProps);
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
    router.history.push('/production-start');
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
  render() {
    const { view, task, muiTheme, router, layout } = this.props;
    const { focusPosition } = view;
    let _image = this.getImageURL(task);
    let _fields = layout.item ? layout.item.fields : [];
    let section =[];
    if(layout.item&&layout.item.section){
      section = Array.isArray(layout.item.section)?layout.item.section:[layout.item.section]
    }
    let componentFirst;
    if (task.item && !task.didInValidation) {
      componentFirst = (
        <ViewerAutoResize
          stateView={0}
          imageUrl={_image}
          rectangle={focusPosition}
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
              muiTheme={muiTheme}
              router={router}
              claimTask={this.handleGetTask}
              claimNextTask={this.handleGetNextTask}
              recordsInput={[task.record]}
              fieldsValidation={_fields}
              fieldsTranforms={_fields}
              sectionsValidation={section}
              fields={_fields}
            />
          }
          />
        </Wrapper>
      );
  }
}
export default Keying;
