
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/browser";

type Profile = {
  full_name: string | null;
  avatar_url: string | null;
};

type ClientRecord = {
  id: string;
  name: string;
  email: string | null;
  company: string | null;
  phone: string | null;
  created_at: string;
};

type Project = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  deadline: string | null;
  budget: number | null;
  created_at: string;
};

type Task = {
  id: string;
  project_id: string | null;
  title: string;
  description: string | null;
  status: string;
  priority: string;
  due_date: string | null;
};

const panel =
  "rounded-2xl border border-white/[0.08] bg-[#0c1422] shadow-[0_14px_45px_rgba(0,0,0,0.14)]";

const muted = "text-slate-400";

const navItems = [
  { label: "Overview", icon: "◫", href: "#overview" },
  { label: "My projects", icon: "▧", href: "#projects" },
  { label: "Tasks", icon: "☷", href: "#tasks" },
  { label: "My profile", icon: "◎", href: "#profile" },
  { label: "Tech resources", icon: "⌘", href: "#technology" },
];

const techResources = [
  {
    category: "Artificial intelligence",
    title: "OpenAI News",
    description: "Announcements, AI products, and research developments.",
    href: "https://openai.com/news/",
    icon: "AI",
  },
  {
    category: "Cybersecurity",
    title: "The Hacker News",
    description: "Security reporting, vulnerabilities, and threat intelligence.",
    href: "https://thehackernews.com/",
    icon: "SEC",
  },
  {
    category: "Cloud infrastructure",
    title: "Cloudflare Blog",
    description: "Internet infrastructure, application security, and networking.",
    href: "https://blog.cloudflare.com/",
    icon: "NET",
  },
  {
    category: "Developer ecosystem",
    title: "GitHub Changelog",
    description: "Developer tools and platform announcements.",
    href: "https://github.blog/changelog/",
    icon: "DEV",
  },
];

