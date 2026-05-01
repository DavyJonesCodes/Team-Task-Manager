import Link from "next/link";
import { ArrowRight, CalendarDays, Crown, FolderKanban } from "lucide-react";

import { Badge } from "@/components/ui/badge";

type ProjectCardProps = {
  project: {
    id: string;
    name: string;
    description: string | null;
    status: "active" | "completed" | "archived";
    role: "admin" | "member";
    createdAt: Date | string;
  };
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.id}`}
      className="group block rounded-3xl border bg-white/80 p-6 shadow-sm backdrop-blur-xl transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="rounded-2xl bg-zinc-100 p-3">
          <FolderKanban className="h-5 w-5" />
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="rounded-full">
            {project.status}
          </Badge>

          {project.role === "admin" ? (
            <Badge className="rounded-full">
              <Crown className="mr-1 h-3 w-3" />
              Admin
            </Badge>
          ) : (
            <Badge variant="outline" className="rounded-full">
              Member
            </Badge>
          )}
        </div>
      </div>

      <h2 className="text-xl font-semibold tracking-tight">{project.name}</h2>

      <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-6 text-muted-foreground">
        {project.description || "No description added yet."}
      </p>

      <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4" />
          Created project
        </div>

        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}
