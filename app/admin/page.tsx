
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const managementCards = [
  {
    title: "إدارة المشاريع",
    description: "متابعة المشاريع وحالات التنفيذ وتفاصيل كل مشروع.",
    href: "/admin/projects",
    icon: "▦",
    label: "المشاريع والعملاء",
  },
  {
    title: "إدارة العملاء",
    description: "إدارة بيانات العملاء وربطهم بالمشاريع.",
    href: "/admin/clients",
    icon: "♙",
    label: "علاقات العملاء",
  },
  {
    title: "خدمات الشركة",
    description: "إدارة خدمات VEXORA ومحتواها.",
    href: "/admin/services",
    icon: "◇",
    label: "خدمات الشركة",
  },
  {
    title: "صفحات الموقع",
    description: "إدارة الصفحات والأقسام والمحتوى.",
    href: "/admin/pages",
    icon: "▤",
    label: "إدارة المحتوى",
  },
  {
    title: "الأخبار التقنية",
    description: "إضافة الأخبار والمقالات وإدارة نشرها.",
    href: "/admin/news",
    icon: "◉",
    label: "الأخبار والمقالات",
  },
  {
    title: "الفعاليات",
    description: "إدارة المؤتمرات والفعاليات وورش العمل.",
    href: "/admin/events",
    icon: "◇",
    label: "الفعاليات",
  },
  {
    title: "الأكاديمية",
    description: "إدارة الدورات والمحتوى التعليمي.",
    href: "/admin/academy",
    icon: "▣",
    label: "التعليم والتدريب",
  },
  {
    title: "الفريق والصلاحيات",
    description: "إدارة أعضاء الفريق والأدوار.",
    href: "/admin/team",
    icon: "♧",
    label: "إدارة الوصول",
  },
  {
    title: "الاستفسارات",
    description: "مراجعة استفسارات العملاء والرسائل الواردة.",
    href: "/admin/inquiries",
    icon: "✉",
    label: "التواصل",
  },
  {
    title: "التحليلات",
    description: "تقارير أداء الشركة والمشاريع.",
    href: "/admin/analytics",
    icon: "▥",
    label: "التقارير والمؤشرات",
  },
  {
    title: "إعدادات النظام",
    description: "إعدادات لوحة التحكم والتفضيلات.",
    href: "/admin/settings",
    icon: "⚙",
    label: "إعدادات الإدارة",
  },
  {
    title: "إدارة المستخدمين",
    description: "مراجعة حسابات المستخدمين والصلاحيات.",
    href: "/admin/users",
    icon: "♙",
    label: "الحسابات والصلاحيات",
  },
];

const projectStatuses = [
  {
    key: "planning",
    label: "قيد التخطيط",
    color: "bg-violet-400",
  },
  {
    key: "in_progress",
    label: "قيد التنفيذ",
    color: "bg-blue-400",
  },
  {
    key: "completed",
    label: "مكتملة",
    color: "bg-emerald-400",
  },
  {
    key: "on_hold",
    label: "متوقفة مؤقتًا",
    color: "bg-amber-400",
  },
] as const;

const taskStatuses = [
  {
    key: "todo",
    label: "لم تبدأ",
    color: "bg-slate-400",
  },
  {
    key: "in_progress",
    label: "قيد التنفيذ",
    color: "bg-blue-400",
  },
  {
    key: "completed",
    label: "مكتملة",
    color: "bg-emerald-400",
  },
  {
    key: "blocked",
    label: "متوقفة",
    color: "bg-rose-400",
  },
] as const;

type Metric = {
  label: string;
  value: number | null;
  detail: string;
  href: string;
};

type ChartItem = {
  key: string;
  label: string;
  color: string;
  count: number;
};

function MetricCard({ metric }: { metric: Metric }) {
  return (
    <Link
      href={metric.href}
      className="rounded-2xl border border-white/[0.08] bg-[#0d121d] p-5 transition hover:border-blue-400/30 hover:bg-[#111a29]"
    >
      <p className="text-sm text-gray-400">{metric.label}</p>

      <p className="mt-3 text-3xl font-bold tabular-nums">
        {metric.value === null
          ? "—"
          : metric.value.toLocaleString("en-US")}
      </p>

      <p className="mt-2 text-xs leading-6 text-gray-500">
        {metric.detail}
      </p>
    </Link>
  );
}

