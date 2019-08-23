import { showNotification, fetchJson } from '@dgtx/coreui';
import { API_ENDPOINT, APP_NAME } from '../../../../constants';
//     dispatch(showNotification('production.keying.message.success.save_success', 'success', { i18n: true }));
export const SectionsTypes = {
   RECEIVE: '@DGS/SECTION/WORKBATCH/RECEIVE',
   RESET: '@DGS/SECTION/WORKBATCH/RESET',
}

export const receiveSections = (projectId, items) => ({ type: SectionsTypes.RECEIVE, items, projectId });

export const fetchSections = (projectId, didInvalidate, time = 0) => async (dispatch) => {
   try {
      let _res = await fetchJson(`${API_ENDPOINT}/apps/${APP_NAME}/projects/${projectId}/section-definitions`);
      if (_res.status !== 200 && _res.status !== 404) {
         if (time < 3) {
            dispatch(fetchSections(projectId, didInvalidate, time + 1));
         } else {
            dispatch(showNotification('projects.layout_definitions.message.error.cant_get_list_section', 'error', { i18: !0 }));
         }
      } else {
         let sections = []
         if (Array.isArray(_res.json)) {
            _res.json.forEach(item => {
               if (!sections.includes(item.name)) {
                  sections.push(item.name)
               }
            })
         }
         dispatch(receiveSections(projectId, sections.sort()));
      }
   } catch (error) {
      dispatch(showNotification(JSON.stringify(error), { i18: !0 }));
   }
};
export const resetSections = () => ({ type: SectionsTypes.RESET });
