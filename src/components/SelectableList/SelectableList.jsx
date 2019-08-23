import React from "react";
import PropTypes from "prop-types";

export default function wrapState(ComposedComponent) {
  return class SelectableList extends React.Component {
    static propTypes = {
      children: PropTypes.node.isRequired,
      defaultValue: PropTypes.number.isRequired
    };

    componentWillMount() {
      this.setState({
        style: this.props.style,
        selectedIndex: this.props.defaultValue
      });
    }

    componentWillReceiveProps(nextProps) {
      if (this.props.selectedIndex !== nextProps.defaultValue) {
        this.setState({
          selectedIndex: nextProps.defaultValue
        });
      }
    }

    handleRequestChange = (event, index) => {
      this.setState({
        selectedIndex: index
      });

      const handleRequestChange = this.props.handleRequestChange;
      if (handleRequestChange) {
          handleRequestChange(index);
      }
    };

    render() {
      return (
        <ComposedComponent
          style={this.state.style}
          value={this.state.selectedIndex}
          onChange={this.handleRequestChange}
        >
          {this.props.children}
        </ComposedComponent>
      );
    }
  };
}