function StatusChart({
  title,
  subtitle,
  items,
  total,
  hasError,
}: {
  title: string;
  subtitle: string;
  items: readonly ChartItem[];
  total: number;
  hasError: boolean;
}) {
  return (
    <section className="rounded-2xl border border-white/[0.08] bg-[#0d121d] p-5 sm:p-7">
      <div className="mb-6">
        <h2 className="text-xl font-bold">{title}</h2>

        <p className="mt-2 text-sm text-gray-400">{subtitle}</p>
      </div>

      {hasError ? (
        <p className="text-sm text-amber-200">
          تعذر تحميل بيانات هذا القسم.
        </p>
      ) : total === 0 ? (
        <p className="text-sm text-gray-400">
          لا توجد بيانات لعرضها حتى الآن.
        </p>
      ) : (
        <>
          <div
            className="flex h-3 w-full overflow-hidden rounded-full bg-white/5"
            role="img"
            aria-label={`توزيع الحالات بإجمالي ${total}`}
          >
            {items.map((item) =>
              item.count > 0 ? (
                <div
                  key={item.key}
                  className={`${item.color} h-full transition-all`}
                  style={{
                    width: `${(item.count / total) * 100}%`,
                  }}
                  title={`${item.label}: ${item.count}`}
                />
              ) : null
            )}
          </div>

          <div className="mt-6 space-y-4">
            {items.map((item) => {
              const percentage = Math.round(
                (item.count / total) * 100
              );

              return (
                <div key={item.key}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="flex items-center gap-2 text-gray-300">
                      <span
                        className={`h-2.5 w-2.5 rounded-sm ${item.color}`}
                      />
                      {item.label}
                    </span>

                    <span className="tabular-nums text-gray-400">
                      {item.count}{" "}
                      <span className="text-gray-600">
                        ({percentage}%)
                      </span>
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-full rounded-full ${item.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
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
    supabase
      .from("projects")
      .select("id, status"),

    supabase
      .from("clients")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("tasks")
      .select("id, status, due_date"),

    supabase
      .from("team_members")
      .select("id, status"),

    supabase
      .from("inquiries")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),

    supabase
      .from("inquiries")
      .select("id", { count: "exact", head: true }),
  ]);

  const errors = [
    projectsResult.error && "المشاريع",
    clientsResult.error && "العملاء",
    tasksResult.error && "المهام",
    teamResult.error && "الفريق",
    newInquiriesResult.error && "الاستفسارات الجديدة",
    inquiriesResult.error && "إجمالي الاستفسارات",
  ].filter(Boolean) as string[];

  const projects = projectsResult.data ?? [];
  const tasks = tasksResult.data ?? [];
  const team = teamResult.data ?? [];

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  const todayKey = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  const openTasks = tasks.filter(
    (task) => task.status !== "completed"
  );

  const overdueTasks = openTasks.filter(
    (task) => task.due_date && task.due_date < todayKey
  );

  const projectChartItems: ChartItem[] = projectStatuses.map(
    (status) => ({
      key: status.key,
      label: status.label,
      color: status.color,
      count: projects.filter(
        (project) => project.status === status.key
      ).length,
    })
  );

  const taskChartItems: ChartItem[] = taskStatuses.map(
    (status) => ({
      key: status.key,
      label: status.label,
      color: status.color,
      count: tasks.filter(
        (task) => task.status === status.key
      ).length,
    })
  );

  const completedTasks = tasks.filter(
    (task) => task.status === "completed"
  ).length;

  const activeTeamMembers = team.filter(
    (member) => member.status === "active"
  ).length;

  const metrics: Metric[] = [
    {
      label: "إجمالي المشاريع",
      value: projectsResult.error ? null : projects.length,
      detail: projectsResult.error
        ? "تعذر تحميل بيانات المشاريع"
        : `${projectChartItems.find((item) => item.key === "in_progress")?.count ?? 0} قيد التنفيذ`,
      href: "/admin/projects",
    },
    {
      label: "العملاء",
      value: clientsResult.error
        ? null
        : clientsResult.count ?? 0,
      detail: "إجمالي سجلات العملاء",
      href: "/admin/clients",
    },
    {
      label: "المهام المفتوحة",
      value: tasksResult.error ? null : openTasks.length,
      detail: tasksResult.error
        ? "تعذر تحميل بيانات المهام"
        : `${overdueTasks.length} متأخرة حسب تاريخ الاستحقاق`,
      href: "/admin/tasks",
    },
    {
      label: "أعضاء الفريق النشطون",
      value: teamResult.error ? null : activeTeamMembers,
      detail: teamResult.error
        ? "تعذر تحميل بيانات الفريق"
        : `${team.length} عضوًا إجمالًا`,
      href: "/admin/team",
    },
    {
      label: "الاستفسارات الجديدة",
      value: newInquiriesResult.error
        ? null
        : newInquiriesResult.count ?? 0,
      detail: "كل الاستفسارات التي حالتها جديدة",
      href: "/admin/inquiries",
    },
    {
      label: "المهام المكتملة",
      value: tasksResult.error ? null : completedTasks,
      detail: "إجمالي المهام المكتملة",
      href: "/admin/tasks",
    },
  ];

  return (
    <div
      dir="rtl"
      className="mx-auto min-h-screen max-w-7xl text-white"
    >
      <header className="flex flex-col gap-5 border-b border-white/[0.08] pb-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-blue-400">
            VEXORA / CONTROL CENTER
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            مركز التحكم
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400">
            نظرة مباشرة على المشاريع والعملاء والمهام والفريق
            واستفسارات العملاء.
          </p>
        </div>

        <Link
          href="/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex w-fit items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-gray-300 transition hover:border-blue-400/30 hover:text-white"
        >
          معاينة الموقع <span aria-hidden="true">↗</span>
        </Link>
      </header>

      {errors.length > 0 && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-amber-400/20 bg-amber-400/5 p-4 text-sm leading-7 text-amber-200"
        >
          تعذر تحميل بيانات بعض الأقسام: {errors.join("، ")}.
          راجع صلاحيات القراءة وسياسات RLS للجداول المعنية.
        </div>
      )}

      <section className="mt-8">
        <div className="mb-5">
          <p className="text-xs font-semibold tracking-widest text-blue-400">
            LIVE OVERVIEW
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            مؤشرات الشركة
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            يتم جلب المؤشرات من قاعدة البيانات عند فتح الصفحة.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.label}
              metric={metric}
            />
          ))}
        </div>
      </section>

      <section className="mt-8 grid gap-5 xl:grid-cols-2">
        <StatusChart
          title="توزيع حالات المشاريع"
          subtitle={`إجمالي المشاريع: ${
            projectsResult.error
              ? "غير متاح"
              : projects.length
          }`}
          items={projectChartItems}
          total={projects.length}
          hasError={Boolean(projectsResult.error)}
        />

        <StatusChart
          title="توزيع حالات المهام"
          subtitle={`إجمالي المهام: ${
            tasksResult.error ? "غير متاح" : tasks.length
          }`}
          items={taskChartItems}
          total={tasks.length}
          hasError={Boolean(tasksResult.error)}
        />
      </section>

      <section className="mt-8 rounded-2xl border border-white/[0.08] bg-[#0d121d] p-5 sm:p-7">
        <div className="mb-5">
          <p className="text-xs font-semibold tracking-widest text-blue-400">
            TASK HEALTH
          </p>

          <h2 className="mt-2 text-xl font-bold">
            متابعة المهام
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-white/[0.07] p-4">
            <p className="text-sm text-gray-400">مهام مفتوحة</p>

            <p className="mt-2 text-2xl font-bold">
              {tasksResult.error ? "—" : openTasks.length}
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.07] p-4">
            <p className="text-sm text-gray-400">مهام متأخرة</p>

            <p className="mt-2 text-2xl font-bold text-rose-300">
              {tasksResult.error ? "—" : overdueTasks.length}
            </p>
          </div>

          <div className="rounded-xl border border-white/[0.07] p-4">
            <p className="text-sm text-gray-400">
              معدل إكمال المهام
            </p>

            <p className="mt-2 text-2xl font-bold text-emerald-300">
              {tasksResult.error
                ? "—"
                : tasks.length === 0
                  ? "0%"
                  : `${Math.round(
                      (completedTasks / tasks.length) * 100
                    )}%`}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-5">
          <p className="text-xs font-semibold tracking-widest text-blue-400">
            MANAGEMENT
          </p>

          <h2 className="mt-2 text-2xl font-bold">
            أقسام الإدارة
          </h2>

          <p className="mt-2 text-sm leading-6 text-gray-400">
            اختر القسم الذي تريد العمل عليه.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {managementCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-2xl border border-white/[0.08] bg-[#0d121d] p-5 transition duration-200 hover:-translate-y-0.5 hover:border-blue-400/30 hover:bg-[#111a29]"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/10 text-2xl text-blue-300">
                  {card.icon}
                </span>

                <span
                  aria-hidden="true"
                  className="text-lg text-gray-600 transition group-hover:text-blue-300"
                >
                  ↖
                </span>
              </div>

              <p className="mt-5 text-xs text-blue-300">
                {card.label}
              </p>

              <h3 className="mt-2 text-lg font-semibold">
                {card.title}
              </h3>

              <p className="mt-2 text-sm leading-7 text-gray-400">
                {card.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-2xl border border-white/[0.08] bg-[#0d121d] p-5 sm:p-7">
        <p className="text-xs font-semibold tracking-widest text-blue-400">
          NEXT STEPS
        </p>

        <h2 className="mt-2 text-xl font-bold">
          التطوير المستمر
        </h2>

        <p className="mt-3 text-sm leading-7 text-gray-400">
          تعرض اللوحة مؤشرات تشغيلية وتوزيعًا لحالات المشاريع
          والمهام. يمكن إضافة تحليل زمني بعد التأكد من الأعمدة
          والبيانات المتاحة.
        </p>
      </section>

      <footer className="mt-10 border-t border-white/[0.08] pt-5 text-xs leading-6 text-gray-500">
        VEXORA Technology Group · Administrative Workspace
      </footer>
    </div>
  );
}
