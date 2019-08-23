import React from 'react';

import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';
import { Step, Stepper, StepButton } from 'material-ui/Stepper';

import { isEqual } from 'lodash';

class StepComponent extends React.Component {
  shouldComponentUpdate(nextProps) {
    for (let key in nextProps) {
      if (
        !key.includes('action') &&
        !isEqual(nextProps[key], this.props[key])
      ) {
        return true;
      }
    }
    return false;
  }

  render() {
    const {
      action_selectStep,
      batch_selected,
      document_selected,
      step
    } = this.props;
    return (
      <Toolbar style={{ height: 72 }}>
        <ToolbarGroup>
          <Stepper
            linear={false}
            style={{ width: window.innerWidth - 20 }}
            activeStep={step}
          >
            <Step>
              <StepButton onClick={() => action_selectStep(0)}>
                {'Batches'}
              </StepButton>
            </Step>
            {step > 0 && (
              <Step>
                <StepButton onClick={() => action_selectStep(1)}>{`Batch: ${
                  batch_selected.batch_id
                }`}</StepButton>
              </Step>
            )}
            {step > 1 && (
              <Step>
                <StepButton>{`Document: ${document_selected.id}`}</StepButton>
              </Step>
            )}
          </Stepper>
        </ToolbarGroup>
      </Toolbar>
    );
  }
}

export default StepComponent;
