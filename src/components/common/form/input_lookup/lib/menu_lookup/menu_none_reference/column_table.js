import React from 'react';
import { labelByIndex } from '../../hotkey';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

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
export const MenuColumnTableLookup = (props) => {

    const {
        data,
        colIndex,
        configView,
        addNodeItem,
        hotKeyControl,
        selection,
        lookupDatas,
        maxHeight,
    } = props;
    let _cellSeleted = -1;
    if (selection && colIndex === selection.col) {
        _cellSeleted = selection.row;
    }
    const handleRowSelection = (selectedRows) => {
        const { onSelectLookupItem, data } = props;
        onSelectLookupItem(data[selectedRows[0]]);
    };
    let  _maxHeight =Math.min(maxHeight-72 , config.height)
    return (
        <Table
            onRowSelection={handleRowSelection}
            height={lookupDatas.length > 1 ? undefined :_maxHeight + 'px'}
            fixedHeader={config.fixedHeader}
            fixedFooter={config.fixedFooter}
            selectable={config.selectable}
            multiSelectable={config.multiSelectable}
            style={{ borderRight: '1px solid rgb(204,204,204)',
                     background:'rgba(255,255,255,0)' }}
        >
            <TableHeader
                displaySelectAll={config.showCheckboxes}
                adjustForCheckbox={config.showCheckboxes}
                enableSelectAll={config.enableSelectAll}
                style={{height:'32px'}}
            >
                <TableRow tyle={{ fontSize: 16 ,height:'32px' }} >
                    <TableHeaderColumn style={{ width: typeof hotKeyControl === 'string' ? "60px" : '23px' ,paddingLeft:16,paddingRight:5 ,height:'32px' }}>#</TableHeaderColumn>
                    {
                        configView.map(_cfig =>
                            (
                                <TableHeaderColumn key={`title-cfig-${_cfig.title}`} style={{paddingLeft:5,paddingRight:0 ,height:'32px'}}>
                                    {_cfig.title}
                                </TableHeaderColumn>
                            ))
                    }
                </TableRow>
            </TableHeader>
            <TableBody
                displayRowCheckbox={config.showCheckboxes}
                deselectOnClickaway={config.deselectOnClickaway}
                showRowHover={config.showRowHover}
                stripedRows={config.stripedRows}
                style={{ fontSize: 16 }}
            >
                {data.map((item, index) => {
                    let _lableHotKey = labelByIndex(index);
                    if (_lableHotKey) {
                        if (typeof hotKeyControl === 'string') {
                            _lableHotKey = hotKeyControl + "+" + _lableHotKey;
                        }
                    }
                    return (<TableRow
                        selected={index === _cellSeleted}
                        key={`selected-cfig-${index}`}
                        ref={node => addNodeItem(node, colIndex, index)}
                        style={{ fontSize: 16 ,height:'32px' }}
                    >
                        <TableRowColumn style={{ width: typeof hotKeyControl === 'string' ? "60px" : '25px',paddingLeft:16,paddingRight:5 ,height:'32px'}}>{_lableHotKey}</TableRowColumn>
                        {
                            configView.map(_cfig =>
                                (
                                    <TableRowColumn
                                        style={{ fontSize: 16,paddingLeft:5,paddingRight:0 ,height:'32px' }}
                                        key={`selected-value-${_cfig.key_value}`}>
                                        {item[_cfig.key_value] || ''}
                                    </TableRowColumn>
                                ))
                        }
                    </TableRow>)
                }
                )
                }
            </TableBody>
        </Table>
    )
}

export default MenuColumnTableLookup;