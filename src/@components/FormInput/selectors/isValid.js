// @flow
import createHasError from '../hasError'
import type { Structure, GetFormState } from '../types'
import type { IsValidInterface } from './isValid.types'

const createIsValid = (structure: Structure<*, *>) => {
  const { getIn, keys } = structure
  const hasError = createHasError(structure)
  return (
    form: string,
    getFormState: ?GetFormState,
    ignoreSubmitErrors: ?boolean = false
  ): IsValidInterface => (state: any) => {
    const nonNullGetFormState: GetFormState =
      getFormState || (state => getIn(state, 'form'))
    const formState = nonNullGetFormState(state)
    const syncError = getIn(formState, `${form}.syncError`)
    if (syncError) {
      return false
    }
    if (!ignoreSubmitErrors) {
      const error = getIn(formState, `${form}.error`)
      if (error) {
        return false
      }
    }
    const fieldErrors = getIn(formState, `${form}.fieldErrors`)
    const sectionErrors = getIn(formState, `${form}.sectionErrors`)
    const layoutErrors = ignoreSubmitErrors
      ? undefined
      : getIn(formState, `${form}.layoutErrors`)
    if (!fieldErrors && !sectionErrors && !layoutErrors) {
      return true
    }

    const registeredFields = getIn(formState, `${form}.registeredFields`)
    if (!registeredFields) {
      return true
    }

    return !keys(registeredFields)
      .filter(name => getIn(registeredFields, `['${name}'].count`) > 0)
      .some(name =>
        hasError(
          getIn(registeredFields, `['${name}']`),
          fieldErrors,
          sectionErrors,
          layoutErrors
        )
      )
  }
}

export default createIsValid
