export type authItem = {
    username: string;
    password: string
}
export type StateType = {
  id: number;
  name: string;
  nameNp: string;
  nameCombined: string;
};

export type DistrictType = {
  data: any;
  metaData: { total: number; };
  id: number;
  name: string;
  nameNp: string;
  nameCombined: string;
  code: string;
  stateId: number;
  state:StateType
};

