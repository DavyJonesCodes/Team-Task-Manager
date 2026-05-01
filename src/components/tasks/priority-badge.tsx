import { Badge } from "@/components/ui/badge";

type PriorityBadgeProps = {
  priority: "low" | "medium" | "high" | "urgent";
};

const labels = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  const variant = priority === "urgent" ? "destructive" : "outline";

  return (
    <Badge variant={variant} className="rounded-full">
      {labels[priority]}
    </Badge>
  );
}
