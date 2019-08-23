import * as React from 'react'

import { TextField,Popover } from '@material-ui/core'

import GroupTree from './GroupTree'

export default class GroupSelect extends React.Component {
    state = {
        open: false,
        anchorEl: null
    }
    handleClick = (event) => {
        event.preventDefault();
        this.setState({
            open: true,
            anchorEl: event.currentTarget,
        });
    };
    handleRequestClose = () => {
        this.setState({
            open: false,
        });
    };
    handleChange = (id, data) => {
        const { onChange } = this.props;
        this.setState({
            open: false,
        });
        onChange && onChange(id, data)
    }
    render() {
        const {
            groups,
            group_id,
            group_name,
            primary1Color,
            secondaryTextColor,
            errorText,
            onChange,
            fullWidth,
            floatingLabelText,
            hintText,
            floatingLabelFixed
        } = this.props;
        return (
            <React.Fragment>
                <TextField
                    fullWidth={fullWidth}
                    floatingLabelText={floatingLabelText}
                    floatingLabelFixed={floatingLabelFixed}
                    hintText={hintText}
                    style={{ cursor: 'pointer' }}
                    readOnly={true}
                    name="group"
                    value={group_name}
                    errorText={errorText}
                    onClick={this.handleClick}
                />
                <Popover
                    open={this.state.open}
                    anchorEl={this.state.anchorEl}
                    onRequestClose={this.handleRequestClose}
                    anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
                    targetOrigin={{ horizontal: 'left', vertical: 'top' }}
                    style={{overflowY:'auto' ,height:350}}
                >
                    <GroupTree
                        redirectGroup={this.handleChange}
                        datas={groups}
                        item_id={group_id}
                        id_selected={group_name}
                        primary1Color={primary1Color}
                        secondaryTextColor={secondaryTextColor}
                    />
                </Popover>

            </React.Fragment>
        )
    }
}
