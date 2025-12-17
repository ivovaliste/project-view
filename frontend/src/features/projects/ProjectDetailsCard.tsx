import type { Project } from "./types";

type Props = {
  project: Project;
};

export function ProjectDetailsCard({ project }: Props) {
  return (
    <section className="grid max-w-[600px] gap-3 rounded-xl border border-gray-200 bg-white p-4">
      <h2 className="text-lg font-semibold">Project details</h2>

      <Detail label="Project #" value={`#${project.id}`} />
      <Detail label="Name" value={project.name} />
      <Detail label="Description" value={project.description ?? "—"} />
      <Detail label="Start date" value={project.startDate} />
      <Detail label="End date" value={project.endDate ?? "—"} />
    </section>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[140px_1fr] items-baseline gap-2">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="font-medium text-gray-900">{value}</div>
    </div>
  );
}
