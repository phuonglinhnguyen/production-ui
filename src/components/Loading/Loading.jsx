import React, { PureComponent } from "react";

import RefreshIndicator from "material-ui/RefreshIndicator";

class Loading extends PureComponent {
  componentWillMount() {
    const { beforeMount } = this.props;
    if (beforeMount) {
      beforeMount();
    }
  }

  render() {
    let style = this.props.style || {};

    return (
      <div
        style={{
          height: "calc(100vh - 68px)",
          display: "flex",
          flexWrap: "Wrap",
          alignItems: "center",
          justifyContent: "center",
          ...style
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

export default Loading;
