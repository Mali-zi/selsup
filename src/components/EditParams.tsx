import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from '../utils/Schema';
import { Props, IFormInput } from '../utils/interfaces';

export default function EditParams(props: Props) {
  const [params, setParams] = useState(props.params);
  const [model, setModel] = useState({ ...props.model });
  const [paramsEditVisible, setParamsEditVisible] = useState(false);
  const [modelVisible, setModelVisible] = useState(false);
  const [showEditModel, setShowEditModel] = useState(false);
  const [showAddParam, setShowAddParam] = useState(false);

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
    setModelVisible((prev) => !prev);
    setParamsEditVisible(false);
    setShowEditModel(false);
    setShowAddParam(false);
  };

  const editModel = () => {
    setShowEditModel((prev) => !prev);
    setParamsEditVisible(false);
    setModelVisible(false);
    setShowAddParam(false);
  };

  const editParams = () => {
    setParamsEditVisible((prev) => !prev);
    setModelVisible(false);
    setShowAddParam(false);
    setShowEditModel(false);
  };

  const addParam = () => {
    setShowAddParam((prev) => !prev);
    setParamsEditVisible(false);
    setModelVisible(false);
    setShowEditModel(false);
  };

  const handleChangeNameParam = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newParams = params.map((param, i) => {
      if (i === index) {
        return {
          ...param,
          name: e.target.value,
        };
      } else {
        return param;
      }
    });

    setParams(newParams);
  };

  const handleChangeParamValue = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    Object.keys(model).map((key) => {
      const curKey = key as keyof typeof model;
      if (model[curKey] && curKey === 'paramValues') {
        const newParamValues = model[curKey].map((paramValue) => {
          if (paramValue.paramId === id) {
            return {
              paramId: id,
              value: e.target.value,
            };
          } else {
            return paramValue;
          }
        });
        setModel((prev) => {
          return { ...prev, paramValues: newParamValues };
        });
      }
    });
  };

  const paramsList = (
    <>
      <h2>Редактировать параметры</h2>
      <ul className='list'>
        {params.map((param, index) => {
          const { id, name, type } = param;
          return (
            <li key={id} className='list-item'>
              <div className='item'>Тип параметра: {type}</div>
              <label htmlFor={`name-${id}`} className='item'>
                Имя параметра:
              </label>
              <input
                id={`name-${id}`}
                type='text'
                className='item'
                value={name}
                onChange={(e) => handleChangeNameParam(e, index)}
              />
            </li>
          );
        })}
      </ul>
    </>
  );

  const editModelList = (
    <>
      <h2>Редактировать Model</h2>
      {Object.keys(model).map((key) => {
        const curKey = key as keyof typeof model;
        if (model[curKey] && curKey === 'paramValues') {
          const items = model[curKey].map((paramValue) => {
            const param = params.filter((p) => p.id === paramValue.paramId)[0];
            return (
              <li key={paramValue.paramId} className='list-item'>
                <div className='item'>{param.name}:</div>
                <input
                  id={`name-${paramValue.paramId}`}
                  type='text'
                  className='item'
                  value={paramValue.value}
                  onChange={(e) => handleChangeParamValue(e, paramValue.paramId)}
                />
              </li>
            );
          });
          return items;
        }
      })}
    </>
  );

  const modelList = (
    <>
      <h2>Структура Model</h2>
      <ul className='list'>
        {Object.keys(model).map((key) => {
          const curKey = key as keyof typeof model;
          if (model[curKey] && curKey === 'paramValues') {
            const items = model[curKey].map((paramValue) => {
              const param = params.filter((p) => p.id === paramValue.paramId)[0];
              return (
                <li key={paramValue.paramId} className='list-item'>
                  <div className='item'>{param.name}:</div>
                  <div className='item'>{paramValue.value}</div>
                </li>
              );
            });
            return items;
          }
        })}
      </ul>
    </>
  );

  const addParamList = (
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
  );

  return (
    <div className='main'>
      <h1>Редактор параметров</h1>

      <div className='buttons'>
        <button type='button' onClick={getModel}>
          {modelVisible ? 'Закрыть' : 'Показать Model'}
        </button>
        <button type='button' onClick={editModel}>
          {showEditModel ? 'Закрыть' : 'Редактировать Model'}
        </button>
        <button type='button' onClick={editParams}>
          {!paramsEditVisible ? 'Редактировать параметры' : 'Закрыть'}
        </button>
        <button type='button' onClick={addParam}>
          {!showAddParam ? 'Добавить параметр' : 'Закрыть'}
        </button>
      </div>

      {paramsEditVisible ? paramsList : <></>}
      {showEditModel ? editModelList : <></>}
      {modelVisible ? modelList : <></>}
      {showAddParam ? addParamList : <></>}
    </div>
  );
}
