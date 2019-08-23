import * as  React from 'react'


import { IconButton, Menu, MenuItem, Popover, Button } from '@material-ui/core'

import {
    Home as HomeIcon,
    AddCircle as AddCircleIcon,
    ChevronRight as ChevronRightIcon
} from '@material-ui/icons'
import Typography from '@material-ui/core/Typography';
const getStyle = () => {
    return { display: 'flex', flex: 'flex-inline', width: '100%', height: '48px' }
}

const Breack = () => (
    <div style={{
        border: 0,
        boxSizing: 'border-box',
        display: 'inline-block',
        textDecoration: 'none',
        margin: 0,
        padding: '12px 0px 12px 0px ',
        outline: 'none',
        fontSize: 0,
        fontWeight: 'inherit',
        position: 'relative',
        overflow: 'visible',
        transition: 'all 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms',
        width: '24px',
        height: '48px',
        background: 'none'
    }}>
        <ChevronRightIcon  />
    </div>
)

export default (props) => {
    const {
        style = {},
        items = [],
        onSelect,
        onAction,
    } = props;
    if (items.length > 3) {


    }
    return (
        <div style={{ ...getStyle(), ...style }}>
            {items && items.map(item => {
                switch (item.id) {
                    case 'all':
                        return (
                            <React.Fragment key={item.id}>
                                <IconButton
                                    style={{
                                        color: 'white',
                                        fontSize: 20,
                                        fontWeight: 'bold'
                                    }}
                                    onClick={event => { event.preventDefault(); onSelect(item) }}
                                >
                                    <HomeIcon />
                                </IconButton>
                            </React.Fragment>
                        )
                        break;
                    case 'function':
                        let title = '';
                        if(item.type==='dashboard'){
                            return ''
                        }
                        switch (item.type) {
                            case 'key':
                                title = `${item.name} - ${item.layoutName}`
                                break;
                            default:
                                title = `${item.name}`
                                break;
                        }
                        return (<React.Fragment key={item.id}>
                            <Breack />
                            <Typography
                                style={{

                                    color: 'white',
                                    fontSize: 20,
                                    fontWeight: 'bold',
                                    marginTop: 10,
                                    marginRight: 5,
                                    padding: 0
                                }}
                                variant="headline" component="h3">
                                {title}
                            </Typography>
                        </React.Fragment>)
                        break;
                    case 'doc_info':
                        return (
                            <React.Fragment key={item.id}>
                                <Typography
                                    style={{
                                        position:'absolute',
                                        top:48,
                                        left:74,
                                        color: 'white',
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        padding: 0
                                    }}
                                    variant="headline" component="h4">
                                    <span style={{
                                        color: 'rgba(0, 0, 0, 0.54)',
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        padding: 0
                                    }}>
                                        {'Batch Name:  '}
                                    </span>
                                    {item.batch_name}
                                    <span style={{
                                        color: 'rgba(0, 0, 0, 0.54)',
                                        fontSize: 14,
                                        fontWeight: 'bold',
                                        marginTop: 10,
                                        padding: 0
                                    }}>
                                        {'   Doc Name:  '}
                                    </span>
                                    {item.doc_name}
                                </Typography>
                            </React.Fragment>
                        )

                    default:
                        return (
                            <React.Fragment key={item.id}>
                                <Breack />
                                <Button
                                    style={{
                                        color: 'white',
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                        marginTop: 0,
                                        padding: 0
                                    }}
                                    onClick={event => { event.preventDefault(); onSelect(item) }}
                                >
                                    {item.name}
                                </Button>


                            </React.Fragment>
                        )
                        break;
                }
            })}

            {/* <IconButton
                aria-label="More"
                aria-owns={true ? 'long-menu' : null}
                aria-haspopup="true"
            >
                <AddCircleIcon color='rgba(100,100,100,.8)' />
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={null}
                open={false}
                // onClose={this.handleClose}
                PaperProps={{
                    style: {
                        maxHeight: 12 * 4.5,
                        width: 200,
                    },
                }}
            >
                <MenuItem primaryText="" onClick={event => {
                    onAction('create_project', event)
                }} >
                    Create project
                </MenuItem>
            </Menu> */}
        </div>
    )
}
