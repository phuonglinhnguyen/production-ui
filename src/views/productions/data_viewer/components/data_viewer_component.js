import React from 'react';

import Paper from 'material-ui/Paper';
import BatchComponent from './batches_table_component';
import DocumentComponent from './document_table_component';
import Loading from '../../../../components/Loading/Loading';

class DataViewerComponent extends React.Component {
  componentWillUnmount() {
    this.props.action_resetState();
  }

  render() {
    const {
      Translate,
      action_openCloseImageViewer,
      action_saveTasks,
      action_selectBatch,
      action_selectDoc,
      batch_datas = [],
      batch_error,
      document_datas = [],
      document_error,
      fields,
      header,
      is_calling,
      muiTheme,
      show_image,
      step,
      project_name
    } = this.props;
    if (is_calling) {
      return <Loading />;
    }
    return (
      <Paper
        style={{
          position: 'absolute',
          zIndex: 1
        }}
      >
        {step === 0 && (
          <BatchComponent
            action_selectBatch={action_selectBatch}
            datas={batch_datas}
            is_error={batch_error}
            muiTheme={muiTheme}
            project_name={project_name}
          />
        )}
        {step === 1 && (
          <DocumentComponent
            Translate={Translate}
            action_openCloseImageViewer={action_openCloseImageViewer}
            action_saveTasks={action_saveTasks}
            action_selectDoc={action_selectDoc}
            datas={document_datas}
            is_error={document_error}
            header={header}
            muiTheme={muiTheme}
            fields={fields}
            show_image={show_image}
            project_name = {project_name}
          />
        )}
      </Paper>
    );
  }
}

export default DataViewerComponent;
