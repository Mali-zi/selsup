import './App.css';
import EditParams from './components/EditParams';
import { Model, Param } from './utils/interfaces';

function App() {
  const params = [
    {
      id: 1,
      name: 'Назначение',
      type: 'string',
    },
    {
      id: 2,
      name: 'Длина',
      type: 'number',
    },
  ] as Param[];

  const model = {
    paramValues: [
      {
        paramId: 1,
        value: 'повседневное',
      },
      {
        paramId: 2,
        value: 'макси',
      },
    ],
  } as Model;

  const props = {
    params: params,
    model: model,
  };

  return (
    <div>
      <EditParams params={params} model={model} />
    </div>
  );
}

export default App;
