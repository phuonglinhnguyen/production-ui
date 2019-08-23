import React, { PureComponent } from "react";

import FlatButton from "material-ui/FlatButton";

import { Translate } from "react-redux-i18n";

class NotificationBar extends PureComponent {
  render() {
    const { notification_bar, actions } = this.props;
    const { show_bar, level, title, content } = notification_bar;

    if (!show_bar) {
      return null;
    }
    return (
      <div className={`notificationbar ${level}`}>
        <div className="border">
          <div className={`title`}>{title}</div>
          <div className="content cool_scroll">{content}</div>
          <FlatButton
            onClick={actions.hideNotificationBar}
            label={<Translate value="commons.actions.close" />}
            style={{ color: "black", float: "right" }}
          />
        </div>
      </div>
    );
  }
}

export default NotificationBar;
