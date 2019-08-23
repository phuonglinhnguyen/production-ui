import * as React from 'react';
import {
    Signin,
    Register,
    Dashboard,
    // Loading,
    Page404,
    // Manager,
    LayoutPrevious,
    ReworkBatch,
    DataViewer,
    KeyingInvoice,
} from '../views'
// import Keying from '../views/productions/key/containers'
// import Keyings from '../views/productions/keys/containers'
import MixedKeyings from '../views/productions/keys_mix/containers'
import GroupImages from '../views/productions/group_images/containers/group_images_container';

import ClassifySingle from '../views/productions/classify/containers/single'
import ClassifyMultiple from '../views/productions/classify/containers/multiple'
import ClassifyVerify from '../views/productions/classify/containers/verify'
import ReClassifyMultiple from '../views/productions/classify/containers/remultiple'
import OMRContainer from '../views/productions/omr/containers/omr_containers'
import VerifyKey from '../views/productions/verify_key/containers/verify_key_container'
import Invoice from '../views/productions/invoice/containers'
import VerifyHold from '../views/productions/verify_hold/containers/verify_hold_container'

const Keyings =(props)=><KeyingInvoice {...props} viewType="keyings"/>; 
const Keying =(props)=><KeyingInvoice {...props} viewType="keying"/>

export const routesPrivate = [
    {
        name: 'keying',
        exact: true,
        path: '/keying/:projectId/:layoutName/:sectionName/:taskKeyDef+',
        component: Keying
    },
    {
        name: 'keyings',
        exact: true,
        path: '/keyings/:projectId/:layoutName/:sectionName/:taskKeyDef+',
        component: Keyings
    },
    {
        name: 'keyings',
        exact: true,
        path: '/keyings/:projectId/:layoutName/:taskKeyDef+',
        component: Keyings
    },
    {
        exact: true,
        path: '/invoice/:projectId/:action/:layoutName/:taskKeyDef+',
        component: KeyingInvoice,
    },
    {
        exact: true,
        path: '/mixed-keyings/:projectId/:layoutName/:taskId+',
        component: LayoutPrevious()(MixedKeyings)
    },
    {
        exact: true,
        path: '/batch-allocation/:projectId/0/0/:taskKeyDef',
        component: LayoutPrevious()(GroupImages)
    },
    {
        exact: true,
        path: '/classifying/:docSize/false/:projectId/:batchId/:docId/:taskKeyDef+',
        component: LayoutPrevious()(ClassifySingle)
    },
    {
        exact: true,
        path:
            '/classifying/:docSize/true/:projectId/:batchId/:docId/:taskKeyDef+',
        component: LayoutPrevious()(ClassifyMultiple)
    },
    {
        exact: true,
        path:
            '/re-classifying/:docSize/true/:projectId/:batchId/:docId/:taskKeyDef+',
        component: LayoutPrevious()(ReClassifyMultiple)
    },
    {
        exact: true,
        path:
            '/verifying/classifying/:docSize/true/:projectId/:batchId/:docId/:taskKeyDef+',
        component: LayoutPrevious()(ClassifyVerify)
    },
    {
        exact: true,
        path: '/omr/:projectId/:layout_name/:section_name/:task_def_key+',
        component: LayoutPrevious()(OMRContainer)
    },
    {
        exact: true,
        path:
            '/:verifying/omr/:projectId/:layout_name/:section_name/:task_def_key+',
        component: LayoutPrevious()(OMRContainer)
    },
    {
        exact: true,
        path: '/verifying/key/:projectId/:layoutName/:sectionName/:taskKeyDef+',
        component: LayoutPrevious()(VerifyKey)
    },
    {
        exact: true,
        path: '/verifying/hold/:docSize/true/:projectId/:taskKeyDef+',
        component: LayoutPrevious()(VerifyHold),
    },
    {
        exact: true,
        path: '/rework/projects/:projectId/:taskKeyDef+',
        component: LayoutPrevious()(ReworkBatch),
    },
    {
        exact: true,
        path: '/data/:action/:projectId/:taskKeyDef+',
        component: LayoutPrevious()(DataViewer),
    },
    {
        name: 'dashboard',
        path: '/projects/:projectId',
        exact: true,
        component: Dashboard
    },
    {
        name: 'dashboard',
        path: '/',
        exact: true,
        component: Dashboard
    },
    {
        name: 'page404',
        component: Page404
    },
]


export default (key) => {
    if (key === 'public') {
        if (process.env['NODE_ENV'] !== 'production') {
            return [
                {
                    name: 'signin',
                    exact: true,
                    path: '/signin',
                    component: Signin
                },
                {
                    name: 'register',
                    exact: true,
                    path: '/register',
                    component: Register
                }
            ]
        } else {
            return [];
        }
    }
    return (apps) => {
        return routesPrivate
    }
};