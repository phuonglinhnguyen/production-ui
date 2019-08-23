import * as constants from '../../constants'

export const getTaskInputData = (task) => {
    return task[constants.TASK_KEY_VARIABLES].find(item => item.name === constants.TASK_KEY_VARIABLES_INPUT_DATA);
}
export const getTaskInputDataAtrribute = (task, inputDataAttribute) => {
    const input_data = task[constants.TASK_KEY_VARIABLES].find(item => item.name === constants.TASK_KEY_VARIABLES_INPUT_DATA);

    if (input_data) {
        return input_data[constants.TASK_KEY_VARIABLES_VALUE][inputDataAttribute]
    }
}
export const getTaskAttribute = (task, attributeName) => {
    if (task) {
        return task[attributeName];
    }
}

export function getDocNameFromDocURI(docUri) {
    if (docUri) {
        let docUriArr = docUri.split("/");
        let docName = (docUriArr[docUriArr.length - 1].split("."))[0];
        return docName;
    }
}


