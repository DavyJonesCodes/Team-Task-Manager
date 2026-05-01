"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil } from "lucide-react";

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

type ProjectStatus = "active" | "completed" | "archived";

type EditProjectFormProps = {
  project: {
    id: string;
    name: string;
    description: string | null;
    status: ProjectStatus;
  };
};

export function EditProjectForm({ project }: EditProjectFormProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<ProjectStatus>(project.status);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    const response = await fetch(`/api/projects/${project.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: String(formData.get("name")),
        description: String(formData.get("description")),
        status,
      }),
    });

    const data = await response.json();

    setLoading(false);

    if (!response.ok) {
      setError(
        typeof data.error === "string"
          ? data.error
          : "Could not update project. Please check the details."
      );
      return;
    }

    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={ui.buttonPill}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit project
        </Button>
      </DialogTrigger>

      <DialogContent className="!w-[94vw] !max-w-[760px] rounded-3xl border-white/60 bg-white/95 p-8 font-sans shadow-2xl shadow-black/20 backdrop-blur-xl">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold tracking-tight">
            Edit project
          </DialogTitle>
          <DialogDescription>
            Update the project details and current project status.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <div className="grid gap-5 md:grid-cols-[1.4fr_0.6fr]">
            <div className="space-y-2">
              <Label htmlFor="name">Project name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={project.name}
                required
                minLength={2}
                className={ui.input}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as ProjectStatus)}
              >
                <SelectTrigger className={ui.select}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={project.description || ""}
              className={ui.textarea}
            />
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

            <Button type="submit" disabled={loading} className={ui.button}>
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
