import {
    ROLE_ADMIN,
    ROLE_PRODUCTION_ADMIN,
    ROLE_TEAM_LEADER,
    ROLE_DESIGNER,
    ROLE_DPO,
    ROLE_DIGIPAY_ADMIN,
    ROLE_GUEST,
    ROLE_QC_LEADER,
    ROLE_QC,
    ROLE_PROJECT_MANAGER
} from './roles'
import {
    PATHNAME_HOME,
    PATHNAME_ADMINISTRATOR,
    PATHNAME_DESIGN,
    PATHNAME_PRODUCTION_ADMIN,
    PATHNAME_PRODUCTION,
    PATHNAME_TRAINING,
    PATHNAME_QC_ADMIN,
    PATHNAME_QC,
    PATHNAME_DIGIPAY,
    PATHNAME_REPORT,
} from './path_app';

const role_app = {
    [ROLE_ADMIN]:[
        PATHNAME_HOME,
        PATHNAME_QC,
        PATHNAME_DIGIPAY,
        PATHNAME_TRAINING,
        PATHNAME_PRODUCTION,
        PATHNAME_ADMINISTRATOR,
        PATHNAME_REPORT,
    ],
    [ROLE_PRODUCTION_ADMIN]:[
        PATHNAME_HOME,
        PATHNAME_QC,
        PATHNAME_DIGIPAY,
        PATHNAME_TRAINING,
        PATHNAME_PRODUCTION,
        PATHNAME_ADMINISTRATOR,
        PATHNAME_REPORT,
    ],
    [ROLE_DESIGNER]:[
        PATHNAME_HOME,
        PATHNAME_DESIGN,
        PATHNAME_QC,
        PATHNAME_DIGIPAY,
        PATHNAME_TRAINING,
        PATHNAME_PRODUCTION,
    ],
    [ROLE_DPO]:[ // 
        PATHNAME_HOME,
        PATHNAME_DESIGN,
        PATHNAME_ADMINISTRATOR,
        PATHNAME_QC_ADMIN,
        PATHNAME_QC,
        PATHNAME_DIGIPAY,
        PATHNAME_TRAINING,
        PATHNAME_PRODUCTION,
        PATHNAME_PRODUCTION_ADMIN,
        PATHNAME_REPORT,
    ]
    ,
    [ROLE_GUEST]:[ // 
        PATHNAME_HOME,
        PATHNAME_TRAINING,
    ]
    ,
    [ROLE_QC_LEADER]:[ // 
        PATHNAME_HOME,
        PATHNAME_QC_ADMIN,
        PATHNAME_QC,
        PATHNAME_DIGIPAY,
        PATHNAME_TRAINING,
        PATHNAME_PRODUCTION,
        PATHNAME_REPORT,
    ]
    ,
    [ROLE_QC]:[ // 
        PATHNAME_HOME,
        PATHNAME_QC,
        PATHNAME_DIGIPAY,
        PATHNAME_TRAINING,
        PATHNAME_PRODUCTION,
        PATHNAME_REPORT,
    ]
    ,
    [ROLE_PROJECT_MANAGER]:[ // 
        PATHNAME_HOME,
        PATHNAME_DIGIPAY,
        PATHNAME_TRAINING,
        PATHNAME_PRODUCTION_ADMIN,
        PATHNAME_REPORT,
    ]
    ,
    [ROLE_TEAM_LEADER]:[ // 
        PATHNAME_HOME,
        PATHNAME_DIGIPAY,
        PATHNAME_TRAINING,
        PATHNAME_PRODUCTION,
        PATHNAME_PRODUCTION_ADMIN,
        PATHNAME_REPORT,
    ]
    ,
    [ROLE_DIGIPAY_ADMIN]:[ // 
        PATHNAME_HOME,
        PATHNAME_DIGIPAY,
        PATHNAME_TRAINING,
        PATHNAME_PRODUCTION,
        PATHNAME_REPORT,
    ]
}

const getPagesFormRoles=(roles:String[])=>{
    let result =[];
    roles.forEach(role=>{
        if(Array.isArray(role_app[role])){
            result=[...result,...role_app[role]]
        }
        
    })
    return result;
}
export {
    role_app,
    getPagesFormRoles
}