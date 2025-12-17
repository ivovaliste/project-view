export type Project = {
  id: number;
  name: string;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
};

export type ProjectRequest = {
  name: string;
  description?: string | null;
  startDate: string;
  endDate?: string | null;
};

export type SortKey = "id" | "name" | "startDate" | "endDate";
export type SortDir = "asc" | "desc";

export type Page<T> = {
  content: T[];
  number: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
};
