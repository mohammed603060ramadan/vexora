"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type TabId =
  | "overview"
  | "company"
  | "website"
  | "branding"
  | "departments"
  | "security"
  | "notifications"
  | "integrations"
  | "maintenance"
  | "advanced";

type ModuleItem = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: string;
};

type ToggleItem = {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
};

const initialModules: ModuleItem[] = [
  { id: "dashboard", name: "Admin Dashboard", description: "Main administration workspace and overview.", enabled: true, category: "Core" },
  { id: "projects", name: "Project Management", description: "Projects, milestones, deadlines and assignments.", enabled: true, category: "Operations" },
  { id: "tasks", name: "Task Management", description: "Tasks, priorities, assignees and progress.", enabled: true, category: "Operations" },
  { id: "clients", name: "Client Management", description: "Client profiles and relationship management.", enabled: true, category: "Business" },
  { id: "services", name: "Services Catalog", description: "Manage the services offered by VEXORA.", enabled: true, category: "Business" },
  { id: "inquiries", name: "Client Inquiries", description: "Incoming requests and potential opportunities.", enabled: true, category: "Business" },
  { id: "messages", name: "Messages", description: "Communication inbox and customer conversations.", enabled: true, category: "Communication" },
  { id: "users", name: "User Management", description: "User directory and account administration.", enabled: true, category: "Security" },
  { id: "team", name: "Team Management", description: "Team members, roles and responsibilities.", enabled: true, category: "People" },
  { id: "finance", name: "Finance", description: "Invoices, payments and financial tracking.", enabled: true, category: "Finance" },
  { id: "contracts", name: "Contracts", description: "Contract records and lifecycle tracking.", enabled: true, category: "Business" },
  { id: "reports", name: "Reports & Analytics", description: "Operational reports and business insights.", enabled: true, category: "Analytics" },
  { id: "news", name: "News & Articles", description: "Manage news and editorial content.", enabled: true, category: "Content" },
  { id: "events", name: "Events", description: "Events, workshops and registrations.", enabled: true, category: "Content" },
  { id: "academy", name: "Academy", description: "Learning resources and educational content.", enabled: true, category: "Content" },
];

const initialToggles: ToggleItem[] = [
  { id: "emailAlerts", title: "Email notifications", description: "Allow the application to send email notifications when an email provider is configured.", enabled: true },
  { id: "newInquiry", title: "New inquiry alerts", description: "Show alerts for incoming client inquiries.", enabled: true },
  { id: "projectAlerts", title: "Project updates", description: "Show notifications for important project changes.", enabled: true },
  { id: "securityAlerts", title: "Security alerts", description: "Display alerts for security-related events.", enabled: true },
  { id: "weeklyReports", title: "Weekly reports", description: "Enable the weekly reporting preference.", enabled: false },
  { id: "marketingEmails", title: "Marketing emails", description: "Enable the marketing communication preference.", enabled: false },
];

