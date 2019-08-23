import React from "react";

import Checkbox from "material-ui/Checkbox/Checkbox";

import { isEqual } from "lodash";

class CheckBoxTableComponent extends React.Component {

  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps.checked, this.props.checked) || !isEqual(nextProps.data, this.props.data);
  }
  render() {
    const { action_selectCheckbox, checked = false, data } = this.props;
    return (
      <Checkbox checked={checked} onCheck={() => action_selectCheckbox(data)} />
    );
  }
}

export default CheckBoxTableComponent;
