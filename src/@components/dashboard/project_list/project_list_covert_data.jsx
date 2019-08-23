import { sortBy } from 'lodash'
export function createRowsData(item, id) {
    return {
        id: item.id,
        projectName: item.name,
        priority: Number(item.priority),
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
            id: 'projectName',
            numeric: false,
            disablePadding: false,
            label: 'Project Name',
            sort: true,
            styleHeader: {
                width: '80%',
            },
            styleRowBody: {
                width: '80%',
                height: '30px',
            },
        },
        {
            id: 'priority',
            numeric: false,
            disablePadding: false,
            label: 'Priority',
            sort: true,
            styleHeader: {
                width: '20%',
            },
            styleRowBody: {
                width: '20%',
                height: '30px',
            },
        },
        // {
        //     id: 'Function',
        //     numeric: false,
        //     disablePadding: false,
        //     Action: true,
        //     label: 'Function',
        //     sort: false,
        //     styleHeader: {
        //         width: '19%',
        //         // padding: '0 0 0 10',
        //     },
        //     styleRowBody: {
        //         width: '19%',
        //         // paddingRight: '0px',
        //         height: '30px',
        //     },
        // },
    ]
}

export function convertColumnsSearch() {
    return [
        {
            id: 0,
            name: 'projectName'
        },
        {
            id: 1,
            name: 'priority'
        },
    ]
}
