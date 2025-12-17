import { useEffect, useState } from "react";
import type { ProjectRequest } from "./types";

type Props = {
  initial?: ProjectRequest;
  submitLabel: string;
  onSubmit: (data: ProjectRequest) => Promise<void> | void;
};

export function ProjectForm({ initial, submitLabel, onSubmit }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [startDate, setStartDate] = useState(initial?.startDate ?? "");
  const [endDate, setEndDate] = useState(initial?.endDate ?? "");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initial) return;
    setName(initial.name ?? "");
    setDescription(initial.description ?? "");
    setStartDate(initial.startDate ?? "");
    setEndDate(initial.endDate ?? "");
  }, [initial]);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setError(null);

        if (!name.trim()) return setError("Name is required");
        if (!startDate) return setError("Start date is required");

        await onSubmit({
          name: name.trim(),
          description: description.trim() ? description.trim() : null,
          startDate,
          endDate: endDate ? endDate : null,
        });
      }}
      className="grid max-w-[520px] gap-3"
    >
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      <label className="grid gap-1">
        <span className="text-sm font-medium text-gray-700">Name *</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-9 rounded-md border border-gray-300 px-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium text-gray-700">Description</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="rounded-md border border-gray-300 px-2 py-1.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium text-gray-700">Start date *</span>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="h-9 rounded-md border border-gray-300 px-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium text-gray-700">End date</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="h-9 rounded-md border border-gray-300 px-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
        />
      </label>

      <button
        type="submit"
        className="mt-2 inline-flex h-9 items-center justify-center rounded-md bg-gray-900 px-4 text-sm font-medium text-white transition hover:bg-gray-800"
      >
        {submitLabel}
      </button>
    </form>
  );
}
