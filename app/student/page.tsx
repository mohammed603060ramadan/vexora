
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/browser";

type StudentProfile = {
  full_name: string | null;
  avatar_url: string | null;
};

type CourseDetails = {
  id: string;
  title: string;
  subtitle: string | null;
  difficulty: string;
  course_type: string;
  estimated_hours: number | null;
};

type StudentEnrollment = {
  id: string;
  course_id: string;
  status: "pending" | "active" | "completed" | "cancelled";
  progress_percent: number;
  enrolled_at: string;
  course: CourseDetails | null;
};

type TechArticle = {
  id: number;
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  readingTime: number;
  tags: string[];
};

const resources = [
  {
    category: "Web Development",
    title: "Next.js Documentation",
    description: "Learn routing, rendering, server components and modern web development.",
    url: "https://nextjs.org/docs",
    icon: "⌘",
  },
  {
    category: "Programming",
    title: "MDN Web Docs",
    description: "Practical references for HTML, CSS, JavaScript and browser APIs.",
    url: "https://developer.mozilla.org/",
    icon: "</>",
  },
  {
    category: "Artificial Intelligence",
    title: "Hugging Face",
    description: "Explore AI models, datasets and machine-learning projects.",
    url: "https://huggingface.co/",
    icon: "✳",
  },
  {
    category: "Cybersecurity",
    title: "OWASP",
    description: "Security guides, application risks and practical best practices.",
    url: "https://owasp.org/",
    icon: "◈",
  },
  {
    category: "Cloud & Development",
    title: "GitHub Explore",
    description: "Discover repositories, open-source projects and developer tools.",
    url: "https://github.com/explore",
    icon: "⌘",
  },
  {
    category: "Technology News",
    title: "Google Developers Blog",
    description: "Read official updates about developer tools, platforms and technologies.",
    url: "https://developers.googleblog.com/",
    icon: "↗",
  },
];

const navigation = [
  { label: "Overview", href: "/student", icon: "▦" },
  { label: "Academy", href: "/academy", icon: "▤" },
  { label: "Client Portal", href: "/client", icon: "◫" },
  { label: "Main Website", href: "/", icon: "⌂" },
];

const eventSources = [
  {
    title: "Google Cloud Events",
    description: "Cloud, AI, data and developer events from Google Cloud.",
    url: "https://cloud.google.com/events",
    icon: "☁",
  },
  {
    title: "Microsoft Events",
    description: "Technology sessions, workshops and Microsoft developer events.",
    url: "https://events.microsoft.com/",
    icon: "▦",
  },
  {
    title: "AWS Events",
    description: "Explore cloud computing events, webinars and technical sessions.",
    url: "https://aws.amazon.com/events/",
    icon: "◇",
  },
  {
    title: "GitHub Events",
    description: "Discover developer community events and GitHub sessions.",
    url: "https://github.com/resources/events",
    icon: "⌘",
  },
];

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Recently published";
  }

  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

