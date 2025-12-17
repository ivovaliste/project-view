import { useEffect } from "react";

type ModalProps = {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({ open, title, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const titleId = "modal-title";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      className="fixed inset-0 z-[1000] grid place-items-center bg-black/45 p-4"
    >
      <div
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full max-w-[720px] overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-gray-200 px-4 py-3.5">
          <div id={titleId} className="font-bold">
            {title}
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="rounded-md p-1 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
          >
            ✕
          </button>
        </div>

        <div className="p-4">{children}</div>

        <div className="flex justify-end gap-2 border-t border-gray-200 px-4 py-3">
          <button
            onClick={onClose}
            className="
    rounded-lg
    border border-gray-300
    bg-gray-100
    px-5 py-2.5
    text-sm font-semibold text-gray-900
    hover:bg-gray-200
    focus:outline-none
    focus:ring-2 focus:ring-gray-400 focus:ring-offset-2
    active:bg-gray-300
  "
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
