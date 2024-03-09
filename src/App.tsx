import './App.css';
import './components/EditParams.css';
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
      type: 'string',
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

  return <EditParams params={params} model={model} />;
}

export default App;
