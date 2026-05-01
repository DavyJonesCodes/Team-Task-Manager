"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";

import { ui } from "@/lib/styles";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Member = {
  id: string;
  role: "admin" | "member";
  user: {
    id: string;
    name: string;
    email: string;
  };
};

type TaskFormProps = {
  projectId: string;
  members: Member[];
};

type TaskStatus = "todo" | "in_progress" | "review" | "done";
type TaskPriority = "low" | "medium" | "high" | "urgent";

export function TaskForm({ projectId, members }: TaskFormProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [assignedToId, setAssignedToId] = useState("unassigned");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        projectId,
        title: String(formData.get("title")),
        description: String(formData.get("description")),
        priority,
        status,
        assignedToId: assignedToId === "unassigned" ? "" : assignedToId,
        dueDate: String(formData.get("dueDate")),
      }),
    });

    setLoading(false);

    if (!response.ok) {
      setError("Could not create task. Please check the details.");
      return;
    }

    setOpen(false);
    setPriority("medium");
    setStatus("todo");
    setAssignedToId("unassigned");
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={ui.primaryPill}>
          <Plus className="mr-2 h-4 w-4" />
          New task
        </Button>
      </DialogTrigger>

      <DialogContent className={ui.modal}>
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            Create task
          </DialogTitle>
          <DialogDescription className="text-sm leading-6 text-muted-foreground">
            Add a new task, assign it to a member, and set its priority.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Task title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="Design project dashboard"
                required
                minLength={2}
                className={ui.input}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate" className="text-sm font-medium">
                Due date
              </Label>
              <Input
                id="dueDate"
                name="dueDate"
                type="date"
                className={`${ui.input} appearance-none`}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the work needed..."
              className={ui.textarea}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as TaskStatus)}
              >
                <SelectTrigger className={ui.select}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">Todo</SelectItem>
                  <SelectItem value="in_progress">In progress</SelectItem>
                  <SelectItem value="review">Review</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value as TaskPriority)}
              >
                <SelectTrigger className={ui.select}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Assign to</Label>
              <Select value={assignedToId} onValueChange={setAssignedToId}>
                <SelectTrigger className={ui.select}>
                  <SelectValue placeholder="Unassigned" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  {members.map((member) => (
                    <SelectItem key={member.user.id} value={member.user.id}>
                      {member.user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className={ui.button}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className={ui.button}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Creating...
                </span>
              ) : (
                "Create task"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