function safeProgress(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

export default function StudentDashboard() {
  const router = useRouter();

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const [enrollments, setEnrollments] = useState<StudentEnrollment[]>([]);
  const [coursesError, setCoursesError] = useState("");
  const [coursesLoading, setCoursesLoading] = useState(false);

  const [articles, setArticles] = useState<TechArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState("");

  const loadStudent = useCallback(async () => {
    setLoading(true);
    setError("");
    setCoursesError("");
    setCoursesLoading(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error("Student authentication failed:", authError);
        router.replace("/login?next=/student");
        return;
      }

      if (!user) {
        router.replace("/login?next=/student");
        return;
      }

      setEmail(user.email ?? "");

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Student profile loading failed:", profileError);
        setProfile(null);
        setError(
          `Profile error: ${profileError.message} (code: ${profileError.code || "unknown"})`
        );
      } else {
        setProfile(profileData);
      }

      const { data: enrollmentData, error: enrollmentError } =
        await supabase
          .from("enrollments")
          .select("id, course_id, status, progress_percent, enrolled_at")
          .eq("student_id", user.id)
          .order("enrolled_at", { ascending: false });

      if (enrollmentError) {
        console.error(
          "Student enrollments loading failed:",
          enrollmentError
        );

        setEnrollments([]);
        setCoursesError(
          `Enrollment error: ${enrollmentError.message} (code: ${enrollmentError.code || "unknown"})`
        );
        return;
      }

      if (!enrollmentData || enrollmentData.length === 0) {
        setEnrollments([]);
        setCoursesError("");
        return;
      }

      const courseIds = [
        ...new Set(
          enrollmentData
            .map((item) => item.course_id)
            .filter((id): id is string => Boolean(id))
        ),
      ];

      if (courseIds.length === 0) {
        setEnrollments(
          enrollmentData.map((item) => ({
            ...item,
            status: item.status as StudentEnrollment["status"],
            progress_percent: safeProgress(item.progress_percent),
            course: null,
          }))
        );

        setCoursesError("");
        return;
      }

      const { data: courseData, error: courseError } = await supabase
        .from("courses")
        .select(
          "id, title, subtitle, difficulty, course_type, estimated_hours"
        )
        .in("id", courseIds);

      if (courseError) {
        console.error("Course details loading failed:", courseError);

        setEnrollments([]);
        setCoursesError(
          `Course details error: ${courseError.message} (code: ${courseError.code || "unknown"})`
        );
        return;
      }

      const courseMap = new Map(
        (courseData ?? []).map((course) => [course.id, course])
      );

      setEnrollments(
        enrollmentData.map((item) => ({
          ...item,
          status: item.status as StudentEnrollment["status"],
          progress_percent: safeProgress(item.progress_percent),
          course: courseMap.get(item.course_id) ?? null,
        }))
      );

      setCoursesError("");
    } catch (caughtError) {
      console.error("Student dashboard loading failed:", caughtError);

      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "An unexpected error occurred.";

      setError(`Dashboard error: ${message}`);
    } finally {
      setLoading(false);
      setCoursesLoading(false);
    }
  }, [router]);

  const loadTechnologyNews = useCallback(async () => {
    setNewsLoading(true);
    setNewsError("");

    try {
      const response = await fetch("/api/student/technology", {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Technology feed request failed.");
      }

      const result: { articles?: TechArticle[] } = await response.json();
      setArticles(result.articles ?? []);
    } catch (caughtError) {
      console.error("Technology feed loading failed:", caughtError);
      setNewsError("Technology updates are temporarily unavailable.");
      setArticles([]);
    } finally {
      setNewsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadStudent();
      void loadTechnologyNews();
    }, 0);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.replace("/login?next=/student");
      }
    });

    return () => {
      window.clearTimeout(timer);
      subscription.unsubscribe();
    };
  }, [loadStudent, loadTechnologyNews, router]);

  async function handleSignOut() {
    setSigningOut(true);
    setError("");

    try {
      const { error: signOutError } = await supabase.auth.signOut();

      if (signOutError) {
        setError("Couldn't sign out. Please try again.");
        return;
      }

      router.replace("/login");
      router.refresh();
    } catch (caughtError) {
      console.error("Sign out failed:", caughtError);
      setError("Couldn't sign out. Please try again.");
    } finally {
      setSigningOut(false);
    }
  }

  const categories = useMemo(
    () => [
      "All",
      ...Array.from(new Set(resources.map((resource) => resource.category))),
    ],
    []
  );

  const filteredResources = useMemo(() => {
    const term = search.trim().toLowerCase();

    return resources.filter((resource) => {
      const matchesCategory =
        category === "All" || resource.category === category;

      const text =
        `${resource.title} ${resource.description} ${resource.category}`.toLowerCase();

      return matchesCategory && text.includes(term);
    });
  }, [search, category]);

  const completedCourses = enrollments.filter(
    (item) => item.status === "completed"
  ).length;

  const activeCourses = enrollments.filter(
    (item) => item.status === "active"
  ).length;

  const averageProgress =
    enrollments.length > 0
      ? Math.round(
          enrollments.reduce(
            (total, item) => total + safeProgress(item.progress_percent),
            0
          ) / enrollments.length
        )
      : 0;

  if (loading) {
    return (
      <main className="student-loading">
        <div className="student-spinner" />
        <p>Preparing your learning space...</p>

        <style jsx>{`
          .student-loading {
            min-height: 100vh;
            display: grid;
            place-content: center;
            justify-items: center;
            gap: 16px;
            background: #080d17;
            color: #dbe7f8;
            font-family: Arial, sans-serif;
          }
          .student-spinner {
            width: 36px;
            height: 36px;
            border: 3px solid #24334b;
            border-top-color: #48a6ff;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="student-app">
      <aside className="student-sidebar">
        <Link href="/" className="brand">
          <span className="brand-mark">V</span>
          <span>
            VEXORA
            <small>STUDENT SPACE</small>
          </span>
        </Link>

        <p className="nav-heading">WORKSPACE</p>

        <nav className="student-nav" aria-label="Student navigation">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${item.href === "/student" ? "selected" : ""}`}
              aria-current={item.href === "/student" ? "page" : undefined}
            >
              <span className="nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              <span>{item.label}</span>
              <span className="nav-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="secure-label">
            <span className="online-dot" />
            Authenticated session
          </div>

          <button
            type="button"
            className="signout-button"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            <span aria-hidden="true">⇥</span>
            {signingOut ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </aside>

      <section className="student-main">
        <header className="topbar">
          <div>
            <p className="eyebrow">VEXORA ACADEMY / STUDENT PORTAL</p>
            <h1>My learning space</h1>
          </div>

          <div className="topbar-actions">
            <button
              type="button"
              className="refresh-button"
              onClick={() => {
                void loadStudent();
                void loadTechnologyNews();
              }}
              disabled={loading || newsLoading}
            >
              <span aria-hidden="true">↻</span>
              <span>Refresh</span>
            </button>
          </div>
        </header>

        {error && (
          <div className="error-banner" role="alert">
            <span>{error}</span>
            <button type="button" onClick={() => void loadStudent()}>
              Try again
            </button>
          </div>
        )}

        <section className="welcome-panel">
          <div className="welcome-content">
            <span className="welcome-tag">YOUR NEXT CHAPTER STARTS HERE</span>
            <h2>
              Learn. Build.
              <br />
              <span>Move forward.</span>
            </h2>
            <p>
              Access your courses, track your progress, explore new
              technologies and keep building your technical skills.
            </p>
            <Link href="/academy" className="primary-button">
              Explore the Academy <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="welcome-graphic" aria-hidden="true">
            <div className="graphic-orbit orbit-one" />
            <div className="graphic-orbit orbit-two" />
            <div className="graphic-core">V.</div>
            <span className="graphic-node node-one">AI</span>
            <span className="graphic-node node-two">DEV</span>
            <span className="graphic-node node-three">SEC</span>
          </div>
        </section>

        <section className="profile-strip">
          <div className="profile-avatar">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={profile.avatar_url} alt="Student avatar" />
            ) : (
              (profile?.full_name || email || "S").charAt(0).toUpperCase()
            )}
          </div>

          <div className="profile-details">
            <span className="muted-label">SIGNED IN AS</span>
            <strong>{profile?.full_name || "Student"}</strong>
            <span>{email}</span>
          </div>

          <div className="session-status">
            <span className="online-dot" />
            Session active
          </div>
        </section>

        <section className="stats-grid" aria-label="Learning statistics">
          <article className="stat-card">
            <span className="stat-icon blue">▤</span>
            <span className="stat-label">Registered courses</span>
            <strong>{enrollments.length}</strong>
            <small>Your total registrations</small>
          </article>
          <article className="stat-card">
            <span className="stat-icon cyan">◷</span>
            <span className="stat-label">Active courses</span>
            <strong>{activeCourses}</strong>
            <small>Currently in progress</small>
          </article>
          <article className="stat-card">
            <span className="stat-icon purple">✓</span>
            <span className="stat-label">Completed courses</span>
            <strong>{completedCourses}</strong>
            <small>Successfully completed</small>
          </article>
          <article className="stat-card">
            <span className="stat-icon gold">↗</span>
            <span className="stat-label">Average progress</span>
            <strong>{averageProgress}%</strong>
            <small>Across your courses</small>
          </article>
        </section>

        <section className="section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow">YOUR LEARNING JOURNEY</p>
              <h2>My Courses</h2>
              <p className="section-description">
                Track your registrations and learning progress.
              </p>
            </div>
            <span className="resource-count">{enrollments.length} courses</span>
          </div>

          {coursesLoading ? (
            <div className="empty-state">
              <div className="mini-spinner" />
              <p>Loading your courses...</p>
            </div>
          ) : coursesError ? (
            <div className="error-banner" role="alert">
              <span>{coursesError}</span>
              <button type="button" onClick={() => void loadStudent()}>
                Try again
              </button>
            </div>
          ) : enrollments.length === 0 ? (
            <div className="empty-state">
              <span aria-hidden="true">▤</span>
              <strong>No enrolled courses yet</strong>
              <p>Your registered courses will appear here.</p>
              <Link href="/academy" className="primary-button">
                Explore the Academy ↗
              </Link>
            </div>
          ) : (
            <div className="resource-grid">
              {enrollments.map((enrollment) => {
                const progress = safeProgress(enrollment.progress_percent);

                return (
                  <article
                    className="resource-card course-card"
                    key={enrollment.id}
                  >
                    <div className="resource-top">
                      <span className="resource-icon" aria-hidden="true">
                        ◈
                      </span>
                      <span
                        className={`status-pill status-${enrollment.status}`}
                      >
                        {enrollment.status.replace("_", " ")}
                      </span>
                    </div>

                    <h3>
                      {enrollment.course?.title ??
                        "Course details unavailable"}
                    </h3>
                    <p>
                      {enrollment.course?.subtitle ||
                        "Continue your learning journey with VEXORA Academy."}
                    </p>

                    {enrollment.course && (
                      <div className="course-meta">
                        <span>Level: {enrollment.course.difficulty}</span>
                        <span>
                          Mode:{" "}
                          {enrollment.course.course_type.replace("_", " ")}
                        </span>
                        {enrollment.course.estimated_hours !== null && (
                          <span>
                            {enrollment.course.estimated_hours} learning hours
                          </span>
                        )}
                      </div>
                    )}

                    <div
                      className="progress-track"
                      role="progressbar"
                      aria-label={`Progress in ${enrollment.course?.title ?? "course"}`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={progress}
                    >
                      <div
                        className="progress-fill"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <div className="progress-label">
                      <span>Course progress</span>
                      <strong>{progress}%</strong>
                    </div>

                    <span className="course-enrolled-date">
                      Enrolled {formatDate(enrollment.enrolled_at)}
                    </span>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow">KEEP EXPLORING</p>
              <h2>Learning shortcuts</h2>
              <p className="section-description">
                Jump directly to the areas you need.
              </p>
            </div>
          </div>

          <div className="shortcut-grid">
            <Link href="/academy" className="shortcut-card">
              <span className="shortcut-icon blue">▤</span>
              <strong>Academy programs</strong>
              <span>Explore learning programs and workshops.</span>
              <span className="card-action">Browse programs ↗</span>
            </Link>

            <a
              href="https://developer.mozilla.org/"
              target="_blank"
              rel="noreferrer"
              className="shortcut-card"
            >
              <span className="shortcut-icon purple">&lt;/&gt;</span>
              <strong>Developer library</strong>
              <span>
                Study web technologies with practical references.
              </span>
              <span className="card-action">Open library ↗</span>
            </a>

            <a
              href="https://github.com/explore"
              target="_blank"
              rel="noreferrer"
              className="shortcut-card"
            >
              <span className="shortcut-icon cyan">⌘</span>
              <strong>Build with GitHub</strong>
              <span>
                Discover real projects and open-source code.
              </span>
              <span className="card-action">Explore projects ↗</span>
            </a>
          </div>
        </section>

        <section className="section-block">
          <div className="section-heading resources-heading">
            <div>
              <p className="eyebrow">TECHNOLOGY RADAR</p>
              <h2>Explore the tech world</h2>
              <p className="section-description">
                Official documentation, developer platforms and technology
                updates.
              </p>
            </div>
            <span className="resource-count">
              {filteredResources.length} resources
            </span>
          </div>

          <div className="resource-controls">
            <label className="search-box">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search technologies..."
                aria-label="Search technology resources"
              />
            </label>

            <label className="category-select-label">
              <span className="sr-only">Filter resources</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
              >
                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {filteredResources.length > 0 ? (
            <div className="resource-grid">
              {filteredResources.map((resource) => (
                <article className="resource-card" key={resource.title}>
                  <div className="resource-top">
                    <span className="resource-icon" aria-hidden="true">
                      {resource.icon}
                    </span>
                    <span className="resource-category">
                      {resource.category}
                    </span>
                  </div>
                  <h3>{resource.title}</h3>
                  <p>{resource.description}</p>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noreferrer"
                    className="resource-link"
                  >
                    Visit resource <span aria-hidden="true">↗</span>
                  </a>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span aria-hidden="true">⌕</span>
              <strong>No resources found</strong>
              <p>
                Try another search term or choose a different category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setCategory("All");
                }}
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        <section className="section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow">LIVE DEVELOPMENT FEED</p>
              <h2>Latest technology updates</h2>
              <p className="section-description">
                Recent articles loaded from the technology feed.
              </p>
            </div>
            <button
              type="button"
              className="text-button"
              onClick={() => void loadTechnologyNews()}
              disabled={newsLoading}
            >
              {newsLoading ? "Loading..." : "↻ Refresh news"}
            </button>
          </div>

          {newsLoading ? (
            <div className="empty-state">
              <div className="mini-spinner" />
              <p>Loading technology updates...</p>
            </div>
          ) : newsError ? (
            <div className="error-banner" role="alert">
              <span>{newsError}</span>
              <button type="button" onClick={() => void loadTechnologyNews()}>
                Try again
              </button>
            </div>
          ) : articles.length === 0 ? (
            <div className="empty-state">
              <strong>No updates available right now</strong>
              <p>Please refresh in a little while.</p>
            </div>
          ) : (
            <div className="resource-grid">
              {articles.map((article) => (
                <article className="resource-card news-card" key={article.id}>
                  <div className="resource-top">
                    <span className="resource-icon" aria-hidden="true">
                      ↗
                    </span>
                    <span className="resource-category">
                      {article.tags[0] || "Technology"}
                    </span>
                  </div>
                  <h3>{article.title}</h3>
                  <p>
                    {article.description ||
                      "Read the full article for more details."}
                  </p>
                  <div className="news-meta">
                    <span>{formatDate(article.publishedAt)}</span>
                    <span>{article.readingTime} min read</span>
                  </div>
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noreferrer"
                    className="resource-link"
                  >
                    Read article <span aria-hidden="true">↗</span>
                  </a>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="section-block">
          <div className="section-heading">
            <div>
              <p className="eyebrow">LEARN IN THE COMMUNITY</p>
              <h2>Technology events</h2>
              <p className="section-description">
                Open official event calendars to discover current sessions,
                conferences and workshops.
              </p>
            </div>
          </div>

          <div className="shortcut-grid">
            {eventSources.map((event) => (
              <a
                href={event.url}
                target="_blank"
                rel="noreferrer"
                className="shortcut-card"
                key={event.title}
              >
                <span className="shortcut-icon blue" aria-hidden="true">
                  {event.icon}
                </span>
                <strong>{event.title}</strong>
                <span>{event.description}</span>
                <span className="card-action">Explore events ↗</span>
              </a>
            ))}
          </div>
        </section>

        <footer className="student-footer">
          <span>© {new Date().getFullYear()} VEXORA Technology</span>
          <Link href="/contact">Contact the team ↗</Link>
        </footer>
      </section>

      <style jsx>{`
        :global(*) { box-sizing: border-box; }
        .student-app { min-height: 100vh; display: flex; background: #080d17; color: #edf4ff; font-family: Arial, Helvetica, sans-serif; }
        .student-sidebar { width: 250px; flex-shrink: 0; min-height: 100vh; padding: 28px 16px 20px; display: flex; flex-direction: column; border-right: 1px solid #1b2638; background: #0b1220; }
        .brand { display: flex; align-items: center; gap: 12px; color: #f4f8ff; text-decoration: none; font-size: 18px; font-weight: 800; letter-spacing: 2px; padding: 0 8px; }
        .brand-mark { width: 42px; height: 42px; display: grid; place-items: center; border: 1px solid #318fe6; border-radius: 12px; background: linear-gradient(145deg,#173b64,#0c1a2d); color: #69bdff; font-size: 25px; }
        .brand small { display: block; margin-top: 5px; color: #71839d; font-size: 9px; letter-spacing: 2px; }
        .nav-heading { margin: 48px 10px 12px; color: #62738d; font-size: 10px; font-weight: 700; letter-spacing: 1.8px; }
        .student-nav { display: grid; gap: 7px; }
        .nav-link { min-height: 47px; display: flex; align-items: center; gap: 12px; padding: 0 12px; border: 1px solid transparent; border-radius: 10px; color: #9aabc2; text-decoration: none; font-size: 13px; transition: 160ms ease; }
        .nav-link:hover,.nav-link.selected { border-color: #23476d; background: #112640; color: #75bdff; }
        .nav-icon { width: 22px; text-align: center; font-size: 19px; }
        .nav-arrow { margin-left: auto; opacity: .65; }
        .sidebar-bottom { margin-top: auto; display: grid; gap: 18px; padding: 20px 8px 0; }
        .secure-label,.session-status { display: flex; align-items: center; gap: 8px; color: #92a5bd; font-size: 11px; }
        .online-dot { width: 7px; height: 7px; flex-shrink: 0; border-radius: 50%; background: #45d6a2; box-shadow: 0 0 10px #45d68850; }
        .signout-button { display: flex; align-items: center; gap: 10px; min-height: 42px; padding: 0 12px; border: 1px solid #293448; border-radius: 9px; background: transparent; color: #b6c4d8; cursor: pointer; text-align: left; }
        .signout-button:hover { border-color: #a74b5b; color: #ff9ba9; }
        button:disabled { opacity: .6; cursor: wait; }
        .student-main { width: min(100%,1500px); min-width: 0; margin: 0 auto; padding: 34px clamp(18px,4vw,54px) 20px; }
        .topbar,.section-heading { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
        .topbar { margin-bottom: 28px; }
        .topbar-actions { display: flex; gap: 10px; }
        .eyebrow { margin: 0 0 9px; color: #59afff; font-size: 10px; font-weight: 700; letter-spacing: 2px; }
        h1,h2,h3,p { overflow-wrap: anywhere; }
        h1 { margin: 0; font-size: clamp(25px,3vw,34px); letter-spacing: -1px; }
        .refresh-button,.text-button { display: flex; align-items: center; gap: 8px; padding: 10px 13px; border: 1px solid #293950; border-radius: 9px; background: #101b2b; color: #c9d8eb; cursor: pointer; }
        .refresh-button:hover,.text-button:hover { border-color: #398bd4; color: #77c1ff; }
        .welcome-panel { position: relative; display: flex; align-items: center; justify-content: space-between; gap: 24px; min-height: 300px; overflow: hidden; padding: clamp(25px,4vw,44px); border: 1px solid #24466c; border-radius: 20px; background: radial-gradient(ellipse at 80% 50%,#174a783f,transparent 43%),linear-gradient(115deg,#101f33,#0c1524 72%); }
        .welcome-content { position: relative; z-index: 1; max-width: 540px; }
        .welcome-tag { color: #80c6ff; font-size: 10px; font-weight: 700; letter-spacing: 1.8px; }
        .welcome-panel h2 { margin: 18px 0 12px; font-size: clamp(34px,4vw,49px); line-height: 1.08; letter-spacing: -1.8px; }
        .welcome-panel h2 span { color: #66b8ff; }
        .welcome-panel p { max-width: 430px; color: #a6b6cc; font-size: 14px; line-height: 1.8; }
        .primary-button { display: inline-flex; align-items: center; gap: 16px; margin-top: 14px; padding: 13px 17px; border: 1px solid #60b5ff; border-radius: 9px; background: #2184d7; color: white; text-decoration: none; font-size: 13px; font-weight: 700; transition: 160ms ease; }
        .primary-button:hover { background: #3199ed; transform: translateY(-1px); }
        .welcome-graphic { position: relative; width: 235px; height: 235px; flex-shrink: 0; margin-right: 20px; }
        .graphic-orbit { position: absolute; inset: 8px; border: 1px solid #3a8dd45c; border-radius: 50%; }
        .orbit-two { inset: 37px -15px; transform: rotate(-32deg); border-color: #53b7ff66; }
        .graphic-core { position: absolute; top: 50%; left: 50%; width: 96px; height: 96px; display: grid; place-items: center; transform: translate(-50%,-50%); border: 1px solid #4eafff; border-radius: 26px; background: linear-gradient(145deg,#173b60,#0c1b2e); box-shadow: 0 0 55px #218de544; color: #8bd0ff; font-size: 38px; font-weight: 800; }
        .graphic-node { position: absolute; display: grid; place-items: center; min-width: 43px; height: 36px; padding: 0 8px; border: 1px solid #315f88; border-radius: 9px; background: #122a42; color: #9bd4ff; font-size: 11px; font-weight: 700; }
        .node-one { top: 0; left: 95px; } .node-two { right: -15px; bottom: 40px; } .node-three { bottom: 20px; left: 5px; }
        .profile-strip { display: flex; align-items: center; gap: 15px; margin-top: 20px; padding: 17px 20px; border: 1px solid #1d2a3d; border-radius: 13px; background: #0d1625; }
        .profile-avatar { width: 46px; height: 46px; display: grid; place-items: center; overflow: hidden; border: 1px solid #2c6ba0; border-radius: 50%; background: #132d48; color: #8dceff; font-size: 20px; font-weight: 700; }
        .profile-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .profile-details { min-width: 0; display: grid; gap: 4px; } .profile-details strong { font-size: 14px; } .profile-details>span:last-child { overflow-wrap: anywhere; color: #91a4bc; font-size: 12px; }
        .muted-label { color: #6f829c; font-size: 9px; font-weight: 700; letter-spacing: 1.4px; } .session-status { margin-left: auto; white-space: nowrap; }
        .stats-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 13px; margin-top: 18px; }
        .stat-card { display: grid; gap: 9px; padding: 18px; border: 1px solid #202e42; border-radius: 13px; background: #0d1625; }
        .stat-icon { width: 35px; height: 35px; display: grid; place-items: center; border-radius: 10px; font-size: 17px; }
        .blue { background: #173a60; color: #7fc5ff; } .purple { background: #30234e; color: #c0a6ff; } .cyan { background: #143e43; color: #75e0e5; } .gold { background: #40351d; color: #f4ce78; }
        .stat-label { color: #93a6be; font-size: 11px; } .stat-card strong { font-size: 27px; } .stat-card small { color: #71849d; font-size: 10px; }
        .section-block { margin-top: 40px; } .section-heading { align-items: flex-end; margin-bottom: 19px; } .section-heading h2 { margin: 0; font-size: 22px; letter-spacing: -.5px; } .section-description { margin: 8px 0 0; color: #8fa1b8; font-size: 13px; line-height: 1.6; }
        .shortcut-grid,.resource-grid { display: grid; grid-template-columns: repeat(3,minmax(0,1fr)); gap: 14px; }
        .shortcut-card { min-width: 0; display: flex; flex-direction: column; align-items: flex-start; padding: 20px; border: 1px solid #202e42; border-radius: 14px; background: #0d1625; color: #eef5ff; text-decoration: none; transition: 160ms ease; }
        .shortcut-card:hover,.resource-card:hover { transform: translateY(-3px); border-color: #356b9d; background: #101d30; }
        .shortcut-icon { width: 42px; height: 42px; display: grid; place-items: center; margin-bottom: 17px; border-radius: 11px; font-size: 19px; font-weight: 700; }
        .shortcut-card strong { font-size: 14px; } .shortcut-card>span:not(.shortcut-icon) { margin-top: 9px; color: #96a8bf; font-size: 12px; line-height: 1.7; } .shortcut-card .card-action { margin-top: 18px!important; color: #71bcff!important; font-weight: 700; }
        .resources-heading { align-items: center; } .resource-count { flex-shrink: 0; padding: 8px 10px; border: 1px solid #243951; border-radius: 8px; color: #9eb5ce; font-size: 11px; }
        .resource-controls { display: flex; gap: 12px; margin-bottom: 17px; } .search-box { min-width: 0; flex: 1; display: flex; align-items: center; gap: 10px; padding: 0 13px; border: 1px solid #27374c; border-radius: 9px; background: #0d1625; color: #83a0bf; }
        .search-box input { width: 100%; min-width: 0; padding: 12px 0; border: 0; outline: 0; background: transparent; color: #f0f6ff; font: inherit; font-size: 12px; } .search-box:focus-within { border-color: #398bd4; }
        .category-select-label select { max-width: 220px; min-height: 43px; padding: 0 32px 0 12px; border: 1px solid #27374c; border-radius: 9px; background: #0d1625; color: #d8e5f5; font-size: 12px; }
        .resource-card { min-width: 0; display: flex; flex-direction: column; padding: 19px; border: 1px solid #202e42; border-radius: 13px; background: #0d1625; transition: 160ms ease; }
        .resource-top { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; } .resource-icon { width: 37px; height: 37px; display: grid; place-items: center; border: 1px solid #2b4c6c; border-radius: 10px; background: #122840; color: #82c8ff; font-size: 13px; font-weight: 700; }
        .resource-category { color: #82bdf1; font-size: 10px; font-weight: 700; } .resource-card h3 { margin: 19px 0 8px; font-size: 15px; } .resource-card p { flex: 1; margin: 0 0 17px; color: #96a8bf; font-size: 12px; line-height: 1.8; }
        .resource-link { display: inline-flex; align-items: center; justify-content: space-between; gap: 10px; padding-top: 13px; border-top: 1px solid #202e42; color: #78c0ff; text-decoration: none; font-size: 12px; font-weight: 700; } .resource-link:hover { color: #b5e0ff; }
        .empty-state { display: grid; justify-items: center; gap: 10px; padding: 38px 15px; border: 1px dashed #2a3c52; border-radius: 12px; color: #9aadc4; text-align: center; } .empty-state>span { font-size: 27px; } .empty-state strong { color: #e4eefc; } .empty-state p { margin: 0; font-size: 12px; }
        .empty-state button,.error-banner button { padding: 9px 12px; border: 1px solid #365c7e; border-radius: 8px; background: #13283e; color: #9bd1ff; cursor: pointer; }
        .error-banner { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-bottom: 18px; padding: 13px 15px; border: 1px solid #733a48; border-radius: 10px; background: #28151d; color: #ffc0c8; font-size: 13px; }
        .status-pill { padding: 6px 8px; border-radius: 7px; font-size: 9px; font-weight: 800; text-transform: uppercase; } .status-active { background: #123b32; color: #74e4bd; } .status-completed { background: #183957; color: #8dccff; } .status-pending { background: #40351d; color: #f4ce78; } .status-cancelled { background: #40232b; color: #ffa4b0; }
        .course-card { min-height: 290px; } .course-meta { display: grid; gap: 7px; margin: 0 0 17px; color: #96a8bf; font-size: 11px; text-transform: capitalize; }
        .progress-track { height: 7px; overflow: hidden; margin-top: auto; border-radius: 20px; background: #223149; } .progress-fill { height: 100%; border-radius: inherit; background: linear-gradient(90deg,#2184d7,#69c2ff); transition: width 250ms ease; }
        .progress-label { display: flex; justify-content: space-between; gap: 12px; margin-top: 9px; color: #9aadc4; font-size: 11px; } .progress-label strong { color: #80c6ff; } .course-enrolled-date { margin-top: 13px; color: #72849c; font-size: 10px; }
        .news-meta { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; margin: 0 0 15px; color: #71849d; font-size: 10px; } .text-button { white-space: nowrap; } .mini-spinner { width: 22px; height: 22px; border: 2px solid #24334b; border-top-color: #48a6ff; border-radius: 50%; animation: spin .8s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }
        .student-footer { display: flex; align-items: center; justify-content: space-between; gap: 14px; margin-top: 48px; padding: 20px 0; border-top: 1px solid #1b293b; color: #72849c; font-size: 11px; } .student-footer a { color: #8ecbff; text-decoration: none; } .student-footer a:hover { text-decoration: underline; }
        .sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
        @media(max-width:1050px) { .student-sidebar { width: 210px; } .welcome-graphic { width: 180px; height: 180px; margin-right: 0; } .graphic-core { width: 76px; height: 76px; } .shortcut-grid,.resource-grid { grid-template-columns: repeat(2,minmax(0,1fr)); } .stats-grid { grid-template-columns: repeat(2,minmax(0,1fr)); } }
        @media(max-width:720px) { .student-app { display: block; } .student-sidebar { width: 100%; min-height: auto; padding: 14px; border-right: 0; border-bottom: 1px solid #1b2638; } .brand { padding: 0 3px 12px; } .nav-heading,.sidebar-bottom { display: none; } .student-nav { display: flex; gap: 7px; overflow-x: auto; padding-bottom: 3px; } .nav-link { flex-shrink: 0; min-height: 39px; gap: 7px; padding: 0 10px; font-size: 11px; } .nav-icon { width: auto; font-size: 15px; } .nav-arrow { display: none; } .student-main { padding: 23px 15px 12px; } .topbar { align-items: flex-start; } .refresh-button { padding: 10px; } .refresh-button>span:last-child { display: none; } .welcome-panel { min-height: auto; padding: 26px 22px; } .welcome-graphic { display: none; } .profile-strip { padding: 13px; } .session-status { display: none; } .shortcut-grid,.resource-grid { grid-template-columns: 1fr; } .resource-controls { flex-direction: column; } .category-select-label select { width: 100%; max-width: none; } .section-heading { align-items: flex-start; } .resource-count { font-size: 10px; } .student-footer { align-items: flex-start; flex-direction: column; } .stats-grid { grid-template-columns: repeat(2,minmax(0,1fr)); } }
      `}</style>
    </main>
  );
}
