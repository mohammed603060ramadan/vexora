"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/browser";

/* =========================================================
   TYPES
========================================================= */

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

type ProjectRequest = { id: string; project_id: string; status: string; message: string | null; created_at: string; projects: { id: string; title: string; portfolio_category: string | null } | null };

type View =
  | "overview"
  | "projects"
  | "requests"
  | "tasks"
  | "profile"
  | "technology"
  | "academy";

/* =========================================================
   CONSTANTS
========================================================= */

const WHATSAPP_URL = "https://wa.me/201115449868";
const EMAIL = "info@vexora.com";

const SOCIAL_LINKS = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/mohammad-ramadan-706b89440?utm_source=share_via&utm_content=profile&utm_medium=member_android",
    icon: "linkedin",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/vexoramohammed/",
    icon: "instagram",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/19hrz2yVC7/",
    icon: "facebook",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@vexoramohammed",
    icon: "tiktok",
  },
  {
    name: "WhatsApp",
    href: WHATSAPP_URL,
    icon: "whatsapp",
  },
  {
    name: "Email",
    href: `mailto:${EMAIL}`,
    icon: "mail",
  },
] as const;

const navItems: {
  id: View;
  label: string;
  description: string;
}[] = [
  {
    id: "overview",
    label: "Overview",
    description: "Command center",
  },
  {
    id: "projects",
    label: "Projects",
    description: "Delivery & progress",
  },
  {
    id: "requests",
    label: "Project Requests",
    description: "Requests you submitted",
  },
  {
    id: "tasks",
    label: "Tasks",
    description: "Work & deadlines",
  },
  {
    id: "profile",
    label: "My Profile",
    description: "Account information",
  },
  {
    id: "technology",
    label: "Technology",
    description: "Technology radar",
  },
  {
    id: "academy",
    label: "My Courses",
    description: "Offline course registrations",
  },
];

const techResources = [
  {
    category: "Artificial Intelligence",
    title: "OpenAI News",
    description:
      "Announcements, AI products, research and technology developments.",
    href: "https://openai.com/news/",
    code: "AI",
  },
  {
    category: "Cybersecurity",
    title: "The Hacker News",
    description:
      "Cybersecurity reporting, vulnerabilities and threat intelligence.",
    href: "https://thehackernews.com/",
    code: "SEC",
  },
  {
    category: "Cloud Infrastructure",
    title: "Cloudflare Blog",
    description:
      "Internet infrastructure, application security and networking.",
    href: "https://blog.cloudflare.com/",
    code: "NET",
  },
  {
    category: "Developer Ecosystem",
    title: "GitHub Changelog",
    description:
      "Developer tools, platform updates and ecosystem announcements.",
    href: "https://github.blog/changelog/",
    code: "DEV",
  },
];

/* =========================================================
   HELPERS
========================================================= */

function formatDate(value: string | null) {
  if (!value) return "Not scheduled";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not scheduled";
  }

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

function normalized(value: string) {
  return value.toLowerCase().replace(/[_-]/g, " ").trim();
}

function isCompleted(value: string) {
  return ["completed", "complete", "done"].includes(normalized(value));
}

function isCancelled(value: string) {
  return ["cancelled", "canceled"].includes(normalized(value));
}

function isActiveProject(value: string) {
  return !isCompleted(value) && !isCancelled(value);
}

function isOverdue(value: string | null, status: string) {
  if (!value || isCompleted(status) || isCancelled(status)) return false;

  const deadline = new Date(value).getTime();

  if (Number.isNaN(deadline)) return false;

  return deadline < Date.now();
}

function getPriorityLevel(value: string) {
  const priority = normalized(value);

  if (priority === "high" || priority === "urgent" || priority === "critical") {
    return "high";
  }

  if (priority === "medium" || priority === "normal") {
    return "medium";
  }

  return "low";
}

/* =========================================================
   ICON SYSTEM
========================================================= */

function Icon({
  name,
  size = 20,
}: {
  name: string;
  size?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (name) {
    case "overview":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      );

    case "projects":
      return (
        <svg {...common}>
          <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4h4l2 2h5A2.5 2.5 0 0 1 20 8.5v8A2.5 2.5 0 0 1 17.5 19h-11A2.5 2.5 0 0 1 4 16.5z" />
          <path d="M4 9h16" />
          <path d="M9 14h6" />
        </svg>
      );

    case "tasks":
      return (
        <svg {...common}>
          <rect x="4" y="3" width="16" height="18" rx="2" />
          <path d="M8 8h8M8 12h8M8 16h5" />
          <path d="m7.5 12 .8.8 1.5-1.7" />
        </svg>
      );

    case "profile":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.5" />
          <path d="M5 20c.7-3.2 3.2-5 7-5s6.3 1.8 7 5" />
        </svg>
      );

    case "technology":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <path d="M8 8h8v8H8z" />
          <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 15h3M1 9h3M1 15h3" />
        </svg>
      );

    case "refresh":
      return (
        <svg {...common}>
          <path d="M20 11a8 8 0 0 0-14.7-4.2L4 9" />
          <path d="M4 4v5h5" />
          <path d="M4 13a8 8 0 0 0 14.7 4.2L20 15" />
          <path d="M20 20v-5h-5" />
        </svg>
      );

    case "logout":
      return (
        <svg {...common}>
          <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
          <path d="M14 8l4 4-4 4" />
          <path d="M18 12H9" />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h13" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      );

    case "academy":
      return (
        <svg {...common}>
          <path d="m3 9 9-5 9 5-9 5-9-5Z" />
          <path d="M6.5 11v5c3.2 2.4 7.8 2.4 11 0v-5M21 9v6" />
        </svg>
      );

    case "invoices":
      return (
        <svg {...common}>
          <path d="M6 3.5h9l4 4V21l-2-1.5L15 21l-3-1.5L9 21l-3-1.5L4 21V5.5A2 2 0 0 1 6 3.5Z" />
          <path d="M14.5 3.8V8H19M8 12h7M8 15.5h7" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );

    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" />
          <path d="M12 7v5l3 2" />
        </svg>
      );

    case "alert":
      return (
        <svg {...common}>
          <path d="M12 3 2.8 19a1.7 1.7 0 0 0 1.5 2.5h15.4a1.7 1.7 0 0 0 1.5-2.5z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      );

    case "calendar":
      return (
        <svg {...common}>
          <rect x="3.5" y="5" width="17" height="15" rx="2" />
          <path d="M7 3v4M17 3v4M3.5 9h17" />
        </svg>
      );

    case "chart":
      return (
        <svg {...common}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="m7 15 3-4 3 2 5-7" />
        </svg>
      );

    case "mail":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" />
          <path d="m4 7 8 6 8-6" />
        </svg>
      );

    case "linkedin":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <path d="M8 10v6M8 8.2v.01M12 16v-3.2a2.4 2.4 0 0 1 4.8 0V16M12 10v6" />
        </svg>
      );

    case "instagram":
      return (
        <svg {...common}>
          <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.3" cy="6.8" r=".7" fill="currentColor" stroke="none" />
        </svg>
      );

    case "facebook":
      return (
        <svg {...common}>
          <path d="M14 8h2V4.5h-2.4C10.8 4.5 9 6.2 9 9v2H6v3.5h3V20h3.5v-5.5H16l.6-3.5h-4.1V9.2c0-.8.4-1.2 1.5-1.2z" />
        </svg>
      );

    case "tiktok":
      return (
        <svg {...common}>
          <path d="M14 4v10.1a4.4 4.4 0 1 1-3.2-4.2" />
          <path d="M14 4c.6 2.1 2 3.4 4.2 3.8" />
        </svg>
      );

    case "whatsapp":
      return (
        <svg {...common}>
          <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5z" />
          <path d="M8.3 8.4c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.3.1.5-.1.7l-.6.7c.6 1.2 1.5 2.1 2.7 2.7l.7-.6c.2-.2.4-.2.7-.1l1.6.7c.3.1.4.3.4.6v.4c0 .4-.1.7-.5.9-.5.3-1.2.4-1.8.2-3.2-1-5.8-3.6-6.8-6.8-.2-.7-.1-1.3.3-1.9z" />
        </svg>
      );

    case "external":
      return (
        <svg {...common}>
          <path d="M14 5h5v5" />
          <path d="m19 5-8 8" />
          <path d="M19 13v4a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4" />
        </svg>
      );

    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 20 6v5.5c0 4.8-3.3 8-8 9.5-4.7-1.5-8-4.7-8-9.5V6z" />
          <path d="m8.5 12 2.2 2.2 4.8-5" />
        </svg>
      );

    case "database":
      return (
        <svg {...common}>
          <ellipse cx="12" cy="5" rx="7" ry="3" />
          <path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5" />
          <path d="M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7" />
        </svg>
      );

    case "network":
      return (
        <svg {...common}>
          <circle cx="5" cy="12" r="2.5" />
          <circle cx="19" cy="6" r="2.5" />
          <circle cx="19" cy="18" r="2.5" />
          <path d="m7.3 11 9.3-4M7.3 13l9.3 4" />
        </svg>
      );

    case "spark":
      return (
        <svg {...common}>
          <path d="m12 2 1.7 6.3L20 10l-6.3 1.7L12 18l-1.7-6.3L4 10l6.3-1.7z" />
        </svg>
      );

    default:
      return null;
  }
}

/* =========================================================
   UI COMPONENTS
========================================================= */

function StatusBadge({ value }: { value: string }) {
  const status = normalized(value);

  const style = isCompleted(status)
    ? "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300"
    : ["in progress", "active", "working"].includes(status)
      ? "border-blue-400/20 bg-blue-400/[0.08] text-blue-300"
      : ["blocked", "cancelled", "canceled", "overdue"].includes(status)
        ? "border-red-400/20 bg-red-400/[0.08] text-red-300"
        : "border-slate-700/80 bg-slate-800/50 text-slate-300";

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.08em] ${style}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {readableStatus(value)}
    </span>
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

  return <>{initials || "VX"}</>;
}

function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="mb-7">
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-blue-400">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}

