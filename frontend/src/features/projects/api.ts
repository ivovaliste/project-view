import { api } from "../../lib/http";
import type { Project, ProjectRequest, SortKey, SortDir, Page } from "./types";

export async function getProjectsPage(args: {
  page: number;
  size: number;
  sortKey: SortKey;
  sortDir: SortDir;
}): Promise<Page<Project>> {
  const { page, size, sortKey, sortDir } = args;

  const res = await fetch(
    `/api/projects?page=${page}&size=${size}&sort=${sortKey},${sortDir}`,
  );

  if (!res.ok) throw new Error(`Failed to load projects (${res.status})`);
  return res.json();
}

export function getProjects(): Promise<Project[]> {
  return api.get("/api/projects").json<Project[]>();
}

export function getProject(id: number): Promise<Project> {
  return api.get(`/api/projects/${id}`).json<Project>();
}

export function createProject(body: ProjectRequest): Promise<Project> {
  return api.post("/api/projects", { json: body }).json<Project>();
}

export function updateProject(
  id: number,
  body: ProjectRequest,
): Promise<Project> {
  return api.put(`/api/projects/${id}`, { json: body }).json<Project>();
}

export async function deleteProject(id: number): Promise<void> {
  await api.delete(`/api/projects/${id}`);
}
