
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/browser";

type Course = {
  id: string;
  title: string;
  slug: string;
  subtitle: string | null;
  description: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  course_type: "online" | "in_person" | "hybrid";
  price: number | null;
  currency: string | null;
  estimated_hours: number | null;
  price: number | null;
  currency: string | null;
  cover_image_url: string | null;
  promo_video_url: string | null;
};

type Section = {
  id: string;
  title: string;
  description: string | null;
  sequence_number: number;
};

type Lesson = {
  id: string;
  section_id: string;
  title: string;
  description: string | null;
  lesson_type: "video" | "article" | "file" | "live";
  duration_minutes: number | null;
  is_preview: boolean;
  sequence_number: number;
  status: string;
};

type FilteredSection = Section & {
  filteredLessons?: Lesson[];
};

const difficultyLabels: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
};

const typeLabels: Record<string, string> = {
  online: "Online",
  in_person: "In person",
  hybrid: "Hybrid learning",
};

const lessonTypeLabels: Record<string, string> = {
  video: "Video",
  article: "Article",
  file: "Resource",
  live: "Live session",
};

function formatDuration(minutes: number) {
  const safeMinutes = Math.max(0, Math.floor(minutes));
  const hours = Math.floor(safeMinutes / 60);
  const remainingMinutes = safeMinutes % 60;

  if (hours === 0) return `${remainingMinutes} min`;
  if (remainingMinutes === 0) return `${hours}h`;

  return `${hours}h ${remainingMinutes}m`;
}

