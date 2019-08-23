/**
 * @description Routes Root
 * @author nhhien
 */
//  import * as React from 'react';
//material-ui libraries
import ContentInbox from "material-ui/svg-icons/content/inbox";
import ActionDashboard from "material-ui/svg-icons/action/dashboard";
// import ActionHelp from "material-ui/svg-icons/action/help";
import ActionBuild from "material-ui/svg-icons/action/build";
import ActionPermIdentity from "material-ui/svg-icons/action/perm-identity";
import InsertChartIcon from "material-ui/svg-icons/editor/insert-chart";
// import NavigationMenu from "material-ui/svg-icons/navigation/menu";
import Panorama from "material-ui/svg-icons/image/panorama";
import FolderIcon from "material-ui/svg-icons/file/folder";
// import Subheader from "material-ui/Subheader";
// import FlatButton from "material-ui/FlatButton";
// import Paper from "material-ui/Paper";
// import CircularProgress from "material-ui/CircularProgress";
// import AccountIcon from "material-ui/svg-icons/action/account-circle";

import { 
    PATHNAME_HOME,
    PATHNAME_ADMINISTRATOR,
    PATHNAME_DESIGN,
    PATHNAME_PRODUCTION_ADMIN,
    PATHNAME_PRODUCTION,
    PATHNAME_TRAINING,
    PATHNAME_DIGIPAY,
    PATHNAME_QC_ADMIN,
    PATHNAME_QC,
    PATHNAME_REPORT,
 } from './path_app'

 
const AppRoutes = [
    {
        path: PATHNAME_HOME,
        sidebarName: "sidebar.home",
        navbarName: "navbar.home",
        navbarIcon:ActionDashboard,
        icon: ActionDashboard
    },  {
        path: PATHNAME_ADMINISTRATOR,
        sidebarName: "sidebar.administrator",
        navbarName: "navbar.administrator",
        icon: ContentInbox,
    },  {
        path: PATHNAME_DESIGN,
        sidebarName: "sidebar.design",
        navbarName: "navbar.design",
        icon: ActionPermIdentity,
    },  {
        path: PATHNAME_PRODUCTION_ADMIN,
        sidebarName: "sidebar.production_admin",
        navbarName: "navbar.production_admin",
        icon: ActionBuild,
    },  {
        path: PATHNAME_QC_ADMIN,
        sidebarName: "sidebar.qc_admin",
        navbarName: "navbar.qc_admin",
        icon: FolderIcon,
    },  {
        path: PATHNAME_QC,
        sidebarName: "sidebar.qc",
        navbarName: "navbar.qc",
        icon: ContentInbox,
    },  {
        path: PATHNAME_TRAINING,
        sidebarName: "sidebar.training",
        navbarName: "navbar.training",
        icon: Panorama,
    },  {
        path: PATHNAME_PRODUCTION,
        sidebarName: "sidebar.production",
        navbarName: "navbar.production",
        icon: Panorama,
    },  {
        path:PATHNAME_DIGIPAY,
        sidebarName: "sidebar.digi_pay",
        navbarName: "navbar.digi_pay",
        icon: ActionDashboard,
    },  {
        path: PATHNAME_REPORT,
        sidebarName: "sidebar.report",
        navbarName: "navbar.report",
        icon: InsertChartIcon,
    }
]

export const getRouter = (paths:String[])=>{
    return  AppRoutes.filter(item=>{
        if(item.path===PATHNAME_HOME){
            return false
        }
        return paths.includes(item.path)
    })
}

export default AppRoutes;