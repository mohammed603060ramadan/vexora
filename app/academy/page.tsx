
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/browser";
import type { FormEvent } from "react";

type TrainingMode = "online" | "inperson" | "hybrid";
type FilterMode = "all" | TrainingMode;

type Course = {
  id: string;
  slug: string;
  title: string;
  category: string;
  level: string;
  duration: string;
  modes: TrainingMode[];
  image: string;
  description: string;
  topics: string[];
  isOffline?: boolean;
  price?: number | null;
  currency?: string | null;
  promoVideoUrl?: string | null;
};

const modes: { id: FilterMode; label: string }[] = [
  { id: "all", label: "All formats" },
  { id: "online", label: "Online" },
  { id: "inperson", label: "In person" },
  { id: "hybrid", label: "Hybrid" },
];

const categories = [
  "All",
  "Cybersecurity",
  "Software Development",
  "Networks & Infrastructure",
  "Data Analytics",
  "Digital Marketing",
];

const modeLabels: Record<TrainingMode, string> = {
  online: "Live online",
  inperson: "In person",
  hybrid: "Hybrid",
};

const initialCourses: Course[] = [
  {
    id: "offline-cybersecurity-foundations",
    slug: "offline-cybersecurity-foundations",
    title: "Cybersecurity Foundations",
    category: "Cybersecurity",
    level: "Beginner",
    duration: "24 hours",
    modes: ["inperson"],
    isOffline: true,
    image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=85",
    description: "An instructor-led, classroom-based introduction to cyber hygiene, security principles, threat awareness, and defensive practices for real environments.",
    topics: ["Security principles and threat landscape", "Identity, access, and endpoint protection", "Safe network and web practices", "Incident awareness and response basics"],
  },
  {
    id: "offline-soc-blue-team",
    slug: "offline-soc-blue-team",
    title: "SOC Analyst & Blue Team Operations",
    category: "Cybersecurity",
    level: "Intermediate",
    duration: "36 hours",
    modes: ["inperson"],
    isOffline: true,
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=1000&q=85",
    description: "Practice defensive security workflows in a guided classroom setting, from alert triage to incident documentation and response.",
    topics: ["Security monitoring and log analysis", "Alert triage and escalation", "Incident response workflow", "Threat reports and defensive playbooks"],
  },
  {
    id: "offline-web-development",
    slug: "offline-web-development",
    title: "Modern Web Development",
    category: "Software Development",
    level: "Beginner",
    duration: "32 hours",
    modes: ["inperson"],
    isOffline: true,
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1000&q=85",
    description: "Build responsive web experiences through guided coding sessions, practical assignments, and a final portfolio-ready project.",
    topics: ["HTML, CSS, and accessible interfaces", "JavaScript fundamentals", "Responsive layouts and UI patterns", "Building and presenting a mini project"],
  },
  {
    id: "offline-full-stack-development",
    slug: "offline-full-stack-development",
    title: "Full-Stack Application Development",
    category: "Software Development",
    level: "Intermediate",
    duration: "48 hours",
    modes: ["inperson"],
    isOffline: true,
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=85",
    description: "Learn how front-end interfaces, server logic, APIs, and databases work together in a complete application.",
    topics: ["Component-based front ends", "API design and validation", "Database fundamentals", "Deployment and application testing"],
  },
  {
    id: "offline-networking-fundamentals",
    slug: "offline-networking-fundamentals",
    title: "Networking Fundamentals",
    category: "Networks & Infrastructure",
    level: "Beginner",
    duration: "24 hours",
    modes: ["inperson"],
    isOffline: true,
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=85",
    description: "Understand how devices connect and communicate, with practical classroom exercises in addressing, switching, and troubleshooting.",
    topics: ["OSI and TCP/IP models", "IPv4 addressing and subnetting", "Switching, routing, and Wi-Fi", "Structured troubleshooting"],
  },
  {
    id: "offline-network-infrastructure",
    slug: "offline-network-infrastructure",
    title: "Network Infrastructure & Administration",
    category: "Networks & Infrastructure",
    level: "Intermediate",
    duration: "36 hours",
    modes: ["inperson"],
    isOffline: true,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1000&q=85",
    description: "A practical track covering reliable small-business infrastructure, network services, monitoring, and maintenance.",
    topics: ["Network design and documentation", "VLANs and core services", "Monitoring and fault isolation", "Backup and maintenance practices"],
  },
  {
    id: "offline-data-analytics",
    slug: "offline-data-analytics",
    title: "Data Analytics Essentials",
    category: "Data Analytics",
    level: "Beginner",
    duration: "28 hours",
    modes: ["inperson"],
    isOffline: true,
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=85",
    description: "Turn raw data into clear answers using structured analysis, clean datasets, and visual storytelling.",
    topics: ["Data quality and preparation", "Spreadsheet analysis techniques", "KPIs and business questions", "Clear charts and insight summaries"],
  },
  {
    id: "offline-business-intelligence",
    slug: "offline-business-intelligence",
    title: "Business Intelligence & Dashboards",
    category: "Data Analytics",
    level: "Intermediate",
    duration: "36 hours",
    modes: ["inperson"],
    isOffline: true,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=85",
    description: "Design decision-ready dashboards and communicate performance trends through hands-on reporting exercises.",
    topics: ["Data modeling concepts", "Dashboard layout and visual hierarchy", "Metrics and trend analysis", "Presenting findings to stakeholders"],
  },
  {
    id: "offline-digital-marketing",
    slug: "offline-digital-marketing",
    title: "Digital Marketing Foundations",
    category: "Digital Marketing",
    level: "Beginner",
    duration: "24 hours",
    modes: ["inperson"],
    isOffline: true,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=85",
    description: "Plan a practical digital presence and connect audience research, content, channels, and measurable goals.",
    topics: ["Audience and competitor research", "Content planning and messaging", "Channel selection and campaign basics", "Goals, KPIs, and reporting"],
  },
  {
    id: "offline-performance-marketing",
    slug: "offline-performance-marketing",
    title: "Performance Marketing & Campaign Analytics",
    category: "Digital Marketing",
    level: "Intermediate",
    duration: "32 hours",
    modes: ["inperson"],
    isOffline: true,
    image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?auto=format&fit=crop&w=1000&q=85",
    description: "Learn to structure campaigns, interpret results, and improve performance using a test-and-learn approach.",
    topics: ["Campaign structure and objectives", "Creative testing and optimization", "Conversion funnels and attribution basics", "Reporting and improvement plans"],
  },
];

const backgroundCode = [
  "const secure = true;",
  "await verifyIdentity();",
  "if (accessGranted) {",
  "  return <Dashboard />;",
  "encrypt(payload);",
  "SELECT status FROM courses;",
  "const threat = scan();",
  "export default function VEXORA() {",
  "const data = await analyze();",
  "network.monitor({ active: true });",
];

