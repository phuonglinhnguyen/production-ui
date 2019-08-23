import * as React from 'react';
import { connect } from 'react-redux';
import { PageDecorator, userLogout, getDataObject, crudGetOne, crudGetList, crudUpdate } from '@dgtx/coreui';
import { LayoutRoot } from '../../../@components/layout';
import { themes, THEME_BLUE, blueLightTheme, darkTheme } from '../../../@components/themes'
import { changeTheme, closeAnnnouncement } from '../../../actions'
import { getProjectById } from '../../../resources/creators/project_item';
import { getSocketIO } from '../../../App';
import { TASK } from '../../../providers'
import { APP_VERSION } from '../../../constants';
// import { getPaths } from '../../../routes'


export default PageDecorator({
    resources: [
        { name: TASK },
        { name: 'announcement' }
    ],
    mapState: (state) => ({
        theme: state.layout.theme_name === THEME_BLUE ? themes[THEME_BLUE] : themes[state.theme],
        showNotification: state.layout.showNotification,
        notify: state.layout.notify,
        themeName: state.layout.theme_name,
        announcement: getDataObject('core.resources.announcement', state),
        doc_info: getDataObject('layout_header_information.doc_info', state),
        themes: themes,
        paths: [
            { name: "Key-single", type: 'key', path: '/keying/:projectId/:layoutName/:sectionName/:taskKeyDef+' },
            { name: "Key multiple", type: 'key', path: '/keyings/:projectId/:layoutName/:sectionName/:taskKeyDef+' },
            { name: "Key mixed", type: 'key', path: '/mixed-keyings/:projectId/:layoutName/:taskKeyDef+' },
            { name: "Manual Batch Allocation", type: 'batch-allocation', path: '/batch-allocation/:projectId/0/0/:taskKeyDef' },
            { name: "Classify single", type: 'classify', path: '/classifying/:docSize/false/:projectId/:batchId/:docId/:taskKeyDef+' },
            { name: "Classify multiple", type: 'classify', path: '/classifying/:docSize/true/:projectId/:batchId/:docId/:taskKeyDef+' },
            { name: "Re-Classify", type: 'classify', path: '/re-classifying/:docSize/true/:projectId/:batchId/:docId/:taskKeyDef+' },
            { name: "Verifing Classify", type: 'classify', path: '/verifying/classifying/:docSize/true/:projectId/:batchId/:docId/:taskKeyDef+' },
            { name: "OMR", type: 'omr', path: '/omr/:projectId/:layoutName/:sectionName/:taskKeyDef+' },
            { name: "Verifying OMR", type: 'omr', path: '/:verifying/omr/:projectId/:layoutName/:sectionName/:taskKeyDef+' },
            { name: "Verifying Key", type: 'verifying', path: '/verifying/key/:projectId/:layoutName/:sectionName/:taskKeyDef+' },
            { name: "Invoice", type: 'invoice', path: '/invoice/:projectId/:action/:layoutName/:taskKeyDef+' },
            { name: "Verifying Hold", type: 'verifying', path: '/verifying/hold/:docSize/true/:projectId/:taskKeyDef+' },
            { name: "Rework", type: 'rework', path: '/rework/projects/:projectId/:taskKeyDef+' },
            { name: "View Data Keying", type: 'rework-doc', path: '/data/:action/:projectId/:taskKeyDef+' },
            { name: "dashboard", type: 'dashboard', path: '/projects/:projectId' },
        ],
        loading: state.core.loading,
        connect: getDataObject('connect', state),
        project: getDataObject('project.project_item.project', state),
        task: getDataObject('core.resources.task', state),
        socketIO: getSocketIO(),
        APP_VERSION: APP_VERSION
    })
    , actions: {
        crudGetOne,
        crudUpdate,
        changeTheme,
        onLogout: userLogout,
        getProjectById,
        closeAnnnouncement,
        crudGetList,
    }
})(
    LayoutRoot
)

