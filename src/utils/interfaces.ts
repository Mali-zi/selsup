export interface Props {
  params: Param[];
  model: Model;
}
export interface Param {
  id: number;
  name: string;
  type: 'string' | 'number' | 'string[]';
}
export interface ParamValue {
  paramId: number;
  value: string | number | string[];
}

export interface Model {
  paramValues: ParamValue[];
  colors?: string[];
}

export interface IFormInput {
  name: string;
  type: 'string' | 'number' | 'string[]';
  init: string;
}

export interface EditModelProps {
  params: Param[];
  model: Model;
  setModel: React.Dispatch<
    React.SetStateAction<{
      paramValues: ParamValue[];
      colors?: string[] | undefined;
    }>
  >;
  setShowEditModel: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface IError {
  id: number;
  err: string;
}

export interface AddParamProps {
  setParams: React.Dispatch<React.SetStateAction<Param[]>>;
  setModel: React.Dispatch<
    React.SetStateAction<{
      paramValues: ParamValue[];
      colors?: string[] | undefined;
    }>
  >;
  setShowAddParam: React.Dispatch<React.SetStateAction<boolean>>;
}
