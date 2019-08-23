/** eslint-disable-next-line no-template-curly-in-string */
export const fetchJson = async (url: string, options = { method: 'GET' }) => {
    let json = [];
    if (url.includes('tasks')) {
        json = [
            {
                "project_id": "5a60aae821cc010025ee2d81",
                "process_key": "start_5a60aae821cc010025ee2d81",
                "id": "Task_07so9uw",
                "name": "Classify",
                // eslint-disable-next-line
                "input_data": "${doc}",
                "form_uri": "classifying/12/true/5a60aae821cc010025ee2d81/0/0/Task_07so9uw"
            },
            {
                "project_id": "5a60aae821cc010025ee2d81",
                "process_key": "start_5a60aae821cc010025ee2d81",
                "id": "Task_0thdqri",
                "name": "Key Form_11 Number",
                // eslint-disable-next-line
                "input_data": "${doc}",
                "form_uri": "keyings/5a60aae821cc010025ee2d81/Form_11/Number/Task_0thdqri",
                // eslint-disable-next-line
                "key_data": "${Task_0thdqri_output_data.key_datas}",
                // eslint-disable-next-line
                "comment": "${Task_0thdqri_output_data.comment}",
                // eslint-disable-next-line
                "hold_count": "${Task_0thdqri_output_data.hold_count}"
            },
            {
                "project_id": "5a60aae821cc010025ee2d81",
                "process_key": "start_5a60aae821cc010025ee2d81",
                "id": "Task_0ezy0hm",
                "name": "Key Form_11 Address",
                // eslint-disable-next-line
                "input_data": "${doc}",
                "form_uri": "keyings/5a60aae821cc010025ee2d81/Form_11/Address/Task_0ezy0hm",
                // eslint-disable-next-line
                "key_data": "${Task_0ezy0hm_output_data.key_datas}",
                // eslint-disable-next-line
                "comment": "${Task_0ezy0hm_output_data.comment}",
                // eslint-disable-next-line
                "hold_count": "${Task_0ezy0hm_output_data.hold_count}"
            },
            {
                "project_id": "5a60aae821cc010025ee2d81",
                "process_key": "start_5a60aae821cc010025ee2d81",
                "id": "Task_10s3n59",
                "name": "Key Form_11 Header",
                // eslint-disable-next-line
                "input_data": "${doc}",
                "form_uri": "keying/5a60aae821cc010025ee2d81/Form_11/Header/Task_10s3n59",
                // eslint-disable-next-line
                "key_data": "${Task_10s3n59_output_data.key_datas}",
                // eslint-disable-next-line
                "comment": "${Task_10s3n59_output_data.comment}",
                // eslint-disable-next-line
                "hold_count": "${Task_10s3n59_output_data.hold_count}"
            },
            {
                "project_id": "5a60aae821cc010025ee2d81",
                "process_key": "start_5a60aae821cc010025ee2d81",
                "id": "Task_1i9gi8z",
                "name": "Key Form_11 Occupation",
                // eslint-disable-next-line
                "input_data": "${doc}",
                "form_uri": "keyings/5a60aae821cc010025ee2d81/Form_11/Occupation/Task_1i9gi8z",
                // eslint-disable-next-line
                "key_data": "${Task_1i9gi8z_output_data.key_datas}",
                // eslint-disable-next-line
                "comment": "${Task_1i9gi8z_output_data.comment}",
                // eslint-disable-next-line
                "hold_count": "${Task_1i9gi8z_output_data.hold_count}"
            },
            {
                "project_id": "5a60aae821cc010025ee2d81",
                "process_key": "start_5a60aae821cc010025ee2d81",
                "id": "Task_0f3b8aj",
                "name": "Key Form_12 Header",
                // eslint-disable-next-line
                "input_data": "${doc}",
                "form_uri": "keying/5a60aae821cc010025ee2d81/Form_12/Header/Task_0f3b8aj",
                // eslint-disable-next-line
                "key_data": "${Task_0f3b8aj_output_data.key_datas}",
                // eslint-disable-next-line
                "comment": "${Task_0f3b8aj_output_data.comment}",
                // eslint-disable-next-line
                "hold_count": "${Task_0f3b8aj_output_data.hold_count}"
            },
            {
                "project_id": "5a60aae821cc010025ee2d81",
                "process_key": "start_5a60aae821cc010025ee2d81",
                "id": "Task_04nw1gf",
                "name": "Key Form_12 Register",
                // eslint-disable-next-line
                "input_data": "${doc}",
                "form_uri": "keyings/5a60aae821cc010025ee2d81/Form_12/Register/Task_04nw1gf",
                // eslint-disable-next-line
                "key_data": "${Task_04nw1gf_output_data.key_datas}",
                // eslint-disable-next-line
                "comment": "${Task_04nw1gf_output_data.comment}",
                // eslint-disable-next-line
                "hold_count": "${Task_04nw1gf_output_data.hold_count}"
            },
            {
                "project_id": "5a60aae821cc010025ee2d81",
                "process_key": "start_5a60aae821cc010025ee2d81",
                "id": "Task_0xr8xbc",
                "name": "Classify Form_60",
                // eslint-disable-next-line
                "input_data": "${doc}",
                "form_uri": "classifying/12/true/5a60aae821cc010025ee2d81/0/0/Task_0xr8xbc"
            },
            {
                "project_id": "5a60aae821cc010025ee2d81",
                "process_key": "start_5a60aae821cc010025ee2d81",
                "id": "Task_1xbmf58",
                "name": "Verify Hold",
                // eslint-disable-next-line
                "input_data": "${doc}",
                "form_uri": "verifying/hold/10/true/5a60aae821cc010025ee2d81/Task_1xbmf58"
            },
            {
                "project_id": "5a60aae821cc010025ee2d81",
                "process_key": "qc_5a60aae821cc010025ee2d81",
                "id": "Task_0v8xrpw",
                "name": "QC Form_11",
                "form_uri": "qc/5a60aae821cc010025ee2d81/Form_11/Task_0v8xrpw"
            },
            {
                "project_id": "5a60aae821cc010025ee2d81",
                "process_key": "qc_5a60aae821cc010025ee2d81",
                "id": "Task_0v8xrpw",
                "name": "QC Form_12",
                "form_uri": "qc/5a60aae821cc010025ee2d81/Form_12/Task_0v8xrpw"
            }
        ]
    }
    return {
        status: 200,
        headers: {},
        body: JSON.stringify(json),
        json
    }
}

