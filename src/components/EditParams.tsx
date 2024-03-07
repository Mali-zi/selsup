import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from '../utils/Schema';
import { Props, IFormInput, Param } from '../utils/interfaces';

export default function EditParams(props: Props) {
  console.log('params', props);

  const [params, setParams] = useState(props.params);
  const [model, setModel] = useState({ ...props.model });
  const [paramsEditVisible, setParamsEditVisible] = useState(false);

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
  };

  const editModel = () => {
    console.log('editModel');
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const filterParams = params.filter((a) => a.id !== id);
    const param = params.filter((a) => a.id === id)[0];
      setParams([...filterParams, 
        { ...param, name: e.target.value }
      ]);
  };

  const handleChangeType = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setParams({
      ...params,
      [e.target.name]: e.target.value,
    });
  };

  const paramsList = params.map((param) => {
    const { id, name, type } = param;

    return (
      <li key={id}>
        <div className='input-wrapper'>
          <label htmlFor={`name-${id}`} className='form-label'>
            Имя параметра
          </label>
          <input id={`name-${id}`} type='text' className='' value={name} onChange={(e) => handleChangeName(e, id)} />
        </div>
        <div className='input-wrapper'>
          <label htmlFor={`type-${param.id}`} className='form-label fw-semibold mb-1'>
            Тип параметра
          </label>
          <select id={`type-${id}`} className='form-control' value={type} onChange={(e) => handleChangeType(e)}>
            <option value='' disabled>
              Please Select...
            </option>
            <option value='string'>string</option>
            <option value='number'>number</option>
            <option value='string[]'>string[]</option>
          </select>
        </div>
      </li>
    );
  });

  return (
    <div>
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
      <button type='button' onClick={() => setParamsEditVisible((prev) => !prev)}>
        {paramsEditVisible ? 'Редактировать параметры' : 'Закрыть редактирование'}
      </button>

      {!paramsEditVisible ? (
        <section className='container vh-100 position-relative'>
          <h2 className='text-primary text-center mt-3'>Редактировать параметры</h2>
          <ul>{paramsList}</ul>
        </section>
      ) : (
        <></>
      )}
    </div>
  );
}
