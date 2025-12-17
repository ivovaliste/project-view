import { Link } from "react-router-dom";

type Props = {
  to: string;
  label?: string;
};

export function BackToListLink({ to, label = "All projects" }: Props) {
  return (
    <div className="flex items-center gap-2.5">
      <Link
        to={to}
        className="flex items-center gap-1.5 text-gray-600 no-underline hover:text-gray-900 transition-colors"
      >
        <span aria-hidden>←</span>
        <span>{label}</span>
      </Link>
    </div>
  );
}
