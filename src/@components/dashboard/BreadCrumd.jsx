import * as  React from 'react'


import { IconButton, Menu, MenuItem, Popover, Button } from '@material-ui/core'

import {
    Home as HomeIcon,
    AddCircle as AddCircleIcon,
    ChevronRight as ChevronRightIcon
} from '@material-ui/icons'
import StorageIcon from '@material-ui/icons/Storage'

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
        <ChevronRightIcon color='rgba(0,0,0,.4)' />
    </div>
)

export default (props) => {
    const {
        style = {},
        items = [],
        onSelect,
        onAction,
    } = props;
    return (
        <div style={{ ...getStyle(), ...style }}>
            {items && items.map(item => {
                if (item.id === 'all') {
                    return (
                        <React.Fragment key={item.id}>
                            {/* <IconButton
                                onClick={event => { event.preventDefault(); onSelect(item) }}
                            >
                                <HomeIcon />
                            </IconButton> */}
                        </React.Fragment>
                    )
                }
                return (
                    <React.Fragment key={item.id}>
                            <Breack />
                        <Button
                            style={{ marginTop: 0, padding: 0 }}
                            onClick={event => { event.preventDefault(); onSelect(item) }}
                        >
                        {item.name}
                        </Button>


                    </React.Fragment>
                )
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
