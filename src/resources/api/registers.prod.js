import src from './resources';
import ref from './reference';
import {ocr} from './test'

export default {
    user_and_projects:src.UserAndProjects,
    recent_data:ref.recent_data_local_storage,
    training_config:src.TrainingConfig,
    omr : ref.Omr,
    ocr : ocr,
    upload_connections : ref.upload_connections,
    layout : src.Layout,
    field : src.Field,
    section : src.Section,
    document : src.Document,
    document_training : src.Document_training,
    task : src.Task,
    task_training: src.Task_training,
    upload_configuration : src.Upload_configuration,
    io_configurations : src.io_configurations,
    projects : src.projects,
    report:src.report,
}