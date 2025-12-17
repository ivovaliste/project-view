import { useMutation, useQuery, useQueryClient,keepPreviousData } from "@tanstack/react-query";
import {
  createProject,
  deleteProject,
  getProject,
  getProjects,
  updateProject,
  getProjectsPage,
} from "./api";
import type { ProjectRequest, SortKey, SortDir } from "./types";

export const projectKeys = {
  all: ["projects"] as const,

  list: () => ["projects", "list"] as const, // for "get all" (no pagination)

  page: (args: {
    page: number;
    size: number;
    sortKey: SortKey;
    sortDir: SortDir;
  }) =>
    [
      "projects",
      "page",
      args.page,
      args.size,
      args.sortKey,
      args.sortDir,
    ] as const,

  detail: (id: number) => ["projects", "detail", id] as const,
};

export function useProjects() {
  return useQuery({ queryKey: projectKeys.list(), queryFn: getProjects });
}

export function useProjectsPage(args: {
  page: number;
  size: number;
  sortKey: SortKey;
  sortDir: SortDir;
}) {
  return useQuery({
    queryKey: projectKeys.page(args),
    queryFn: () => getProjectsPage(args),
   placeholderData: keepPreviousData,
  });
}

export function useProject(id: number) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: () => getProject(id),
    enabled: Number.isFinite(id),
    retry: false,
  });
}

export function useCreateProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ProjectRequest) => createProject(body),
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all }),
  });
}

export function useUpdateProject(id: number) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (body: ProjectRequest) => updateProject(id, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: projectKeys.all }),
  });
}

export function useDeleteProject() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteProject(id),
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: projectKeys.detail(id) });
    },
    onSuccess: (_data, id) => {
      qc.removeQueries({ queryKey: projectKeys.detail(id) });
      qc.invalidateQueries({ queryKey: projectKeys.all }); // ✅ refresh pages too
    },
  });
}
