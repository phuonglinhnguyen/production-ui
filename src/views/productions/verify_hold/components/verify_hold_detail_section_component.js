import React from 'react';

import ReactJson from 'react-json-view';

import TextField from 'material-ui/TextField';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';

import { isEqual } from 'lodash';

class VerifyHoldSection extends React.Component {
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

  render() {
    const {
      Translate,
      action_modifyComment,
      comment = '',
      data_document,
      hold_count,
      is_error,
      lead_comment = '',
      primary1Color,
      reason,
      section_index,
      title,
      user
    } = this.props;
    const errorText = is_error ? (
      <Translate value={'productions.verify_hold.error_comment'} />
    ) : (
      ''
    );

    const show_comment = comment.replace(/#EOL#/g, '\n');

    return (
      <Card
        initiallyExpanded={true}
        style={{
          margin: 5,
          border: reason === 'WLN' ? '4px solid' + primary1Color : null
        }}
      >
        <CardHeader
          actAsExpander={true}
          showExpandableButton={true}
          avatar={<Avatar backgroundColor={primary1Color}>{hold_count}</Avatar>}
          subtitle={`Keyer : ${user}`}
          title={title}
        />
        <CardText expandable={true}>
          <TextField
            floatingLabelText={<Translate value={'productions.verify_hold.user_comment'} />}
            fullWidth={true}
            multiLine={true}
            value={show_comment}
          />
          {is_error ? (
            <TextField
              autoFocus
              errorText={errorText}
              floatingLabelText={<Translate value={'productions.verify_hold.your_comment'} />}
              fullWidth={true}
              onChange={e =>
                action_modifyComment(section_index, e.target.value)
              }
              style={{ marginBottom: 20 }}
              value={lead_comment || ''}
            />
          ) : (
            <TextField
              floatingLabelText={<Translate value={'productions.verify_hold.your_comment'} />}
              fullWidth={true}
              onChange={e =>
                action_modifyComment(section_index, e.target.value)
              }
              style={{ marginBottom: 20 }}
              value={lead_comment || ''}
            />
          )}
          <ReactJson
            collapsed={true}
            name="Data"
            src={data_document || []}
            displayDataTypes={false}
          />
        </CardText>
      </Card>
    );
  }
}

export default VerifyHoldSection;