function CourseDetailsContent() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [course, setCourse] = useState<Course | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [accessLoading, setAccessLoading] = useState(false);
  const [accessError, setAccessError] = useState("");
  const [accessResult, setAccessResult] = useState<{ code: string; status: string; message: string } | null>(null);
  const [hasCourseAccess, setHasCourseAccess] = useState(false);

  const loadCourse = useCallback(
    async (isRefresh = false) => {
      if (!slug) {
        setCourse(null);
        setSections([]);
        setLessons([]);
        setLoading(false);
        setRefreshing(false);
        return;
      }

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      try {
        const { data: authData } = await supabase.auth.getUser();
        const signedInUser = authData.user;

        let { data: courseData, error: courseError } = await supabase
          .from("courses")
          .select("id, title, slug, subtitle, description, difficulty, course_type, price, currency, estimated_hours, cover_image_url, promo_video_url")
          .eq("slug", slug)
          .eq("status", "published")
          .maybeSingle();

        if (courseError && /cover_image_url|promo_video_url|column .* does not exist|schema cache/i.test(courseError.message)) {
          const fallback = await supabase.from("courses")
            .select("id, title, slug, subtitle, description, difficulty, course_type, price, currency, estimated_hours")
            .eq("slug", slug)
            .eq("status", "published")
            .maybeSingle();
          courseData = fallback.data ? { ...fallback.data, cover_image_url: null, promo_video_url: null } : null;
          courseError = fallback.error;
        }
        if (courseError) throw courseError;

        if (!courseData) {
          setCourse(null);
          setSections([]);
          setLessons([]);
          setHasCourseAccess(false);
          setLastUpdated(new Date());
          return;
        }

        const {
          data: sectionData,
          error: sectionError,
        } = await supabase
          .from("course_sections")
          .select("id, title, description, sequence_number")
          .eq("course_id", courseData.id)
          .order("sequence_number", { ascending: true });

        if (sectionError) throw sectionError;

        const loadedSections = (sectionData ?? []) as Section[];
        const sectionIds = loadedSections.map((section) => section.id);

        let loadedLessons: Lesson[] = [];

        if (sectionIds.length > 0) {
          const {
            data: lessonData,
            error: lessonError,
          } = await supabase
            .from("lessons")
            .select(
              "id, section_id, title, description, lesson_type, duration_minutes, is_preview, sequence_number, status"
            )
            .in("section_id", sectionIds)
            .eq("status", "published")
            .order("sequence_number", { ascending: true });

          if (lessonError) throw lessonError;

          loadedLessons = (lessonData ?? []) as Lesson[];
        }

        if (signedInUser) {
          const { data: enrollment, error: enrollmentError } = await supabase
            .from("enrollments")
            .select("id,status")
            .eq("course_id", courseData.id)
            .eq("student_id", signedInUser.id)
            .in("status", ["active", "completed"])
            .maybeSingle();
          if (enrollmentError) throw enrollmentError;
          setHasCourseAccess(Boolean(enrollment));
        } else {
          setHasCourseAccess(false);
        }

        setCourse(courseData as Course);
        setSections(loadedSections);
        setLessons(loadedLessons);
        setLastUpdated(new Date());

        setExpandedSections((current) => {
          if (current.length > 0) {
            return current.filter((id) =>
              loadedSections.some((section) => section.id === id)
            );
          }

          return loadedSections.length > 0
            ? [loadedSections[0].id]
            : [];
        });
      } catch (cause) {
        console.error("Course details loading failed:", cause);

        setError(
          "We couldn't load this course. Check your connection and database permissions, then try again."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [slug]
  );

  useEffect(() => {
    // Initial loading state is already true.
    // This suppresses the lint rule for this asynchronous data-loading effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadCourse();
  }, [loadCourse]);

  const filteredSections = useMemo<FilteredSection[]>(() => {
    const term = search.trim().toLowerCase();

    if (!term) return sections;

    return sections
      .map((section): FilteredSection => {
        const sectionLessons = lessons.filter(
          (lesson) => lesson.section_id === section.id
        );

        const matchingLessons = sectionLessons.filter(
          (lesson) =>
            `${lesson.title} ${lesson.description ?? ""}`
              .toLowerCase()
              .includes(term)
        );

        const sectionMatches =
          `${section.title} ${section.description ?? ""}`
            .toLowerCase()
            .includes(term);

        return {
          ...section,
          filteredLessons: sectionMatches
            ? sectionLessons
            : matchingLessons,
        };
      })
      .filter(
        (section) =>
          `${section.title} ${section.description ?? ""}`
            .toLowerCase()
            .includes(term) ||
          (section.filteredLessons?.length ?? 0) > 0
      );
  }, [sections, lessons, search]);

  const totalMinutes = useMemo(
    () =>
      lessons.reduce(
        (total, lesson) => total + (lesson.duration_minutes ?? 0),
        0
      ),
    [lessons]
  );

  const formatPrice = () => {
    if (course?.price == null || Number(course.price) === 0) {
      return "Free";
    }

    try {
      return new Intl.NumberFormat("en", {
        style: "currency",
        currency: course.currency || "USD",
        maximumFractionDigits: 2,
      }).format(Number(course.price));
    } catch {
      return `${Number(course.price).toLocaleString()} ${
        course.currency ?? ""
      }`.trim();
    }
  };

  async function requestAccess() {
    if (!course) return;
    setAccessLoading(true);
    setAccessError("");
    try {
      const response = await fetch("/api/course-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });
      const payload = await response.json() as { request?: { purchase_code?: string; status?: string }; message?: string; error?: string };
      if (response.status === 401) {
        window.location.assign(`/login?next=${encodeURIComponent(window.location.pathname)}`);
        return;
      }
      if (!response.ok || !payload.request) throw new Error(payload.error || "Unable to request course access.");
      setAccessResult({ code: payload.request.purchase_code || "CODE PENDING", status: payload.request.status || "pending", message: payload.message || "Access will be enabled after administrator approval." });
    } catch (cause) {
      setAccessError(cause instanceof Error ? cause.message : "Unable to request course access.");
    } finally {
      setAccessLoading(false);
    }
  }

  const toggleSection = (sectionId: string) => {
    setExpandedSections((current) =>
      current.includes(sectionId)
        ? current.filter((id) => id !== sectionId)
        : [...current, sectionId]
    );
  };

  const expandAll = () => {
    setExpandedSections(filteredSections.map((section) => section.id));
  };

  const collapseAll = () => {
    setExpandedSections([]);
  };

  return (
    <main className="min-h-screen bg-[#080b10] text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080b10]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link
            href="/"
            className="shrink-0 text-xl font-bold tracking-[0.22em]"
          >
            VEXORA<span className="text-[#45a5ff]">.</span>
            <span className="mt-1 block text-[9px] font-medium tracking-[0.28em] text-white/45">
              TECHNOLOGY ACADEMY
            </span>
          </Link>

          <nav className="flex items-center gap-3">
            <Link
              href="/academy"
              className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/75 transition hover:border-[#45a5ff] hover:text-white"
            >
              All courses
            </Link>

            <Link
              href="/login"
              className="hidden rounded-full bg-[#1687ff] px-4 py-2 text-sm font-semibold transition hover:bg-[#45a5ff] sm:inline-flex"
            >
              Sign in
            </Link>
          </nav>
        </div>
      </header>

      <section className="relative overflow-hidden border-b border-white/10">
        {course?.cover_image_url && <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-20" style={{ backgroundImage: `url("${course.cover_image_url}")` }} />}
        {course?.promo_video_url && <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-15"><video className="h-full w-full object-cover" src={course.promo_video_url} autoPlay muted loop playsInline /></div>}
        <div className="pointer-events-none absolute -right-20 -top-36 h-96 w-96 rounded-full bg-[#087bff]/15 blur-[110px]" />
        <div className="pointer-events-none absolute -bottom-48 left-0 h-80 w-80 rounded-full bg-[#087bff]/10 blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <Link
            href="/academy"
            className="text-sm text-[#79bdff] transition hover:text-white"
          >
            ← Back to Academy
          </Link>

          {loading ? (
            <div
              className="mt-10 max-w-3xl animate-pulse"
              aria-live="polite"
            >
              <div className="h-4 w-40 rounded bg-white/10" />
              <div className="mt-6 h-12 max-w-2xl rounded bg-white/10" />
              <div className="mt-4 h-5 max-w-xl rounded bg-white/10" />
              <div className="mt-8 flex gap-3">
                <div className="h-9 w-28 rounded-full bg-white/10" />
                <div className="h-9 w-28 rounded-full bg-white/10" />
              </div>
            </div>
          ) : error ? (
            <div
              role="alert"
              className="mt-10 max-w-2xl rounded-2xl border border-red-400/20 bg-red-400/5 p-6"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-red-300">
                Loading error
              </p>

              <h1 className="mt-3 text-2xl font-semibold">
                Unable to load course
              </h1>

              <p className="mt-3 text-sm leading-7 text-white/65">
                {error}
              </p>

              <button
                type="button"
                disabled={refreshing}
                onClick={() => void loadCourse(true)}
                className="mt-5 rounded-full bg-[#1687ff] px-5 py-2.5 text-sm font-semibold transition hover:bg-[#45a5ff] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {refreshing ? "Retrying..." : "Try again"}
              </button>
            </div>
          ) : !course ? (
            <div className="mt-10 max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#45a5ff]">
                Course unavailable
              </p>

              <h1 className="mt-4 text-3xl font-bold sm:text-5xl">
                This course could not be found.
              </h1>

              <p className="mt-5 leading-7 text-white/60">
                It may not be published yet, or the link may be incorrect.
              </p>

              <Link
                href="/academy"
                className="mt-7 inline-flex rounded-full bg-[#1687ff] px-6 py-3 text-sm font-semibold transition hover:bg-[#45a5ff]"
              >
                Browse courses
              </Link>
            </div>
          ) : (
            <>
              <p className="mt-9 text-sm font-semibold uppercase tracking-[0.25em] text-[#45a5ff]">
                VEXORA Academy / Course Details
              </p>

              <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
                {course.title}
              </h1>

              {course.subtitle && (
                <p className="mt-5 max-w-3xl text-lg leading-8 text-white/65">
                  {course.subtitle}
                </p>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-[#45a5ff]/30 bg-[#1687ff]/10 px-4 py-2 text-sm text-[#9dceff]">
                  {difficultyLabels[course.difficulty] ??
                    course.difficulty}
                </span>

                <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70">
                  {typeLabels[course.course_type] ?? course.course_type}
                </span>

                {course.estimated_hours != null && (
                  <span className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-white/70">
                    {course.estimated_hours} learning hours
                  </span>
                )}
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                    Course price
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    {formatPrice()}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                    Curriculum
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    {lessons.length}{" "}
                    <span className="text-base font-normal text-white/50">
                      lessons
                    </span>
                  </p>
                </div>

                {totalMinutes > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                      Total lesson time
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                      {formatDuration(totalMinutes)}
                    </p>
                  </div>
                )}
              </div>

              {lastUpdated && (
                <p className="mt-7 text-xs text-white/35">
                  Data loaded at{" "}
                  {lastUpdated.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              )}
            </>
          )}
        </div>
      </section>

      {!loading && !error && course && (
        <section className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[minmax(0,1fr)_330px] lg:py-16">
          <div className="min-w-0">
            {hasCourseAccess ? (
            <>
            <section>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#45a5ff]">
                Course overview
              </p>

              <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                About this course
              </h2>

              <p className="mt-5 whitespace-pre-line text-base leading-8 text-white/65">
                {course.description ||
                  "Course information will be available soon."}
              </p>
            </section>

            <section className="mt-14">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#45a5ff]">
                    Learning path
                  </p>

                  <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
                    Course curriculum
                  </h2>

                  <p className="mt-2 text-sm text-white/45">
                    {sections.length} sections · {lessons.length} published
                    lessons
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={expandAll}
                    className="rounded-full border border-white/15 px-3 py-2 text-xs text-white/65 transition hover:border-[#45a5ff] hover:text-white"
                  >
                    Expand all
                  </button>

                  <button
                    type="button"
                    onClick={collapseAll}
                    className="rounded-full border border-white/15 px-3 py-2 text-xs text-white/65 transition hover:border-[#45a5ff] hover:text-white"
                  >
                    Collapse all
                  </button>
                </div>
              </div>

              <label htmlFor="lesson-search" className="sr-only">
                Search course curriculum
              </label>

              <input
                id="lesson-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search sections and lessons..."
                className="mt-7 w-full rounded-xl border border-white/10 bg-white/[0.035] px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#45a5ff]/60"
              />

              {sections.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm leading-7 text-white/55">
                  The curriculum has not been published yet.
                </div>
              ) : filteredSections.length === 0 ? (
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/55">
                  No sections or lessons match your search.
                </div>
              ) : (
                <div className="mt-6 space-y-4">
                  {filteredSections.map((section, index) => {
                    const sectionLessons = lessons.filter(
                      (lesson) => lesson.section_id === section.id
                    );

                    const visibleLessons = search.trim()
                      ? section.filteredLessons ?? sectionLessons
                      : sectionLessons;

                    const isExpanded = expandedSections.includes(
                      section.id
                    );

                    return (
                      <article
                        key={section.id}
                        className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]"
                      >
                        <button
                          type="button"
                          onClick={() => toggleSection(section.id)}
                          aria-expanded={isExpanded}
                          className="flex w-full items-center gap-4 px-4 py-5 text-left transition hover:bg-white/[0.025] sm:px-6"
                        >
                          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#45a5ff]/25 bg-[#1687ff]/10 text-sm font-bold text-[#79bdff]">
                            {String(index + 1).padStart(2, "0")}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="block font-semibold">
                              {section.title}
                            </span>

                            {section.description && (
                              <span className="mt-1 block text-sm leading-6 text-white/45">
                                {section.description}
                              </span>
                            )}

                            <span className="mt-2 block text-xs text-white/40">
                              {visibleLessons.length} lessons shown
                            </span>
                          </span>

                          <span
                            aria-hidden="true"
                            className="shrink-0 text-lg text-[#79bdff]"
                          >
                            {isExpanded ? "−" : "+"}
                          </span>
                        </button>

                        {isExpanded && (
                          <div className="border-t border-white/10">
                            {visibleLessons.length === 0 ? (
                              <p className="px-6 py-5 text-sm text-white/45">
                                No published lessons in this section yet.
                              </p>
                            ) : (
                              <ul className="divide-y divide-white/[0.07]">
                                {visibleLessons.map((lesson) => (
                                  <li
                                    key={lesson.id}
                                    className="flex items-center gap-3 px-4 py-4 sm:px-6"
                                  >
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-[#79bdff]">
                                      {lesson.lesson_type === "video"
                                        ? "▶"
                                        : lesson.lesson_type === "article"
                                          ? "≡"
                                          : lesson.lesson_type === "file"
                                            ? "↓"
                                            : "◷"}
                                    </span>

                                    <span className="min-w-0 flex-1">
                                      <span className="block text-sm font-medium">
                                        {lesson.title}
                                      </span>

                                      {lesson.description && (
                                        <span className="mt-1 block text-xs leading-5 text-white/45">
                                          {lesson.description}
                                        </span>
                                      )}

                                      <span className="mt-1 block text-xs text-white/35">
                                        {lessonTypeLabels[
                                          lesson.lesson_type
                                        ] ?? lesson.lesson_type}
                                      </span>
                                    </span>

                                    <span className="shrink-0 text-right">
                                      {lesson.is_preview && (
                                        <span className="block text-xs font-medium text-[#79bdff]">
                                          Preview
                                        </span>
                                      )}

                                      {lesson.duration_minutes != null && (
                                        <span className="mt-1 block text-xs text-white/40">
                                          {formatDuration(
                                            lesson.duration_minutes
                                          )}
                                        </span>
                                      )}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        )}
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
            </>
            ) : (
              <section className="relative overflow-hidden rounded-3xl border border-cyan-300/15 bg-gradient-to-br from-[#10283a] via-[#0b1420] to-[#080d15] p-7 sm:p-10">
                <div aria-hidden="true" className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl" />
                <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.08] text-3xl text-cyan-100">⌁</div>
                <p className="relative mt-5 text-xs font-bold uppercase tracking-[0.22em] text-cyan-200">Protected course content</p>
                <h2 className="relative mt-3 text-2xl font-semibold text-white sm:text-3xl">Your next chapter is waiting.</h2>
                <p className="relative mt-3 max-w-xl text-sm leading-7 text-slate-300">The course overview and preview media are available now. Course sections and lessons unlock only after VEXORA reviews your request and grants access.</p>
                <div className="relative mt-6 flex flex-wrap gap-3 text-xs text-slate-400"><span className="rounded-full border border-white/10 px-3 py-2">Private curriculum</span><span className="rounded-full border border-white/10 px-3 py-2">Administrator approval</span><span className="rounded-full border border-white/10 px-3 py-2">Account-linked access</span></div>
              </section>
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-white/10 bg-gradient-to-b from-[#111c2c] to-[#0b1018] p-6 sm:p-7 lg:sticky lg:top-24">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#79bdff]">
              Start learning
            </p>

            <h2 className="mt-4 text-2xl font-bold">
              Ready to build your skills?
            </h2>

            <p className="mt-3 text-sm leading-7 text-white/55">
              {hasCourseAccess
                ? "Your access is active. Explore the full curriculum and continue your learning journey."
                : "Request your course access reference code. The full curriculum unlocks after an administrator approves your request."}
            </p>

            {hasCourseAccess ? (
              <Link href="/student" className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:brightness-110">✓ Open my courses</Link>
            ) : (
              <button
                type="button"
                onClick={() => void requestAccess()}
                disabled={accessLoading}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-5 py-3.5 text-sm font-semibold transition hover:brightness-110 disabled:opacity-50"
              >
                {accessLoading ? "Creating request…" : "Request purchase / access code"}
              </button>
            )}
            {accessError && <p role="alert" className="mt-3 rounded-xl border border-rose-300/20 bg-rose-300/[0.06] p-3 text-sm text-rose-200">{accessError}</p>}
            {accessResult && <div role="status" className="mt-4 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] p-4"><p className="text-xs font-bold uppercase tracking-wider text-cyan-200">Your reference code</p><div className="mt-2 flex items-center justify-between gap-2"><code className="font-bold tracking-wider">{accessResult.code}</code><button type="button" onClick={() => void navigator.clipboard?.writeText(accessResult.code)} className="rounded-lg border border-white/10 px-2 py-1 text-xs">Copy</button></div><p className="mt-2 text-sm leading-6 text-slate-300">{accessResult.message}</p><p className="mt-2 text-xs uppercase tracking-wider text-amber-200">Status: {accessResult.status}</p></div>}

            <div className="mt-7 space-y-4 border-t border-white/10 pt-5">
              <div className="flex items-start gap-3">
                <span className="text-[#79bdff]">✓</span>
                <p className="text-sm leading-6 text-white/55">
                  Published course curriculum
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#79bdff]">✓</span>
                <p className="text-sm leading-6 text-white/55">
                  Course details and lesson duration
                </p>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-[#79bdff]">✓</span>
                <p className="text-sm leading-6 text-white/55">
                  Enrollment access through your account
                </p>
              </div>
            </div>

            <p className="mt-6 text-xs leading-6 text-white/35">
              Enrollment, lesson access, assessments, and certificates depend
              on account permissions and available features.
            </p>
          </aside>
        </section>
      )}

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} VEXORA Technology</span>

          <Link
            href="/academy"
            className="transition hover:text-white/75"
          >
            Explore Academy
          </Link>
        </div>
      </footer>
    </main>
  );
}

export default function CourseDetailsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#080b10] px-6 py-24 text-white">
          <p className="animate-pulse text-white/60" aria-live="polite">
            Loading course...
          </p>
        </main>
      }
    >
      <CourseDetailsContent />
    </Suspense>
  );
}
