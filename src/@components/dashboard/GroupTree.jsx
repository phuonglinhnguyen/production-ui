import * as React from 'react';
import { isEqual } from 'lodash'
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import DraftsIcon from '@material-ui/icons/Drafts';
import SendIcon from '@material-ui/icons/Send';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import StarBorder from '@material-ui/icons/StarBorder';
import ChevronRight from '@material-ui/icons/ChevronRight'

import FolderIcon from '@material-ui/icons/Folder'
import FolderOpenIcon from '@material-ui/icons/FolderOpen'
import StorageIcon from '@material-ui/icons/Storage'
type Props = {
    label_keys: string[],
    redirectGroup: Function,
    datas: Array<Object>,
    item_id: string,
    id_selected: string,
    primary1Color: string,
    secondaryTextColor: string,
    style: Object
};
// class  extends React.PureComponent<Props, Object> {
//     constructor(props: Props) {
//         super(props);
//         this.state = {
//             open: false
//         }
//     }

//     handleRequestClose = (event: Object) => {
//         this.setState({
//             open: false,
//         });
//     }
//     handleContextMenu = (event: Object) => {
//         event.preventDefault();
//         event.stopPropagation();
//         this.setState({
//             open: true,
//             anchorEl: event.currentTarget,
//         })
//     }
//     renderItem = (child_group:
//         Array<Object> = [], name: string) => {
//         const {
//             id_selected,
//             label_keys = ['name'],
//             primary1Color,
//             item_id,
//             secondaryTextColor,
//             redirectGroup
//         } = this.props;
//         let nestedItems = [];
//         child_group.forEach((data, index) => {
//             if (data.type === 'Project') return;
//             nestedItems = [
//                 ...nestedItems,
//                 <ListItem
//                     style={{ height: 42, padding: 0, margin: 0 }}
//                     // onContextMenu={this.handleContextMenu}
//                     initiallyOpen={JSON.stringify(data.childs || []).includes(
//                         item_id
//                     )}
//                     innerDivStyle={{
//                         color: data.id === item_id ? primary1Color : secondaryTextColor,
//                         // overflow: 'hidden',
//                         // textOverflow: 'ellipsis',
//                         // whiteSpace: 'nowrap',
//                         // paddingTop: 14,
//                         // paddingBottom: 4,
//                         // fontSize: 16
//                     }}

//                     key={'list-item-' + data.name}
//                     leftIcon={
//                         (
//                             <FolderIcon
//                                 // style={{
//                                 //     display: "block", 
//                                 //     height: 24,
//                                 //     marginTop:0,
//                                 //     position:"absolute",
//                                 //     top:4,
//                                 //     width:24
//                                 // }}
//                                 color={
//                                     data.id === item_id ? primary1Color : secondaryTextColor
//                                 }
//                             />
//                         )
//                     }
//                     nestedItems={this.renderItem(data.childs, data.name)}
//                     onClick={() => redirectGroup(data.id, data)}
//                     value={data.id}
//                     primaryText={label_keys.map(_label => {
//                         return data[_label];
//                     })}
//                 >
//                 </ListItem>
//             ];
//         });
//         return nestedItems;
//     }

//     render() {
//         const {
//             redirectGroup,
//             datas = [],
//             id_selected,
//             primary1Color,
//             secondaryTextColor,
//             item_id,
//             style = {}
//         } = this.props;
//         return (
//             <React.Fragment>
//                 {/* <Popover
//                     open={this.state.open}
//                     anchorEl={this.state.anchorEl}
//                     anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
//                     targetOrigin={{ horizontal: 'right', vertical: 'top' }}
//                     onRequestClose={this.handleRequestClose}
//                     useLayerForClickAway={false}
//                 >
//                     <Menu>
//                         <MenuItem leftIcon={<NewFolderIcon />} primaryText="Create Group" />
//                         <MenuItem leftIcon={<NewFolderIcon />} primaryText="Create Project" />
//                         <MenuItem leftIcon={< RenameIcon />} primaryText="Rename" />
//                         <MenuItem leftIcon={<MoveIcon />} primaryText="Move to..." />
//                         <MenuItem leftIcon={<DeleteIcon />} primaryText="Delete" />
//                     </Menu>
//                 </Popover> */}
//                 <ListItem button onClick={this.handleClick}>
//                     <ListItemIcon>
//                         <InboxIcon />
//                     </ListItemIcon>
//                     <ListItemText inset primary="Inbox" />
//                     {this.state.open ? <ExpandLess /> : <ExpandMore />}
//                 </ListItem>
//             </React.Fragment>
//         );
//     }
// };



