import React from "react";

import RaisedButton from "material-ui/RaisedButton";
import CircularProgress from "material-ui/CircularProgress";
import Checkbox from "material-ui/Checkbox";
import Popover, { PopoverAnimationVertical } from "material-ui/Popover";
import Menu from "material-ui/Menu";
import MenuItem from "material-ui/MenuItem";

import _ from "lodash";

import { Translate } from "react-redux-i18n";

class VerifyQcButtonActions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  handleKeyDown(event) {
    if (event.altKey && event.keyCode === 83) {
      //crtl + S
      const { is_disabled, is_saving, saveTask } = this.props;

      if (!is_disabled && !is_saving) {
        saveTask();
      }

      event.preventDefault();
    }
  }

  componentWillMount() {
    window.addEventListener("keydown", this.handleKeyDown);
  }

  componentWillUnmount() {
    window.removeEventListener("keydown", this.handleKeyDown);
  }

  handleTouchTap = event => {
    // This prevents ghost click.
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

  render() {
    const {
      is_disabled,
      is_saving,
      next,
      tabIndexSubmit,
      reasons,
      viewQcError,
      updateNextTask,
      saveTask,
      saveTaskWithReason
    } = this.props;
    const { open, anchorEl } = this.state;

    if (is_saving) {
      return (
        <RaisedButton
          secondary={true}
          fullWidth={true}
          label={<Translate value={"productions.classify.saving"} />}
          icon={<CircularProgress size={25} />}
        />
      );
    }

    let reasons_length = 0;
    if (reasons) {
      reasons_length = reasons.length;
    }

    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: 8
        }}
      >
        <div >
          <Checkbox
            labelStyle={{ width: 'auto' }}
            checked={next}
            onCheck={() => updateNextTask()}

            label={<Translate value={"productions.common.get_next_task"} />}
          />
        </div>
        {reasons_length > 0 && (
          <div style={{ paddingRight: 15 }}>
            <RaisedButton
              disabled={is_disabled}
              label={
                <Translate value={"productions.common.save_with_reason"} />
              }
              fullWidth={true}
              onClick={this.handleTouchTap}
            />
            <Popover
              open={open}
              anchorEl={anchorEl}
              onRequestClose={this.handleRequestClose}
              animation={PopoverAnimationVertical}
            >
              <Menu>
                {reasons.map((option, i) => (
                  <MenuItem
                    key={i}
                    primaryText={option.label}
                    onClick={() => {
                      this.setState({ open: false });
                      saveTaskWithReason(option);
                    }}
                  />
                ))}
              </Menu>
            </Popover>
          </div>
        )}
        <div style={{ paddingLeft: 15 }}>
          <RaisedButton
            ref='btn_view_error'
            disabled={is_disabled}
            label={<Translate value={"productions.qc.view_error"} />}
            primary={true}
            fullWidth={true}
            onClick={viewQcError}
          />
        </div>
        <div style={{ paddingLeft: 15 }}>
          <RaisedButton
            ref='btn_submit'
            disabled={is_disabled}
            label={<Translate value={"productions.common.save"} />}
            secondary={true}
            fullWidth={true}
            onClick={saveTask}
            tabIndex={tabIndexSubmit}
          />
        </div>
      </div>
    );
  }
}

export default VerifyQcButtonActions;
