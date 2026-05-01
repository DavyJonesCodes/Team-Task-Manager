"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { ui } from "@/lib/styles";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type TaskStatus = "todo" | "in_progress" | "review" | "done";

type TaskStatusSelectProps = {
  taskId: string;
  currentStatus: TaskStatus;
};

export function TaskStatusSelect({
  taskId,
  currentStatus,
}: TaskStatusSelectProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(status: TaskStatus) {
    setLoading(true);

    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    setLoading(false);

    if (!response.ok) {
      alert("Could not update task status.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <Select defaultValue={currentStatus} onValueChange={updateStatus}>
        <SelectTrigger className={ui.compactSelect}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todo">Todo</SelectItem>
          <SelectItem value="in_progress">In progress</SelectItem>
          <SelectItem value="review">Review</SelectItem>
          <SelectItem value="done">Done</SelectItem>
        </SelectContent>
      </Select>

      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
    </div>
  );
}
