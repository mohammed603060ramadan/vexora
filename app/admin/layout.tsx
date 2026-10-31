import Image from "next/image";
import Link from "next/link";
import AdminNavigation from "@/app/admin/admin-navigation";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";

function AdminLoading() {
  return <div className="min-h-screen bg-[#050914] p-8 text-slate-400">Initializing VEXORA Command Center...</div>;
}

async function AdminWorkspace({ children }: Readonly<{ children: React.ReactNode }>) {
  await connection();
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) redirect("/login?next=/admin");
  if (data.user.app_metadata?.role !== "admin") redirect("/client");

  const fullName = data.user.user_metadata?.full_name || "Administrator";
  const avatarLetter = (data.user.user_metadata?.full_name?.[0] || data.user.email?.[0] || "A").toUpperCase();

  return (
    <div className="admin-workspace relative min-h-screen overflow-x-clip bg-[#050914] text-white lg:flex">
      <div className="admin-ambient" aria-hidden="true">
        <div className="admin-ambient-grid" />
        <div className="admin-ambient-orb admin-ambient-orb-one" />
        <div className="admin-ambient-orb admin-ambient-orb-two" />
        <div className="admin-code-stream">{["0100101","1011010","0010110","1100101","VEXORA","0110100","1010011","0011010","1101001","0101101","CORE::ACTIVE","1010100"].map((code, i) => <span key={i}>{code}</span>)}</div>
        <div className="admin-scanline" />
      </div>

      <aside className="relative z-20 hidden w-[276px] shrink-0 flex-col border-r border-sky-300/[0.12] bg-[#07101ee8] px-4 py-6 backdrop-blur-2xl lg:sticky lg:top-0 lg:flex lg:h-screen">
        <Link href="/admin" className="group mb-7 flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] px-3 py-3 transition hover:border-sky-300/30 hover:bg-sky-400/[0.05]">
          <Image src="/vexora-logo.png" alt="VEXORA official logo" width={58} height={58} priority className="h-14 w-14 rounded-full object-contain drop-shadow-[0_0_14px_rgba(35,151,255,0.45)] transition duration-500 group-hover:scale-105 group-hover:drop-shadow-[0_0_22px_rgba(35,151,255,0.8)]" />
          <span className="min-w-0"><span className="block text-lg font-black tracking-[0.2em]">VEXORA<span className="text-sky-400">.</span></span><span className="mt-1 block text-[9px] tracking-[0.22em] text-slate-500">COMMAND CENTER</span></span>
        </Link>
        <div className="mb-3 flex items-center justify-between px-3"><p className="text-[9px] font-bold uppercase tracking-[0.24em] text-slate-500">System navigation</p><span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]" /></div>
        <AdminNavigation />
        <div className="mt-auto rounded-2xl border border-sky-300/15 bg-gradient-to-br from-sky-400/[0.10] via-blue-500/[0.04] to-transparent p-4">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-sky-200"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Core systems online</div>
          <p className="mt-3 text-sm font-semibold">VEXORA Control Center</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">One secure workspace for operations, intelligence and delivery.</p>
          <Link href="/" target="_blank" rel="noreferrer" className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-sky-300 transition hover:text-white">Open public website <span>↗</span></Link>
        </div>
      </aside>

      <div className="relative z-10 min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex min-h-[72px] flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] bg-[#07101edb] px-4 py-3 backdrop-blur-2xl sm:px-7">
          <div className="flex items-center gap-3">
            <Image src="/vexora-logo.png" alt="VEXORA" width={40} height={40} className="h-10 w-10 rounded-full object-contain lg:hidden" />
            <div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-sky-300">VEXORA / Command Center</p><p className="mt-1 text-sm font-medium text-slate-200">Company Management Workspace</p></div>
          </div>
          <div className="flex items-center gap-3"><div className="hidden text-right sm:block"><p className="text-sm font-semibold text-white">{fullName}</p><p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-slate-500">System Administrator</p></div><div title={fullName} className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-300/30 bg-gradient-to-br from-sky-400/20 to-blue-600/10 font-bold text-sky-100 shadow-[0_0_20px_rgba(22,135,255,0.12)]">{avatarLetter}</div></div>
        </header>
        <div className="relative z-20 border-b border-white/[0.06] bg-[#07101ebd] px-3 py-2 backdrop-blur-xl lg:hidden"><AdminNavigation compact /></div>
        <main className="admin-content relative min-w-0 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <Suspense fallback={<AdminLoading />}><AdminWorkspace>{children}</AdminWorkspace></Suspense>;
}
