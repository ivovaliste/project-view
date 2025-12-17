import * as React from "react";

type Props = {
  page: number; // 0-based
  totalPages: number;
  onPageChange: (page: number) => void;

  pageSize: number;
  onPageSizeChange: (size: number) => void;
  pageSizeOptions?: number[];
};

const btnBase =
  "inline-flex items-center justify-center rounded-md border border-gray-200 bg-white px-2.5 py-1.5 text-sm text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50";
const btnIcon = "w-9 px-0";

export function Pagination({
  page,
  totalPages,
  onPageChange,
  pageSize,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50],
}: Props) {
  const safeTotalPages = Math.max(totalPages ?? 0, 1);
  const safePage = Math.max(0, Math.min(page, safeTotalPages - 1));

  const canPrev = safePage > 0;
  const canNext = safePage < safeTotalPages - 1;

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Pagination buttons */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(0)}
          disabled={!canPrev}
          className={`${btnBase} ${btnIcon}`}
          aria-label="First page"
        >
          «
        </button>

        <button
          type="button"
          onClick={() => onPageChange(safePage - 1)}
          disabled={!canPrev}
          className={btnBase}
        >
          Prev
        </button>

        <div className="px-1.5 text-sm text-gray-500">
          {safeTotalPages === 0 ? 0 : safePage + 1} / {safeTotalPages}
        </div>

        <button
          type="button"
          onClick={() => onPageChange(safePage + 1)}
          disabled={!canNext}
          className={btnBase}
        >
          Next
        </button>

        <button
          type="button"
          onClick={() => onPageChange(safeTotalPages - 1)}
          disabled={!canNext}
          className={`${btnBase} ${btnIcon}`}
          aria-label="Last page"
        >
          »
        </button>
      </div>

      {/* Rows selector (now next to buttons) */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">Rows</span>
        <select
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          className="h-9 rounded-md border border-gray-200 bg-white px-2 text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
          {pageSizeOptions.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
