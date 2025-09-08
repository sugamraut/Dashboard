import type {
  ActivityLog,
  AccountType,
  Permission,
  City,
  dashboardData,
  DistrictType,
  OnlineAccount,
  UserProfile,
  Setting,
  State,
  Role,
  Log,
} from "../typeDeclaration";
import RestService from "./API_Services";

export const PermissionService = RestService<Permission>("/permissions");

export const AccountService = RestService<AccountType>("/account-types");
export const ActivityService = RestService<ActivityLog>("/logs");
export const CityService = RestService<City>("/cities");
export const dashboardService = RestService<dashboardData>("/dashboard-data");
export const DistrictService = RestService<DistrictType>("/districts");
export const OnlineAccountService = RestService<OnlineAccount>(
  "/online-account-requests"
);
export const ProfileService = RestService<UserProfile>(`/users/profile`);
export const ScannedLogService = RestService<Log>("/logs");
export const SettingService = RestService<Setting>("/settings");
export const StateService = RestService<State>("/states");
export const UserService = RestService<UserProfile>("/users");
export const RoleService = RestService<Role>("/roles");
