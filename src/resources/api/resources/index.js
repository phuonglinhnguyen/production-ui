import _layout from './layout';
import _field from './field';
import _section from './section';
import _document from './document';
import _document_training from './document_training';
import _task from './task';
import _task_training from './task_training';
import _upload_configuration from './upload_configuration';
import _io_configurations from './io_configuration';
import _projects from './projects';
import _report from './report'
import _training_config from './training_configs'
import _user_and_projects from './user_and_projects'
export const Layout = _layout;
export const Field = _field;
export const Section = _section;
export const Document = _document;
export const Document_training = _document_training;
export const Task = _task;
export const Task_training = _task_training;
export const Upload_configuration = _upload_configuration;
export const io_configurations = _io_configurations;
export const projects = _projects;
export const report = _report;
export const TrainingConfig = _training_config;
export const UserAndProjects = _user_and_projects;
export default {
    TrainingConfig,
    report,
    Layout,
    Field,
    Section,
    Document,
    Document_training,
    Task,
    Task_training,
    Upload_configuration,
    io_configurations,
    projects,
    UserAndProjects
}