import React from "react";
import ReactDOM from "react-dom";

import Avatar from "material-ui/Avatar";
import Chip from "material-ui/Chip";

import _ from "lodash";

const styles = {
  chip: {
    margin: 4
  }
};

class ChipList extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return !_.isEqual(this.props, nextProps);
  }

  componentDidUpdate() {
    const index = this.props.index_selected_layout_definition;
    if (index > -1) {
      const node = ReactDOM.findDOMNode(this.refs[`chip_${index}`]);
      if (node) {
        node.scrollIntoView({
          block: "end",
          behavior: "smooth"
        });
      }
    }
  }

  handleTouchTap(i) {
    this.props.action_selectLayoutDefinition(this.props.layout_definitions[i]);
  }

  render() {
    const {
      primary1Color,
      selected_layout_definition,
      layout_definitions
    } = this.props;
    
    return (
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {layout_definitions.map((data, i) => {
          if (data.hidden) {
            return null;
          }
          if (
            selected_layout_definition &&
            selected_layout_definition.id === data.id
          ) {
            return (
              <Chip
                key={i}
                ref={`chip_${i}`}
                style={styles.chip}
                onClick={() => this.handleTouchTap(i)}
              >
                <Avatar size={32} backgroundColor={primary1Color}>
                  {data.hot_key}
                </Avatar>
                {data.name}
              </Chip>
            );
          }

          return (
            <Chip
              key={i}
              ref={`chip_${i}`}
              style={styles.chip}
              onClick={() => this.handleTouchTap(i)}
            >
              <Avatar size={32}>{data.hot_key}</Avatar>
              {data.name}
            </Chip>
          );
        })}
      </div>
    );
  }
}
export default ChipList;
