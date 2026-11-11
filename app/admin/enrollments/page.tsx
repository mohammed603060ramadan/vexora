"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/browser";

type Enrollment = {
  id: string;
  student_id: string;
  course_id: string;
  status: "pending" | "active" | "completed" | "cancelled";
  progress_percent: number;
  enrolled_at: string;
};
type Course = { id: string; title: string; slug: string };
type Profile = { id: string; full_name: string | null };

const statusClass: Record<Enrollment["status"], string> = {
  pending: "border-amber-400/20 bg-amber-400/10 text-amber-200",
  active: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
  completed: "border-sky-400/20 bg-sky-400/10 text-sky-200",
  cancelled: "border-rose-400/20 bg-rose-400/10 text-rose-200",
};

export default function AdminCourseEnrollmentsPage() {
  const [items, setItems] = useState<Enrollment[]>([]);
  const [courses, setCourses] = useState<Record<string, Course>>({});
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    const { data, error: queryError } = await supabase
      .from("enrollments")
      .select("id,student_id,course_id,status,progress_percent,enrolled_at")
      .order("enrolled_at", { ascending: false });
    if (queryError) {
      setError(queryError.message);
      setItems([]);
      setLoading(false);
      return;
    }
    const rows = (data ?? []) as Enrollment[];
    setItems(rows);
    const courseIds = [...new Set(rows.map((row) => row.course_id))];
    const studentIds = [...new Set(rows.map((row) => row.student_id))];
    const [courseResult, profileResult] = await Promise.all([
      courseIds.length ? supabase.from("courses").select("id,title,slug").in("id", courseIds) : Promise.resolve({ data: [], error: null }),
      studentIds.length ? supabase.from("profiles").select("id,full_name").in("id", studentIds) : Promise.resolve({ data: [], error: null }),
    ]);
    if (courseResult.error) setError("Enrollments loaded, but course titles could not be loaded: " + courseResult.error.message);
    if (profileResult.error) setError("Enrollments loaded, but student names could not be loaded: " + profileResult.error.message);
    setCourses(Object.fromEntries((courseResult.data ?? []).map((row) => [row.id, row as Course])));
    setProfiles(Object.fromEntries((profileResult.data ?? []).map((row) => [row.id, row as Profile])));
    setLoading(false);
  }, []);

  useEffect(() => { void load(); }, [load]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((item) => {
      const course = courses[item.course_id];
      const profile = profiles[item.student_id];
      const matchesText = !term || [course?.title, course?.slug, profile?.full_name, item.student_id].some((value) => value?.toLowerCase().includes(term));
      return matchesText && (filter === "all" || item.status === filter);
    });
  }, [items, courses, profiles, search, filter]);

  const counts = useMemo(() => ({
    total: items.length,
    active: items.filter((item) => item.status === "active").length,
    completed: items.filter((item) => item.status === "completed").length,
    pending: items.filter((item) => item.status === "pending").length,
  }), [items]);

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="rounded-3xl border border-cyan-400/15 bg-gradient-to-br from-[#10283a] via-[#0c1421] to-[#090e17] p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">VEXORA / Academy</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Course enrollments<span className="text-cyan-300">.</span></h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">All online course enrollments, including students who enrolled directly in free published courses. Active enrollments do not wait for administrator approval.</p>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {Object.entries({ "Total enrollments": counts.total, Active: counts.active, Completed: counts.completed, "Pending legacy": counts.pending }).map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-4"><p className="text-xs text-slate-400">{label}</p><p className="mt-2 text-2xl font-bold text-white">{value}</p></div>
          ))}
        </div>
      </header>
      {error && <div role="alert" className="rounded-xl border border-amber-400/20 bg-amber-400/[0.06] p-4 text-sm text-amber-100">{error}</div>}
      <section className="rounded-2xl border border-white/[0.08] bg-[#0c111b] p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row">
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search student, course or student ID..." aria-label="Search enrollments" className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#080d16] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50" />
          <select value={filter} onChange={(event) => setFilter(event.target.value)} aria-label="Filter by enrollment status" className="rounded-xl border border-white/10 bg-[#080d16] px-4 py-3 text-sm text-white outline-none focus:border-cyan-400/50">
            <option value="all">All statuses</option><option value="active">Active</option><option value="completed">Completed</option><option value="pending">Pending</option><option value="cancelled">Cancelled</option>
          </select>
          <button type="button" onClick={() => void load()} disabled={loading} className="rounded-xl border border-cyan-400/20 px-5 py-3 text-sm font-semibold text-cyan-100 hover:bg-cyan-400/10 disabled:opacity-50">{loading ? "Refreshing..." : "Refresh"}</button>
        </div>
        {loading ? <p className="py-14 text-center text-sm text-slate-400">Loading enrollments...</p> : filtered.length === 0 ? (
          <div className="py-14 text-center"><p className="font-semibold text-white">No course enrollments found</p><p className="mt-2 text-sm text-slate-400">New free-course enrollments will appear here automatically.</p></div>
        ) : (
          <div className="mt-5 overflow-x-auto"><table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-slate-500"><tr><th className="px-3 py-3">Student</th><th className="px-3 py-3">Course</th><th className="px-3 py-3">Status</th><th className="px-3 py-3">Progress</th><th className="px-3 py-3">Enrolled</th></tr></thead>
            <tbody>{filtered.map((item) => <tr key={item.id} className="border-t border-white/[0.07]">
              <td className="px-3 py-4"><p className="font-semibold text-white">{profiles[item.student_id]?.full_name || "Student"}</p><p className="mt-1 text-[10px] text-slate-500">{item.student_id}</p></td>
              <td className="px-3 py-4"><p className="font-medium text-slate-200">{courses[item.course_id]?.title || "Course"}</p><p className="mt-1 text-xs text-slate-500">{courses[item.course_id]?.slug || item.course_id}</p></td>
              <td className="px-3 py-4"><span className={"rounded-full border px-3 py-1 text-xs font-semibold capitalize " + statusClass[item.status]}>{item.status}</span></td>
              <td className="px-3 py-4"><span className="tabular-nums text-slate-300">{Math.max(0, Math.min(100, Number(item.progress_percent) || 0))}%</span></td>
              <td className="px-3 py-4 text-slate-400">{new Date(item.enrolled_at).toLocaleString("en-GB")}</td>
            </tr>)}</tbody>
          </table></div>
        )}
      </section>
    </div>
  );
}
