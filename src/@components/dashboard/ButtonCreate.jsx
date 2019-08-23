import * as  React from 'react'
import { Button } from '@material-ui/core'

export default class ButtonCreate extends React.PureComponent {
    state = {
        openMenu: false
    }
    handleOpenMenu = () => {
        this.setState({ openMenu: true })
    }
    handleRequestClose = () => {
        this.setState({
            openMenu: false,
        });
    };
    handleMenuAction = (key) => (event) => {
        const {
            onCreateProject,
            onCreateGroup
        } = this.props;
        this.handleRequestClose();
        switch (key) {
            case 'create_project':
                onCreateProject()
                break;
            case 'create_group':
                onCreateGroup()

                break;
            default:

                break;
        }
    }
    render() {

        return (
            <React.Fragment>
                <Button
                    style={{ margin: 8 }}
                    primary={true}
                    label='Create Group'
                    onClick={this.handleMenuAction('create_group')}
                />
            </React.Fragment>

        )
    }
}
