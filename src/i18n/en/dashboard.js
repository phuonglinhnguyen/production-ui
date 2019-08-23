export default
    {
        form: {
            input_group_name_title:"GROUP NAME",
            input_group_name_hint:"Ex: DIGI-TEXX",
            input_group_name_new_title:"NEW GROUP NAME",
            input_group_name_new_hint:"NEW GROUP NAME",
            input_project_name_title:"PROJECT NAME",
            input_project_name_hint:"Ex: 133_SAGA_2018",
            input_project_priority_title:"PROJECT PRIORITY",
            input_project_priority_hint:"Ex: 3",
            input_project_path_title:"PROJECT PATH",
            input_project_path_hint:"Ex:/mnt/path_to_project/project_name",
            input_customer_name_title:"CUSTOMER",
            input_customer_name_hint:"Ex: Ancestry",
        },
        project_table:{
            column:{
                project_name:'Project Name',
                customer:'Customer',
                group_name:'Group',
                project_manager:'Project Managers',
                designers:'Designers',
                qc_admins:'QC Admin',
                priority:'Priority',
                remain_document:"Remain document",
                remain_human_task:"Remain Human Task",
                status:'Status',
            }
        },
        dialog:{
            create_project_title:"CREATE NEW PROJECT",
            create_group_title:"CREATE NEW GROUP",
            edit_group_title:"EDIT GROUP",
            confirm:{
                out_editing_project:{
                    title:'EDITING PROJECT',
                    message:'Are you sure you want to naviagte away form this project? <br/> You will lose all changes made since your last save  <br/> Press Ok to continue, or Cancel to stay on the current project',
                    btn_cancel:'Cancel',
                    btn_submit:'OK'
                }
            }
        }
    };