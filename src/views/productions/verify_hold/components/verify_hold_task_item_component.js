import React from 'react';

import { Card, CardHeader, CardText } from 'material-ui/Card';

import { isEqual } from 'lodash';

class VerifyHoldTaskItem extends React.Component {
  shouldComponentUpdate(nextProps) {
    for (let key in nextProps) {
      if (nextProps.hasOwnProperty(key)) {
        if (
          !key.includes('action') &&
          !isEqual(nextProps[key], this.props[key])
        ) {
          return true;
        }
      }
    }
    return false;
  }

  renderInfo(title, value) {
    return (
      <div key={`${title}-${value}`} style={{ display: 'flex', maginTop: 10 }}>
        <div style={{ flex: '50%', textAlign: 'left', fontWeight: 500 }}>
          {title}
        </div>
        <div
          style={{
            flex: '1',
            textAlign: 'right',
            fontWeight: 400
          }}
        >
          {value}
        </div>
      </div>
    );
  }
  render() {
    const {
      // Translate,
      action_selectTask,
      is_selected,
      muiTheme,
      task,
      task_index
    } = this.props;

    const {
      primary1Color,
      alternateTextColor,
      background1Color,
      textColor,
      accent1Color
    } = muiTheme.palette;

    return (
      <Card
        zDepth={is_selected ? 2 : 0}
        style={{
          margin: 2,
          borderLeft: is_selected ? '4px solid' + primary1Color : null,
          backgroundColor: is_selected ? alternateTextColor : background1Color,
          cursor: 'pointer'
        }}
        onClick={() => action_selectTask(task_index)}
      >
        <CardHeader
          title={task.image_name}
          titleStyle={{
            fontSize: 20,
            wordBreak: 'break-all',
            color: task.is_wrong_line ? accent1Color : textColor
          }}
        >
          <CardText style={{ padding: 0 }}>
            {this.renderInfo('Batch name :', task.batch_name)}
            {this.renderInfo('Total section hold :', task.hold_data.length)}
            {this.renderInfo('Bad :', `${task.is_wrong_line || false}`)}
          </CardText>
        </CardHeader>
      </Card>
    );
  }
}

export default VerifyHoldTaskItem;
