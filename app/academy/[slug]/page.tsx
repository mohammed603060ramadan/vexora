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
  estimated_hours: number | null;
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
  const [enrollmentLoading, setEnrollmentLoading] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState("");
  const [enrollmentMessage, setEnrollmentMessage] = useState("");
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
        const { data: authData, error: authError } =
          await supabase.auth.getUser();

        if (authError) throw authError;

        const signedInUser = authData.user;

        // Use columns confirmed in the current Academy schema.
        const courseQuery = await supabase
          .from("courses")
          .select(
            "id, title, slug, description, difficulty, course_type, estimated_hours, price, cover_image_url, promo_video_url"
          )
          .eq("slug", slug)
          .eq("status", "published")
          .maybeSingle();

        let courseData = courseQuery.data;
        let courseError = courseQuery.error;

        // Keep course details available while the optional media migration is pending.
        if (courseError && /cover_image_url|promo_video_url|does not exist/i.test(courseError.message)) {
          const fallbackQuery = await supabase
            .from("courses")
            .select("id, title, slug, description, difficulty, course_type, estimated_hours, price")
            .eq("slug", slug)
            .eq("status", "published")
            .maybeSingle();

          courseData = fallbackQuery.data
            ? { ...fallbackQuery.data, cover_image_url: null, promo_video_url: null }
            : null;
          courseError = fallbackQuery.error;
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

        let canAccess = Number(courseData.price ?? 0) === 0;

        if (signedInUser) {
          const { data: enrollment, error: enrollmentError } =
            await supabase
              .from("enrollments")
              .select("id, status")
              .eq("course_id", courseData.id)
              .eq("student_id", signedInUser.id)
              .in("status", ["active", "completed"])
              .maybeSingle();

          if (enrollmentError) throw enrollmentError;

          canAccess = Boolean(enrollment);
        }

        setHasCourseAccess(canAccess);

        // Optional media fields fall back to null until the schema migration is applied.
        const normalizedCourse: Course = {
          id: courseData.id,
          title: courseData.title,
          slug: courseData.slug,
          subtitle: null,
          description: courseData.description,
          difficulty: courseData.difficulty,
          course_type: courseData.course_type,
          estimated_hours: courseData.estimated_hours,
          cover_image_url: courseData.cover_image_url ?? null,
          promo_video_url: courseData.promo_video_url ?? null,
        };

        setCourse(normalizedCourse);

        // Do not request curriculum data for users without active enrollment.
        if (!canAccess) {
          setSections([]);
          setLessons([]);
          setLastUpdated(new Date());
          return;
        }

        const { data: lessonData, error: lessonError } = await supabase
          .from("course_lessons")
          .select("id, title, content, video_url, sort_order, is_published")
          .eq("course_id", courseData.id)
          .eq("is_published", true)
          .order("sort_order", { ascending: true });

        if (lessonError) throw lessonError;

        const loadedLessons: Lesson[] = (lessonData ?? []).map((lesson, index): Lesson => ({
          id: lesson.id,
          section_id: courseData.id,
          title: lesson.title,
          description: lesson.content,
          lesson_type: lesson.video_url ? "video" : "article",
          duration_minutes: null,
          is_preview: false,
          sequence_number: lesson.sort_order ?? index + 1,
          status: "published",
        }));

        const loadedSections: Section[] = loadedLessons.length > 0
          ? [{
              id: courseData.id,
              title: "Course curriculum",
              description: null,
              sequence_number: 1,
            }]
          : [];

        setSections(loadedSections);
        setLessons(loadedLessons);
        setLastUpdated(new Date());

        setExpandedSections((current) => {
          const validCurrent = current.filter((id) =>
            loadedSections.some((section) => section.id === id)
          );

          if (validCurrent.length > 0) return validCurrent;

          return loadedSections.length > 0 ? [loadedSections[0].id] : [];
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

        const matchingLessons = sectionLessons.filter((lesson) =>
          `${lesson.title} ${lesson.description ?? ""}`
            .toLowerCase()
            .includes(term)
        );

        const sectionMatches = `${section.title} ${
          section.description ?? ""
        }`
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

  async function enrollFreeCourse() {
    if (!course || enrollmentLoading) return;
    setEnrollmentLoading(true);
    setEnrollmentError("");
    setEnrollmentMessage("");
    try {
      const response = await fetch("/api/course-enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId: course.id }),
      });
      const payload = await response.json() as { message?: string; error?: string };
      if (response.status === 401) {
        const next = window.location.pathname + window.location.search;
        window.location.assign("/login?next=" + encodeURIComponent(next));
        return;
      }
      if (!response.ok) throw new Error(payload.error || "Free enrollment could not be completed.");
      setHasCourseAccess(true);
      setEnrollmentMessage(payload.message || "You are enrolled. Start learning now.");
      await loadCourse(true);
    } catch (cause) {
      setEnrollmentError(cause instanceof Error ? cause.message : "Free enrollment could not be completed.");
    } finally {
      setEnrollmentLoading(false);
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
            <div className="mt-10 max-w-3xl animate-pulse" aria-live="polite">
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
              <p className="mt-3 text-sm leading-7 text-white/65">{error}</p>
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

              {course.description && (
                <p className="mt-5 max-w-3xl text-lg leading-8 text-white/65">
                  {course.description}
                </p>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                <span className="rounded-full border border-[#45a5ff]/30 bg-[#1687ff]/10 px-4 py-2 text-sm text-[#9dceff]">
                  {difficultyLabels[course.difficulty] ?? course.difficulty}
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
                  <p className="mt-1 text-2xl font-bold">{formatPrice()}</p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-white/40">
                    Curriculum
                  </p>
                  <p className="mt-1 text-2xl font-bold">
                    {hasCourseAccess ? lessons.length : "—"}{" "}
                    <span className="text-base font-normal text-white/50">
                      lessons
                    </span>
                  </p>
                </div>

                {hasCourseAccess && totalMinutes > 0 && (
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
              <Link href="/student" className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:brightness-110">
                ✓ Open my courses
              </Link>
            ) : (
              <button type="button" onClick={() => void enrollFreeCourse()} disabled={enrollmentLoading} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-600 px-5 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-50">
                {enrollmentLoading ? "Enrolling..." : "Enroll for free"}
              </button>
            )}
            {enrollmentError && <p role="alert" className="mt-3 rounded-xl border border-rose-300/20 bg-rose-300/[0.06] p-3 text-sm text-rose-200">{enrollmentError}</p>}
            {enrollmentMessage && <p role="status" className="mt-3 rounded-xl border border-emerald-300/20 bg-emerald-300/[0.06] p-3 text-sm text-emerald-100">{enrollmentMessage}</p>}
            <div className="mt-7 space-y-4 border-t border-white/10 pt-5">
              <div className="flex items-start gap-3"><span className="text-[#79bdff]">✓</span><p className="text-sm leading-6 text-white/55">Free published course curriculum</p></div>
              <div className="flex items-start gap-3"><span className="text-[#79bdff]">✓</span><p className="text-sm leading-6 text-white/55">Course details and lesson duration</p></div>
              <div className="flex items-start gap-3"><span className="text-[#79bdff]">✓</span><p className="text-sm leading-6 text-white/55">Direct enrollment with your account</p></div>
            </div>
            <p className="mt-6 text-xs leading-6 text-white/35">All VEXORA Academy courses are free. Sign in to save your enrollment and track your learning progress.</p>
          </aside>
        </section>
      )}

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-7 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© {new Date().getFullYear()} VEXORA Technology</span>
          <Link href="/academy" className="transition hover:text-white/75">
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