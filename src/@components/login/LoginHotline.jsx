import React from "react";

import Subheader from "material-ui/Subheader";

import hotlines from "../../resources/hotline";

class LoginHotLine extends React.PureComponent {
  render() {
    return (
      <div className="support">
        {hotlines.map((e, i) => (
          <div className="information" key={i}>
            <Subheader>
              <span className="group">{e.group_name}</span>
            </Subheader>
            <div>
              <i className="fa fa-envelope icon" aria-hidden="true" />
              <span className="content">{e.email}</span>
            </div>
            {e.hotline && (
              <div>
                <i className="fa fa-phone icon" aria-hidden="true" />
                <span className="content">{e.hotline}</span>
              </div>
            )}
            {e.hotline_2 && (
              <div>
                <i className="fa fa-phone icon" aria-hidden="true" />
                <span className="content">{e.hotline_2}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
}

export default LoginHotLine;
