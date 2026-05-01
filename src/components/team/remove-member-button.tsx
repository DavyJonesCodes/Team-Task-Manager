"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, UserMinus } from "lucide-react";

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

type RemoveMemberButtonProps = {
  projectId: string;
  memberId: string;
};

export function RemoveMemberButton({
  projectId,
  memberId,
}: RemoveMemberButtonProps) {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleRemove() {
    setLoading(true);

    const response = await fetch(
      `/api/projects/${projectId}/members?memberId=${memberId}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    setLoading(false);

    if (!response.ok) {
      alert(data.error || "Could not remove member.");
      return;
    }

    setOpen(false);
    router.refresh();
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full text-red-600 hover:bg-red-50 hover:text-red-700"
        >
          <UserMinus className="mr-2 h-4 w-4" />
          Remove
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-3xl border-white/60 bg-white/95 p-0 shadow-2xl shadow-black/20 backdrop-blur-xl sm:max-w-md">
        <div className="p-6">
          <AlertDialogHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertTriangle className="h-6 w-6" />
            </div>

            <AlertDialogTitle>Remove this member?</AlertDialogTitle>

            <AlertDialogDescription>
              This user will lose access to the project and its tasks.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-6 gap-2 sm:gap-2">
            <AlertDialogCancel disabled={loading} className="mt-0 rounded-full">
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={(event) => {
                event.preventDefault();
                handleRemove();
              }}
              disabled={loading}
              className={ui.buttonPill}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Removing...
                </span>
              ) : (
                "Remove member"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
