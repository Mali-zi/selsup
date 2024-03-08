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
  value: string;
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

