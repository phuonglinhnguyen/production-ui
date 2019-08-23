import src from './resources';
import ref from './reference';
import {ocr} from './test'
export default {
    ocr,
    user_and_projects:src.UserAndProjects,
    training_config:src.TrainingConfig,
    recent_data:ref.recent_data_local_storage,
    layout : src.Layout,
    field : src.Field,
    section : src.Section,
    document : src.Document,
    document_training : src.Document_training,
    task : src.Task,
    task_training: src.Task_training,
    upload_configuration : src.Upload_configuration,
    omr : ref.Omr,
    upload_connections : ref.upload_connections,
    io_configurations : src.io_configurations,
    projects : src.projects,
    report:src.report,

}