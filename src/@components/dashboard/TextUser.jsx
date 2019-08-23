import * as React from 'react';
import PropTypes from 'prop-types'

import { Chip, TextFieldLabel, MenuItem ,Button} from '@material-ui/core'
import {Add as ContentAdd} from '@material-ui/icons'

import Fuse from 'fuse.js'
type UserType = {
    Department: string,
    FullName: string,
    JobTitle: string,
    ManagerFullName: string,
    ManagerUserName: string,
    UserName: string,
    WorkLocation: string,
}

type UsersProps = {
    data: {
        Department: string,
        FullName: string,
        JobTitle: string,
        OtherMember?: Array<UserType>,
        TeamMember?: Array<UserType>
    }
}

type TextUserProps = {
    users: UsersProps
}

type State = {
    datas: Array<Object>,
    fuse: any,
}

export default class TextUser extends React.Component<TextUserProps, State> {
    static contextTypes = {
        muiTheme: PropTypes.object.isRequired
    };
    constructor(props: TextUserProps) {
        super(props);
        this.state = {
            datas: [],
            value: '',
            fuse: {},
            adding: false,
        }
    }
    componentDidMount = () => {
        const { users = {} } = this.props;
        this.initFuse(users)
    }
    componentWillReceiveProps = (nextProps) => {
        const { users = {} } = nextProps;
        this.initFuse(users)
        this.setState({ adding: false })
    }
    initFuse = (users = {}) => {
        let datas = []
        if (users.data) {
            let { TeamMember, OtherMember, ...owner } = users.data;
            if (Array.isArray(TeamMember)) {
                datas = [owner, ...TeamMember]
            }
            if (Array.isArray(OtherMember)) {
                datas = [owner, ...datas, ...OtherMember]
            }
        }
        var options = {
            shouldSort: true,
            threshold: 0.6,
            location: 0,
            distance: 100,
            maxPatternLength: 25,
            minMatchCharLength: 1,
            keys: [
                'UserName',
                'FullName',
                // 'Department',
                // 'JobTitle',
                // 'ManagerUserName',
                // 'ManagerFullName',
                // 'WorkLocation',
            ]
        };
        const fuse = new Fuse(datas, options)
        this.setState({
            fuse,
            users: datas
        })

    }
    handleUpdateInput = (value) => {
        const { fuse } = this.state;
        let datas = fuse.search(value).map(item => ({
            text: item.UserName,
            item,
            value: (
                <MenuItem
                    style={{ height: 10, padding: 0, margin: 0 }}
                    primaryText={<p
                        style={{ display: 'inline-block', height: '8', whiteSpace: 'nowrap', padding: '0px 16px 0px 0px', margin: 0 }}
                    >
                        <span style={{ display: 'inline-block', width: '100px', margin: '0x 5px', color: 'green' }}>
                            {item.UserName}
                        </span>
                        <span style={{ display: 'inline-block', width: '200px', margin: '0x 5px', }}>
                            {item.FullName}
                        </span>
                        <span>
                            {item.Department}
                        </span>
                    </p>}
                    secondaryText={item.WorkLocation}
                />
            )
        }))
        this.setState({ datas, value })
    }
    handleUpdateChange = (dataItem, index: number) => {
        const { onUpdateInput, value } = this.props;
        if (value && Array.isArray(value) && value.includes(dataItem.text)) {

        } else {
            let _text = dataItem.text || this.state.value;
            if (this.state.users.filter(item => item.UserName === _text).length) {
                this.setState({ adding: !1 });
                onUpdateInput && onUpdateInput(_text)
            }
        }
    }
    handleRequestDelete = name => () => {
        const { onDeleteItem } = this.props;
        onDeleteItem && onDeleteItem(name);
    }
    render() {
        const { value, floatingLabelText = '' } = this.props;
        let _value = Array.isArray(value) ? value : value ? [value] : [];
        return (
            <div style={{
                fontSize: 16,
                lineHeight: '24px',
                width: '100%',
                display: 'inline-block',
                position: 'relative',
                // transition: transitions.easeOut('200ms', 'height'),
                cursor: 'text'
            }} >
                <div>
                    {/* <TextFieldLabel
                        muiTheme={this.context.muiTheme}
                        style={{ top: 12 }}
                        shrinkStyle={{ transform: 'scale(0.75) translate(0, -36px)' }}
                        disabled={false}
                    >

                        {floatingLabelText}
                    </TextFieldLabel> */}
                    {/* <div style={{ marginTop: 40 }}>
                        {_value.map(user => {
                            return (
                                <Chip
                                    key={user}
                                    onRequestDelete={this.handleRequestDelete(user)}
                                    style={{
                                        margin: '8px 8px 0 0',
                                        float: 'left'
                                    }}
                                >
                                    {user}
                                </Chip>
                            )
                        })}

                        {
                            this.state.adding ?
                                <AutoComplete
                                    menuStyle={{ maxHeight: "300px", overflowY: 'auto' }}
                                    listStyle={{ width: '650' }}
                                    maxSearchResults={25}
                                    hintText="Ex:user_name"
                                    filter={() => true}
                                    dataSource={this.state.datas}
                                    onUpdateInput={this.handleUpdateInput}
                                    onNewRequest={this.handleUpdateChange}
                                /> :
                                <Button onClick={event => { event.preventDefault(); this.setState({ adding: true }) }} mini={true} style={{ marginTop: 3 }}>
                                    <ContentAdd />
                                </Button>
                        }
                    </div> */}
                </div>
            </div>
        )
    }
}
