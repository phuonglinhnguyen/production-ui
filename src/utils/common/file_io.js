const saveFileBold = (blob, name) => {
    var downloadLink = document.createElement("a");
    downloadLink.download = name;
    var url = URL.createObjectURL(blob);
    downloadLink.href = url;
    downloadLink.dispatchEvent(new MouseEvent("click"));
    URL.revokeObjectURL(url);
}


export const formatFile = (file, data) => {
    switch (file.type) {
        case 'application/json':
            return {
                file: file,
                data: JSON.parse(data)
            }
        default:
            return {
                file,
                data: JSON.parse(data)
            }
    }

}
export const uploadFile = (accept, callback) => {
    var input = document.createElement('input');
    input.type = "file";
    input.accept = accept;
    input.addEventListener('change', (event) => {
        let file = event.target.files[0]
        let reader = new FileReader();
        reader.onload = eventReder => {
            let data = { file, data: eventReder.target.result}
            callback(data);
        }
        reader.readAsText(file, "UTF-8");
    }, false);

    input.dispatchEvent(new MouseEvent("click"));
}
export const saveFileJSON = (fileName, dataJson, options = { replacer: null, space: 4 }) => {
    const { space, replacer } = options;
    var blob = new Blob([JSON.stringify(dataJson, replacer, space)], { type: 'application/json;charset=utf-8;' });
    saveFileBold(blob, fileName);
}
export const saveFileCSV = (fileName, csvFile, options = { replacer: null, space: 4 }) => {
    // const { space, replacer } = options;
    var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
    saveFileBold(blob, fileName);
}
export default {
    saveFileJSON,
    uploadFile,
}
