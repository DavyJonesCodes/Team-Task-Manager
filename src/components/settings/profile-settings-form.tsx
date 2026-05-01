"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save } from "lucide-react";

import { ui } from "@/lib/styles";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type ProfileSettingsFormProps = {
  name: string;
  email: string;
};

export function ProfileSettingsForm({ name, email }: ProfileSettingsFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const formData = new FormData(event.currentTarget);

    const response = await fetch("/api/settings/profile", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: String(formData.get("name")),
      }),
    });

    const data = await response.json();

    setLoading(false);

    if (!response.ok) {
      setError(
        typeof data.error === "string"
          ? data.error
          : "Could not update profile."
      );
      return;
    }

    setMessage("Profile updated successfully.");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name">Display name</Label>
        <Input
          id="name"
          name="name"
          defaultValue={name}
          className={ui.input}
          minLength={2}
          required
        />
        <p className="text-xs text-muted-foreground">
          This name is shown in project member lists and task assignments.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          value={email}
          readOnly
          className={`${ui.input} bg-zinc-50 text-muted-foreground`}
        />
        <p className="text-xs text-muted-foreground">
          Email is used for login and adding members to projects.
        </p>
      </div>

      {message ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <Button type="submit" disabled={loading} className={ui.primaryPill}>
        {loading ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save profile
          </span>
        )}
      </Button>
    </form>
  );
}
