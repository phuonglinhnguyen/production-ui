import React, { Component } from 'react';
import Viewer from '../../../../components/common/viewer/components_multiple/viewer';
import Wrapper from '../../../../components/common/layout/wrapper';
import LayoutSeparate from '../../../../components/common/layout/layout_separate';
import AutoResize from '../../../../components/common/layout/auto_size_decorator';
import FormWrapper from './form_wrapper_component';
import OverFlowGetTask from './overflow_get_task';
import FormValidationHOC from '../../../../components/common/form_validation';
import RuluesTranformsHOC from '../../../../components/common/form_transform_rules';
import Recordscomponent from './records_component'
import Paper from 'material-ui/Paper';
const FormValidation = FormValidationHOC(FormWrapper)
const FormValidationTranForm = RuluesTranformsHOC(FormValidation);
const ViewerAutoResize = AutoResize(Viewer);
class Keying extends Component {
  state = {
    stateView: {},
    viewer: null,
    fields: [],
    section_visiable: '',
    fieldsFull: [],
  }
  // shouldComponentUpdate(nextProps,nextState) {
  //   return !isEqual(this.props, nextProps)||!isEqual(this.state,nextState);
  // }
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
    router.history.push('/');
  }
  getImageURL = (task) => {
    try {
      let _image = task.item ? task.item.doc.s2_url : '';
      if (Array.isArray(_image)) {
        _image = _image[0] || '';
      }
      if (_image.length > 0) {
        _image = _image + '?action=thumbnail&width=3072'
      }
      return _image;
    } catch (error) {
      return '';
    }
  }
  componentWillReceiveProps(nextProps) {
    const { layout, task } = nextProps;
    if (layout.item && layout.item.type === 'mixed') {
      let section_mixed= layout.item.sections.filter(item => item.settings.type === 'mixed')[0];
      let field_control = section_mixed.settings.field_control
      if (this.state.fields.length === 0) {
        let fields = section_mixed.fields;
        this.setState({ fields })
      } else {
        if (task.records[task.record_selecting] && task.records[task.record_selecting][field_control]) {
          let event_type_current = task.records[task.record_selecting][field_control]
          if (!this.props.task.records[this.props.task.record_selecting] || event_type_current !== this.props.task.records[this.props.task.record_selecting][field_control]) {
            let fields_select = layout.item.sections.filter(item => item.name === event_type_current)[0].fields;
            let fields = layout.item.sections.filter(item => item.settings.type === 'mixed')[0].fields;
            fields = fields.concat(fields_select)
            this.setState({ fields, section_visiable: event_type_current })
          }
        } else {
          let fields = section_mixed.fields;
          this.setState({ fields })
        }
      }
      if(this.state.fieldsFull.length===0){
        let hasName =[];
        let fieldsFull =[]
        section_mixed.fields.forEach(field_item=>{
          if(!hasName.includes(field_item.name)){
            fieldsFull.push(field_item)
            hasName.push(field_item.name)
          }
        })
        layout.item.sections.forEach(section => {
          section.fields.forEach(field_item=>{
            if(!hasName.includes(field_item.name)){
              fieldsFull.push(field_item)
              hasName.push(field_item.name)
            }
          })
        });
        this.setState({fieldsFull})
      }      
    }
  }
  handleChangeStateView = (state) => {
    this.setState({ stateView: state })
  }
  handleInitViewer = (viewer) => {
    this.setState({ viewer })
  }
  render() {
    const { view, task, muiTheme, router, layout, taskActions, viewActions, info } = this.props;
    const { section_visiable, fieldsFull } = this.state;
    let _fields = this.state.fields;
    const { focusPosition } = view;
    let _image = this.getImageURL(task);
    let mask = task.item && task.item.task ? task.item.task.mask : {};
    let componentFirst;
    let section = [];
    if (layout.item && layout.item.section) {
      section = Array.isArray(layout.item.section) ? layout.item.section : [layout.item.section]
    }
    let noOfLine = 0;
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
          section={section}
          isTraining={info.isTraining}
          noOfLine={noOfLine}
          focusLine={true}
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
                <Paper style={{ width: 'calc(100% - 16px)', height: 'calc(100% - 26px)', margin: '16px 0 0 16px' }} zDepth={1} >
                  {componentFirst}
                </Paper>
              }
              second={
                <FormValidationTranForm
                  {...this.props}
                  muiTheme={muiTheme}
                  section_visiable={section_visiable}
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
            task.item ?
              <Recordscomponent
                record_input={mask.record_input}
                selectRecord={taskActions.setNextRecordWaiting}
                setViewRecords={viewActions.setViewRecords}
                showRecord={view.view_records}
                record_selecting={task.record_selecting}
                records={task.recordsCheckedData}
                recordsChecked={task.recordsChecked}
                fields={fieldsFull}
              />
              : ''}
        </div>
      );
  }
}
export default Keying;
