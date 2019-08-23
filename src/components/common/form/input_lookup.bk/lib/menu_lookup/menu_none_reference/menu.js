import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
import * as hotkeyLookup from '../../hotkey';
import MenuColumnLookup from './column';
import MenuColumnTableLookup from './column_table';
import scrollIntoViewIfNeeded from 'scroll-into-view-if-needed';
import { isEqual } from 'lodash';
export default class Menu extends Component {
    static defaultProps = {
        lookupDatas: [[], []],
        rowSelected: -1,
        colSelected: 0,
        onHover: () => undefined,
        columnConfig: [{
            hotkey: true,
            width: '40%'
        }, {
            hotkey: hotkeyLookup.KEY_SHIFT.label,
            width: '60%'
        }]
    }
    __addNode = (node, col, row) => {
        this._refs = this._refs || {};
        this._refs[col] = this._refs[col] || {};
        this._refs[col][row] = node;
    }
    shouldComponentUpdate(nextProps) {
        let shouldUpdate = !isEqual(this.props, nextProps);
        return shouldUpdate;
    }

    componentDidUpdate() {
        const {
            selection
         } = this.props;
        if (selection) {
            let cols = this._refs[selection.col]
            let node = cols ? cols[selection.row] : null;
            try {
                if (node) {
                    node = findDOMNode(node);
                    scrollIntoViewIfNeeded(node, false, {
                        duration: 150
                    })
                }
            } catch (e) { }
        }
    }
    render() {
        const {
            lookupDatas,
            columnConfig,
            styles,
            lookupConfig,
            onSelectLookupItem,
            selection,
            isSpecial,
            maxHeight,
         } = this.props;

        let configView = lookupConfig.config_view;
        if (!configView) {
            configView = [];
            configView.push({ title: lookupConfig.name, key_value: lookupConfig.key_value })
        }
        let  _maxHeight = Math.min(maxHeight,550)
        return (
            <div style={{
                width: "100%", display: 'inline-flex',
                justifyContent: 'space-between',
                flexWrap: 'nowrap',
                maxHeight: _maxHeight+ 'px',
            }}>

                {lookupDatas.map((data, index) => {
                    let _cof = columnConfig[index] || { width: (lookupDatas && lookupDatas.length === 1) ? '100%' : '50%' };
                    if (lookupDatas && lookupDatas.length === 1) {
                        _cof = { ..._cof, width: '100%' };
                    }
                    let _style = { width: _cof.width};
                    if (isSpecial || !configView) {
                        return (
                            <div key={`col-lookup-${index}`} style={_style}>
                                <MenuColumnLookup
                                    colIndex={index}
                                    data={data}
                                    lookupConfig={lookupConfig}
                                    hotKeyControl={_cof.hotkey}
                                    configView={configView}
                                    selection={selection}
                                    styleColumn={styles}
                                    isSpecial={isSpecial}
                                    onSelectLookupItem={onSelectLookupItem}
                                    addNodeItem={this.__addNode}
                                    maxHeight={_maxHeight}
                                    
                                />
                            </div>
                        )
                    } else {
                        return (
                            <div key={`col-lookup-${index}`} style={_style}>
                                <MenuColumnTableLookup
                                    colIndex={index}
                                    data={data}
                                    lookupDatas={lookupDatas}
                                    lookupConfig={lookupConfig}
                                    hotKeyControl={_cof.hotkey}
                                    configView={configView}
                                    maxHeight={_maxHeight}
                                    selection={selection}
                                    styleColumn={styles}
                                    isSpecial={isSpecial}
                                    onSelectLookupItem={onSelectLookupItem}
                                    addNodeItem={this.__addNode}
                                />
                            </div>
                        )
                    }


                }
                )}
            </div>
        );
    }
}