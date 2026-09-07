import { api } from "./api";

export interface Department {
  id: string;
  code: string;
  name: string;
  description: string;
}

export interface Domain {
  id: string;
  code: string;
  name: string;
  description: string;
}

export const metaApi = {
  getDepartments: async (): Promise<Department[]> => {
    return api.get<Department[]>("/departments");
  },
  getDomains: async (): Promise<Domain[]> => {
    return api.get<Domain[]>("/domains");
  }
};
