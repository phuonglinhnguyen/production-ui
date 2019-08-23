export const KEY_CTRL = { label: 'Ctrl', event: 'ctrlKey' };
export const KEY_ALT = { label: 'Alt', event: 'altKey' };
export const KEY_SHIFT = { icon:'⇧',label: 'Shift', event: 'shiftKey' };
const hotkeys = [
    {
        value: ['f1'],
        lable: 'F1',
    }, {
        value: ['f2'],
        lable: 'F2',
    }, {
        value: ['f3'],
        lable: 'F3',
    }, {
        value: ['f4'],
        lable: 'F4',
    }, {
        value: ['f5'],
        lable: 'F5',
    }, {
        value: ['f6'],
        lable: 'F6',
    }, {
        value: ['f7'],
        lable: 'F7',
    }, {
        value: ['f8'],
        lable: 'F8',
    }, {
        value: ['f9'],
        lable: 'F9',
    }, {
        value: ['f10'],
        lable: 'F10',
    },
    {
        value: ['f11'],
        lable: 'F11',
    },
    {
        value: ['f12'],
        lable: 'F12',
    }
]
export const labelByIndex = (index: number) => {
    let key = hotkeys[index];
    if (key) {
        return key.lable;
    } else
        return;
}
export const getIndex = (_keycode) => {
    return hotkeys.findIndex(key => key.value.includes(_keycode))
}