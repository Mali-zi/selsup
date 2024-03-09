import { useState } from 'react';
import { Props } from '../utils/interfaces';
import EditModel from './EditModel';
import AddParam from './AddParam';

export default function EditParams(props: Props) {
  const [params, setParams] = useState(props.params);
  const [model, setModel] = useState({ ...props.model });
  const [paramsEditVisible, setParamsEditVisible] = useState(false);
  const [modelVisible, setModelVisible] = useState(false);
  const [showEditModel, setShowEditModel] = useState(false);
  const [showAddParam, setShowAddParam] = useState(false);


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
      {showEditModel ? <EditModel params={params} model={model} /> : <></>}
      {modelVisible ? <pre className='pre'>{JSON.stringify(model, null, 2)}</pre> : <></>}
      {showAddParam ? <AddParam setParams={setParams} setModel={setModel} /> : <></>}
    </div>
  );
}