const styles = theme => ({
    root: {
        width: '100%',
    },
    nested: {
        paddingLeft: theme.spacing.unit * 4,
    },
    nestedSelected: {
        paddingLeft: theme.spacing.unit * 4,
        background:'rgba(0,0,0,0.2)'
    },
});


class GroupItemFa extends React.Component {
    state = {
        open: false,
    };
    handleClick = () => {
        this.setState(state => ({ open: !state.open }));
    };
    handleClickItem=()=>{
        const { redirectGroup, item } = this.props;
        redirectGroup(item.id, item)
    }
    render() {
        const { classes, item ,itemId ,redirectGroup} = this.props;
        let folders = item.childs || [];
        let isSelected = item.id === itemId;
        if (folders.length > 0) {
            return (
                <React.Fragment>
                    <ListItem button onClick={this.handleClickItem} className={isSelected ? classes.nestedSelected: classes.nested} >
                        {this.state.open ? <ExpandMore onClick={this.handleClick} /> : <ChevronRight onClick={this.handleClick} />}
                        <ListItemIcon>
                            {this.state.open ? <FolderOpenIcon /> : <FolderIcon />}
                        </ListItemIcon>
                        <ListItemText inset primary={item.name} />
                    </ListItem>
                    <Collapse in={this.state.open} timeout="auto" className={classes.nested} unmountOnExit >
                        <List component="div" disablePadding>
                            {
                                item.childs && item.childs.map((item,key) => <GroupItem key={key} item={item} itemId={itemId}  redirectGroup={redirectGroup}/>)
                            }
                        </List>
                    </Collapse >
                </React.Fragment>
            );
        } else {
            return (<ListItem button onClick={this.handleClickItem} className={isSelected ? classes.nestedSelected: classes.nested} >
                <div style={{
                    fill: 'currentColor',
                    width: '1em',
                    height: '1em',
                    display: 'inline-block',
                    fontSize: '24px',
                    transition: 'fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                    userSelect: 'none',
                    flexShrink: 0
                }}></div>
                <ListItemIcon>
                    <ListItemIcon>
                        {isSelected  ? <FolderOpenIcon /> : <FolderIcon />}
                    </ListItemIcon>
                </ListItemIcon>
                <ListItemText inset primary={item.name} />
            </ListItem>)
        }
    }
}
const GroupItem = withStyles(styles)(GroupItemFa);



class GroupTree extends React.Component {
    state = {
        open: true,
    };

    handleClick = () => {
        this.setState(state => ({ open: !state.open }));
    };
    handleClickItem=()=>{
        const { redirectGroup, datas } = this.props;
        redirectGroup('all', datas)
    }
    render() {
        const { classes, datas, redirectGroup, itemId } = this.props;
        return (
            <div className={classes.root}>
                <List
                    component="nav"
                >
                    <ListItem button onClick={this.handleClickItem}  >
                        {this.state.open ? <ExpandMore  onClick={this.handleClick} /> : <ChevronRight  onClick={this.handleClick} />}
                        <ListItemIcon>
                            <StorageIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="ALL GROUPS" />
                    </ListItem>
                    <Collapse in={this.state.open} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            {
                                datas.map((item,key) => <GroupItem key={key} item={item} itemId={itemId} redirectGroup={redirectGroup} />)
                            }
                        </List >
                    </Collapse>
                </List>
            </div>
        );
    }
}

GroupTree.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(GroupTree);