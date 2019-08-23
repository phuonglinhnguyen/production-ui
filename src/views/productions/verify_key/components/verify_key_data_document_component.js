import React from 'react';
import ReactDOM from 'react-dom';

import { Card, CardHeader } from 'material-ui/Card';

import Field from './verify_key_fields_component';

import ArrowDownIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-down';

import { Translate } from 'react-redux-i18n';

import _ from 'lodash';

class VerifyKeyDocument extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputHeight: 'calc(100vh - 196px)'
    };
  }

  componentDidMount() {
    let nodeStyle = null;
    if (this.refs['input-zone']) {
      nodeStyle = ReactDOM.findDOMNode(this.refs['input-zone']);
    }
    if (nodeStyle) {
      this.setState({
        inputHeight:
          window.innerHeight - nodeStyle.getBoundingClientRect().top - 20
      });
    }
  }

  shouldComponentUpdate(nextProps) {
    return !_.isEqual(this.props, nextProps);
  }

  render() {
    const {
      action_onBlurField,
      action_onFocusField,
      action_onKeyPressFocus,
      action_onModifyFieldValue,
      action_onSelectRecord,
      data_document = [],
      data_final = [{}],
      error_document,
      field_definitions,
      focus_details,
      is_empty_state,
      primary1Color,
      accent1Color
    } = this.props;
    const { inputHeight } = this.state;
    const { focus_record = 0 } = focus_details;
    const record_final = data_final[focus_record] || {};
    const record_document = data_document[focus_record] || {};
    const error_record = error_document[focus_record] || {};
    return (
      <div
        style={{
          height: 'calc(100vh - 130px)',
          overflowY: 'hidden',
          overflowX: 'hidden'
        }}
      >
        <CardHeader
          subtitle={
            <Translate
              value="productions.verify_key.verified_total"
              completed_amount={record_final.total_different || 0}
              fields_amount={record_final.total_fields || 0}
            />
          }
          subtitleColor={
            record_final.total_different === record_final.total_fields
              ? primary1Color
              : accent1Color
          }
          title={`Record ${focus_record + 1}/${data_document.length}`}
        />
        <div
          ref={'input-zone'}
          className="special_scroll"
          style={{
            height: inputHeight,
            overflowY: 'auto',
            overflowX: 'hidden'
          }}
        >
          {field_definitions &&
            field_definitions.length > 0 &&
            field_definitions.map((v, i) => {
              return (
                <Field
                  action_onBlurField={action_onBlurField}
                  action_onFocusField={action_onFocusField}
                  action_onKeyPressFocus={action_onKeyPressFocus}
                  action_onModifyFieldValue={action_onModifyFieldValue}
                  field={v}
                  field_value={record_document[v.name] || {}}
                  final_value={record_final[v.name] || ''}
                  field_error={error_record[v.name] || ''}
                  is_disabled={is_empty_state}
                  is_focus={
                    focus_details.focus_field_name === v.name && !is_empty_state
                  }
                  key={`${v.name}-${i}`}
                  record_index={focus_record}
                />
              );
            })}
          {data_document &&
            data_document.map((record, index) => {
              if (index === parseInt(focus_record, 10)) {
                return null;
              }
              return (
                <Card
                  key={`record-${index}`}
                  onExpandChange={() => {
                    action_onSelectRecord(index);
                  }}
                >
                  <CardHeader
                    key={`record-${index}-unselect`}
                    actAsExpander={true}
                    closeIcon={<ArrowDownIcon />}
                    openIcon={<ArrowDownIcon />}
                    showExpandableButton={true}
                    subtitleColor={
                      data_final[index].total_different ===
                      data_final[index].total_fields
                        ? primary1Color
                        : accent1Color
                    }
                    subtitle={
                      <Translate
                        value="productions.verify_key.verified_total"
                        completed_amount={
                          data_final[index].total_different || 0
                        }
                        fields_amount={data_final[index].total_fields || 0}
                      />
                    }
                    title={`Record ${index + 1}`}
                  />
                </Card>
              );
            })}
          {!is_empty_state && (
            <div
              style={{
                display: 'inlineBlock',
                height: 'calc(80vh)',
                position: 'relative',
                width: '100%'
              }}
            />
          )}
        </div>
      </div>
    );
  }
}

export default VerifyKeyDocument;
