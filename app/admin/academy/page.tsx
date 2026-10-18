/* eslint-disable react-hooks/set-state-in-effect */

"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browser";

type Course = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  difficulty: "beginner" | "intermediate" | "advanced" | null;
  course_type: "online" | "in_person" | "hybrid" | null;
  estimated_hours: number | null;
  status: "draft" | "published" | "archived";
  created_at: string;
  updated_at: string;
};

type CourseForm = {
  title: string;
  slug: string;
  description: string;
  difficulty: "" | "beginner" | "intermediate" | "advanced";
  course_type: "" | "online" | "in_person" | "hybrid";
  estimated_hours: string;
  status: "draft" | "published" | "archived";
};

const initialForm: CourseForm = {
  title: "",
  slug: "",
  description: "",
  difficulty: "beginner",
  course_type: "online",
  estimated_hours: "",
  status: "draft",
};

const difficultyLabels: Record<string, string> = {
  beginner: "مبتدئ",
  intermediate: "متوسط",
  advanced: "متقدم",
};

const typeLabels: Record<string, string> = {
  online: "أونلاين",
  in_person: "حضوري",
  hybrid: "هجين",
};

const statusLabels: Record<string, string> = {
  draft: "مسودة",
  published: "منشور",
  archived: "مؤرشف",
};

const statusStyles: Record<string, string> = {
  draft: "border-amber-400/20 bg-amber-400/10 text-amber-300",
  published: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
  archived: "border-gray-400/20 bg-gray-400/10 text-gray-400",
};

