import { CalendarDays, UserRound } from "lucide-react";

import { DeleteTaskButton } from "@/components/tasks/delete-task-button";
import { PriorityBadge } from "@/components/tasks/priority-badge";
import { TaskStatusBadge } from "@/components/tasks/task-status-badge";
import { TaskStatusSelect } from "@/components/tasks/task-status-select";

type TaskCardProps = {
  task: {
    id: string;
    title: string;
    description: string | null;
    status: "todo" | "in_progress" | "review" | "done";
    priority: "low" | "medium" | "high" | "urgent";
    assignedToId: string | null;
    dueDate: string | null;
    assignedTo?: {
      name: string;
      email: string;
    } | null;
  };
  canManage: boolean;
};

export function TaskCard({ task, canManage }: TaskCardProps) {
  return (
    <div className="rounded-3xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <TaskStatusBadge status={task.status} />
            <PriorityBadge priority={task.priority} />
          </div>

          <h3 className="text-lg font-semibold tracking-tight">{task.title}</h3>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {task.description || "No description added."}
          </p>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <UserRound className="h-4 w-4" />
              {task.assignedTo?.name || "Unassigned"}
            </div>

            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              {task.dueDate ? task.dueDate : "No due date"}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 md:justify-end">
          <TaskStatusSelect taskId={task.id} currentStatus={task.status} />
          {canManage ? <DeleteTaskButton taskId={task.id} /> : null}
        </div>
      </div>
    </div>
  );
}
