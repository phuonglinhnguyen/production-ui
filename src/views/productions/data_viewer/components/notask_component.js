import React from 'react';

import InfoIcon from 'material-ui/svg-icons/action/info-outline';

class NoTaskComponent extends React.Component {
  render() {
    return (
      <div
        style={{
          height: window.innerHeight - 136,
          width: window.innerWidth,
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <div>
          <InfoIcon
            style={{ height: 150, width: 150 }}
            color="rgba(0, 0, 0, 0.51)"
          />
          <div
            style={{
              textAlign: 'center',
              fontSize: 'x-large',
              fontWeight: 600,
              color: 'rgba(0, 0, 0, 0.51)'
            }}
          >
            {'NO TASKS YET'}
          </div>
        </div>
      </div>
    );
  }
}

export default NoTaskComponent;
