import * as  React from 'react'

import { Button } from '@material-ui/core'
import GroupTree from './GroupTree'
import { compose } from 'recompose';
import AddIcon from '@material-ui/icons/Add';
const ListGroup = (props) => {
    const { groupStyle,
        zDepth = 1,
        items,
        itemId,
        onChange,
        groupName = '',
        changeGroupName,
        onCreateGroup,
        onCreateProject,
    } = props;
    let items_filtered = groupName ? items.filter(item => !!item.name.toLowerCase().includes(groupName.toLowerCase())) : items;
    return (<div style={{ width: "100%", height: 'calc(100%)'}}>
        {/* <Button
            variant="contained" color="primary"
            style={{ margin: 8 }}
            onClick={event => { onCreateGroup() }}
        >
        <AddIcon />
            Create Group
        </Button> */}
        <div className='cool_scroll_smart' style={{ width: "100%", 
        height: 'calc(100%)', 
        overflow: 'auto' }}>
            <GroupTree
                redirectGroup={onChange}
                datas={items_filtered}
                itemId={itemId}
                primary1Color={''}
                secondaryTextColor={''}
            />
        </div>
    </div>)
};

export default compose()(ListGroup);