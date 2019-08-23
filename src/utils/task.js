
import { fetchJson } from '@dgtx/coreui'
import { pages } from './data_ocr'
const INPUT_DATA = 'input_data';
const FORM_URI = 'form_uri';
const COMPLETE_OPTION = 'complete_option';
const KEY_DATA = 'key_data';
const COMMENT = 'comment';
const HOLD_COUNT = 'hold_count';
const REWORK = 'rework';
const REWORK_COMMENT = 'rework_comment';
const REWORK_FIELDS = 'rework_fields';
export type TaskVariable = {
    name: 'input_data' | 'key_data' | 'form_uri' | string,
    type: 'Object' | 'String' | 'Null',
    value: any
}

export type Task = {
    assignee: string,
    tenantId: string,
    id: string,
    name: string,
    variables: TaskVariable[]
}

export  const getVertices = (position) => {
    let [x1, y1, x2, y2] = position.split(';').map(item=>Number(item));
    if (x1 > x2) {
        let tx = x1;
        x1 = x2;
        x2 = tx;
    }
    if (y1 > y2) {
        let ty = y1;
        y1 = y2;
        y2 = ty;
    }
    return [
        { x: x1, y: y1 },
        { x: x2, y: y1 },
        { x: x2, y: y2 },
        { x: x1, y: y2 }
    ]
}

export const transFormData = (pages) => {
    return pages.map(page => {
        return {
            id: page.page_index,
            lines: page.lines.map((item, lineId) => {
                return {
                    id: lineId,
                    line_index: item.line_index,
                    position: item.position,
                    boundingBox: {
                        vertices:getVertices(item.position||'0;0;0;0')
                    },
                    words: item.words.map((word, wordId) => {
                        return {
                            text: word.text,
                            position: word.position,
                            boundingBox: {
                                vertices: getVertices(word.position)
                            }
                        }
                    })
                }
            })
        }
    })
}


const getInputData = (value) => {
    const {
        id,
        batch_id,
        batch_name,
        doc_set_id,
        layout_name,
        ocr_url: {
            s3_docs_extract_uri = [],
            s3_docs_ocr_uri = []
        },
        s2_url = [],
        records } = value;
    let images = s2_url.map((item, index) => {
        return {
            image_uri: item, data_ocr: s3_docs_ocr_uri[index]
        }
    })

    return {
        docId: id,
        batch_id,
        batch_name,
        doc_set_id,
        layout_name,
        records,
        s3_docs_extract_uri,
        images
    }
}
export const getCompleteReason = (reason) => {
    try {
        return Object.keys(reason).map(key => {
            let result = {}
            reason[key].split(',').forEach(data => {
                let datas = data.split(':');
                result[datas[0].trim()] = datas[1].trim()
            })
            return {
                value: key,
                label: result.title,
                comment: result.comment === "true"
            }
        })
    } catch (e) {
        return [];
    }
}
const behavior = {
    [INPUT_DATA]: getInputData,
    [HOLD_COUNT]: value => Number(1),
    [COMPLETE_OPTION]: getCompleteReason,
    // [FORM_URI]: (value) = {},
    // [KEY_DATA]: (value) = {},
    // [COMMENT]: (value) => {return'' ;`nhhien:Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac
    // facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum
    // at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus
    // sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia bibendum
    // nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur
    // et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla. Cras
    // mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
    // egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
    // Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
    // lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia bibendum nulla
    // sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
    // Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla. Cras mattis
    // consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,#EOL#nhhien :Cras mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac
    // facilisis in, egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum
    // at eros. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus
    // sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia bibendum
    // nulla sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur
    // et. Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla. Cras
    // mattis consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,
    // egestas eget quam. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
    // Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
    // lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia bibendum nulla
    // sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
    // Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla. Cras mattis
    // consectetur purus sit amet fermentum. Cras justo odio, dapibus ac facilisis in,`},
    // [REWORK]: (value) => {return false},
    // [REWORK_COMMENT]: (value) => {return `system:Morbi leo risus, porta ac consectetur ac, vestibulum at eros.
    // Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vivamus sagittis
    // lacus vel augue laoreet rutrum faucibus dolor auctor. Aenean lacinia bibendum nulla
    // sed consectetur. Praesent commodo cursus magna, vel scelerisque nisl consectetur et.
    // Donec sed odio dui. Donec ullamcorper nulla non metus auctor fringilla. Cras mattis
    // consectetur purus sit amet fermentum`},
    // [REWORK_FIELDS]: (value) => {},
}

const getDataJson = async (uri) => {
    try {
        let response = await fetch(uri)
         return  await response.json()
    } catch (error) {
        return null;
    }
}
const getDataOcr = async ({ s3_docs_extract_uri, images }) => {
    let data = images.map(({ data_ocr }) => {
        if (data_ocr) {
            return getDataJson(data_ocr)
        } else {
            return Promise.resolve(null)
        }
    })
    let dataExtract = await Promise.all(s3_docs_extract_uri.map(item => getDataJson(item)));
    let dataOcrs = await Promise.all(data)
    let _images = images.map((item, index) => {
        return {
            ...item,
            data_ocr: Boolean(dataOcrs[index])?{pages:transFormData(dataOcrs[index].ocr_results)}:null//
        }
    })
    return {
        images: _images,
        dataExtract,
    }
}
export const getInfoTask = async (task: Task) => {
    let data = {}
    task.variables.forEach((item: TaskVariable) => {
        if (behavior[item.name]) {
            data[item.name] = behavior[item.name](item.value)
        } else {
            data[item.name] = item.value;
        }
    })
    let { images, dataExtract } = await getDataOcr(data[INPUT_DATA])
    return {
        taskId: task.id,
        assignee:task.assignee,
        images,
        dataExtract,
        ...data
    }
}


