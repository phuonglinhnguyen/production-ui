import React, { PureComponent } from "react";

import CircularProgress from "material-ui/CircularProgress";

class Loading extends PureComponent {

  render() {
    return (
      <div
        className="ajax-circle"        
      >
        <CircularProgress
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