function AnalyticsCard({
  label,
  value,
  description,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  description: string;
  icon: string;
  accent: string;
}) {
  return (
    <article className="analytics-card group">
      <div className="analytics-card-glow" />

      <div className="relative flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
            {label}
          </p>
          <p className="mt-4 text-3xl font-semibold tracking-tight text-white">
            {value}
          </p>
        </div>

        <div className={`analytics-icon ${accent}`}>
          <Icon name={icon} size={20} />
        </div>
      </div>

      <p className="relative mt-3 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </article>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function ClientPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [client, setClient] = useState<ClientRecord | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projectRequests, setProjectRequests] = useState<ProjectRequest[]>([]);
  const [academyRegistrations, setAcademyRegistrations] = useState<Array<{
    id: string;
    full_name: string;
    email: string;
    track: string;
    status: string;
    created_at: string;
    education_level: string | null;
    experience: string | null;
  }>>([]);
  const [academyLoading, setAcademyLoading] = useState(false);
  const [academyError, setAcademyError] = useState("");
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState("");

  const [activeView, setActiveView] = useState<View>("overview");
  const [projectSearch, setProjectSearch] = useState("");
  const [projectStatusFilter, setProjectStatusFilter] = useState("all");
  const [taskSearch, setTaskSearch] = useState("");
  const [taskStatusFilter, setTaskStatusFilter] = useState("all");

  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const [showWelcome, setShowWelcome] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  /* =========================================================
     AUTH
  ========================================================= */

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

  /* =========================================================
     DATA
  ========================================================= */

  const loadDashboard = useCallback(
    async (showRefresh = false) => {
      if (!user) return;

      if (showRefresh) setRefreshing(true);

      setError("");
      setNotice("");

      try {
        const profileResult = await supabase
          .from("profiles")
          .select("full_name, avatar_url")
          .eq("id", user.id)
          .maybeSingle();

        if (profileResult.error) {
          console.error("Client profile query failed:", profileResult.error);
          throw new Error("Unable to load your profile. Please refresh or contact VEXORA support.");
        }
        setProfile(profileResult.data);

        const dashboardResponse = await fetch("/api/client/dashboard", { cache: "no-store" });
        const dashboardPayload = await dashboardResponse.json() as {
          client?: ClientRecord | null;
          projects?: Project[];
          tasks?: Task[];
          linked?: boolean;
          error?: string;
        };
        if (!dashboardResponse.ok) {
          throw new Error(dashboardPayload.error || "Unable to load your workspace data.");
        }

        const resolvedClient = dashboardPayload.client ?? null;
        setClient(resolvedClient ? { ...resolvedClient, company: null } : null);
        setProjects(Array.isArray(dashboardPayload.projects) ? dashboardPayload.projects : []);
        setTasks(Array.isArray(dashboardPayload.tasks) ? dashboardPayload.tasks : []);

        if (!dashboardPayload.linked || !resolvedClient) {
          setNotice("Your account is signed in, but no safely linked client record was found. Ask VEXORA support to verify the account email and client link.");
        }
        setAcademyLoading(true);
        setAcademyError("");
        try {
          const academyResponse = await fetch("/api/student-registration", { cache: "no-store" });
          const academyPayload = await academyResponse.json() as {
            registrations?: Array<{
              id: string; full_name: string; email: string; track: string;
              status: string; created_at: string; education_level: string | null;
              experience: string | null;
            }>;
            error?: string;
          };
          if (!academyResponse.ok) throw new Error(academyPayload.error || "Unable to load your course registrations.");
          setAcademyRegistrations(Array.isArray(academyPayload.registrations) ? academyPayload.registrations : []);
        } catch (academyLoadError) {
          setAcademyError(academyLoadError instanceof Error ? academyLoadError.message : "Unable to load your course registrations.");
          setAcademyRegistrations([]);
        } finally {
          setAcademyLoading(false);
        }

        setRequestsLoading(true);
        setRequestsError("");
        try {
          const requestsResponse = await fetch("/api/project-requests", { cache: "no-store" });
          const requestsPayload = await requestsResponse.json() as { requests?: ProjectRequest[]; error?: string };
          if (!requestsResponse.ok) throw new Error(requestsPayload.error || "Unable to load project requests.");
          setProjectRequests(Array.isArray(requestsPayload.requests) ? requestsPayload.requests : []);
        } catch (requestError) {
          setRequestsError(requestError instanceof Error ? requestError.message : "Unable to load project requests.");
        } finally {
          setRequestsLoading(false);
        }


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

    const timer = window.setTimeout(() => {
      void loadDashboard();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [user, loadDashboard]);

  /* =========================================================
     SIGN OUT
  ========================================================= */

  async function handleSignOut() {
    if (signingOut) return;

    setSigningOut(true);
    setError("");

    const { error: signOutError } =
      await supabase.auth.signOut();

    if (signOutError) {
      setError(
        `Sign out failed: ${signOutError.message}`
      );
      setSigningOut(false);
      return;
    }

    router.replace("/login");
    router.refresh();
  }

  /* =========================================================
     REAL DATA CALCULATIONS
  ========================================================= */

  const displayName =
    client?.name?.trim() ||
    profile?.full_name?.trim() ||
    user?.user_metadata?.full_name ||
    user?.email?.split("@")[0] ||
    "VEXORA Client";

  const activeProjects = useMemo(
    () =>
      projects.filter((project) =>
        isActiveProject(project.status)
      ),
    [projects]
  );

  const completedProjects = useMemo(
    () =>
      projects.filter((project) =>
        isCompleted(project.status)
      ),
    [projects]
  );

  const cancelledProjects = useMemo(
    () =>
      projects.filter((project) =>
        isCancelled(project.status)
      ),
    [projects]
  );

  const completedTasks = useMemo(
    () =>
      tasks.filter((task) =>
        isCompleted(task.status)
      ),
    [tasks]
  );

  const pendingTasks = useMemo(
    () =>
      tasks.filter(
        (task) => !isCompleted(task.status)
      ),
    [tasks]
  );

  const overdueTasks = useMemo(
    () =>
      tasks.filter((task) =>
        isOverdue(task.due_date, task.status)
      ),
    [tasks]
  );

  const totalBudget = useMemo(
    () =>
      projects.reduce(
        (sum, project) =>
          sum + (project.budget ?? 0),
        0
      ),
    [projects]
  );

  const completionRate =
    tasks.length > 0
      ? Math.round(
          (completedTasks.length / tasks.length) * 100
        )
      : 0;

  const currentProjectDistribution = [
    {
      label: "Active",
      value: activeProjects.length,
      className: "bg-blue-400",
    },
    {
      label: "Completed",
      value: completedProjects.length,
      className: "bg-emerald-400",
    },
    {
      label: "Cancelled",
      value: cancelledProjects.length,
      className: "bg-red-400",
    },
  ];

  const maxProjectCount = Math.max(
    ...currentProjectDistribution.map(
      (item) => item.value
    ),
    1
  );

  const filteredProjects = useMemo(() => {
    const query = projectSearch.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesQuery = !query || [project.title, project.description ?? "", project.status]
        .some((value) => value.toLowerCase().includes(query));
      const matchesStatus = projectStatusFilter === "all"
        || (projectStatusFilter === "active" && isActiveProject(project.status))
        || (projectStatusFilter === "completed" && isCompleted(project.status))
        || (projectStatusFilter === "cancelled" && isCancelled(project.status));
      return matchesQuery && matchesStatus;
    });
  }, [projects, projectSearch, projectStatusFilter]);

  const filteredTasks = useMemo(() => {
    const query = taskSearch.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesQuery = !query || [task.title, task.description ?? "", task.priority, task.status]
        .some((value) => value.toLowerCase().includes(query));
      const matchesStatus = taskStatusFilter === "all"
        || (taskStatusFilter === "completed" && isCompleted(task.status))
        || (taskStatusFilter === "overdue" && isOverdue(task.due_date, task.status))
        || (taskStatusFilter === "open" && !isCompleted(task.status) && !isCancelled(task.status));
      return matchesQuery && matchesStatus;
    });
  }, [tasks, taskSearch, taskStatusFilter]);

  /* =========================================================
     NAVIGATION
  ========================================================= */

  function changeView(view: View) {
    setActiveView(view);
    setMobileNavOpen(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  /* =========================================================
     LOADING SCREEN
  ========================================================= */

  if (checking) {
    return (
      <>
        <main className="client-loading-screen">
          <div className="tech-background" />

          <div className="loading-core">
            <div className="loading-logo">
              <Image
                src="/vexora-logo.png"
                alt="VEXORA"
                width={180}
                height={70}
                priority
              />
            </div>

            <div className="loading-ring">
              <span />
            </div>

            <p>SECURE WORKSPACE INITIALIZATION</p>
            <span className="loading-line" />
          </div>
        </main>

        <style jsx global>{`
          .client-loading-screen {
            min-height: 100vh;
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #030711;
            color: white;
          }

          .loading-core {
            position: relative;
            z-index: 10;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 18px;
          }

          .loading-logo {
            filter: drop-shadow(0 0 30px rgba(40, 151, 255, 0.3));
          }

          .loading-ring {
            width: 48px;
            height: 48px;
            border-radius: 999px;
            border: 1px solid rgba(66, 168, 255, 0.15);
            border-top-color: #46a8ff;
            animation: clientSpin 1s linear infinite;
          }

          .loading-ring span {
            display: block;
            width: 100%;
            height: 100%;
            border-radius: inherit;
            border: 1px solid transparent;
            border-right-color: rgba(96, 205, 255, 0.4);
          }

          .loading-core p {
            margin: 0;
            color: rgba(148, 163, 184, 0.8);
            font-size: 9px;
            font-weight: 700;
            letter-spacing: 0.28em;
          }

          .loading-line {
            width: 180px;
            height: 1px;
            background: linear-gradient(
              90deg,
              transparent,
              #218bff,
              transparent
            );
            animation: loadingPulse 1.4s ease-in-out infinite;
          }

          @keyframes clientSpin {
            to {
              transform: rotate(360deg);
            }
          }

          @keyframes loadingPulse {
            0%,
            100% {
              opacity: 0.2;
              transform: scaleX(0.6);
            }
            50% {
              opacity: 1;
              transform: scaleX(1);
            }
          }
        `}</style>
      </>
    );
  }

  if (!user) {
    return (
      <main className="client-loading-screen">
        <p className="text-sm text-slate-400">
          Redirecting to sign in...
        </p>
      </main>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main className="client-shell">
      {/* =====================================================
          ANIMATED BACKGROUND
      ===================================================== */}

      <div
        className="tech-background"
        aria-hidden="true"
      >
        <div className="tech-grid" />
        <div className="tech-grid-perspective" />

        <div className="tech-orb orb-one" />
        <div className="tech-orb orb-two" />
        <div className="tech-orb orb-three" />

        <div className="scan-line scan-one" />
        <div className="scan-line scan-two" />

        <div className="data-stream stream-one">
          VEXORA::CLIENT_CORE // SECURE_CHANNEL // 01010101
        </div>

        <div className="data-stream stream-two">
          DATA_FLOW / PROJECTS / TASKS / ANALYTICS / 00110101
        </div>

        <div className="data-stream stream-three">
          SYSTEM_STATUS::ONLINE // NETWORK::SECURE // CORE::ACTIVE
        </div>

        <div className="network-network">
          <span className="network-node node-one" />
          <span className="network-node node-two" />
          <span className="network-node node-three" />
          <span className="network-node node-four" />
          <span className="network-node node-five" />
          <span className="network-node node-six" />

          <i className="network-line line-one" />
          <i className="network-line line-two" />
          <i className="network-line line-three" />
          <i className="network-line line-four" />
        </div>

        <div className="tech-noise" />
        <div className="tech-vignette" />
      </div>

      {/* =====================================================
          WELCOME OVERLAY
      ===================================================== */}

      {showWelcome && (
        <div className="welcome-overlay">
          <div className="welcome-panel">
            <div className="welcome-corner corner-tl" />
            <div className="welcome-corner corner-tr" />
            <div className="welcome-corner corner-bl" />
            <div className="welcome-corner corner-br" />

            <div className="welcome-status">
              <span className="status-pulse" />
              SECURE CLIENT CHANNEL
            </div>

            <div className="welcome-logo">
              <Image
                src="/vexora-logo.png"
                alt="VEXORA Technology"
                width={270}
                height={100}
                priority
              />
            </div>

            <p className="welcome-eyebrow">
              VEXORA TECHNOLOGY // CLIENT COMMAND CENTER
            </p>

            <h1>
              Welcome back
              <span>{displayName}</span>
            </h1>

            <p className="welcome-description">
              Your private VEXORA workspace is ready.
              Monitor projects, tasks, deadlines and
              real workspace data from one secure command
              center.
            </p>

            <button
              type="button"
              className="welcome-button"
              onClick={() => setShowWelcome(false)}
            >
              <span>ENTER WORKSPACE</span>
              <Icon name="arrow" size={17} />
            </button>

            <div className="welcome-meta">
              <span>
                <i />
                AUTHENTICATED
              </span>

              <span>
                <i />
                SUPABASE CONNECTED
              </span>

              <span>
                <i />
                VEXORA SECURE
              </span>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          MOBILE HEADER
      ===================================================== */}

      <header className="mobile-header">
        <button
          type="button"
          onClick={() =>
            setMobileNavOpen((value) => !value)
          }
          className="mobile-menu-button"
          aria-label="Open navigation"
        >
          <span />
          <span />
          <span />
        </button>

        <Image
          src="/vexora-logo.png"
          alt="VEXORA"
          width={120}
          height={44}
          className="mobile-logo"
        />

        <div className="mobile-status-dot" />
      </header>

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
        className={`client-sidebar ${
          mobileNavOpen ? "mobile-open" : ""
        }`}
      >
        <div className="sidebar-brand">
          <Link href="/" className="sidebar-logo-link">
            <Image
              src="/vexora-logo.png"
              alt="VEXORA Technology"
              width={150}
              height={58}
              priority
            />
          </Link>

          <div className="sidebar-brand-label">
            <span>CLIENT</span>
            <span>COMMAND CENTER</span>
          </div>
        </div>

        <div className="sidebar-system">
          <span className="sidebar-system-dot" />
          <span>SYSTEM ONLINE</span>
          <span className="sidebar-system-line" />
        </div>

        <div className="sidebar-section-label">
          NAVIGATION
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => {
            const active = activeView === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => changeView(item.id)}
                className={`sidebar-nav-item ${
                  active ? "active" : ""
                }`}
              >
                <span className="sidebar-nav-icon">
                  <Icon name={item.id} size={19} />
                </span>

                <span className="sidebar-nav-text">
                  <strong>{item.label}</strong>
                  <small>{item.description}</small>
                </span>

                {active && (
                  <span className="sidebar-active-dot" />
                )}
              </button>
            );
          })}

          <Link
            href="/client/invoices"
            className="sidebar-nav-item"
            onClick={() => setMobileNavOpen(false)}
          >
            <span className="sidebar-nav-icon">
              <Icon name="invoices" size={19} />
            </span>
            <span className="sidebar-nav-text">
              <strong>Invoices & Payments</strong>
              <small>Billing and payment history</small>
            </span>
          </Link>
        </nav>

        <div className="sidebar-help">
          <div className="sidebar-help-icon">
            <Icon name="shield" size={19} />
          </div>

          <div>
            <strong>VEXORA Support</strong>
            <span>Need assistance?</span>
          </div>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contact VEXORA on WhatsApp"
          >
            <Icon name="arrow" size={15} />
          </a>
        </div>

        <div className="sidebar-user">
          <div className="sidebar-avatar">
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt={displayName}
                width={42}
                height={42}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <Initials name={displayName} />
            )}
          </div>

          <div className="sidebar-user-info">
            <strong>{displayName}</strong>
            <span>{user.email}</span>
          </div>

          <button
            type="button"
            onClick={handleSignOut}
            disabled={signingOut}
            className="sidebar-logout"
            aria-label="Sign out"
          >
            <Icon name="logout" size={17} />
          </button>
        </div>
      </aside>

      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="client-content">
        {/* ===================================================
            TOP BAR
        =================================================== */}

        <header className="client-topbar">
          <div>
            <p className="topbar-path">
              VEXORA / CLIENT /{" "}
              <span>
                {navItems.find(
                  (item) => item.id === activeView
                )?.label.toUpperCase()}
              </span>
            </p>

            <div className="topbar-title-row">
              <h1>
                {activeView === "overview"
                  ? "Client Command Center"
                  : navItems.find(
                        (item) =>
                          item.id === activeView
                      )?.label}
              </h1>

              <span className="topbar-live">
                <i />
                LIVE
              </span>
            </div>
          </div>

          <div className="topbar-actions">
            <div className="topbar-account-status">
              <span />
              SECURE SESSION
            </div>

            <button
              type="button"
              onClick={() => void loadDashboard(true)}
              disabled={refreshing || loading}
              className="topbar-refresh"
            >
              <Icon
                name="refresh"
                size={15}
              />
              {refreshing
                ? "Refreshing"
                : "Refresh"}
            </button>
          </div>
        </header>

        <div className="client-page">
          {/* =================================================
              ALERTS
          ================================================= */}

          {error && (
            <div className="client-alert error">
              <div className="client-alert-icon">
                <Icon name="alert" size={18} />
              </div>

              <div>
                <strong>
                  Workspace data could not be fully loaded
                </strong>
                <p>{error}</p>
              </div>

              <button
                type="button"
                onClick={() =>
                  void loadDashboard(true)
                }
              >
                Try again
              </button>
            </div>
          )}

          {notice && (
            <div className="client-alert notice">
              <div className="client-alert-icon">
                <Icon name="alert" size={18} />
              </div>

              <div>
                <strong>Account status</strong>
                <p>{notice}</p>
              </div>
            </div>
          )}

          {/* =================================================
              OVERVIEW
          ================================================= */}

          {activeView === "overview" && (
            <div className="view-enter">
              <section className="hero-command">
                <div className="hero-command-grid" />

                <div className="hero-command-content">
                  <div className="hero-command-badge">
                    <span />
                    VEXORA PRIVATE WORKSPACE
                  </div>

                  <p className="hero-command-small">
                    WELCOME BACK
                  </p>

                  <h2>
                    {displayName}
                    <span>.</span>
                  </h2>

                  <p className="hero-command-description">
                    Your VEXORA workspace gives you a
                    live view of your projects, tasks,
                    deadlines and account information.
                  </p>

                  <div className="hero-command-meta">
                    <span>
                      <Icon
                        name="shield"
                        size={14}
                      />
                      Authenticated
                    </span>

                    <span>
                      <Icon
                        name="database"
                        size={14}
                      />
                      Live database
                    </span>

                    <span>
                      <Icon
                        name="network"
                        size={14}
                      />
                      Secure channel
                    </span>
                  </div>
                </div>

                <div className="hero-command-visual">
                  <div className="hero-orbit orbit-a" />
                  <div className="hero-orbit orbit-b" />
                  <div className="hero-orbit orbit-c" />

                  <div className="hero-core">
                    <Image
                      src="/vexora-logo.png"
                      alt="VEXORA"
                      width={155}
                      height={55}
                    />

                    <span>
                      CLIENT CORE
                    </span>
                  </div>

                  <div className="hero-data-tag tag-a">
                    PROJECTS
                    <strong>
                      {loading ? "…" : projects.length}
                    </strong>
                  </div>

                  <div className="hero-data-tag tag-b">
                    TASKS
                    <strong>
                      {loading ? "…" : tasks.length}
                    </strong>
                  </div>

                  <div className="hero-data-tag tag-c">
                    COMPLETION
                    <strong>
                      {loading ? "…" : `${completionRate}%`}
                    </strong>
                  </div>
                </div>
              </section>

              {/* KPI */}

              <section className="mt-8">
                <div className="section-mini-heading">
                  <div>
                    <span>
                      REAL-TIME METRICS
                    </span>
                    <h2>
                      Workspace analytics
                    </h2>
                  </div>

                  <span className="data-source">
                    SOURCE: SUPABASE
                  </span>
                </div>

                <div className="analytics-grid">
                  <AnalyticsCard
                    label="Projects"
                    value={
                      loading
                        ? "..."
                        : projects.length
                    }
                    description="Projects currently linked to your client record."
                    icon="projects"
                    accent="blue"
                  />

                  <AnalyticsCard
                    label="Active projects"
                    value={
                      loading
                        ? "..."
                        : activeProjects.length
                    }
                    description="Projects that are not completed or cancelled."
                    icon="network"
                    accent="cyan"
                  />

                  <AnalyticsCard
                    label="Tasks"
                    value={
                      loading
                        ? "..."
                        : tasks.length
                    }
                    description="Tasks currently associated with your displayed projects."
                    icon="tasks"
                    accent="violet"
                  />

                  <AnalyticsCard
                    label="Completion"
                    value={
                      loading
                        ? "..."
                        : `${completionRate}%`
                    }
                    description="Completed tasks compared with all loaded tasks."
                    icon="chart"
                    accent="green"
                  />

                  <AnalyticsCard
                    label="Overdue"
                    value={
                      loading
                        ? "..."
                        : overdueTasks.length
                    }
                    description="Unfinished tasks whose due date has passed."
                    icon="alert"
                    accent="red"
                  />

                  <AnalyticsCard
                    label="Recorded budget"
                    value={
                      loading
                        ? "..."
                        : formatMoney(
                            totalBudget
                          )
                    }
                    description="Sum of budget values recorded for your loaded projects."
                    icon="database"
                    accent="amber"
                  />
                </div>
              </section>

              {/* ANALYTICS */}

              <section className="dashboard-analysis-grid">
                <article className="data-panel">
                  <div className="data-panel-heading">
                    <div>
                      <span>
                        PROJECT ANALYSIS
                      </span>
                      <h3>
                        Project distribution
                      </h3>
                    </div>

                    <Icon
                      name="chart"
                      size={19}
                    />
                  </div>

                  <div className="distribution">
                    {currentProjectDistribution.map(
                      (item) => (
                        <div
                          key={item.label}
                          className="distribution-row"
                        >
                          <div className="distribution-label">
                            <span
                              className={`distribution-dot ${item.className}`}
                            />
                            <span>
                              {item.label}
                            </span>
                          </div>

                          <div className="distribution-bar">
                            <span
                              className={
                                item.className
                              }
                              style={{
                                width: `${
                                  (item.value /
                                    maxProjectCount) *
                                  100
                                }%`,
                              }}
                            />
                          </div>

                          <strong>
                            {item.value}
                          </strong>
                        </div>
                      )
                    )}
                  </div>

                  <div className="analysis-footer">
                    <span>
                      Total projects
                    </span>
                    <strong>
                      {projects.length}
                    </strong>
                  </div>
                </article>

                <article className="data-panel">
                  <div className="data-panel-heading">
                    <div>
                      <span>
                        TASK ANALYSIS
                      </span>
                      <h3>
                        Delivery progress
                      </h3>
                    </div>

                    <div className="progress-number">
                      {completionRate}%
                    </div>
                  </div>

                  <div className="progress-visual">
                    <div
                      className="progress-circle"
                      style={{
                        background: `conic-gradient(
                          #2f9bff ${
                            completionRate *
                            3.6
                          }deg,
                          rgba(255,255,255,.05) 0deg
                        )`,
                      }}
                    >
                      <div>
                        <strong>
                          {completionRate}%
                        </strong>
                        <span>
                          complete
                        </span>
                      </div>
                    </div>

                    <div className="progress-details">
                      <div>
                        <span>
                          <i className="green-dot" />
                          Completed
                        </span>
                        <strong>
                          {completedTasks.length}
                        </strong>
                      </div>

                      <div>
                        <span>
                          <i className="blue-dot" />
                          Pending
                        </span>
                        <strong>
                          {pendingTasks.length}
                        </strong>
                      </div>

                      <div>
                        <span>
                          <i className="red-dot" />
                          Overdue
                        </span>
                        <strong>
                          {overdueTasks.length}
                        </strong>
                      </div>
                    </div>
                  </div>
                </article>
              </section>

              {/* RECENT PROJECTS */}

              <section className="mt-8">
                <div className="section-mini-heading">
                  <div>
                    <span>
                      DELIVERY PIPELINE
                    </span>
                    <h2>
                      Recent projects
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      changeView("projects")
                    }
                    className="view-all-button"
                  >
                    View all
                    <Icon
                      name="arrow"
                      size={14}
                    />
                  </button>
                </div>

                {projects.length === 0 ? (
                  <div className="empty-state">
                    <div>
                      <Icon
                        name="projects"
                        size={25}
                      />
                    </div>

                    <h3>
                      No projects linked yet
                    </h3>

                    <p>
                      Once a project is linked to
                      your client record, it will
                      appear here automatically.
                    </p>
                  </div>
                ) : (
                  <div className="project-table">
                    <div className="project-table-header">
                      <span>PROJECT</span>
                      <span>STATUS</span>
                      <span>DEADLINE</span>
                      <span>BUDGET</span>
                    </div>

                    {projects
                      .slice(0, 5)
                      .map((project) => (
                        <div
                          className="project-table-row"
                          key={project.id}
                        >
                          <div className="project-name-cell">
                            <div className="project-index">
                              {String(
                                projects.indexOf(
                                  project
                                ) + 1
                              ).padStart(
                                2,
                                "0"
                              )}
                            </div>

                            <div>
                              <strong>
                                {project.title}
                              </strong>
                              <span>
                                Created{" "}
                                {formatDate(
                                  project.created_at
                                )}
                              </span>
                            </div>
                          </div>

                          <StatusBadge
                            value={
                              project.status
                            }
                          />

                          <span className="table-muted">
                            {formatDate(
                              project.deadline
                            )}
                          </span>

                          <span className="table-money">
                            {formatMoney(
                              project.budget
                            )}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </section>

              {/* ACTIVITY */}

              <section className="dashboard-analysis-grid mt-8">
                <article className="data-panel">
                  <div className="data-panel-heading">
                    <div>
                      <span>
                        DEADLINE MONITOR
                      </span>
                      <h3>
                        Upcoming work
                      </h3>
                    </div>

                    <Icon
                      name="calendar"
                      size={19}
                    />
                  </div>

                  <div className="deadline-list">
                    {tasks
                      .filter(
                        (task) =>
                          !isCompleted(
                            task.status
                          )
                      )
                      .slice(0, 5)
                      .map((task) => (
                        <div
                          className="deadline-item"
                          key={task.id}
                        >
                          <div className="deadline-icon">
                            <Icon
                              name={
                                isOverdue(
                                  task.due_date,
                                  task.status
                                )
                                  ? "alert"
                                  : "clock"
                              }
                              size={16}
                            />
                          </div>

                          <div className="deadline-info">
                            <strong>
                              {task.title}
                            </strong>

                            <span>
                              Due{" "}
                              {formatDate(
                                task.due_date
                              )}
                            </span>
                          </div>

                          <span
                            className={`priority priority-${getPriorityLevel(
                              task.priority
                            )}`}
                          >
                            {readableStatus(
                              task.priority
                            )}
                          </span>
                        </div>
                      ))}

                    {pendingTasks.length === 0 && (
                      <div className="small-empty">
                        No unfinished tasks are
                        currently available.
                      </div>
                    )}
                  </div>
                </article>

                <article className="data-panel">
                  <div className="data-panel-heading">
                    <div>
                      <span>
                        ACCOUNT SIGNAL
                      </span>
                      <h3>
                        Workspace status
                      </h3>
                    </div>

                    <Icon
                      name="shield"
                      size={19}
                    />
                  </div>

                  <div className="signal-list">
                    <div>
                      <span>
                        Authentication
                      </span>
                      <strong className="signal-ok">
                        Verified
                      </strong>
                    </div>

                    <div>
                      <span>
                        Client record
                      </span>
                      <strong
                        className={
                          client
                            ? "signal-ok"
                            : "signal-warning"
                        }
                      >
                        {client
                          ? "Connected"
                          : "Pending"}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Database
                      </span>
                      <strong className="signal-ok">
                        Live
                      </strong>
                    </div>

                    <div>
                      <span>
                        Project records
                      </span>
                      <strong>
                        {projects.length}
                      </strong>
                    </div>

                    <div>
                      <span>
                        Task records
                      </span>
                      <strong>
                        {tasks.length}
                      </strong>
                    </div>
                  </div>
                </article>
              </section>
            </div>
          )}

          {/* =================================================
              ACADEMY REGISTRATIONS
          ================================================= */}
          {activeView === "academy" && (
            <div className="view-enter space-y-6">
              <SectionTitle
                eyebrow="VEXORA ACADEMY"
                title="My Courses"
                description="Track course applications submitted with this email address. Your registrations sync with the VEXORA Academy administration workspace."
              />
              {academyError && (
                <div role="alert" className="rounded-2xl border border-rose-400/20 bg-rose-400/[0.06] p-4 text-sm text-rose-200">
                  {academyError}
                </div>
              )}
              {academyLoading ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.025] p-8 text-center text-sm text-slate-400">
                  Loading your course registrations…
                </div>
              ) : academyRegistrations.length === 0 ? (
                <div className="relative overflow-hidden rounded-3xl border border-cyan-300/15 bg-gradient-to-br from-[#10263a] via-[#0b1420] to-[#080d15] p-7 sm:p-10">
                  <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10 text-cyan-200">
                    <Icon name="academy" size={26} />
                  </div>
                  <h2 className="relative mt-5 text-2xl font-semibold text-white">Your learning journey starts here</h2>
                  <p className="relative mt-3 max-w-xl text-sm leading-7 text-slate-400">
                    No course registrations were found for {user?.email || "this account"}. Explore the offline classroom tracks and submit the registration form using this email address.
                  </p>
                  <Link href="/academy" className="relative mt-6 inline-flex items-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-5 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200/50 hover:bg-cyan-300/15">
                    Explore Academy <span aria-hidden="true">↗</span>
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {academyRegistrations.map((registration) => (
                    <article key={registration.id} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.045] to-white/[0.015] p-5 transition hover:-translate-y-0.5 hover:border-cyan-300/30 sm:p-6">
                      <div aria-hidden="true" className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-cyan-400/[0.07] blur-2xl transition group-hover:bg-cyan-400/15" />
                      <div className="relative flex items-start gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.08] text-cyan-200">
                          <Icon name="academy" size={22} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-200">Offline registration</span>
                            <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${registration.status === "accepted" ? "border-emerald-300/20 bg-emerald-300/10 text-emerald-200" : registration.status === "rejected" ? "border-rose-300/20 bg-rose-300/10 text-rose-200" : "border-amber-300/20 bg-amber-300/10 text-amber-100"}`}>
                              {registration.status}
                            </span>
                          </div>
                          <h3 className="mt-3 break-words text-lg font-semibold leading-snug text-white">{registration.track}</h3>
                          <p className="mt-2 break-all text-xs text-slate-400">{registration.email}</p>
                          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                            {registration.education_level && <span>{registration.education_level}</span>}
                            <span>Submitted {new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(registration.created_at))}</span>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
              <p className="text-xs leading-6 text-slate-500">Registration status is updated by the VEXORA team. Submitting a form does not create an authentication account or guarantee a confirmed seat.</p>
            </div>
          )}

          {/* =================================================
              PROJECTS
          ================================================= */}

          {activeView === "projects" && (
            <div className="view-enter">
              <SectionTitle
                eyebrow="DELIVERY & PROGRESS"
                title="My Projects"
                description="Projects currently associated with your VEXORA client record. All values below are loaded directly from the workspace database."
              />

              <div className="analytics-grid">
                <AnalyticsCard
                  label="All projects"
                  value={projects.length}
                  description="Projects linked to your account."
                  icon="projects"
                  accent="blue"
                />

                <AnalyticsCard
                  label="Active"
                  value={activeProjects.length}
                  description="Projects currently in progress."
                  icon="network"
                  accent="cyan"
                />

                <AnalyticsCard
                  label="Completed"
                  value={completedProjects.length}
                  description="Projects marked as completed."
                  icon="check"
                  accent="green"
                />

                <AnalyticsCard
                  label="Recorded budget"
                  value={formatMoney(totalBudget)}
                  description="Total budget recorded across loaded projects."
                  icon="database"
                  accent="amber"
                />
              </div>

              <div className="mb-5 grid gap-3 rounded-2xl border border-white/10 bg-white/[0.025] p-4 sm:grid-cols-[minmax(0,1fr)_190px]">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Search projects</span>
                  <input value={projectSearch} onChange={(event) => setProjectSearch(event.target.value)} placeholder="Search title, details, or status…" className="min-h-11 w-full rounded-xl border border-white/10 bg-[#070d17] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/10" />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Project status</span>
                  <select value={projectStatusFilter} onChange={(event) => setProjectStatusFilter(event.target.value)} className="min-h-11 w-full rounded-xl border border-white/10 bg-[#070d17] px-3 text-sm text-white outline-none focus:border-blue-400/50">
                    <option value="all">All projects</option><option value="active">Active</option><option value="completed">Completed</option><option value="cancelled">Cancelled</option>
                  </select>
                </label>
              </div>
              <div className="project-cards-grid">
                {filteredProjects.map((project, index) => (
                  <article
                    key={project.id}
                    className="premium-project-card"
                  >
                    <div className="premium-project-topline" />

                    <div className="premium-project-header">
                      <div className="project-index-large">
                        {String(index + 1).padStart(
                          2,
                          "0"
                        )}
                      </div>

                      <StatusBadge
                        value={project.status}
                      />
                    </div>

                    <h3>{project.title}</h3>

                    <p className="premium-project-description">
                      {project.description ||
                        "No project description has been added yet."}
                    </p>

                    <div className="project-metrics">
                      <div>
                        <span>
                          <Icon
                            name="calendar"
                            size={14}
                          />
                          DEADLINE
                        </span>
                        <strong>
                          {formatDate(
                            project.deadline
                          )}
                        </strong>
                      </div>

                      <div>
                        <span>
                          <Icon
                            name="database"
                            size={14}
                          />
                          BUDGET
                        </span>
                        <strong>
                          {formatMoney(
                            project.budget
                          )}
                        </strong>
                      </div>
                    </div>

                    <div className="project-card-footer">
                      <span>
                        Created{" "}
                        {formatDate(
                          project.created_at
                        )}
                      </span>

                      <span className="project-live-dot">
                        <i />
                        DATABASE RECORD
                      </span>
                    </div>
                  </article>
                ))}

                {filteredProjects.length === 0 && (
                  <div className="empty-state full-span">
                    <div>
                      <Icon
                        name="projects"
                        size={25}
                      />
                    </div>

                    <h3>
                      No matching projects
                    </h3>

                    <p>
                      Try changing your search or status filter. If you expected projects here, confirm that the client record is linked.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* =================================================
              TASKS
          ================================================= */}

          {activeView === "tasks" && (
            <div className="view-enter">
              <SectionTitle
                eyebrow="WORK & DEADLINES"
                title="Tasks Control"
                description="Monitor tasks attached to your projects, including status, priority and due dates."
              />

              <div className="analytics-grid">
                <AnalyticsCard
                  label="Total tasks"
                  value={tasks.length}
                  description="Tasks loaded from your project records."
                  icon="tasks"
                  accent="blue"
                />

                <AnalyticsCard
                  label="Completed"
                  value={completedTasks.length}
                  description="Tasks marked complete."
                  icon="check"
                  accent="green"
                />

                <AnalyticsCard
                  label="Pending"
                  value={pendingTasks.length}
                  description="Tasks that still require work."
                  icon="clock"
                  accent="cyan"
                />

                <AnalyticsCard
                  label="Overdue"
                  value={overdueTasks.length}
                  description="Unfinished tasks beyond their due date."
                  icon="alert"
                  accent="red"
                />
              </div>

              <div className="tasks-panel">
                <div className="tasks-panel-header">
                  <div>
                    <span>
                      TASK STREAM
                    </span>
                    <h3>
                      Current work items
                    </h3>
                  </div>

                  <div className="task-completion-mini">
                    <strong>
                      {completionRate}%
                    </strong>
                    complete
                  </div>
                </div>

                <div className="mb-4 grid gap-3 sm:grid-cols-[minmax(0,1fr)_180px]">
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Find a task</span>
                    <input value={taskSearch} onChange={(event) => setTaskSearch(event.target.value)} placeholder="Search task, priority, or status…" className="min-h-11 w-full rounded-xl border border-white/10 bg-[#070d17] px-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/10" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Show tasks</span>
                    <select value={taskStatusFilter} onChange={(event) => setTaskStatusFilter(event.target.value)} className="min-h-11 w-full rounded-xl border border-white/10 bg-[#070d17] px-3 text-sm text-white outline-none focus:border-blue-400/50">
                      <option value="all">All tasks</option><option value="open">Open</option><option value="completed">Completed</option><option value="overdue">Overdue</option>
                    </select>
                  </label>
                </div>
                <div className="tasks-list">
                  {filteredTasks.map((task) => {
                    const overdue = isOverdue(
                      task.due_date,
                      task.status
                    );

                    return (
                      <article
                        key={task.id}
                        className="task-row"
                      >
                        <div
                          className={`task-state ${
                            isCompleted(
                              task.status
                            )
                              ? "completed"
                              : overdue
                                ? "overdue"
                                : ""
                          }`}
                        >
                          <Icon
                            name={
                              isCompleted(
                                task.status
                              )
                                ? "check"
                                : overdue
                                  ? "alert"
                                  : "clock"
                            }
                            size={16}
                          />
                        </div>

                        <div className="task-main">
                          <div className="task-title-row">
                            <h4>
                              {task.title}
                            </h4>

                            <StatusBadge
                              value={
                                task.status
                              }
                            />
                          </div>

                          <p>
                            {task.description ||
                              "No additional details available."}
                          </p>

                          <div className="task-meta">
                            <span>
                              <Icon
                                name="calendar"
                                size={12}
                              />
                              Due:{" "}
                              {formatDate(
                                task.due_date
                              )}
                            </span>

                            <span>
                              Priority:{" "}
                              {readableStatus(
                                task.priority
                              )}
                            </span>
                          </div>
                        </div>

                        <div
                          className={`task-priority priority-${getPriorityLevel(
                            task.priority
                          )}`}
                        >
                          {readableStatus(
                            task.priority
                          )}
                        </div>
                      </article>
                    );
                  })}

                  {filteredTasks.length === 0 && (
                    <div className="small-empty">
                      No tasks match these filters. Try a different search or status.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* =================================================
              PROFILE
          ================================================= */}

          {activeView === "profile" && (
            <div className="view-enter">
              <SectionTitle
                eyebrow="ACCOUNT DETAILS"
                title="My Profile"
                description="Information associated with your authenticated VEXORA account and client record."
              />

              <section className="profile-command-card">
                <div className="profile-command-background" />

                <div className="profile-main">
                  <div className="profile-avatar-large">
                    {profile?.avatar_url ? (
                      <Image
                        src={profile.avatar_url}
                        alt={displayName}
                        width={100}
                        height={100}
                        className="h-full w-full rounded-3xl object-cover"
                      />
                    ) : (
                      <Initials
                        name={displayName}
                      />
                    )}
                  </div>

                  <div>
                    <span className="profile-command-label">
                      VEXORA CLIENT IDENTITY
                    </span>

                    <h2>{displayName}</h2>

                    <p>
                      {user.email}
                    </p>

                    <div className="profile-status">
                      <span />
                      {client
                        ? "CLIENT RECORD CONNECTED"
                        : "CLIENT LINK PENDING"}
                    </div>
                  </div>
                </div>
              </section>

              <div className="profile-grid">
                <article className="profile-info-panel">
                  <span>FULL NAME</span>
                  <strong>
                    {profile?.full_name ||
                      client?.name ||
                      displayName}
                  </strong>
                </article>

                <article className="profile-info-panel">
                  <span>EMAIL ADDRESS</span>
                  <strong>
                    {user.email ||
                      "Not available"}
                  </strong>
                </article>

                <article className="profile-info-panel">
                  <span>COMPANY</span>
                  <strong>
                    {client?.company ||
                      "Not provided"}
                  </strong>
                </article>

                <article className="profile-info-panel">
                  <span>PHONE</span>
                  <strong>
                    {client?.phone ||
                      "Not provided"}
                  </strong>
                </article>

                <article className="profile-info-panel">
                  <span>CLIENT SINCE</span>
                  <strong>
                    {formatDate(
                      client?.created_at ??
                        null
                    )}
                  </strong>
                </article>

                <article className="profile-info-panel">
                  <span>ACCOUNT STATUS</span>
                  <strong className="profile-green">
                    {client
                      ? "Connected"
                      : "Pending"}
                  </strong>
                </article>
              </div>

              <section className="contact-command">
                <div>
                  <span>
                    NEED ASSISTANCE?
                  </span>

                  <h3>
                    Talk directly with VEXORA.
                  </h3>

                  <p>
                    Contact the VEXORA team through
                    WhatsApp or email.
                  </p>
                </div>

                <div className="contact-actions">
                  <a
                    href={WHATSAPP_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-button whatsapp"
                  >
                    <Icon
                      name="whatsapp"
                      size={18}
                    />
                    WhatsApp
                  </a>

                  <a
                    href={`mailto:${EMAIL}`}
                    className="contact-button email"
                  >
                    <Icon
                      name="mail"
                      size={18}
                    />
                    Email
                  </a>
                </div>
              </section>
            </div>
          )}

          {/* =================================================
              PROJECT REQUESTS
          ================================================= */}

          {activeView === "requests" && (
            <div className="view-enter">
              <SectionTitle
                eyebrow="PROJECT REQUEST TRACKER"
                title="My Project Requests"
                description="Requests submitted from the public VEXORA portfolio. Status and timestamps are loaded from your account's request records."
              />
              {requestsError && <div role="alert" className="mb-5 rounded-xl border border-rose-300/20 bg-rose-300/[.06] p-4 text-sm text-rose-200">{requestsError}</div>}
              {requestsLoading ? (
                <div role="status" className="rounded-2xl border border-white/10 bg-white/[.03] p-8 text-sm text-slate-400">Loading your project requests…</div>
              ) : projectRequests.length === 0 ? (
                <section className="rounded-2xl border border-dashed border-white/15 bg-white/[.025] p-8 text-center sm:p-12">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-300/20 bg-blue-400/[.06] text-blue-200"><Icon name="projects" size={26} /></div>
                  <h3 className="mt-5 text-xl font-semibold text-white">No project requests yet</h3>
                  <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">Explore the five VEXORA departments and submit a request on any published project. Your requests will appear here.</p>
                  <Link href="/projects/achievements" className="mt-5 inline-flex rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-400">Explore portfolio ↗</Link>
                </section>
              ) : (
                <div className="grid gap-4 xl:grid-cols-2">
                  {projectRequests.map((item) => (
                    <article key={item.id} className="rounded-2xl border border-white/10 bg-[#08101b]/80 p-5 sm:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div><p className="font-mono text-[10px] uppercase tracking-[.2em] text-blue-300">{item.projects?.portfolio_category || "VEXORA PROJECT"}</p><h3 className="mt-2 text-lg font-semibold text-white">{item.projects?.title || "Requested project"}</h3></div>
                        <StatusBadge value={item.status} />
                      </div>
                      {item.message && <p className="mt-3 text-sm leading-6 text-slate-400">{item.message}</p>}
                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[.07] pt-4 text-xs text-slate-500"><span>Submitted {formatDate(item.created_at)}</span><span className="font-mono">REQ-{item.id.slice(0, 8).toUpperCase()}</span></div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* =================================================
              TECHNOLOGY
          ================================================= */}

          {activeView === "technology" && (
            <div className="view-enter">
              <SectionTitle
                eyebrow="TECHNOLOGY RADAR"
                title="Explore the tech landscape"
                description="Curated technology sources for AI, cybersecurity, infrastructure and developer ecosystem updates."
              />

              <section className="technology-intro">
                <div className="technology-intro-grid" />

                <div>
                  <span>
                    VEXORA TECHNOLOGY RADAR
                  </span>

                  <h2>
                    Stay ahead of the
                    <strong>
                      technology curve.
                    </strong>
                  </h2>

                  <p>
                    Explore trusted technology
                    publishers and official product
                    feeds from the wider technology
                    ecosystem.
                  </p>
                </div>

                <div className="technology-core">
                  <div>
                    <Icon
                      name="technology"
                      size={30}
                    />
                  </div>
                  <span>
                    RADAR
                  </span>
                </div>
              </section>

              <div className="technology-grid">
                {techResources.map(
                  (resource) => (
                    <article
                      key={resource.title}
                      className="technology-card"
                    >
                      <div className="technology-card-top">
                        <span className="technology-code">
                          {resource.code}
                        </span>

                        <span className="technology-external">
                          EXTERNAL
                        </span>
                      </div>

                      <span className="technology-category">
                        {resource.category}
                      </span>

                      <h3>
                        {resource.title}
                      </h3>

                      <p>
                        {resource.description}
                      </p>

                      <a
                        href={resource.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Visit source
                        <Icon
                          name="external"
                          size={14}
                        />
                      </a>
                    </article>
                  )
                )}
              </div>
            </div>
          )}

          {/* =================================================
              SOCIAL / CONTACT
          ================================================= */}

          <section className="social-command">
            <div className="social-command-top">
              <div>
                <span>
                  VEXORA CONNECT
                </span>

                <h2>
                  Stay connected.
                </h2>

                <p>
                  Follow VEXORA and contact our team
                  through the official channels.
                </p>
              </div>

              <div className="social-command-code">
                VX::CONNECT
                <br />
                CHANNELS::ACTIVE
              </div>
            </div>

            <div className="social-links-grid">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target={
                    social.icon === "mail"
                      ? undefined
                      : "_blank"
                  }
                  rel={
                    social.icon === "mail"
                      ? undefined
                      : "noopener noreferrer"
                  }
                  className={`social-link social-${social.icon}`}
                >
                  <span className="social-icon">
                    <Icon
                      name={social.icon}
                      size={19}
                    />
                  </span>

                  <span>
                    <strong>
                      {social.name}
                    </strong>

                    <small>
                      {social.icon ===
                      "whatsapp"
                        ? "01115449868"
                        : social.name ===
                            "Email"
                          ? EMAIL
                          : "Official channel"}
                    </small>
                  </span>

                  <Icon
                    name="arrow"
                    size={15}
                  />
                </a>
              ))}
            </div>
          </section>

          {/* =================================================
              FOOTER
          ================================================= */}

          <footer className="client-footer">
            <div>
              <Image
                src="/vexora-logo.png"
                alt="VEXORA Technology"
                width={105}
                height={40}
              />

              <span>
                CLIENT COMMAND CENTER
              </span>
            </div>

            <p>
              © {new Date().getFullYear()} VEXORA
              Technology. Secure client workspace.
            </p>

            <Link href="/">
              Main website
              <Icon
                name="arrow"
                size={13}
              />
            </Link>
          </footer>
        </div>
      </div>

      {/* =====================================================
          PAGE CSS
      ===================================================== */}

      <style jsx global>{`
        html {
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background: #030711;
        }

        * {
          box-sizing: border-box;
        }

        button,
        a {
          -webkit-tap-highlight-color: transparent;
        }

        /* ===================================================
           BASE
        =================================================== */

        .client-shell {
          position: relative;
          min-height: 100vh;
          overflow-x: hidden;
          background:
            radial-gradient(
              circle at 70% 10%,
              rgba(30, 121, 255, 0.055),
              transparent 30%
            ),
            #030711;
          color: #e5edf7;
        }

        .client-content {
          position: relative;
          z-index: 2;
          min-height: 100vh;
          margin-left: 278px;
        }

        .client-page {
          position: relative;
          max-width: 1700px;
          margin: 0 auto;
          padding: 34px 42px 0;
        }

        /* ===================================================
           TECHNOLOGY BACKGROUND
        =================================================== */

        .tech-background {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
          background:
            radial-gradient(
              circle at 50% 10%,
              rgba(42, 139, 255, 0.07),
              transparent 34%
            ),
            linear-gradient(
              180deg,
              rgba(2, 7, 15, 0.1),
              rgba(2, 5, 10, 0.85)
            );
        }

        .tech-grid {
          position: absolute;
          inset: -30%;
          opacity: 0.18;
          background-image:
            linear-gradient(
              rgba(75, 159, 255, 0.06) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(75, 159, 255, 0.06) 1px,
              transparent 1px
            );
          background-size: 80px 80px;
          transform: perspective(900px)
            rotateX(62deg)
            translateY(30%);
          transform-origin: center;
          animation: gridMove 18s linear infinite;
        }

        .tech-grid-perspective {
          position: absolute;
          left: -10%;
          right: -10%;
          bottom: -30%;
          height: 70%;
          opacity: 0.2;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(57, 158, 255, 0.08),
              transparent
            ),
            repeating-linear-gradient(
              90deg,
              transparent 0,
              transparent 90px,
              rgba(57, 158, 255, 0.07) 91px,
              transparent 92px
            ),
            repeating-linear-gradient(
              0deg,
              transparent 0,
              transparent 70px,
              rgba(57, 158, 255, 0.07) 71px,
              transparent 72px
            );
          transform: perspective(700px)
            rotateX(58deg);
          animation: floorMove 16s linear infinite;
        }

        .tech-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.28;
        }

        .orb-one {
          width: 460px;
          height: 460px;
          top: -250px;
          right: -100px;
          background: rgba(0, 116, 255, 0.2);
          animation: orbFloatOne 15s ease-in-out infinite;
        }

        .orb-two {
          width: 420px;
          height: 420px;
          left: -250px;
          top: 38%;
          background: rgba(0, 200, 255, 0.08);
          animation: orbFloatTwo 18s ease-in-out infinite;
        }

        .orb-three {
          width: 300px;
          height: 300px;
          right: 15%;
          bottom: -160px;
          background: rgba(67, 85, 255, 0.08);
          animation: orbFloatThree 20s ease-in-out infinite;
        }

        .scan-line {
          position: absolute;
          left: -20%;
          width: 140%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(74, 176, 255, 0.55),
            rgba(74, 176, 255, 0.08),
            transparent
          );
          box-shadow: 0 0 18px rgba(42, 145, 255, 0.25);
        }

        .scan-one {
          top: 30%;
          animation: scanOne 10s linear infinite;
        }

        .scan-two {
          top: 75%;
          opacity: 0.4;
          animation: scanTwo 14s linear infinite;
        }

        .data-stream {
          position: absolute;
          color: rgba(89, 177, 255, 0.16);
          font-family: monospace;
          font-size: 8px;
          letter-spacing: 0.22em;
          white-space: nowrap;
        }

        .stream-one {
          top: 24%;
          left: -20%;
          animation: dataMove 24s linear infinite;
        }

        .stream-two {
          top: 57%;
          right: -30%;
          animation: dataMoveReverse 31s linear infinite;
        }

        .stream-three {
          bottom: 18%;
          left: -30%;
          animation: dataMove 37s linear infinite;
        }

        .network-network {
          position: absolute;
          inset: 0;
          opacity: 0.32;
        }

        .network-node {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #49aaff;
          box-shadow:
            0 0 8px #49aaff,
            0 0 24px rgba(73, 170, 255, 0.5);
          animation: nodePulse 2.8s ease-in-out infinite;
        }

        .node-one {
          left: 18%;
          top: 23%;
        }

        .node-two {
          left: 37%;
          top: 40%;
        }

        .node-three {
          left: 59%;
          top: 20%;
        }

        .node-four {
          left: 72%;
          top: 47%;
        }

        .node-five {
          left: 83%;
          top: 28%;
        }

        .node-six {
          left: 48%;
          top: 75%;
        }

        .network-line {
          position: absolute;
          height: 1px;
          transform-origin: left center;
          background: linear-gradient(
            90deg,
            rgba(56, 159, 255, 0),
            rgba(56, 159, 255, 0.2),
            rgba(56, 159, 255, 0)
          );
        }

        .line-one {
          left: 18%;
          top: 23%;
          width: 22%;
          transform: rotate(29deg);
        }

        .line-two {
          left: 37%;
          top: 40%;
          width: 28%;
          transform: rotate(-28deg);
        }

        .line-three {
          left: 59%;
          top: 20%;
          width: 22%;
          transform: rotate(22deg);
        }

        .line-four {
          left: 48%;
          top: 75%;
          width: 28%;
          transform: rotate(-42deg);
        }

        .tech-noise {
          position: absolute;
          inset: 0;
          opacity: 0.045;
          background-image: radial-gradient(
            rgba(255, 255, 255, 0.9) 0.45px,
            transparent 0.65px
          );
          background-size: 5px 5px;
          animation: noiseShift 0.8s steps(2) infinite;
        }

        .tech-vignette {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(
              circle at center,
              transparent 20%,
              rgba(1, 4, 10, 0.4) 75%,
              rgba(1, 4, 10, 0.8) 100%
            );
        }

        /* ===================================================
           SIDEBAR
        =================================================== */

        .client-sidebar {
          position: fixed;
          z-index: 50;
          left: 0;
          top: 0;
          bottom: 0;
          width: 278px;
          display: flex;
          flex-direction: column;
          padding: 25px 18px 18px;
          border-right: 1px solid rgba(255, 255, 255, 0.07);
          background:
            linear-gradient(
              180deg,
              rgba(7, 15, 28, 0.97),
              rgba(4, 9, 17, 0.96)
            );
          backdrop-filter: blur(25px);
          box-shadow:
            12px 0 50px rgba(0, 0, 0, 0.16);
        }

        .sidebar-brand {
          display: flex;
          flex-direction: column;
          padding: 3px 9px 0;
        }

        .sidebar-logo-link {
          display: inline-flex;
          width: fit-content;
          transition:
            transform 0.3s ease,
            filter 0.3s ease;
        }

        .sidebar-logo-link:hover {
          transform: translateY(-1px);
          filter: drop-shadow(
            0 0 20px rgba(44, 151, 255, 0.3)
          );
        }

        .sidebar-logo-link img {
          object-fit: contain;
          object-position: left center;
        }

        .sidebar-brand-label {
          display: flex;
          gap: 7px;
          margin-top: -3px;
          font-family: monospace;
          font-size: 7px;
          letter-spacing: 0.19em;
          color: #64748b;
        }

        .sidebar-brand-label span:first-child {
          color: #4daaff;
        }

        .sidebar-system {
          display: flex;
          align-items: center;
          gap: 7px;
          margin: 25px 8px 24px;
          padding: 9px 10px;
          border: 1px solid rgba(58, 160, 255, 0.1);
          border-radius: 9px;
          background: rgba(48, 157, 255, 0.035);
          font-family: monospace;
          font-size: 7px;
          letter-spacing: 0.16em;
          color: #64748b;
        }

        .sidebar-system-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #38e18a;
          box-shadow: 0 0 8px #38e18a;
        }

        .sidebar-system-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(
            90deg,
            rgba(54, 167, 255, 0.2),
            transparent
          );
        }

        .sidebar-section-label {
          margin: 0 10px 9px;
          color: #46566b;
          font-family: monospace;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.2em;
        }

        .sidebar-nav {
          display: grid;
          gap: 4px;
        }

        .sidebar-nav-item {
          position: relative;
          width: 100%;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 10px;
          border: 1px solid transparent;
          border-radius: 12px;
          background: transparent;
          color: #718096;
          text-align: left;
          cursor: pointer;
          transition:
            background 0.25s ease,
            color 0.25s ease,
            border-color 0.25s ease,
            transform 0.25s ease;
        }

        .sidebar-nav-item:hover {
          color: #dbeafe;
          background: rgba(255, 255, 255, 0.025);
          transform: translateX(2px);
        }

        .sidebar-nav-item.active {
          color: #dbeafe;
          border-color: rgba(58, 158, 255, 0.15);
          background:
            linear-gradient(
              90deg,
              rgba(31, 135, 255, 0.12),
              rgba(31, 135, 255, 0.025)
            );
          box-shadow:
            inset 3px 0 0 #278eff,
            0 8px 30px rgba(0, 0, 0, 0.08);
        }

        .sidebar-nav-icon {
          display: flex;
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.055);
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.025);
          color: #64748b;
          transition: all 0.25s ease;
        }

        .sidebar-nav-item.active
          .sidebar-nav-icon {
          border-color: rgba(54, 160, 255, 0.2);
          background: rgba(40, 145, 255, 0.1);
          color: #55b4ff;
          box-shadow: 0 0 20px rgba(36, 139, 255, 0.08);
        }

        .sidebar-nav-text {
          display: flex;
          min-width: 0;
          flex-direction: column;
          gap: 2px;
        }

        .sidebar-nav-text strong {
          font-size: 12px;
          font-weight: 600;
        }

        .sidebar-nav-text small {
          font-size: 9px;
          color: #4f5f73;
        }

        .sidebar-active-dot {
          width: 5px;
          height: 5px;
          margin-left: auto;
          border-radius: 50%;
          background: #46a8ff;
          box-shadow: 0 0 10px #46a8ff;
        }

        .sidebar-help {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: auto;
          padding: 12px;
          border: 1px solid rgba(59, 158, 255, 0.1);
          border-radius: 13px;
          background:
            linear-gradient(
              135deg,
              rgba(40, 140, 255, 0.07),
              rgba(40, 140, 255, 0.01)
            );
        }

        .sidebar-help-icon {
          display: flex;
          width: 32px;
          height: 32px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: rgba(40, 148, 255, 0.08);
          color: #55b4ff;
        }

        .sidebar-help > div:nth-child(2) {
          display: flex;
          min-width: 0;
          flex: 1;
          flex-direction: column;
        }

        .sidebar-help strong {
          font-size: 10px;
          color: #dbeafe;
        }

        .sidebar-help span {
          margin-top: 2px;
          font-size: 8px;
          color: #526277;
        }

        .sidebar-help a {
          display: flex;
          width: 27px;
          height: 27px;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          color: #4baaff;
          background: rgba(46, 152, 255, 0.07);
          transition: all 0.2s ease;
        }

        .sidebar-help a:hover {
          background: rgba(46, 152, 255, 0.14);
          transform: translateX(2px);
        }

        .sidebar-user {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .sidebar-avatar {
          display: flex;
          width: 39px;
          height: 39px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 1px solid rgba(61, 164, 255, 0.22);
          border-radius: 12px;
          background: rgba(43, 148, 255, 0.08);
          color: #9dd6ff;
          font-size: 10px;
          font-weight: 800;
        }

        .sidebar-user-info {
          display: flex;
          min-width: 0;
          flex: 1;
          flex-direction: column;
        }

        .sidebar-user-info strong {
          overflow: hidden;
          color: #e7effa;
          font-size: 10px;
          font-weight: 600;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .sidebar-user-info span {
          margin-top: 3px;
          overflow: hidden;
          color: #47566a;
          font-size: 8px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .sidebar-logout {
          display: flex;
          width: 31px;
          height: 31px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.02);
          color: #68778a;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .sidebar-logout:hover {
          border-color: rgba(248, 113, 113, 0.2);
          background: rgba(248, 113, 113, 0.05);
          color: #fca5a5;
        }

        /* ===================================================
           TOP BAR
        =================================================== */

        .client-topbar {
          position: sticky;
          top: 0;
          z-index: 30;
          display: flex;
          min-height: 82px;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 15px 42px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(3, 7, 17, 0.72);
          backdrop-filter: blur(22px);
        }

        .topbar-path {
          margin: 0;
          color: #526277;
          font-family: monospace;
          font-size: 8px;
          letter-spacing: 0.2em;
        }

        .topbar-path span {
          color: #3d9eff;
        }

        .topbar-title-row {
          display: flex;
          align-items: center;
          gap: 9px;
          margin-top: 4px;
        }

        .topbar-title-row h1 {
          margin: 0;
          color: #f3f7fc;
          font-size: 17px;
          font-weight: 650;
          letter-spacing: -0.02em;
        }

        .topbar-live {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 3px 6px;
          border: 1px solid rgba(54, 225, 138, 0.13);
          border-radius: 999px;
          color: #54d995;
          font-family: monospace;
          font-size: 6px;
          letter-spacing: 0.15em;
        }

        .topbar-live i {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #43dd8b;
          box-shadow: 0 0 8px #43dd8b;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .topbar-account-status {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 10px;
          border: 1px solid rgba(57, 211, 131, 0.1);
          border-radius: 9px;
          color: #5b6d80;
          font-family: monospace;
          font-size: 7px;
          letter-spacing: 0.13em;
        }

        .topbar-account-status span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #3bdd89;
          box-shadow: 0 0 8px #3bdd89;
        }

        .topbar-refresh {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 9px 12px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.025);
          color: #9aa9bb;
          font-size: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .topbar-refresh:hover {
          border-color: rgba(58, 158, 255, 0.25);
          color: #d8ebff;
          background: rgba(58, 158, 255, 0.05);
        }

        .topbar-refresh:disabled {
          cursor: wait;
          opacity: 0.5;
        }

        /* ===================================================
           ALERTS
        =================================================== */

        .client-alert {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 18px;
          padding: 14px;
          border-radius: 13px;
          backdrop-filter: blur(15px);
        }

        .client-alert.error {
          border: 1px solid rgba(248, 113, 113, 0.15);
          background: rgba(248, 113, 113, 0.035);
        }

        .client-alert.notice {
          border: 1px solid rgba(251, 191, 36, 0.15);
          background: rgba(251, 191, 36, 0.035);
        }

        .client-alert-icon {
          display: flex;
          width: 32px;
          height: 32px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.04);
        }

        .client-alert strong {
          color: #e6edf6;
          font-size: 11px;
        }

        .client-alert p {
          margin: 3px 0 0;
          color: #78879a;
          font-size: 10px;
          line-height: 1.6;
        }

        .client-alert button {
          margin-left: auto;
          border: 0;
          background: transparent;
          color: #66b8ff;
          font-size: 10px;
          font-weight: 600;
          cursor: pointer;
        }

        /* ===================================================
           HERO
        =================================================== */

        .hero-command {
          position: relative;
          min-height: 390px;
          display: grid;
          grid-template-columns: 1.15fr 0.85fr;
          overflow: hidden;
          border: 1px solid rgba(66, 166, 255, 0.13);
          border-radius: 23px;
          background:
            linear-gradient(
              115deg,
              rgba(10, 24, 43, 0.92),
              rgba(6, 14, 27, 0.78)
            );
          box-shadow:
            0 30px 90px rgba(0, 0, 0, 0.2),
            inset 0 1px rgba(255, 255, 255, 0.025);
        }

        .hero-command::before {
          position: absolute;
          inset: 0;
          content: "";
          background:
            linear-gradient(
              90deg,
              rgba(37, 142, 255, 0.04) 1px,
              transparent 1px
            ),
            linear-gradient(
              rgba(37, 142, 255, 0.04) 1px,
              transparent 1px
            );
          background-size: 45px 45px;
          mask-image: linear-gradient(
            90deg,
            black,
            transparent
          );
          opacity: 0.45;
        }

        .hero-command-grid {
          position: absolute;
          inset: 0;
          opacity: 0.15;
          background:
            radial-gradient(
              circle at 76% 50%,
              rgba(35, 150, 255, 0.25),
              transparent 24%
            );
        }

        .hero-command-content {
          position: relative;
          z-index: 2;
          align-self: center;
          padding: 55px 45px;
        }

        .hero-command-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 7px 10px;
          border: 1px solid rgba(61, 165, 255, 0.16);
          border-radius: 999px;
          background: rgba(43, 153, 255, 0.045);
          color: #6bbaff;
          font-family: monospace;
          font-size: 7px;
          font-weight: 700;
          letter-spacing: 0.2em;
        }

        .hero-command-badge span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #47a9ff;
          box-shadow: 0 0 9px #47a9ff;
        }

        .hero-command-small {
          margin: 29px 0 0;
          color: #53657a;
          font-family: monospace;
          font-size: 8px;
          letter-spacing: 0.26em;
        }

        .hero-command-content h2 {
          margin: 8px 0 0;
          color: #f7fbff;
          font-size: clamp(38px, 4vw, 62px);
          font-weight: 650;
          letter-spacing: -0.055em;
          line-height: 1;
        }

        .hero-command-content h2 span {
          color: #46a8ff;
          text-shadow: 0 0 25px rgba(70, 168, 255, 0.4);
        }

        .hero-command-description {
          max-width: 590px;
          margin: 20px 0 0;
          color: #75869b;
          font-size: 13px;
          line-height: 1.8;
        }

        .hero-command-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 25px;
        }

        .hero-command-meta span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 9px;
          border: 1px solid rgba(255, 255, 255, 0.055);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.02);
          color: #66778a;
          font-size: 8px;
        }

        .hero-command-meta span svg {
          color: #4aaaff;
        }

        .hero-command-visual {
          position: relative;
          min-height: 390px;
          overflow: hidden;
        }

        .hero-core {
          position: absolute;
          top: 50%;
          left: 50%;
          z-index: 4;
          display: flex;
          width: 150px;
          height: 150px;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 4px;
          transform: translate(-50%, -50%);
          border: 1px solid rgba(74, 171, 255, 0.22);
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(29, 132, 255, 0.14),
              rgba(3, 9, 18, 0.88) 65%
            );
          box-shadow:
            0 0 60px rgba(34, 140, 255, 0.08),
            inset 0 0 30px rgba(53, 158, 255, 0.05);
        }

        .hero-core img {
          object-fit: contain;
          opacity: 0.9;
          filter: drop-shadow(
            0 0 15px rgba(62, 165, 255, 0.2)
          );
        }

        .hero-core span {
          color: #4d9cda;
          font-family: monospace;
          font-size: 6px;
          letter-spacing: 0.2em;
        }

        .hero-orbit {
          position: absolute;
          top: 50%;
          left: 50%;
          border: 1px solid rgba(68, 166, 255, 0.11);
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        .orbit-a {
          width: 230px;
          height: 230px;
          animation: orbitRotate 16s linear infinite;
        }

        .orbit-b {
          width: 310px;
          height: 145px;
          transform: translate(-50%, -50%) rotate(40deg);
          animation: orbitRotateReverse 19s linear infinite;
        }

        .orbit-c {
          width: 350px;
          height: 350px;
          border-color: rgba(68, 166, 255, 0.05);
          animation: orbitRotate 25s linear infinite;
        }

        .hero-data-tag {
          position: absolute;
          z-index: 5;
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 7px 9px;
          border: 1px solid rgba(62, 165, 255, 0.13);
          border-radius: 7px;
          background: rgba(4, 11, 22, 0.75);
          backdrop-filter: blur(10px);
          color: #51667e;
          font-family: monospace;
          font-size: 6px;
          letter-spacing: 0.13em;
        }

        .hero-data-tag strong {
          color: #a9d8ff;
          font-size: 12px;
          letter-spacing: 0;
        }

        .tag-a {
          top: 23%;
          right: 12%;
        }

        .tag-b {
          right: 4%;
          bottom: 23%;
        }

        .tag-c {
          left: 7%;
          bottom: 19%;
        }

        /* ===================================================
           SECTION HEADINGS
        =================================================== */

        .section-mini-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 15px;
          margin: 40px 0 16px;
        }

        .section-mini-heading span:first-child {
          color: #4b9de0;
          font-family: monospace;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.22em;
        }

        .section-mini-heading h2 {
          margin: 5px 0 0;
          color: #eaf2fb;
          font-size: 19px;
          font-weight: 600;
        }

        .data-source {
          color: #415268 !important;
          font-family: monospace;
          font-size: 7px !important;
          letter-spacing: 0.14em;
        }

        .view-all-button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 0;
          background: transparent;
          color: #5aaeff;
          font-size: 9px;
          cursor: pointer;
        }

        /* ===================================================
           ANALYTICS
        =================================================== */

        .analytics-grid {
          display: grid;
          grid-template-columns: repeat(
            6,
            minmax(0, 1fr)
          );
          gap: 10px;
        }

        .analytics-card {
          position: relative;
          min-width: 0;
          overflow: hidden;
          padding: 17px;
          border: 1px solid rgba(255, 255, 255, 0.065);
          border-radius: 15px;
          background:
            linear-gradient(
              145deg,
              rgba(13, 25, 43, 0.78),
              rgba(7, 14, 25, 0.74)
            );
          box-shadow:
            0 15px 40px rgba(0, 0, 0, 0.09),
            inset 0 1px rgba(255, 255, 255, 0.025);
          transition:
            transform 0.25s ease,
            border-color 0.25s ease;
        }

        .analytics-card:hover {
          transform: translateY(-2px);
          border-color: rgba(61, 164, 255, 0.18);
        }

        .analytics-card-glow {
          position: absolute;
          width: 100px;
          height: 100px;
          top: -55px;
          right: -40px;
          border-radius: 50%;
          background: rgba(35, 145, 255, 0.09);
          filter: blur(25px);
        }

        .analytics-icon {
          display: flex;
          width: 34px;
          height: 34px;
          align-items: center;
          justify-content: center;
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.025);
        }

        .analytics-icon.blue {
          color: #54aaff;
        }

        .analytics-icon.cyan {
          color: #43d7e8;
        }

        .analytics-icon.violet {
          color: #a995ff;
        }

        .analytics-icon.green {
          color: #4ce098;
        }

        .analytics-icon.red {
          color: #ff7373;
        }

        .analytics-icon.amber {
          color: #e7b865;
        }

        /* ===================================================
           ANALYSIS PANELS
        =================================================== */

        .dashboard-analysis-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-top: 12px;
        }

        .data-panel {
          position: relative;
          overflow: hidden;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.065);
          border-radius: 16px;
          background: rgba(7, 15, 27, 0.72);
          backdrop-filter: blur(12px);
        }

        .data-panel-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          padding-bottom: 16px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.055);
        }

        .data-panel-heading > div:first-child
          span {
          color: #45647f;
          font-family: monospace;
          font-size: 7px;
          letter-spacing: 0.18em;
        }

        .data-panel-heading h3 {
          margin: 5px 0 0;
          color: #e8f0f8;
          font-size: 14px;
          font-weight: 600;
        }

        .data-panel-heading > svg {
          color: #459fe5;
        }

        .distribution {
          display: grid;
          gap: 17px;
          padding: 22px 0;
        }

        .distribution-row {
          display: grid;
          grid-template-columns: 90px 1fr 25px;
          align-items: center;
          gap: 10px;
        }

        .distribution-label {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #728197;
          font-size: 9px;
        }

        .distribution-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }

        .distribution-bar {
          height: 5px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.04);
        }

        .distribution-bar span {
          display: block;
          height: 100%;
          min-width: 2px;
          border-radius: inherit;
          box-shadow: 0 0 12px currentColor;
          transition: width 0.8s ease;
        }

        .distribution-row > strong {
          color: #dbe7f4;
          font-size: 10px;
          text-align: right;
        }

        .analysis-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          color: #516177;
          font-size: 8px;
        }

        .analysis-footer strong {
          color: #d5e6f8;
          font-size: 11px;
        }

        .progress-number {
          color: #55b0ff;
          font-family: monospace;
          font-size: 16px;
        }

        .progress-visual {
          display: flex;
          align-items: center;
          gap: 35px;
          padding: 22px 10px 10px;
        }

        .progress-circle {
          display: flex;
          width: 130px;
          height: 130px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          position: relative;
        }

        .progress-circle::before {
          position: absolute;
          inset: 5px;
          content: "";
          border-radius: inherit;
          background: #08121f;
        }

        .progress-circle > div {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          flex-direction: column;
        }

        .progress-circle strong {
          color: #eaf5ff;
          font-size: 22px;
        }

        .progress-circle span {
          color: #526579;
          font-family: monospace;
          font-size: 6px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .progress-details {
          display: grid;
          flex: 1;
          gap: 13px;
        }

        .progress-details > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding-bottom: 9px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          color: #6d7c8f;
          font-size: 9px;
        }

        .progress-details span {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .progress-details strong {
          color: #d8e5f2;
          font-size: 11px;
        }

        .green-dot,
        .blue-dot,
        .red-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }

        .green-dot {
          background: #3edb91;
        }

        .blue-dot {
          background: #3fa7ff;
        }

        .red-dot {
          background: #fa6d6d;
        }

        /* ===================================================
           PROJECT TABLE
        =================================================== */

        .project-table {
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.065);
          border-radius: 16px;
          background: rgba(7, 15, 27, 0.72);
        }

        .project-table-header,
        .project-table-row {
          display: grid;
          grid-template-columns: minmax(230px, 2fr) 1fr 1fr 1fr;
          align-items: center;
          gap: 20px;
          padding: 13px 18px;
        }

        .project-table-header {
          border-bottom: 1px solid rgba(255, 255, 255, 0.055);
          color: #45576c;
          font-family: monospace;
          font-size: 7px;
          letter-spacing: 0.17em;
        }

        .project-table-row {
          min-height: 73px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          transition: background 0.2s ease;
        }

        .project-table-row:last-child {
          border-bottom: 0;
        }

        .project-table-row:hover {
          background: rgba(255, 255, 255, 0.015);
        }

        .project-name-cell {
          display: flex;
          align-items: center;
          min-width: 0;
          gap: 11px;
        }

        .project-index {
          display: flex;
          width: 30px;
          height: 30px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(55, 155, 255, 0.11);
          border-radius: 8px;
          background: rgba(40, 150, 255, 0.04);
          color: #579bd1;
          font-family: monospace;
          font-size: 8px;
        }

        .project-name-cell > div:last-child {
          display: flex;
          min-width: 0;
          flex-direction: column;
        }

        .project-name-cell strong {
          overflow: hidden;
          color: #dce8f5;
          font-size: 10px;
          font-weight: 600;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .project-name-cell span {
          margin-top: 4px;
          color: #4c5e72;
          font-size: 7px;
        }

        .table-muted,
        .table-money {
          color: #8291a3;
          font-size: 9px;
        }

        .table-money {
          color: #a6c4dc;
        }

        /* ===================================================
           DEADLINES
        =================================================== */

        .deadline-list {
          display: grid;
          gap: 3px;
          padding-top: 8px;
        }

        .deadline-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .deadline-icon {
          display: flex;
          width: 30px;
          height: 30px;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: rgba(51, 157, 255, 0.06);
          color: #4faeff;
        }

        .deadline-info {
          display: flex;
          min-width: 0;
          flex: 1;
          flex-direction: column;
        }

        .deadline-info strong {
          overflow: hidden;
          color: #cddbea;
          font-size: 9px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .deadline-info span {
          margin-top: 3px;
          color: #4e6074;
          font-size: 7px;
        }

        .priority {
          padding: 4px 7px;
          border-radius: 5px;
          font-family: monospace;
          font-size: 6px;
          text-transform: uppercase;
        }

        .priority-high {
          color: #ff8b8b;
          background: rgba(255, 91, 91, 0.07);
        }

        .priority-medium {
          color: #e4bc69;
          background: rgba(228, 188, 105, 0.06);
        }

        .priority-low {
          color: #67c7a1;
          background: rgba(67, 200, 153, 0.06);
        }

        .signal-list {
          display: grid;
          gap: 0;
          padding-top: 8px;
        }

        .signal-list > div {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          color: #647489;
          font-size: 9px;
        }

        .signal-list strong {
          color: #bdcede;
          font-size: 9px;
          font-weight: 600;
        }

        .signal-ok {
          color: #4fd997 !important;
        }

        .signal-warning {
          color: #e6ba64 !important;
        }

        /* ===================================================
           EMPTY
        =================================================== */

        .empty-state {
          display: flex;
          min-height: 230px;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          padding: 30px;
          border: 1px dashed rgba(65, 158, 255, 0.13);
          border-radius: 16px;
          background: rgba(7, 15, 27, 0.5);
          text-align: center;
        }

        .empty-state > div {
          display: flex;
          width: 48px;
          height: 48px;
          align-items: center;
          justify-content: center;
          border-radius: 13px;
          background: rgba(45, 152, 255, 0.07);
          color: #4caaff;
        }

        .empty-state h3 {
          margin: 15px 0 0;
          color: #dce7f3;
          font-size: 13px;
        }

        .empty-state p {
          max-width: 480px;
          margin: 7px 0 0;
          color: #596a7d;
          font-size: 10px;
          line-height: 1.7;
        }

        .full-span {
          grid-column: 1 / -1;
        }

        .small-empty {
          padding: 25px 10px;
          color: #526277;
          font-size: 9px;
          text-align: center;
        }

        /* ===================================================
           PREMIUM PROJECT CARDS
        =================================================== */

        .project-cards-grid {
          display: grid;
          grid-template-columns: repeat(
            2,
            minmax(0, 1fr)
          );
          gap: 13px;
          margin-top: 22px;
        }

        .premium-project-card {
          position: relative;
          overflow: hidden;
          padding: 21px;
          border: 1px solid rgba(255, 255, 255, 0.065);
          border-radius: 17px;
          background:
            linear-gradient(
              145deg,
              rgba(12, 25, 43, 0.82),
              rgba(5, 12, 22, 0.76)
            );
          transition:
            transform 0.25s ease,
            border-color 0.25s ease;
        }

        .premium-project-card:hover {
          transform: translateY(-3px);
          border-color: rgba(53, 158, 255, 0.2);
        }

        .premium-project-topline {
          position: absolute;
          top: 0;
          left: 0;
          width: 45%;
          height: 2px;
          background: linear-gradient(
            90deg,
            #2f9bff,
            transparent
          );
          box-shadow: 0 0 15px rgba(47, 155, 255, 0.3);
        }

        .premium-project-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .project-index-large {
          display: flex;
          width: 38px;
          height: 38px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(52, 157, 255, 0.12);
          border-radius: 10px;
          background: rgba(47, 155, 255, 0.045);
          color: #4f9bd2;
          font-family: monospace;
          font-size: 9px;
        }

        .premium-project-card h3 {
          margin: 19px 0 0;
          color: #eaf2fa;
          font-size: 15px;
          font-weight: 600;
        }

        .premium-project-description {
          min-height: 50px;
          margin: 8px 0 0;
          color: #657589;
          font-size: 10px;
          line-height: 1.7;
        }

        .project-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 9px;
          margin-top: 18px;
        }

        .project-metrics > div {
          padding: 10px;
          border: 1px solid rgba(255, 255, 255, 0.045);
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.018);
        }

        .project-metrics span {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #455a70;
          font-family: monospace;
          font-size: 6px;
          letter-spacing: 0.12em;
        }

        .project-metrics span svg {
          color: #429de4;
        }

        .project-metrics strong {
          display: block;
          margin-top: 6px;
          overflow: hidden;
          color: #adc2d6;
          font-size: 9px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .project-card-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 15px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.045);
          color: #425267;
          font-size: 7px;
        }

        .project-live-dot {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-family: monospace;
          letter-spacing: 0.1em;
        }

        .project-live-dot i {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #43d88d;
          box-shadow: 0 0 7px #43d88d;
        }

        /* ===================================================
           TASKS
        =================================================== */

        .tasks-panel {
          overflow: hidden;
          margin-top: 22px;
          border: 1px solid rgba(255, 255, 255, 0.065);
          border-radius: 17px;
          background: rgba(7, 15, 27, 0.72);
        }

        .tasks-panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          padding: 19px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.055);
        }

        .tasks-panel-header span {
          color: #45647f;
          font-family: monospace;
          font-size: 7px;
          letter-spacing: 0.18em;
        }

        .tasks-panel-header h3 {
          margin: 5px 0 0;
          color: #e5eef8;
          font-size: 14px;
        }

        .task-completion-mini {
          color: #506276;
          font-family: monospace;
          font-size: 7px;
          text-align: right;
        }

        .task-completion-mini strong {
          color: #56aeff;
          font-size: 15px;
        }

        .task-row {
          display: flex;
          align-items: flex-start;
          gap: 13px;
          padding: 17px 19px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.04);
          transition: background 0.2s ease;
        }

        .task-row:hover {
          background: rgba(255, 255, 255, 0.012);
        }

        .task-state {
          display: flex;
          width: 33px;
          height: 33px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(65, 161, 255, 0.12);
          border-radius: 9px;
          background: rgba(45, 152, 255, 0.045);
          color: #56adf7;
        }

        .task-state.completed {
          border-color: rgba(53, 219, 142, 0.14);
          background: rgba(53, 219, 142, 0.05);
          color: #4cdb93;
        }

        .task-state.overdue {
          border-color: rgba(250, 109, 109, 0.14);
          background: rgba(250, 109, 109, 0.05);
          color: #fb8585;
        }

        .task-main {
          min-width: 0;
          flex: 1;
        }

        .task-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .task-title-row h4 {
          margin: 0;
          color: #dce8f4;
          font-size: 10px;
          font-weight: 600;
        }

        .task-main > p {
          margin: 5px 0 0;
          color: #5d6e81;
          font-size: 9px;
          line-height: 1.7;
        }

        .task-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 13px;
          margin-top: 8px;
          color: #45576c;
          font-size: 7px;
        }

        .task-meta span {
          display: inline-flex;
          align-items: center;
          gap: 4px;
        }

        .task-meta svg {
          color: #4a9ddd;
        }

        .task-priority {
          flex-shrink: 0;
          padding: 5px 7px;
          border-radius: 6px;
          font-family: monospace;
          font-size: 6px;
          text-transform: uppercase;
        }

        /* ===================================================
           PROFILE
        =================================================== */

        .profile-command-card {
          position: relative;
          min-height: 240px;
          overflow: hidden;
          padding: 32px;
          border: 1px solid rgba(63, 161, 255, 0.13);
          border-radius: 20px;
          background:
            linear-gradient(
              120deg,
              rgba(11, 27, 47, 0.9),
              rgba(5, 12, 22, 0.76)
            );
        }

        .profile-command-background {
          position: absolute;
          inset: 0;
          opacity: 0.22;
          background:
            linear-gradient(
              90deg,
              rgba(56, 161, 255, 0.06) 1px,
              transparent 1px
            ),
            linear-gradient(
              rgba(56, 161, 255, 0.06) 1px,
              transparent 1px
            );
          background-size: 45px 45px;
          mask-image: linear-gradient(
            90deg,
            black,
            transparent
          );
        }

        .profile-main {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 22px;
        }

        .profile-avatar-large {
          display: flex;
          width: 100px;
          height: 100px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 1px solid rgba(68, 169, 255, 0.25);
          border-radius: 29px;
          background:
            radial-gradient(
              circle,
              rgba(48, 150, 255, 0.15),
              rgba(48, 150, 255, 0.035)
            );
          color: #9cd5ff;
          font-size: 24px;
          font-weight: 700;
          box-shadow:
            0 0 50px rgba(36, 143, 255, 0.08);
        }

        .profile-command-label {
          color: #4e9fdf;
          font-family: monospace;
          font-size: 7px;
          letter-spacing: 0.2em;
        }

        .profile-main h2 {
          margin: 7px 0 0;
          color: #f2f7fb;
          font-size: 29px;
          font-weight: 600;
          letter-spacing: -0.035em;
        }

        .profile-main p {
          margin: 5px 0 0;
          color: #64758a;
          font-size: 10px;
        }

        .profile-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-top: 12px;
          padding: 6px 8px;
          border: 1px solid rgba(60, 219, 142, 0.1);
          border-radius: 6px;
          color: #4dce91;
          font-family: monospace;
          font-size: 6px;
          letter-spacing: 0.1em;
        }

        .profile-status span {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #46db90;
          box-shadow: 0 0 8px #46db90;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: repeat(
            3,
            minmax(0, 1fr)
          );
          gap: 10px;
          margin-top: 13px;
        }

        .profile-info-panel {
          display: flex;
          min-height: 100px;
          flex-direction: column;
          justify-content: center;
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.055);
          border-radius: 14px;
          background: rgba(7, 15, 27, 0.68);
        }

        .profile-info-panel span {
          color: #44566b;
          font-family: monospace;
          font-size: 7px;
          letter-spacing: 0.16em;
        }

        .profile-info-panel strong {
          margin-top: 9px;
          overflow: hidden;
          color: #b9cadb;
          font-size: 10px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .profile-green {
          color: #4cda93 !important;
        }

        .contact-command {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-top: 13px;
          padding: 21px;
          border: 1px solid rgba(61, 164, 255, 0.11);
          border-radius: 15px;
          background:
            linear-gradient(
              100deg,
              rgba(40, 143, 255, 0.07),
              rgba(40, 143, 255, 0.015)
            );
        }

        .contact-command > div:first-child > span {
          color: #4e9fdf;
          font-family: monospace;
          font-size: 7px;
          letter-spacing: 0.2em;
        }

        .contact-command h3 {
          margin: 6px 0 0;
          color: #e4eef8;
          font-size: 15px;
        }

        .contact-command p {
          margin: 5px 0 0;
          color: #5e7085;
          font-size: 9px;
        }

        .contact-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .contact-button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 13px;
          border-radius: 9px;
          font-size: 9px;
          text-decoration: none;
          transition: all 0.2s ease;
        }

        .contact-button.whatsapp {
          border: 1px solid rgba(55, 215, 139, 0.17);
          background: rgba(55, 215, 139, 0.06);
          color: #55d99a;
        }

        .contact-button.email {
          border: 1px solid rgba(60, 160, 255, 0.16);
          background: rgba(60, 160, 255, 0.06);
          color: #64b5ff;
        }

        .contact-button:hover {
          transform: translateY(-1px);
        }

        /* ===================================================
           TECHNOLOGY
        =================================================== */

        .technology-intro {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 30px;
          min-height: 230px;
          overflow: hidden;
          padding: 32px;
          border: 1px solid rgba(60, 162, 255, 0.12);
          border-radius: 19px;
          background:
            linear-gradient(
              115deg,
              rgba(10, 26, 44, 0.88),
              rgba(5, 12, 22, 0.72)
            );
        }

        .technology-intro-grid {
          position: absolute;
          inset: 0;
          opacity: 0.18;
          background:
            linear-gradient(
              90deg,
              rgba(55, 157, 255, 0.08) 1px,
              transparent 1px
            ),
            linear-gradient(
              rgba(55, 157, 255, 0.08) 1px,
              transparent 1px
            );
          background-size: 55px 55px;
        }

        .technology-intro > div:first-child:not(
            .technology-intro-grid
          ) {
          position: relative;
          z-index: 2;
        }

        .technology-intro span {
          color: #50a8ec;
          font-family: monospace;
          font-size: 7px;
          letter-spacing: 0.2em;
        }

        .technology-intro h2 {
          max-width: 650px;
          margin: 9px 0 0;
          color: #edf5fb;
          font-size: 32px;
          font-weight: 600;
          letter-spacing: -0.045em;
        }

        .technology-intro h2 strong {
          display: block;
          color: #51adff;
          font-weight: inherit;
          text-shadow: 0 0 35px rgba(51, 159, 255, 0.16);
        }

        .technology-intro p {
          max-width: 580px;
          margin: 10px 0 0;
          color: #617389;
          font-size: 10px;
          line-height: 1.8;
        }

        .technology-core {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          flex-direction: column;
          gap: 8px;
          padding-right: 25px;
        }

        .technology-core > div {
          display: flex;
          width: 100px;
          height: 100px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(65, 167, 255, 0.2);
          border-radius: 50%;
          color: #4baaff;
          background:
            radial-gradient(
              circle,
              rgba(48, 152, 255, 0.11),
              transparent 65%
            );
          box-shadow:
            0 0 60px rgba(42, 145, 255, 0.07),
            inset 0 0 20px rgba(42, 145, 255, 0.06);
          animation: technologyPulse 3.5s ease-in-out infinite;
        }

        .technology-core span {
          font-size: 6px;
        }

        .technology-grid {
          display: grid;
          grid-template-columns: repeat(
            2,
            minmax(0, 1fr)
          );
          gap: 12px;
          margin-top: 13px;
        }

        .technology-card {
          position: relative;
          overflow: hidden;
          min-height: 230px;
          display: flex;
          flex-direction: column;
          padding: 21px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          background: rgba(7, 15, 27, 0.73);
          transition:
            transform 0.25s ease,
            border-color 0.25s ease;
        }

        .technology-card:hover {
          transform: translateY(-3px);
          border-color: rgba(56, 158, 255, 0.2);
        }

        .technology-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .technology-code {
          display: flex;
          width: 39px;
          height: 39px;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(58, 159, 255, 0.15);
          border-radius: 10px;
          background: rgba(48, 151, 255, 0.05);
          color: #58aeed !important;
          font-family: monospace;
          font-size: 7px !important;
          font-weight: 800;
          letter-spacing: 0 !important;
        }

        .technology-external {
          color: #435469 !important;
          font-family: monospace;
          font-size: 6px !important;
          letter-spacing: 0.14em !important;
        }

        .technology-category {
          margin-top: 24px;
          color: #4d9ddd !important;
          font-family: monospace;
          font-size: 7px !important;
          letter-spacing: 0.17em !important;
        }

        .technology-card h3 {
          margin: 6px 0 0;
          color: #e4edf6;
          font-size: 14px;
        }

        .technology-card p {
          flex: 1;
          margin: 7px 0 0;
          color: #5f7084;
          font-size: 9px;
          line-height: 1.75;
        }

        .technology-card a {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          gap: 7px;
          margin-top: 18px;
          color: #55acfa;
          font-size: 9px;
          font-weight: 600;
          text-decoration: none;
        }

        /* ===================================================
           SOCIAL
        =================================================== */

        .social-command {
          position: relative;
          overflow: hidden;
          margin-top: 65px;
          padding: 27px;
          border-top: 1px solid rgba(66, 163, 255, 0.13);
          border-bottom: 1px solid rgba(66, 163, 255, 0.1);
          background:
            linear-gradient(
              90deg,
              rgba(23, 117, 220, 0.045),
              transparent 45%,
              rgba(23, 117, 220, 0.035)
            );
        }

        .social-command::before {
          position: absolute;
          inset: 0;
          content: "";
          opacity: 0.18;
          background:
            linear-gradient(
              90deg,
              rgba(65, 160, 255, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(
              rgba(65, 160, 255, 0.05) 1px,
              transparent 1px
            );
          background-size: 45px 45px;
          mask-image: linear-gradient(
            90deg,
            black,
            transparent 75%
          );
        }

        .social-command-top {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
        }

        .social-command-top span {
          color: #4d9fe0;
          font-family: monospace;
          font-size: 7px;
          letter-spacing: 0.22em;
        }

        .social-command-top h2 {
          margin: 5px 0 0;
          color: #e8f2fb;
          font-size: 22px;
          font-weight: 600;
        }

        .social-command-top p {
          margin: 6px 0 0;
          color: #586a7e;
          font-size: 9px;
        }

        .social-command-code {
          color: #334c65;
          font-family: monospace;
          font-size: 7px;
          line-height: 1.8;
          text-align: right;
        }

        .social-links-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: repeat(
            6,
            minmax(0, 1fr)
          );
          gap: 7px;
          margin-top: 20px;
        }

        .social-link {
          display: flex;
          min-width: 0;
          align-items: center;
          gap: 8px;
          padding: 10px;
          border: 1px solid rgba(255, 255, 255, 0.055);
          border-radius: 10px;
          background: rgba(3, 9, 17, 0.45);
          color: #64758a;
          text-decoration: none;
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease,
            color 0.2s ease;
        }

        .social-link:hover {
          transform: translateY(-2px);
          border-color: rgba(67, 164, 255, 0.2);
          background: rgba(44, 151, 255, 0.05);
          color: #d8eaff;
        }

        .social-icon {
          display: flex;
          width: 31px;
          height: 31px;
          flex-shrink: 0;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.035);
          color: #64b3f3;
        }

        .social-link > span:nth-child(2) {
          display: flex;
          min-width: 0;
          flex: 1;
          flex-direction: column;
        }

        .social-link strong {
          color: #aebfd0;
          font-size: 8px;
          font-weight: 600;
        }

        .social-link small {
          overflow: hidden;
          margin-top: 2px;
          color: #46576a;
          font-size: 6px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .social-link > svg {
          color: #43566b;
        }

        .social-whatsapp .social-icon {
          color: #4bda92;
          background: rgba(58, 214, 140, 0.05);
        }

        /* ===================================================
           FOOTER
        =================================================== */

        .client-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          padding: 24px 0 30px;
          color: #425165;
          font-size: 8px;
        }

        .client-footer > div {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .client-footer img {
          width: 88px;
          height: auto;
          opacity: 0.65;
        }

        .client-footer > div span {
          font-family: monospace;
          font-size: 6px;
          letter-spacing: 0.16em;
        }

        .client-footer p {
          margin: 0;
        }

        .client-footer a {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #4e8fca;
          text-decoration: none;
        }

        /* ===================================================
           WELCOME
        =================================================== */

        .welcome-overlay {
          position: fixed;
          z-index: 200;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 25px;
          background:
            radial-gradient(
              circle at center,
              rgba(10, 31, 54, 0.35),
              rgba(1, 4, 10, 0.94) 70%
            );
          backdrop-filter: blur(18px);
          animation: welcomeAppear 0.7s ease both;
        }

        .welcome-panel {
          position: relative;
          width: min(780px, 100%);
          overflow: hidden;
          padding: 55px 50px 40px;
          border: 1px solid rgba(68, 167, 255, 0.2);
          border-radius: 25px;
          background:
            radial-gradient(
              circle at 50% 20%,
              rgba(43, 153, 255, 0.07),
              transparent 38%
            ),
            linear-gradient(
              145deg,
              rgba(8, 20, 36, 0.96),
              rgba(3, 9, 18, 0.98)
            );
          box-shadow:
            0 50px 140px rgba(0, 0, 0, 0.5),
            0 0 100px rgba(28, 128, 255, 0.07);
          text-align: center;
        }

        .welcome-panel::before {
          position: absolute;
          inset: 0;
          content: "";
          opacity: 0.25;
          background:
            linear-gradient(
              90deg,
              rgba(65, 160, 255, 0.06) 1px,
              transparent 1px
            ),
            linear-gradient(
              rgba(65, 160, 255, 0.06) 1px,
              transparent 1px
            );
          background-size: 50px 50px;
          mask-image: linear-gradient(
            180deg,
            black,
            transparent
          );
        }

        .welcome-corner {
          position: absolute;
          width: 32px;
          height: 32px;
          border-color: rgba(69, 170, 255, 0.45);
        }

        .corner-tl {
          top: 16px;
          left: 16px;
          border-top: 1px solid;
          border-left: 1px solid;
        }

        .corner-tr {
          top: 16px;
          right: 16px;
          border-top: 1px solid;
          border-right: 1px solid;
        }

        .corner-bl {
          bottom: 16px;
          left: 16px;
          border-bottom: 1px solid;
          border-left: 1px solid;
        }

        .corner-br {
          right: 16px;
          bottom: 16px;
          border-right: 1px solid;
          border-bottom: 1px solid;
        }

        .welcome-status {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 7px 10px;
          border: 1px solid rgba(59, 219, 143, 0.13);
          border-radius: 999px;
          color: #53c88f;
          font-family: monospace;
          font-size: 7px;
          letter-spacing: 0.2em;
        }

        .status-pulse {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #42db8e;
          box-shadow: 0 0 9px #42db8e;
          animation: statusPulse 1.5s ease-in-out infinite;
        }

        .welcome-logo {
          position: relative;
          display: flex;
          justify-content: center;
          margin-top: 35px;
          filter: drop-shadow(
            0 0 30px rgba(42, 149, 255, 0.18)
          );
        }

        .welcome-logo img {
          object-fit: contain;
        }

        .welcome-eyebrow {
          position: relative;
          margin: 21px 0 0;
          color: #438fc9;
          font-family: monospace;
          font-size: 7px;
          letter-spacing: 0.28em;
        }

        .welcome-panel h1 {
          position: relative;
          display: flex;
          margin: 16px 0 0;
          align-items: center;
          flex-direction: column;
          color: #eef6ff;
          font-size: clamp(31px, 5vw, 51px);
          font-weight: 600;
          letter-spacing: -0.05em;
        }

        .welcome-panel h1 span {
          margin-top: 5px;
          color: #50abff;
          text-shadow: 0 0 30px rgba(55, 163, 255, 0.18);
        }

        .welcome-description {
          position: relative;
          max-width: 570px;
          margin: 18px auto 0;
          color: #66788d;
          font-size: 11px;
          line-height: 1.9;
        }

        .welcome-button {
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: 29px;
          padding: 12px 18px;
          border: 1px solid rgba(66, 167, 255, 0.25);
          border-radius: 10px;
          background:
            linear-gradient(
              135deg,
              rgba(41, 147, 255, 0.16),
              rgba(41, 147, 255, 0.04)
            );
          color: #bde3ff;
          font-family: monospace;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.15em;
          cursor: pointer;
          box-shadow:
            0 0 30px rgba(37, 142, 255, 0.06);
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease;
        }

        .welcome-button:hover {
          transform: translateY(-2px);
          border-color: rgba(67, 170, 255, 0.42);
          background: rgba(45, 151, 255, 0.12);
        }

        .welcome-meta {
          position: relative;
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 16px;
          margin-top: 35px;
          padding-top: 18px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .welcome-meta span {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #3f5165;
          font-family: monospace;
          font-size: 6px;
          letter-spacing: 0.12em;
        }

        .welcome-meta i {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #3dbd80;
          box-shadow: 0 0 6px #3dbd80;
        }

        /* ===================================================
           MOBILE
        =================================================== */

        .mobile-header {
          display: none;
        }

        /* ===================================================
           VIEW ANIMATION
        =================================================== */

        .view-enter {
          animation: viewEnter 0.35s ease both;
        }

        /* ===================================================
           KEYFRAMES
        =================================================== */

        @keyframes gridMove {
          from {
            transform:
              perspective(900px)
              rotateX(62deg)
              translateY(30%);
          }
          to {
            transform:
              perspective(900px)
              rotateX(62deg)
              translateY(35%);
          }
        }

        @keyframes floorMove {
          from {
            background-position: 0 0, 0 0, 0 0;
          }
          to {
            background-position: 0 0, 90px 0, 0 70px;
          }
        }

        @keyframes orbFloatOne {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-70px, 45px);
          }
        }

        @keyframes orbFloatTwo {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(65px, -50px);
          }
        }

        @keyframes orbFloatThree {
          0%,
          100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(-45px, -30px);
          }
        }

        @keyframes scanOne {
          from {
            transform: translateY(-20vh);
          }
          to {
            transform: translateY(100vh);
          }
        }

        @keyframes scanTwo {
          from {
            transform: translateY(90vh);
          }
          to {
            transform: translateY(-20vh);
          }
        }

        @keyframes dataMove {
          from {
            transform: translateX(-20%);
          }
          to {
            transform: translateX(160%);
          }
        }

        @keyframes dataMoveReverse {
          from {
            transform: translateX(130%);
          }
          to {
            transform: translateX(-160%);
          }
        }

        @keyframes nodePulse {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.4);
          }
        }

        @keyframes noiseShift {
          0% {
            transform: translate(0);
          }
          25% {
            transform: translate(2px, -1px);
          }
          50% {
            transform: translate(-1px, 2px);
          }
          75% {
            transform: translate(1px, 1px);
          }
          100% {
            transform: translate(0);
          }
        }

        @keyframes orbitRotate {
          from {
            transform: translate(-50%, -50%) rotate(0);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes orbitRotateReverse {
          from {
            transform: translate(-50%, -50%) rotate(40deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(-320deg);
          }
        }

        @keyframes technologyPulse {
          0%,
          100% {
            transform: scale(1);
            box-shadow:
              0 0 60px rgba(42, 145, 255, 0.07),
              inset 0 0 20px rgba(42, 145, 255, 0.06);
          }
          50% {
            transform: scale(1.035);
            box-shadow:
              0 0 80px rgba(42, 145, 255, 0.13),
              inset 0 0 30px rgba(42, 145, 255, 0.08);
          }
        }

        @keyframes welcomeAppear {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes statusPulse {
          0%,
          100% {
            opacity: 0.45;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }

        @keyframes viewEnter {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* ===================================================
           RESPONSIVE
        =================================================== */

        @media (max-width: 1400px) {
          .analytics-grid {
            grid-template-columns: repeat(
              3,
              minmax(0, 1fr)
            );
          }

          .social-links-grid {
            grid-template-columns: repeat(
              3,
              minmax(0, 1fr)
            );
          }
        }

        @media (max-width: 1100px) {
          .client-sidebar {
            width: 235px;
          }

          .client-content {
            margin-left: 235px;
          }

          .client-topbar {
            padding-left: 27px;
            padding-right: 27px;
          }

          .client-page {
            padding-left: 27px;
            padding-right: 27px;
          }

          .hero-command {
            grid-template-columns: 1fr;
          }

          .hero-command-visual {
            min-height: 260px;
          }

          .hero-command-content {
            padding-bottom: 25px;
          }

          .dashboard-analysis-grid {
            grid-template-columns: 1fr;
          }

          .project-cards-grid {
            grid-template-columns: 1fr;
          }

          .profile-grid {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
          }

          .social-links-grid {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
          }
        }

        @media (max-width: 850px) {
          .client-sidebar {
            transform: translateX(-105%);
            transition: transform 0.3s ease;
            box-shadow: 25px 0 70px rgba(0, 0, 0, 0.35);
          }

          .client-sidebar.mobile-open {
            transform: translateX(0);
          }

          .client-content {
            margin-left: 0;
          }

          .mobile-header {
            position: sticky;
            top: 0;
            z-index: 80;
            display: flex;
            height: 62px;
            align-items: center;
            justify-content: space-between;
            padding: 0 17px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
            background: rgba(3, 7, 17, 0.88);
            backdrop-filter: blur(20px);
          }

          .mobile-menu-button {
            display: flex;
            width: 35px;
            height: 35px;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            gap: 4px;
            border: 1px solid rgba(255, 255, 255, 0.07);
            border-radius: 9px;
            background: rgba(255, 255, 255, 0.025);
            cursor: pointer;
          }

          .mobile-menu-button span {
            width: 14px;
            height: 1px;
            background: #7191ad;
          }

          .mobile-logo {
            width: 105px;
            height: auto;
            object-fit: contain;
          }

          .mobile-status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: #40db8d;
            box-shadow: 0 0 10px #40db8d;
          }

          .client-topbar {
            position: relative;
            padding: 16px 17px;
          }

          .topbar-account-status {
            display: none;
          }

          .client-page {
            padding: 22px 17px 0;
          }

          .hero-command-content {
            padding: 35px 25px 10px;
          }

          .hero-command-visual {
            min-height: 230px;
          }

          .analytics-grid {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
          }

          .project-table-header {
            display: none;
          }

          .project-table-row {
            grid-template-columns: 1fr auto;
            gap: 10px;
          }

          .project-table-row > :nth-child(3),
          .project-table-row > :nth-child(4) {
            display: none;
          }

          .technology-grid {
            grid-template-columns: 1fr;
          }

          .technology-intro {
            align-items: flex-start;
          }

          .technology-core {
            display: none;
          }

          .social-command-top {
            align-items: flex-start;
            flex-direction: column;
          }

          .social-command-code {
            text-align: left;
          }
        }

        @media (max-width: 600px) {
          .topbar-title-row h1 {
            font-size: 14px;
          }

          .topbar-path {
            font-size: 6px;
          }

          .topbar-live {
            display: none;
          }

          .topbar-refresh {
            padding: 8px;
          }

          .topbar-refresh svg {
            margin: 0;
          }

          .topbar-refresh {
            font-size: 0;
          }

          .topbar-refresh svg {
            width: 16px;
            height: 16px;
          }

          .analytics-grid {
            grid-template-columns: 1fr 1fr;
            gap: 7px;
          }

          .analytics-card {
            padding: 13px;
          }

          .analytics-card p.text {
            font-size: 9px;
          }

          .hero-command {
            min-height: 520px;
          }

          .hero-command-content h2 {
            font-size: 38px;
          }

          .hero-command-description {
            font-size: 10px;
          }

          .hero-command-meta {
            gap: 5px;
          }

          .hero-command-meta span {
            font-size: 7px;
          }

          .hero-command-visual {
            min-height: 220px;
          }

          .hero-core {
            width: 115px;
            height: 115px;
          }

          .hero-core img {
            width: 110px;
          }

          .orbit-a {
            width: 190px;
            height: 190px;
          }

          .orbit-b {
            width: 245px;
            height: 110px;
          }

          .orbit-c {
            width: 270px;
            height: 270px;
          }

          .hero-data-tag {
            font-size: 5px;
          }

          .hero-data-tag strong {
            font-size: 10px;
          }

          .tag-a {
            top: 16%;
            right: 6%;
          }

          .tag-b {
            right: 4%;
            bottom: 15%;
          }

          .tag-c {
            left: 4%;
            bottom: 14%;
          }

          .dashboard-analysis-grid {
            gap: 8px;
          }

          .data-panel {
            padding: 15px;
          }

          .progress-visual {
            gap: 20px;
          }

          .progress-circle {
            width: 105px;
            height: 105px;
          }

          .project-table-row {
            padding: 13px;
          }

          .project-name-cell strong {
            max-width: 170px;
          }

          .project-cards-grid {
            gap: 8px;
          }

          .premium-project-card {
            padding: 16px;
          }

          .profile-command-card {
            padding: 20px;
          }

          .profile-main {
            align-items: flex-start;
            flex-direction: column;
          }

          .profile-avatar-large {
            width: 78px;
            height: 78px;
            border-radius: 21px;
          }

          .profile-main h2 {
            font-size: 24px;
          }

          .profile-grid {
            grid-template-columns: 1fr;
          }

          .contact-command {
            align-items: flex-start;
            flex-direction: column;
          }

          .technology-intro {
            padding: 22px;
          }

          .technology-intro h2 {
            font-size: 25px;
          }

          .social-links-grid {
            grid-template-columns: 1fr;
          }

          .social-command {
            padding: 20px 15px;
          }

          .client-footer {
            align-items: flex-start;
            flex-direction: column;
          }

          .welcome-panel {
            padding: 42px 22px 30px;
          }

          .welcome-panel h1 {
            font-size: 32px;
          }

          .welcome-logo img {
            width: 210px;
            height: auto;
          }

          .welcome-meta {
            gap: 8px;
          }

          .welcome-meta span {
            font-size: 5px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          *,
          *::before,
          *::after {
            scroll-behavior: auto !important;
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}