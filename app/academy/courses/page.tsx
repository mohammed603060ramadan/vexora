"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/browser";

type Course = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category: string;
  difficulty: string | null;
  course_type: string | null;
  estimated_hours: number | null;
};

const categories = [
  "All",
  "Cybersecurity",
  "Software Development",
  "Networks & Infrastructure",
  "Data Analytics",
  "Digital Marketing",
];

const categoryImages: Record<string, string> = {
  Cybersecurity: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=900&q=80",
  "Software Development": "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
  "Networks & Infrastructure": "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
  "Data Analytics": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
  "Digital Marketing": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80",
};

export default function AcademyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const requestedCategory = new URLSearchParams(window.location.search).get("category");
    if (requestedCategory && categories.includes(requestedCategory)) {
      // URL-driven initial filter is intentional; the value comes from browser navigation.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCategory(requestedCategory);
    }
  }, []);

  useEffect(() => {
    let active = true;
    async function load() {
      const { data, error: queryError } = await supabase
        .from("courses")
        .select("id,title,slug,description,category,difficulty,course_type,estimated_hours")
        .eq("status", "published")
        .order("created_at", { ascending: false });
      if (!active) return;
      if (queryError) setError("Published courses could not be loaded. Please refresh and try again.");
      else setCourses((data ?? []) as Course[]);
      setLoading(false);
    }
    void load();
    return () => { active = false; };
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return courses.filter((course) =>
      (category === "All" || course.category === category) &&
      (!q || [course.title, course.category, course.description, course.difficulty]
        .some((value) => value?.toLowerCase().includes(q)))
    );
  }, [courses, category, search]);

  return (
    <main className="min-h-screen bg-[#070b12] px-5 py-12 text-white sm:px-8 lg:py-16">
      <div className="mx-auto max-w-7xl">
        <Link href="/academy" className="inline-flex items-center gap-2 text-sm text-blue-300 transition hover:text-white">← Back to VEXORA Academy</Link>
        <header className="mt-8 rounded-3xl border border-blue-400/15 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,.16),transparent_55%),#0b111b] p-7 sm:p-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-300">VEXORA / Learning</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">Course Directory</h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">Browse published courses across VEXORA’s technology and digital disciplines. Course categories are managed by the administration team.</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-[1fr_auto]">
            <input value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder="Search courses, skills or categories..." aria-label="Search courses" className="w-full rounded-xl border border-white/10 bg-[#080d16] px-4 py-3 text-sm outline-none transition focus:border-blue-400/50" />
            <span className="flex items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-sm text-slate-400">{filtered.length} courses</span>
          </div>
        </header>

        <div className="mt-7 flex gap-2 overflow-x-auto pb-2" aria-label="Course categories">
          {categories.map((item) => (
            <button key={item} type="button" onClick={() => setCategory(item)} aria-pressed={category === item} className={`shrink-0 rounded-full border px-4 py-2.5 text-sm transition ${category === item ? "border-blue-300/40 bg-blue-400/10 text-blue-100" : "border-white/10 text-slate-400 hover:text-white"}`}>
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="py-20 text-center text-sm text-slate-400">Loading published courses...</div>
        ) : error ? (
          <div role="alert" className="mt-8 rounded-2xl border border-rose-400/20 bg-rose-400/5 p-6 text-sm text-rose-200">Unable to load courses: {error}</div>
        ) : filtered.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-white/15 p-12 text-center">
            <h2 className="text-xl font-semibold">No published courses found</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-400">Try another category or search term. Administrators can add courses and publish them from the Academy Management page.</p>
            <button type="button" onClick={() => { setCategory("All"); setSearch(""); }} className="mt-5 rounded-xl border border-white/10 px-4 py-2.5 text-sm hover:bg-white/5">Clear filters</button>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((course) => (
              <article key={course.id} className="group overflow-hidden rounded-2xl border border-white/[0.09] bg-white/[0.025] transition hover:-translate-y-1 hover:border-blue-400/30">
                <div className="relative h-44 overflow-hidden bg-[#0b111b]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={categoryImages[course.category] || categoryImages.Cybersecurity} alt="" loading="lazy" className="h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/60 px-3 py-1.5 text-xs text-blue-100 backdrop-blur">{course.category}</span>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 text-xs text-slate-400">
                    {course.difficulty && <span className="rounded-full border border-white/10 px-2.5 py-1">{course.difficulty}</span>}
                    {course.course_type && <span className="rounded-full border border-white/10 px-2.5 py-1">{course.course_type.replace("_", " ")}</span>}
                    {course.estimated_hours !== null && <span className="rounded-full border border-white/10 px-2.5 py-1">{course.estimated_hours} hours</span>}
                  </div>
                  <h2 className="mt-4 text-xl font-semibold leading-snug">{course.title}</h2>
                  <p className="mt-3 min-h-16 text-sm leading-6 text-slate-400">{course.description || "Course details will be announced soon."}</p>
                  <Link href="/academy#programs" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-300 hover:text-white">Open Academy catalogue <span aria-hidden="true">↗</span></Link>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <div><h2 className="font-semibold">Looking for a guided learning path?</h2><p className="mt-2 text-sm text-slate-400">Return to the Academy to explore learning formats and registration information.</p></div>
          <Link href="/academy" className="rounded-xl bg-blue-500 px-5 py-3 text-sm font-semibold transition hover:bg-blue-400">Explore Academy</Link>
        </div>
      </div>
    </main>
  );
}