function formatDate(value: string | null) {
  if (!value) return "Not scheduled";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not scheduled";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatMoney(value: number | null) {
  if (value == null) return "Not specified";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function readableStatus(value: string) {
  return value.replace(/[_-]/g, " ");
}

function isCompleted(value: string) {
  return ["completed", "complete", "done"].includes(value.toLowerCase());
}

function isCancelled(value: string) {
  return ["cancelled", "canceled"].includes(value.toLowerCase());
}

function isActiveProject(value: string) {
  return !isCompleted(value) && !isCancelled(value);
}

function StatusBadge({ value }: { value: string }) {
  const status = value.toLowerCase();

  const style = isCompleted(status)
    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
    : ["in_progress", "in progress", "active", "working"].includes(status)
      ? "border-blue-400/20 bg-blue-400/10 text-blue-300"
      : ["blocked", "cancelled", "canceled", "overdue"].includes(status)
        ? "border-red-400/20 bg-red-400/10 text-red-300"
        : "border-slate-700 bg-slate-800/80 text-slate-300";

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs capitalize ${style}`}
    >
      {readableStatus(value)}
    </span>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-5">
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-400">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
        {title}
      </h2>
      {description && (
        <p className={`mt-2 max-w-2xl text-sm leading-6 ${muted}`}>
          {description}
        </p>
      )}
    </div>
  );
}

function Initials({ name }: { name: string }) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase();

  return <>{initials || "VC"}</>;
}

export default function ClientPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [client, setClient] = useState<ClientRecord | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;

    async function checkSession() {
      const { data, error: sessionError } =
        await supabase.auth.getSession();

      if (!active) return;

      if (sessionError || !data.session) {
        setChecking(false);
        router.replace("/login");
        return;
      }

      setUser(data.session.user);
      setChecking(false);
    }

    void checkSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!active) return;

      if (!session) {
        setUser(null);
        router.replace("/login");
      } else {
        setUser(session.user);
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [router]);

  const loadDashboard = useCallback(
    async (showRefresh = false) => {
      if (!user) return;

      if (showRefresh) setRefreshing(true);

      setError("");
      setNotice("");

      try {
        const [profileResult, clientResult] = await Promise.all([
          supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", user.id)
            .maybeSingle(),

          supabase
            .from("clients")
            .select("id, name, email, company, phone, created_at")
            .eq("auth_user_id", user.id)
            .maybeSingle(),
        ]);

        if (profileResult.error) {
          throw new Error(
            `Unable to load profile: ${profileResult.error.message}`
          );
        }

        if (clientResult.error) {
          throw new Error(
            `Unable to load client record: ${clientResult.error.message}`
          );
        }

        setProfile(profileResult.data);
        setClient(clientResult.data);

        if (!clientResult.data) {
          setProjects([]);
          setTasks([]);
          setNotice(
            "Your account is active, but no client record is linked yet. Please contact VEXORA support."
          );
          return;
        }

        const projectResult = await supabase
          .from("projects")
          .select(
            "id, title, description, status, deadline, budget, created_at"
          )
          .eq("client_id", clientResult.data.id)
          .order("created_at", { ascending: false })
          .limit(6);

        if (projectResult.error) {
          throw new Error(
            `Unable to load projects: ${projectResult.error.message}`
          );
        }

        const projectRows = (projectResult.data ?? []) as Project[];
        setProjects(projectRows);

        if (projectRows.length === 0) {
          setTasks([]);
          return;
        }

        const projectIds = projectRows.map((project) => project.id);

        const taskResult = await supabase
          .from("tasks")
          .select(
            "id, project_id, title, description, status, priority, due_date"
          )
          .in("project_id", projectIds)
          .order("due_date", { ascending: true, nullsFirst: false })
          .limit(10);

        if (taskResult.error) {
          throw new Error(
            `Unable to load tasks: ${taskResult.error.message}`
          );
        }

        setTasks((taskResult.data ?? []) as Task[]);
      } catch (caught) {
        setError(
          caught instanceof Error
            ? caught.message
            : "An unexpected error occurred."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [user]
  );

  useEffect(() => {
    if (!user) return;

    // Start loading after the effect has completed its synchronous phase.
    const timer = window.setTimeout(() => {
      void loadDashboard();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [user, loadDashboard]);

  async function handleSignOut() {
    if (signingOut) return;

    setSigningOut(true);
    setError("");

    const { error: signOutError } = await supabase.auth.signOut();

    if (signOutError) {
      setError(`Sign out failed: ${signOutError.message}`);
      setSigningOut(false);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070b12] text-white">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-slate-700 border-t-blue-400" />
          <p className={`mt-4 text-sm ${muted}`}>
            Securing your workspace...
          </p>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#070b12] text-white">
        <p className={muted}>Redirecting to sign in...</p>
      </main>
    );
  }

  const displayName =
    profile?.full_name?.trim() ||
    user.user_metadata?.full_name ||
    client?.name ||
    "VEXORA Client";

  const pendingTasks = tasks.filter(
    (task) => !isCompleted(task.status)
  );
  const completedTasks = tasks.filter((task) =>
    isCompleted(task.status)
  );
  const activeProjects = projects.filter((project) =>
    isActiveProject(project.status)
  );

  const stats = [
    {
      label: "Client account",
      value: loading ? "..." : client ? "Connected" : "Pending",
      note: client
        ? "Your client record is linked"
        : "Client link needs attention",
      icon: "◎",
      color: "text-cyan-300",
    },
    {
      label: "Projects shown",
      value: loading ? "..." : projects.length,
      note: "Latest 6 projects maximum",
      icon: "▧",
      color: "text-blue-300",
    },
    {
      label: "Active projects",
      value: loading ? "..." : activeProjects.length,
      note: "Among displayed projects",
      icon: "◈",
      color: "text-amber-300",
    },
    {
      label: "Tasks shown",
      value: loading ? "..." : tasks.length,
      note: "Latest 10 tasks maximum",
      icon: "☷",
      color: "text-violet-300",
    },
    {
      label: "Completed tasks",
      value: loading ? "..." : completedTasks.length,
      note: "Among displayed tasks",
      icon: "✓",
      color: "text-emerald-300",
    },
  ];

  return (
    <main className="min-h-screen bg-[#070b12] text-slate-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-48 -top-48 h-[550px] w-[550px] rounded-full bg-blue-500/[0.09] blur-[140px]" />
        <div className="absolute -left-48 top-[450px] h-[450px] w-[450px] rounded-full bg-cyan-400/[0.04] blur-[130px]" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-64 shrink-0 border-r border-white/[0.07] bg-[#090f19]/80 px-5 py-7 lg:flex lg:flex-col">
          <Link href="/" className="flex items-center gap-3 px-2">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/30 bg-gradient-to-br from-blue-400/20 to-cyan-300/5 text-lg font-black text-blue-200">
              V
            </span>
            <span>
              <span className="block text-lg font-extrabold tracking-[0.18em] text-white">
                VEXORA
              </span>
              <span className="block text-[9px] uppercase tracking-[0.2em] text-slate-500">
                Client workspace
              </span>
            </span>
          </Link>

          <div className="mt-10">
            <p className="px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              Workspace
            </p>
            <nav className="mt-3 space-y-1">
              {navItems.map((item, index) => (
                <a
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                    index === 0
                      ? "border border-blue-400/15 bg-blue-400/[0.09] font-medium text-blue-200"
                      : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                  }`}
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/[0.04] text-base group-hover:text-blue-300">
                    {item.icon}
                  </span>
                  {item.label}
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-9 rounded-2xl border border-blue-400/15 bg-gradient-to-br from-blue-400/[0.10] to-transparent p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-400/10 text-blue-300">
              <span className="text-lg">✦</span>
            </div>
            <p className="mt-4 text-sm font-semibold text-white">
              Need assistance?
            </p>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Contact our team for help with your project or account.
            </p>
            <a
              href="mailto:info@vexora.com"
              className="mt-4 inline-flex text-xs font-semibold text-blue-300 hover:text-blue-200"
            >
              Contact VEXORA ↗
            </a>
          </div>

          <div className="mt-auto border-t border-white/[0.07] pt-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-blue-400/25 bg-blue-400/10 text-sm font-bold text-blue-200">
                <Initials name={displayName} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">
                  {displayName}
                </p>
                <p className="truncate text-xs text-slate-500">
                  {user.email}
                </p>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 border-b border-white/[0.07] bg-[#070b12]/90 backdrop-blur-xl">
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-7 lg:px-10">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-blue-400">
                  VEXORA / Workspace
                </p>
                <h1 className="mt-1 text-lg font-semibold text-white">
                  Client dashboard
                </h1>
              </div>

              <div className="flex items-center gap-2">
                <span className="hidden items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-2 text-xs text-emerald-300 sm:inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  Signed in
                </span>

                <button
                  type="button"
                  onClick={() => void loadDashboard(true)}
                  disabled={refreshing || loading}
                  className="rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2.5 text-sm text-slate-300 transition hover:border-blue-400/30 hover:text-white disabled:opacity-50"
                >
                  {refreshing ? "Refreshing..." : "↻ Refresh"}
                </button>

                <button
                  type="button"
                  onClick={handleSignOut}
                  disabled={signingOut}
                  className="rounded-xl border border-white/10 px-3 py-2.5 text-sm text-slate-300 transition hover:border-red-400/20 hover:text-red-200 disabled:opacity-50"
                >
                  {signingOut ? "Signing out..." : "Sign out"}
                </button>
              </div>
            </div>

            <nav className="flex gap-2 overflow-x-auto border-t border-white/[0.05] px-4 py-2 lg:hidden sm:px-7">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="shrink-0 rounded-lg px-3 py-2 text-xs text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </header>

          <div className="space-y-10 px-4 py-7 sm:px-7 sm:py-9 lg:px-10 lg:py-10">
            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-400/20 bg-red-400/[0.06] p-4 text-sm leading-6 text-red-200"
              >
                <p className="font-semibold">
                  We couldn&apos;t load all your data.
                </p>
                <p className="mt-1">{error}</p>
                <button
                  type="button"
                  onClick={() => void loadDashboard(true)}
                  className="mt-3 font-semibold underline underline-offset-4"
                >
                  Try again
                </button>
              </div>
            )}

            {notice && (
              <div
                role="status"
                className="rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-4 text-sm leading-6 text-amber-100"
              >
                {notice}
              </div>
            )}

            <section
              id="overview"
              className={`${panel} relative scroll-mt-28 overflow-hidden p-6 sm:p-9`}
            >
              <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-blue-500/[0.10] blur-[80px]" />
              <div className="pointer-events-none absolute bottom-0 right-0 h-px w-2/3 bg-gradient-to-l from-blue-400/40 to-transparent" />

              <div className="relative">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-blue-400/20 bg-blue-400/[0.08] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-blue-300">
                    Client portal
                  </span>
                  <span className="text-xs text-slate-500">
                    Your projects. Your workspace.
                  </span>
                </div>

                <div className="mt-6 flex flex-col justify-between gap-6 md:flex-row md:items-end">
                  <div>
                    <p className="text-sm text-slate-400">Welcome back</p>
                    <h2 className="mt-2 break-words text-3xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                      {displayName}
                      <span className="text-blue-300">.</span>
                    </h2>
                    <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">
                      Follow your VEXORA projects, review upcoming tasks, and
                      stay connected with your workspace.
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/[0.08] bg-black/20 p-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full border border-blue-400/30 bg-blue-400/10 text-base font-bold text-blue-200">
                      <Initials name={displayName} />
                    </div>
                    <div className="min-w-0">
                      <p className="max-w-[200px] truncate text-sm font-semibold text-white">
                        {client?.company || "Personal workspace"}
                      </p>
                      <p className="mt-1 max-w-[200px] truncate text-xs text-slate-400">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <SectionHeading
                eyebrow="At a glance"
                title="Workspace overview"
                description="A snapshot of the records currently loaded for your account."
              />

              <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
                {stats.map((stat) => (
                  <article
                    key={stat.label}
                    className={`${panel} group p-5 transition hover:-translate-y-0.5 hover:border-blue-400/20`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm text-slate-400">{stat.label}</p>
                      <span className={`text-xl ${stat.color}`}>
                        {stat.icon}
                      </span>
                    </div>
                    <p className="mt-5 text-3xl font-semibold tracking-tight text-white">
                      {stat.value}
                    </p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      {stat.note}
                    </p>
                  </article>
                ))}
              </div>
            </section>

            <section id="projects" className="scroll-mt-28">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <SectionHeading
                  eyebrow="Delivery & progress"
                  title="My projects"
                  description="Your latest projects associated with your linked client record."
                />
                <span className="mb-5 rounded-lg border border-white/[0.08] px-3 py-2 text-xs text-slate-400">
                  {projects.length} shown
                </span>
              </div>

              {loading ? (
                <div className={`${panel} p-8 text-sm ${muted}`}>
                  Loading project information...
                </div>
              ) : projects.length === 0 ? (
                <div className={`${panel} p-8 sm:p-10`}>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/[0.07] text-xl text-blue-300">
                    ▧
                  </div>
                  <h3 className="mt-5 font-semibold text-white">
                    Your project space is ready
                  </h3>
                  <p className={`mt-2 max-w-xl text-sm leading-6 ${muted}`}>
                    No projects are linked to your account yet. Once VEXORA
                    associates a project with your client record, it will
                    appear here.
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 xl:grid-cols-2">
                  {projects.map((project, index) => (
                    <article
                      key={project.id}
                      className={`${panel} overflow-hidden transition hover:border-blue-400/20`}
                    >
                      <div className="h-1 bg-gradient-to-r from-blue-500/80 via-cyan-400/40 to-transparent" />
                      <div className="p-5 sm:p-6">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="flex min-w-0 items-start gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-xs font-bold text-blue-300">
                              {String(index + 1).padStart(2, "0")}
                            </span>
                            <div className="min-w-0">
                              <h3 className="break-words font-semibold text-white">
                                {project.title}
                              </h3>
                              <p className="mt-1 text-xs text-slate-500">
                                Created {formatDate(project.created_at)}
                              </p>
                            </div>
                          </div>
                          <StatusBadge value={project.status} />
                        </div>

                        <p className="mt-5 min-h-12 text-sm leading-6 text-slate-400">
                          {project.description ||
                            "No project description has been added yet."}
                        </p>

                        <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/[0.07] pt-4">
                          <div>
                            <p className="text-xs text-slate-500">
                              Target deadline
                            </p>
                            <p className="mt-2 text-sm font-medium text-slate-200">
                              {formatDate(project.deadline)}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-slate-500">
                              Recorded budget
                            </p>
                            <p className="mt-2 break-words text-sm font-medium text-slate-200">
                              {formatMoney(project.budget)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section id="tasks" className="scroll-mt-28">
              <SectionHeading
                eyebrow="Next steps"
                title="Tasks & deadlines"
                description="The latest tasks attached to the projects shown above."
              />

              {loading ? (
                <div className={`${panel} p-8 text-sm ${muted}`}>
                  Loading tasks...
                </div>
              ) : tasks.length === 0 ? (
                <div className={`${panel} p-8`}>
                  <h3 className="font-semibold text-white">
                    No tasks to display
                  </h3>
                  <p className={`mt-2 text-sm leading-6 ${muted}`}>
                    Tasks will appear here when they are added to one of your
                    projects.
                  </p>
                </div>
              ) : (
                <div className={`${panel} overflow-hidden`}>
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4 sm:px-6">
                    <p className="text-sm font-medium text-white">
                      Recent work items
                    </p>
                    <p className="text-xs text-slate-500">
                      {pendingTasks.length} unfinished · {completedTasks.length} completed
                    </p>
                  </div>

                  <div className="divide-y divide-white/[0.06]">
                    {tasks.map((task) => (
                      <article
                        key={task.id}
                        className="flex flex-col justify-between gap-4 px-5 py-5 transition hover:bg-white/[0.015] sm:flex-row sm:items-center sm:px-6"
                      >
                        <div className="flex min-w-0 gap-3">
                          <span
                            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border text-sm ${
                              isCompleted(task.status)
                                ? "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300"
                                : "border-white/[0.08] bg-white/[0.03] text-slate-400"
                            }`}
                          >
                            {isCompleted(task.status) ? "✓" : "•"}
                          </span>
                          <div className="min-w-0">
                            <h3 className="break-words text-sm font-semibold text-white">
                              {task.title}
                            </h3>
                            <p className="mt-1 break-words text-sm leading-6 text-slate-400">
                              {task.description || "No additional details"}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                              <span>Due: {formatDate(task.due_date)}</span>
                              <span>
                                Priority: {readableStatus(task.priority)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="shrink-0 pl-11 sm:pl-0">
                          <StatusBadge value={task.status} />
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section id="profile" className="scroll-mt-28">
              <SectionHeading
                eyebrow="Account details"
                title="My profile"
                description="Information associated with your signed-in account and client record."
              />

              <div className={`${panel} overflow-hidden`}>
                <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 sm:flex-row sm:items-center sm:p-6">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-blue-400/25 bg-blue-400/[0.08] text-lg font-bold text-blue-200">
                    <Initials name={displayName} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="break-words font-semibold text-white">
                      {displayName}
                    </h3>
                    <p className="mt-1 break-words text-sm text-slate-400">
                      {user.email}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      Client since {formatDate(client?.created_at ?? null)}
                    </p>
                  </div>
                  <div className="sm:ml-auto">
                    <span
                      className={`rounded-full border px-3 py-1.5 text-xs ${
                        client
                          ? "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300"
                          : "border-amber-400/20 bg-amber-400/[0.06] text-amber-200"
                      }`}
                    >
                      {client ? "Account linked" : "Link pending"}
                    </span>
                  </div>
                </div>

                <div className="grid gap-px bg-white/[0.05] sm:grid-cols-2">
                  {[
                    {
                      label: "Full name",
                      value: profile?.full_name || client?.name || displayName,
                    },
                    {
                      label: "Email address",
                      value: user.email || "Not available",
                    },
                    {
                      label: "Company",
                      value: client?.company || "Not provided",
                    },
                    {
                      label: "Phone number",
                      value: client?.phone || "Not provided",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="min-w-0 bg-[#0c1422] p-5 sm:p-6"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                        {item.label}
                      </p>
                      <p className="mt-3 break-words text-sm font-medium text-slate-200">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section id="technology" className="scroll-mt-28">
              <SectionHeading
                eyebrow="Technology radar"
                title="Explore the tech landscape"
                description="Explore current publisher feeds for AI, cybersecurity, infrastructure, and developer updates. This section links to external sources; it does not yet aggregate live articles."
              />

              <div className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                {techResources.map((resource) => (
                  <article
                    key={resource.title}
                    className={`${panel} flex flex-col p-5 transition hover:-translate-y-0.5 hover:border-blue-400/25`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex h-10 min-w-10 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-400/[0.07] px-2 text-[10px] font-extrabold tracking-wide text-blue-300">
                        {resource.icon}
                      </span>
                      <span className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
                        External source
                      </span>
                    </div>

                    <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.14em] text-blue-400">
                      {resource.category}
                    </p>
                    <h3 className="mt-2 font-semibold text-white">
                      {resource.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-slate-400">
                      {resource.description}
                    </p>
                    <a
                      href={resource.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 transition hover:text-blue-200"
                    >
                      Visit source <span aria-hidden="true">↗</span>
                    </a>
                  </article>
                ))}
              </div>
            </section>

            <section>
              <SectionHeading
                eyebrow="Your VEXORA workspace"
                title="Quick access"
                description="Shortcuts for the main areas available today."
              />

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <a
                  href="#projects"
                  className={`${panel} group flex items-center gap-4 p-5 transition hover:border-blue-400/25`}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-400/[0.08] text-xl text-blue-300">
                    ▧
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-white">
                      Project tracking
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-400">
                      Review project status and deadlines
                    </span>
                  </span>
                  <span className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-blue-300">
                    →
                  </span>
                </a>

                <a
                  href="#tasks"
                  className={`${panel} group flex items-center gap-4 p-5 transition hover:border-blue-400/25`}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/[0.08] text-xl text-cyan-300">
                    ☷
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-white">
                      Tasks & deadlines
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-400">
                      Check recent work items
                    </span>
                  </span>
                  <span className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-cyan-300">
                    →
                  </span>
                </a>

                <a
                  href="mailto:info@vexora.com"
                  className={`${panel} group flex items-center gap-4 p-5 transition hover:border-blue-400/25`}
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-400/[0.08] text-xl text-violet-300">
                    ↗
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold text-white">
                      Contact VEXORA
                    </span>
                    <span className="mt-1 block text-xs leading-5 text-slate-400">
                      Open your email app to contact the team
                    </span>
                  </span>
                  <span className="text-slate-500 transition group-hover:translate-x-1 group-hover:text-violet-300">
                    →
                  </span>
                </a>
              </div>
            </section>

            <footer className="flex flex-col justify-between gap-3 border-t border-white/[0.07] py-6 text-xs text-slate-500 sm:flex-row sm:items-center">
              <p>© VEXORA Technology · Client Workspace</p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:info@vexora.com"
                  className="transition hover:text-blue-300"
                >
                  Contact
                </a>
                <Link href="/" className="transition hover:text-blue-300">
                  Main website ↗
                </Link>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </main>
  );
}
