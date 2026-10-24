
/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { supabase } from "@/lib/supabase/browser";

const BUCKET = "project-media";
const IMAGE_MAX_SIZE = 15 * 1024 * 1024;
const VIDEO_MAX_SIZE = 50 * 1024 * 1024;
const MAX_FILES = 10;
const SIGNED_URL_SECONDS = 60 * 60;

const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

const VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/ogg",
];

type ProjectStatus =
  | "planning"
  | "in_progress"
  | "completed"
  | "on_hold"
  | "cancelled";

type Client = {
  id: string;
  name: string;
  company?: string | null;
};

type Project = {
  id: string;
  title: string;
  client_id?: string | null;
  client_name?: string | null;
  description?: string | null;
  status: string;
  budget?: number | string | null;
  deadline?: string | null;
  show_on_homepage?: boolean;
  show_on_projects_page?: boolean;
  portfolio_category?: string;
  created_at?: string | null;
  updated_at?: string | null;
};

type ProjectMedia = {
  id: string;
  project_id: string;
  name: string;
  path: string;
  mime_type: string;
  size_bytes: number;
  created_at?: string | null;
};

type MediaView = ProjectMedia & {
  url: string | null;
  urlError?: string;
};

type ProjectForm = {
  title: string;
  client_id: string;
  description: string;
  status: ProjectStatus;
  budget: string;
  deadline: string;
  show_on_homepage: boolean;
  show_on_projects_page: boolean;
  portfolio_category: "Cybersecurity" | "Software Development" | "Networks & Infrastructure" | "Data Analytics" | "Digital Marketing";
};

type Notice = {
  type: "success" | "error" | "info";
  message: string;
};

const EMPTY_FORM: ProjectForm = {
  title: "",
  client_id: "",
  description: "",
  status: "planning",
  budget: "",
  deadline: "",
  show_on_homepage: false,
  show_on_projects_page: false,
  portfolio_category: "Software Development",
};

const STATUS_OPTIONS: {
  value: ProjectStatus;
  label: string;
}[] = [
  { value: "planning", label: "Planning" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "on_hold", label: "On hold" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_META: Record<
  string,
  { label: string; color: string; background: string }
> = {
  planning: {
    label: "Planning",
    color: "#cbd5e1",
    background: "rgba(148,163,184,.12)",
  },
  in_progress: {
    label: "In progress",
    color: "#60a5fa",
    background: "rgba(59,130,246,.13)",
  },
  completed: {
    label: "Completed",
    color: "#4ade80",
    background: "rgba(34,197,94,.12)",
  },
  on_hold: {
    label: "On hold",
    color: "#fbbf24",
    background: "rgba(245,158,11,.12)",
  },
  cancelled: {
    label: "Cancelled",
    color: "#f87171",
    background: "rgba(239,68,68,.12)",
  },
};

const ICON_PATHS: Record<string, ReactNode> = {
  grid: (
    <>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M3 12h18M10 12v2h4v-2" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  users: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="7" r="4" />
      <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
      <path d="m9 15 2 2 4-4" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <path d="m21 15-5-5L5 21" />
    </>
  ),
  video: (
    <>
      <rect x="3" y="5" width="13" height="14" rx="2" />
      <path d="m16 10 5-3v10l-5-3" />
    </>
  ),
  upload: (
    <>
      <path d="M12 16V4" />
      <path d="m7 9 5-5 5 5" />
      <path d="M4 16v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4" />
    </>
  ),
  edit: (
    <>
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L9 17l-4 1 1-4Z" />
    </>
  ),
  trash: (
    <>
      <path d="M3 6h18M8 6V4h8v2" />
      <path d="m19 6-1 14H6L5 6" />
      <path d="M10 10v6M14 10v6" />
    </>
  ),
  close: <path d="m18 6-12 12M6 6l12 12" />,
  arrow: <path d="M5 12h14m-7-7 7 7-7 7" />,
  refresh: (
    <>
      <path d="M20 7v5h-5" />
      <path d="M4 17v-5h5" />
      <path d="M5.6 9A7 7 0 0 1 18 6l2 6M4 12l2 6a7 7 0 0 0 12.4-3" />
    </>
  ),
  dollar: (
    <>
      <path d="M12 2v20" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </>
  ),
  file: (
    <>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6M8 13h8M8 17h8" />
    </>
  ),
  play: <path d="m9 6 10 6-10 6z" />,
  alert: (
    <>
      <path d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.1l-8-14a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </>
  ),
};

function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {ICON_PATHS[name] ?? ICON_PATHS.file}
    </svg>
  );
}

