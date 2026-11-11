"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

type MessageStatus = "Unread" | "Read" | "Archived";
type MessagePriority = "Normal" | "Important" | "Urgent";

type MessageItem = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: MessageStatus;
  priority: MessagePriority;
  starred: boolean;
  company: string;
};

const initialMessages: MessageItem[] = [];

const statusStyles: Record<MessageStatus, string> = {
  Unread: "border-blue-400/25 bg-blue-400/10 text-blue-300",
  Read: "border-white/10 bg-white/[0.04] text-slate-400",
  Archived: "border-amber-400/20 bg-amber-400/10 text-amber-300",
};

const priorityStyles: Record<MessagePriority, string> = {
  Normal: "text-slate-400",
  Important: "text-blue-300",
  Urgent: "text-rose-300",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCompose, setShowCompose] = useState(false);
  const [notice, setNotice] = useState("");
  const [compose, setCompose] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    company: "",
    priority: "Normal" as MessagePriority,
  });

  const selectedMessage =
    messages.find((message) => message.id === selectedId) ?? null;

  const stats = useMemo(
    () => ({
      total: messages.length,
      unread: messages.filter((message) => message.status === "Unread").length,
      starred: messages.filter((message) => message.starred).length,
      archived: messages.filter((message) => message.status === "Archived").length,
    }),
    [messages],
  );

  const filteredMessages = useMemo(() => {
    const term = search.trim().toLowerCase();

    return messages
      .filter((message) => {
        const matchesSearch =
          !term ||
          [
            message.name,
            message.email,
            message.subject,
            message.company,
            message.message,
            message.id,
          ].some((value) => value.toLowerCase().includes(term));

        const matchesStatus =
          statusFilter === "All" || message.status === statusFilter;
        const matchesPriority =
          priorityFilter === "All" || message.priority === priorityFilter;

        return matchesSearch && matchesStatus && matchesPriority;
      })
      .sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
  }, [messages, search, statusFilter, priorityFilter]);

  const loadMessages = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/messages", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not load messages.");
      const rows = Array.isArray(result.messages) ? result.messages : [];
      setMessages(rows.map((item: {
        id: string; full_name: string; email: string | null; service: string | null;
        message: string | null; company: string | null; created_at: string;
        status: string; priority: string;
      }): MessageItem => ({
        id: item.id,
        name: item.full_name,
        email: item.email || "",
        subject: item.service || "Website inquiry",
        message: item.message || "",
        date: item.created_at,
        status: item.status === "new" ? "Unread" : item.status === "closed" ? "Archived" : "Read",
        priority: item.priority === "urgent" ? "Urgent" : item.priority === "high" ? "Important" : "Normal",
        starred: ["urgent", "high"].includes(item.priority),
        company: item.company || "Not provided",
      })));
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not load messages.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMessages();
  }, [loadMessages]);

  async function updateMessage(id: string, updates: Partial<MessageItem>) {
    setSaving(true);
    setNotice("");
    try {
      const response = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...updates }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not update this message.");
      await loadMessages();
      setNotice("Message updated successfully.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not update this message.");
    } finally {
      setSaving(false);
    }
  }

  function openMessage(message: MessageItem) {
    setSelectedId(message.id);
    if (message.status === "Unread") {
      void updateMessage(message.id, { status: "Read" });
    }
  }



  async function createMessage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setNotice("");
    try {
      const response = await fetch("/api/admin/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(compose),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not save this message.");
      setCompose({
        name: "",
        email: "",
        subject: "",
        message: "",
        company: "",
        priority: "Normal",
      });
      setShowCompose(false);
      setStatusFilter("All");
      setPriorityFilter("All");
      setSearch("");
      await loadMessages();
      setNotice("Message saved to the VEXORA inquiries database.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save this message.");
    } finally {
      setSaving(false);
    }
  }

  function clearNotice() {
    setNotice("");
  }

  return (
    <main className="min-h-screen bg-[#080b12] px-4 py-6 text-white sm:px-6 lg:px-9 lg:py-9">
      <div className="mx-auto max-w-[1500px] space-y-7">
        <header className="flex flex-col justify-between gap-5 border-b border-white/[0.08] pb-7 md:flex-row md:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-300">
              <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
              VEXORA / Communication
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Messages<span className="text-blue-400">.</span>
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Manage incoming inquiries, prioritize conversations, and keep
              every client communication organized.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 transition hover:border-white/20 hover:bg-white/[0.04]"
            >
              ← Admin dashboard
            </Link>
            <button
              type="button"
              onClick={() => {
                clearNotice();
                setShowCompose(true);
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-400"
            >
              <span className="text-lg leading-none">+</span>
              Compose message
            </button>
          </div>
        </header>

        {notice && (
          <div
            role="status"
            className="flex items-center justify-between gap-4 rounded-xl border border-blue-400/20 bg-blue-400/[0.07] px-4 py-3 text-sm text-blue-200"
          >
            <span>{notice}</span>
            <button
              type="button"
              onClick={clearNotice}
              className="text-blue-200 hover:text-white"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        )}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            {
              label: "Total messages",
              value: stats.total,
              icon: "✉",
              detail: "All conversations",
              accent: "text-white",
            },
            {
              label: "Unread messages",
              value: stats.unread,
              icon: "●",
              detail: "Need your attention",
              accent: "text-blue-300",
            },
            {
              label: "Starred messages",
              value: stats.starred,
              icon: "★",
              detail: "Important conversations",
              accent: "text-amber-300",
            },
            {
              label: "Archived",
              value: stats.archived,
              icon: "▤",
              detail: "Stored conversations",
              accent: "text-slate-300",
            },
          ].map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-white/[0.08] bg-gradient-to-br from-[#111a2a] to-[#0b101a] p-5"
            >
              <div className="flex items-start justify-between">
                <p className="text-sm text-slate-400">{stat.label}</p>
                <span className={`text-lg ${stat.accent}`}>{stat.icon}</span>
              </div>
              <p className={`mt-5 text-3xl font-semibold ${stat.accent}`}>
                {stat.value}
              </p>
              <p className="mt-2 text-xs text-slate-500">{stat.detail}</p>
            </article>
          ))}
        </section>

        <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c111b]">
          <div className="flex flex-col gap-4 border-b border-white/[0.07] p-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold">Inbox</h2>
              <p className="mt-1 text-xs text-slate-500">
                {filteredMessages.length} conversation
                {filteredMessages.length === 1 ? "" : "s"} shown
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[650px]">
              <label className="relative block">
                <span className="sr-only">Search messages</span>
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
                  ⌕
                </span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search messages..."
                  className="w-full rounded-xl border border-white/10 bg-[#080c14] py-3 pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-blue-400/60"
                />
              </label>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                aria-label="Filter by message status"
                className="rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm text-slate-300 outline-none focus:border-blue-400/60"
              >
                <option value="All">All statuses</option>
                <option value="Unread">Unread</option>
                <option value="Read">Read</option>
                <option value="Archived">Archived</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(event) => setPriorityFilter(event.target.value)}
                aria-label="Filter by priority"
                className="rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm text-slate-300 outline-none focus:border-blue-400/60"
              >
                <option value="All">All priorities</option>
                <option value="Urgent">Urgent</option>
                <option value="Important">Important</option>
                <option value="Normal">Normal</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="px-6 py-20 text-center text-sm text-slate-400">Loading live inquiries...</div>
          ) : filteredMessages.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] text-2xl text-slate-400">
                ✉
              </div>
              <h3 className="mt-5 font-medium">No messages found</h3>
              <p className="mt-2 text-sm text-slate-500">
                Try changing your search or filters, or compose a message.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setPriorityFilter("All");
                }}
                className="mt-4 text-sm text-blue-300 hover:text-blue-200"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="divide-y divide-white/[0.06]">
              {filteredMessages.map((message) => (
                <article
                  key={message.id}
                  className={`group flex flex-col gap-4 px-4 py-5 transition hover:bg-white/[0.025] sm:px-5 lg:flex-row lg:items-start ${
                    message.status === "Unread" ? "bg-blue-400/[0.025]" : ""
                  }`}
                >
                  <div className="flex min-w-0 flex-1 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        void updateMessage(message.id, {
                          starred: !message.starred,
                        })
                      }
                      aria-label={
                        message.starred
                          ? "Remove star from message"
                          : "Star message"
                      }
                      title={message.starred ? "Unstar" : "Star"}
                      className={`mt-1 shrink-0 text-lg transition hover:scale-110 ${
                        message.starred
                          ? "text-amber-300"
                          : "text-slate-600 hover:text-amber-300"
                      }`}
                    >
                      {message.starred ? "★" : "☆"}
                    </button>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/15 bg-gradient-to-br from-blue-500/20 to-slate-700/20 text-sm font-semibold text-blue-200">
                      {initials(message.name)}
                    </div>

                    <button
                      type="button"
                      onClick={() => openMessage(message)}
                      className="min-w-0 flex-1 text-left"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`truncate text-sm ${
                            message.status === "Unread"
                              ? "font-semibold text-white"
                              : "font-medium text-slate-300"
                          }`}
                        >
                          {message.name}
                        </span>
                        {message.status === "Unread" && (
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                        )}
                        <span className="truncate text-xs text-slate-600">
                          {message.company}
                        </span>
                      </div>

                      <p className="mt-1 truncate text-sm font-medium text-slate-200">
                        {message.subject}
                      </p>
                      <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-500">
                        {message.message}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-medium ${statusStyles[message.status]}`}
                        >
                          {message.status}
                        </span>
                        <span
                          className={`text-[11px] ${priorityStyles[message.priority]}`}
                        >
                          {message.priority === "Urgent"
                            ? "↑ "
                            : message.priority === "Important"
                              ? "◆ "
                              : "— "}
                          {message.priority}
                        </span>
                        <span className="text-[11px] text-slate-600">
                          {message.id}
                        </span>
                      </div>
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                    <span className="mr-1 text-xs text-slate-500">
                      {formatDate(message.date)}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateMessage(message.id, {
                          status:
                            message.status === "Archived"
                              ? "Read"
                              : "Archived",
                        })
                      }
                      className="rounded-lg border border-white/10 px-3 py-2 text-xs text-slate-400 transition hover:border-amber-400/30 hover:text-amber-200"
                    >
                      {message.status === "Archived" ? "Restore" : "Archive"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}

          <div className="flex flex-col gap-2 border-t border-white/[0.07] px-5 py-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <span>
              Showing {filteredMessages.length} of {messages.length} messages
            </span>
            <span>VEXORA Communication Center</span>
          </div>
        </section>

        <footer className="flex flex-col gap-2 border-t border-white/[0.06] pt-5 text-xs leading-5 text-slate-600 sm:flex-row sm:justify-between">
          <p>VEXORA Admin · Messages workspace</p>
          <p>Live data from VEXORA inquiries · Updates are saved to Supabase</p>
        </footer>
      </div>

      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedId(null);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="message-detail-title"
            className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-2xl border border-white/10 bg-[#0c111b] shadow-2xl sm:rounded-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] p-5 sm:p-6">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-300">
                  Message details
                </p>
                <h2
                  id="message-detail-title"
                  className="mt-2 text-xl font-semibold"
                >
                  {selectedMessage.subject}
                </h2>
                <p className="mt-2 text-xs text-slate-500">
                  {selectedMessage.id} · {formatDate(selectedMessage.date)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                aria-label="Close message details"
                className="rounded-lg border border-white/10 px-3 py-2 text-slate-400 hover:bg-white/5 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6 p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/15 font-semibold text-blue-200">
                  {initials(selectedMessage.name)}
                </div>
                <div className="min-w-0">
                  <p className="font-medium">{selectedMessage.name}</p>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="break-all text-sm text-blue-300 hover:text-blue-200"
                  >
                    {selectedMessage.email}
                  </a>
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedMessage.company}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span
                  className={`rounded-full border px-3 py-1 text-xs ${statusStyles[selectedMessage.status]}`}
                >
                  {selectedMessage.status}
                </span>
                <span
                  className={`rounded-full border border-white/10 px-3 py-1 text-xs ${priorityStyles[selectedMessage.priority]}`}
                >
                  {selectedMessage.priority} priority
                </span>
                {selectedMessage.starred && (
                  <span className="rounded-full border border-amber-300/20 bg-amber-300/10 px-3 py-1 text-xs text-amber-200">
                    ★ Starred
                  </span>
                )}
              </div>

              <div className="rounded-xl border border-white/[0.07] bg-[#080c14] p-5">
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                  {selectedMessage.message}
                </p>
              </div>

              <div>
                <label
                  htmlFor="message-priority"
                  className="mb-2 block text-xs font-medium text-slate-400"
                >
                  Update priority
                </label>
                <select
                  id="message-priority"
                  value={selectedMessage.priority}
                  onChange={(event) =>
                    updateMessage(selectedMessage.id, {
                      priority: event.target.value as MessagePriority,
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm text-white outline-none focus:border-blue-400/60"
                >
                  <option value="Normal">Normal</option>
                  <option value="Important">Important</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-white/[0.07] pt-5">
                <a
                  href={`mailto:${selectedMessage.email}?subject=${encodeURIComponent(`Re: ${selectedMessage.subject}`)}`}
                  className="inline-flex flex-1 items-center justify-center rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-blue-400"
                >
                  Reply by email ↗
                </a>
                <button
                  type="button"
                  onClick={() =>
                    void updateMessage(selectedMessage.id, {
                      starred: !selectedMessage.starred,
                    })
                  }
                  className="rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 hover:bg-white/[0.04]"
                >
                  {selectedMessage.starred ? "★ Unstar" : "☆ Star"}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateMessage(selectedMessage.id, {
                      status:
                        selectedMessage.status === "Archived"
                          ? "Read"
                          : "Archived",
                    })
                  }
                  className="rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 hover:bg-white/[0.04]"
                >
                  {selectedMessage.status === "Archived"
                    ? "Restore"
                    : "Archive"}
                </button>
              </div>
            </div>
          </section>
        </div>
      )}

      {showCompose && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 p-0 backdrop-blur-sm sm:items-center sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowCompose(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="compose-title"
            className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-2xl border border-white/10 bg-[#0c111b] shadow-2xl sm:rounded-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/[0.08] p-5">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-blue-300">
                  Workspace tools
                </p>
                <h2 id="compose-title" className="mt-2 text-xl font-semibold">
                  Compose message
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setShowCompose(false)}
                aria-label="Close form"
                className="rounded-lg border border-white/10 px-3 py-2 text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={createMessage} className="space-y-4 p-5">
              <p className="rounded-xl border border-amber-300/15 bg-amber-300/[0.05] p-3 text-xs leading-5 text-amber-100/80">
                This form creates a local test record only. It does not send a
                message or contact a real recipient.
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-xs text-slate-400">
                  Sender name *
                  <input
                    required
                    maxLength={100}
                    value={compose.name}
                    onChange={(event) =>
                      setCompose({ ...compose, name: event.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm text-white outline-none focus:border-blue-400/60"
                    placeholder="Full name"
                  />
                </label>
                <label className="text-xs text-slate-400">
                  Email address *
                  <input
                    required
                    type="email"
                    maxLength={254}
                    value={compose.email}
                    onChange={(event) =>
                      setCompose({ ...compose, email: event.target.value })
                    }
                    className="mt-2 w-full rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm text-white outline-none focus:border-blue-400/60"
                    placeholder="name@example.com"
                  />
                </label>
              </div>

              <label className="block text-xs text-slate-400">
                Company
                <input
                  maxLength={150}
                  value={compose.company}
                  onChange={(event) =>
                    setCompose({ ...compose, company: event.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm text-white outline-none focus:border-blue-400/60"
                  placeholder="Company name (optional)"
                />
              </label>

              <label className="block text-xs text-slate-400">
                Subject *
                <input
                  required
                  maxLength={200}
                  value={compose.subject}
                  onChange={(event) =>
                    setCompose({ ...compose, subject: event.target.value })
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm text-white outline-none focus:border-blue-400/60"
                  placeholder="Message subject"
                />
              </label>

              <label className="block text-xs text-slate-400">
                Message content *
                <textarea
                  required
                  rows={5}
                  maxLength={10000}
                  value={compose.message}
                  onChange={(event) =>
                    setCompose({ ...compose, message: event.target.value })
                  }
                  className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm text-white outline-none focus:border-blue-400/60"
                  placeholder="Write the message..."
                />
              </label>

              <label className="block text-xs text-slate-400">
                Priority
                <select
                  value={compose.priority}
                  onChange={(event) =>
                    setCompose({
                      ...compose,
                      priority: event.target.value as MessagePriority,
                    })
                  }
                  className="mt-2 w-full rounded-xl border border-white/10 bg-[#080c14] px-3 py-3 text-sm text-white outline-none focus:border-blue-400/60"
                >
                  <option value="Normal">Normal</option>
                  <option value="Important">Important</option>
                  <option value="Urgent">Urgent</option>
                </select>
              </label>

              <div className="flex gap-3 border-t border-white/[0.07] pt-4">
                <button
                  type="button"
                  onClick={() => setShowCompose(false)}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-300 hover:bg-white/[0.04]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-blue-500 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-400"
                >
                  Compose message
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
