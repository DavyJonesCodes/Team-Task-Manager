import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { AppHeader } from "@/components/layout/app-header";
import { AppSidebar } from "@/components/layout/app-sidebar";

type ProtectedLayoutProps = {
  children: React.ReactNode;
};

export async function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      <div className="flex">
        <AppSidebar />

        <div className="min-w-0 flex-1">
          <AppHeader
            userName={session.user.name}
            userEmail={session.user.email}
          />

          <main className="p-5 lg:p-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
