const getErrorKeys = (name, type) => {
    switch (type) {
      case 'Field':
        return [name, `${name}._error`]
      case 'FieldArray':
        return [`${name}._error`]
      default:
        throw new Error('Unknown field type')
    }
  }

const createHasError = ({ getIn }) => {
    const hasError = (
        field,
        fieldErrors: any,
        sectionErrors: any,
        layoutError: any,
     ) =>{
        if (!fieldErrors && !sectionErrors && !layoutError) {
            return false
          }
          const name = getIn(field, 'name')
          const type = getIn(field, 'type')
          return getErrorKeys(name, type).some(
            key =>
              getIn(fieldErrors, key) ||
              getIn(sectionErrors, key) ||
              getIn(layoutError, key)
          )
        }
        return hasError
     } 
 }

 export default createHasError
