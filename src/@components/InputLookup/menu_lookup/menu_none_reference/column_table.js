import React from 'react';
import { labelByIndex } from '../../hotkey';
import {
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from '@material-ui/core';
import calculateText from './calculateText'
const config = {
    fixedHeader: true,
    fixedFooter: true,
    stripedRows: false,
    showRowHover: true,
    selectable: true,
    multiSelectable: false,
    enableSelectAll: false,
    deselectOnClickaway: true,
    showCheckboxes: false,
    height: 430,
}
const arrSum = arr => arr.reduce((a, b) => a + b, 0)
export const MenuColumnTableLookup = (props) => {

    const {
        data,
        colIndex,
        configView,
        addNodeItem,
        hotKeyControl,
        selection,
        isSpecial,
        lookupDatas,
        maxHeight,
        onSelectLookupItem,
    } = props;
    let _cellSeleted = -1;
    if (selection && colIndex === selection.col) {
        _cellSeleted = selection.row;
    }
    // const handleRowSelection = (selectedRows) => {
    //     const { onSelectLookupItem, data } = props;
    //     onSelectLookupItem(data[selectedRows[0]]);
    // };
    let _maxHeight = Math.min(maxHeight - 72, config.height)
    let sizesHeader = calculateText.calculatorWidthTableHeader(configView)
    let sizesBody = calculateText.calculatorWidthTableBody(data, configView, 19, isSpecial);
    let sizesSum = calculateText.mergeSize(sizesHeader, sizesBody, 20);
    return (
        <table
            style={{
                tableLayout: 'fixed',
                borderRight: '1px solid rgb(204,204,204)',
                background: 'rgba(255,255,255,0)',
                width: '100%',
                display: 'table',
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                borderSpacing: 0,
                borderCollapse: 'collapse',
            }}
        >
            <thead
                style={{ height: '28px', display: 'table-header-group' }}
            >
                <tr style={{
                    fontSize: 16,
                    height: '28px',
                    color: 'inherit',
                    display: 'table-row',
                    outline: 'none',
                    background: "rgba(125,244,235,0.1)",
                    verticalAlign: 'middle',
                }} >
                    <th
                        style={{
                            color: 'rgba(0, 0, 0, 0.54)',
                            fontSize: '0.75rem',
                            fontWeight: 500,
                            display: 'table-cell',
                            padding: '4px 56px 4px 24px',
                            textAlign: 'left',
                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                            verticalAlign: 'inherit',
                            paddingLeft: 16,
                            paddingRight: 5,
                            height: '28px',
                            outline: 'none',
                            width: typeof hotKeyControl === 'string' ? "60px" : '23px'
                        }}>#</th>
                    {
                        configView.map((_cfig, id) =>
                            (
                                <th
                                    key={`title-cfig-${_cfig.title}`}
                                    style={{
                                        color: 'rgba(0, 0, 0, 0.54)',
                                        fontSize: '0.75rem',
                                        fontWeight: 500,
                                        display: 'table-cell',
                                        padding: '4px 56px 4px 0px',
                                        textAlign: 'left',
                                        borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                        verticalAlign: 'inherit',
                                        paddingLeft: 0,
                                        paddingRight: 0,
                                        height: '28px',
                                        width: `${sizesSum[id]}px`,
                                        outline: 'none',
                                    }}>
                                    {_cfig.title}
                                </th>
                            ))
                    }
                </tr>
            </thead>
            <tbody
                style={{ fontSize: 19, display: 'table-row-group' }}
            >
                {data.map((item, index) => {
                    let _lableHotKey = labelByIndex(index);
                    if (_lableHotKey) {
                        if (typeof hotKeyControl === 'string') {
                            _lableHotKey = hotKeyControl + "+" + _lableHotKey;
                        }
                    }
                    return (<TableRow
                        onClick={(event) => {
                            onSelectLookupItem(item)
                        }}
                        key={`selected-cfig-${index}`}
                        ref={node => addNodeItem(node, colIndex, index)}
                        style={{
                            height: '32px',
                            cursor: 'pointer',
                            backgroundColor: index === _cellSeleted ? 'rgba(0, 0, 0, 0.14)' : (index % 2 == 0 ? 'rgba(0, 0, 0, 0.05)' : 'transparent'),
                            color: 'inherit',
                            height: '28px',
                            display: 'table-row',
                            outline: 'none',
                            verticalAlign: 'middle',
                        }}
                    >
                        <td style={{
                            width: typeof hotKeyControl === 'string' ? "60px" : '25px',
                            padding: '0px 0px 0px 14px',
                            height: '28px',
                            fontSize: '0.8125rem',
                            color: 'rgba(0, 0, 0, 0.87)',
                            fontWeight: 400,
                            display: 'table-cell',
                            textAlign: 'left',
                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                            verticalAlign: 'inherit',
                            outline: 'none',
                        }}>{_lableHotKey}</td>
                        {
                            configView.map((_cfig, id) =>
                                (
                                    <td
                                        width={`${sizesSum[id]}px`}
                                        style={{
                                            height: '28px',
                                            color: 'rgba(0, 0, 0, 0.87)',
                                            fontWeight: 400,
                                            display: 'table-cell',
                                            // padding: '4px 0px 4px 5px',
                                            padding: 0,
                                            textAlign: 'left',
                                            borderBottom: '1px solid rgba(224, 224, 224, 1)',
                                            verticalAlign: 'inherit',
                                            outline: 'none',
                                        }}
                                        key={`selected-value-${_cfig.key_value}`}>
                                        {isSpecial ? item : (item[_cfig.key_value] || '')}
                                    </td>
                                ))
                        }
                    </TableRow>)
                }
                )
                }
            </tbody>
        </table >
    )
}

export default MenuColumnTableLookup;