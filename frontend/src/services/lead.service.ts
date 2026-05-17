import type {
  ApiResponse,
  FilterParams,
  Lead,
  LeadFormValues,
  LeadsResponse,
} from "../types";
import { api } from "./api";

const pageLimit = 10;

export const getLeads = async (
  filters: FilterParams,
): Promise<LeadsResponse> => {
  const response = await api.get<ApiResponse<Lead[]>>("/leads", {
    params: { ...filters, limit: pageLimit },
  });

  return {
    data: response.data.data ?? [],
    meta: response.data.meta ?? {
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
      limit: pageLimit,
    },
  };
};

export const getLead = async (id: string): Promise<Lead> => {
  const response = await api.get<ApiResponse<Lead>>(`/leads/${id}`);

  if (!response.data.data) throw new Error("Lead response was empty");

  return response.data.data;
};

export const createLead = async (values: LeadFormValues): Promise<Lead> => {
  const response = await api.post<ApiResponse<Lead>>("/leads", values);

  if (!response.data.data) throw new Error("Create lead response was empty");

  return response.data.data;
};

export const updateLead = async (
  id: string,
  values: LeadFormValues,
): Promise<Lead> => {
  const response = await api.put<ApiResponse<Lead>>(`/leads/${id}`, values);

  if (!response.data.data) throw new Error("Update lead response was empty");

  return response.data.data;
};

export const deleteLead = async (id: string): Promise<void> => {
  await api.delete(`/leads/${id}`);
};

export const exportCsv = async (filters: FilterParams): Promise<Blob> => {
  const response = await api.get<Blob>("/leads/export/csv", {
    params: filters,
    responseType: "blob",
  });

  return response.data;
};
