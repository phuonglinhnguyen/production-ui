const KEY_RECENT_DATA_STORAGE ='recent_data_storage';
export default class RecentDataLocalStorage {
    constructor() {
        this._conn = {
            post:async(data)=>{
                localStorage.setItem(KEY_RECENT_DATA_STORAGE,data)
            },
            get:async(username)=>{
               let  data = localStorage.getItem(KEY_RECENT_DATA_STORAGE);
               if(data&&data.username === username){
                   return {payload: data}
               }else{
                localStorage.setItem(KEY_RECENT_DATA_STORAGE,{})
               }
               return {payload: [],error:true,status:404};
            }
        }
    }
    set_resent_data = (username,task_id, data) => {
        return this._conn.post({username,task_id, data})
    }
    get_resent_data = (username) => {
        return this._conn.get(username)
    }
}