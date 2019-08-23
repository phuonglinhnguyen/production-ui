import React from "react";

import RefreshIndicator from "material-ui/RefreshIndicator";

class ClassifyLoadingData extends React.Component {
  componentWillMount() {
    this.props.action_getDataDefinitionsForClassify(
      this.props.match.params.projectId
    );
  }

  render() {
    return (
      <div
        style={{
          ...this.props.style,
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <RefreshIndicator
          size={100}
          left={0}
          top={0}
          status="loading"
          style={{
            display: "inline-block",
            position: "relative"
          }}
        />
      </div>
    );
  }
}

export default ClassifyLoadingData;
