
"use client";

import { useMemo, useState } from "react";

type TrainingMode = "online" | "inperson" | "recorded" | "workshops";

type Course = {
  id: number;
  title: string;
  category: string;
  level: string;
  duration: string;
  modes: TrainingMode[];
  image: string;
  description: string;
  topics: string[];
};

const modes: { id: "all" | TrainingMode; label: string }[] = [
  { id: "all", label: "All formats" },
  { id: "online", label: "Live online" },
  { id: "inperson", label: "In person" },
  { id: "recorded", label: "Self-paced" },
  { id: "workshops", label: "Workshops" },
];

const categories = [
  "All",
  "Cybersecurity",
  "Programming",
  "Networking",
  "Data Analytics",
  "Digital Marketing",
];

const courses: Course[] = [
  {
    id: 1,
    title: "Cybersecurity Fundamentals",
    category: "Cybersecurity",
    level: "Beginner",
    duration: "6 weeks",
    modes: ["online", "inperson", "workshops"],
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1000&q=85",
    description:
      "Build a practical foundation in cybersecurity, common threats, secure systems, and essential defensive practices.",
    topics: [
      "Security principles and common threats",
      "Networking and system security basics",
      "Risk assessment and protection",
      "Hands-on security exercises",
    ],
  },
  {
    id: 2,
    title: "Web Development Bootcamp",
    category: "Programming",
    level: "Beginner",
    duration: "8 weeks",
    modes: ["online", "inperson", "workshops"],
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=85",
    description:
      "Learn how modern websites are planned, built, and improved through practical development projects.",
    topics: [
      "HTML, CSS, and responsive design",
      "JavaScript fundamentals",
      "React and modern web concepts",
      "Build and present a portfolio project",
    ],
  },
  {
    id: 3,
    title: "Network Engineering Essentials",
    category: "Networking",
    level: "Beginner to Intermediate",
    duration: "6 weeks",
    modes: ["online", "inperson", "recorded"],
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=85",
    description:
      "Explore network architecture, connectivity, troubleshooting, and the foundations of reliable IT infrastructure.",
    topics: [
      "Network models and addressing",
      "Routing and switching concepts",
      "Network troubleshooting",
      "Infrastructure and security basics",
    ],
  },
  {
    id: 4,
    title: "Data Analytics with Python",
    category: "Data Analytics",
    level: "Beginner",
    duration: "7 weeks",
    modes: ["online", "recorded", "workshops"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=85",
    description:
      "Turn raw data into useful insights using analytical thinking, Python, visualization, and practical exercises.",
    topics: [
      "Working with structured data",
      "Python analysis fundamentals",
      "Data cleaning and visualization",
      "Build an analytical report",
    ],
  },
  {
    id: 5,
    title: "Digital Marketing & Analytics",
    category: "Digital Marketing",
    level: "Beginner",
    duration: "5 weeks",
    modes: ["online", "recorded", "workshops"],
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1000&q=85",
    description:
      "Understand digital campaigns, content strategy, performance metrics, and data-informed marketing decisions.",
    topics: [
      "Digital marketing fundamentals",
      "Content and campaign planning",
      "Paid media concepts",
      "Performance measurement and reporting",
    ],
  },
  {
    id: 6,
    title: "Practical Security Workshop",
    category: "Cybersecurity",
    level: "Intermediate",
    duration: "2 days",
    modes: ["online", "inperson", "workshops"],
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=85",
    description:
      "A practical workshop focused on defensive security thinking, safe lab exercises, and structured problem solving.",
    topics: [
      "Security lab orientation",
      "Threat identification exercises",
      "Defensive investigation workflows",
      "Practical review and lessons learned",
    ],
  },
];

const modeLabels: Record<TrainingMode, string> = {
  online: "Live online",
  inperson: "In person",
  recorded: "Self-paced",
  workshops: "Workshop",
};

export default function AcademyPage() {
  const [category, setCategory] = useState("All");
  const [mode, setMode] = useState<"all" | TrainingMode>("all");
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [registrationOpen, setRegistrationOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const filteredCourses = useMemo(() => {
    const query = search.trim().toLowerCase();

    return courses.filter((course) => {
      const matchesCategory =
        category === "All" || course.category === category;

      const matchesMode =
        mode === "all" || course.modes.includes(mode);

      const matchesSearch =
        !query ||
        `${course.title} ${course.category} ${course.description}`
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesMode && matchesSearch;
    });
  }, [category, mode, search]);

  function openCourse(course: Course) {
    setSelectedCourse(course);
    setRegistrationOpen(false);
    setSubmitted(false);
  }

  function closeModal() {
    setSelectedCourse(null);
    setRegistrationOpen(false);
    setSubmitted(false);
  }

  function openRegistration() {
    setRegistrationOpen(true);
    setSubmitted(false);
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#070a10] text-white">
      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#070a10]/85 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <a href="#top" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#45a5ff]/30 bg-[#1687ff]/10 text-lg font-black text-[#45a5ff]">
              V
            </span>
            <span>
              <span className="block text-lg font-bold tracking-[0.17em]">
                VEXORA
              </span>
              <span className="block text-[10px] uppercase tracking-[0.3em] text-gray-500">
                Academy
              </span>
            </span>
          </a>

          <div className="hidden items-center gap-7 text-sm text-gray-400 md:flex">
            <a href="#programs" className="transition hover:text-white">
              Programs
            </a>
            <a href="#experience" className="transition hover:text-white">
              Experience
            </a>
            <a href="#certificate" className="transition hover:text-white">
              Certificates
            </a>
          </div>

          <a
            href="#programs"
            className="rounded-lg bg-[#1687ff] px-4 py-2.5 text-sm font-semibold transition hover:bg-[#0875e5]"
          >
            Explore courses <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>

      {/* Hero */}
      <section id="top" className="relative">
        <div className="pointer-events-none absolute -left-40 top-0 h-96 w-96 rounded-full bg-blue-600/15 blur-[130px]" />
        <div className="pointer-events-none absolute -right-40 top-40 h-96 w-96 rounded-full bg-cyan-500/10 blur-[130px]" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#45a5ff]/25 bg-[#1687ff]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#7fc1ff]">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#45a5ff]" />
              Learn. Build. Move forward.
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
              Turn your
              <span className="block text-[#45a5ff]">curiosity into</span>
              real-world skills.
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-gray-400 sm:text-lg">
              Learn technology through structured courses, guided practice,
              and hands-on workshops designed for your next step.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#programs"
                className="rounded-xl bg-[#1687ff] px-6 py-3.5 font-semibold shadow-lg shadow-blue-950/40 transition hover:-translate-y-0.5 hover:bg-[#0875e5]"
              >
                Explore learning paths <span aria-hidden="true">→</span>
              </a>
              <a
                href="#experience"
                className="rounded-xl border border-white/15 px-6 py-3.5 font-semibold text-gray-200 transition hover:border-[#45a5ff]/60 hover:bg-white/[0.04]"
              >
                How it works
              </a>
            </div>

            <div className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-white/10 pt-7">
              <div>
                <p className="text-2xl font-bold text-white">05<span className="text-[#45a5ff]">+</span></p>
                <p className="mt-1 text-xs leading-5 text-gray-500">Technology fields</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">04</p>
                <p className="mt-1 text-xs leading-5 text-gray-500">Learning formats</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">01<span className="text-[#45a5ff]">→</span></p>
                <p className="mt-1 text-xs leading-5 text-gray-500">Step at a time</p>
              </div>
            </div>
            <p className="mt-4 text-xs leading-5 text-gray-600">
              Program formats and course details will be confirmed before enrollment.
            </p>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-3 rounded-[2rem] bg-gradient-to-br from-blue-500/20 via-transparent to-cyan-400/10 blur-2xl" />
            <div className="relative overflow-hidden rounded-[1.7rem] border border-white/10 bg-[#0c121d] p-2 shadow-2xl shadow-black/40">
              <div
                role="img"
                aria-label="Learners working together on technology projects"
                className="relative min-h-[390px] overflow-hidden rounded-[1.25rem] bg-cover bg-center sm:min-h-[490px]"
                style={{
                  backgroundImage:
                    "linear-gradient(180deg,rgba(7,10,16,.03) 15%,rgba(7,10,16,.88) 100%),url('https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=90')",
                }}
              >
                <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/35 px-3 py-2 text-xs text-white backdrop-blur-md">
                  Practical learning
                </div>

                <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/15 bg-[#080d16]/80 p-5 backdrop-blur-xl sm:bottom-7 sm:left-7 sm:right-7">
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#70b8ff]">
                    Your next chapter starts here
                  </p>
                  <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                    Skills built by doing.
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-gray-300">
                    Explore concepts, practice with purpose, and build projects
                    that demonstrate what you have learned.
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-2 rounded-2xl border border-white/10 bg-[#101825] p-4 shadow-xl sm:-left-7 sm:p-5">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-xl text-[#70b8ff]">
                  ✦
                </span>
                <div>
                  <p className="text-sm font-semibold">Learn by practice</p>
                  <p className="mt-1 text-xs text-gray-500">Projects & workshops</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Learning formats */}
      <section className="border-y border-white/[0.08] bg-white/[0.02]">
        <div className="mx-auto grid max-w-7xl gap-5 px-5 py-8 sm:grid-cols-2 sm:px-8 lg:grid-cols-4">
          {[
            {
              symbol: "↗",
              title: "Live online",
              desc: "Learn remotely with a guided session format.",
            },
            {
              symbol: "⌂",
              title: "In person",
              desc: "Learn together in a classroom setting when available.",
            },
            {
              symbol: "▷",
              title: "Self-paced",
              desc: "Study recorded lessons at your own pace.",
            },
            {
              symbol: "⚙",
              title: "Hands-on workshops",
              desc: "Practice skills through guided activities.",
            },
          ].map((item) => (
            <div key={item.title} className="flex gap-4 py-2">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#45a5ff]/20 bg-[#1687ff]/10 text-xl text-[#70b8ff]">
                {item.symbol}
              </span>
              <div>
                <h3 className="font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm leading-6 text-gray-500">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Course catalog */}
      <section id="programs" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#45a5ff]">
              The learning catalog
            </p>
            <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
              Find your next skill.
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-gray-400">
              Explore sample learning paths across technology and business.
              Filter the catalog to find a format and subject that fit you.
            </p>
          </div>

          <label className="relative block w-full lg:max-w-sm">
            <span className="sr-only">Search courses</span>
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
              ⌕
            </span>
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search courses or topics..."
              className="w-full rounded-xl border border-white/10 bg-[#0c111a] py-3.5 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-gray-600 focus:border-[#45a5ff]/60"
            />
          </label>
        </div>

        <div className="mt-9 flex gap-2 overflow-x-auto pb-3">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`shrink-0 rounded-full border px-4 py-2.5 text-sm transition ${
                category === item
                  ? "border-[#1687ff] bg-[#1687ff] font-semibold text-white"
                  : "border-white/10 bg-white/[0.02] text-gray-400 hover:border-white/25 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {modes.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setMode(item.id)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition ${
                mode === item.id
                  ? "bg-white/10 text-white"
                  : "text-gray-500 hover:bg-white/[0.04] hover:text-gray-300"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="mb-5 mt-7 flex items-center justify-between text-sm text-gray-500">
          <p>
            Showing <span className="font-semibold text-white">{filteredCourses.length}</span> sample programs
          </p>
          {(category !== "All" || mode !== "all" || search) && (
            <button
              type="button"
              onClick={() => {
                setCategory("All");
                setMode("all");
                setSearch("");
              }}
              className="text-[#70b8ff] transition hover:text-white"
            >
              Clear filters ↺
            </button>
          )}
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCourses.map((course) => (
              <article
                key={course.id}
                className="group overflow-hidden rounded-2xl border border-white/[0.09] bg-[#0b1019] transition duration-300 hover:-translate-y-1 hover:border-[#45a5ff]/40 hover:shadow-xl hover:shadow-blue-950/20"
              >
                <div className="relative h-52 overflow-hidden">
                  <div
                    role="img"
                    aria-label={`${course.category} learning`}
                    className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${course.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1019] via-black/10 to-black/10" />
                  <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/40 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-md">
                    {course.category}
                  </span>
                </div>

                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
                    <span>{course.level}</span>
                    <span>•</span>
                    <span>{course.duration}</span>
                  </div>
                  <h3 className="mt-3 text-xl font-bold leading-snug transition group-hover:text-[#70b8ff]">
                    {course.title}
                  </h3>
                  <p className="mt-3 min-h-[72px] text-sm leading-6 text-gray-400">
                    {course.description}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {course.modes.slice(0, 2).map((courseMode) => (
                      <span
                        key={courseMode}
                        className="rounded-md border border-white/[0.08] bg-white/[0.03] px-2.5 py-1.5 text-[11px] text-gray-400"
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
                    onClick={() => openCourse(course)}
                    className="mt-6 flex w-full items-center justify-between border-t border-white/[0.08] pt-4 text-sm font-semibold transition hover:text-[#70b8ff]"
                  >
                    Explore program <span className="text-lg">↗</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/15 px-6 py-16 text-center">
            <p className="text-3xl">⌕</p>
            <h3 className="mt-4 text-xl font-semibold">No matching programs</h3>
            <p className="mt-2 text-sm text-gray-500">
              Try another keyword or clear your filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setCategory("All");
                setMode("all");
                setSearch("");
              }}
              className="mt-5 rounded-lg bg-[#1687ff] px-5 py-2.5 text-sm font-semibold hover:bg-[#0875e5]"
            >
              Show all programs
            </button>
          </div>
        )}

        <p className="mt-6 text-xs leading-5 text-gray-600">
          These are illustrative course listings for the initial design.
          Availability, schedules, instructors, fees, and delivery formats
          must be confirmed before registration opens.
        </p>
      </section>

      {/* Learning experience */}
      <section id="experience" className="scroll-mt-24 border-y border-white/[0.08] bg-[#0a0f18]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-2">
          <div className="relative grid grid-cols-2 gap-3">
            <div
              role="img"
              aria-label="Learner working on a computer"
              className="mt-8 h-52 rounded-2xl border border-white/10 bg-cover bg-center sm:h-64"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=700&q=85')",
              }}
            />
            <div
              role="img"
              aria-label="Technology team collaborating"
              className="h-52 rounded-2xl border border-white/10 bg-cover bg-center sm:h-64"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=700&q=85')",
              }}
            />
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-xl border border-white/10 bg-[#101825]/95 px-5 py-3 shadow-xl backdrop-blur-md">
              <p className="whitespace-nowrap text-sm font-semibold">Learn by doing</p>
              <p className="mt-1 text-center text-xs text-gray-500">Practice · Feedback · Improve</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#45a5ff]">
              The VEXORA approach
            </p>
            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-5xl">
              More than lessons.
              <span className="block text-[#45a5ff]">A path to practice.</span>
            </h2>
            <p className="mt-5 leading-8 text-gray-400">
              Learning should be more than watching videos. Our planned
              approach combines clear explanations, practical exercises, and
              projects that help learners apply new concepts.
            </p>

            <div className="mt-8 space-y-5">
              {[
                ["01", "Understand", "Build a clear foundation in each subject."],
                ["02", "Practice", "Apply concepts through guided exercises."],
                ["03", "Create", "Work toward a practical project or outcome."],
                ["04", "Reflect", "Review progress and identify next steps."],
              ].map(([number, title, description]) => (
                <div key={number} className="flex gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#45a5ff]/20 bg-[#1687ff]/10 text-xs font-bold text-[#70b8ff]">
                    {number}
                  </span>
                  <div>
                    <h3 className="font-semibold">{title}</h3>
                    <p className="mt-1 text-sm leading-6 text-gray-500">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Certificate */}
      <section id="certificate" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24">
        <div className="relative overflow-hidden rounded-3xl border border-[#45a5ff]/20 bg-gradient-to-br from-[#101d31] via-[#0d1420] to-[#0b1018] p-7 sm:p-12 lg:p-14">
          <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-blue-500/10 blur-[90px]" />
          <div className="relative grid items-center gap-10 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#70b8ff]">
                Recognition of your progress
              </p>
              <h2 className="mt-4 text-3xl font-bold sm:text-4xl">
                Every completed step counts.
              </h2>
              <p className="mt-5 max-w-xl leading-8 text-gray-400">
                VEXORA plans to offer a certificate of completion for eligible
                programs. Certificate requirements and availability will be
                explained for each course before enrollment.
              </p>
              <div className="mt-6 flex items-start gap-3 text-sm leading-6 text-gray-400">
                <span className="mt-0.5 text-[#70b8ff]">✓</span>
                <p>
                  A planned VEXORA-issued completion certificate. It is not
                  represented as a government-accredited or third-party
                  accredited qualification.
                </p>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-sm rotate-1 rounded-xl border border-[#a8cfff]/30 bg-[#eaf2ff] p-3 text-[#14243c] shadow-2xl shadow-black/30">
              <div className="border border-[#6b8ebc]/40 p-6 text-center sm:p-8">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-[#142c4c] text-lg font-black text-white">
                  V
                </div>
                <p className="mt-4 text-[9px] font-bold uppercase tracking-[0.28em] text-[#47658c]">
                  VEXORA ACADEMY
                </p>
                <h3 className="mt-4 text-2xl font-serif font-bold sm:text-3xl">
                  Certificate
                </h3>
                <p className="mt-2 text-xs italic text-[#47658c]">
                  of Completion
                </p>
                <div className="mx-auto my-5 h-px w-20 bg-[#9db5d5]" />
                <p className="text-xs leading-5 text-[#47658c]">
                  This illustrative preview represents a planned certificate
                  design. It is not an issued credential.
                </p>
                <div className="mt-7 flex justify-between border-t border-[#9db5d5]/60 pt-3 text-[8px] uppercase tracking-widest text-[#47658c]">
                  <span>VEXORA Academy</span>
                  <span>Sample preview</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final call to action */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-24">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/[0.025] px-6 py-12 text-center sm:px-12 sm:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#45a5ff]">
            Your next step
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-3xl font-bold sm:text-5xl">
            Ready to start learning?
          </h2>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-gray-400">
            Explore the available sample programs and find a subject you want
            to develop. You can preview program details and try the registration
            interface below.
          </p>
          <a
            href="#programs"
            className="mt-8 inline-flex rounded-xl bg-[#1687ff] px-6 py-3.5 font-semibold transition hover:bg-[#0875e5]"
          >
            Find a program <span className="ml-2">↗</span>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-7 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <p>
            <span className="font-bold tracking-[0.15em] text-gray-300">VEXORA</span>
            <span className="mx-2 text-gray-700">/</span>
            Academy
          </p>
          <p>Learn with purpose. Build with confidence.</p>
          <p>© 2026 VEXORA. All rights reserved.</p>
        </div>
      </footer>

      {/* Course details and demo registration */}
      {selectedCourse && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-dialog-title"
            className="my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0c121d] shadow-2xl shadow-black/50"
          >
            <div className="relative h-44 sm:h-56">
              <div
                role="img"
                aria-label={`${selectedCourse.category} course image`}
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url('${selectedCourse.image}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c121d] to-black/10" />
              <button
                type="button"
                onClick={closeModal}
                aria-label="Close dialog"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-black/50 text-xl hover:bg-black/80"
              >
                ×
              </button>
            </div>

            <div className="p-6 sm:p-8">
              {!registrationOpen ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#70b8ff]">
                    {selectedCourse.category}
                  </p>
                  <h2 id="course-dialog-title" className="mt-3 text-2xl font-bold sm:text-3xl">
                    {selectedCourse.title}
                  </h2>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-400">
                    <span className="rounded-md bg-white/[0.05] px-3 py-2">{selectedCourse.level}</span>
                    <span className="rounded-md bg-white/[0.05] px-3 py-2">{selectedCourse.duration}</span>
                    {selectedCourse.modes.map((item) => (
                      <span key={item} className="rounded-md bg-white/[0.05] px-3 py-2">
                        {modeLabels[item]}
                      </span>
                    ))}
                  </div>
                  <p className="mt-5 leading-7 text-gray-400">{selectedCourse.description}</p>

                  <h3 className="mt-7 font-semibold">What you will explore</h3>
                  <ul className="mt-3 space-y-3">
                    {selectedCourse.topics.map((topic) => (
                      <li key={topic} className="flex gap-3 text-sm leading-6 text-gray-400">
                        <span className="text-[#70b8ff]">✓</span>
                        {topic}
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={openRegistration}
                    className="mt-8 w-full rounded-xl bg-[#1687ff] px-5 py-3.5 font-semibold transition hover:bg-[#0875e5]"
                  >
                    Try registration form <span className="ml-1">→</span>
                  </button>
                  <p className="mt-3 text-center text-xs leading-5 text-gray-600">
                    This is a preview. Submitting does not reserve a seat or send your details.
                  </p>
                </>
              ) : submitted ? (
                <div className="py-8 text-center">
                  <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/15 text-2xl text-[#70b8ff]">✓</span>
                  <h2 className="mt-5 text-2xl font-bold">Demo submitted</h2>
                  <p className="mt-3 leading-7 text-gray-400">
                    The form interaction worked, but no data was sent or saved.
                    We will connect real enrollment after the page is tested.
                  </p>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="mt-7 rounded-xl border border-white/15 px-5 py-3 font-semibold hover:bg-white/[0.05]"
                  >
                    Close preview
                  </button>
                </div>
              ) : (
                <>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#70b8ff]">
                    Enrollment preview
                  </p>
                  <h2 id="course-dialog-title" className="mt-3 text-2xl font-bold">
                    Request a place
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    Selected program: <span className="font-semibold text-white">{selectedCourse.title}</span>
                  </p>

                  <form
                    className="mt-6 space-y-4"
                    onSubmit={(event) => {
                      event.preventDefault();
                      setSubmitted(true);
                    }}
                  >
                    <div>
                      <label htmlFor="academy-name" className="mb-2 block text-sm text-gray-300">Full name</label>
                      <input
                        id="academy-name"
                        name="name"
                        required
                        minLength={2}
                        placeholder="Enter your name"
                        className="w-full rounded-xl border border-white/10 bg-[#080d15] px-4 py-3 text-sm outline-none transition placeholder:text-gray-600 focus:border-[#45a5ff]/60"
                      />
                    </div>
                    <div>
                      <label htmlFor="academy-email" className="mb-2 block text-sm text-gray-300">Email address</label>
                      <input
                        id="academy-email"
                        name="email"
                        type="email"
                        required
                        placeholder="you@example.com"
                        className="w-full rounded-xl border border-white/10 bg-[#080d15] px-4 py-3 text-sm outline-none transition placeholder:text-gray-600 focus:border-[#45a5ff]/60"
                      />
                    </div>
                    <div>
                      <label htmlFor="academy-format" className="mb-2 block text-sm text-gray-300">Preferred format</label>
                      <select
                        id="academy-format"
                        name="format"
                        required
                        defaultValue=""
                        className="w-full rounded-xl border border-white/10 bg-[#080d15] px-4 py-3 text-sm text-gray-200 outline-none focus:border-[#45a5ff]/60"
                      >
                        <option value="" disabled>Select a format</option>
                        {selectedCourse.modes.map((item) => (
                          <option key={item} value={item}>{modeLabels[item]}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-[#1687ff] px-5 py-3.5 font-semibold transition hover:bg-[#0875e5]"
                    >
                      Test form submission
                    </button>
                    <button
                      type="button"
                      onClick={() => setRegistrationOpen(false)}
                      className="w-full rounded-xl border border-white/10 px-5 py-3 text-sm text-gray-400 transition hover:bg-white/[0.04] hover:text-white"
                    >
                      Back to course details
                    </button>
                    <p className="text-xs leading-5 text-gray-600">
                      Preview only: do not enter sensitive information. This form is not connected to a server.
                    </p>
                  </form>
                </>
              )}
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
