import * as yup from 'yup';

export const schema = yup
  .object({
    name: yup
      .string()
      .min(3, 'Name must be at least 3 characters long')
      .max(10, 'Name must not be more than 10 characters long')
      .required('Name is required'),
    type: yup
      .string()
      .oneOf(['string', 'number', 'string[]'] as const)
      .required('Type is required'),
    init: yup
      .string()
      .required('Init is required'),
  })
  .required();
