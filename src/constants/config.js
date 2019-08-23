import Config from '../config.json';
import {version} from '../../package.json';

export const APP_NAME = 'production';
export const TIME_OUT_KEY_SEARCH = 400;
export const TIME_OUT_SHOW_MESSAGE = 1000;

export const PARAM_NEW = 'new';
export const BPMN_PROCESS_KEY = 'start';

export const PATHNAME_HOME = '/home';
export const API_LOOKUP_SPECIAL_CHARACTER = `${
    window.location.origin
    }/special_character.json`;
export const FUNCTION_QC = 'QC';
export const FUNCTION_KEYING_SINGLE = 'KEYING_SINGLE';
export const FUNCTION_QC_SINGLE = 'QC_SINGLE';

export const ELROND_ENV = Config.ELROND_ENV;
export const JIVO_ID = Config.JIVO_ID;
export const API_ENDPOINT = Config.API_ENDPOINT;
export const UAC_ENDPOINT = Config.UAC_ENDPOINT;
export const REPORT_ENDPOINT = Config.REPORT_ENDPOINT;
export const API_SOCKET = Config.API_SOCKET;
export const OAUTH_ENDPOINT = Config.OAUTH_ENDPOINT;
export const BPMN_ENDPOINT = Config.BPMN_ENDPOINT;
export const API_LOOKUP = Config.API_LOOKUP;
export const API_OMR = Config.API_OMR;
export const API_OCR = Config.API_OCR;
export const SOCKET = Config.SOCKET;
export const QC_NUMBER_TASK_CLAIM = Config.QC_NUMBER_TASK_CLAIM;
export const REGISTER_PAGE = Config.REGISTER_PAGE;
export const APP_VERSION = version;