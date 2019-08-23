import { sortBy } from 'lodash'
export function createRowsData(item, id) {
    return {
        id: item.file_name,
        fileName: item.file_name,
        s3Url: item.s3_url,
    };
}

export function convertColumnsData() {
    return [
        // {
        //     id: 'checkbox',
        //     numeric: false,
        //     disablePadding: false,
        //     label: '',
        //     sort: false,
        //     styleHeader: {
        //         width: '9px',
        //         paddingRight: '0px',
        //     },
        //     styleRowBody: {
        //         width: '9px',
        //         // width: '9px',
        //         paddingRight: '0px',
        //         // padding: '0px',
        //     },
        // },
        {
            id: 'fileName',
            numeric: false,
            disablePadding: false,
            label: 'File Name',
            sort: true,
            styleHeader: {
                width: '80%',
                // padding: '0 0 0 10',
            },
            styleRowBody: {
                width: '80%',
                // paddingRight: '0px',
                height: '30px',
            },
        },
        {
            id: 'Function',
            numeric: false,
            disablePadding: false,
            Action: true,
            label: 'Function',
            sort: false,
            styleHeader: {
                width: '19%',
                // padding: '0 0 0 10',
            },
            styleRowBody: {
                width: '19%',
                // paddingRight: '0px',
                height: '30px',
            },
        },
    ]
}

export function convertColumnsSearch() {
    return [
        {
            id: 0,
            name: 'fileName'
        },
    ]
}
