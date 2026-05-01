"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { ui } from "@/lib/styles";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <Button variant="outline" onClick={handleLogout} className={ui.buttonPill}>
      <LogOut className="mr-2 h-4 w-4" />
      Logout
    </Button>
  );
}
