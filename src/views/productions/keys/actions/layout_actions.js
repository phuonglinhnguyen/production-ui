import { LayoutTypes } from '../types';
import XClient from '../../../../resources/api';

import { NAME_STORE, MAX_TRY_RELOAD, TIME_TRY_RELOAD, TIME_TRY_LOAD } from '../constants';
const shouldFetch = (layoutData, layoutName, sectionName) => {
    return (!layoutData.isFetching
        && (layoutData.didInvalidate < MAX_TRY_RELOAD)
        && (!layoutData.item || layoutName !== layoutData.item.name
            || (layoutData.item.section && layoutData.item.section.name !== sectionName)));
}
const getReferSetting = (data, layout_id, sectionName) => {
    let result = {}
    try {
        if (Array.isArray(data)) {
            let section = data.filter(item => item.name === sectionName&&item.layout_id === layout_id)[0]
            result ={
                section:section,
                refer:section.settings.source_refer
            }  
        } else {
            result ={
                section:data,
                refer:data.settings.source_refer
            }     
        }
    } catch (error) {}

    return result;

}
const fetchLayout = (projectId, layoutName, sectionName, didInvalidate) => async (dispatch) => {
    try {

        let _resRunning = await XClient.field.list_of_section_by_layout(projectId, layoutName, sectionName);
        let _resLayoutRunning = await XClient.layout.list_of_project_by_attr(projectId);
        let _resSectionRunning = await XClient.section.get_section_by_name(projectId, sectionName);
        let _res = await _resRunning;
        let _resLayout = await _resLayoutRunning;
        let _resSection = await _resSectionRunning;
        let layout_id = _resLayout.payload.filter(item=>item.name ===layoutName)[0]
        layout_id =layout_id?layout_id.id :'';
        let {refer, section} = getReferSetting(_resSection.payload,layout_id, sectionName);
        if (_res.error||_resLayout.error || _resSection.error) {
            dispatch({ type: LayoutTypes.DID_INVALIDATION });
        } else {
            let dataRecive = {
                id: layoutName,
                name: layoutName,
                fields: _res.payload,
                section: section,
                refer:refer
            }
            dispatch({ type: LayoutTypes.RECEIVE, payload: dataRecive });
        }
    } catch (error) {
        dispatch({ type: LayoutTypes.DID_INVALIDATION });
    }
}
export const resetlayout = () => ({ type: LayoutTypes.RESET });
export const fetchIfNeeded = (info) => async (dispatch, getState) => {
    const {
        layout
    } = getState()[NAME_STORE];
    const {
        projectId,
        layoutName,
        sectionName } = info;
    try {
        if (shouldFetch(layout, layoutName, sectionName)) {
            dispatch({ type: LayoutTypes.FETCHING });
            let _fetchLayout = fetchLayout(projectId, layoutName, sectionName, layout.didInvalidate);
            if (layout.didInvalidate > 0) {
                setTimeout(() => {
                    dispatch(_fetchLayout)
                }, TIME_TRY_RELOAD[layout.didInvalidate] || TIME_TRY_LOAD);
            } else {
                dispatch(_fetchLayout)
            }
        }
    } catch (error) {
        console.log(error);
        dispatch({ type: LayoutTypes.DID_INVALIDATION });
    }
};
export default {
    resetlayout,
    fetchIfNeeded,
}