import { numberForReport } from '../../../utils/format_number'
import Moment from "moment";
export function createRowsData(item, id) {
    const date = new Date(item.date).toLocaleDateString();
    return {
        id: item.id,
        taskName: item.task_name,
        totalCharacters: numberForReport(item.total_characters),
        totalDocument: numberForReport(item.total_document),
        speed: item.speed,
        date: item.date && item.date.length > 0 ? Moment(date).format("DD/MM/YYYY") : '',
    };
}

export function convertColumnsData() {
    return [
        {
            id: 'taskName',
            numeric: false,
            disablePadding: false,
            label: 'Task Name',
            sort: true,
            width: 200,
            styleHeader: {
                minWidth: '200px',
                padding: '4px',
            },
            styleRowBody: {
                minWidth: '200px',
                padding: '4px',
            },
        },
        {
            id: 'date',
            numeric: false,
            disablePadding: false,
            label: 'Date',
            sort: true,
            width: 200,
            styleHeader: {
                minWidth: '200px',
                padding: '4px',
            },
            styleRowBody: {
                minWidth: '200px',
                padding: '4px',
            },
        },
        {
            id: 'totalCharacters',
            numeric: false,
            disablePadding: false,
            label: 'Total Characters',
            sort: true,
            width: 200,
            styleHeader: {
                minWidth: '200px',
                padding: '4px',
            },
            styleRowBody: {
                minWidth: '200px',
                padding: '4px',
            },
        },
        {
            id: 'totalDocument',
            numeric: false,
            disablePadding: false,
            label: 'Total Document',
            sort: true,
            width: 200,
            styleHeader: {
                minWidth: '200px',
                padding: '4px',
            },
            styleRowBody: {
                minWidth: '200px',
                padding: '4px',
            },
        },
        {
            id: 'speed',
            numeric: false,
            disablePadding: false,
            label: 'Speed',
            sort: true,
            width: 200,
            styleHeader: {
                minWidth: '200px',
                padding: '4px',
            },
            styleRowBody: {
                minWidth: '200px',
                padding: '4px',
            },
        },

    ]
}

export function convertColumnsSearch() {
    return [
        {
            id: 0,
            name: 'taskId'
        },
        {
            id: 1,
            name: 'taskName'
        },
        {
            id: 2,
            name: 'date'
        },
    ]
}