export type authItem = {
  username: string;
  password: string;
};
export type StateType = {
  id: number;
  name: string;
  nameNp: string;
  nameCombined: string;
};

export type DistrictType = {
  data: any;
  metaData: { total: number };
  id: number;
  name: string;
  nameNp: string;
  nameCombined: string;
  code: string;
  stateId: number;
  state: {
    id: number;
    name: string;
    nameNp: string;
    nameCombined: string;
  };
};

export interface City {
  id: number;
  name: string;
  nameNp: string;
  nameCombined: string;
  districtId: number;
  code: string | null;
  district: string;
  state:{
     id: number;
    name: string;
    nameNp: string;
    nameCombined: string;
  };
}

export interface Branch {
  id: number;
  name: string;
  nameNp: string;
  nameCombined: number;
  districtId: number;
  code: string | null;
  district: string;
  state: string;
  data?: any;
}

export interface Permission {
  label: string | undefined;
  id: number;
  name: string;
  guardName: string;
  group: string;
  displayName: string;
  displayNameNp: string;
}

export interface MetaData {
  page: number;
  rowsPerPage: number;
  sortBy: number;
  sortOrder: string;
  total: number;
}
