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

  const paramsList = params.map((param, index) => {
    const { id, name, type } = param;
    return (
      <li key={id}>
        <div className='input-wrapper'>
          <div className='form-label fw-semibold mb-1'>Тип параметра</div>
          <div>{type}</div>
          <label htmlFor={`name-${id}`} className='form-label'>
            Имя параметра
          </label>
          <input
            id={`name-${id}`}
            type='text'
            className=''
            value={name}
            onChange={(e) => handleChangeNameParam(e, index)}
          />
        </div>
      </li>
    );
  });

  const editModelList = Object.keys(model).map((key) => {
    const curKey = key as keyof typeof model;
    if (model[curKey] && curKey === 'paramValues') {
      const items = model[curKey].map((paramValue) => {
        const param = params.filter((p) => p.id === paramValue.paramId)[0];
        return (
          <li key={paramValue.paramId}>
            {param.name}
            <input
              id={`name-${paramValue.paramId}`}
              type='text'
              className=''
              value={paramValue.value}
              onChange={(e) => handleChangeParamValue(e, paramValue.paramId)}
            />
            {paramValue.value}
          </li>
        );
      });
      return items;
    }
  });

  const modelList = Object.keys(model).map((key) => {
    const curKey = key as keyof typeof model;
    if (model[curKey] && curKey === 'paramValues') {
      const items = model[curKey].map((paramValue) => {
        const param = params.filter((p) => p.id === paramValue.paramId)[0];
        return (
          <li key={paramValue.paramId}>
            {param.name}
            {paramValue.value}
          </li>
        );
      });
      return items;
    }
  });

  const addParamList = (
    <>
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
    </>
  );

  return (
    <div>
      <h1>Редактор параметров</h1>

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

      {paramsEditVisible ? <ul>{paramsList}</ul> : <></>}
      {showEditModel ? <ul>{editModelList}</ul> : <></>}
      {modelVisible ? <ul>{modelList}</ul> : <></>}
      {showAddParam ? addParamList : <></>}
    </div>
  );
}
