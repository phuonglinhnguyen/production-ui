const StorageFieldCapture = () => {
    if (StorageFieldCapture.instance !== undefined)
        return StorageFieldCapture.instance;
    var storage_field = {};
    StorageFieldCapture.instance = {
            get_data:(field_name,callback) => {
                callback(storage_field[field_name]||'')
            },
            add_data:(info) => {
                let {field_name, value} = info;
                if(value&&value.trim().length){
                    storage_field[field_name]=value;
                } 
            }

    };
    return StorageFieldCapture.instance;
}
export const getStorageFieldCapture = () => {
    return  StorageFieldCapture();
}