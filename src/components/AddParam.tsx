import { useState } from 'react';
import { AddParamProps, IFormInput } from '../utils/interfaces';

export default function AddParam({ setParams, setModel, setShowAddParam }: AddParamProps) {
  const [formData, setFormData] = useState<IFormInput>({
    name: '',
    type: 'string',
    init: '',
  });
  const [dataError, setDataError] = useState({
    name: '',
    type: '',
    init: '',
  });
  const isFormValid = Object.values(dataError).every((error) => error === '');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setShowAddParam(false);
    const id = Date.now();
    let init: string | number | string[] = formData.init.trim();
    if (formData.type === 'number') {
      init = Number(formData.init.trim());
    }

    if (formData.type === 'string[]') {
      init = formData.init.split(',').map((item) => item.trim());
    }

    setParams((prev) => {
      return [
        ...prev,
        {
          id: id,
          name: formData.name,
          type: formData.type,
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
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formData.type === 'number' && name === 'init') {
      const newValue = Number(value.trim());
      if (isNaN(newValue)) {
        setDataError((prev) => {
          return {
            ...prev,
            init: 'Ошибка: значение должно быть числом.',
          };
        });
      } else {
        setDataError((prev) => {
          return {
            ...prev,
            init: '',
          };
        });
      }
    }
  };

  return (
    <>
      <h2>Добавить новый параметр</h2>
      <form onSubmit={handleSubmit} className='list'>
        <div className='list-item'>
          <label htmlFor='name' className='item'>
            Введите имя параметра
          </label>
          <div>
            <input
              id='name'
              name='name'
              type='text'
              className='item'
              value={formData.name}
              onChange={(e) => handleChange(e)}
            />
            <div className='text-danger'>{dataError.name.length > 0 && dataError.name}</div>
          </div>
        </div>

        <div className='list-item'>
          <label htmlFor='type' className='item'>
            Выберите тип параметра
          </label>
          <select id='type' name='type' className='item' value={formData.type} onChange={(e) => handleChange(e)}>
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
            {formData.type === 'number' && 'Введите числовое значение'}
            {formData.type === 'string' && 'Введите строковое значение'}
            {formData.type === 'string[]' && 'Введите значения через запятую'}
          </label>
          <div>
            <input
              id='init'
              name='init'
              type='text'
              className='item'
              value={formData.init}
              onChange={(e) => handleChange(e)}
            />
            <div className='text-danger'>{dataError.init.length > 0 && dataError.init}</div>
          </div>
        </div>

        <button type='submit' disabled={!isFormValid}>
          Сохранить
        </button>
      </form>
    </>
  );
}
