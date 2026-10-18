
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

const navigation = [
  { label: "Overview", href: "/admin", icon: "◫" },
  { label: "Analytics", href: "/admin/analytics", icon: "▥" },
  { label: "Projects", href: "/admin/projects", icon: "▦" },
  { label: "Clients", href: "/admin/clients", icon: "♙" },
  { label: "Team & Roles", href: "/admin/team", icon: "♧" },
  { label: "Services", href: "/admin/services", icon: "◇" },
  { label: "Website Pages", href: "/admin/pages", icon: "▤" },
  { label: "Technology News", href: "/admin/news", icon: "◉" },
  { label: "Events", href: "/admin/events", icon: "◷" },
  { label: "Academy", href: "/admin/academy", icon: "▣" },
  { label: "Messages", href: "/admin/messages", icon: "✉" },
  { label: "Users", href: "/admin/users", icon: "♙" },
  { label: "Settings", href: "/admin/settings", icon: "⚙" },
];

function AdminLoading() {
  return (
    <div className="min-h-screen bg-[#080b12] p-8 text-gray-400">
      Loading administration workspace...
    </div>
  );
}

async function AdminWorkspace({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Render this authenticated workspace at request time.
  await connection();

  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    redirect("/login?next=/admin");
  }

  if (data.user.app_metadata?.role !== "admin") {
    redirect("/client");
  }

  const fullName =
    data.user.user_metadata?.full_name || "Administrator";

  const avatarLetter = (
    data.user.user_metadata?.full_name?.[0] ||
    data.user.email?.[0] ||
    "A"
  ).toUpperCase();

  return (
    <div className="min-h-screen bg-[#080b12] text-white lg:flex">
      <aside className="hidden w-[260px] shrink-0 flex-col border-r border-white/[0.08] bg-[#0b0f18] px-5 py-7 lg:flex">
        <Link href="/admin" className="mb-10 block px-3">
          <div className="text-[25px] font-bold tracking-[0.18em]">
            VEXORA<span className="text-blue-400">.</span>
          </div>

          <div className="mt-2 text-[10px] tracking-[0.25em] text-gray-500">
            TECHNOLOGY GROUP
          </div>
        </Link>

        <p className="mb-4 px-3 text-[10px] font-semibold tracking-[0.2em] text-gray-500">
          ADMINISTRATION
        </p>

        <nav className="flex-1 space-y-1.5">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 text-sm transition ${
                item.href === "/admin"
                  ? "border-blue-400/15 bg-blue-500/10 font-medium text-blue-300"
                  : "border-transparent text-gray-400 hover:bg-white/[0.04] hover:text-white"
              }`}
            >
              <span className="flex h-6 w-6 items-center justify-center text-lg">
                {item.icon}
              </span>

              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-8 rounded-2xl border border-blue-400/10 bg-gradient-to-br from-blue-500/10 to-transparent p-4">
          <p className="text-sm font-semibold">
            VEXORA Control Center
          </p>

          <p className="mt-2 text-xs leading-5 text-gray-400">
            Manage company operations, projects, services, and website
            content from one central workspace.
          </p>

          <Link
            href="/"
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-xs font-medium text-blue-300 transition hover:text-blue-200"
          >
            Preview Website <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="flex min-h-[76px] flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] bg-[#0b0f18] px-5 py-4 sm:px-8">
          <div>
            <p className="text-xs text-gray-500">
              VEXORA / Administration
            </p>

            <p className="mt-1 text-sm font-medium text-gray-200">
              Company Management Workspace
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{fullName}</p>

              <p className="mt-1 text-xs text-gray-500">
                System Administrator
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-400/20 bg-blue-500/10 font-semibold text-blue-300">
              {avatarLetter}
            </div>
          </div>
        </header>

        <main className="min-w-0 p-4 sm:p-7 lg:p-9">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <AdminWorkspace>{children}</AdminWorkspace>
    </Suspense>
  );
}