const fieldClass =
  "w-full rounded-xl border border-white/10 bg-[#0b111b] px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-400";

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AcademyPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CourseForm>(initialForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadCourses = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data, error: queryError } = await supabase
        .from("courses")
        .select(
          "id, title, slug, description, difficulty, course_type, estimated_hours, status, created_at, updated_at"
        )
        .order("created_at", { ascending: false });

      if (queryError) {
        setError(queryError.message);
        setCourses([]);
      } else {
        setCourses((data ?? []) as Course[]);
      }
    } catch {
      setError("حدث خطأ غير متوقع أثناء تحميل الكورسات.");
      setCourses([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadCourses();
  }, [loadCourses]);

  function updateForm<K extends keyof CourseForm>(
    field: K,
    value: CourseForm[K]
  ) {
    setForm((current) => ({ ...current, [field]: value }));
    setFormError("");
    setSuccessMessage("");
  }

  async function handleCreateCourse(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setFormError("");
    setSuccessMessage("");

    const title = form.title.trim();

    if (!title) {
      setFormError("اكتب عنوان الكورس أولًا.");
      return;
    }

    const slug =
      form.slug.trim().length > 0
        ? createSlug(form.slug)
        : createSlug(title) || `course-${Date.now()}`;

    if (!slug) {
      setFormError(
        "تعذر إنشاء رابط مختصر. اكتب Slug باللغة الإنجليزية والأرقام."
      );
      return;
    }

    const hours =
      form.estimated_hours.trim() === ""
        ? null
        : Number(form.estimated_hours);

    if (
      hours !== null &&
      (!Number.isInteger(hours) || hours < 1)
    ) {
      setFormError("عدد الساعات يجب أن يكون رقمًا صحيحًا أكبر من صفر.");
      return;
    }

    setSaving(true);

    try {
      const { error: insertError } = await supabase.from("courses").insert({
        title,
        slug,
        description: form.description.trim() || null,
        difficulty: form.difficulty || null,
        course_type: form.course_type || null,
        estimated_hours: hours,
        status: form.status,
      });

      if (insertError) {
        if (insertError.code === "23505") {
          setFormError(
            "هذا الرابط المختصر مستخدم بالفعل. اختر Slug مختلفًا."
          );
        } else if (
          insertError.code === "42501" ||
          insertError.message.toLowerCase().includes("row-level security")
        ) {
          setFormError(
            "ليست لديك صلاحية إضافة الكورسات. تحقق من دور المدير وسياسات RLS في Supabase."
          );
        } else {
          setFormError(`تعذر حفظ الكورس: ${insertError.message}`);
        }
        return;
      }

      setForm(initialForm);
      setShowForm(false);
      setSuccessMessage("تم إنشاء الكورس وحفظه بنجاح.");

      await loadCourses();
    } catch {
      setFormError("حدث خطأ غير متوقع أثناء حفظ الكورس. حاول مرة أخرى.");
    } finally {
      setSaving(false);
    }
  }

  const normalizedSearch = search.trim().toLowerCase();

  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(normalizedSearch) ||
      course.slug.toLowerCase().includes(normalizedSearch) ||
      (course.description ?? "").toLowerCase().includes(normalizedSearch);

    const matchesStatus =
      statusFilter === "all" || course.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const publishedCount = courses.filter(
    (course) => course.status === "published"
  ).length;

  const draftCount = courses.filter(
    (course) => course.status === "draft"
  ).length;

  const archivedCount = courses.filter(
    (course) => course.status === "archived"
  ).length;

  return (
    <div dir="rtl" className="mx-auto max-w-7xl text-white">
      <header className="flex flex-col gap-5 border-b border-white/[0.08] pb-7 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold tracking-[0.18em] text-blue-400">
            VEXORA / ACADEMY
          </p>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            إدارة الأكاديمية
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-400">
            إدارة الدورات التدريبية وإنشاء الكورسات ومتابعة حالاتها من لوحة تحكم VEXORA.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => {
              setShowForm((current) => !current);
              setFormError("");
              setSuccessMessage("");
            }}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500"
          >
            <span aria-hidden="true">{showForm ? "×" : "+"}</span>
            {showForm ? "إغلاق النموذج" : "إضافة كورس جديد"}
          </button>

          <button
            type="button"
            onClick={() => void loadCourses()}
            disabled={loading}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm transition hover:border-blue-400/40 hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span aria-hidden="true">↻</span>
            تحديث البيانات
          </button>
        </div>
      </header>

      {successMessage && (
        <div
          role="status"
          className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4 text-sm text-emerald-300"
        >
          {successMessage}
        </div>
      )}

      {showForm && (
        <section className="mt-7 rounded-2xl border border-blue-400/20 bg-[#0d121d] p-5 sm:p-7">
          <div className="mb-6">
            <p className="text-xs font-semibold tracking-wider text-blue-400">
              NEW COURSE
            </p>
            <h2 className="mt-2 text-xl font-bold">إنشاء كورس جديد</h2>
            <p className="mt-2 text-sm leading-7 text-gray-400">
              أدخل بيانات الكورس واحفظه في قاعدة البيانات. المسودة لن تظهر للطلاب
              باعتبارها كورسًا منشورًا.
            </p>
          </div>

          <form onSubmit={handleCreateCourse} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="course-title"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  عنوان الكورس <span className="text-red-400">*</span>
                </label>
                <input
                  id="course-title"
                  required
                  maxLength={200}
                  value={form.title}
                  onChange={(event) =>
                    updateForm("title", event.target.value)
                  }
                  placeholder="مثال: أساسيات الأمن السيبراني"
                  className={fieldClass}
                />
              </div>

              <div>
                <label
                  htmlFor="course-slug"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  الرابط المختصر (Slug)
                </label>
                <input
                  id="course-slug"
                  dir="ltr"
                  value={form.slug}
                  onChange={(event) =>
                    updateForm("slug", event.target.value)
                  }
                  placeholder="cybersecurity-basics"
                  className={fieldClass}
                />
                <p className="mt-2 text-xs leading-5 text-gray-500">
                  اتركه فارغًا لتوليده من العنوان. يُفضّل استخدام حروف إنجليزية
                  وأرقام.
                </p>
              </div>
            </div>

            <div>
              <label
                htmlFor="course-description"
                className="mb-2 block text-sm font-medium text-gray-300"
              >
                وصف الكورس
              </label>
              <textarea
                id="course-description"
                rows={4}
                maxLength={10000}
                value={form.description}
                onChange={(event) =>
                  updateForm("description", event.target.value)
                }
                placeholder="اكتب وصفًا يوضح محتوى الكورس وما سيتعلمه الطالب..."
                className={`${fieldClass} resize-y`}
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              <div>
                <label
                  htmlFor="course-difficulty"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  المستوى
                </label>
                <select
                  id="course-difficulty"
                  value={form.difficulty}
                  onChange={(event) =>
                    updateForm(
                      "difficulty",
                      event.target.value as CourseForm["difficulty"]
                    )
                  }
                  className={fieldClass}
                >
                  <option value="beginner">مبتدئ</option>
                  <option value="intermediate">متوسط</option>
                  <option value="advanced">متقدم</option>
                  <option value="">غير محدد</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="course-type"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  نوع الكورس
                </label>
                <select
                  id="course-type"
                  value={form.course_type}
                  onChange={(event) =>
                    updateForm(
                      "course_type",
                      event.target.value as CourseForm["course_type"]
                    )
                  }
                  className={fieldClass}
                >
                  <option value="online">أونلاين</option>
                  <option value="in_person">حضوري</option>
                  <option value="hybrid">هجين</option>
                  <option value="">غير محدد</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="course-hours"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  عدد الساعات
                </label>
                <input
                  id="course-hours"
                  type="number"
                  min={1}
                  step={1}
                  value={form.estimated_hours}
                  onChange={(event) =>
                    updateForm("estimated_hours", event.target.value)
                  }
                  placeholder="مثال: 20"
                  className={fieldClass}
                />
              </div>

              <div>
                <label
                  htmlFor="course-status"
                  className="mb-2 block text-sm font-medium text-gray-300"
                >
                  حالة الكورس
                </label>
                <select
                  id="course-status"
                  value={form.status}
                  onChange={(event) =>
                    updateForm(
                      "status",
                      event.target.value as CourseForm["status"]
                    )
                  }
                  className={fieldClass}
                >
                  <option value="draft">مسودة</option>
                  <option value="published">منشور</option>
                  <option value="archived">مؤرشف</option>
                </select>
              </div>
            </div>

            {formError && (
              <div
                role="alert"
                className="rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm leading-7 text-red-300"
              >
                {formError}
              </div>
            )}

            <div className="flex flex-wrap gap-3 border-t border-white/[0.08] pt-5">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "جاري الحفظ..." : "حفظ الكورس"}
              </button>

              <button
                type="button"
                disabled={saving}
                onClick={() => {
                  setForm(initialForm);
                  setFormError("");
                  setShowForm(false);
                }}
                className="rounded-xl border border-white/10 px-6 py-3 text-sm transition hover:bg-white/[0.04] disabled:opacity-50"
              >
                إلغاء
              </button>
            </div>
          </form>
        </section>
      )}

      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "إجمالي الكورسات", value: courses.length },
          { label: "الكورسات المنشورة", value: publishedCount },
          { label: "المسودات", value: draftCount },
          { label: "الكورسات المؤرشفة", value: archivedCount },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-white/[0.08] bg-[#0d121d] p-5"
          >
            <p className="text-sm text-gray-400">{item.label}</p>
            <p className="mt-3 text-3xl font-bold tabular-nums">
              {loading ? "—" : item.value.toLocaleString("en-US")}
            </p>
          </div>
        ))}
      </section>

      <section className="mt-8 rounded-2xl border border-white/[0.08] bg-[#0d121d] p-5 sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="text-xl font-bold">الكورسات المسجلة</h2>
            <p className="mt-2 text-sm text-gray-400">
              ابحث بالاسم أو الرابط التعريفي، أو صفِّ النتائج حسب الحالة.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="ابحث عن كورس..."
              aria-label="البحث عن كورس"
              className={fieldClass}
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              aria-label="تصفية الكورسات حسب الحالة"
              className={fieldClass}
            >
              <option value="all">كل الحالات</option>
              <option value="draft">مسودة</option>
              <option value="published">منشور</option>
              <option value="archived">مؤرشف</option>
            </select>
          </div>
        </div>

        {error && (
          <div
            role="alert"
            className="mt-6 rounded-xl border border-red-400/20 bg-red-400/5 p-4 text-sm leading-7 text-red-300"
          >
            <p className="font-semibold">تعذر تحميل الكورسات</p>
            <p className="mt-1 break-words">{error}</p>
            <p className="mt-2 text-red-200/80">
              تحقق من تسجيل الدخول وصلاحيات قراءة جدول courses وسياسات RLS.
            </p>
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center text-sm text-gray-400">
            جاري تحميل الكورسات...
          </div>
        ) : error ? (
          <div className="py-8 text-center text-sm text-gray-500">
            أصلح الخطأ ثم اضغط «تحديث البيانات».
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-3xl text-gray-600" aria-hidden="true">
              ▣
            </div>
            <p className="mt-4 font-semibold">
              {courses.length === 0
                ? "لا توجد كورسات مسجلة حتى الآن"
                : "لا توجد نتائج مطابقة للبحث"}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              {courses.length === 0
                ? "اضغط على «إضافة كورس جديد» لإنشاء أول كورس."
                : "جرّب تغيير كلمات البحث أو فلتر الحالة."}
            </p>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {filteredCourses.map((course) => (
              <article
                key={course.id}
                className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition hover:border-blue-400/20 sm:p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-lg font-semibold">
                        {course.title}
                      </h3>

                      <span
                        className={`rounded-full border px-2.5 py-1 text-xs ${
                          statusStyles[course.status] ??
                          "border-white/10 text-gray-400"
                        }`}
                      >
                        {statusLabels[course.status] ?? course.status}
                      </span>
                    </div>

                    <p className="mt-2 break-all text-xs text-gray-500">
                      /{course.slug}
                    </p>

                    {course.description && (
                      <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-gray-400">
                        {course.description}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap gap-2">
                      {course.difficulty && (
                        <span className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs text-gray-300">
                          المستوى: {difficultyLabels[course.difficulty]}
                        </span>
                      )}

                      {course.course_type && (
                        <span className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs text-gray-300">
                          النوع: {typeLabels[course.course_type]}
                        </span>
                      )}

                      {course.estimated_hours !== null && (
                        <span className="rounded-lg border border-white/[0.08] px-3 py-1.5 text-xs text-gray-300">
                          {course.estimated_hours} ساعة
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="shrink-0 text-xs text-gray-500">
                    {new Date(course.created_at).toLocaleDateString("ar-EG")}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}

        {!loading && !error && courses.length > 0 && (
          <p className="mt-5 border-t border-white/[0.07] pt-4 text-xs text-gray-500">
            عرض {filteredCourses.length} من أصل {courses.length} كورس.
          </p>
        )}
      </section>
    </div>
  );
}
