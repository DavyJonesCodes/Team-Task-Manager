import { Badge } from "@/components/ui/badge";

type TaskStatusBadgeProps = {
  status: "todo" | "in_progress" | "review" | "done";
};

const labels = {
  todo: "Todo",
  in_progress: "In progress",
  review: "Review",
  done: "Done",
};

export function TaskStatusBadge({ status }: TaskStatusBadgeProps) {
  const variant = status === "done" ? "default" : "secondary";

  return (
    <Badge variant={variant} className="rounded-full">
      {labels[status]}
    </Badge>
  );
}
