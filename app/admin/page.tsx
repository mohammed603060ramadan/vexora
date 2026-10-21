import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type IconName =
  | "projects"
  | "clients"
  | "services"
  | "pages"
  | "news"
  | "events"
  | "academy"
  | "team"
  | "inquiries"
  | "analytics"
  | "settings"
  | "users"
  | "arrow"
  | "external"
  | "activity"
  | "tasks"
  | "check"
  | "warning"
  | "clock"
  | "shield"
  | "database"
  | "linkedin"
  | "instagram"
  | "facebook"
  | "tiktok"
  | "whatsapp"
  | "email";

type ManagementCard = {
  title: string;
  description: string;
  href: string;
  icon: IconName;
};

type StatusDefinition = {
  label: string;
  color: string;
};

type Metric = {
  label: string;
  value: number;
  helper: string;
  icon: IconName;
  tone: "blue" | "cyan" | "violet" | "emerald" | "amber" | "rose";
};

type ChartItem = {
  label: string;
  count: number;
  color: string;
};

const managementCards: ManagementCard[] = [
  {
    title: "إدارة المشاريع",
    description: "متابعة المشاريع والحالات والمهام المرتبطة بها.",
    href: "/admin/projects",
    icon: "projects",
  },
  {
    title: "إدارة العملاء",
    description: "إدارة بيانات العملاء والعلاقات والطلبات.",
    href: "/admin/clients",
    icon: "clients",
  },
  {
    title: "خدمات الشركة",
    description: "إدارة الخدمات والمحتوى المرتبط بها.",
    href: "/admin/services",
    icon: "services",
  },
  {
    title: "صفحات الموقع",
    description: "إدارة محتوى الصفحات الأساسية للموقع.",
    href: "/admin/pages",
    icon: "pages",
  },
  {
    title: "الأخبار التقنية",
    description: "إدارة الأخبار والمحتوى التقني المنشور.",
    href: "/admin/news",
    icon: "news",
  },
  {
    title: "الفعاليات",
    description: "إدارة الفعاليات والمواعيد والمحتوى.",
    href: "/admin/events",
    icon: "events",
  },
  {
    title: "الأكاديمية",
    description: "إدارة المحتوى التدريبي والمسارات التعليمية.",
    href: "/admin/academy",
    icon: "academy",
  },
  {
    title: "الفريق والصلاحيات",
    description: "متابعة أعضاء الفريق والأدوار والصلاحيات.",
    href: "/admin/team",
    icon: "team",
  },
  {
    title: "الاستفسارات",
    description: "متابعة استفسارات العملاء والطلبات الجديدة.",
    href: "/admin/inquiries",
    icon: "inquiries",
  },
  {
    title: "التحليلات",
    description: "قراءة مؤشرات الأداء وتحليل بيانات النظام.",
    href: "/admin/analytics",
    icon: "analytics",
  },
  {
    title: "إعدادات النظام",
    description: "إدارة إعدادات النظام والتكوينات العامة.",
    href: "/admin/settings",
    icon: "settings",
  },
  {
    title: "إدارة المستخدمين",
    description: "إدارة مستخدمي المنصة وحساباتهم.",
    href: "/admin/users",
    icon: "users",
  },
];

const projectStatuses: Record<string, StatusDefinition> = {
  planning: {
    label: "قيد التخطيط",
    color: "#8b5cf6",
  },
  in_progress: {
    label: "قيد التنفيذ",
    color: "#2f8cff",
  },
  completed: {
    label: "مكتمل",
    color: "#10b981",
  },
  on_hold: {
    label: "متوقف مؤقتًا",
    color: "#f59e0b",
  },
};

const taskStatuses: Record<string, StatusDefinition> = {
  todo: {
    label: "لم تبدأ",
    color: "#64748b",
  },
  in_progress: {
    label: "قيد التنفيذ",
    color: "#2f8cff",
  },
  completed: {
    label: "مكتملة",
    color: "#10b981",
  },
  blocked: {
    label: "متوقفة",
    color: "#f43f5e",
  },
};

