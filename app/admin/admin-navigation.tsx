"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "Overview", href: "/admin", icon: "grid" },
  { label: "Analytics", href: "/admin/analytics", icon: "chart" },
  { label: "Projects", href: "/admin/projects", icon: "layers" },
  { label: "Portfolio Studio", href: "/admin/portfolio", icon: "image" },
  { label: "Clients", href: "/admin/clients", icon: "users" },
  { label: "Client Inquiries", href: "/admin/inquiries", icon: "inbox" },
  { label: "Team & Roles", href: "/admin/team", icon: "team" },
  { label: "Managers", href: "/admin/managers", icon: "shield" },
  { label: "Services", href: "/admin/services", icon: "nodes" },
  { label: "Website Pages", href: "/admin/pages", icon: "layout" },
  { label: "Technology News", href: "/admin/news", icon: "news" },
  { label: "Events", href: "/admin/events", icon: "calendar" },
  { label: "Academy", href: "/admin/academy", icon: "book" },
  { label: "Student Registrations", href: "/admin/registrations", icon: "graduation" },
  { label: "Tasks", href: "/admin/tasks", icon: "check" },
  { label: "Messages", href: "/admin/messages", icon: "message" },
  { label: "Users", href: "/admin/users", icon: "user" },
  { label: "Finance", href: "/admin/finance", icon: "wallet" },
  { label: "Settings", href: "/admin/settings", icon: "settings" },
];

const paths: Record<string, string> = {
  grid: "M3 3h7v7H3z M14 3h7v7h-7z M14 14h7v7h-7z M3 14h7v7H3z",
  chart: "M4 19V5 M4 19h17 M8 16v-4 M13 16V7 M18 16v-7",
  layers: "m12 3 9 5-9 5-9-5 9-5Z M3 12l9 5 9-5 M3 16l9 5 9-5",
  image: "M4 4h16v16H4z M4 16l5-5 4 4 3-3 4 4 M9 9h.01",
  users: "M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M20 8v6 M23 11h-6",
  inbox: "M4 4h16v16H4z M4 13h4l2 3h4l2-3h4",
  team: "M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M10 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M20 8v6 M17 11h6",
  shield: "M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z M9 12l2 2 4-4",
  nodes: "M12 2v5 M12 17v5 M4.93 4.93l3.54 3.54 M15.54 15.54l3.53 3.53 M2 12h5 M17 12h5 M4.93 19.07l3.54-3.54 M15.54 8.46l3.53-3.53 M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z",
  layout: "M3 3h18v18H3z M9 3v18 M9 9h12",
  news: "M4 4h16v16H4z M8 8h8 M8 12h8 M8 16h5",
  calendar: "M4 5h16v16H4z M8 3v4 M16 3v4 M4 10h16",
  book: "M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 1 4 17.5z M4 17h16 M8 6h8",
  graduation: "m2 10 10-5 10 5-10 5-10-5Z M6 12v5c4 3 8 3 12 0v-5 M22 10v6",
  check: "M4 12l5 5L20 6 M3 3h18v18H3z",
  message: "M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8v.5Z",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  wallet: "M3 6h18v15H3z M3 6l2-3h14l2 3 M16 14h5 M16 14a1 1 0 1 0 0 .01",
  settings: "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.7 2.9-.2-.1a1.7 1.7 0 0 0-1.8.2l-.2.1h-3.4l-.1-.2a1.7 1.7 0 0 0-1.6-1l-.2.1-3-1.7.1-.2a1.7 1.7 0 0 0-.2-1.8l-.1-.2v-3.4l.2-.1a1.7 1.7 0 0 0 1-1.6l-.1-.2 1.7-3 .2.1a1.7 1.7 0 0 0 1.8-.2l.2-.1h3.4l.1.2a1.7 1.7 0 0 0 1.6 1l.2-.1 3 1.7-.1.2a1.7 1.7 0 0 0 .2 1.8l.1.2v3.4Z",
};

function NavIcon({ name }: { name: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="h-[19px] w-[19px] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[-4deg]"><path d={paths[name] || paths.grid} /></svg>;
}

export default function AdminNavigation({ compact = false }: { compact?: boolean }) {
  const pathname = usePathname();
  return <nav aria-label="Administration navigation" className={compact ? "flex gap-1 overflow-x-auto pb-1 [scrollbar-width:thin]" : "min-h-0 flex-1 space-y-1 overflow-y-auto pr-1 [scrollbar-width:thin]"}>
    {navigation.map((item) => {
      const active = item.href === "/admin" ? pathname === "/admin" : pathname === item.href || pathname.startsWith(item.href + "/");
      return <Link key={item.href} href={item.href} aria-current={active ? "page" : undefined} title={item.label} className={`group relative flex shrink-0 items-center gap-3 overflow-hidden rounded-xl border px-3 py-2.5 text-[12px] font-medium transition-all duration-300 ${compact ? "min-w-max" : "w-full"} ${active ? "border-sky-300/25 bg-gradient-to-r from-sky-400/[0.16] to-blue-500/[0.06] text-sky-100 shadow-[inset_2px_0_0_#38bdf8,0_0_24px_rgba(14,165,233,0.08)]" : "border-transparent text-slate-400 hover:translate-x-0.5 hover:border-white/[0.08] hover:bg-white/[0.045] hover:text-white"}`}>
        <span className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all duration-300 ${active ? "border-sky-300/25 bg-sky-300/10 text-sky-200 shadow-[0_0_14px_rgba(56,189,248,0.15)]" : "border-white/[0.06] bg-white/[0.025] text-slate-500 group-hover:border-sky-300/20 group-hover:bg-sky-400/[0.08] group-hover:text-sky-200"}`}><NavIcon name={item.icon} /></span>
        <span className="whitespace-nowrap">{item.label}</span>
        {active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-sky-300 shadow-[0_0_9px_#38bdf8]" />}
      </Link>;
    })}
  </nav>;
}
