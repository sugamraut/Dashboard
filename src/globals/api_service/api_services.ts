import API, { getAuthHeader } from "../../http";

export interface MetaData {
  total: number;
  page: number;
  rowsPerPage: number;
  // [key: string]: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  metaData: MetaData;
}

export interface FetchParams {
  page?: number;
  rowsPerPage?: number;
  sortBy?: string | null;
  sortOrder?: string;
  query?: string;
  filters?: Record<string, any>;
}

// export interface GetParams {
//   id?: number;
//   all?: boolean;
//   groups?: boolean;
//   paginated?: boolean;
//   pagination?: FetchParams;
//   queryParams?: Record<string, any>;
// }

const RestService = <T>(basePath: string) => ({
  // get: async (path = "", params = {}): Promise<any> => {
  //   const url = `${basePath}${path}`;
  //   const response = await API.get(url, {
  //     params,
  //     headers: getAuthHeader(),
  //   });
  //   return response.data;
  // },
  get: async (path = "", params = {}): Promise<any> => {
    const url = `${basePath}${path}`;
    const response = await API.get(url, {
      params,
      headers: getAuthHeader(),
    });

    console.log("🌐 Raw Axios response:", response); // Add this to confirm
    return response.data; // ✅ Assuming this contains both data and metaData
  },

  create: async (payload: T): Promise<T> => {
    const response = await API.post(`${basePath}`, payload, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  update: async (payload: T & { id: number }): Promise<T> => {
    const response = await API.put(`${basePath}/${payload.id}`, payload, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  remove: async (id: number): Promise<T> => {
    const response = await API.delete(`${basePath}/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },
});

export default RestService;
