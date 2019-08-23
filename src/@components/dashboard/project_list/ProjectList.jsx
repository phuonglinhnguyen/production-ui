import React from 'react';
import { isEqual } from 'lodash'
import PropTypes from 'prop-types';
import { Translate, I18n } from 'react-redux-i18n';
import { orange, red, teal } from '@material-ui/core/colors'
import { getDataObject } from '@dgtx/coreui'
import { Table } from '../../@Table'
import {
  Card,
  Chip,
  Subheader,
  TextField,
  Button,
} from '@material-ui/core'

import ProjectListTable from './project_list_table';

class ProjectList extends React.Component {
  getColor = (priority) => {
    if (priority < 2) {
      return { color: red[500] };
    } else if (priority < 5) {

      return { color: orange[500] }
    }
    return { color: teal[500] };
  }

  render() {
    const {
      project_id,
      projects = [],
      group_id,
      muiTheme,
      resources,
      groupName = '',
      projectName = '',
      showGroup,
      dashboard,
      changeProjectName,
      changeProject,
      showCreateProject,
    } = this.props;
    const {
      remain_document
      , remain_human_task } = resources;
    let datas = projectName ? projects.filter(item => !!item.name.toLowerCase().includes(projectName.toLowerCase())) : projects
    return (
      <React.Fragment>
        {/* <Table
          datas={datas}
          createData={data => ({
            id: data.id,
            name: data.name,
            customer: data.customer,
            remain_document: data.remain_document,
            remain_human_task: data.remain_human_task,
            priority: data.priority,
            active: data.active ? <p style={{ color: 'green' }}>Active</p> : <p style={{ color: 'red' }}>Inactive</p>,
          })}
          columns={[
            { id: 'name', numeric: false, disablePadding: true, label: I18n.t("dashboard.project_table.column.project_name"), visible: true },
            { id: 'priority', numeric: false, disablePadding: true, label: I18n.t("dashboard.project_table.column.priority"), visible: true },
            // { id: 'active', numeric: false, disablePadding: true, label: I18n.t("dashboard.project_table.column.status"), visible: !project_id },
          ]}
          item_id={project_id}
          group_id={group_id}
          group_id={group_id}
          muiTheme={muiTheme}
          groupName={getDataObject('data.groupName', dashboard)}
          resources={resources}
          project={projects.filter(item => project_id === item.id)[0] || {}}
          onChange={changeProject}
          dashboard={dashboard}
          changeProjectName={changeProjectName}
          onCreate={showCreateProject}
        /> */}
        
        <ProjectListTable 
          onChange={changeProject}
          data={datas}
        />

      </React.Fragment>
    );
  }
}


export default ProjectList;
