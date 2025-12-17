type Props = {
  onEdit: () => void;
  onDelete: () => void | Promise<void>;
  deleting?: boolean;

  confirmDelete?: boolean;
  confirmMessage?: string;

  editLabel?: string;
  deleteLabel?: string;
};

export function ProjectActions({
  onEdit,
  onDelete,
  deleting = false,
  confirmDelete = false,
  confirmMessage = "Delete this project?",
  editLabel = "Edit",
  deleteLabel = "Delete",
}: Props) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onEdit}
        className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900"
      >
        {editLabel}
      </button>

      <button
        type="button"
        disabled={deleting}
        onClick={async () => {
          if (confirmDelete && !confirm(confirmMessage)) return;
          await onDelete();
        }}
        className="rounded-md border border-red-200 bg-white px-3 py-1.5 text-sm text-red-600 shadow-sm transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deleting ? "Deleting…" : deleteLabel}
      </button>
    </div>
  );
}
