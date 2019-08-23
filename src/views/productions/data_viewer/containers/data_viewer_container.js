import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Loading from '../../../../components/Loading/Loading';
import DataViewerComponent from '../components/data_viewer_component';

import * as data_viewer_action from '../actions/index';

import { Translate } from 'react-redux-i18n';

const DataViewerContainer = props => {
  const {
    actions,
    batches,
    documents,
    layouts,
    match,
    muiTheme,
    username,
    project_name

  } = props;
  const params = match.params;
  if (batches.first_call) {
    return (
      <Loading beforeMount={() => actions.getGenericParams(params, username)} />
    );
  }

  return (
    <DataViewerComponent
      Translate={Translate}
      project_name= {project_name}
      action_selectBatch={b => actions.selectBatch(b, params, username)}
      action_openCloseImageViewer={actions.openCloseImageViewer}
      action_resetState={actions.resetState}
      action_saveTasks={(tasks, approve, fields, comment, owner) =>
        actions.saveTasks(tasks, params, username, {
          approve,
          fields,
          comment,
          owner
        })
      }
      is_calling={batches.is_calling || documents.is_calling}
      batch_datas={batches.datas}
      batch_error={batches.is_error}
      document_datas={documents.datas}
      document_error={documents.is_error}
      header={layouts.header}
      fields={layouts.fields}
      step={batches.step}
      show_image={documents.show_image}
      muiTheme={muiTheme}
    />
  );
};

const mapStateToProps = state => {
  const batches = state.production.data_viewer.batches;
  const documents = state.production.data_viewer.documents;
  const layouts = state.production.data_viewer.layouts;
  const username = state.user.user.username;
  const project_name = state.project.project_item.project.name;

  return {
    batches,
    documents,
    layouts,
    username,
    project_name
  };
};

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators(
    {
      ...data_viewer_action
    },
    dispatch
  )
});

export default connect(mapStateToProps, mapDispatchToProps)(
  DataViewerContainer
);
