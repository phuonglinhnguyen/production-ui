import React from 'react';
import Subheader from 'material-ui/Subheader';
class FieldValidationComponent extends React.Component {






    render() {

        const { field_validation, field } = this.props;
        const validation_result = field_validation.validations.find(item => item.row === field.row && item.name === field.name);
        const message = validation_result ? validation_result.message : '';

        return (


            <Subheader style={{ color: 'red', whiteSpace: 'pre-line', lineHeight: '' }}>{message}</Subheader>

        );
    }
}

export default FieldValidationComponent;