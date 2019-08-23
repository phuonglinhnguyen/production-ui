import React from "react";
import { Toolbar, ToolbarGroup, ToolbarTitle } from "material-ui/Toolbar";
import RaisedButton from "material-ui/RaisedButton";
import CloseIcon from "material-ui/svg-icons/navigation/close";
import { Translate } from "react-redux-i18n";

export class DialogToolbar extends React.Component {
    shouldComponentUpdate = (nextProps, nextState) => {
    return this.props.username!==nextProps.username;
    }
    render() {
        const {
            username,
            background3Color,
            action_hidePopup
    } = this.props;

        return (
            <span style={{ cursor: "pointer" }} className="cursor">
                <Toolbar
                    style={{
                        height: 72,
                        backgroundColor: background3Color
                    }}
                >
                    <ToolbarGroup>
                        <ToolbarTitle text={`Working Detail: ${username}`} />
                    </ToolbarGroup>
                    <ToolbarGroup lastChild={true}>
                        <RaisedButton
                            style={{
                                minWidth: 40,
                                position: "absolute",
                                margin: 0,
                                top: 0,
                                left: 5
                            }}
                            primary={true}
                            tooltip={<Translate value="commons.action.close" />}
                            icon={<CloseIcon />}
                            onClick={action_hidePopup}
                        />
                    </ToolbarGroup>
                </Toolbar>
            </span>
        );
    }
}
export default DialogToolbar;
