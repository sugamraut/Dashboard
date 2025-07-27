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
  id: number;
  name: string;
  nameNp: string;
  nameCombined: string;
  code: string;
  cbsCode: string;
  state: StateType;
  stateId: number;
};

// export type getDistricts = DistrictType[];
