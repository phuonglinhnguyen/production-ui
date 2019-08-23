import * as React from 'react';

import {
    Button,
    Checkbox,
    Popover,
    MenuList,
    MenuItem,
    CircularProgress
} from '@material-ui/core'
import _ from 'lodash';
import {  MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { Translate } from 'react-redux-i18n';
import { darkBlack } from 'material-ui/styles/colors';
import InfoTask from './InfoTask';
import ToolbarForm from './ToolbarForm';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import amber from '@material-ui/core/colors/amber';
const theme = createMuiTheme({
    palette: {
      primary: amber,
    }
  });
class QuickAccess extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    handleKeyDown(event) {
        if (event.altKey && event.keyCode === 83) {
            const { is_disabled, is_saving, saveTask } = this.props;
            if (!is_disabled && !is_saving) {
                saveTask();
            }
            event.preventDefault();
        }
    }
    componentWillMount() {
        window.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown);
    }

    handleTouchTap = event => {
        event.preventDefault();
        this.setState({
            open: true,
            anchorEl: event.currentTarget
        });
    };
    handleRequestClose = () => {
        this.setState({
            open: false
        });
    };
    shouldComponentUpdate(nextProps, nextState) {
        return (
            !_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)
        );
    }
    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.focusSubmit && this.props.focusSubmit) {
            this._focusSubmit()
        }
    }
    render() {
        const {
            is_disabled,
            is_saving,
            next,
            reasons,
            updateNextTask,
            saveTask,
            pauseTask,
            saveTaskWithReason,
            enableViewError = false,
            input_data,
            onViewError = () => { },
            children
        } = this.props;
        const { open, anchorEl } = this.state;
        if (is_saving) {
            return (
                <Button
                    variant="contained" color="secondary"
                    fullWidth={true}
                >
                    <CircularProgress size={25} />
                    <Translate value={'productions.classify.saving'} />
                </Button>
            );
        }
        let reasons_length = 0;
        if (reasons) {
            reasons_length = reasons.length;
        }
        return (
            <div style={{ width: "100%" }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <div style={{ flex: 1, marginLeft: 14 }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={next}
                                    onChange={() => updateNextTask(!next)}
                                />
                            }
                            label={<Translate value={'productions.common.next'} />}
                        />
                    </div>
                    {enableViewError && (
                        <div style={{ flex: 2 }}>
                            <Button
                                variant="contained"
                                disabled={is_disabled}
                                onClick={() => onViewError()}
                            >
                                <Translate value={'productions.common.view_error'} />
                            </Button>
                        </div>
                    )}
                    {reasons_length > 0 && (
                        <div style={{ flex: 2, paddingRight: 2 }}>
                            <Button
                                variant="contained"
                                disabled={is_disabled}
                                fullWidth={true}
                                onClick={this.handleTouchTap}
                            >
                                <Translate value={'productions.common.save_with_reason'} />
                            </Button>
                            <Popover
                                open={open}
                                anchorEl={anchorEl}
                                onClose={this.handleRequestClose}
                                anchorOrigin={{
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                }}
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'left',
                                }}
                            >
                                <MenuList style={{ width: anchorEl ? anchorEl.clientWidth : '100%' }}>
                                    {reasons.map((option, i) => (
                                        <MenuItem

                                            key={i}
                                            onClick={() => {
                                                this.setState({ open: false });
                                                saveTaskWithReason(option);
                                            }}
                                        >
                                            {option.label}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </Popover>
                        </div>
                    )}
                    <div style={{ flex: reasons_length > 0 ? 1 : 2, paddingLeft: 2 }}>
                        <MuiThemeProvider theme={theme}>
                            <Button
                                action={({ focusVisible }) => {
                                    this._focusSubmit = focusVisible;
                                }}
                                disabled={is_disabled}
                                variant="contained" color="primary"
                                fullWidth={true}
                                onClick={pauseTask}
                            >
                                <Translate value={'productions.common.pause'} />
                            </Button>
                        </MuiThemeProvider>
                    </div>
                    <div style={{ flex: reasons_length > 0 ? 1 : 2, paddingLeft: 2 }}>
                        <Button
                            action={({ focusVisible }) => {
                                this._focusSubmit = focusVisible;
                            }}
                            disabled={is_disabled}
                            variant="contained" color="secondary"
                            fullWidth={true}
                            onClick={saveTask}
                        >
                            <Translate value={'productions.common.save'} />
                        </Button>
                    </div>
                    {children}
                </div>
                <ToolbarForm />
                <InfoTask batchName={input_data.batch_id} docName={input_data.docId} />
            </div>
        );
    }
}

export default QuickAccess;
