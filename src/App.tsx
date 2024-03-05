import { useEffect, useState } from 'react';
import './App.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from './utils/Schema';

enum ParamType {
  String = 'string',
  Number = 'number',
  Select = 'select',
}

interface Param {
  id: number;
  name: string;
  type: ParamType;
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Model {
  paramValues: ParamValue[];
}

interface Props {
  params: Param[];
  model: Model;
}

function App() {
  const params = [
    { id: 1, name: 'Назначение', type: ParamType.String },
    { id: 2, name: 'Длина', type: ParamType.Number },
    { id: 3, name: 'Качество', type: ParamType.Select },
  ];

  const model = {
    paramValues: [
      { paramId: 1, value: 'Повседневное' },
      { paramId: 2, value: 'Миди' },
      { paramId: 3, value: 'Среднее' },
    ],
  };

  interface IFormInput {
    name: string;
    type: NonNullable<"string" | "number" | "string[]">;
    init: string;
  }

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
    console.log('data', data);
    reset();
  };

  useEffect(() => {
    if (formState.isValid) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [formState]);

  const getModel = () => {
    console.log('Model');
  }

  const editModel = () => {
    console.log('editModel');
  }

  return (
    <>
      <h1>Редактор параметров</h1>
      <section className='container vh-100 position-relative'>
        <h2 className='text-primary text-center mt-3'>Добавить новый параметр</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className='input-wrapper'>
            <label htmlFor='name' className='form-label fw-semibold mb-1'>
              Введите имя параметра
            </label>
            <input id='name' type='text' className='form-control' {...register('name')} />
            <div className='form-text text-danger'>{formState.errors.name && formState.errors.name.message}</div>
          </div>

          <div className='input-wrapper'>
            <label htmlFor='type' className='form-label fw-semibold mb-1'>
              Выберите тип параметра
            </label>
            <select id='type' className='form-control' {...register('type')}>
              <option value='' disabled>
                Please Select...
              </option>
              <option value='string'>string</option>
              <option value='number'>number</option>
              <option value='string[]'>string[]</option>
            </select>
          </div>

          <div className='input-wrapper'>
            <label htmlFor='init' className='form-label fw-semibold mb-1'>
              Введите значение параметра
            </label>
            <input id='init' type='text' className='form-control' {...register('init')} />
            <div className='form-text text-danger'>{formState.errors.init && formState.errors.init.message}</div>
          </div>

          <div className='text-center'>
            <input type='submit' value='Сохранить' className='btn btn-primary mb-3' disabled={isDisabled} />
          </div>
        </form>
      </section>

      <button type='button' onClick={getModel}>
        Показать Model
      </button>
      <button type='button' onClick={editModel}>
        Редактировать Model
      </button>
    </>
  );
}

export default App;
