import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, makeSelectable } from 'material-ui/List';
import { getItemLookup } from './item';
const SelectableList = makeSelectable(List);

class MenuColumnLookup extends Component {
    static defaultProps = {
        data: [],
        hotKeyControl: false,
        rowSelected: -1,
        colSelected: -1,
        styleColumn: {
            list: {
                display: 'block',
                width: '100%'
            },
            listItem: {
                padding: 0,
                margin: 0
            },
            innerDiv: {
                overflow: 'hidden',
                padding: '0px 0px 0px 16px',
                margin: 0,
                fontSize: '17px',
                lineHeight: '22px'
            }
        },
    }
    static contextTypes = {
        muiTheme: PropTypes.object.isRequired
    };
  
    render() {
        const {
            data,
            colIndex,
            isSpecial,
            styleColumn,
            onHover,
            configView,
            addNodeItem,
            hotKeyControl,
            onSelectLookupItem,
            selection,
     
            lookupConfig,
            } = this.props;
        let _cellSeleted = -1;
        if (selection && colIndex === selection.col) {
            _cellSeleted = selection.row;
        }
            return (
                <SelectableList
                    style={styleColumn.list}
                    value={_cellSeleted}
                    onChange={(event, index) => {
                        onSelectLookupItem(data[index], event);
                    }}
                >
                    {data.map((item, index) =>
                        getItemLookup({
                            key: `item-${colIndex}-${index}`,
                            item: item,
                            isSpecial,
                            lookupConfig: lookupConfig,
                            configView: configView,
                            rowIndex: index,
                            colIndex: colIndex,
                            hotKeyControl: hotKeyControl,
                            styles: styleColumn,
                            onHover: onHover,
                            addNodeItem,
                        })
                    )
                    }
                </SelectableList>
            );
      
    }
}

export default MenuColumnLookup;