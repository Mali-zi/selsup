import React, { useState } from 'react';
import { IError, Props } from '../utils/interfaces';

export default function EditModel(props: Props) {
  const [formData, setFormData] = useState(props.model);
  const initErrors = props.params.map((param) => {
    return (
      {
        id: param.id,
        err: '',
      }
    )
  })
  const [formErrors, setFormErrors] = useState<IError[]>(initErrors);
  const [model, setModel] = useState(props.model);
  const isFormValid = Object.values(formErrors).every((formError) => formError.err === '');
  console.log('isFormValid', isFormValid);

  const handleChangeParamValue = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    Object.keys(formData).map((key) => {
      const curKey = key as keyof typeof formData;
      if (formData[curKey] && curKey === 'paramValues') {
        const newParamValues = formData[curKey].map((paramValue) => {
          if (paramValue.paramId === id) {
            const param = props.params.filter((param) => param.id === id)[0];
            if (param.type === 'string[]') {
              return {
                paramId: id,
                value: e.target.value.split(',').map((item) => item.trim()),
              };
            } else {
              if (param.type === 'number') {
                const newValue = Number(e.target.value.trim());
                const filterFormError = formErrors.filter((formError) => formError.id !== id);

                if (isNaN(newValue)) {
                  setFormErrors([
                    ...filterFormError,
                    {
                      id: id,
                      err: 'Ошибка: значение должно быть числом.',
                    },
                  ]);
                } else {
                  setFormErrors([
                    ...filterFormError,
                    {
                      id: id,
                      err: '',
                    },
                  ]);
                }
              }

              return {
                paramId: id,
                value: e.target.value.trim(),
              };
            }
          } else {
            return paramValue;
          }
        });
        setFormData((prev) => {
          return {
            ...prev,
            paramValues: newParamValues,
          };
        });
      }
    });

  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted successfully!');

    setModel((prev) => {
      return {
        ...prev,
        formData,
      };
    });
  };

  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <h2>Редактировать Model</h2>
      {Object.keys(formData).map((key) => {
        const curKey = key as keyof typeof formData;
        if (formData[curKey] && curKey === 'paramValues') {
          const items = formData[curKey].map((paramValue) => {
            const param = props.params.filter((p) => p.id === paramValue.paramId)[0];
            const formError = formErrors.filter((a) => a.id === paramValue.paramId)[0];

            return (
              <li key={paramValue.paramId} className='list-item'>
                <label htmlFor={`${paramValue.paramId}`} className='item'>
                  {param.name}:
                </label>
                <input
                  id={`${paramValue.paramId}`}
                  type='text'
                  name={`${paramValue.paramId}`}
                  className='item'
                  value={
                    param.type === 'string[]' && Array.isArray(paramValue.value)
                      ? paramValue.value.join(', ')
                      : paramValue.value
                  }
                  onChange={(e) => handleChangeParamValue(e, paramValue.paramId)}
                />
                {param.type === 'number' && formError && formError.err.length > 0 && (
                  <p className='error'>{formError.err}</p>
                )}
              </li>
            );
          });

          return <ul>{items}</ul>;
        }
      })}

      <button type='submit' disabled={!isFormValid}>
        Submit
      </button>
    </form>
  );
}
