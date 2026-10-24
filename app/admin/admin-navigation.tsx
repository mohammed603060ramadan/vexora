"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "Overview", href: "/admin", icon: "◫" },
  { label: "Analytics", href: "/admin/analytics", icon: "▥" },
  { label: "Projects", href: "/admin/projects", icon: "▦" },
  { label: "Clients", href: "/admin/clients", icon: "♙" },
  { label: "Client Inquiries", href: "/admin/inquiries", icon: "✉" },
  { label: "Team & Roles", href: "/admin/team", icon: "♧" },
  { label: "Managers", href: "/admin/managers", icon: "♙" },
  { label: "Services", href: "/admin/services", icon: "◇" },
  { label: "Website Pages", href: "/admin/pages", icon: "▤" },
  { label: "Technology News", href: "/admin/news", icon: "◉" },
  { label: "Events", href: "/admin/events", icon: "◷" },
  { label: "Academy", href: "/admin/academy", icon: "▣" },
  { label: "Student Registrations", href: "/admin/registrations", icon: "♧" },
  { label: "Tasks", href: "/admin/tasks", icon: "✓" },
  { label: "Messages", href: "/admin/messages", icon: "✉" },
  { label: "Users", href: "/admin/users", icon: "♙" },
  { label: "Finance", href: "/admin/finance", icon: "$" },
  { label: "Settings", href: "/admin/settings", icon: "⚙" },
];

export default function AdminNavigation() {
  const pathname = usePathname();

  return (
    <nav aria-label="Administration navigation" className="flex-1 space-y-1.5">
      {navigation.map((item) => {
        const active =
          item.href === "/admin"
            ? pathname === "/admin"
            : pathname === item.href || pathname.startsWith(item.href + "/");

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 text-sm transition ${
              active
                ? "border-blue-400/20 bg-blue-500/10 font-medium text-blue-200 shadow-[inset_2px_0_0_#60a5fa]"
                : "border-transparent text-gray-400 hover:bg-white/[0.04] hover:text-white"
            }`}
          >
            <span className="flex h-6 w-6 items-center justify-center text-lg" aria-hidden="true">
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
