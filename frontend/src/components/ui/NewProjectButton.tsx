import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { ProjectForm } from "@/features/projects/ProjectForm";
import { useCreateProject } from "@/features/projects/hooks";
import { useNavigate } from "react-router-dom";

type Props = {
  label?: string;
  className?: string;
};

export function NewProjectButton({
  label = "+ New project",
  className = "",
}: Props) {
  const [open, setOpen] = useState(false);
  const create = useCreateProject();
  const nav = useNavigate();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={[
          "inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-3 text-sm font-medium text-white",
          "transition hover:bg-gray-800",
          className,
        ].join(" ")}
      >
        {label}
      </button>

      <Modal open={open} title="Create project" onClose={() => setOpen(false)}>
        <div className="space-y-3">
          <ProjectForm
            submitLabel={create.isPending ? "Creating…" : "Create"}
            onSubmit={async (payload) => {
              const created = await create.mutateAsync(payload);
              setOpen(false);
              nav(`/projects/${created.id}`);
            }}
          />

          {create.isError && (
            <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              Create failed: {(create.error as Error)?.message}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
