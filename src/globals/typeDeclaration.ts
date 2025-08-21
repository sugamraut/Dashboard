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
  state:string;
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
  code?: any;
  permissions?: any;
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

export interface Role {
  id: number;
  name: string;
  guardName: string;
  displayName: string;
  isBranchUser: number;
  permission: Permission[];
}

export interface State {
  id: number;
  name: string;
  nameNp: string;
  image: string | null;
  code: string;
  nameCombined: string;
}

export interface UserProfile {
  name: string;
  username: string;
  email: string;
  password?: string;
  confirmPassword?: string;
  mobile?: string;
}


export interface Log {
  id: string;
  type: number;
  description: string;
  timestamp: string;
  createdDate:string
 
}

export interface LogsResponse {
  data: Log[];
  metaData:MetaData|null
  total: number;
}
export interface ActivityUser {
  name: string;
  username: string;
}

export interface ActivityLog {
  id: string;
  ip: string;
  type: number;
  description: string;
  createdDate: string;
  userAgent: string;
  user?: ActivityUser; 
}

export interface MetaData {
  page: number;
  rowsPerPage: number;
  sortBy: number;
  sortOrder: string;
  query: string;
  filters: Record<string, any>;
  total: number;
}

export interface ActivityResponse {
  data: ActivityLog[];
  metaData: MetaData | null;
  total: number;
}


export interface Setting {
  id: number;
  name: string;
  description: string;
  value: string;
}