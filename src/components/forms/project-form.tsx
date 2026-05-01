"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";

import { ui } from "@/lib/styles";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function ProjectForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: String(formData.get("name")),
        description: String(formData.get("description")),
      }),
    });

    const data = await response.json();

    setLoading(false);

    if (!response.ok) {
      setError("Could not create project. Please check the details.");
      return;
    }

    router.push(`/projects/${data.project.id}`);
    router.refresh();
  }

  return (
    <Card className="border-white/60 bg-white/85 shadow-xl shadow-black/5 backdrop-blur-xl">
      <CardHeader>
        <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-black text-white shadow-lg shadow-black/20">
          <Plus className="h-5 w-5" />
        </div>
        <CardTitle>Create project</CardTitle>
        <CardDescription>
          Create a workspace for tasks, members, roles, and progress tracking.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="name">Project name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Website Redesign"
              required
              minLength={2}
              className={ui.input}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Short description of the project..."
              className={ui.textarea}
            />
          </div>

          {error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

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
              "Create project"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
