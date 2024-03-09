import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from '../utils/Schema';
import { IFormInput, Param, ParamValue } from '../utils/interfaces';

export interface AddParamProps {
  setParams: React.Dispatch<React.SetStateAction<Param[]>>;
  setModel: React.Dispatch<React.SetStateAction<{
    paramValues: ParamValue[];
    colors?: string[] | undefined;
}>>;
}

export default function AddParam({setParams, setModel}: AddParamProps) {
  const { register, handleSubmit, reset, formState } = useForm<IFormInput>({
    defaultValues: {
      name: '',
      type: 'string',
      init: '',
    },
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const [isDisabled, setIsDisabled] = useState(true);

  const onSubmit = (data: IFormInput): void => {
    const id = Date.now();
    let init: string | number | string[] = data.init.trim();
    if (data.type === 'number') {
      init = Number(data.init.trim());
    }

    if (data.type === 'string[]') {
      init = data.init.split(',').map((item) => item.trim());
    }

    setParams((prev) => {
      return [
        ...prev,
        {
          id: id,
          name: data.name,
          type: data.type,
        },
      ];
    });
    setModel((prev) => {
      const newParamValues = [
        ...prev.paramValues,
        {
          paramId: id,
          value: init,
        },
      ];
      return {
        ...prev,
        paramValues: newParamValues,
      };
    });
    reset();
  };

  useEffect(() => {
    if (formState.isValid) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [formState]);

  return (
    <>
      <h2>Добавить новый параметр</h2>
      <form onSubmit={handleSubmit(onSubmit)} className='list'>
        <div className='list-item'>
          <label htmlFor='name' className='item'>
            Введите имя параметра
          </label>
          <div>
            <input id='name' type='text' className='item' {...register('name')} />
            <div className='text-danger'>{formState.errors.name && formState.errors.name.message}</div>
          </div>
        </div>

        <div className='list-item'>
          <label htmlFor='type' className='item'>
            Выберите тип параметра
          </label>
          <select id='type' className='item' {...register('type')}>
            <option value='' disabled className='select-item'>
              Please Select...
            </option>
            <option value='string' className='select-item'>
              string
            </option>
            <option value='number' className='select-item'>
              number
            </option>
            <option value='string[]' className='select-item'>
              string[]
            </option>
          </select>
        </div>

        <div className='list-item'>
          <label htmlFor='init' className='item'>
            Введите значение параметра
          </label>
          <div>
            <input id='init' type='text' className='item' {...register('init')} />
            <div className='text-danger'>{formState.errors.init && formState.errors.init.message}</div>
          </div>
        </div>

        <button type='submit' className='btn btn-primary mb-3' disabled={isDisabled}>
          Сохранить
        </button>
      </form>
    </>
  )
}