const tabs: { id: TabId; label: string; icon: string; group: string }[] = [
  { id: "overview", label: "Control overview", icon: "◈", group: "Workspace" },
  { id: "company", label: "Company profile", icon: "▤", group: "Workspace" },
  { id: "website", label: "Website settings", icon: "⌘", group: "Workspace" },
  { id: "branding", label: "Brand identity", icon: "✳", group: "Workspace" },
  { id: "departments", label: "Departments & modules", icon: "▦", group: "Management" },
  { id: "security", label: "Security & access", icon: "◇", group: "Management" },
  { id: "notifications", label: "Notifications", icon: "♧", group: "Management" },
  { id: "integrations", label: "Integrations", icon: "⛓", group: "Platform" },
  { id: "maintenance", label: "Maintenance", icon: "⚙", group: "Platform" },
  { id: "advanced", label: "Advanced settings", icon: "⋯", group: "Platform" },
];

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 shrink-0 rounded-full transition ${
        checked ? "bg-blue-500" : "bg-slate-700"
      }`}
    >
      <span
        className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow transition-all ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  hint?: string;
}) {
  return (
    <label className="block min-w-0">
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-[#080c14] px-3.5 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/10"
      />
      {hint && <span className="mt-2 block text-xs leading-5 text-slate-500">{hint}</span>}
    </label>
  );
}

function Panel({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c111b]">
      <div className="flex flex-col gap-3 border-b border-white/[0.07] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="font-semibold text-white">{title}</h2>
          {description && <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>}
        </div>
        {action}
      </div>
      <div className="space-y-5 p-5 sm:p-6">{children}</div>
    </section>
  );
}

function PreferenceRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-1">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-200">{title}</p>
        <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-500">{description}</p>
      </div>
      <Toggle checked={checked} onChange={onChange} label={title} />
    </div>
  );
}

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [company, setCompany] = useState({
    name: "VEXORA Technology",
    legalName: "VEXORA Technology",
    email: "contact@vexora.com",
    phone: "",
    website: "https://vexora.com",
    address: "",
    country: "Egypt",
    currency: "USD",
    timezone: "Africa/Cairo",
    language: "en",
    taxNumber: "",
    description: "Technology solutions for modern businesses.",
  });
  const [website, setWebsite] = useState({
    title: "VEXORA | Technology Solutions",
    tagline: "Technology that moves your business forward.",
    domain: "vexora.com",
    supportEmail: "support@vexora.com",
    seoDescription: "VEXORA provides software development, cybersecurity, networks, data analytics and digital marketing.",
    keywords: "software development, cybersecurity, data analytics, VEXORA",
    maintenance: false,
    registration: true,
    publicInquiries: true,
    indexing: true,
  });
  const [branding, setBranding] = useState({
    primary: "#1687ff",
    secondary: "#45a5ff",
    accent: "#c0c7d1",
    logoPath: "/vexora-logo.png",
    faviconPath: "/favicon.ico",
    darkMode: true,
    showFooter: true,
  });
  const [modules, setModules] = useState<ModuleItem[]>(initialModules);
  const [preferences, setPreferences] = useState<ToggleItem[]>(initialToggles);
  const [security, setSecurity] = useState({
    mfa: true,
    loginAlerts: true,
    sessionTimeout: "30",
    passwordLength: "12",
    maxAttempts: "5",
    allowRegistration: true,
    enforceHttps: true,
    auditLog: true,
  });
  const [integrations, setIntegrations] = useState({
    supabase: true,
    emailProvider: false,
    analytics: false,
    storage: false,
    payment: false,
    webhook: false,
  });
  const [advanced, setAdvanced] = useState({
    debugMode: false,
    cacheEnabled: true,
    publicApi: false,
    telemetry: false,
    backupReminder: true,
    environment: "Production",
  });
  const [newModuleName, setNewModuleName] = useState("");
  const [newModuleCategory, setNewModuleCategory] = useState("Operations");
  const [showModuleForm, setShowModuleForm] = useState(false);
  const [moduleFilter, setModuleFilter] = useState("All");
  const [saving, setSaving] = useState(false);

  const enabledModules = useMemo(() => modules.filter((module) => module.enabled).length, [modules]);
  const filteredModules = useMemo(() => {
    const query = search.trim().toLowerCase();
    return modules.filter((module) => {
      const matchesSearch = !query || `${module.name} ${module.description} ${module.category}`.toLowerCase().includes(query);
      const matchesFilter = moduleFilter === "All" ||
        (moduleFilter === "Enabled" && module.enabled) ||
        (moduleFilter === "Disabled" && !module.enabled) ||
        module.category === moduleFilter;
      return matchesSearch && matchesFilter;
    });
  }, [modules, search, moduleFilter]);

  function updateCompany<K extends keyof typeof company>(key: K, value: (typeof company)[K]) {
    setCompany((current) => ({ ...current, [key]: value }));
  }

  function updateWebsite<K extends keyof typeof website>(key: K, value: (typeof website)[K]) {
    setWebsite((current) => ({ ...current, [key]: value }));
  }

  function updateBranding<K extends keyof typeof branding>(key: K, value: (typeof branding)[K]) {
    setBranding((current) => ({ ...current, [key]: value }));
  }

  function updateSecurity<K extends keyof typeof security>(key: K, value: (typeof security)[K]) {
    setSecurity((current) => ({ ...current, [key]: value }));
  }

  function updateAdvanced<K extends keyof typeof advanced>(key: K, value: (typeof advanced)[K]) {
    setAdvanced((current) => ({ ...current, [key]: value }));
  }

  function togglePreference(id: string, enabled: boolean) {
    setPreferences((current) => current.map((item) => item.id === id ? { ...item, enabled } : item));
  }

  function toggleModule(id: string, enabled: boolean) {
    setModules((current) => current.map((module) => module.id === id ? { ...module, enabled } : module));
  }

  function addModule(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newModuleName.trim();
    if (!name) return;
    if (modules.some((module) => module.name.toLowerCase() === name.toLowerCase())) {
      setNotice("A module with this name already exists in the current settings preview.");
      return;
    }
    setModules((current) => [...current, {
      id: `custom-${Date.now()}`,
      name,
      description: "Custom module added in the settings preview.",
      enabled: true,
      category: newModuleCategory,
    }]);
    setNewModuleName("");
    setShowModuleForm(false);
    setNotice("Custom module added to this page preview.");
  }

  function deleteModule(module: ModuleItem) {
    if (!window.confirm(`Remove "${module.name}" from this settings preview?`)) return;
    setModules((current) => current.filter((item) => item.id !== module.id));
    setNotice("Module removed from this page preview only.");
  }

  function exportSettings() {
    const data = {
      exportedAt: new Date().toISOString(),
      company,
      website,
      branding,
      modules,
      preferences,
      security,
      integrations,
      advanced,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "vexora-settings-preview.json";
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("Settings preview exported as a JSON file.");
  }

  function savePreview() {
    setSaving(true);
    setNotice("Your current changes are active in this page preview. Shared database settings are not connected yet.");
    setSaving(false);
  }

  function resetPreview() {
    if (!window.confirm("Reset all settings on this page to the initial preview values?")) return;
    setCompany({
      name: "VEXORA Technology", legalName: "VEXORA Technology", email: "contact@vexora.com",
      phone: "", website: "https://vexora.com", address: "", country: "Egypt", currency: "USD",
      timezone: "Africa/Cairo", language: "en", taxNumber: "",
      description: "Technology solutions for modern businesses.",
    });
    setWebsite({
      title: "VEXORA | Technology Solutions",
      tagline: "Technology that moves your business forward.",
      domain: "vexora.com", supportEmail: "support@vexora.com",
      seoDescription: "VEXORA provides software development, cybersecurity, networks, data analytics and digital marketing.",
      keywords: "software development, cybersecurity, data analytics, VEXORA",
      maintenance: false, registration: true, publicInquiries: true, indexing: true,
    });
    setBranding({
      primary: "#1687ff", secondary: "#45a5ff", accent: "#c0c7d1",
      logoPath: "/vexora-logo.png", faviconPath: "/favicon.ico", darkMode: true, showFooter: true,
    });
    setModules(initialModules);
    setPreferences(initialToggles);
    setSecurity({
      mfa: true, loginAlerts: true, sessionTimeout: "30", passwordLength: "12",
      maxAttempts: "5", allowRegistration: true, enforceHttps: true, auditLog: true,
    });
    setIntegrations({
      supabase: true, emailProvider: false, analytics: false, storage: false,
      payment: false, webhook: false,
    });
    setAdvanced({
      debugMode: false, cacheEnabled: true, publicApi: false,
      telemetry: false, backupReminder: true, environment: "Production",
    });
    setSearch("");
    setModuleFilter("All");
    setNotice("Settings preview has been reset to its initial values.");
  }

  const currentTab = tabs.find((tab) => tab.id === activeTab);

  return (
    <main className="min-h-screen bg-[#080b12] px-4 py-5 text-white sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-[1600px] space-y-6">
        <header className="relative overflow-hidden rounded-3xl border border-blue-400/15 bg-gradient-to-br from-[#111d32] via-[#0d1422] to-[#0b1019] p-5 sm:p-7 lg:p-9">
          <div className="pointer-events-none absolute -right-12 -top-24 h-72 w-72 rounded-full bg-blue-500/[0.10] blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-1/3 h-40 w-40 rounded-full bg-cyan-400/[0.06] blur-3xl" />
          <div className="relative flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-blue-300">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                VEXORA / Command Center
                <span className="rounded-full border border-white/10 bg-white/[0.04] px-2 py-1 tracking-normal text-slate-400">Settings v1.0</span>
              </div>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                Control Center<span className="text-blue-400">.</span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                One workspace for company preferences, website configuration, modules, security, notifications and platform operations.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="rounded-lg border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-2 text-xs text-emerald-300">● Interface ready</span>
                <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-300">{modules.length} modules configured</span>
                <span className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-slate-300">{enabledModules} enabled in preview</span>
              </div>
            </div>
            <div className="relative flex flex-wrap gap-3 xl:max-w-[360px] xl:justify-end">
              <a href="/admin" className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-slate-300 transition hover:bg-white/[0.07]">← Dashboard</a>
              <button type="button" onClick={exportSettings} className="rounded-xl border border-blue-300/20 bg-blue-400/[0.08] px-4 py-3 text-sm font-medium text-blue-200 transition hover:bg-blue-400/[0.15]">Export configuration ↓</button>
              <button type="button" onClick={savePreview} disabled={saving} className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400 disabled:opacity-60">{saving ? "Applying..." : "Apply preview changes ✓"}</button>
            </div>
          </div>
        </header>

        {notice && (
          <div role="status" className="flex items-start justify-between gap-3 rounded-xl border border-blue-400/20 bg-blue-400/[0.07] px-4 py-3 text-sm leading-6 text-blue-200">
            <span>{notice}</span>
            <button type="button" onClick={() => setNotice("")} aria-label="Dismiss notification" className="shrink-0 text-blue-200 hover:text-white">✕</button>
          </div>
        )}

        <section className="rounded-2xl border border-blue-400/15 bg-[#0c111b] p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">Public form inboxes</p>
          <h2 className="mt-2 text-lg font-semibold text-white">Registration & inquiry submissions</h2>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-400">Open the database-backed inboxes to review submissions from the VEXORA website.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Link href="/admin/inquiries" className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-blue-400/40 hover:bg-blue-400/[0.05]">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-300">Business</span>
              <span className="mt-2 block font-medium text-white">Client inquiries ↗</span>
              <span className="mt-1 block text-xs leading-5 text-slate-400">Review requests, contact details, priorities and follow-up status.</span>
            </Link>
            <Link href="/admin/registrations" className="rounded-xl border border-white/10 bg-white/[0.02] p-4 transition hover:border-cyan-400/40 hover:bg-cyan-400/[0.05]">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-cyan-300">Academy</span>
              <span className="mt-2 block font-medium text-white">Student registrations ↗</span>
              <span className="mt-1 block text-xs leading-5 text-slate-400">Review student interest, learning track and registration status.</span>
            </Link>
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
          {[
            { label: "Configured modules", value: modules.length, note: "Core and custom entries", icon: "▦" },
            { label: "Enabled modules", value: enabledModules, note: "Enabled in this preview", icon: "◉" },
            { label: "Preferences enabled", value: preferences.filter((item) => item.enabled).length, note: "Notification preferences", icon: "♧" },
            { label: "Integration switches", value: Object.values(integrations).filter(Boolean).length, note: "Not a connection health check", icon: "⛓" },
          ].map((item) => (
            <article key={item.label} className="rounded-2xl border border-white/[0.08] bg-[#0c111b] p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs leading-5 text-slate-400 sm:text-sm">{item.label}</p>
                <span className="text-lg text-blue-300">{item.icon}</span>
              </div>
              <p className="mt-4 text-2xl font-semibold tabular-nums sm:text-3xl">{item.value}</p>
              <p className="mt-2 text-[11px] leading-4 text-slate-600">{item.note}</p>
            </article>
          ))}
        </section>

        <div className="grid items-start gap-6 xl:grid-cols-[270px_minmax(0,1fr)]">
          <aside className="rounded-2xl border border-white/[0.08] bg-[#0c111b] p-3 xl:sticky xl:top-5">
            <p className="px-3 pb-3 pt-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">Control navigation</p>
            {["Workspace", "Management", "Platform"].map((group) => (
              <div key={group} className="mb-4">
                <p className="px-3 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-600">{group}</p>
                <nav className="space-y-1" aria-label={`${group} settings`}>
                  {tabs.filter((tab) => tab.group === group).map((tab) => (
                    <button key={tab.id} type="button" onClick={() => setActiveTab(tab.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${activeTab === tab.id ? "border border-blue-400/15 bg-blue-500/10 font-medium text-blue-200" : "border border-transparent text-slate-400 hover:bg-white/[0.035] hover:text-slate-200"}`}>
                      <span className={`flex h-8 w-8 items-center justify-center rounded-lg text-base ${activeTab === tab.id ? "bg-blue-400/10 text-blue-300" : "bg-white/[0.03] text-slate-500"}`}>{tab.icon}</span>
                      <span className="flex-1">{tab.label}</span>
                      {activeTab === tab.id && <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />}
                    </button>
                  ))}
                </nav>
              </div>
            ))}
            <div className="mt-3 rounded-xl border border-amber-300/10 bg-amber-300/[0.035] p-3">
              <p className="text-xs font-medium text-amber-200">Preview mode</p>
              <p className="mt-1 text-[11px] leading-5 text-slate-500">Settings on this page are not yet connected to shared production configuration.</p>
            </div>
          </aside>

          <div className="min-w-0 space-y-5">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-300">Configuration workspace</p>
                <h2 className="mt-2 text-2xl font-semibold">{currentTab?.label}</h2>
                <p className="mt-1 text-sm text-slate-500">Configure the selected area using the controls below.</p>
              </div>
              <span className="w-fit rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-500">Changes update this preview instantly</span>
            </div>

            {activeTab === "overview" && (
              <>
                <Panel title="System configuration map" description="Jump directly to the area you want to manage.">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {[
                      { tab: "company" as TabId, title: "Company identity", description: "Legal details, contact information, currency and locale.", icon: "▤" },
                      { tab: "website" as TabId, title: "Website configuration", description: "Website metadata, SEO, registration and public inquiries.", icon: "⌘" },
                      { tab: "branding" as TabId, title: "Visual identity", description: "Brand colors, logo paths and appearance preferences.", icon: "✳" },
                      { tab: "departments" as TabId, title: "Departments and modules", description: "Enable, disable, add and remove preview module entries.", icon: "▦" },
                      { tab: "security" as TabId, title: "Security and access", description: "Review proposed authentication and session preferences.", icon: "◇" },
                      { tab: "integrations" as TabId, title: "Connected services", description: "Track intended integrations and configuration status.", icon: "⛓" },
                    ].map((item) => (
                      <button key={item.tab} type="button" onClick={() => setActiveTab(item.tab)} className="group flex gap-4 rounded-xl border border-white/[0.07] bg-[#080c14] p-4 text-left transition hover:border-blue-400/25 hover:bg-blue-400/[0.035]">
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-400/[0.07] text-xl text-blue-300">{item.icon}</span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium text-slate-200 group-hover:text-white">{item.title}</span>
                          <span className="mt-1 block text-xs leading-5 text-slate-500">{item.description}</span>
                        </span>
                        <span className="text-slate-600 transition group-hover:translate-x-1 group-hover:text-blue-300">→</span>
                      </button>
                    ))}
                  </div>
                </Panel>
                <Panel title="Platform overview" description="A snapshot of the current editable preview.">
                  <div className="space-y-4">
                    {[
                      { label: "Company profile", value: company.name, color: "bg-blue-400" },
                      { label: "Website domain", value: website.domain || "Not configured", color: "bg-cyan-400" },
                      { label: "Primary locale", value: `${company.language.toUpperCase()} · ${company.timezone}`, color: "bg-violet-400" },
                      { label: "Maintenance preference", value: website.maintenance ? "Enabled in preview" : "Disabled in preview", color: website.maintenance ? "bg-amber-400" : "bg-emerald-400" },
                    ].map((row) => (
                      <div key={row.label} className="flex items-center gap-3 border-b border-white/[0.05] pb-4 last:border-0 last:pb-0">
                        <span className={`h-2 w-2 rounded-full ${row.color}`} />
                        <span className="flex-1 text-sm text-slate-400">{row.label}</span>
                        <span className="max-w-[55%] break-words text-right text-sm text-slate-200">{row.value}</span>
                      </div>
                    ))}
                  </div>
                </Panel>
              </>
            )}

            {activeTab === "company" && (
              <>
                <Panel title="Company profile" description="Core business details used to configure your company identity.">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Company display name" value={company.name} onChange={(v) => updateCompany("name", v)} />
                    <Field label="Legal company name" value={company.legalName} onChange={(v) => updateCompany("legalName", v)} />
                    <Field label="Business email" type="email" value={company.email} onChange={(v) => updateCompany("email", v)} />
                    <Field label="Business phone" value={company.phone} onChange={(v) => updateCompany("phone", v)} placeholder="+20 ..." />
                    <Field label="Company website" value={company.website} onChange={(v) => updateCompany("website", v)} />
                    <Field label="Tax / registration number" value={company.taxNumber} onChange={(v) => updateCompany("taxNumber", v)} placeholder="Optional" />
                    <Field label="Country" value={company.country} onChange={(v) => updateCompany("country", v)} />
                    <Field label="Business address" value={company.address} onChange={(v) => updateCompany("address", v)} placeholder="Street, city, country" />
                  </div>
                  <label className="block text-sm text-slate-300">Company description
                    <textarea rows={4} value={company.description} onChange={(event) => updateCompany("description", event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#080c14] px-3.5 py-3 text-sm leading-6 text-white outline-none focus:border-blue-400/60" />
                  </label>
                </Panel>
                <Panel title="Regional preferences" description="Choose the defaults you intend to use across the platform.">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <label className="block text-sm text-slate-300">Default currency
                      <select value={company.currency} onChange={(event) => updateCompany("currency", event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm text-white outline-none focus:border-blue-400/60">
                        <option value="USD">USD — US Dollar</option><option value="EGP">EGP — Egyptian Pound</option><option value="EUR">EUR — Euro</option><option value="GBP">GBP — British Pound</option><option value="SAR">SAR — Saudi Riyal</option><option value="AED">AED — UAE Dirham</option>
                      </select>
                    </label>
                    <label className="block text-sm text-slate-300">Default language
                      <select value={company.language} onChange={(event) => updateCompany("language", event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm text-white outline-none focus:border-blue-400/60">
                        <option value="en">English</option><option value="ar">العربية</option>
                      </select>
                    </label>
                    <label className="block text-sm text-slate-300 sm:col-span-2">Time zone
                      <select value={company.timezone} onChange={(event) => updateCompany("timezone", event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm text-white outline-none focus:border-blue-400/60">
                        <option value="Africa/Cairo">Africa/Cairo</option><option value="UTC">UTC</option><option value="Europe/London">Europe/London</option><option value="Asia/Riyadh">Asia/Riyadh</option><option value="Asia/Dubai">Asia/Dubai</option><option value="America/New_York">America/New_York</option>
                      </select>
                    </label>
                  </div>
                </Panel>
              </>
            )}

            {activeTab === "website" && (
              <>
                <Panel title="Website configuration" description="Content and discoverability preferences for the public website.">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Website title" value={website.title} onChange={(v) => updateWebsite("title", v)} />
                    <Field label="Domain name" value={website.domain} onChange={(v) => updateWebsite("domain", v)} />
                    <Field label="Homepage tagline" value={website.tagline} onChange={(v) => updateWebsite("tagline", v)} />
                    <Field label="Support email" value={website.supportEmail} onChange={(v) => updateWebsite("supportEmail", v)} type="email" />
                    <Field label="SEO keywords" value={website.keywords} onChange={(v) => updateWebsite("keywords", v)} hint="Separate keywords with commas." />
                  </div>
                  <label className="block text-sm text-slate-300">SEO meta description
                    <textarea rows={4} maxLength={320} value={website.seoDescription} onChange={(event) => updateWebsite("seoDescription", event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#080c14] px-3.5 py-3 text-sm leading-6 text-white outline-none focus:border-blue-400/60" />
                    <span className="mt-1 block text-right text-xs text-slate-600">{website.seoDescription.length}/320</span>
                  </label>
                </Panel>
                <Panel title="Public website behavior" description="These switches describe intended preferences only; they do not alter deployed routes.">
                  <PreferenceRow title="Allow account registration" description="Intended preference for allowing public account registration." checked={website.registration} onChange={(v) => updateWebsite("registration", v)} />
                  <PreferenceRow title="Enable public inquiries" description="Intended preference for accepting contact and inquiry submissions." checked={website.publicInquiries} onChange={(v) => updateWebsite("publicInquiries", v)} />
                  <PreferenceRow title="Allow search engine indexing" description="Intended preference for search engine visibility." checked={website.indexing} onChange={(v) => updateWebsite("indexing", v)} />
                  <PreferenceRow title="Maintenance mode preference" description="Preview switch only. It does not take the live website offline." checked={website.maintenance} onChange={(v) => updateWebsite("maintenance", v)} />
                </Panel>
              </>
            )}

            {activeTab === "branding" && (
              <>
                <Panel title="Brand identity" description="Manage the design tokens and asset paths used by the site.">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field label="Primary brand color" value={branding.primary} onChange={(v) => updateBranding("primary", v)} hint="Hex color, for example #1687ff." />
                    <Field label="Secondary brand color" value={branding.secondary} onChange={(v) => updateBranding("secondary", v)} />
                    <Field label="Accent color" value={branding.accent} onChange={(v) => updateBranding("accent", v)} />
                    <Field label="Logo asset path" value={branding.logoPath} onChange={(v) => updateBranding("logoPath", v)} hint="Current project uses /vexora-logo.png." />
                    <Field label="Favicon asset path" value={branding.faviconPath} onChange={(v) => updateBranding("faviconPath", v)} />
                  </div>
                  <div className="rounded-2xl border border-white/[0.08] bg-[#080c14] p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Brand preview</p>
                    <div className="mt-5 flex flex-wrap items-center gap-4">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/10 text-2xl font-bold" style={{ backgroundColor: `${branding.primary}20`, color: branding.secondary }}>V</div>
                      <div><p className="text-xl font-semibold">{company.name || "Your company"}</p><p className="mt-1 text-xs text-slate-500">Technology · Innovation · Security</p></div>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-2">
                      {[branding.primary, branding.secondary, branding.accent].map((color, index) => (
                        <div key={`${index}-${color}`} className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2">
                          <span className="h-4 w-4 rounded" style={{ backgroundColor: /^#[0-9a-fA-F]{6}$/.test(color) ? color : "#64748b" }} />
                          <span className="font-mono text-xs text-slate-400">{color}</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 rounded-xl p-4" style={{ background: `linear-gradient(120deg, ${/^#[0-9a-fA-F]{6}$/.test(branding.primary) ? branding.primary : "#1687ff"}25, #0c111b)` }}>
                      <p className="text-sm font-medium">Technology that moves your business forward.</p>
                      <button type="button" className="mt-3 rounded-lg px-4 py-2 text-xs font-semibold text-white" style={{ backgroundColor: /^#[0-9a-fA-F]{6}$/.test(branding.primary) ? branding.primary : "#1687ff" }}>Primary button preview</button>
                    </div>
                  </div>
                </Panel>
                <Panel title="Appearance preferences">
                  <PreferenceRow title="Prefer dark administration interface" description="Design preference for the admin workspace." checked={branding.darkMode} onChange={(v) => updateBranding("darkMode", v)} />
                  <PreferenceRow title="Show website footer" description="Preference for displaying the public site footer." checked={branding.showFooter} onChange={(v) => updateBranding("showFooter", v)} />
                </Panel>
              </>
            )}

            {activeTab === "departments" && (
              <>
                <Panel title="Departments & modules" description="Control the module list in this preview, organize entries, and add custom items." action={<button type="button" onClick={() => setShowModuleForm(!showModuleForm)} className="rounded-lg bg-blue-500 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-400">{showModuleForm ? "Cancel" : "+ Add module"}</button>}>
                  {showModuleForm && (
                    <form onSubmit={addModule} className="grid gap-3 rounded-xl border border-blue-400/20 bg-blue-400/[0.035] p-4 sm:grid-cols-[1fr_180px_auto] sm:items-end">
                      <Field label="Module name" value={newModuleName} onChange={setNewModuleName} placeholder="e.g. HR Management" />
                      <label className="block text-sm text-slate-300">Category
                        <select value={newModuleCategory} onChange={(event) => setNewModuleCategory(event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm text-white outline-none focus:border-blue-400/60">
                          {["Core", "Operations", "Business", "Communication", "Security", "People", "Finance", "Analytics", "Content", "Custom"].map((category) => <option key={category} value={category}>{category}</option>)}
                        </select>
                      </label>
                      <button type="submit" className="rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-400">Add</button>
                    </form>
                  )}
                  <div className="grid gap-3 sm:grid-cols-3">
                    <label className="sm:col-span-2"><span className="sr-only">Search modules</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search departments and modules..." className="w-full rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-blue-400/60" /></label>
                    <select value={moduleFilter} onChange={(event) => setModuleFilter(event.target.value)} aria-label="Filter modules" className="rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm text-slate-300 outline-none focus:border-blue-400/60">
                      {["All", "Enabled", "Disabled", "Core", "Operations", "Business", "Communication", "Security", "People", "Finance", "Analytics", "Content", "Custom"].map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    {filteredModules.map((module) => (
                      <article key={module.id} className="flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-[#080c14] p-4 sm:flex-row sm:items-center">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-400/[0.06] text-lg text-blue-300">▦</div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2"><h3 className="text-sm font-medium text-slate-200">{module.name}</h3><span className="rounded-md border border-white/10 px-2 py-0.5 text-[10px] text-slate-500">{module.category}</span></div>
                          <p className="mt-1 text-xs leading-5 text-slate-500">{module.description}</p>
                          <p className="mt-1 text-[10px] text-slate-600">{module.enabled ? "Enabled in preview" : "Disabled in preview"} · {module.id}</p>
                        </div>
                        <div className="flex items-center justify-between gap-3 sm:justify-end">
                          <Toggle checked={module.enabled} onChange={(value) => toggleModule(module.id, value)} label={`Enable ${module.name}`} />
                          <button type="button" onClick={() => deleteModule(module)} className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-400 transition hover:border-rose-400/30 hover:text-rose-300">Remove</button>
                        </div>
                      </article>
                    ))}
                    {filteredModules.length === 0 && <p className="rounded-xl border border-white/[0.07] p-8 text-center text-sm text-slate-500">No modules match your search.</p>}
                  </div>
                  <p className="rounded-lg border border-amber-300/10 bg-amber-300/[0.035] p-3 text-xs leading-5 text-amber-100/70">Important: toggling or removing an item changes this settings preview only. It does not create routes, change the sidebar, or enforce permissions in the application.</p>
                </Panel>
              </>
            )}

            {activeTab === "security" && (
              <>
                <Panel title="Authentication preferences" description="Review desired security controls before implementing them on the server.">
                  <PreferenceRow title="Multi-factor authentication" description="Preferred requirement for privileged accounts. Real enforcement must be configured in the authentication provider." checked={security.mfa} onChange={(v) => updateSecurity("mfa", v)} />
                  <PreferenceRow title="Login notifications" description="Preference for alerting administrators about login activity." checked={security.loginAlerts} onChange={(v) => updateSecurity("loginAlerts", v)} />
                  <PreferenceRow title="Allow public registration" description="Desired registration policy; this switch does not change the authentication provider." checked={security.allowRegistration} onChange={(v) => updateSecurity("allowRegistration", v)} />
                  <PreferenceRow title="Require HTTPS" description="Desired transport-security policy. Configure this at the hosting and deployment layers." checked={security.enforceHttps} onChange={(v) => updateSecurity("enforceHttps", v)} />
                  <PreferenceRow title="Audit log preference" description="Preference to maintain a trace of administrative actions. A real audit log requires server-side storage." checked={security.auditLog} onChange={(v) => updateSecurity("auditLog", v)} />
                </Panel>
                <Panel title="Session and password policy" description="Proposed policy values; not enforced by these form fields.">
                  <div className="grid gap-5 sm:grid-cols-3">
                    <label className="block text-sm text-slate-300">Session timeout (minutes)
                      <select value={security.sessionTimeout} onChange={(event) => updateSecurity("sessionTimeout", event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm text-white outline-none focus:border-blue-400/60">{["15", "30", "60", "120", "240"].map((v) => <option key={v} value={v}>{v} minutes</option>)}</select>
                    </label>
                    <label className="block text-sm text-slate-300">Minimum password length
                      <select value={security.passwordLength} onChange={(event) => updateSecurity("passwordLength", event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm text-white outline-none focus:border-blue-400/60">{["8", "10", "12", "14", "16"].map((v) => <option key={v} value={v}>{v} characters</option>)}</select>
                    </label>
                    <label className="block text-sm text-slate-300">Failed login attempts
                      <select value={security.maxAttempts} onChange={(event) => updateSecurity("maxAttempts", event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm text-white outline-none focus:border-blue-400/60">{["3", "5", "10"].map((v) => <option key={v} value={v}>{v} attempts</option>)}</select>
                    </label>
                  </div>
                  <p className="rounded-xl border border-rose-400/15 bg-rose-400/[0.04] p-3 text-xs leading-5 text-rose-200/80">Changing these preferences here does not change Supabase Auth policies, server-side authorization, or active sessions. Do not use this page as a security boundary.</p>
                </Panel>
              </>
            )}

            {activeTab === "notifications" && (
              <Panel title="Notification preferences" description="Toggle the notification preferences you intend to enable. Delivery requires actual providers and server-side workflows.">
                {preferences.map((item) => <PreferenceRow key={item.id} title={item.title} description={item.description} checked={item.enabled} onChange={(value) => togglePreference(item.id, value)} />)}
                <div className="rounded-xl border border-white/[0.07] bg-[#080c14] p-4">
                  <p className="text-sm font-medium text-slate-200">Delivery configuration</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">Email provider, sender verification, notification templates and delivery logs must be configured separately before messages can be sent.</p>
                  <button type="button" onClick={() => setActiveTab("integrations")} className="mt-3 text-xs font-medium text-blue-300 hover:text-blue-200">Review integrations →</button>
                </div>
              </Panel>
            )}

            {activeTab === "integrations" && (
              <Panel title="Integrations & services" description="Select which integrations are intended for the platform. These switches do not test or create live connections.">
                {[
                  { id: "supabase" as const, title: "Supabase", description: "Authentication, database and storage services.", icon: "S", color: "text-emerald-300" },
                  { id: "emailProvider" as const, title: "Email provider", description: "Transactional email delivery and notifications.", icon: "✉", color: "text-blue-300" },
                  { id: "analytics" as const, title: "Web analytics", description: "Traffic measurement and website performance insights.", icon: "↗", color: "text-violet-300" },
                  { id: "storage" as const, title: "File storage", description: "Documents, user uploads and company assets.", icon: "▤", color: "text-cyan-300" },
                  { id: "payment" as const, title: "Payment gateway", description: "Invoices and online payment processing.", icon: "$", color: "text-amber-300" },
                  { id: "webhook" as const, title: "Webhooks / API", description: "Connect external services to authorized event endpoints.", icon: "⛓", color: "text-rose-300" },
                ].map((item) => (
                  <div key={item.id} className="flex flex-col gap-3 rounded-xl border border-white/[0.07] bg-[#080c14] p-4 sm:flex-row sm:items-center">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.025] text-lg font-semibold ${item.color}`}>{item.icon}</div>
                    <div className="flex-1"><p className="text-sm font-medium text-slate-200">{item.title}</p><p className="mt-1 text-xs leading-5 text-slate-500">{item.description}</p></div>
                    <div className="flex items-center gap-3"><span className={`text-[10px] ${integrations[item.id] ? "text-emerald-300" : "text-slate-500"}`}>{integrations[item.id] ? "Selected" : "Not selected"}</span><Toggle checked={integrations[item.id]} onChange={(value) => setIntegrations((current) => ({ ...current, [item.id]: value }))} label={`Select ${item.title}`} /></div>
                  </div>
                ))}
                <p className="rounded-xl border border-amber-300/10 bg-amber-300/[0.035] p-3 text-xs leading-5 text-amber-100/70">Never put service-role keys, private API secrets, or payment credentials in this client-side page. Configure secrets on the server or in your hosting environment.</p>
              </Panel>
            )}

            {activeTab === "maintenance" && (
              <>
                <Panel title="Website availability" description="Operational preferences and planned maintenance controls.">
                  <PreferenceRow title="Maintenance mode preference" description="Preview only. Activating this does not block public traffic or deploy a maintenance page." checked={website.maintenance} onChange={(v) => updateWebsite("maintenance", v)} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-white/[0.07] bg-[#080c14] p-4"><p className="text-xs text-slate-500">Application status</p><p className="mt-2 font-medium text-emerald-300">No live health check</p><p className="mt-2 text-xs leading-5 text-slate-600">A server-side health endpoint is required to measure actual availability.</p></div>
                    <div className="rounded-xl border border-white/[0.07] bg-[#080c14] p-4"><p className="text-xs text-slate-500">Deployment status</p><p className="mt-2 font-medium text-slate-200">Not connected</p><p className="mt-2 text-xs leading-5 text-slate-600">This page does not trigger deployments or control Vercel.</p></div>
                  </div>
                </Panel>
                <Panel title="Operational safeguards" description="Preferences for operational practices.">
                  <PreferenceRow title="Enable cache preference" description="Proposed caching preference. Actual cache behavior is controlled by the application and deployment." checked={advanced.cacheEnabled} onChange={(v) => updateAdvanced("cacheEnabled", v)} />
                  <PreferenceRow title="Backup reminders" description="Reminder preference only; it does not create database backups." checked={advanced.backupReminder} onChange={(v) => updateAdvanced("backupReminder", v)} />
                  <button type="button" onClick={exportSettings} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:bg-white/[0.04]">Export current configuration</button>
                </Panel>
              </>
            )}

            {activeTab === "advanced" && (
              <>
                <Panel title="Advanced platform preferences" description="These are UI-level configuration choices, not runtime environment changes.">
                  <label className="block text-sm text-slate-300">Environment label
                    <select value={advanced.environment} onChange={(event) => updateAdvanced("environment", event.target.value)} className="mt-2 w-full rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm text-white outline-none focus:border-blue-400/60 sm:max-w-sm">
                      <option value="Development">Development</option><option value="Staging">Staging</option><option value="Production">Production</option>
                    </select>
                  </label>
                  <PreferenceRow title="Debug mode preference" description="Intended development preference. Does not change Next.js build settings." checked={advanced.debugMode} onChange={(v) => updateAdvanced("debugMode", v)} />
                  <PreferenceRow title="Caching preference" description="Intended application preference; implementation is managed in code and deployment configuration." checked={advanced.cacheEnabled} onChange={(v) => updateAdvanced("cacheEnabled", v)} />
                  <PreferenceRow title="Public API preference" description="A UI preference only. It does not create or expose API endpoints." checked={advanced.publicApi} onChange={(v) => updateAdvanced("publicApi", v)} />
                  <PreferenceRow title="Telemetry preference" description="Preference only; no telemetry provider is configured by this control." checked={advanced.telemetry} onChange={(v) => updateAdvanced("telemetry", v)} />
                  <PreferenceRow title="Backup reminders" description="Preference only; configure an actual backup and recovery process separately." checked={advanced.backupReminder} onChange={(v) => updateAdvanced("backupReminder", v)} />
                </Panel>
                <Panel title="Configuration management" description="Export your current preview or restore the initial values.">
                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button type="button" onClick={exportSettings} className="rounded-xl border border-blue-400/20 bg-blue-400/[0.06] px-4 py-3 text-sm font-medium text-blue-200 hover:bg-blue-400/[0.12]">Export JSON configuration ↓</button>
                    <button type="button" onClick={resetPreview} className="rounded-xl border border-rose-400/20 px-4 py-3 text-sm text-rose-300 transition hover:bg-rose-400/[0.06]">Reset preview to defaults</button>
                  </div>
                  <p className="text-xs leading-5 text-slate-500">Export downloads a JSON snapshot of the current form state. Reset changes this page state only; neither action modifies the live database.</p>
                </Panel>
              </>
            )}

            <div className="flex flex-col justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#0c111b] p-4 sm:flex-row sm:items-center sm:p-5">
              <div><p className="text-sm font-medium text-slate-200">Configuration preview</p><p className="mt-1 text-xs leading-5 text-slate-500">Changes are interactive but are not yet saved to a shared database.</p></div>
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={exportSettings} className="rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 hover:bg-white/[0.04]">Export</button>
                <button type="button" onClick={savePreview} className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-400">Apply preview</button>
              </div>
            </div>
          </div>
        </div>

        <footer className="flex flex-col gap-2 border-t border-white/[0.06] pt-5 text-xs leading-5 text-slate-600 sm:flex-row sm:justify-between">
          <p>VEXORA Command Center · Administration</p>
          <p>Preview interface · Database persistence and operational actions are not connected</p>
        </footer>
      </div>
    </main>
  );
}
