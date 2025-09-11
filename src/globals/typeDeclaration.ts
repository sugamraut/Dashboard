export interface authItem {
  username?: string;
  password?: string;
}
export interface StateType {
  id: number;
  name: string;
  nameNp: string;
  nameCombined: string;
}

export interface DistrictType extends StateType {
  stateId: number;
  state: StateType;
}

export interface City extends StateType {
  districtId: number;
  code: string | null;
  district: string;
  state: string;
}

export interface Branch extends City {
  id: number;
  name: string;
  nameNp: string;
  nameCombined: string;
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

export interface Role {
  id: number;
  name: string;
  guardName: string;
  displayName: string;
  isBranchUser: boolean;
  permission: string[];
}

export interface State extends StateType {
  image: string | null;
  code: string;
}

export interface UserProfile extends authItem {
  id: number;
  name: string;
  mobile?: string;
  mobilenumber?: string;
  email: string;
  gender?: string;
  role?: string;
  confirmPassword?: string;
}

export interface Log {
  id: string;
  type: number;
  description: string;
  timestamp: string;
  createdDate: string;
  total:number
}

// export interface LogsResponse {
//   data: Log[];
//   total: number;
// }
// export interface ActivityUser {
//   name: string;
//   username: string;
//   roles: [];
// }

// export interface ActivityLog extends Log {
//   ip: string;
//   userAgent: string;
//   user?: ActivityUser;
// }
export interface ActivityUser {
  name: string;
  username: string;
  roles: []; 
}

export interface ActivityLog extends Log {
  ip: string;
  userAgent: string;
  user?: ActivityUser;
}

export interface ActivityResponse {
  data: ActivityLog[];
  total: number;
}

export interface Setting {
  id?: number;
  name: string;
  description?: string;
  value: string;
}
export interface AccountType {
  originalName: string | undefined;
  id: number;
  title: string;
  code?: string;
  description?: string;
  interest?: string;
  minBalance?: string;
  imageUrl?: string;
}

export interface dashboardData {
  title: string;
  count: number;
  changeValue: number;
  color: any;
}
export interface OnlineAccount {
  firstname: string;
  middleName: string;
  lastName: string;
  gender: string;
  id: number;
  status: string;
  createdate: string;
}
