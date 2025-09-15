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



const RestService = <T>(basePath: string) => ({

  get: async (path = "", params = {}): Promise<any> => {
    const url = `${basePath}${path}`;
    const response = await API.get(url, {
      params,
      headers: getAuthHeader(),
    });

    return response.data;
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
