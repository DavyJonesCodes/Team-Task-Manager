"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";

import { ui } from "@/lib/styles";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type DeleteProjectButtonProps = {
  projectId: string;
};

export function DeleteProjectButton({ projectId }: DeleteProjectButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function handleDelete() {
    setLoading(true);

    const response = await fetch(`/api/projects/${projectId}`, {
      method: "DELETE",
    });

    setLoading(false);

    if (!response.ok) {
      alert("Could not delete project.");
      return;
    }

    setOpen(false);
    router.push("/projects");
    router.refresh();
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" className={ui.dangerPill}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete project
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-3xl border-white/60 bg-white/95 p-0 shadow-2xl shadow-black/20 backdrop-blur-xl sm:max-w-md">
        <div className="p-6">
          <AlertDialogHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <AlertDialogTitle className="text-xl">
              Delete this project?
            </AlertDialogTitle>

            <AlertDialogDescription className="text-base leading-7">
              This action will permanently delete the project, its members, and
              all related tasks. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-6 gap-2 sm:gap-2">
            <AlertDialogCancel disabled={loading} className={ui.button}>
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                handleDelete();
              }}
              disabled={loading}
              className={ui.dangerPill}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Deleting...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Delete project
                </span>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
