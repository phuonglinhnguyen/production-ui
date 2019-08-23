const KEY_STORAGE_VIEW = "__data_state_image_user__";

export const getStateInStorage = (username, key) => {
   let data = localStorage.getItem(KEY_STORAGE_VIEW);
   if (typeof data === 'string') {
      try {
         data = JSON.parse(data);
      } catch (error) {
         return {};
      }
      if (data[username]) {
         return data[username][key] || {}
      } else {
         data = {
            [username]: {}
         }
         localStorage.setItem(KEY_STORAGE_VIEW, JSON.stringify(data))
      }
   } else {
      data = {
         [username]: {}
      }
      localStorage.setItem(KEY_STORAGE_VIEW, JSON.stringify(data))
   }
   return {}
}

export const setStateInStorage = (username, key, data) => {
   let dataStorage = localStorage.getItem(KEY_STORAGE_VIEW);
   try {
      dataStorage = JSON.parse(dataStorage) || {};
   } catch (error) {
      dataStorage = {}
   }
   dataStorage[username][key] = data
   localStorage.setItem(KEY_STORAGE_VIEW, JSON.stringify(dataStorage))
}


export const setRatioInStorage = (username, key, data) => {
   new Promise((resolve) => {
      let dataStorage = localStorage.getItem(KEY_STORAGE_VIEW);
      try {
         dataStorage = JSON.parse(dataStorage) || {};
         dataStorage[username][key] = { ...dataStorage[username][key], ratio: data }
         localStorage.setItem(KEY_STORAGE_VIEW, JSON.stringify(dataStorage))
      } catch (error) {
      }
   })
}