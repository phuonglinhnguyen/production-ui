// @flow
import React from 'react';
import { labelByIndex } from '../../hotkey';
import { grey500 } from 'material-ui/styles/colors';
import { ListItem } from 'material-ui/List';
type ItemProps = {
    item: Object,
    rowIndex: number,
    colIndex: number,
    hotKeyControl?: string | boolean,
    styles?: Object,
    onHover?: Function
}
export const getItemLookup = (props: ItemProps) => {
    const { item, rowIndex, colIndex, hotKeyControl, styles, onHover, addNodeItem, isSpecial, lookupConfig, configView, ...other } = props;
    let _props = {
        style: styles.listItem,
        innerDivStyle: styles.innerDiv,
        value: rowIndex,
        primaryText: <span>{item}</span>,
        disableFocusRipple: true,
        key: rowIndex + '-' + colIndex,
        onMouseEnter: () => { },
        onMouseLeave: () => { },
        ...other
    };
    if (hotKeyControl) {
        let _lableHotKey = labelByIndex(rowIndex);
        if (_lableHotKey) {
            if (typeof hotKeyControl === 'string') {
                _lableHotKey = hotKeyControl + "+" + _lableHotKey;
            }
            _props.primaryText =
                <div style={{ display: 'inline-block' }}>
                    <div style={{ display: 'inline-block', textAlign: 'right', paddingRight: '5px', width: '49px', borderRight: '1px solid rgb(224,224,224)', marginRight: '8px' }}>
                        <b style={{ fontSize: '0.69em', color: grey500 }}> {_lableHotKey}</b>
                    </div>
                    {isSpecial ? item :
                        lookupConfig.key_value&&item[lookupConfig.key_value]? item[lookupConfig.key_value]: JSON.stringify(item)}
                </div>;
        } else {
            _props.primaryText =
                <div style={{ display: 'inline-block' }}>
                    <div style={{ display: 'inline-block', textAlign: 'right', paddingRight: '5px', width: '49px', borderRight: '1px solid rgb(224,224,224)', marginRight: '8px' }}>
                        <b style={{ fontSize: '0.69em', color: grey500 }}> </b>
                    </div>
                    {isSpecial ? item :
                        lookupConfig.key_value&&item[lookupConfig.key_value] ? item[lookupConfig.key_value] : JSON.stringify(item)}
                </div>;
        }
    }
    return <ListItem ref={node => addNodeItem(node, colIndex, rowIndex)} {..._props} />
}

export default getItemLookup;