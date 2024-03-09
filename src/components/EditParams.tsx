import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { schema } from '../utils/Schema';
import { Props, IFormInput } from '../utils/interfaces';
import EditModel from './EditModel';

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
            const param = params.filter((param) => param.id === id)[0];
            if (param.type === 'string') {
              return {
                paramId: id,
                value: e.target.value.trim(),
              };
            }

            if (param.type === 'number') {
              const newValue = Number(e.target.value.trim());

              
              if (!isNaN(newValue)) {
                return {
                  paramId: id,
                  value: newValue,
                };
              } else {
                return {
                  paramId: id,
                  value: 'Ошибка!!!',
                };
              }
              
            }

            if (param.type === 'string[]') {
              return {
                paramId: id,
                value: e.target.value.split(',').map((item) => item.trim())
              };
            }

            return paramValue;
          } else {
            return paramValue;
          }
        });
        setModel((prev) => {
          return (
            { 
              ...prev, 
              paramValues: newParamValues }
          );
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

            if (param.type === 'string' || param.type === 'number') {
              return (
                <li key={paramValue.paramId} className='list-item'>
                  <div className='item'>{param.name}:</div>
                  <input
                    id={`name-${paramValue.paramId}`}
                    type='text'
                    className='item'
                    value={String(paramValue.value)}
                    onChange={(e) => handleChangeParamValue(e, paramValue.paramId)}
                  />
                </li>
              );
            }

            if (param.type === 'string[]' && Array.isArray(paramValue.value)) {
              return (
                <li key={paramValue.paramId} className='list-item'>
                  <div className='item'>{param.name}:</div>
                  <input
                    id={`name-${paramValue.paramId}`}
                    type='text'
                    className='item'
                    value={paramValue.value.join(', ')}
                    onChange={(e) => handleChangeParamValue(e, paramValue.paramId)}
                  />
                </li>
              );
            }
          });

          return items;
        }
      })}
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
      {showEditModel ? <EditModel params={params} model={model} /> : <></>}
      
      {modelVisible ? <pre className='pre'>{JSON.stringify(model, null, 2)}</pre> : <></>}
      {showAddParam ? addParamList : <></>}
    </div>
  );
}