const formats = [
  { title: "Live online", description: "Learn with guided sessions and instructor support.", icon: "globe" },
  { title: "In person", description: "Build skills through direct, hands-on practice.", icon: "users" },
  { title: "Hybrid learning", description: "Combine flexible online study with practical sessions.", icon: "sparkles" },
  { title: "Practical projects", description: "Apply concepts to realistic technology challenges.", icon: "terminal" },
];

const learningSteps = [
  { number: "01", title: "Understand the fundamentals", description: "Start with clear explanations and a structured learning path." },
  { number: "02", title: "Practise with guidance", description: "Strengthen your understanding through exercises and practical tasks." },
  { number: "03", title: "Build real projects", description: "Apply new skills to projects that demonstrate your progress." },
];
function Icon({
  name,
  size = 20,
  className = "",
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.65,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "search":
      return (
        <svg {...common}>
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
      );
    case "arrow":
      return (
        <svg {...common}>
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path d="m18 6-12 12M6 6l12 12" />
        </svg>
      );
    case "globe":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="10" cy="7" r="4" />
          <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "play":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m10 8 6 4-6 4V8Z" />
        </svg>
      );
    case "terminal":
      return (
        <svg {...common}>
          <rect x="3" y="4" width="18" height="16" rx="2" />
          <path d="m7 9 3 3-3 3M13 15h4" />
        </svg>
      );
    case "clock":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 6v6l4 2" />
        </svg>
      );
    case "award":
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="6" />
          <path d="m8.2 13-1 8 4.8-3 4.8 3-1-8" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <path d="m5 12 4 4L19 6" />
        </svg>
      );
    case "print":
      return (
        <svg {...common}>
          <path d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
          <path d="M6 14h12v7H6z" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common}>
          <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      );
    case "academy":
      return (
        <svg {...common}>
          <path d="m3 9 9-5 9 5-9 5-9-5Z" />
          <path d="M6.5 11v5c3.2 2.4 7.8 2.4 11 0v-5M21 9v6" />
        </svg>
      );
    case "sparkles":
      return (
        <svg {...common}>
          <path d="m12 3 2.1 6.1L20 11l-5.9 2.1L12 19l-2.1-5.9L4 11l5.9-1.9L12 3Z" />
          <path d="m19 15 1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2Z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
        </svg>
      );
  }
}

