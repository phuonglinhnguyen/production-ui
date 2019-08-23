import { AccessAlarm, Home, CreateNewFolder, Accessibility } from '@material-ui/icons'

const functions = {
    "acquisitions": {
        name: 'acquisitions',
        path: '/acquisitions',
        icon: AccessAlarm,
        title: 'acquisitions',
    },
    "exports": {
        name: 'exports',
        path: '/exports',
        icon: Home,
        title: 'exports',
    },
    "test": {
        name: 'test',
        path: '/test',
        icon: CreateNewFolder,
        title: 'test',
    },
    "uploads": {
        name: 'uploads',
        path: '/uploads',
        icon: Accessibility,
        title: 'uploads',
    }
}
export const getFunction = (items: string[]) => items.map(item => (functions[item] || {
    name: item,
    path: `/${item}`,
    title: item
}
))