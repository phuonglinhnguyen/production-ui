import React from 'react';
import PropTypes from 'prop-types';
import { Translate, I18n } from 'react-redux-i18n';
import { isEqual } from 'lodash'
import { getDataObject } from '@dgtx/coreui'
import { Close as CloseIcon } from '@material-ui/icons'
import {
  IconButton,
  Button,
  Switch,
  TextField,
  SelectField,
  MenuItem,
  AutoComplete,
  Card,
  CardContent,
  Typography,
  CardActions,
  FormControlLabel,
} from '@material-ui/core'

import TextUser from './TextUser'

// import GroupSelect from './GroupSelect'

const DASHBROAD_DIALOG_TYPE_EDIT_PROJECT = 'DASHBROAD_DIALOG_TYPE_EDIT_PROJECT'


class ProjectEditer extends React.Component {
  state = {
    dataSourceUserName: [],
    role: '',
  };
  handleUpdateInputUserName = (value) => {
    const { users } = this.props;
    this.setState({
      dataSourceUserName: []
    })
    let dataSourceUserName = [];
    if (users.data && users.data.OtherMember) {
      dataSourceUserName = users.data.OtherMember.filter(item =>
        (Object.values(item).join(' ').indexOf(value) > -1))
        .map(item => ({
          text: item.UserName,
          value: (
            <MenuItem
              primaryText={<p
                style={{ display: 'inline', height: '12', whiteSpace: 'nowrap' }}
              >
                <span style={{ margin: '0x 5px', color: 'green' }}>
                  {item.UserName}
                </span>
                <span>
                  {item.FullName}
                </span>
                <span>
                  {item.Department}
                </span>
              </p>}
              secondaryText={item.WorkLocation}
            />
          )
        }))
    }
    if (dataSourceUserName.length > 10) {
      this.setState({
        dataSourceUserName: dataSourceUserName.slice(0, 10)
      });
    }
  };
  handleSearch = (searchText: string, key: string) => {
    return true
  }
  handleChangeRole = (event, index, value) => this.setState({ role: value });
  render() {
    const {
      muiTheme,
      project,
      changeData,
      changeProject,
      dashboard,
      getData,
      users,
      groups,
      onSubmit,
    } = this.props;
    let active = getDataObject('data.edit.active', dashboard);
    return (
      <React.Fragment>
        <CardContent>
          <Typography gutterBottom variant="headline" component="h2">
            PROJECT DETAIL
        </Typography>
          <Typography style={{ marginBottom: 12 }} color="textSecondary">
            {`Project:${project.name}`}
          </Typography>
          {!isEqual(getDataObject('data.edit.name,customer,group_id,group_name,priority,folder,active,project_managers,designers,qc_admins',
            dashboard), getDataObject('name,customer,group_id,group_name,priority,folder,active,project_managers,designers,qc_admins', project)) ? (
              <div style={{ position: 'absolute', top: 8, right: 16, zIndex: 1000 }}>
                <Button label="CANCEL" style={{ margin: 12 }}
                  onClick={event => { event.preventDefault(); changeProject(project.id) }}
                />
                <Button label="UPDATE" primary={true}
                  onClick={event => {
                    event.preventDefault();
                    onSubmit(DASHBROAD_DIALOG_TYPE_EDIT_PROJECT)
                  }}
                />
              </div>
            ) : (<div style={{ position: 'absolute', top: 0, right: 0, zIndex: 1000 }}>
              <IconButton
                style={{ margin: 8 }}
                tooltip='Close'
                onClick={event => { event.preventDefault(); changeProject() }}
              >
                <CloseIcon />
              </IconButton>
            </div>)}
          <div style={{ display: "flex", flexWrap: "nowrap", flexDirection: 'row', width: 'calc(100%)' }}>
            <div style={{ width: 'calc(50% - 16px)', marginRight: 16 }}>
              <TextField
                fullWidth={true}
                autoFocus={true}
                value={getDataObject('data.edit.name', dashboard)}
                onChange={(event) => { changeData('data.edit.name', event.target.value) }}
                floatingLabelText={<Translate value='dashboard.form.input_project_name_title' />}
                hintText={<Translate value='dashboard.form.input_project_name_hint' />}
                floatingLabelFixed={true}
              /><br />
              <TextField
                fullWidth={true}
                value={getDataObject('data.edit.customer', dashboard)}
                onChange={(event) => { changeData('data.edit.customer', event.target.value) }}
                floatingLabelText={<Translate value='dashboard.form.input_customer_name_title' />}
                hintText={<Translate value='dashboard.form.input_group_name_hint' />}
                floatingLabelFixed={true}
              /><br />
              <FormControlLabel
                control={
                  <Switch
                    checked={getDataObject('data.edit.active', dashboard)}
                    onChange={(event, isInputChecked) => {
                      changeData('data.edit.active', isInputChecked)
                    }}
                    value="checkedA"
                    color="default"
                  />
                }
                label={active ? <p style={{ display: 'inline' }}>Status: <span style={{ color: 'green' }}>Active</span></p> : <p style={{ display: 'inline' }}>Status: <span style={{ color: 'red' }}>Inactive</span></p>}
              />
            </div>
            <div style={{ width: 'calc(50% - 16px)' }}>
              <TextField
                fullWidth={true}
                value={getDataObject('data.edit.priority', dashboard)}
                onChange={(event) => { changeData('data.edit.priority', event.target.value) }}
                floatingLabelText={<Translate value='dashboard.form.input_project_priority_title' />}
                hintText={<Translate value='dashboard.form.input_project_priority_hint' />}
                floatingLabelFixed={true}
              /><br />
              <TextField
                fullWidth={true}
                value={getDataObject('data.edit.folder', dashboard)}
                onChange={(event) => { changeData('data.edit.folder', event.target.value) }}
                floatingLabelText={<Translate value='dashboard.form.input_project_path_title' />}
                hintText={<Translate value='dashboard.form.input_project_path_hint' />}
                floatingLabelFixed={true}
              /><br />

            </div>
          </div>
          <TextUser
            floatingLabelText='PROJECT MANAGER'
            value={getDataObject('data.edit.project_managers', dashboard)}
            onUpdateInput={name => {
              let value = getDataObject('data.edit.project_managers', dashboard);
              value = Array.isArray(value) ? [...value, name] : [name];
              changeData('data.edit.project_managers', value);
            }}
            onDeleteItem={name => {
              let value = getDataObject('data.edit.project_managers', dashboard);
              value = value.filter(item => item !== name);
              changeData('data.edit.project_managers', value);
            }}
            users={users}
          />
          <br />
          <TextUser
            floatingLabelText='PROJECT DESIGNER'
            value={getDataObject('data.edit.designers', dashboard)}
            onUpdateInput={name => {
              let value = getDataObject('data.edit.designers', dashboard);
              value = Array.isArray(value) ? [...value, name] : [name];
              changeData('data.edit.designers', value);
            }}
            onDeleteItem={name => {
              let value = getDataObject('data.edit.designers', dashboard);
              value = value.filter(item => item !== name);
              changeData('data.edit.designers', value);
            }}
            users={users}
          />
          <br />
          <TextUser
            floatingLabelText='QC ADMIN'
            value={getDataObject('data.edit.qc_admins', dashboard)}
            onUpdateInput={name => {
              let value = getDataObject('data.edit.qc_admins', dashboard);
              value = Array.isArray(value) ? [...value, name] : [name];
              changeData('data.edit.qc_admins', value);
            }}
            onDeleteItem={name => {
              let value = getDataObject('data.edit.qc_admins', dashboard);
              value = value.filter(item => item !== name);
              changeData('data.edit.qc_admins', value);
            }}
            users={users}
          />
          <br />
        </CardContent>

      </React.Fragment>
    );
  }
}


export default ProjectEditer;
