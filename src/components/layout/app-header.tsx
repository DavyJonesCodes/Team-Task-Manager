import { MobileSidebar } from "@/components/layout/mobile-sidebar";
import { LogoutButton } from "@/components/layout/logout-button";

type AppHeaderProps = {
  userName: string;
  userEmail: string;
};

export function AppHeader({ userName, userEmail }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b bg-[#f7f5f0]/80 px-5 py-4 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <MobileSidebar />
          <div>
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="mt-1 text-xs text-muted-foreground">{userEmail}</p>
          </div>
        </div>

        <LogoutButton />
      </div>
    </header>
  );
}
