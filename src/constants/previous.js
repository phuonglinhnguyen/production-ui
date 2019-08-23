import Config from '../config.json';
export const ELROND_ENV = Config.ELROND_ENV;

export const QC_NUMBER_TASK_CLAIM = Config.QC_NUMBER_TASK_CLAIM;

export const ACCESS_TOKEN_KEY = 'access_token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

export const PARAM_NEW = 'new';
export const BPMN_PROCESS_KEY = 'start';

export const PATHNAME_HOME = '/home';
export const PATHNAME_TRAINING = '/training';
export const PATHNAME_AUTHORIZATION = '/authorization';
export const PATHNAME_PROJECTS = '/projects';
export const PATHNAME_GROUPS = '/groups/root';
export const PATHNAME_CONFIGURATION = '/configurations';
export const PATHNAME_PRODUCTION = '/productions/production-start';
export const PATHNAME_OCR_TESTING = '/ocr-testing';
export const PATHNAME_SYSTEM = '/system';
export const PATHNAME_REPORT = '/report';
export const PATHNAME_DIGIPAY = '/digipay';
export const PATHNAME_PRODUCTION_ADMIN = '/production-admin';
export const PATHNAME_GUIDE = '/guide';

export const TIME_OUT_AUTO_SAVE = 3000;
export const TIME_OUT_KEY_SEARCH = 400;
export const TIME_OUT_SHOW_MESSAGE = 1000;

export const COMPONENT_TEXTFIELD = 'TEXTFIELD';
export const COMPONENT_COMBOBOX = 'COMBOBOX';
export const COMPONENT_CHECKBOX = 'CHECKBOX';
export const COMPONENT_RADIO = 'RADIOBUTTON';
export const COMPONENT_TEXTAREA = 'TEXTAREA';

export const HTTP_STATUS_OK = 'commons.http_status.ok';
export const HTTP_STATUS_CREATED = 'commons.http_status.created';
export const HTTP_STATUS_NOT_FOUND = 'commons.http_status.not_found';
export const HTTP_STATUS_BAD_REQUEST = 'commons.http_status.bad_request';
export const HTTP_STATUS_NO_CONTENT = 'commons.http_status.no_content';
export const HTTP_STATUS_CONFLICT = 'commons.http_status.conflict';
export const HTTP_STATUS_METHOD_NOT_ALLOWED =
  'commons.http_status.method_not_allowed';
export const HTTP_STATUS_REASON_ONLY = 'commons.http_status.reason_only';

export const API_LOOKUP_SPECIAL_CHARACTER = `${
  window.location.origin
  }/special_character.json`;
export const ROUTE_PROJECTS = 'projects';
export const ROUTE_CONFIGURATION = 'configurations';
export const ROUTE_GROUPS = 'groups';
export const ROUTE_PRODUCTION = 'productions';
export const ROUTE_PRODUCTION_ADMIN = 'production-admin';
export const ROUTE_OCR_TESTING = 'ocr-testing';
export const ROUTE_SYSTEM = 'system';
export const ROUTE_REPORT = 'report';
export const ROUTE_DIGIPAY = 'digipay';
export const ROUTE_HOME = 'home';
export const ROUTE_TRAINING = 'training';

export const TAB_LEVEL_1 = 1;

export const TAB_KEY = 'tabKey';

export const TAB_LABEL = 'tabLabel';

export const FUNCTION_QC = 'QC';
export const FUNCTION_KEYING_SINGLE = 'KEYING_SINGLE';
export const FUNCTION_QC_SINGLE = 'QC_SINGLE';

export const ROLE_ADMIN = 'Admin';
export const ROLE_PROJECT_MANAGER = 'Project-Manager';
export const ROLE_DPO = 'Dpo';
export const ROLE_DESIGNER = 'Designer';
export const ROLE_TEAM_LEADER = 'Team-Leader';
export const ROLE_QC_LEADER = 'Qc-Leader';
export const ROLE_QC = 'Qc';
export const ROLE_GUEST = 'Guest';
export const ROLE_DIGIPAY_ADMIN = 'DigiPay-Admin';

export const TASK_COMPARISON_OPERATOR_EQ = 'eq';
export const TASK_COMPARISON_OPERATOR_NEQ = 'neq';
export const TASK_COMPARISON_OPERATOR_GT = 'gt';
export const TASK_COMPARISON_OPERATOR_GTEQ = 'gteq';
export const TASK_COMPARISON_OPERATOR_LT = 'lt';
export const TASK_COMPARISON_OPERATOR_LTEQ = 'lteq';
export const TASK_COMPARISON_OPERATOR_LIKE = 'like';

export const TASK_KEY_ID = 'id';
export const TASK_KEY_NAME = 'name';
export const TASK_KEY_ASSIGNEE = 'assignee';
export const TASK_KEY_PROCESS_DEFINITION_ID = 'processDefinitionId';

export const TASK_KEY_PROCESS_INSTANCEID = 'processInstanceId';
export const TASK_KEY_TASK_DEFINITION_KEY = 'taskDefinitionKey';
export const TASK_KEY_VARIABLES = 'variables';
export const TASK_KEY_VARIABLES_TYPE = 'type';
export const TASK_KEY_VARIABLES_VALUE = 'value';
export const TASK_KEY_VARIABLES_INPUT_DATA = 'input_data';
export const TASK_KEY_VARIABLES_VALUE_DOC = 'doc';
export const TASK_KEY_VARIABLES_VALUE_QC_EXECUTION_CONFIG =
  'qc_execution_config';
export const TASK_KEY_VARIABLES_VALUE_QC_EXECUTION_CONFIG_FIELDS = 'fields';

export const menu_roles = {
  design: [ROLE_ADMIN, ROLE_DESIGNER],
  production_admin: [ROLE_ADMIN, ROLE_PROJECT_MANAGER, ROLE_QC_LEADER],
  authorization: [ROLE_ADMIN],
  group_management: [ROLE_ADMIN, ROLE_PROJECT_MANAGER, ROLE_DESIGNER],
  production: [
    ROLE_ADMIN,
    ROLE_DPO,
    ROLE_PROJECT_MANAGER,
    ROLE_QC,
    ROLE_QC_LEADER,
    ROLE_TEAM_LEADER
  ],
  pre_defined: [ROLE_ADMIN, ROLE_DESIGNER],
  training: [ROLE_GUEST],
  guide: [ROLE_GUEST],
  ocr_testing: [
    ROLE_ADMIN,
    ROLE_DPO,
    ROLE_PROJECT_MANAGER,
    ROLE_QC,
    ROLE_QC_LEADER,
    ROLE_TEAM_LEADER]
};
