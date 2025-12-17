import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { NewProjectButton } from "@/components/ui/NewProjectButton";
import { ProjectForm } from "@/features/projects/ProjectForm";
import { ProjectActions } from "@/components/ui/ProjectActions";
import { ProjectDetailsCard } from "@/features/projects/ProjectDetailsCard";
import { BackToListLink } from "@/components/ui/BackToListLink";
import { Modal } from "@/components/ui/Modal";

import {
  useDeleteProject,
  useProject,
  useUpdateProject,
} from "@/features/projects/hooks";

export default function ProjectDetailPage() {
  const nav = useNavigate();
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);

  const del = useDeleteProject();
  const update = useUpdateProject(projectId);

  const [editOpen, setEditOpen] = useState(false);


  const { data, isLoading, isError, error } = useProject(
    projectId,

  );

  if (!Number.isFinite(projectId))
    return <div className="p-4 text-sm text-red-700">Invalid project id</div>;

  if (isLoading)
    return <div className="p-4 text-sm text-gray-600">Loading…</div>;

  if (isError)
    return (
      <div className="p-4 text-sm text-red-700">
        Failed to load project: {(error as Error)?.message}
      </div>
    );

  if (!data) return <div className="p-4 text-sm text-gray-600">Not found</div>;

  return (
    <div className="space-y-6">
      <BackToListLink to="/projects" />
      <NewProjectButton />
      <ProjectDetailsCard project={data} />

      <section className="border-t border-gray-200 pt-4">
        <ProjectActions
          onEdit={() => setEditOpen(true)}
          onDelete={async () => {

            await del.mutateAsync(projectId);
            nav("/projects");
          }}
          deleting={del.isPending}
          confirmDelete
          confirmMessage="Delete this project? This cannot be undone."
        />

        {del.isError ? (
          <div className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            Delete failed: {(del.error as Error)?.message}
          </div>
        ) : null}
      </section>

      <Modal
        open={editOpen}
        title="Edit project"
        onClose={() => setEditOpen(false)}
      >
        <div className="space-y-3">
          <ProjectForm
            initial={{
              name: data.name,
              description: data.description ?? "",
              startDate: data.startDate,
              endDate: data.endDate ?? "",
            }}
            submitLabel={update.isPending ? "Saving…" : "Save"}
            onSubmit={async (payload) => {
              await update.mutateAsync(payload);
              setEditOpen(false);
            }}
          />

          {update.isError ? (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              Update failed: {(update.error as Error)?.message}
            </div>
          ) : null}
        </div>
      </Modal>
    </div>
  );
}