export default function AcademyPage() {
  const router = useRouter();
  const [userReady, setUserReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [typedNotice, setTypedNotice] = useState("");
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [category, setCategory] = useState("All");
  const [mode, setMode] = useState<FilterMode>("all");
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [registrationLoading, setRegistrationLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState("");
  const [certificateOpen, setCertificateOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [learnerName, setLearnerName] = useState("");
  const [learnerEmail, setLearnerEmail] = useState("");
  const [preferredFormat, setPreferredFormat] = useState("");
  const [accessRequestLoading, setAccessRequestLoading] = useState(false);
  const [accessRequestError, setAccessRequestError] = useState("");
  const [accessRequestResult, setAccessRequestResult] = useState<{ code: string; status: string; message: string } | null>(null);

  useEffect(() => {
    let active = true;
    void supabase.auth.getSession().then(({ data, error }) => {
      if (active) setIsAuthenticated(!error && Boolean(data.session?.user));
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active) setIsAuthenticated(Boolean(session?.user));
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const message = "Offline classroom programs are always available here. Courses published by the VEXORA team appear alongside them; administrator-managed course uploads remain unchanged.";
    let position = 0;
    let deleting = false;
    let pause = 0;
    const timer = window.setInterval(() => {
      if (!deleting && position === message.length) {
        if (pause < 22) {
          pause += 1;
          return;
        }
        deleting = true;
      } else if (deleting && position === 0) {
        deleting = false;
        pause = 0;
      }

      position += deleting ? -1 : 1;
      setTypedNotice(message.slice(0, position));
    }, 65);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    let active = true;
    async function loadPublishedCourses() {
      let { data, error: queryError } = await supabase
        .from("courses")
        .select("id,title,slug,description,category,difficulty,course_type,estimated_hours,status,created_at,price,currency,cover_image_url,promo_video_url")
        .eq("status", "published")
        .order("created_at", { ascending: false });
      if (queryError && /cover_image_url|promo_video_url|column .* does not exist|schema cache/i.test(queryError.message)) {
        const fallback = await supabase
          .from("courses")
          .select("id,title,slug,description,category,difficulty,course_type,estimated_hours,status,created_at,price,currency")
          .eq("status", "published")
          .order("created_at", { ascending: false });
        data = (fallback.data ?? []).map((row) => ({ ...row, cover_image_url: null, promo_video_url: null }));
        queryError = fallback.error;

        if (queryError && /category|column .* does not exist|schema cache/i.test(queryError.message)) {
          const legacy = await supabase
            .from("courses")
            .select("id,title,slug,description,difficulty,course_type,estimated_hours,status,created_at,price,currency")
            .eq("status", "published")
            .order("created_at", { ascending: false });
          data = (legacy.data ?? []).map((row) => ({
            ...row,
            category: "Cybersecurity",
            cover_image_url: null,
            promo_video_url: null,
          })) as typeof data;
          queryError = legacy.error;
        }
      }
      if (!active) return;
      if (queryError) {
        console.error("Academy catalogue load failed:", queryError.message);
        setCourses(initialCourses);
        setUserReady(true);
        return;
      }
      const imageByCategory: Record<string, string> = {
        Cybersecurity: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=85",
        "Software Development": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1000&q=85",
        "Networks & Infrastructure": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=85",
        "Data Analytics": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=85",
        "Digital Marketing": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=85",
      };
      const mappedCourses = (data ?? []).map((row) => ({
        id: row.id,
        slug: row.slug,
        title: row.title,
        price: 0,
        currency: row.currency || "USD",
        promoVideoUrl: row.promo_video_url || null,
        category: row.category || "Cybersecurity",
        level: row.difficulty ? row.difficulty.charAt(0).toUpperCase() + row.difficulty.slice(1) : "All levels",
        duration: row.estimated_hours ? `${row.estimated_hours} hours` : "Flexible schedule",
        modes: row.course_type === "in_person" ? ["inperson"] : row.course_type === "hybrid" ? ["hybrid", "online", "inperson"] : ["online"],
        image: row.cover_image_url || imageByCategory[row.category] || imageByCategory.Cybersecurity,
        description: row.description || "Course details will be announced soon.",
        topics: [],
      })) as Course[];
      // Keep the ten fixed, classroom-based tracks separate from the
      // administrator-managed catalogue so neither replaces the other.
      setCourses([...initialCourses, ...mappedCourses]);
      setUserReady(true);
    }
    void loadPublishedCourses();
    return () => { active = false; };
  }, []);

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesCategory =
        category === "All" || course.category === category;
      const matchesMode = mode === "all" || course.modes.includes(mode);

      const searchableText = [
        course.title,
        course.category,
        course.level,
        course.duration,
        course.description,
        ...course.topics,
        ...course.modes.map((item) => modeLabels[item]),
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesCategory &&
        matchesMode &&
        (!query || searchableText.includes(query))
      );
    });
  }, [courses, category, mode, search]);

  const hasActiveFilters =
    category !== "All" || mode !== "all" || search.trim() !== "";

  const activeOverlay = Boolean(selectedCourse) || certificateOpen;

  useEffect(() => {
    if (!activeOverlay) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedCourse(null);
        setRegistrationOpen(false);
        setSubmitted(false);
        setCertificateOpen(false);
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeOverlay]);

  function closeAllOverlays() {
    setSelectedCourse(null);
    setRegistrationOpen(false);
    setSubmitted(false);
    setCertificateOpen(false);
  }

  function openCourse(course: Course) {
    setSelectedCourse(course);
    setRegistrationOpen(false);
    setSubmitted(false);
    setRegistrationError("");
    setAccessRequestError("");
    setAccessRequestResult(null);
    setLearnerName("");
    setLearnerEmail("");
    setPreferredFormat(course.modes[0] ?? "");
  }

  async function requestCourseAccess() {
    if (!selectedCourse || selectedCourse.isOffline || !selectedCourse.id.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
      setAccessRequestError("This course does not support online access requests.");
      return;
    }
    setAccessRequestLoading(true);
    setAccessRequestError("");
    try {
      const response = await fetch("/api/course-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: selectedCourse.id }),
      });
      const payload = await response.json() as {
        free?: boolean;
        enrolled?: boolean;
        request?: { purchase_code?: string | null; status?: string };
        message?: string;
        error?: string;
      };
      if (response.status === 401) {
        const nextPath = selectedCourse?.slug
          ? `/academy/${encodeURIComponent(selectedCourse.slug)}`
          : window.location.pathname;
        router.push("/login?next=" + encodeURIComponent(nextPath));
        return;
      }
      if (!response.ok || !payload.request) throw new Error(payload.error || "Unable to create the access request.");
      if (payload.free && payload.enrolled) {
        setAccessRequestResult(null);
        setAccessRequestError("");
        const enrolledSlug = selectedCourse?.slug;
        setSelectedCourse(null);
        if (enrolledSlug) {
          router.push(`/academy/${encodeURIComponent(enrolledSlug)}`);
        } else {
          router.push("/student");
        }
        return;
      }
      setAccessRequestResult({
        code: payload.request.purchase_code || "CODE PENDING",
        status: payload.request.status || "pending",
        message: payload.message || "Your request was recorded. Access is enabled after administrator approval.",
      });
    } catch (error) {
      setAccessRequestError(error instanceof Error ? error.message : "Unable to create the access request.");
    } finally {
      setAccessRequestLoading(false);
    }
  }

  function openRegistration() {
    if (!selectedCourse) return;
    setRegistrationOpen(true);
    setSubmitted(false);
    setRegistrationError("");
    setPreferredFormat(selectedCourse.modes[0] ?? "");
  }

  function clearFilters() {
    setCategory("All");
    setMode("all");
    setSearch("");
  }

  function scrollToSection(id: string) {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  async function handleRegistration(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setRegistrationError("");

    if (!selectedCourse || learnerName.trim().length < 2 || !learnerEmail.trim() || !preferredFormat) {
      setRegistrationError("Complete all required fields before submitting.");
      return;
    }

    setRegistrationLoading(true);
    try {
      const response = await fetch("/api/student-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: learnerName.trim(),
          email: learnerEmail.trim(),
          track: `${selectedCourse.category}: ${selectedCourse.title}`.slice(0, 100),
          education_level: selectedCourse.level,
          experience: `Preferred format: ${modeLabels[preferredFormat as TrainingMode] ?? preferredFormat}`,
          motivation: selectedCourse.description,
          website: "",
        }),
      });
      const result = (await response.json()) as { error?: string; message?: string };
      if (!response.ok) {
        setRegistrationError(result.error || "Registration could not be submitted. Please try again.");
        return;
      }
      setSubmitted(true);
    } catch {
      setRegistrationError("A network error occurred. Please try again.");
    } finally {
      setRegistrationLoading(false);
    }
  }

  if (!userReady) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#05080e] px-5 text-white">
        <div className="text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-2 border-blue-400/20 border-t-blue-400" />
          <p className="mt-4 text-sm text-slate-400">Verifying your VEXORA account...</p>
        </div>
      </main>
    );
  }

  return (
    <main
      id="top"
      className="academy-page relative min-h-screen overflow-x-clip bg-[#070a10] text-white selection:bg-blue-500/30"
    >
      <style jsx global>{`
        html {
          scroll-behavior: smooth;
          scroll-padding-top: 100px;
        }

        body {
          background: #070a10;
        }

        .academy-page {
          isolation: isolate;
        }

        /* Persistent code rain: stays behind every section while scrolling. */
        .academy-code-layer {
          position: fixed;
          inset: 0;
          z-index: 0;
          overflow: hidden;
          pointer-events: none;
          opacity: 0.2;
          -webkit-mask-image: linear-gradient(
            to bottom,
            transparent,
            black 10%,
            black 80%,
            transparent
          );
          mask-image: linear-gradient(
            to bottom,
            transparent,
            black 10%,
            black 80%,
            transparent
          );
        }

        .academy-code-column {
          position: absolute;
          top: -120%;
          width: 210px;
          white-space: nowrap;
          color: #66b4ff;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          font-size: 11px;
          line-height: 2.65;
          letter-spacing: 0.35px;
          animation: academy-code-fall linear infinite;
          will-change: transform;
        }

        .academy-code-column span {
          display: block;
        }

        @keyframes academy-code-fall {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(0, 200%, 0);
          }
        }

        .academy-grid-background {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(100, 160, 220, 0.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100, 160, 220, 0.035) 1px, transparent 1px);
          background-size: 54px 54px;
          opacity: 0.65;
        }

        .academy-orb {
          position: absolute;
          z-index: 0;
          width: 340px;
          height: 340px;
          border-radius: 9999px;
          filter: blur(110px);
          pointer-events: none;
          opacity: 0.07;
          animation: academy-orb-float 16s ease-in-out infinite alternate;
        }

        @keyframes academy-orb-float {
          from {
            transform: translate3d(0, -8px, 0);
          }
          to {
            transform: translate3d(20px, 22px, 0);
          }
        }

        @keyframes academy-fade-up {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .academy-reveal {
          animation: academy-fade-up 0.6s ease-out both;
        }

        .academy-card-image {
          transition: transform 550ms ease;
        }

        .academy-card:hover .academy-card-image {
          transform: scale(1.045);
        }

        .academy-glass {
          background: rgba(10, 16, 27, 0.94);
          backdrop-filter: blur(16px);
        }

        .academy-button {
          transition:
            transform 160ms ease,
            border-color 160ms ease,
            background-color 160ms ease,
            color 160ms ease;
        }

        .academy-button:active {
          transform: scale(0.985);
        }

        .academy-focus:focus-visible {
          outline: 2px solid #83c5ff;
          outline-offset: 4px;
        }

        .academy-certificate {
          print-color-adjust: exact;
          -webkit-print-color-adjust: exact;
        }

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          .academy-code-column,
          .academy-orb,
          .academy-reveal {
            animation: none !important;
          }

          .academy-card-image,
          .academy-button {
            transition: none !important;
          }
        }

        @media print {
          body * {
            visibility: hidden !important;
          }

          .academy-print-area,
          .academy-print-area * {
            visibility: visible !important;
          }

          .academy-print-area {
            position: fixed !important;
            inset: 0 !important;
            z-index: 999999 !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 100% !important;
            height: 100% !important;
            padding: 8mm !important;
            overflow: visible !important;
            background: white !important;
            backdrop-filter: none !important;
          }

          .academy-print-certificate {
            width: 100% !important;
            max-width: none !important;
            box-shadow: none !important;
            transform: none !important;
          }

          .academy-no-print {
            display: none !important;
          }

          @page {
            size: landscape;
            margin: 8mm;
          }
        }
      `}</style>

      {/* Continuous background layer. Content below remains interactive. */}
      <div className="academy-grid-background" aria-hidden="true" />

      <div className="academy-code-layer" aria-hidden="true">
        {Array.from({ length: 9 }, (_, column) => (
          <div
            key={column}
            className="academy-code-column"
            style={{
              left: `${column * 12 - 2}%`,
              animationDuration: `${26 + (column % 4) * 7}s`,
              animationDelay: `${column * -4.2}s`,
              opacity: 0.45 + (column % 3) * 0.15,
            }}
          >
            {[...backgroundCode, ...backgroundCode, ...backgroundCode].map(
              (line, index) => (
                <span key={`${column}-${index}`}>{line}</span>
              ),
            )}
          </div>
        ))}
      </div>

      <div
        className="academy-orb left-[-180px] top-[240px] bg-blue-500"
        aria-hidden="true"
      />
      <div
        className="academy-orb right-[-190px] top-[1100px] bg-cyan-500"
        aria-hidden="true"
      />

      {/* Navigation */}
      <header className="relative z-20 sticky top-0 border-b border-white/[0.09] bg-[#070a10]/95 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <a
            href="#top"
            onClick={() => setMobileMenuOpen(false)}
            className="academy-focus flex shrink-0 items-center gap-3 rounded-lg"
            aria-label="VEXORA Academy home"
          >
            <Image
              src="/vexora-logo.png"
              alt="VEXORA Technology logo"
              width={190}
              height={70}
              priority
              className="h-11 w-auto object-contain sm:h-[52px]"
            />
            <span className="hidden border-l border-white/15 pl-3 sm:block">
              <span className="block text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-300">
                Learning
              </span>
              <span className="mt-1 block text-sm font-semibold text-gray-200">
                Academy
              </span>
            </span>
          </a>

          <div className="hidden items-center gap-7 text-sm text-gray-400 md:flex">
            <button
              type="button"
              onClick={() => scrollToSection("programs")}
              className="academy-focus rounded hover:text-white"
            >
              Programs
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("experience")}
              className="academy-focus rounded hover:text-white"
            >
              Learning
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("certificate")}
              className="academy-focus rounded hover:text-white"
            >
              Certificates
            </button>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="academy-focus hidden rounded-lg px-3 py-2 text-sm text-gray-300 transition hover:text-white sm:inline-flex"
            >
              Home
            </Link>
            {isAuthenticated ? (
              <Link
                href="/client"
                onClick={() => setMobileMenuOpen(false)}
                className="academy-focus inline-flex items-center rounded-lg border border-blue-400/30 bg-blue-500/10 px-3 py-2 text-sm font-semibold text-blue-100 transition hover:bg-blue-500/20 sm:px-4 sm:py-2.5"
              >
                My Account
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="academy-focus inline-flex items-center rounded-lg px-3 py-2 text-sm font-semibold text-gray-200 transition hover:text-white sm:px-4 sm:py-2.5"
                >
                  Log In
                </Link>
                <Link
                  href="/login?mode=signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="academy-focus hidden items-center rounded-lg border border-blue-400/30 bg-blue-500/10 px-3 py-2 text-sm font-semibold text-blue-100 transition hover:bg-blue-500/20 sm:inline-flex sm:px-4 sm:py-2.5"
                >
                  Create Account
                </Link>
              </>
            )}
            <button
              type="button"
              onClick={() => scrollToSection("programs")}
              className="academy-button academy-focus hidden items-center gap-2 rounded-lg border border-blue-400/30 bg-blue-500/10 px-4 py-2.5 text-sm font-semibold text-blue-100 hover:border-blue-300/60 hover:bg-blue-500/15 sm:inline-flex"
            >
              Explore courses
              <Icon name="arrow" size={16} />
            </button>

            <button
              type="button"
              aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="academy-focus flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-gray-200 hover:bg-white/5 md:hidden"
            >
              {mobileMenuOpen ? (
                <Icon name="close" />
              ) : (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  aria-hidden="true"
                >
                  <path d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div className="academy-glass border-t border-white/10 px-5 py-4 md:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="academy-focus rounded-lg px-3 py-3 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white">Home</Link>
              {isAuthenticated ? (
                <Link href="/client" onClick={() => setMobileMenuOpen(false)} className="academy-focus rounded-lg px-3 py-3 text-left text-sm font-semibold text-blue-200 hover:bg-white/5">My Account</Link>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="academy-focus rounded-lg px-3 py-3 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white">Log In</Link>
                  <Link href="/login?mode=signup" onClick={() => setMobileMenuOpen(false)} className="academy-focus rounded-lg px-3 py-3 text-left text-sm font-semibold text-blue-200 hover:bg-white/5">Create Account</Link>
                </>
              )}
              {[
                ["Programs", "programs"],
                ["Learning", "experience"],
                ["Certificates", "certificate"],
              ].map(([label, id]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => scrollToSection(id)}
                  className="academy-focus rounded-lg px-3 py-3 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      <div className="relative z-10">
        {/* Hero */}
        <section className="relative">
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
            <div className="academy-reveal">
              <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-blue-300/20 bg-blue-400/[0.06] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-200 sm:text-xs">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-300" />
                Learn. Build. Move forward.
              </div>

              <h1 className="max-w-3xl text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
                Turn your
                <span className="block bg-gradient-to-r from-[#a9cfff] via-[#65b4ff] to-[#e1e9f4] bg-clip-text pb-2 text-transparent">
                  curiosity into
                </span>
                real-world skills.
              </h1>

              <p className="mt-7 max-w-xl text-base leading-8 text-gray-400 sm:text-lg">
                Learn technology through structured courses, guided practice,
                and hands-on workshops designed for your next step.
              </p>

              <div className="mt-9 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => scrollToSection("programs")}
                  className="academy-button academy-focus inline-flex items-center gap-3 rounded-lg bg-[#176fbd] px-6 py-3.5 font-semibold text-white hover:bg-[#2084dc]"
                >
                  Explore learning paths
                  <Icon name="arrow" size={18} />
                </button>

                <button
                  type="button"
                  onClick={() => scrollToSection("experience")}
                  className="academy-button academy-focus inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/[0.02] px-6 py-3.5 font-semibold text-gray-200 hover:border-blue-300/40 hover:bg-white/[0.045]"
                >
                  <Icon name="play" size={17} />
                  How it works
                </button>
              </div>

              <div className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-7">
                <div>
                  <p className="text-2xl font-bold text-white">
                    05<span className="text-blue-300">+</span>
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Technology fields
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">04</p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Learning formats
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">
                    01<span className="text-blue-300">→</span>
                  </p>
                  <p className="mt-1 text-xs leading-5 text-gray-500">
                    Step at a time
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-gray-600">
                Sample programs for demonstration. Availability and enrollment
                must be confirmed.
              </p>
            </div>

            <div className="academy-reveal relative mx-auto w-full max-w-xl [animation-delay:150ms]">
              <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b111a] p-2">
                <div
                  role="img"
                  aria-label="Learners collaborating on technology projects"
                  className="relative min-h-[390px] overflow-hidden rounded-xl bg-cover bg-center sm:min-h-[490px]"
                  style={{
                    backgroundImage:
                      "linear-gradient(180deg,rgba(7,10,16,.04) 10%,rgba(7,10,16,.92) 100%),url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=90')",
                  }}
                >
                  <div className="absolute left-5 top-5 flex items-center gap-2 rounded-lg border border-white/15 bg-black/55 px-3 py-2 text-xs text-white backdrop-blur-md">
                    <Icon name="sparkles" size={15} className="text-blue-200" />
                    Practical learning
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/15 bg-[#080d16]/95 p-5 sm:bottom-7 sm:left-7 sm:right-7 sm:p-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                      Your next chapter starts here
                    </p>
                    <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                      Skills built by doing.
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-gray-300">
                      Explore concepts, practice with purpose, and build
                      projects that demonstrate what you have learned.
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-5 -left-2 rounded-xl border border-white/10 bg-[#101722] p-4 sm:-left-7 sm:p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-lg border border-blue-300/20 bg-blue-400/[0.07] text-blue-200">
                    <Icon name="terminal" size={23} />
                  </span>
                  <div>
                    <p className="text-sm font-semibold">Learn by practice</p>
                    <p className="mt-1 text-xs text-gray-500">
                      Projects & workshops
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Learning formats */}
        <section className="border-y border-white/[0.08] bg-[#0a0e15]/80">
          <div className="mx-auto grid max-w-7xl gap-4 px-5 py-8 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
            {formats.map((item) => (
              <div
                key={item.title}
                className="group flex gap-4 rounded-lg border border-transparent p-3 transition hover:border-white/[0.08] hover:bg-white/[0.02]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-blue-300/20 bg-blue-400/[0.06] text-blue-200 transition group-hover:border-blue-300/40">
                  <Icon name={item.icon} size={21} />
                </span>
                <div>
                  <h3 className="font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Course catalog */}
        <section
          id="programs"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28"
        >
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-300">
                The learning catalog
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
                Find your next skill.
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-gray-400">
                Explore sample learning paths across technology and business.
                Filter the catalog to find a subject and format that fit you.
              </p>
              <div className="mt-4 flex max-w-xl items-start gap-3 rounded-xl border border-blue-300/20 bg-blue-400/[0.06] px-4 py-3 text-xs leading-6 text-blue-100/90 shadow-[0_0_24px_rgba(59,130,246,0.06)]">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-blue-300/20 bg-blue-300/[0.08] text-blue-200" aria-hidden="true"><Icon name="academy" size={17} /></span>
                <p aria-live="polite" className="min-h-[3rem]">
                  {typedNotice}<span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-pulse bg-blue-300" aria-hidden="true" />
                </p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3"><Link href="/academy/categories" className="inline-flex items-center gap-2 rounded-xl border border-blue-300/25 bg-blue-400/[0.06] px-4 py-3 text-sm font-semibold text-blue-100 transition hover:border-blue-300/50 hover:bg-blue-400/10">Explore 5 learning tracks <span aria-hidden="true">↗</span></Link><Link href="/academy/courses" className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-slate-300 transition hover:border-white/25 hover:text-white">Open full course directory <span aria-hidden="true">↗</span></Link></div>
            </div>

            <div className="w-full lg:max-w-sm">
              <label
                htmlFor="academy-course-search"
                className="mb-2 block text-xs font-medium text-gray-400"
              >
                Search courses, skills and topics
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <Icon name="search" size={19} />
                </span>
                <input
                  id="academy-course-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Try Python, security, routing..."
                  className="academy-focus w-full rounded-lg border border-white/10 bg-[#0b1018] py-3.5 pl-11 pr-12 text-sm text-white outline-none placeholder:text-gray-600 focus:border-blue-300/50"
                />
                {search && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setSearch("")}
                    className="academy-focus absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-gray-400 hover:bg-white/10 hover:text-white"
                  >
                    <Icon name="close" size={17} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div
            className="mt-9 flex gap-2 overflow-x-auto pb-3"
            aria-label="Filter courses by category"
          >
            {categories.map((item) => {
              const active = category === item;
              return (
                <button
                  key={item}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setCategory(item)}
                  className={`academy-button academy-focus shrink-0 rounded-full border px-4 py-2.5 text-sm ${
                    active
                      ? "border-blue-300/50 bg-blue-400/[0.12] font-semibold text-blue-100"
                      : "border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/25 hover:text-white"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <Icon
                      size={16}
                      name={
                        item === "Cybersecurity" ? "shield" :
                        item === "Software Development" ? "terminal" :
                        item === "Networks & Infrastructure" ? "globe" :
                        item === "Data Analytics" ? "sparkles" :
                        item === "Digital Marketing" ? "arrow" : "check"
                      }
                    />
                    {item}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {modes.map((item) => {
              const active = mode === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setMode(item.id)}
                  className={`academy-button academy-focus rounded-lg border px-3 py-2 text-xs font-medium ${
                    active
                      ? "border-blue-300/30 bg-blue-400/[0.09] text-blue-100"
                      : "border-transparent text-gray-500 hover:border-white/10 hover:bg-white/[0.03] hover:text-gray-300"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="mb-5 mt-7 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-500">
            <p aria-live="polite">
              Showing{" "}
              <span className="font-semibold text-white">
                {filteredCourses.length}
              </span>{" "}
              {filteredCourses.length === 1 ? "program" : "programs"}
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="academy-focus inline-flex items-center gap-2 rounded-lg px-2 py-1 text-blue-200 hover:bg-blue-400/[0.06] hover:text-white"
              >
                <Icon name="close" size={15} />
                Clear filters
              </button>
            )}
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course, index) => (
                <article
                  key={course.id}
                  className="academy-card group overflow-hidden rounded-xl border border-white/[0.09] bg-[#0a0f17]/95 transition duration-300 hover:-translate-y-1 hover:border-blue-300/35"
                  style={{
                    animation: `academy-fade-up 0.4s ease-out ${Math.min(index * 45, 200)}ms both`,
                  }}
                >
                  <div className="relative h-52 overflow-hidden bg-[#101722]">
                    <div
                      role="img"
                      aria-label={`${course.category} learning`}
                      className="academy-card-image absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: `url("${course.image}")`,
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f17] via-black/10 to-black/20" />

                    <span className="absolute left-4 top-4 rounded-md border border-white/15 bg-black/55 px-3 py-1.5 text-xs text-white backdrop-blur-sm">
                      {course.category}
                    </span>

                    {course.isOffline && (
                      <span className="absolute right-4 top-14 rounded-md border border-cyan-300/35 bg-cyan-300/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-100 backdrop-blur-sm">
                        Offline course
                      </span>
                    )}
                    {!course.isOffline && (
                      <span className="absolute bottom-4 left-4 rounded-md border border-cyan-300/30 bg-[#06131f]/85 px-3 py-1.5 text-xs font-semibold text-cyan-100 backdrop-blur-sm">
                        {course.price == null || Number(course.price) === 0 ? "Free" : new Intl.NumberFormat("en", { style: "currency", currency: course.currency || "USD", maximumFractionDigits: 2 }).format(Number(course.price))}
                      </span>
                    )}
                    <span className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-md border border-white/15 bg-black/55 px-3 py-1.5 text-xs text-gray-200">
                      <Icon name="clock" size={13} />
                      {course.duration}
                    </span>
                  </div>

                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span>{course.level}</span>
                      <span aria-hidden="true">·</span>
                      <span>{course.isOffline ? "Offline · classroom training" : `${course.modes.length} learning formats`}</span>
                    </div>

                    <h3 className="mt-3 text-xl font-bold leading-snug transition group-hover:text-blue-200">
                      {course.title}
                    </h3>

                    <p className="mt-3 min-h-[72px] text-sm leading-6 text-gray-400">
                      {course.description}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {course.modes.slice(0, 2).map((courseMode) => (
                        <span
                          key={courseMode}
                          className="rounded-md border border-white/[0.08] bg-white/[0.025] px-2.5 py-1.5 text-[11px] text-gray-400"
                        >
                          {modeLabels[courseMode]}
                        </span>
                      ))}
                      {course.modes.length > 2 && (
                        <span className="rounded-md border border-white/[0.08] px-2.5 py-1.5 text-[11px] text-gray-500">
                          +{course.modes.length - 2}
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        if (!course.isOffline && course.slug) {
                          router.push(`/academy/${encodeURIComponent(course.slug)}`);
                          return;
                        }
                        openCourse(course);
                      }}
                      className="academy-button academy-focus mt-6 flex w-full items-center justify-between border-t border-white/[0.08] pt-4 text-sm font-semibold hover:text-blue-200"
                    >
                      {course.isOffline ? "Explore program" : "Open course"}
                      <Icon
                        name="arrow"
                        size={18}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-white/15 bg-white/[0.015] px-6 py-16 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl border border-white/10 text-gray-400">
                <Icon name="search" size={26} />
              </span>
              <h3 className="mt-5 text-xl font-semibold">
                No matching programs
              </h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                Try another keyword or reset your filters to see all programs.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="academy-button academy-focus mt-5 rounded-lg border border-blue-300/30 bg-blue-400/[0.08] px-5 py-3 text-sm font-semibold text-blue-100 hover:bg-blue-400/[0.14]"
              >
                Show all programs
              </button>
            </div>
          )}

          <p className="mt-6 text-xs leading-5 text-gray-600">
            Online courses published by VEXORA display their configured price and preview media. Full course content is unlocked only after an administrator approves access.
          </p>
        </section>

        {/* Learning experience */}
        <section
          id="experience"
          className="relative scroll-mt-24 border-y border-white/[0.08] bg-[#090e16]/90"
        >
          <div className="academy-orb right-[-180px] top-[15%] bg-blue-500" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-2">
            <div className="relative grid grid-cols-2 gap-3">
              <div
                role="img"
                aria-label="Learner working on a computer"
                className="mt-8 h-52 rounded-xl border border-white/10 bg-cover bg-center sm:h-64"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg,transparent,rgba(7,10,16,.4)),url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=85')",
                }}
              />
              <div
                role="img"
                aria-label="Technology team collaborating"
                className="h-52 rounded-xl border border-white/10 bg-cover bg-center sm:h-64"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg,transparent,rgba(7,10,16,.4)),url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=700&q=85')",
                }}
              />

              <div className="academy-glass absolute bottom-5 left-1/2 -translate-x-1/2 rounded-lg border border-white/10 px-5 py-3">
                <p className="whitespace-nowrap text-sm font-semibold">
                  Learn by doing
                </p>
                <p className="mt-1 whitespace-nowrap text-center text-xs text-gray-500">
                  Practice · Feedback · Improve
                </p>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-300">
                The VEXORA approach
              </p>
              <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">
                More than lessons.
                <span className="block bg-gradient-to-r from-[#a9cfff] to-[#65b4ff] bg-clip-text text-transparent">
                  A path to practice.
                </span>
              </h2>
              <p className="mt-5 leading-8 text-gray-400">
                Our planned approach combines clear explanations, practical
                exercises, and projects that help learners apply new concepts.
              </p>

              <div className="mt-8 space-y-5">
                {learningSteps.map((step) => (
                  <div key={step.number} className="group flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-blue-300/20 bg-blue-400/[0.06] text-xs font-bold text-blue-200">
                      {step.number}
                    </span>
                    <div>
                      <h3 className="font-semibold">{step.title}</h3>
                      <p className="mt-1 text-sm leading-6 text-gray-500">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => scrollToSection("programs")}
                className="academy-button academy-focus mt-8 inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold text-gray-200 hover:border-blue-300/40 hover:bg-white/[0.035]"
              >
                Find a learning path
                <Icon name="arrow" size={17} />
              </button>
            </div>
          </div>
        </section>

        {/* Certificate section */}
        <section
          id="certificate"
          className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24"
        >
          <div className="relative overflow-hidden rounded-2xl border border-blue-200/15 bg-[#0b111b]/95 p-7 sm:p-12 lg:p-14">
            <div
              className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/[0.06] blur-[90px]"
              aria-hidden="true"
            />

            <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-200">
                  Recognition of your progress
                </p>
                <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                  Every completed step counts.
                </h2>
                <p className="mt-5 max-w-xl leading-8 text-gray-400">
                  VEXORA plans to offer certificates of completion for eligible
                  programs. Requirements and availability will be explained
                  before enrollment.
                </p>

                <div className="mt-6 flex items-start gap-3 text-sm leading-6 text-gray-400">
                  <Icon
                    name="check"
                    size={19}
                    className="mt-0.5 shrink-0 text-blue-200"
                  />
                  <p>
                    This is a sample design, not an issued credential and not a
                    claim of government or third-party accreditation.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCertificateOpen(true)}
                  className="academy-button academy-focus mt-8 inline-flex items-center gap-2 rounded-lg border border-blue-300/30 bg-blue-400/[0.08] px-5 py-3.5 text-sm font-semibold text-blue-100 hover:bg-blue-400/[0.14]"
                >
                  <Icon name="award" size={18} />
                  Preview certificate
                  <Icon name="arrow" size={16} />
                </button>
              </div>

              {/* Certificate thumbnail */}
              <div className="mx-auto w-full max-w-sm">
                <button
                  type="button"
                  onClick={() => setCertificateOpen(true)}
                  aria-label="Open certificate preview"
                  className="academy-focus group block w-full rounded-lg border border-[#b7c8dd]/60 bg-[#edf2f8] p-3 text-[#17283e] shadow-xl transition hover:border-blue-300"
                >
                  <div className="border border-[#8da4c0] p-6 text-center sm:p-8">
                    <Image
                      src="/vexora-logo.png"
                      alt="VEXORA logo"
                      width={100}
                      height={60}
                      className="mx-auto h-12 w-auto object-contain"
                    />
                    <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.28em] text-[#4d6684]">
                      VEXORA ACADEMY
                    </p>
                    <h3 className="mt-4 font-serif text-2xl font-bold sm:text-3xl">
                      Certificate
                    </h3>
                    <p className="mt-2 font-serif text-sm italic text-[#526b89]">
                      of Completion
                    </p>
                    <div className="mx-auto my-5 h-px w-20 bg-[#a6b7ca]" />
                    <p className="text-xs leading-5 text-[#526b89]">
                      A sample design for a future learning program.
                    </p>
                    <div className="mt-7 flex justify-between border-t border-[#b1bfd0] pt-3 text-[8px] uppercase tracking-wider text-[#526b89]">
                      <span>VEXORA Academy</span>
                      <span>Sample preview</span>
                    </div>
                  </div>
                </button>
                <p className="mt-4 text-center text-xs text-gray-500">
                  Select the certificate to open the full preview.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final call to action */}
        <section className="px-5 pb-20 sm:px-8 sm:pb-24">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#0b1019]/95 px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-blue-200">
                Your next step
              </p>
              <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold sm:text-5xl">
                Ready to start learning?
              </h2>
              <p className="mx-auto mt-5 max-w-xl leading-7 text-gray-400">
                Explore the sample programs and find a subject you want to
                develop. Open a course to preview its topics and enrollment
                interface.
              </p>
              <button
                type="button"
                onClick={() => scrollToSection("programs")}
                className="academy-button academy-focus mt-8 inline-flex items-center gap-2 rounded-lg bg-[#176fbd] px-6 py-3.5 font-semibold hover:bg-[#2084dc]"
              >
                Find a program
                <Icon name="arrow" size={18} />
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/[0.08] bg-[#070a10]/95">
          <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <a
              href="#top"
              aria-label="Back to VEXORA Academy home"
              className="academy-focus inline-flex w-fit items-center gap-3 rounded-lg"
            >
              <Image
                src="/vexora-logo.png"
                alt="VEXORA Technology logo"
                width={150}
                height={55}
                className="h-9 w-auto object-contain"
              />
              <span className="border-l border-white/15 pl-3 text-sm text-gray-400">
                Academy
              </span>
            </a>
            <p className="text-sm text-gray-500">
              Learn with purpose. Build with confidence.
            </p>
            <p className="text-xs text-gray-600">
              © 2026 VEXORA. All rights reserved.
            </p>
          </div>
        </footer>
      </div>

      {/* Course details and demo registration */}
      {selectedCourse && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/85 p-3 backdrop-blur-sm sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeAllOverlays();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-dialog-title"
            className="my-auto max-h-[92dvh] w-full max-w-2xl overflow-y-auto rounded-xl border border-white/10 bg-[#0c121d] shadow-2xl"
          >
            <div className="relative h-44 bg-[#101722] sm:h-56">
              <div
                role="img"
                aria-label={`${selectedCourse.category} course image`}
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url("${selectedCourse.image}")`,
                }}
              />
              {selectedCourse.promoVideoUrl && (
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src={selectedCourse.promoVideoUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  aria-label={`${selectedCourse.title} course preview`}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c121d] to-black/10" />
              <span className="absolute bottom-4 left-5 rounded-md border border-white/15 bg-black/55 px-3 py-1.5 text-xs text-white">
                {selectedCourse.category}
              </span>
              <button
                type="button"
                onClick={closeAllOverlays}
                aria-label="Close course details"
                className="academy-focus absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-black/55 text-white hover:bg-black/80"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {!registrationOpen ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                    {selectedCourse.category}
                  </p>
                  <h2
                    id="course-dialog-title"
                    className="mt-3 text-2xl font-bold sm:text-3xl"
                  >
                    {selectedCourse.title}
                  </h2>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-gray-400">
                    <span className="rounded-md border border-white/[0.08] bg-white/[0.03] px-3 py-2">
                      {selectedCourse.level}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-3 py-2">
                      <Icon name="clock" size={14} />
                      {selectedCourse.duration}
                    </span>
                    {selectedCourse.modes.map((item) => (
                      <span
                        key={item}
                        className="rounded-md border border-white/[0.08] bg-white/[0.03] px-3 py-2"
                      >
                        {modeLabels[item]}
                      </span>
                    ))}
                  </div>

                  <p className="mt-5 leading-7 text-gray-400">
                    {selectedCourse.description}
                  </p>
                  {!selectedCourse.isOffline && (
                    <div className="mt-5 rounded-xl border border-cyan-300/15 bg-cyan-300/[0.04] p-4">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-slate-400">Course price</span>
                        <strong className="text-xl text-white">
                          {selectedCourse.price == null || Number(selectedCourse.price) === 0
                            ? "Free"
                            : new Intl.NumberFormat("en", { style: "currency", currency: selectedCourse.currency || "USD" }).format(Number(selectedCourse.price))}
                        </strong>
                      </div>
                      <p className="mt-2 text-xs leading-5 text-slate-500">Only the course overview is public. Full lessons become available after the VEXORA administrator approves your request.</p>
                    </div>
                  )}

                  <h3 className="mt-7 font-semibold">What you will explore</h3>
                  <ul className="mt-4 space-y-3">
                    {selectedCourse.topics.map((topic) => (
                      <li
                        key={topic}
                        className="flex items-start gap-3 text-sm leading-6 text-gray-400"
                      >
                        <span className="mt-0.5 text-blue-200">
                          <Icon name="check" size={17} />
                        </span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>

                  {selectedCourse.isOffline ? (
                    <>
                      <button
                        type="button"
                        onClick={openRegistration}
                        className="academy-button academy-focus mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-[#176fbd] px-5 py-3.5 font-semibold hover:bg-[#2084dc]"
                      >
                        Register for offline training
                        <Icon name="arrow" size={18} />
                      </button>
                      <p className="mt-3 text-center text-xs leading-5 text-gray-500">Your request is sent to the VEXORA Academy team for follow-up.</p>
                    </>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => void requestCourseAccess()}
                        disabled={accessRequestLoading}
                        className="academy-button academy-focus mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3.5 font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
                      >
                        {accessRequestLoading
                          ? (selectedCourse.price != null && Number(selectedCourse.price) === 0 ? "Enrolling…" : "Creating request…")
                          : selectedCourse.price != null && Number(selectedCourse.price) === 0
                            ? "Enroll for free"
                            : "Request purchase / access code"}
                        <Icon name="arrow" size={18} />
                      </button>
                      {accessRequestError && <p role="alert" className="mt-3 rounded-lg border border-rose-300/20 bg-rose-300/[0.06] p-3 text-sm text-rose-200">{accessRequestError}</p>}
                      {accessRequestResult && (
                        <div role="status" className="mt-4 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] p-4">
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-200">Your reference code</p>
                          <div className="mt-2 flex items-center justify-between gap-3">
                            <code className="text-lg font-bold tracking-wider text-white">{accessRequestResult.code}</code>
                            <button type="button" onClick={() => void navigator.clipboard?.writeText(accessRequestResult.code)} className="rounded-lg border border-white/15 px-3 py-1.5 text-xs text-slate-300 hover:text-white">Copy</button>
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-300">{accessRequestResult.message}</p>
                          <p className="mt-2 text-xs uppercase tracking-wider text-amber-200">Status: {accessRequestResult.status}</p>
                        </div>
                      )}
                    </>
                  )}
                </>
              ) : submitted ? (
                <div className="py-8 text-center">
                  <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl border border-blue-300/20 bg-blue-400/[0.06] text-blue-200">
                    <Icon name="check" size={32} />
                  </span>
                  <h2 id="course-dialog-title" className="mt-5 text-2xl font-bold">
                    Registration received
                  </h2>
                  <p className="mx-auto mt-3 max-w-md leading-7 text-gray-400">
                    Your registration has been submitted to the VEXORA Academy team.
                    We will review your details and contact you using the email address provided.
                  </p>
                  <button
                    type="button"
                    onClick={closeAllOverlays}
                    className="academy-button academy-focus mt-7 rounded-lg border border-white/15 px-5 py-3 font-semibold hover:bg-white/[0.04]"
                  >
                    Close preview
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                    Offline training registration
                  </p>
                  <h2
                    id="course-dialog-title"
                    className="mt-3 text-2xl font-bold"
                  >
                    Register for offline training
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    Selected program:{" "}
                    <span className="font-semibold text-white">
                      {selectedCourse.title}
                    </span>
                  </p>

                  <form className="mt-6 space-y-4" onSubmit={handleRegistration}>
                    <div>
                      <label
                        htmlFor="academy-name"
                        className="mb-2 block text-sm text-gray-300"
                      >
                        Full name
                      </label>
                      <input
                        id="academy-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        required
                        minLength={2}
                        maxLength={100}
                        value={learnerName}
                        onChange={(event) => setLearnerName(event.target.value)}
                        placeholder="Enter your name"
                        className="academy-focus w-full rounded-lg border border-white/10 bg-[#080d15] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-blue-300/50"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="academy-email"
                        className="mb-2 block text-sm text-gray-300"
                      >
                        Email address
                      </label>
                      <input
                        id="academy-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        maxLength={254}
                        value={learnerEmail}
                        onChange={(event) => setLearnerEmail(event.target.value)}
                        placeholder="you@example.com"
                        className="academy-focus w-full rounded-lg border border-white/10 bg-[#080d15] px-4 py-3 text-sm text-white outline-none placeholder:text-gray-600 focus:border-blue-300/50"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="academy-format"
                        className="mb-2 block text-sm text-gray-300"
                      >
                        Preferred format
                      </label>
                      <select
                        id="academy-format"
                        name="format"
                        required
                        value={preferredFormat}
                        onChange={(event) => setPreferredFormat(event.target.value)}
                        className="academy-focus w-full rounded-lg border border-white/10 bg-[#080d15] px-4 py-3 text-sm text-gray-200 outline-none focus:border-blue-300/50"
                      >
                        {selectedCourse.modes.map((item) => (
                          <option key={item} value={item}>
                            {modeLabels[item]}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={registrationLoading}
                      className="academy-button academy-focus w-full rounded-lg bg-[#176fbd] px-5 py-3.5 font-semibold hover:bg-[#2084dc] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {registrationLoading ? "Submitting..." : "Submit registration"}
                    </button>

                    <button
                      type="button"
                      onClick={() => setRegistrationOpen(false)}
                      className="academy-button academy-focus w-full rounded-lg border border-white/10 px-5 py-3 text-sm text-gray-400 hover:bg-white/[0.04] hover:text-white"
                    >
                      Back to course details
                    </button>

                    {registrationError && (
                      <p role="alert" className="rounded-lg border border-rose-400/20 bg-rose-400/5 p-3 text-sm text-rose-200">
                        {registrationError}
                      </p>
                    )}
                    <p className="text-xs leading-5 text-gray-500">
                      Your registration is securely submitted to the VEXORA team for review.
                    </p>
                  </form>
                </>
              )}
            </div>
          </section>
        </div>
      )}

      {/* Certificate preview and print layout */}
      {certificateOpen && (
        <div
          className="academy-print-area fixed inset-0 z-[110] flex items-center justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-sm sm:p-8"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setCertificateOpen(false);
            }
          }}
        >
          <div className="my-auto w-full max-w-4xl">
            <div className="academy-no-print mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">
                  Certificate preview
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Sample design · Not an issued credential
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCertificateOpen(false)}
                aria-label="Close certificate preview"
                className="academy-focus flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/15 text-white hover:bg-white/10"
              >
                <Icon name="close" size={20} />
              </button>
            </div>

            <Image
              src="/academy-certificate.svg"
              alt="VEXORA Academy certificate design preview with blank recipient name, Mohamed Ramadan signature, version 1.0, and masked reference number"
              width={1600}
              height={1050}
              unoptimized
              className="academy-print-certificate block h-auto w-full rounded-sm shadow-[0_25px_80px_rgba(0,0,0,0.35)]"
            />
            <div className="academy-no-print mt-5 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => setCertificateOpen(false)}
                className="academy-button academy-focus rounded-lg border border-white/15 px-5 py-3 text-sm font-semibold text-gray-200 hover:bg-white/[0.05]"
              >
                Close preview
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
