/**
 * This hook is to solved the display problem of the error
 *
 */

import type { FormikProps } from 'formik';

// Generic <T> hook to handle custom events with Formik
function useCustomEvents<T>(formikProps: FormikProps<T>) {
  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const elementName = e.currentTarget.getAttribute('name') ?? '';
    formikProps.setFieldError(elementName, '');
    formikProps.handleChange(e);
  };

  // TODO: add more custom events for Select, Checkbox, Radio, etc.

  return { onInputChange };
}

export { useCustomEvents };