function formatMoney(value: number | string | null | undefined) {
  const amount = Number(value ?? 0);

  if (!Number.isFinite(amount)) return "$0";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(value?: string | null) {
  if (!value) return "No deadline";

  const date = new Date(`${value.slice(0, 10)}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function formatBytes(value: number) {
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) {
    return `${(value / 1024).toFixed(1)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function getStatus(status: string) {
  return (
    STATUS_META[status] ?? {
      label: status.replaceAll("_", " "),
      color: "#cbd5e1",
      background: "rgba(148,163,184,.12)",
    }
  );
}

function getErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error
  ) {
    return String(error.message);
  }

  return "An unexpected error occurred.";
}

function isVideo(media: ProjectMedia) {
  return media.mime_type.startsWith("video/");
}

function isImage(media: ProjectMedia) {
  return media.mime_type.startsWith("image/");
}

async function createMediaView(
  media: ProjectMedia
): Promise<MediaView> {
  const result = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(media.path, SIGNED_URL_SECONDS);

  if (result.error || !result.data?.signedUrl) {
    return {
      ...media,
      url: null,
      urlError:
        result.error?.message ??
        "Could not create a preview link.",
    };
  }

  return {
    ...media,
    url: result.data.signedUrl,
  };
}

function NoticeBanner({
  notice,
  onClose,
}: {
  notice: Notice;
  onClose: () => void;
}) {
  const color =
    notice.type === "success"
      ? "#4ade80"
      : notice.type === "error"
        ? "#f87171"
        : "#60a5fa";

  return (
    <div
      role="status"
      className="mb-5 flex items-start gap-3 rounded-xl border px-4 py-3"
      style={{
        color,
        background: `${color}0d`,
        borderColor: `${color}30`,
      }}
    >
      <Icon
        name={notice.type === "error" ? "alert" : "check"}
        size={19}
      />
      <p className="min-w-0 flex-1 text-sm leading-6 text-slate-200">
        {notice.message}
      </p>
      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
      >
        <Icon name="close" size={17} />
      </button>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const meta = getStatus(status);

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold"
      style={{
        color: meta.color,
        background: meta.background,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: meta.color }}
      />
      {meta.label}
    </span>
  );
}

function MediaPreview({
  media,
  compact = false,
}: {
  media?: MediaView;
  compact?: boolean;
}) {
  if (!media) {
    return (
      <div className="flex h-full min-h-40 flex-col items-center justify-center gap-3 text-slate-500">
        <div className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
          <Icon name="image" size={28} />
        </div>
        <span className="text-xs">No project cover</span>
      </div>
    );
  }

  if (!media.url) {
    return (
      <div className="flex h-full min-h-40 flex-col items-center justify-center gap-3 px-5 text-center">
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-4 text-amber-300">
          <Icon name="alert" size={26} />
        </div>
        <p className="text-sm font-semibold text-slate-200">
          Preview unavailable
        </p>
        <p className="max-w-xs text-xs leading-5 text-slate-500">
          {media.urlError || "Check the storage path and access policies."}
        </p>
      </div>
    );
  }

  if (isVideo(media)) {
    return (
      <video
        key={media.url}
        src={media.url}
        controls
        preload="metadata"
        playsInline
        className={`h-full w-full bg-black object-contain ${
          compact ? "max-h-48" : "max-h-[420px]"
        }`}
      />
    );
  }

  if (isImage(media)) {
    return (
      // A normal img element is intentional here: this is a private,
      // time-limited Supabase signed URL, not a static local asset.
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={media.url}
        src={media.url}
        alt={media.name}
        loading="lazy"
        className={`h-full w-full bg-[#080d16] object-cover ${
          compact ? "max-h-48" : "max-h-[420px]"
        }`}
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    );
  }

  return (
    <div className="flex h-full min-h-40 flex-col items-center justify-center gap-3 text-slate-400">
      <Icon name="file" size={30} />
      <span className="max-w-[85%] truncate text-xs">{media.name}</span>
    </div>
  );
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [mediaByProject, setMediaByProject] = useState<
    Record<string, MediaView[]>
  >({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form, setForm] = useState<ProjectForm>(EMPTY_FORM);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [uploadProgress, setUploadProgress] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const loadData = useCallback(async (showSpinner = true) => {
    if (showSpinner) setLoading(true);
    else setRefreshing(true);

    try {
      const [
        projectsResult,
        clientsResult,
        mediaResult,
      ] = await Promise.all([
        supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: false }),
        supabase
          .from("clients")
          .select("*")
          .order("name", { ascending: true }),
        supabase
          .from("project_media")
          .select("*")
          .order("created_at", { ascending: false }),
      ]);

      if (projectsResult.error) throw projectsResult.error;
      if (clientsResult.error) throw clientsResult.error;

      if (mediaResult.error) {
        throw new Error(
          `Could not load project media: ${mediaResult.error.message}`
        );
      }

      const nextClients = (clientsResult.data ?? []) as Client[];
      const rawProjects = (projectsResult.data ?? []) as unknown as Array<Record<string, unknown>>;
      const nextProjects = rawProjects.map((row) => ({
        ...row,
        title: String(row.title ?? ""),
        deadline: typeof row.deadline === "string" ? row.deadline : null,
        show_on_homepage: row.show_on_homepage === true,
        show_on_projects_page: row.show_on_projects_page === true,
        portfolio_category: String(row.portfolio_category ?? "Software Development"),
        status: row.status === "planned" || row.status === "draft" ? "planning" : String(row.status ?? "planning"),
        client_name: nextClients.find((client) => client.id === row.client_id)?.name ?? null,
      })) as Project[];
      const mediaRows = (mediaResult.data ?? []) as ProjectMedia[];

      const mediaViews = await Promise.all(
        mediaRows.map((item) => createMediaView(item))
      );

      const grouped: Record<string, MediaView[]> = {};

      for (const item of mediaViews) {
        if (!grouped[item.project_id]) {
          grouped[item.project_id] = [];
        }

        grouped[item.project_id].push(item);
      }

      setProjects(nextProjects);
      setClients(nextClients);
      setMediaByProject(grouped);
    } catch (error) {
      setNotice({
        type: "error",
        message: `Unable to load projects. ${getErrorMessage(error)}`,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    if (!modalOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !saving && !uploading) {
        setModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalOpen, saving, uploading]);

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return projects.filter((project) => {
      const client = clients.find(
        (item) => item.id === project.client_id
      );

      const searchable = [
        project.title,
        project.description,
        project.client_name,
        client?.name,
        client?.company,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !query || searchable.includes(query);
      const matchesStatus =
        statusFilter === "all" ||
        project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, clients, search, statusFilter]);

  const stats = useMemo(() => {
    const total = projects.length;
    const active = projects.filter(
      (item) => item.status === "in_progress"
    ).length;
    const completed = projects.filter(
      (item) => item.status === "completed"
    ).length;
    const totalBudget = projects.reduce(
      (sum, item) => sum + Number(item.budget ?? 0),
      0
    );

    return { total, active, completed, totalBudget };
  }, [projects]);

  const openCreateModal = () => {
    setEditingProject(null);
    setForm(EMPTY_FORM);
    setSelectedFiles([]);
    setUploadProgress("");
    setModalOpen(true);
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);

    setForm({
      title: project.title ?? "",
      client_id: project.client_id ?? "",
      description: project.description ?? "",
      status: (
        STATUS_OPTIONS.some((option) => option.value === project.status)
          ? project.status
          : "planning"
      ) as ProjectStatus,
      budget:
        project.budget === null || project.budget === undefined
          ? ""
          : String(project.budget),
      deadline: project.deadline?.slice(0, 10) ?? "",
      show_on_homepage: project.show_on_homepage === true,
      show_on_projects_page: project.show_on_projects_page === true,
      portfolio_category: (project.portfolio_category ?? "Software Development") as ProjectForm["portfolio_category"],
    });

    setSelectedFiles([]);
    setUploadProgress("");
    setModalOpen(true);
  };

  const updateForm = <K extends keyof ProjectForm>(
    key: K,
    value: ProjectForm[K]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleFileSelection = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(event.target.files ?? []);

    // Clear the native input so selecting the same file again works.
    event.target.value = "";

    if (!files.length) return;

    const existingCount = editingProject
      ? mediaByProject[editingProject.id]?.length ?? 0
      : 0;

    if (existingCount + selectedFiles.length + files.length > MAX_FILES) {
      setNotice({
        type: "error",
        message: `A project can have up to ${MAX_FILES} media files.`,
      });
      return;
    }

    const accepted: File[] = [];
    const rejected: string[] = [];

    for (const file of files) {
      const validImage = IMAGE_TYPES.includes(file.type);
      const validVideo = VIDEO_TYPES.includes(file.type);

      if (!validImage && !validVideo) {
        rejected.push(`${file.name}: unsupported file type`);
        continue;
      }

      const limit = validImage ? IMAGE_MAX_SIZE : VIDEO_MAX_SIZE;

      if (file.size <= 0 || file.size > limit) {
        rejected.push(
          `${file.name}: maximum size is ${
            validImage ? "15 MB" : "50 MB"
          }`
        );
        continue;
      }

      accepted.push(file);
    }

    setSelectedFiles((current) => [...current, ...accepted]);

    if (rejected.length) {
      setNotice({
        type: "error",
        message: rejected.join(" · "),
      });
    } else if (accepted.length) {
      setNotice({
        type: "success",
        message: `${accepted.length} file(s) ready to upload.`,
      });
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles((current) =>
      current.filter((_, itemIndex) => itemIndex !== index)
    );
  };

  // Keep tracking arrays owned by handleSave so rollback can access
  // every successfully uploaded file even if a later operation fails.
  const uploadFiles = async (
    projectId: string,
    files: File[],
    uploadedPaths: string[],
    insertedMediaIds: string[]
  ): Promise<void> => {
    for (let index = 0; index < files.length; index += 1) {
      const file = files[index];

      setUploadProgress(
        `Uploading ${index + 1} of ${files.length}: ${file.name}`
      );

      const safeName = file.name
        .normalize("NFKD")
        .replace(/[^\w.-]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(-100);

      const path = `${projectId}/${crypto.randomUUID()}-${safeName || "media"}`;

      const uploadResult = await supabase.storage
        .from(BUCKET)
        .upload(path, file, {
          cacheControl: "3600",
          contentType: file.type,
          upsert: false,
        });

      if (uploadResult.error) {
        throw new Error(
          `Upload failed for ${file.name}: ${uploadResult.error.message}`
        );
      }

      // Track the storage object immediately after a successful upload.
      uploadedPaths.push(path);

      const metadataResult = await supabase
        .from("project_media")
        .insert({
          project_id: projectId,
          name: file.name,
          path,
          mime_type: file.type,
          size_bytes: file.size,
        })
        .select("id")
        .single();

      if (metadataResult.error) {
        throw new Error(
          `The file uploaded but its database record could not be saved: ${metadataResult.error.message}`
        );
      }

      // Track the database record immediately after it is confirmed.
      insertedMediaIds.push(metadataResult.data.id);
    }
  };

  const rollbackUploads = async (
    uploadedPaths: string[],
    insertedMediaIds: string[]
  ) => {
    const cleanupErrors: string[] = [];

    if (insertedMediaIds.length) {
      const databaseCleanup = await supabase
        .from("project_media")
        .delete()
        .in("id", insertedMediaIds);

      if (databaseCleanup.error) {
        cleanupErrors.push(
          `Database cleanup failed: ${databaseCleanup.error.message}`
        );
      }
    }

    if (uploadedPaths.length) {
      const storageCleanup = await supabase.storage
        .from(BUCKET)
        .remove(uploadedPaths);

      if (storageCleanup.error) {
        cleanupErrors.push(
          `Storage cleanup failed: ${storageCleanup.error.message}`
        );
      }
    }

    if (cleanupErrors.length) {
      throw new Error(cleanupErrors.join(" "));
    }
  };

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const title = form.title.trim();
    const description = form.description.trim();
    const budget = form.budget.trim();

    if (title.length < 2 || title.length > 160) {
      setNotice({
        type: "error",
        message: "Project title must be between 2 and 160 characters.",
      });
      return;
    }

    if (description.length > 10000) {
      setNotice({
        type: "error",
        message: "Description cannot exceed 10,000 characters.",
      });
      return;
    }

    if (budget && (!Number.isFinite(Number(budget)) || Number(budget) < 0)) {
      setNotice({
        type: "error",
        message: "Enter a valid, non-negative project budget.",
      });
      return;
    }

    if (
      form.client_id &&
      !clients.some((client) => client.id === form.client_id)
    ) {
      setNotice({
        type: "error",
        message: "Select a valid client.",
      });
      return;
    }

    setSaving(true);
    setNotice(null);

    let createdProjectId: string | null = null;
    const uploadedPaths: string[] = [];
    const insertedMediaIds: string[] = [];

    try {
      const payload = {
        title,
        client_id: form.client_id || null,
        description: description || null,
        status: form.status === "planning" ? "planned" : form.status,
        budget: budget ? Number(budget) : 0,
        deadline: form.deadline || null,
        show_on_homepage: form.show_on_homepage,
        show_on_projects_page: form.show_on_projects_page,
        portfolio_category: form.portfolio_category,
        updated_at: new Date().toISOString(),
      };

      let projectId: string;

      if (editingProject) {
        const result = await supabase
          .from("projects")
          .update(payload)
          .eq("id", editingProject.id)
          .select("id")
          .single();

        if (result.error) throw result.error;

        projectId = result.data.id;
      } else {
        const result = await supabase
          .from("projects")
          .insert(payload)
          .select("id")
          .single();

        if (result.error) throw result.error;

        projectId = result.data.id;
        createdProjectId = projectId;
      }

      if (selectedFiles.length) {
        setUploading(true);

        await uploadFiles(
          projectId,
          selectedFiles,
          uploadedPaths,
          insertedMediaIds
        );
      }

      setNotice({
        type: "success",
        message: editingProject
          ? "Project updated successfully."
          : "Project created successfully.",
      });

      setModalOpen(false);
      setSelectedFiles([]);
      setUploadProgress("");

      await loadData(false);
    } catch (error) {
      let errorMessage = getErrorMessage(error);

      // Clean up only the files and records tracked during this save.
      if (uploadedPaths.length || insertedMediaIds.length) {
        try {
          await rollbackUploads(uploadedPaths, insertedMediaIds);
        } catch (cleanupError) {
          errorMessage +=
            ` Cleanup also reported an error: ${getErrorMessage(cleanupError)}`;
        }
      }

      // If initial media upload fails during creation, attempt to remove
      // the new project to avoid leaving an incomplete project behind.
      if (createdProjectId) {
        const cleanup = await supabase
          .from("projects")
          .delete()
          .eq("id", createdProjectId)
          .select("id");

        if (cleanup.error) {
          errorMessage +=
            ` Project cleanup also failed: ${cleanup.error.message}`;
        } else if (!cleanup.data?.length) {
          errorMessage +=
            " The new project could not be confirmed as deleted.";
        }
      }

      setNotice({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setSaving(false);
      setUploading(false);
      setUploadProgress("");
    }
  };

  const handleDeleteMedia = async (media: MediaView) => {
    const confirmed = window.confirm(
      `Delete "${media.name}" permanently?`
    );

    if (!confirmed) return;

    setDeletingId(media.id);
    setNotice(null);

    try {
      const storageResult = await supabase.storage
        .from(BUCKET)
        .remove([media.path]);

      if (storageResult.error) {
        throw storageResult.error;
      }

      const dbResult = await supabase
        .from("project_media")
        .delete()
        .eq("id", media.id)
        .select("id");

      if (dbResult.error) {
        setNotice({
          type: "error",
          message:
            "The storage file was removed, but its database record could not be deleted. Refresh and check the media table.",
        });
        await loadData(false);
        return;
      }

      if (!dbResult.data?.length) {
        setNotice({
          type: "error",
          message:
            "The database did not confirm the deletion. Check your permissions and refresh the page.",
        });
        await loadData(false);
        return;
      }

      setNotice({
        type: "success",
        message: "Media file deleted.",
      });

      await loadData(false);
    } catch (error) {
      setNotice({
        type: "error",
        message: `Could not delete media: ${getErrorMessage(error)}`,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleDeleteProject = async (project: Project) => {
    const confirmed = window.confirm(
      `Delete "${project.title}" and all of its uploaded media? This cannot be undone.`
    );

    if (!confirmed) return;

    setDeletingId(project.id);
    setNotice(null);

    try {
      const media = mediaByProject[project.id] ?? [];
      const paths = media.map((item) => item.path);
      const ids = media.map((item) => item.id);

      if (paths.length) {
        const storageResult = await supabase.storage
          .from(BUCKET)
          .remove(paths);

        if (storageResult.error) {
          throw new Error(
            `Could not delete project media: ${storageResult.error.message}`
          );
        }
      }

      if (ids.length) {
        const mediaResult = await supabase
          .from("project_media")
          .delete()
          .in("id", ids)
          .select("id");

        if (mediaResult.error) {
          throw new Error(
            `Could not delete media records: ${mediaResult.error.message}`
          );
        }

        if (mediaResult.data?.length !== ids.length) {
          throw new Error(
            "Some media records were not deleted. Check database permissions before retrying."
          );
        }
      }

      const projectResult = await supabase
        .from("projects")
        .delete()
        .eq("id", project.id)
        .select("id");

      if (projectResult.error) {
        throw projectResult.error;
      }

      if (!projectResult.data?.length) {
        throw new Error(
          "The project was not deleted. Check your permissions."
        );
      }

      setNotice({
        type: "success",
        message: "Project deleted successfully.",
      });

      await loadData(false);
    } catch (error) {
      setNotice({
        type: "error",
        message: getErrorMessage(error),
      });
      await loadData(false);
    } finally {
      setDeletingId(null);
    }
  };

  const refreshMediaLink = async (media: MediaView) => {
    const result = await createMediaView(media);

    setMediaByProject((current) => ({
      ...current,
      [media.project_id]: (current[media.project_id] ?? []).map(
        (item) => (item.id === media.id ? result : item)
      ),
    }));
  };

  const inputClass =
    "mt-2 w-full rounded-xl border border-white/[0.10] bg-[#080d16] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/70 focus:ring-2 focus:ring-blue-500/10";

  const fieldLabel =
    "block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400";

  return (
    <main className="min-h-screen bg-[#070a10] text-white">
      <style jsx global>{`
        .project-panel {
          background: linear-gradient(
            145deg,
            rgba(19, 27, 42, 0.95),
            rgba(10, 15, 25, 0.96)
          );
          border: 1px solid rgba(148, 163, 184, 0.12);
        }
        .project-field option {
          background: #0c1220;
          color: #f8fafc;
        }
        .project-button {
          transition:
            transform 160ms ease,
            border-color 160ms ease,
            background 160ms ease,
            box-shadow 160ms ease;
        }
        .project-button:hover:not(:disabled) {
          transform: translateY(-1px);
        }
        .project-button:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }
        .project-card {
          transition:
            border-color 180ms ease,
            transform 180ms ease,
            box-shadow 180ms ease;
        }
        .project-card:hover {
          border-color: rgba(59, 130, 246, 0.35);
          transform: translateY(-3px);
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.2);
        }
        .project-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #263448 transparent;
        }
        .project-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .project-scrollbar::-webkit-scrollbar-thumb {
          background: #263448;
          border-radius: 99px;
        }
        @keyframes projectFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .project-enter {
          animation: projectFadeIn 280ms ease both;
        }
      `}</style>

      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-9 lg:py-9">
        {/* Header */}
        <header className="mb-9 flex flex-col justify-between gap-5 border-b border-white/[0.08] pb-7 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="relative flex h-[58px] w-[154px] shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.08] bg-[#0b111c] px-2">
              <Image
                src="/vexora-logo.png"
                alt="VEXORA Technology"
                width={190}
                height={70}
                priority
                className="h-auto max-h-[48px] w-full object-contain"
              />
            </div>

            <div className="border-l border-white/10 pl-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-blue-400">
                Workspace
              </p>
              <h1 className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl">
                Project management
              </h1>
              <p className="mt-1 text-xs text-slate-500">
                Manage projects, clients, deadlines and media.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void loadData(false)}
              disabled={refreshing || loading}
              className="project-button inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm font-medium text-slate-300 hover:border-blue-400/40 hover:bg-blue-500/[0.06] hover:text-white"
            >
              <Icon
                name="refresh"
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
              <span>{refreshing ? "Refreshing..." : "Refresh"}</span>
            </button>

            <button
              type="button"
              onClick={openCreateModal}
              className="project-button inline-flex items-center justify-center gap-2 rounded-xl border border-blue-400/30 bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 hover:from-blue-500 hover:to-sky-500"
            >
              <Icon name="plus" size={18} />
              New project
            </button>
          </div>
        </header>

        {notice && (
          <NoticeBanner
            notice={notice}
            onClose={() => setNotice(null)}
          />
        )}

        {/* Overview */}
        <section className="mb-9">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Overview
              </p>
              <h2 className="mt-2 text-lg font-semibold text-slate-100">
                Project performance
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Live data from your workspace
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Total projects",
                value: stats.total.toLocaleString("en-US"),
                detail: "All registered projects",
                icon: "briefcase",
                color: "#60a5fa",
              },
              {
                label: "In progress",
                value: stats.active.toLocaleString("en-US"),
                detail: "Currently being worked on",
                icon: "clock",
                color: "#a78bfa",
              },
              {
                label: "Completed",
                value: stats.completed.toLocaleString("en-US"),
                detail: "Successfully delivered",
                icon: "check",
                color: "#4ade80",
              },
              {
                label: "Total budget",
                value: formatMoney(stats.totalBudget),
                detail: "Combined project budgets",
                icon: "dollar",
                color: "#38bdf8",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="project-panel project-enter relative overflow-hidden rounded-2xl p-5"
              >
                <div
                  className="pointer-events-none absolute -right-7 -top-10 h-28 w-28 rounded-full blur-3xl"
                  style={{ background: `${item.color}15` }}
                />
                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-slate-400">
                      {item.label}
                    </p>
                    <p className="mt-3 break-words text-3xl font-semibold tracking-tight text-white">
                      {item.value}
                    </p>
                    <p className="mt-2 text-xs text-slate-500">
                      {item.detail}
                    </p>
                  </div>
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border"
                    style={{
                      color: item.color,
                      background: `${item.color}12`,
                      borderColor: `${item.color}28`,
                    }}
                  >
                    <Icon name={item.icon} size={21} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Filters */}
        <section className="mb-6">
          <div className="project-panel rounded-2xl p-4 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-base font-semibold">
                  All projects
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {filteredProjects.length} of {projects.length} projects
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative block min-w-0 sm:w-[280px]">
                  <span className="sr-only">Search projects</span>
                  <Icon
                    name="search"
                    size={18}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search projects or clients..."
                    className="w-full rounded-xl border border-white/10 bg-[#080d16] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/60"
                  />
                </label>

                <label className="block sm:w-[190px]">
                  <span className="sr-only">Filter by status</span>
                  <select
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                    className="project-field w-full rounded-xl border border-white/10 bg-[#080d16] px-4 py-3 text-sm text-slate-200 outline-none focus:border-blue-400/60"
                  >
                    <option value="all">All statuses</option>
                    {STATUS_OPTIONS.map((option) => (
                      <option
                        key={option.value}
                        value={option.value}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          </div>
        </section>

        {/* Project cards */}
        {loading ? (
          <section
            className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3"
            aria-label="Loading projects"
          >
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="project-panel overflow-hidden rounded-2xl"
              >
                <div className="h-48 animate-pulse bg-white/[0.04]" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-white/[0.06]" />
                  <div className="h-3 w-full animate-pulse rounded bg-white/[0.04]" />
                  <div className="h-3 w-1/2 animate-pulse rounded bg-white/[0.04]" />
                </div>
              </div>
            ))}
          </section>
        ) : filteredProjects.length === 0 ? (
          <section className="project-panel flex min-h-[340px] flex-col items-center justify-center rounded-2xl px-6 py-12 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/[0.08] text-blue-300">
              <Icon name="grid" size={30} />
            </div>
            <h3 className="text-lg font-semibold text-white">
              {projects.length === 0
                ? "Your workspace is ready"
                : "No matching projects"}
            </h3>
            <p className="mt-2 max-w-md text-sm leading-6 text-slate-400">
              {projects.length === 0
                ? "Create your first project, assign a client, set a deadline and upload images or videos."
                : "Try a different search term or change the status filter."}
            </p>

            {projects.length === 0 ? (
              <button
                type="button"
                onClick={openCreateModal}
                className="project-button mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-500"
              >
                <Icon name="plus" size={17} />
                Create first project
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("all");
                }}
                className="project-button mt-6 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-slate-300 hover:bg-white/[0.05]"
              >
                Clear filters
              </button>
            )}
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map((project, index) => {
              const client = clients.find(
                (item) => item.id === project.client_id
              );

              const media = mediaByProject[project.id] ?? [];

              const cover =
                media.find((item) => isImage(item) && item.url) ??
                media.find((item) => isVideo(item) && item.url) ??
                media[0];

              return (
                <article
                  key={project.id}
                  className="project-panel project-card project-enter group min-w-0 overflow-hidden rounded-2xl"
                  style={{ animationDelay: `${Math.min(index, 8) * 35}ms` }}
                >
                  <div className="relative h-48 overflow-hidden border-b border-white/[0.06] bg-[#080d16]">
                    <MediaPreview media={cover} compact />

                    <div className="absolute left-4 top-4">
                      <StatusBadge status={project.status} />
                    </div>

                    <div className="absolute right-4 top-4 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#070a10]/85 px-2.5 py-1.5 text-xs text-slate-200 backdrop-blur">
                        <Icon
                          name="image"
                          size={14}
                          className="text-blue-300"
                        />
                        {media.length}
                      </span>
                    </div>

                    {cover?.url && isVideo(cover) && (
                      <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 rounded-lg border border-white/10 bg-black/70 px-3 py-2 text-xs text-white">
                        <Icon name="video" size={15} />
                        Video preview
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-400">
                          Project
                        </p>
                        <h3 className="break-words text-lg font-semibold leading-7 text-white">
                          {project.title}
                        </h3>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={() => openEditModal(project)}
                          aria-label={`Edit ${project.title}`}
                          title="Edit project"
                          className="project-button flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 hover:border-blue-400/40 hover:bg-blue-500/10 hover:text-blue-300"
                        >
                          <Icon name="edit" size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => void handleDeleteProject(project)}
                          disabled={deletingId === project.id}
                          aria-label={`Delete ${project.title}`}
                          title="Delete project"
                          className="project-button flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-400 hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-300"
                        >
                          {deletingId === project.id ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-slate-500 border-t-transparent" />
                          ) : (
                            <Icon name="trash" size={16} />
                          )}
                        </button>
                      </div>
                    </div>

                    <p className="mt-3 min-h-[42px] text-sm leading-6 text-slate-400">
                      {project.description?.trim() ||
                        "No project description has been added yet."}
                    </p>

                    <div className="mt-5 space-y-3 border-t border-white/[0.07] pt-4">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-slate-400">
                          <Icon name="users" size={17} />
                        </span>
                        <div className="min-w-0">
                          <p className="text-[10px] uppercase tracking-wider text-slate-500">
                            Client
                          </p>
                          <p className="mt-1 truncate text-sm text-slate-200">
                            {client?.name ||
                              project.client_name ||
                              "Unassigned"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] text-slate-400">
                            <Icon name="calendar" size={17} />
                          </span>
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-wider text-slate-500">
                              Deadline
                            </p>
                            <p className="mt-1 text-sm text-slate-200">
                              {formatDate(project.deadline)}
                            </p>
                          </div>
                        </div>

                        <div className="min-w-0 text-right">
                          <p className="text-[10px] uppercase tracking-wider text-slate-500">
                            Budget
                          </p>
                          <p className="mt-1 truncate text-sm font-semibold text-blue-300">
                            {formatMoney(project.budget)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {media.length > 0 && (
                      <div className="mt-5 flex items-center gap-2 overflow-hidden border-t border-white/[0.07] pt-4">
                        <Icon
                          name="file"
                          size={15}
                          className="shrink-0 text-slate-500"
                        />
                        <span className="truncate text-xs text-slate-400">
                          {media.length} media file
                          {media.length === 1 ? "" : "s"}
                        </span>
                        <button
                          type="button"
                          onClick={() => openEditModal(project)}
                          className="project-button ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-500/10"
                        >
                          Manage
                          <Icon name="arrow" size={14} />
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}

        <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/[0.07] py-6 text-center sm:flex-row sm:text-left">
          <p className="text-xs text-slate-500">
            VEXORA <span className="text-slate-700">/</span> Project workspace
          </p>
          <p className="text-xs text-slate-600">
            Secure media storage · Responsive workspace
          </p>
        </footer>
      </div>

      {/* Create / Edit modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/75 p-3 backdrop-blur-sm sm:items-center sm:p-6"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !saving &&
              !uploading
            ) {
              setModalOpen(false);
            }
          }}
        >
          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            className="project-panel project-scrollbar my-auto w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl shadow-black/50 sm:rounded-3xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-white/[0.08] bg-white/[0.015] px-5 py-5 sm:px-7">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
                  <Icon
                    name={editingProject ? "edit" : "plus"}
                    size={21}
                  />
                </div>
                <div className="min-w-0">
                  <h2
                    id="project-modal-title"
                    className="text-lg font-semibold text-white sm:text-xl"
                  >
                    {editingProject ? "Edit project" : "Create a project"}
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Project details, assignment, timeline and media.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={saving || uploading}
                aria-label="Close project form"
                className="project-button flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/10 text-slate-400 hover:bg-white/5 hover:text-white"
              >
                <Icon name="close" size={18} />
              </button>
            </div>

            <form onSubmit={handleSave}>
              <div className="project-scrollbar max-h-[calc(100dvh-190px)] overflow-y-auto px-5 py-6 sm:px-7">
                {/* Project information */}
                <div className="mb-7">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-300">
                      <Icon name="briefcase" size={17} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Project information
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Essential details and scope.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <label className={fieldLabel}>
                      Project title <span className="text-blue-400">*</span>
                      <input
                        type="text"
                        required
                        minLength={2}
                        maxLength={160}
                        value={form.title}
                        onChange={(event) =>
                          updateForm("title", event.target.value)
                        }
                        placeholder="e.g. Corporate website redesign"
                        className={inputClass}
                      />
                    </label>

                    <label className={fieldLabel}>
                      Assign client
                      <select
                        value={form.client_id}
                        onChange={(event) =>
                          updateForm("client_id", event.target.value)
                        }
                        className={`${inputClass} project-field`}
                      >
                        <option value="">No client assigned</option>
                        {clients.map((client) => (
                          <option key={client.id} value={client.id}>
                            {client.name}
                            {client.company ? ` — ${client.company}` : ""}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className={`${fieldLabel} sm:col-span-2`}>
                      Description
                      <textarea
                        rows={4}
                        maxLength={10000}
                        value={form.description}
                        onChange={(event) =>
                          updateForm("description", event.target.value)
                        }
                        placeholder="Describe the goals, scope and deliverables..."
                        className={`${inputClass} resize-y leading-6`}
                      />
                      <span className="mt-2 block text-right text-[11px] font-normal normal-case tracking-normal text-slate-600">
                        {form.description.length.toLocaleString("en-US")} /
                        10,000 characters
                      </span>
                    </label>
                  </div>
                </div>

                <div className="mb-7 border-t border-white/[0.07] pt-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/10 text-violet-300">
                      <Icon name="calendar" size={17} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Timeline and budget
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        Set the current status, target date and budget.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <label className={fieldLabel}>
                      Project status
                      <select
                        value={form.status}
                        onChange={(event) =>
                          updateForm(
                            "status",
                            event.target.value as ProjectStatus
                          )
                        }
                        className={`${inputClass} project-field`}
                      >
                        {STATUS_OPTIONS.map((option) => (
                          <option
                            key={option.value}
                            value={option.value}
                          >
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className={fieldLabel}>
                      Budget (USD)
                      <div className="relative">
                        <Icon
                          name="dollar"
                          size={17}
                          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                        />
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={form.budget}
                          onChange={(event) =>
                            updateForm("budget", event.target.value)
                          }
                          placeholder="0.00"
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                    </label>

                    <label className={fieldLabel}>
                      Deadline
                      <input
                        type="date"
                        value={form.deadline}
                        onChange={(event) =>
                          updateForm("deadline", event.target.value)
                        }
                        className={`${inputClass} [color-scheme:dark]`}
                      />
                    </label>
                  </div>
                </div>

                <div className="mb-7 border-t border-white/[0.07] pt-6">
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-white">Website placement</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">Choose where this project may be displayed publicly. Private by default; client information and project media remain protected.</p>
                  </div>
                  <div className="mb-4">
                    <label className={fieldLabel}>
                      Portfolio department
                      <select value={form.portfolio_category} onChange={(event) => updateForm("portfolio_category", event.target.value as ProjectForm["portfolio_category"])} className={`${inputClass} project-field`}>
                        <option value="Cybersecurity">Cybersecurity</option>
                        <option value="Software Development">Software Development</option>
                        <option value="Networks & Infrastructure">Networks & Infrastructure</option>
                        <option value="Data Analytics">Data Analytics</option>
                        <option value="Digital Marketing">Digital Marketing</option>
                      </select>
                      <span className="mt-2 block text-xs font-normal normal-case tracking-normal text-slate-500">Select which of the five public portfolio sections should contain this work.</span>
                    </label>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-slate-200">
                      <input type="checkbox" checked={form.show_on_homepage} onChange={(event) => updateForm("show_on_homepage", event.target.checked)} className="mt-1 h-4 w-4 accent-blue-500" />
                      <span><span className="block font-medium">Homepage featured projects</span><span className="mt-1 block text-xs leading-5 text-slate-500">Allow this project to appear in a public homepage showcase.</span></span>
                    </label>
                    <label className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-slate-200">
                      <input type="checkbox" checked={form.show_on_projects_page} onChange={(event) => updateForm("show_on_projects_page", event.target.checked)} className="mt-1 h-4 w-4 accent-blue-500" />
                      <span><span className="block font-medium">Public projects page</span><span className="mt-1 block text-xs leading-5 text-slate-500">Mark this project for the public projects directory.</span></span>
                    </label>
                  </div>
                </div>

                {/* Existing media */}
                {editingProject && (
                  <div className="mb-7 border-t border-white/[0.07] pt-6">
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-500/10 text-sky-300">
                          <Icon name="image" size={17} />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white">
                            Project media
                          </h3>
                          <p className="mt-1 text-xs text-slate-500">
                            Existing images and videos.
                          </p>
                        </div>
                      </div>
                      <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-slate-400">
                        {(mediaByProject[editingProject.id] ?? []).length} /{" "}
                        {MAX_FILES} files
                      </span>
                    </div>

                    {(mediaByProject[editingProject.id] ?? []).length === 0 ? (
                      <div className="rounded-xl border border-dashed border-white/10 bg-white/[0.015] px-5 py-8 text-center">
                        <Icon
                          name="image"
                          size={25}
                          className="mx-auto text-slate-600"
                        />
                        <p className="mt-3 text-sm text-slate-300">
                          No media uploaded yet
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          Add images or videos in the upload section below.
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {(mediaByProject[editingProject.id] ?? []).map(
                          (media) => (
                            <div
                              key={media.id}
                              className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#080d16]"
                            >
                              <div className="h-40 overflow-hidden bg-black">
                                <MediaPreview media={media} compact />
                              </div>
                              <div className="p-3">
                                <p className="truncate text-xs font-medium text-slate-200">
                                  {media.name}
                                </p>
                                <div className="mt-2 flex items-center justify-between gap-3">
                                  <span className="text-[11px] text-slate-500">
                                    {formatBytes(media.size_bytes)}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    {!media.url && (
                                      <button
                                        type="button"
                                        onClick={() =>
                                          void refreshMediaLink(media)
                                        }
                                        className="project-button rounded-lg border border-white/10 px-2 py-1.5 text-[11px] text-slate-300 hover:border-blue-400/30 hover:text-blue-300"
                                      >
                                        Retry preview
                                      </button>
                                    )}
                                    <button
                                      type="button"
                                      onClick={() =>
                                        void handleDeleteMedia(media)
                                      }
                                      disabled={deletingId === media.id}
                                      aria-label={`Delete ${media.name}`}
                                      className="project-button inline-flex items-center gap-1 rounded-lg border border-red-400/15 px-2 py-1.5 text-[11px] text-red-300 hover:bg-red-500/10"
                                    >
                                      <Icon name="trash" size={13} />
                                      Delete
                                    </button>
                                  </div>
                                </div>
                                {media.urlError && (
                                  <p className="mt-2 break-words text-[11px] leading-5 text-amber-300/80">
                                    {media.urlError}
                                  </p>
                                )}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Upload */}
                <div className="border-t border-white/[0.07] pt-6">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-300">
                      <Icon name="upload" size={17} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Upload images and videos
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {editingProject
                          ? "New files will upload when you save changes."
                          : "Create the project first, then its files will upload automatically."}
                      </p>
                    </div>
                  </div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={[...IMAGE_TYPES, ...VIDEO_TYPES].join(",")}
                    multiple
                    onChange={handleFileSelection}
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="project-button flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-blue-400/30 bg-blue-500/[0.035] px-5 py-8 text-center hover:border-blue-400/60 hover:bg-blue-500/[0.07] sm:py-10"
                  >
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-300">
                      <Icon name="upload" size={25} />
                    </span>
                    <span className="mt-4 text-sm font-semibold text-slate-100">
                      Click to choose files
                    </span>
                    <span className="mt-2 text-xs leading-5 text-slate-500">
                      JPG, PNG, WEBP, GIF, AVIF, MP4, WEBM or MOV
                    </span>
                    <span className="mt-1 text-xs text-slate-600">
                      Images up to 15 MB · Videos up to 50 MB · Maximum 10 files
                    </span>
                  </button>

                  {selectedFiles.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-xs font-semibold text-slate-300">
                          Selected files ({selectedFiles.length})
                        </p>
                        <button
                          type="button"
                          onClick={() => setSelectedFiles([])}
                          className="text-xs text-slate-500 transition hover:text-red-300"
                        >
                          Remove all
                        </button>
                      </div>

                      {selectedFiles.map((file, index) => (
                        <div
                          key={`${file.name}-${file.size}-${index}`}
                          className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3"
                        >
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.035] text-blue-300">
                            <Icon
                              name={
                                file.type.startsWith("video/")
                                  ? "video"
                                  : "image"
                              }
                              size={18}
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-xs font-medium text-slate-200">
                              {file.name}
                            </p>
                            <p className="mt-1 text-[11px] text-slate-500">
                              {formatBytes(file.size)}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeSelectedFile(index)}
                            disabled={saving || uploading}
                            aria-label={`Remove ${file.name}`}
                            className="project-button flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-red-500/10 hover:text-red-300"
                          >
                            <Icon name="close" size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {uploadProgress && (
                    <div className="mt-4 flex items-center gap-3 rounded-xl border border-blue-400/20 bg-blue-500/[0.06] p-3 text-xs text-blue-200">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-300/30 border-t-blue-300" />
                      <span className="break-words">{uploadProgress}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col-reverse justify-between gap-3 border-t border-white/[0.08] bg-white/[0.015] px-5 py-4 sm:flex-row sm:items-center sm:px-7">
                <p className="text-[11px] leading-5 text-slate-500">
                  Changes are saved to your VEXORA workspace.
                </p>
                <div className="flex flex-col-reverse gap-2 sm:flex-row">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    disabled={saving || uploading}
                    className="project-button rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 hover:bg-white/[0.05] hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="project-button inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/20 hover:from-blue-500 hover:to-sky-500"
                  >
                    {saving || uploading ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Icon name="check" size={17} />
                        {editingProject ? "Save changes" : "Create project"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
