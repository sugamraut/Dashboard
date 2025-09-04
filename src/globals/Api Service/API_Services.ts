import API, { getAuthHeader } from "../../http";

export interface MetaData {
  total: number;
  page: number;
  rowsPerPage: number;
  [key: string]: any;
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
  fetchPaginated: async (
    params: FetchParams
  ): Promise<PaginatedResponse<T>> => {
    const {
      page = 1,
      rowsPerPage = 25,
      sortBy = null,
      sortOrder = "desc",
      query = "",
      filters = {},
    } = params;

    const response = await API.get(`${basePath}`, {
      params: {
        page,
        rowsPerPage,
        sortBy,
        sortOrder,
        query,
        filters: JSON.stringify(filters),
      },
      headers: getAuthHeader(),
    });

    return {
      data: response.data.data,
      metaData: response.data.metaData,
    };
  },

  fetchAll: async (): Promise<T[]> => {
    const response = await API.get(`${basePath}/all`, {
      headers: getAuthHeader(),
    });
    return response.data.data ?? response.data;
  },

  fetchGrouped: async (): Promise<T[]> => {
    const response = await API.get(`${basePath}/groups`, {
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

  remove: async (payload: T & { id: number }): Promise<T> => {
    const response = await API.delete(`${basePath}/${payload.id}`, {
      headers: getAuthHeader(),
    });
    return response.data ?? payload;
  },
  getById: async (id: number): Promise<T> => {
    const response = await API.get(`${basePath}/${id}`, {
      headers: getAuthHeader(),
    });
    return response.data;
  },

  fetch: async (): Promise<T[]> => {
    const response = await API.get(`${basePath}`, {
      headers: getAuthHeader(),
    });

    return response.data.data ?? response.data;
  },
});

export default RestService;
