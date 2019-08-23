import React, { Component } from 'react';
import { Translate } from 'react-redux-i18n';
import Toggle from 'material-ui/Toggle';
export default class ControllView extends Component {
  render() {
    const { layout, actionView } = this.props;
    return (
      <div
        style={{
          position: 'absolute',
          top: -64,
          right: 460,
          padding: 10,
          zIndex: 2100,
          background: 'rgba(255,255,255,0.5)'
        }}
      >
        <Toggle
          label={<Translate value={layout.layout_lable} />}
          onToggle={e => actionView.changeLayout(layout)}
        />
        <Toggle
          label={<Translate value={layout.form_lable} />}
          onToggle={e => actionView.changeForm(layout)}
        />
      </div>
    );
  }
}