function Icon({
  name,
  size = 22,
  strokeWidth = 1.7,
}: {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    "aria-hidden": true,
  };

  switch (name) {
    case "projects":
      return (
        <svg {...common}>
          <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth={strokeWidth} />
          <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth={strokeWidth} />
          <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth={strokeWidth} />
          <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth={strokeWidth} />
          <path d="M10 6.5h4M6.5 10v4M17.5 10v4M10 17.5h4" stroke="currentColor" strokeWidth={strokeWidth} />
        </svg>
      );

    case "clients":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth={strokeWidth} />
          <path d="M5 20c.8-3.5 3.1-5.3 7-5.3s6.2 1.8 7 5.3" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M18 5.5a3 3 0 0 1 0 5.6M20.5 15.3c.8.7 1.3 1.6 1.5 2.7" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );

    case "services":
      return (
        <svg {...common}>
          <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
          <path d="m4.5 7.5 7.5 4.2 7.5-4.2M12 11.7V21" stroke="currentColor" strokeWidth={strokeWidth} />
          <path d="m8.5 5 7.5 4.3" stroke="currentColor" strokeWidth={strokeWidth} />
        </svg>
      );

    case "pages":
      return (
        <svg {...common}>
          <path d="M6 3h9l4 4v14H6z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
          <path d="M14 3v5h5M9 12h6M9 16h6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );

    case "news":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth={strokeWidth} />
          <path d="M7 8h10M7 12h5M7 16h3M15 12h3v4h-3z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "events":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth={strokeWidth} />
          <path d="M7 3v4M17 3v4M3 10h18M8 14h3M8 17h3M14 14h3M14 17h3" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );

    case "academy":
      return (
        <svg {...common}>
          <path d="m3 9 9-5 9 5-9 5-9-5Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
          <path d="M6 11.2V16c2.5 2.3 9.5 2.3 12 0v-4.8M21 9v6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );

    case "team":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth={strokeWidth} />
          <circle cx="17" cy="9" r="2.2" stroke="currentColor" strokeWidth={strokeWidth} />
          <path d="M3.5 20c.6-3.6 2.4-5.5 5.5-5.5s4.9 1.9 5.5 5.5M15 14.7c2.9.1 4.7 1.7 5.3 4.8" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );

    case "inquiries":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth={strokeWidth} />
          <path d="m4 7 8 6 8-6M8 10l-3.5 5M16 10l3.5 5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "analytics":
      return (
        <svg {...common}>
          <path d="M4 19V5M4 19h17" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="m7 15 3-4 3 2 5-7" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="18" cy="6" r="1.5" fill="currentColor" />
        </svg>
      );

    case "settings":
      return (
        <svg {...common}>
          <path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z" stroke="currentColor" strokeWidth={strokeWidth} />
          <path d="m19.4 15 .1.1a1.8 1.8 0 0 1-2.5 2.5l-.1-.1a1.8 1.8 0 0 0-3 .8v.2a1.8 1.8 0 0 1-3.6 0v-.2a1.8 1.8 0 0 0-3-.8l-.1.1a1.8 1.8 0 1 1-2.5-2.5l.1-.1a1.8 1.8 0 0 0-.8-3H4a1.8 1.8 0 0 1 0-3h.2a1.8 1.8 0 0 0 .8-3l-.1-.1a1.8 1.8 0 1 1 2.5-2.5l.1.1a1.8 1.8 0 0 0 3-.8V3a1.8 1.8 0 0 1 3.6 0v.2a1.8 1.8 0 0 0 3 .8l.1-.1a1.8 1.8 0 1 1 2.5 2.5l-.1.1a1.8 1.8 0 0 0 .8 3h.2a1.8 1.8 0 0 1 0 3h-.2a1.8 1.8 0 0 0-.8 2.5Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
        </svg>
      );

    case "users":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth={strokeWidth} />
          <path d="M3.5 20c.6-3.7 2.5-5.5 5.5-5.5s4.9 1.8 5.5 5.5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
          <path d="M16 5.5a3 3 0 0 1 0 5.8M17 14.8c2.1.5 3.4 2.1 3.8 4.7" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );

    case "activity":
      return (
        <svg {...common}>
          <path d="M3 12h4l2.2-6 4.2 12 2.2-6H21" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "tasks":
      return (
        <svg {...common}>
          <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth={strokeWidth} />
          <path d="m8 9 1.5 1.5L12 8M8 15l1.5 1.5L12 14M14 9h3M14 15h3" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "check":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={strokeWidth} />
          <path d="m8 12 2.6 2.6L16.5 9" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "warning":
      return (
        <svg {...common}>
          <path d="m12 3 9 17H3L12 3Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
          <path d="M12 9v5M12 17.2v.1" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );

    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth={strokeWidth} />
          <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "shield":
      return (
        <svg {...common}>
          <path d="M12 3 19 6v5.5c0 4.4-2.8 7.5-7 9.5-4.2-2-7-5.1-7-9.5V6l7-3Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
          <path d="m9 12 2 2 4-4" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "database":
      return (
        <svg {...common}>
          <ellipse cx="12" cy="5.5" rx="7" ry="3" stroke="currentColor" strokeWidth={strokeWidth} />
          <path d="M5 5.5v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6M5 11.5v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" stroke="currentColor" strokeWidth={strokeWidth} />
        </svg>
      );

    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "external":
      return (
        <svg {...common}>
          <path d="M14 5h5v5M19 5l-8 8" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
          <path d="M18 13v5a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );

    case "linkedin":
      return (
        <svg {...common} viewBox="0 0 24 24">
          <path d="M6 8v10M6 5.2v.1M10 18v-6.2c0-2 1.2-3.2 3-3.2s3 1.2 3 3.2V18M10 11v7M19 18v-6.1c0-3.1-1.7-5.2-4.7-5.2-2.2 0-3.5 1.3-4.3 2.5" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
        </svg>
      );

    case "instagram":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth={strokeWidth} />
          <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth={strokeWidth} />
          <circle cx="17.2" cy="6.9" r="1" fill="currentColor" />
        </svg>
      );

    case "facebook":
      return (
        <svg {...common}>
          <path d="M14 21v-8h2.7l.4-3H14V8.1c0-.9.3-1.5 1.6-1.5h1.7V4c-.8-.1-1.5-.2-2.4-.2-2.4 0-4 1.5-4 4.1V10H8v3h2.9v8" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "tiktok":
      return (
        <svg {...common}>
          <path d="M14 4v10.2a3.8 3.8 0 1 1-3-3.7M14 4c.6 2.4 2.2 3.8 5 4" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "whatsapp":
      return (
        <svg {...common}>
          <path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.5-4A8 8 0 1 1 20 11.5Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinejoin="round" />
          <path d="M9 8.5c.3-.4.7-.4 1-.1l1 1.2c.3.3.3.7.1 1l-.5.6c.8 1.3 1.8 2.2 3.1 2.9l.6-.5c.3-.2.7-.2 1 .1l1.1 1c.3.3.3.7 0 1-.5.7-1.2 1-2 .8-3.7-1-6.3-3.5-7.3-7.2-.2-.8.1-1.5.8-1.9Z" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case "email":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth={strokeWidth} />
          <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    default:
      return null;
  }
}

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <div className={`metric-card metric-${metric.tone}`}>
      <div className="metric-card-top">
        <div className="metric-icon">
          <Icon name={metric.icon} size={21} />
        </div>

        <span className="metric-live">
          <i />
          LIVE
        </span>
      </div>

      <div className="metric-value">{metric.value.toLocaleString("en-US")}</div>

      <div className="metric-label">{metric.label}</div>

      <div className="metric-helper">{metric.helper}</div>
    </div>
  );
}

function StatusChart({
  title,
  subtitle,
  items,
  total,
}: {
  title: string;
  subtitle: string;
  items: ChartItem[];
  total: number;
}) {
  return (
    <div className="chart-panel">
      <div className="panel-heading">
        <div>
          <span className="panel-kicker">DATA DISTRIBUTION</span>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>

        <div className="panel-total">
          <strong>{total}</strong>
          <span>Total</span>
        </div>
      </div>

      {total === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">
            <Icon name="database" size={23} />
          </div>
          <strong>لا توجد بيانات حاليًا</strong>
          <span>ستظهر المؤشرات هنا بمجرد توفر البيانات.</span>
        </div>
      ) : (
        <>
          <div className="segmented-bar">
            {items.map((item) => {
              const percentage = total > 0 ? (item.count / total) * 100 : 0;

              if (item.count === 0) return null;

              return (
                <span
                  key={item.label}
                  style={{
                    width: `${percentage}%`,
                    background: item.color,
                  }}
                  title={`${item.label}: ${item.count}`}
                />
              );
            })}
          </div>

          <div className="chart-legend">
            {items.map((item) => {
              const percentage =
                total > 0 ? Math.round((item.count / total) * 100) : 0;

              return (
                <div className="legend-row" key={item.label}>
                  <div className="legend-label">
                    <span
                      className="legend-dot"
                      style={{ background: item.color }}
                    />
                    <span>{item.label}</span>
                  </div>

                  <div className="legend-values">
                    <strong>{item.count}</strong>
                    <span>{percentage}%</span>
                  </div>

                  <div className="legend-track">
                    <span
                      style={{
                        width: `${percentage}%`,
                        background: item.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function RatioCard({
  label,
  value,
  helper,
  icon,
}: {
  label: string;
  value: number;
  helper: string;
  icon: IconName;
}) {
  const safeValue = Math.max(0, Math.min(100, Math.round(value)));

  return (
    <div className="ratio-card">
      <div className="ratio-icon">
        <Icon name={icon} size={20} />
      </div>

      <div className="ratio-content">
        <div className="ratio-heading">
          <span>{label}</span>
          <strong>{safeValue}%</strong>
        </div>

        <div className="ratio-track">
          <span style={{ width: `${safeValue}%` }} />
        </div>

        <p>{helper}</p>
      </div>
    </div>
  );
}

function SocialLink({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: IconName;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("mailto:") ? undefined : "_blank"}
      rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
      className="social-link"
      aria-label={label}
      title={label}
    >
      <Icon name={icon} size={19} />
      <span>{label}</span>
      <Icon name="external" size={14} />
    </a>
  );
}

export default async function AdminPage() {
  const supabase = await createClient();

  const [
    projectsResult,
    clientsResult,
    tasksResult,
    teamResult,
    newInquiriesResult,
    inquiriesResult,
  ] = await Promise.all([
    supabase.from("projects").select("id,status"),
    supabase.from("clients").select("id", { count: "exact", head: true }),
    supabase.from("tasks").select("id,status,due_date"),
    supabase.from("team_members").select("id,status"),
    supabase
      .from("inquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    supabase.from("inquiries").select("id", { count: "exact", head: true }),
  ]);

  const queryErrors = [
    projectsResult.error,
    clientsResult.error,
    tasksResult.error,
    teamResult.error,
    newInquiriesResult.error,
    inquiriesResult.error,
  ].filter(Boolean);

  const projects = projectsResult.data ?? [];
  const tasks = tasksResult.data ?? [];
  const teamMembers = teamResult.data ?? [];

  const todayKey = new Date().toISOString().slice(0, 10);

  const openTasks = tasks.filter(
    (task) => task.status !== "completed",
  );

  const overdueTasks = tasks.filter(
    (task) =>
      task.status !== "completed" &&
      typeof task.due_date === "string" &&
      task.due_date < todayKey,
  );

  const completedTasks = tasks.filter(
    (task) => task.status === "completed",
  );

  const activeTeamMembers = teamMembers.filter(
    (member) =>
      member.status === "active" ||
      member.status === "Active" ||
      member.status === "ACTIVE",
  );

  const projectStatusCounts = new Map<string, number>();

  for (const project of projects) {
    const status = project.status ?? "unknown";
    projectStatusCounts.set(
      status,
      (projectStatusCounts.get(status) ?? 0) + 1,
    );
  }

  const taskStatusCounts = new Map<string, number>();

  for (const task of tasks) {
    const status = task.status ?? "unknown";
    taskStatusCounts.set(status, (taskStatusCounts.get(status) ?? 0) + 1);
  }

  const projectChartItems: ChartItem[] = Object.entries(projectStatuses).map(
    ([status, definition]) => ({
      label: definition.label,
      count: projectStatusCounts.get(status) ?? 0,
      color: definition.color,
    }),
  );

  const taskChartItems: ChartItem[] = Object.entries(taskStatuses).map(
    ([status, definition]) => ({
      label: definition.label,
      count: taskStatusCounts.get(status) ?? 0,
      color: definition.color,
    }),
  );

  const totalProjects = projects.length;
  const totalTasks = tasks.length;
  const totalTeamMembers = teamMembers.length;
  const totalClients = clientsResult.count ?? 0;
  const newInquiries = newInquiriesResult.count ?? 0;
  const totalInquiries = inquiriesResult.count ?? 0;

  const projectCompletionRate =
    totalProjects > 0
      ? ((projectStatusCounts.get("completed") ?? 0) / totalProjects) * 100
      : 0;

  const taskCompletionRate =
    totalTasks > 0 ? (completedTasks.length / totalTasks) * 100 : 0;

  const taskHealthRate =
    totalTasks > 0
      ? ((totalTasks - overdueTasks.length) / totalTasks) * 100
      : 100;

  const teamActivityRate =
    totalTeamMembers > 0
      ? (activeTeamMembers.length / totalTeamMembers) * 100
      : 0;

  const inquiryNewRate =
    totalInquiries > 0 ? (newInquiries / totalInquiries) * 100 : 0;

  const metrics: Metric[] = [
    {
      label: "إجمالي المشاريع",
      value: totalProjects,
      helper: "كل المشاريع المسجلة في النظام",
      icon: "projects",
      tone: "blue",
    },
    {
      label: "العملاء",
      value: totalClients,
      helper: "إجمالي العملاء المسجلين",
      icon: "clients",
      tone: "cyan",
    },
    {
      label: "المهام المفتوحة",
      value: openTasks.length,
      helper: `${overdueTasks.length} مهمة متأخرة حاليًا`,
      icon: "tasks",
      tone: "amber",
    },
    {
      label: "أعضاء الفريق النشطون",
      value: activeTeamMembers.length,
      helper: `من أصل ${totalTeamMembers} عضو`,
      icon: "team",
      tone: "emerald",
    },
    {
      label: "الاستفسارات الجديدة",
      value: newInquiries,
      helper: `من أصل ${totalInquiries} استفسار`,
      icon: "inquiries",
      tone: "violet",
    },
    {
      label: "المهام المكتملة",
      value: completedTasks.length,
      helper: "مهام وصلت إلى حالة مكتملة",
      icon: "check",
      tone: "rose",
    },
  ];

  return (
    <main className="admin-page" dir="rtl">
      <div className="background-system" aria-hidden="true">
        <div className="background-grid" />
        <div className="background-glow background-glow-one" />
        <div className="background-glow background-glow-two" />

        <div className="network-network">
          <svg viewBox="0 0 1200 700" preserveAspectRatio="none">
            <path d="M0 520 L190 410 L350 480 L510 280 L720 340 L910 170 L1200 250" />
            <path d="M70 130 L260 230 L420 150 L620 250 L850 110 L1080 190" />
            <path d="M230 700 L350 480 L510 280 L620 250 L760 590 L910 170" />
            <circle cx="190" cy="410" r="4" />
            <circle cx="350" cy="480" r="4" />
            <circle cx="510" cy="280" r="4" />
            <circle cx="720" cy="340" r="4" />
            <circle cx="910" cy="170" r="4" />
            <circle cx="260" cy="230" r="4" />
            <circle cx="620" cy="250" r="4" />
            <circle cx="850" cy="110" r="4" />
          </svg>
        </div>

        <div className="scan-line" />
      </div>

      <div className="admin-shell">
        <header className="admin-header">
          <div className="brand-block">
            <div className="brand-logo-wrap">
              <Image
                src="/vexora-logo.png"
                alt="VEXORA Technology"
                width={160}
                height={55}
                priority
                className="admin-logo"
              />
            </div>

            <div className="brand-divider" />

            <div>
              <span className="brand-eyebrow">VEXORA TECHNOLOGY</span>
              <strong>CONTROL CENTER</strong>
            </div>
          </div>

          <div className="header-actions">
            <Link href="/" className="header-link">
              <span>الموقع الرئيسي</span>
              <Icon name="external" size={15} />
            </Link>

            <div className="secure-badge">
              <span className="secure-dot" />
              <Icon name="shield" size={15} />
              <span>ADMIN SYSTEM</span>
            </div>
          </div>
        </header>

        <section className="hero-panel">
          <div className="hero-copy">
            <div className="section-marker">
              <span />
              ADMIN / 001
            </div>

            <h1>
              مركز
              <span>التحكم.</span>
            </h1>

            <p>
              لوحة الإدارة المركزية لـ VEXORA Technology لمتابعة المشاريع،
              العملاء، المهام، الفريق، الاستفسارات ومؤشرات الأداء من مساحة
              تشغيل واحدة.
            </p>

            <div className="hero-actions">
              <Link href="/admin/analytics" className="primary-button">
                <Icon name="analytics" size={17} />
                <span>فتح التحليلات</span>
                <Icon name="arrow" size={16} />
              </Link>

              <Link href="/admin/projects" className="secondary-button">
                <Icon name="projects" size={17} />
                <span>المشاريع</span>
              </Link>
            </div>
          </div>

          <div className="hero-terminal">
            <div className="terminal-top">
              <div className="terminal-dots">
                <i />
                <i />
                <i />
              </div>

              <span>vexora://control-center</span>

              <span className="terminal-status">
                <i />
                ONLINE
              </span>
            </div>

            <div className="terminal-body">
              <div className="terminal-line">
                <span className="terminal-prefix">$</span>
                <span>system.status</span>
                <b>CONNECTED</b>
              </div>

              <div className="terminal-line">
                <span className="terminal-prefix">$</span>
                <span>database.sync</span>
                <b>ACTIVE</b>
              </div>

              <div className="terminal-line">
                <span className="terminal-prefix">$</span>
                <span>projects.loaded</span>
                <b>{totalProjects}</b>
              </div>

              <div className="terminal-line">
                <span className="terminal-prefix">$</span>
                <span>tasks.open</span>
                <b>{openTasks.length}</b>
              </div>

              <div className="terminal-line">
                <span className="terminal-prefix">$</span>
                <span>inquiries.new</span>
                <b>{newInquiries}</b>
              </div>

              <div className="terminal-cursor">
                <span>_</span>
              </div>
            </div>
          </div>
        </section>

        {queryErrors.length > 0 && (
          <div className="error-banner">
            <div className="error-icon">
              <Icon name="warning" size={20} />
            </div>

            <div>
              <strong>تعذر تحميل بعض بيانات لوحة التحكم</strong>
              <p>
                بعض المؤشرات قد لا تكون مكتملة بسبب خطأ في استعلام قاعدة
                البيانات. تم الحفاظ على الصفحة بدون بيانات وهمية.
              </p>
            </div>
          </div>
        )}

        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="section-marker">LIVE OVERVIEW / 002</span>
              <h2>مؤشرات الشركة</h2>
              <p>قراءة مباشرة للبيانات المتاحة من النظام.</p>
            </div>

            <div className="data-source">
              <Icon name="database" size={15} />
              SUPABASE DATA
            </div>
          </div>

          <div className="metrics-grid">
            {metrics.map((metric) => (
              <MetricCard key={metric.label} metric={metric} />
            ))}
          </div>
        </section>

        <section className="charts-grid">
          <StatusChart
            title="حالات المشاريع"
            subtitle="توزيع المشاريع حسب الحالة الحالية"
            items={projectChartItems}
            total={totalProjects}
          />

          <StatusChart
            title="حالات المهام"
            subtitle="توزيع المهام حسب حالة التنفيذ"
            items={taskChartItems}
            total={totalTasks}
          />
        </section>

        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="section-marker">TASK HEALTH / 003</span>
              <h2>متابعة المهام</h2>
              <p>تحليل تشغيلي مشتق من المهام الموجودة فعليًا.</p>
            </div>

            <div className="health-status">
              <span />
              OPERATIONAL
            </div>
          </div>

          <div className="task-health-panel">
            <div className="health-summary">
              <div className="health-main-icon">
                <Icon name="activity" size={26} />
              </div>

              <div>
                <span>المهام المفتوحة</span>
                <strong>{openTasks.length}</strong>
                <small>
                  {overdueTasks.length > 0
                    ? `${overdueTasks.length} مهمة تحتاج متابعة`
                    : "لا توجد مهام متأخرة حاليًا"}
                </small>
              </div>
            </div>

            <div className="health-stat">
              <span>المتأخرة</span>
              <strong className={overdueTasks.length > 0 ? "danger" : ""}>
                {overdueTasks.length}
              </strong>
              <small>حسب تاريخ الاستحقاق</small>
            </div>

            <div className="health-stat">
              <span>المكتملة</span>
              <strong className="success">{completedTasks.length}</strong>
              <small>من إجمالي المهام</small>
            </div>

            <div className="health-stat">
              <span>نسبة الإنجاز</span>
              <strong>{Math.round(taskCompletionRate)}%</strong>
              <small>معدل إكمال المهام</small>
            </div>
          </div>
        </section>

        <section className="section-block analytics-section">
          <div className="section-heading">
            <div>
              <span className="section-marker">EXECUTIVE ANALYTICS / 004</span>
              <h2>التحليل التنفيذي</h2>
              <p>مؤشرات نسبية محسوبة من بيانات لوحة الإدارة الحالية.</p>
            </div>

            <Link href="/admin/analytics" className="section-link">
              التحليلات المتقدمة
              <Icon name="arrow" size={16} />
            </Link>
          </div>

          <div className="ratios-grid">
            <RatioCard
              label="اكتمال المشاريع"
              value={projectCompletionRate}
              helper="نسبة المشاريع التي وصلت إلى حالة مكتملة."
              icon="projects"
            />

            <RatioCard
              label="اكتمال المهام"
              value={taskCompletionRate}
              helper="نسبة المهام التي تم إغلاقها بنجاح."
              icon="check"
            />

            <RatioCard
              label="صحة المهام"
              value={taskHealthRate}
              helper="نسبة المهام غير المتأخرة من إجمالي المهام."
              icon="shield"
            />

            <RatioCard
              label="نشاط الفريق"
              value={teamActivityRate}
              helper="نسبة أعضاء الفريق المسجلين كـ active."
              icon="team"
            />

            <RatioCard
              label="الاستفسارات الجديدة"
              value={inquiryNewRate}
              helper="نسبة الاستفسارات الجديدة من إجمالي الاستفسارات."
              icon="inquiries"
            />
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <div>
              <span className="section-marker">MANAGEMENT / 005</span>
              <h2>أقسام الإدارة</h2>
              <p>الوصول السريع إلى وحدات إدارة VEXORA.</p>
            </div>
          </div>

          <div className="management-grid">
            {managementCards.map((card) => (
              <Link
                href={card.href}
                className="management-card"
                key={card.href}
              >
                <div className="management-icon">
                  <Icon name={card.icon} size={23} />
                </div>

                <div className="management-content">
                  <span className="management-index">
                    MODULE
                  </span>

                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>

                <div className="management-arrow">
                  <Icon name="arrow" size={17} />
                </div>

                <div className="card-corner" />
              </Link>
            ))}
          </div>
        </section>

        <section className="section-block next-steps-section">
          <div className="next-steps-panel">
            <div className="next-steps-icon">
              <Icon name="activity" size={27} />
            </div>

            <div className="next-steps-copy">
              <span className="section-marker">NEXT STEPS / 006</span>
              <h2>التطوير المستمر</h2>
              <p>
                لوحة التحكم مصممة لتكون نقطة التشغيل المركزية للشركة. يمكن
                توسيع التحليلات والتقارير وربطها بالوحدات الإدارية المختلفة
                مع الحفاظ على البيانات الحقيقية والصلاحيات الحالية.
              </p>
            </div>

            <Link href="/admin/analytics" className="primary-button">
              <span>عرض التحليلات</span>
              <Icon name="arrow" size={16} />
            </Link>
          </div>
        </section>

        <section className="communication-section">
          <div className="communication-heading">
            <div>
              <span className="section-marker">COMMUNICATION / 007</span>
              <h2>تواصل VEXORA</h2>
              <p>قنوات التواصل الرسمية المتاحة.</p>
            </div>

            <div className="communication-pulse">
              <i />
              CONNECTED
            </div>
          </div>

          <div className="social-grid">
            <SocialLink
              href="https://www.linkedin.com/in/mohammad-ramadan-706b89440?utm_source=share_via&utm_content=profile&utm_medium=member_android"
              label="LinkedIn"
              icon="linkedin"
            />

            <SocialLink
              href="https://www.instagram.com/vexoramohammed/"
              label="Instagram"
              icon="instagram"
            />

            <SocialLink
              href="https://www.facebook.com/share/19hrz2yVC7/"
              label="Facebook"
              icon="facebook"
            />

            <SocialLink
              href="https://www.tiktok.com/@vexoramohammed"
              label="TikTok"
              icon="tiktok"
            />

            <SocialLink
              href="https://wa.me/201115449868"
              label="WhatsApp"
              icon="whatsapp"
            />

            <SocialLink
              href="mailto:vexore.mr@gmail.com"
              label="Email"
              icon="email"
            />
          </div>
        </section>

        <footer className="admin-footer">
          <div className="footer-brand">
            <Image
              src="/vexora-logo.png"
              alt="VEXORA Technology"
              width={125}
              height={43}
            />

            <span>
              VEXORA Technology Group
            </span>
          </div>

          <div className="footer-status">
            <span />
            Administrative Workspace
          </div>

          <span className="footer-year">
            © {new Date().getFullYear()}
          </span>
        </footer>
      </div>

      <style>{`
        :root {
          color-scheme: dark;
        }

        * {
          box-sizing: border-box;
        }

        .admin-page {
          --vx-blue: #278cff;
          --vx-cyan: #69d5ff;
          --vx-silver: #d8e4f2;
          --vx-muted: #8192aa;
          --vx-panel: rgba(8, 15, 25, 0.78);
          --vx-border: rgba(141, 183, 225, 0.13);

          position: relative;
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(circle at 50% -10%, rgba(31, 121, 255, 0.13), transparent 32%),
            radial-gradient(circle at 0% 50%, rgba(23, 117, 255, 0.07), transparent 28%),
            #03070d;
          color: #edf5ff;
          font-family: Arial, Helvetica, sans-serif;
        }

        .background-system {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .background-grid {
          position: absolute;
          inset: -100px;
          opacity: 0.34;
          background-image:
            linear-gradient(rgba(76, 139, 201, 0.055) 1px, transparent 1px),
            linear-gradient(90deg, rgba(76, 139, 201, 0.055) 1px, transparent 1px);
          background-size: 42px 42px;
          transform: perspective(700px) rotateX(55deg) scale(1.7) translateY(110px);
          transform-origin: center bottom;
          animation: gridMove 18s linear infinite;
        }

        .background-glow {
          position: absolute;
          width: 540px;
          height: 540px;
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.11;
        }

        .background-glow-one {
          top: -250px;
          right: -120px;
          background: #1687ff;
          animation: glowFloat 8s ease-in-out infinite;
        }

        .background-glow-two {
          bottom: -300px;
          left: -160px;
          background: #1453b8;
          animation: glowFloat 10s ease-in-out infinite reverse;
        }

        .network-network {
          position: absolute;
          inset: 0;
          opacity: 0.17;
        }

        .network-network svg {
          width: 100%;
          height: 100%;
        }

        .network-network path {
          fill: none;
          stroke: rgba(77, 167, 255, 0.45);
          stroke-width: 1;
          stroke-dasharray: 5 12;
          animation: networkFlow 12s linear infinite;
        }

        .network-network circle {
          fill: #75cfff;
          filter: drop-shadow(0 0 8px rgba(80, 180, 255, 0.8));
          animation: nodePulse 3s ease-in-out infinite;
        }

        .scan-line {
          position: absolute;
          top: -20%;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(78, 184, 255, 0.4),
            transparent
          );
          box-shadow: 0 0 18px rgba(39, 140, 255, 0.3);
          animation: scan 8s linear infinite;
        }

        .admin-shell {
          position: relative;
          z-index: 2;
          width: min(1440px, calc(100% - 40px));
          margin: 0 auto;
          padding-bottom: 50px;
        }

        .admin-header {
          min-height: 92px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 25px;
          border-bottom: 1px solid var(--vx-border);
        }

        .brand-block {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .brand-logo-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 150px;
          height: 58px;
          border: 1px solid rgba(88, 163, 234, 0.13);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.025);
          box-shadow:
            inset 0 0 25px rgba(39, 140, 255, 0.03),
            0 0 35px rgba(39, 140, 255, 0.04);
        }

        .admin-logo {
          width: 126px;
          height: auto;
          object-fit: contain;
          animation: logoAura 5s ease-in-out infinite;
        }

        .brand-divider {
          width: 1px;
          height: 38px;
          background: rgba(162, 196, 230, 0.14);
        }

        .brand-block > div:last-child {
          display: grid;
          gap: 4px;
        }

        .brand-eyebrow {
          color: #7392b6;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.25em;
        }

        .brand-block strong {
          color: #dceaff;
          font-size: 13px;
          letter-spacing: 0.08em;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .header-link,
        .secure-badge {
          min-height: 38px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0 12px;
          border: 1px solid rgba(133, 175, 218, 0.13);
          border-radius: 9px;
          color: #9db2ca;
          text-decoration: none;
          font-size: 10px;
          transition:
            color 0.2s ease,
            border-color 0.2s ease,
            background 0.2s ease,
            transform 0.2s ease;
        }

        .header-link:hover {
          color: white;
          border-color: rgba(39, 140, 255, 0.45);
          background: rgba(39, 140, 255, 0.07);
          transform: translateY(-2px);
        }

        .secure-badge {
          color: #8fcbff;
          border-color: rgba(39, 140, 255, 0.2);
          background: rgba(39, 140, 255, 0.045);
          letter-spacing: 0.1em;
        }

        .secure-dot,
        .terminal-status i,
        .metric-live i,
        .health-status span,
        .communication-pulse i,
        .footer-status span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #35d69a;
          box-shadow: 0 0 12px rgba(53, 214, 154, 0.7);
          animation: statusPulse 2s ease-in-out infinite;
        }

        .hero-panel {
          min-height: 450px;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          align-items: center;
          gap: 70px;
          padding: 72px 0 62px;
        }

        .section-marker {
          display: inline-flex;
          align-items: center;
          gap: 9px;
          color: #6fa9dc;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.23em;
        }

        .section-marker > span {
          display: inline-block;
          width: 26px;
          height: 1px;
          background: #278cff;
          box-shadow: 0 0 10px rgba(39, 140, 255, 0.5);
        }

        .hero-copy h1 {
          max-width: 700px;
          margin: 19px 0 16px;
          font-size: clamp(50px, 7vw, 91px);
          line-height: 0.96;
          letter-spacing: -0.055em;
          font-weight: 800;
        }

        .hero-copy h1 span {
          display: block;
          color: transparent;
          background: linear-gradient(120deg, #eaf4ff, #54baff 48%, #6d91bb);
          -webkit-background-clip: text;
          background-clip: text;
        }

        .hero-copy > p {
          max-width: 640px;
          margin: 0;
          color: #91a5bd;
          font-size: 14px;
          line-height: 2;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 28px;
        }

        .primary-button,
        .secondary-button {
          min-height: 45px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding: 0 17px;
          border-radius: 10px;
          text-decoration: none;
          font-size: 11px;
          font-weight: 700;
          transition:
            transform 0.22s ease,
            border-color 0.22s ease,
            box-shadow 0.22s ease,
            background 0.22s ease;
        }

        .primary-button {
          color: white;
          border: 1px solid rgba(62, 164, 255, 0.75);
          background: linear-gradient(115deg, #167cf0, #1459b6);
          box-shadow: 0 10px 30px rgba(25, 125, 240, 0.14);
        }

        .secondary-button {
          color: #bed0e4;
          border: 1px solid rgba(146, 182, 219, 0.16);
          background: rgba(255, 255, 255, 0.025);
        }

        .primary-button:hover,
        .secondary-button:hover {
          transform: translateY(-3px);
        }

        .primary-button:hover {
          box-shadow: 0 14px 35px rgba(25, 125, 240, 0.26);
        }

        .secondary-button:hover {
          border-color: rgba(39, 140, 255, 0.45);
          background: rgba(39, 140, 255, 0.06);
        }

        .hero-terminal {
          overflow: hidden;
          border: 1px solid rgba(113, 174, 229, 0.15);
          border-radius: 17px;
          background:
            linear-gradient(145deg, rgba(13, 25, 40, 0.86), rgba(4, 10, 17, 0.94));
          box-shadow:
            0 25px 80px rgba(0, 0, 0, 0.34),
            inset 0 0 50px rgba(39, 140, 255, 0.035);
          transform: perspective(900px) rotateY(-3deg);
          transition: transform 0.4s ease, border-color 0.4s ease;
        }

        .hero-terminal:hover {
          transform: perspective(900px) rotateY(0deg) translateY(-4px);
          border-color: rgba(72, 166, 247, 0.3);
        }

        .terminal-top {
          min-height: 48px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 12px;
          padding: 0 15px;
          border-bottom: 1px solid rgba(129, 171, 211, 0.1);
          background: rgba(255, 255, 255, 0.018);
          color: #607895;
          font-family: Consolas, monospace;
          font-size: 9px;
        }

        .terminal-dots {
          display: flex;
          gap: 5px;
        }

        .terminal-dots i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #536b84;
        }

        .terminal-status {
          justify-self: end;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #54d9a5;
          font-size: 8px;
          letter-spacing: 0.12em;
        }

        .terminal-body {
          min-height: 305px;
          padding: 29px 25px;
          background:
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 28px,
              rgba(87, 152, 205, 0.025) 29px
            );
          font-family: Consolas, Monaco, monospace;
        }

        .terminal-line {
          display: grid;
          grid-template-columns: 20px 1fr auto;
          gap: 8px;
          padding: 8px 0;
          color: #7892ae;
          font-size: 11px;
        }

        .terminal-prefix {
          color: #318fff;
        }

        .terminal-line b {
          color: #65d8ac;
          font-weight: 500;
        }

        .terminal-cursor {
          margin-top: 16px;
          color: #4caeff;
          animation: cursorBlink 1s steps(2, start) infinite;
        }

        .error-banner {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 34px;
          padding: 16px 18px;
          border: 1px solid rgba(244, 63, 94, 0.2);
          border-radius: 12px;
          background: rgba(244, 63, 94, 0.045);
        }

        .error-icon {
          display: grid;
          width: 42px;
          height: 42px;
          flex: 0 0 auto;
          place-items: center;
          border: 1px solid rgba(244, 63, 94, 0.2);
          border-radius: 10px;
          color: #fb7185;
          background: rgba(244, 63, 94, 0.06);
        }

        .error-banner strong {
          display: block;
          margin-bottom: 5px;
          color: #fecdd3;
          font-size: 12px;
        }

        .error-banner p {
          margin: 0;
          color: #a68d96;
          font-size: 10px;
          line-height: 1.7;
        }

        .section-block {
          margin-top: 24px;
        }

        .section-heading,
        .communication-heading {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 25px;
          margin-bottom: 22px;
        }

        .section-heading h2,
        .communication-heading h2 {
          margin: 8px 0 4px;
          color: #e8f2ff;
          font-size: 25px;
          letter-spacing: -0.03em;
        }

        .section-heading p,
        .communication-heading p {
          margin: 0;
          color: #72869f;
          font-size: 11px;
        }

        .data-source,
        .health-status,
        .communication-pulse {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 31px;
          padding: 0 10px;
          border: 1px solid rgba(54, 203, 151, 0.15);
          border-radius: 8px;
          color: #64cda8;
          background: rgba(54, 203, 151, 0.035);
          font-size: 8px;
          letter-spacing: 0.12em;
          white-space: nowrap;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 10px;
        }

        .metric-card {
          position: relative;
          min-height: 174px;
          overflow: hidden;
          padding: 17px;
          border: 1px solid var(--vx-border);
          border-radius: 13px;
          background: linear-gradient(
            145deg,
            rgba(13, 25, 39, 0.77),
            rgba(6, 13, 22, 0.82)
          );
          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .metric-card::after {
          position: absolute;
          right: -35px;
          bottom: -45px;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          content: "";
          background: rgba(39, 140, 255, 0.07);
          filter: blur(28px);
        }

        .metric-card:hover {
          transform: translateY(-5px);
          border-color: rgba(87, 165, 228, 0.27);
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.22);
        }

        .metric-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .metric-icon {
          display: grid;
          width: 39px;
          height: 39px;
          place-items: center;
          border: 1px solid rgba(85, 160, 225, 0.16);
          border-radius: 10px;
          color: #8fcfff;
          background: rgba(39, 140, 255, 0.05);
        }

        .metric-live {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #55718e;
          font-size: 7px;
          letter-spacing: 0.13em;
        }

        .metric-value {
          margin-top: 20px;
          color: #f1f7ff;
          font-size: 31px;
          font-weight: 700;
          letter-spacing: -0.05em;
        }

        .metric-label {
          margin-top: 3px;
          color: #a9bdd4;
          font-size: 10px;
          font-weight: 700;
        }

        .metric-helper {
          margin-top: 8px;
          color: #60758e;
          font-size: 8px;
          line-height: 1.5;
        }

        .metric-cyan .metric-icon {
          color: #63ddff;
          background: rgba(50, 208, 255, 0.05);
        }

        .metric-violet .metric-icon {
          color: #b99aff;
          background: rgba(139, 92, 246, 0.05);
        }

        .metric-emerald .metric-icon {
          color: #58d9aa;
          background: rgba(16, 185, 129, 0.05);
        }

        .metric-amber .metric-icon {
          color: #f4bd65;
          background: rgba(245, 158, 11, 0.05);
        }

        .metric-rose .metric-icon {
          color: #fb8da2;
          background: rgba(244, 63, 94, 0.05);
        }

        .charts-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 14px;
          margin-top: 14px;
        }

        .chart-panel {
          min-height: 330px;
          padding: 24px;
          border: 1px solid var(--vx-border);
          border-radius: 15px;
          background: var(--vx-panel);
          box-shadow: inset 0 0 45px rgba(39, 140, 255, 0.015);
        }

        .panel-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .panel-kicker {
          color: #557897;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.18em;
        }

        .panel-heading h3 {
          margin: 8px 0 4px;
          color: #dce9f8;
          font-size: 16px;
        }

        .panel-heading p {
          margin: 0;
          color: #637991;
          font-size: 9px;
        }

        .panel-total {
          display: grid;
          min-width: 62px;
          padding: 8px;
          border: 1px solid rgba(113, 167, 214, 0.12);
          border-radius: 9px;
          text-align: center;
        }

        .panel-total strong {
          color: #dcecff;
          font-size: 18px;
        }

        .panel-total span {
          color: #5f7691;
          font-size: 7px;
        }

        .segmented-bar {
          display: flex;
          height: 8px;
          overflow: hidden;
          margin-top: 29px;
          border-radius: 99px;
          background: #101c29;
        }

        .segmented-bar span {
          min-width: 2px;
          transition: width 0.8s ease;
        }

        .chart-legend {
          display: grid;
          gap: 13px;
          margin-top: 23px;
        }

        .legend-row {
          display: grid;
          grid-template-columns: 125px 65px 1fr;
          align-items: center;
          gap: 10px;
        }

        .legend-label {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #91a6bd;
          font-size: 9px;
        }

        .legend-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
        }

        .legend-values {
          display: flex;
          align-items: baseline;
          gap: 6px;
        }

        .legend-values strong {
          color: #dcecff;
          font-size: 11px;
        }

        .legend-values span {
          color: #50677f;
          font-size: 8px;
        }

        .legend-track {
          height: 4px;
          overflow: hidden;
          border-radius: 99px;
          background: #0d1722;
        }

        .legend-track span {
          display: block;
          height: 100%;
          border-radius: inherit;
          transition: width 0.8s ease;
        }

        .empty-state {
          min-height: 190px;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 8px;
          text-align: center;
        }

        .empty-icon {
          display: grid;
          width: 47px;
          height: 47px;
          place-items: center;
          margin-bottom: 4px;
          border: 1px solid rgba(102, 145, 184, 0.13);
          border-radius: 12px;
          color: #66809b;
        }

        .empty-state strong {
          color: #a9bdd2;
          font-size: 11px;
        }

        .empty-state span {
          color: #5d728b;
          font-size: 9px;
        }

        .task-health-panel {
          display: grid;
          grid-template-columns: 1.5fr repeat(3, 1fr);
          gap: 0;
          overflow: hidden;
          border: 1px solid var(--vx-border);
          border-radius: 14px;
          background: rgba(8, 16, 27, 0.78);
        }

        .health-summary,
        .health-stat {
          min-height: 125px;
          padding: 22px;
          border-left: 1px solid rgba(132, 170, 207, 0.09);
        }

        .health-summary {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .health-main-icon {
          display: grid;
          width: 51px;
          height: 51px;
          flex: 0 0 auto;
          place-items: center;
          border: 1px solid rgba(39, 140, 255, 0.2);
          border-radius: 12px;
          color: #6fc4ff;
          background: rgba(39, 140, 255, 0.05);
        }

        .health-summary span,
        .health-stat span {
          display: block;
          color: #7c93ad;
          font-size: 9px;
        }

        .health-summary strong {
          display: block;
          margin-top: 4px;
          color: #e4effc;
          font-size: 25px;
        }

        .health-summary small,
        .health-stat small {
          display: block;
          margin-top: 4px;
          color: #526981;
          font-size: 8px;
        }

        .health-stat {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .health-stat strong {
          margin-top: 8px;
          color: #dcecff;
          font-size: 22px;
        }

        .health-stat strong.danger {
          color: #fb7185;
        }

        .health-stat strong.success {
          color: #53d7a7;
        }

        .analytics-section {
          margin-top: 38px;
        }

        .section-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #83c5ff;
          text-decoration: none;
          font-size: 10px;
          transition: color 0.2s ease, transform 0.2s ease;
        }

        .section-link:hover {
          color: white;
          transform: translateX(-3px);
        }

        .ratios-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 10px;
        }

        .ratio-card {
          display: flex;
          gap: 12px;
          min-height: 135px;
          padding: 16px;
          border: 1px solid var(--vx-border);
          border-radius: 13px;
          background: rgba(9, 18, 29, 0.72);
          transition: transform 0.25s ease, border-color 0.25s ease;
        }

        .ratio-card:hover {
          transform: translateY(-4px);
          border-color: rgba(82, 159, 224, 0.25);
        }

        .ratio-icon {
          display: grid;
          width: 37px;
          height: 37px;
          flex: 0 0 auto;
          place-items: center;
          border: 1px solid rgba(76, 158, 224, 0.14);
          border-radius: 10px;
          color: #7fc6ff;
        }

        .ratio-content {
          flex: 1;
          min-width: 0;
        }

        .ratio-heading {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .ratio-heading span {
          color: #9bb0c8;
          font-size: 9px;
        }

        .ratio-heading strong {
          color: #e5f1ff;
          font-size: 15px;
        }

        .ratio-track {
          height: 5px;
          overflow: hidden;
          margin-top: 14px;
          border-radius: 99px;
          background: #101d2b;
        }

        .ratio-track span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #176fe0, #5ccfff);
          transition: width 0.8s ease;
        }

        .ratio-content p {
          margin: 10px 0 0;
          color: #566c84;
          font-size: 8px;
          line-height: 1.55;
        }

        .management-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 10px;
        }

        .management-card {
          position: relative;
          min-height: 180px;
          display: flex;
          flex-direction: column;
          padding: 18px;
          overflow: hidden;
          border: 1px solid var(--vx-border);
          border-radius: 13px;
          background:
            linear-gradient(145deg, rgba(13, 25, 39, 0.78), rgba(5, 12, 20, 0.82));
          text-decoration: none;
          transition:
            transform 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .management-card:hover {
          transform: translateY(-6px);
          border-color: rgba(65, 157, 235, 0.32);
          box-shadow:
            0 18px 45px rgba(0, 0, 0, 0.25),
            0 0 30px rgba(39, 140, 255, 0.045);
        }

        .management-card::before {
          position: absolute;
          top: 0;
          right: 20px;
          left: 20px;
          height: 1px;
          content: "";
          background: linear-gradient(90deg, transparent, rgba(70, 167, 255, 0.5), transparent);
          opacity: 0;
          transition: opacity 0.25s ease;
        }

        .management-card:hover::before {
          opacity: 1;
        }

        .management-icon {
          display: grid;
          width: 47px;
          height: 47px;
          place-items: center;
          border: 1px solid rgba(72, 157, 227, 0.18);
          border-radius: 12px;
          color: #87caff;
          background: rgba(39, 140, 255, 0.045);
          transition:
            transform 0.25s ease,
            color 0.25s ease,
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .management-card:hover .management-icon {
          transform: translateY(-2px) scale(1.05);
          color: #c9ebff;
          border-color: rgba(87, 177, 248, 0.38);
          box-shadow: 0 0 22px rgba(39, 140, 255, 0.12);
        }

        .management-content {
          margin-top: 17px;
        }

        .management-index {
          color: #506b86;
          font-size: 7px;
          letter-spacing: 0.2em;
        }

        .management-content h3 {
          margin: 6px 0 7px;
          color: #dce9f8;
          font-size: 13px;
        }

        .management-content p {
          max-width: 250px;
          margin: 0;
          color: #667d96;
          font-size: 9px;
          line-height: 1.7;
        }

        .management-arrow {
          position: absolute;
          left: 16px;
          bottom: 16px;
          display: grid;
          width: 30px;
          height: 30px;
          place-items: center;
          border: 1px solid rgba(128, 169, 208, 0.1);
          border-radius: 8px;
          color: #57728f;
          transition: transform 0.25s ease, color 0.25s ease;
        }

        .management-card:hover .management-arrow {
          color: #82c8ff;
          transform: translateX(-3px);
        }

        .card-corner {
          position: absolute;
          right: -22px;
          bottom: -22px;
          width: 70px;
          height: 70px;
          border: 1px solid rgba(39, 140, 255, 0.08);
          border-radius: 50%;
        }

        .next-steps-section {
          margin-top: 35px;
        }

        .next-steps-panel {
          min-height: 180px;
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 28px;
          border: 1px solid rgba(74, 158, 226, 0.14);
          border-radius: 15px;
          background:
            linear-gradient(110deg, rgba(18, 39, 61, 0.7), rgba(7, 16, 27, 0.8));
          box-shadow: inset 0 0 55px rgba(39, 140, 255, 0.035);
        }

        .next-steps-icon {
          display: grid;
          width: 55px;
          height: 55px;
          flex: 0 0 auto;
          place-items: center;
          border: 1px solid rgba(61, 158, 237, 0.23);
          border-radius: 13px;
          color: #6fc5ff;
          background: rgba(39, 140, 255, 0.05);
        }

        .next-steps-copy {
          flex: 1;
        }

        .next-steps-copy h2 {
          margin: 7px 0 5px;
          color: #e1edfb;
          font-size: 19px;
        }

        .next-steps-copy p {
          max-width: 850px;
          margin: 0;
          color: #71869e;
          font-size: 10px;
          line-height: 1.8;
        }

        .communication-section {
          margin-top: 55px;
          padding-top: 34px;
          border-top: 1px solid rgba(137, 173, 210, 0.08);
        }

        .social-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 9px;
        }

        .social-link {
          min-height: 58px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 0 13px;
          border: 1px solid rgba(132, 172, 210, 0.11);
          border-radius: 11px;
          color: #8fa7c0;
          background: rgba(8, 16, 26, 0.7);
          text-decoration: none;
          transition:
            transform 0.22s ease,
            border-color 0.22s ease,
            background 0.22s ease,
            color 0.22s ease;
        }

        .social-link span {
          flex: 1;
          font-size: 9px;
        }

        .social-link > svg:last-child {
          color: #456079;
        }

        .social-link:hover {
          transform: translateY(-4px);
          color: #e9f5ff;
          border-color: rgba(61, 157, 235, 0.32);
          background: rgba(39, 140, 255, 0.065);
        }

        .social-link:hover > svg:last-child {
          color: #78c5ff;
        }

        .admin-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
          margin-top: 45px;
          padding-top: 24px;
          border-top: 1px solid rgba(137, 173, 210, 0.08);
          color: #4d637b;
          font-size: 8px;
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .footer-brand img {
          width: 105px;
          height: auto;
          opacity: 0.82;
        }

        .footer-status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
        }

        .footer-year {
          color: #40556d;
        }

        @keyframes gridMove {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 42px 42px;
          }
        }

        @keyframes glowFloat {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }

          50% {
            transform: translate3d(30px, -25px, 0);
          }
        }

        @keyframes networkFlow {
          to {
            stroke-dashoffset: -180;
          }
        }

        @keyframes nodePulse {
          0%,
          100% {
            opacity: 0.45;
          }

          50% {
            opacity: 1;
          }
        }

        @keyframes scan {
          0% {
            transform: translateY(-10vh);
            opacity: 0;
          }

          15% {
            opacity: 1;
          }

          80% {
            opacity: 0.7;
          }

          100% {
            transform: translateY(115vh);
            opacity: 0;
          }
        }

        @keyframes logoAura {
          0%,
          100% {
            filter: drop-shadow(0 0 3px rgba(39, 140, 255, 0.12));
          }

          50% {
            filter:
              drop-shadow(0 0 9px rgba(89, 191, 255, 0.3))
              drop-shadow(0 0 17px rgba(39, 140, 255, 0.12));
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
            transform: scale(1);
          }
        }

        @keyframes cursorBlink {
          50% {
            opacity: 0;
          }
        }

        @media (max-width: 1180px) {
          .metrics-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .management-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .ratios-grid {
            grid-template-columns: repeat(3, 1fr);
          }

          .social-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 900px) {
          .admin-shell {
            width: min(100% - 28px, 720px);
          }

          .hero-panel {
            grid-template-columns: 1fr;
            gap: 35px;
            padding-top: 50px;
          }

          .hero-terminal {
            transform: none;
          }

          .task-health-panel {
            grid-template-columns: 1fr 1fr;
          }

          .health-summary {
            grid-column: span 2;
          }

          .health-stat {
            border-top: 1px solid rgba(132, 170, 207, 0.09);
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }

          .management-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .ratios-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .social-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 650px) {
          .admin-shell {
            width: min(100% - 20px, 560px);
          }

          .admin-header {
            min-height: auto;
            padding: 15px 0;
            align-items: flex-start;
          }

          .brand-divider,
          .header-link {
            display: none;
          }

          .brand-block {
            gap: 10px;
          }

          .brand-logo-wrap {
            width: 112px;
            height: 47px;
          }

          .admin-logo {
            width: 95px;
          }

          .brand-eyebrow {
            font-size: 7px;
          }

          .brand-block strong {
            font-size: 10px;
          }

          .secure-badge span:last-child {
            display: none;
          }

          .hero-panel {
            padding: 42px 0;
          }

          .hero-copy h1 {
            font-size: 52px;
          }

          .hero-copy > p {
            font-size: 12px;
          }

          .terminal-top {
            grid-template-columns: 1fr auto;
          }

          .terminal-top > span:nth-child(2) {
            display: none;
          }

          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .metric-card {
            min-height: 155px;
          }

          .metric-value {
            font-size: 26px;
          }

          .section-heading,
          .communication-heading {
            align-items: flex-start;
            flex-direction: column;
          }

          .data-source,
          .health-status,
          .communication-pulse {
            align-self: flex-start;
          }

          .chart-panel {
            padding: 18px;
          }

          .legend-row {
            grid-template-columns: 105px 50px 1fr;
          }

          .task-health-panel {
            grid-template-columns: 1fr;
          }

          .health-summary {
            grid-column: auto;
          }

          .health-stat {
            border-top: 1px solid rgba(132, 170, 207, 0.09);
            border-left: 0;
          }

          .management-grid,
          .ratios-grid,
          .social-grid {
            grid-template-columns: 1fr;
          }

          .next-steps-panel {
            align-items: flex-start;
            flex-direction: column;
          }

          .next-steps-panel .primary-button {
            width: 100%;
          }

          .admin-footer {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .admin-page *,
          .admin-page *::before,
          .admin-page *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </main>
  );
}