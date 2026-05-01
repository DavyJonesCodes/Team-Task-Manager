import Link from "next/link";
import {
  CheckSquare,
  FolderKanban,
  LayoutDashboard,
  Settings,
  UsersRound,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Projects",
    href: "/projects",
    icon: FolderKanban,
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: CheckSquare,
  },
  {
    label: "Team",
    href: "/team",
    icon: UsersRound,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <aside className="hidden min-h-screen w-72 border-r bg-white/80 p-5 shadow-sm backdrop-blur-xl lg:block">
      <Link href="/dashboard" className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-black text-white shadow-lg shadow-black/20">
          <FolderKanban className="h-5 w-5" />
        </div>
        <div>
          <p className="font-semibold tracking-tight">Team Task</p>
          <p className="text-xs text-muted-foreground">Manager</p>
        </div>
      </Link>

      <nav className="space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition hover:-translate-y-0.5 hover:bg-zinc-100 hover:text-foreground"
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
