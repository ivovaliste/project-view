import { Link } from "react-router-dom";
import { useState } from "react";

import { Modal } from "@/components/ui/Modal";
import { Pagination } from "@/components/ui/Pagination";
import { ProjectForm } from "@/features/projects/ProjectForm";
import { ProjectActions } from "@/components/ui/ProjectActions";
import { NewProjectButton } from "@/components/ui/NewProjectButton";

import type {
  Project,
  ProjectRequest,
  SortKey,
  SortDir,
} from "@/features/projects/types";

import {
  useDeleteProject,
  useUpdateProject,
  useProjectsPage,
} from "@/features/projects/hooks";

export default function ProjectsListPage() {
  const del = useDeleteProject();

  const [editProject, setEditProject] = useState<Project | null>(null);
  const update = useUpdateProject(editProject?.id ?? 0);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const { data, isLoading, isError, error } = useProjectsPage({
    page,
    size: pageSize,
    sortKey,
    sortDir,
  });

  const toggleSort = (key: SortKey) => {
    setPage(0);
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortIndicator = (key: SortKey) => {
    if (sortKey !== key) return "↕";
    return sortDir === "asc" ? "↑" : "↓";
  };

  const onEditSubmit = async (payload: ProjectRequest) => {
    if (!editProject) return;
    await update.mutateAsync(payload);
    setEditProject(null);
  };

  if (isLoading)
    return <div className="p-4 text-sm text-gray-600">Loading…</div>;
  if (isError)
    return (
      <div className="p-4 text-sm text-red-700">
        Failed to load projects: {(error as Error)?.message}
      </div>
    );

  const rows = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 1;

  return (
    <div className="grid gap-5">
      <header className="flex flex-wrap items-baseline gap-3">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <span className="text-sm text-gray-500">{totalElements} total</span>

        <div>
          <NewProjectButton />
        </div>
      </header>

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(Math.max(0, Math.min(p, totalPages - 1)))}
        pageSize={pageSize}
        onPageSizeChange={(s) => {
          setPage(0);
          setPageSize(s);
        }}
      />

      <section className="overflow-x-auto">
        <table className="min-w-[760px] w-full border-collapse text-sm">
          <thead>
            <tr className="text-left">
              <th className="border-b border-gray-200 px-2 py-2.5">
                <button
                  type="button"
                  onClick={() => toggleSort("id")}
                  className="inline-flex items-center gap-1 font-bold text-gray-900 hover:text-gray-700"
                >
                  Project #{" "}
                  <span className="text-gray-500">{sortIndicator("id")}</span>
                </button>
              </th>

              <th className="border-b border-gray-200 px-2 py-2.5">
                <button
                  type="button"
                  onClick={() => toggleSort("name")}
                  className="inline-flex items-center gap-1 font-bold text-gray-900 hover:text-gray-700"
                >
                  Name{" "}
                  <span className="text-gray-500">{sortIndicator("name")}</span>
                </button>
              </th>

              <th className="border-b border-gray-200 px-2 py-2.5">
                <button
                  type="button"
                  onClick={() => toggleSort("startDate")}
                  className="inline-flex items-center gap-1 font-bold text-gray-900 hover:text-gray-700"
                >
                  Start{" "}
                  <span className="text-gray-500">
                    {sortIndicator("startDate")}
                  </span>
                </button>
              </th>

              <th className="border-b border-gray-200 px-2 py-2.5">
                <button
                  type="button"
                  onClick={() => toggleSort("endDate")}
                  className="inline-flex items-center gap-1 font-bold text-gray-900 hover:text-gray-700"
                >
                  End{" "}
                  <span className="text-gray-500">
                    {sortIndicator("endDate")}
                  </span>
                </button>
              </th>

              <th className="border-b border-gray-200 px-2 py-2.5" />
            </tr>
          </thead>

          <tbody>
            {rows.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="border-b border-gray-100 px-2 py-2.5">
                  <Link
                    to={`/projects/${p.id}`}
                    className="font-bold text-gray-900 hover:underline"
                  >
                    #{p.id}
                  </Link>
                </td>

                <td className="border-b border-gray-100 px-2 py-2.5">
                  <Link
                    to={`/projects/${p.id}`}
                    className="text-gray-900 hover:underline"
                  >
                    {p.name}
                  </Link>
                </td>

                <td className="border-b border-gray-100 px-2 py-2.5 text-gray-700">
                  {p.startDate}
                </td>

                <td className="border-b border-gray-100 px-2 py-2.5 text-gray-700">
                  {p.endDate ?? "—"}
                </td>

                <td className="border-b border-gray-100 px-2 py-2.5 text-right">
                  <ProjectActions
                    onEdit={() => setEditProject(p)}
                    onDelete={() => del.mutate(p.id)}
                    deleting={del.isPending}
                    confirmDelete
                    confirmMessage={`Delete project #${p.id}?`}
                  />
                </td>
              </tr>
            ))}

            {rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-2 py-3 text-gray-500">
                  No projects yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>

        {del.isError ? (
          <div className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            Delete failed: {(del.error as Error)?.message}
          </div>
        ) : null}
      </section>

      <Modal
        open={editProject !== null}
        title={editProject ? `Edit project #${editProject.id}` : "Edit project"}
        onClose={() => setEditProject(null)}
      >
        {editProject ? (
          <div className="space-y-3">
            <ProjectForm
              initial={{
                name: editProject.name,
                description: editProject.description ?? "",
                startDate: editProject.startDate,
                endDate: editProject.endDate ?? "",
              }}
              submitLabel={update.isPending ? "Saving…" : "Save"}
              onSubmit={onEditSubmit}
            />

            {update.isError ? (
              <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                Update failed: {(update.error as Error)?.message}
              </div>
            ) : null}
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
