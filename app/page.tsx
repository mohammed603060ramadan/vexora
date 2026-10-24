"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/browser";

type HomepageProject = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  show_on_homepage: boolean;
};

type HomepageEvent = {
  id: string;
  title: string;
  description: string | null;
  event_type: string;
  event_date: string | null;
  start_time: string | null;
  location: string | null;
};

const CLIENT_FORM_URL = "/register/client";

const STUDENT_FORM_URL = "/register/student";

const WHATSAPP_URL = "https://wa.me/201115449868";
const EMAIL = "vexore.mr@gmail.com";

const SOCIAL_LINKS = [
  {
    name: "LinkedIn",
    href: "https://www.linkedin.com/in/mohammad-ramadan-706b89440?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/vexoramohammed/",
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/share/19hrz2yVC7/",
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@vexoramohammed",
  },
];

const services = [
  {
    number: "01",
    title: "Software Development",
    description:
      "Websites, web applications, dashboards, and custom software designed around real business needs.",
    tags: ["Websites", "Web Apps", "Custom Software"],
    href: "/services/software-development",
    symbol: "</>",
  },
  {
    number: "02",
    title: "Cybersecurity",
    description:
      "Practical security reviews and protection strategies to help reduce digital risk.",
    tags: ["Security Assessment", "Risk Analysis", "Protection"],
    href: "/services/cybersecurity",
    symbol: "⌘",
  },
  {
    number: "03",
    title: "Networks & Infrastructure",
    description:
      "Reliable networking, infrastructure planning, and IT solutions for connected teams.",
    tags: ["Networking", "Infrastructure", "IT Support"],
    href: "/services/networks-infrastructure",
    symbol: "⌁",
  },
  {
    number: "04",
    title: "Data Analytics",
    description:
      "Turn raw information into clear reports, useful dashboards, and better decisions.",
    tags: ["Data Analysis", "Dashboards", "Reporting"],
    href: "/services/data-analytics",
    symbol: "▥",
  },
  {
    number: "05",
    title: "Digital Marketing",
    description:
      "Digital strategy and performance-focused campaigns built around measurable goals.",
    tags: ["Strategy", "Campaigns", "Optimization"],
    href: "/services/digital-marketing",
    symbol: "↗",
  },
];

const learningPaths = [
  {
    label: "01 / SOFTWARE",
    title: "Software & Web Development",
    description:
      "Build a practical foundation in websites, programming concepts, and application development.",
    icon: "</>",
  },
  {
    label: "02 / SECURITY",
    title: "Cybersecurity Foundations",
    description:
      "Explore security principles, safe practices, networks, and risk awareness.",
    icon: "⌘",
  },
  {
    label: "03 / DATA",
    title: "Data & Analytics",
    description:
      "Learn how to organize information, understand patterns, and communicate insights.",
    icon: "▥",
  },
];

const capabilities = [
  "SOFTWARE DEVELOPMENT",
  "CYBERSECURITY",
  "NETWORKS & INFRASTRUCTURE",
  "DATA ANALYTICS",
  "DIGITAL MARKETING",
  "TECHNOLOGY TRAINING",
];

function ServiceVisual({ type }: { type: string }) {
  if (type === "01") {
    return (
      <div className="service-visual service-visual-code" aria-hidden="true">
        <div className="mini-window-bar">
          <i />
          <i />
          <i />
          <span>app.tsx</span>
        </div>

        <div className="code-row">
          <b>01</b>
          <i className="code-short" />
          <i className="code-long" />
        </div>

        <div className="code-row">
          <b>02</b>
          <i className="code-medium" />
          <i className="code-tiny" />
        </div>

        <div className="code-row">
          <b>03</b>
          <i className="code-long" />
        </div>

        <div className="code-row">
          <b>04</b>
          <i className="code-short" />
          <i className="code-medium" />
        </div>

        <span className="code-cursor" />
      </div>
    );
  }

  if (type === "02") {
    return (
      <div
        className="service-visual service-visual-security"
        aria-hidden="true"
      >
        <div className="terminal-top">
          <span>SECURITY MONITOR</span>
          <i>● LIVE</i>
        </div>

        <div className="terminal-line">
          <b>[SCAN]</b>
          <span>checking endpoints...</span>
        </div>

        <div className="terminal-line">
          <b>[AUTH]</b>
          <span>identity verified</span>
        </div>

        <div className="terminal-line terminal-success">
          <b>[SAFE]</b>
          <span>no threat detected</span>
        </div>

        <div className="terminal-line terminal-dim">
          <b>[SYS]</b>
          <span>monitoring active_</span>
        </div>

        <span className="terminal-scanline" />
      </div>
    );
  }

  if (type === "03") {
    return (
      <div
        className="service-visual service-visual-network"
        aria-hidden="true"
      >
        <svg viewBox="0 0 300 94" role="presentation">
          <g
            className="network-lines"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <path d="M150 47 L72 20 L30 64 M72 20 L105 72 M150 47 L224 20 L270 60 M224 20 L205 73 M150 47 L105 72 L205 73 L270 60 M30 64 L105 72" />
          </g>

          <g className="network-pulses">
            <circle cx="150" cy="47" r="8" />
            <circle cx="72" cy="20" r="5" />
            <circle cx="30" cy="64" r="4" />
            <circle cx="105" cy="72" r="5" />
            <circle cx="224" cy="20" r="5" />
            <circle cx="270" cy="60" r="4" />
            <circle cx="205" cy="73" r="5" />
          </g>
        </svg>

        <span className="network-label">CONNECTED SYSTEMS</span>
      </div>
    );
  }

  if (type === "04") {
    return (
      <div
        className="service-visual service-visual-analytics"
        aria-hidden="true"
      >
        <div className="analytics-head">
          <span>DATA OVERVIEW</span>
          <b>+24.8%</b>
        </div>

        <div className="analytics-chart">
          {[28, 46, 35, 62, 48, 77, 58, 91, 70, 100, 83, 112].map(
            (height, index) => (
              <i
                key={index}
                style={{
                  height: `${height * 0.58}px`,
                  animationDelay: `${index * 70}ms`,
                }}
              />
            ),
          )}
        </div>

        <div className="analytics-baseline">
          <span>WEEK 01</span>
          <span>WEEK 12</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="service-visual service-visual-marketing"
      aria-hidden="true"
    >
      <div className="marketing-metric">
        <span>CAMPAIGN GROWTH</span>
        <b>↑ 38.6%</b>
      </div>

      <svg viewBox="0 0 300 76" role="presentation">
        <defs>
          <linearGradient
            id="marketingFill"
            x1="0"
            y1="0"
            x2="0"
            y2="1"
          >
            <stop offset="0%" stopColor="#278cff" stopOpacity=".34" />
            <stop offset="100%" stopColor="#278cff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          className="marketing-area"
          d="M5 65 L38 56 L68 60 L100 39 L132 45 L164 27 L198 33 L230 13 L260 20 L295 4 L295 76 L5 76 Z"
          fill="url(#marketingFill)"
        />

        <path
          className="marketing-line"
          d="M5 65 L38 56 L68 60 L100 39 L132 45 L164 27 L198 33 L230 13 L260 20 L295 4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle cx="295" cy="4" r="4" fill="#dceeff" />
      </svg>

      <div className="marketing-tags">
        <span>REACH</span>
        <span>CONVERSION</span>
        <span>ROI</span>
      </div>
    </div>
  );
}

function SocialIcon({ name }: { name: string }) {
  if (name === "LinkedIn") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V8.99h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.46v6.29ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM3.56 20.45h3.57V8.99H3.56v11.46ZM22.23 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.73V1.73C24 .77 23.21 0 22.23 0Z" />
      </svg>
    );
  }

  if (name === "Instagram") {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle
          cx="17.4"
          cy="6.6"
          r="1"
          fill="currentColor"
          stroke="none"
        />
      </svg>
    );
  }

  if (name === "Facebook") {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07c0 6.02 4.39 11 10.13 11.93v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.79-4.71 4.53-4.71 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.27h3.33l-.53 3.49h-2.8V24C19.61 23.07 24 18.09 24 12.07Z" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-4.16-2.46v10.49a5.28 5.28 0 1 1-4.58-5.24v2.66a2.67 2.67 0 1 0 1.97 2.58V0h2.61a4.83 4.83 0 0 0 4.16 4.61v2.08Z" />
    </svg>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [publishedEvents, setPublishedEvents] = useState<HomepageEvent[]>([]);
  const [featuredProjects, setFeaturedProjects] = useState<HomepageProject[]>([]);

  useEffect(() => {
    let active = true;
    async function loadPublicEventsAndSession() {
      const { data: authData } = await supabase.auth.getUser();
      if (active) setIsAuthenticated(Boolean(authData.user));
      const { data, error } = await supabase
        .from("events")
        .select("id,title,description,event_type,event_date,start_time,location")
        .eq("status", "published")
        .eq("show_on_homepage", true)
        .order("event_date", { ascending: true, nullsFirst: false })
        .limit(3);
      if (active && !error) setPublishedEvents((data ?? []) as HomepageEvent[]);
      const { data: projectData, error: projectError } = await supabase
        .from("projects")
        .select("id,title,description,status,show_on_homepage")
        .eq("show_on_homepage", true)
        .in("status", ["in_progress", "completed"])
        .order("name", { ascending: true })
        .limit(3);
      if (active && !projectError) setFeaturedProjects((projectData ?? []) as HomepageProject[]);
    }
    void loadPublicEventsAndSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session?.user));
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".vexora-site");

    if (!root) return;

    const nodes = root.querySelectorAll<HTMLElement>(".reveal");

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      nodes.forEach((node) => node.classList.add("is-visible"));
      return;
    }

    root.classList.add("motion-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px 40px 0px",
      },
    );

    nodes.forEach((node) => observer.observe(node));

    return () => {
      observer.disconnect();
      root.classList.remove("motion-ready");
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    const handleResize = () => {
      if (window.innerWidth > 820) {
        setMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <main id="top" className="vexora-site">
      {/* =========================================================
          VEXORA ADVANCED TECHNOLOGY BACKGROUND
          ========================================================= */}

      <div className="tech-background" aria-hidden="true">
        <div className="tech-stars">
          {Array.from({ length: 24 }).map((_, index) => (
            <span
              key={index}
              className={`tech-star tech-star-${index + 1}`}
            />
          ))}
        </div>

        <div className="tech-grid tech-grid-a" />
        <div className="tech-grid tech-grid-b" />

        <div className="tech-glow tech-glow-a" />
        <div className="tech-glow tech-glow-b" />
        <div className="tech-glow tech-glow-c" />

        <div className="tech-scan tech-scan-a" />
        <div className="tech-scan tech-scan-b" />

        <div className="tech-beam tech-beam-a" />
        <div className="tech-beam tech-beam-b" />
        <div className="tech-beam tech-beam-c" />

        <div className="tech-data data-stream-a">
          VEXORA::CORE / SYSTEM ONLINE / 01010110
        </div>

        <div className="tech-data data-stream-b">
          SECURE CHANNEL // DATA FLOW // 00110101
        </div>

        <div className="tech-data data-stream-c">
          SOFTWARE → SECURITY → NETWORK → DATA
        </div>

        <div className="tech-hud hud-top-left">
          <span>VX.SYSTEM</span>
          <b>ONLINE</b>
        </div>

        <div className="tech-hud hud-top-right">
          <span>NETWORK</span>
          <b>SECURE</b>
        </div>

        <div className="tech-hud hud-bottom-left">
          <span>DATA FLOW</span>
          <b>ACTIVE</b>
        </div>

        <div className="tech-hud hud-bottom-right">
          <span>VEXORA</span>
          <b>2026</b>
        </div>

        <svg
          className="tech-network"
          viewBox="0 0 1600 1000"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="vxNetworkGradient"
              x1="0"
              y1="0"
              x2="1"
              y2="0"
            >
              <stop offset="0%" stopColor="#1687ff" stopOpacity="0" />
              <stop
                offset="50%"
                stopColor="#69c8ff"
                stopOpacity="0.65"
              />
              <stop offset="100%" stopColor="#1687ff" stopOpacity="0" />
            </linearGradient>

            <filter id="vxGlow">
              <feGaussianBlur
                stdDeviation="2.2"
                result="blur"
              />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <g
            className="network-paths"
            fill="none"
            stroke="url(#vxNetworkGradient)"
          >
            <path d="M-100 730 C180 510 330 780 560 590 S910 250 1190 460 S1420 620 1710 300" />
            <path d="M-120 250 C190 430 350 120 610 350 S930 650 1210 360 S1440 200 1720 470" />
            <path d="M-80 900 C250 730 430 820 700 690 S1080 620 1340 800 S1530 850 1720 720" />
            <path d="M190 -80 C280 180 470 260 620 120 S920 40 1060 240 S1340 370 1490 120" />
          </g>

          <g className="network-packets">
            <circle cx="280" cy="610" r="3" />
            <circle cx="560" cy="590" r="3" />
            <circle cx="910" cy="250" r="3" />
            <circle cx="1190" cy="460" r="3" />
            <circle cx="1420" cy="620" r="3" />
            <circle cx="350" cy="300" r="3" />
            <circle cx="610" cy="350" r="3" />
            <circle cx="930" cy="650" r="3" />
            <circle cx="1210" cy="360" r="3" />
            <circle cx="1490" cy="120" r="3" />
          </g>
        </svg>
      </div>

      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />

      {/* Navigation */}

      <header className="site-header">
        <div className="header-inner">
          <Link
            href="/admin-login"
            className="brand"
            aria-label="VEXORA administrator login"
            title="Administrator login"
            onClick={closeMenu}
          >
            <Image
              src="/vexora-logo.png"
              alt="VEXORA Technology"
              width={190}
              height={70}
              priority
              sizes="(max-width: 640px) 145px, 190px"
              className="brand-logo"
            />
          </Link>

          <button
            type="button"
            className={`menu-toggle ${menuOpen ? "menu-toggle-open" : ""}`}
            aria-label={
              menuOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav
            id="primary-navigation"
            className={`main-nav ${menuOpen ? "main-nav-open" : ""}`}
            aria-label="Main navigation"
          >
            <Link href="/services" onClick={closeMenu}>
              Services
            </Link>

            <Link href="/about" onClick={closeMenu}>
              About
            </Link>

            {isAuthenticated && (
              <Link href="/academy" onClick={closeMenu}>
                Academy
              </Link>
            )}

            <Link href="/projects" onClick={closeMenu}>
              Projects
            </Link>

            <Link href="/events" onClick={closeMenu}>
              Events
            </Link>

            <Link href="/contact" onClick={closeMenu}>
              Contact
            </Link>

            <Link href="/login" className="nav-login" onClick={closeMenu}>
              Login
            </Link>

            <Link
              href="/contact"
              className="button button-small"
              onClick={closeMenu}
            >
              Let&apos;s Talk <span aria-hidden="true">↗</span>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}

      <section className="hero-section">
        <div className="hero-inner page-width">
          <div className="hero-copy">
            <div className="eyebrow reveal">
              <span className="status-dot" />
              TECHNOLOGY · STRATEGY · GROWTH
            </div>

            <h1 className="hero-title reveal">
              Make your next
              <br />
              move <span className="gradient-text">intelligent.</span>
            </h1>

            <p className="hero-description reveal">
              VEXORA brings software engineering, cybersecurity, networks,
              data analytics, and digital marketing together to help
              businesses build with clarity and move forward with confidence.
            </p>

            <div className="hero-actions reveal">
              <Link href="/services" className="button">
                Explore our services <span aria-hidden="true">↗</span>
              </Link>

              <Link href="/contact" className="button button-outline">
                Start a conversation
              </Link>
            </div>

            <div className="hero-proof reveal">
              <span className="proof-line" />
              <span>
                One technology partner. Multiple ways to move forward.
              </span>
            </div>
          </div>

          <div
            className="hero-visual reveal"
            role="img"
            aria-label="Abstract VEXORA technology illustration"
          >
            <div className="visual-orbit orbit-outer" />
            <div className="visual-orbit orbit-middle" />
            <div className="visual-orbit orbit-inner" />

            <div className="visual-core">
              <Image
                src="/vexora-logo.png"
                alt=""
                aria-hidden="true"
                width={170}
                height={170}
                sizes="170px"
                className="core-logo-image"
              />
            </div>

            <div className="float-chip chip-code">
              <span>01</span> SOFTWARE
            </div>

            <div className="float-chip chip-security">
              <span>02</span> SECURITY
            </div>

            <div className="float-chip chip-data">
              <span>03</span> DATA
            </div>

            <div className="float-chip chip-network">
              <span>04</span> NETWORKS
            </div>

            <div className="visual-spark spark-one" />
            <div className="visual-spark spark-two" />
            <div className="visual-spark spark-three" />
          </div>
        </div>

        <div className="ticker" aria-label="VEXORA capabilities">
          <div className="ticker-track">
            {[0, 1].map((group) => (
              <div
                className="ticker-group"
                key={group}
                aria-hidden={group === 1}
              >
                {capabilities.map((capability) => (
                  <span className="ticker-item" key={capability}>
                    {capability}
                    <i aria-hidden="true" />
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}

      <section id="services" className="section page-width">
        <div className="section-heading reveal">
          <div>
            <p className="section-kicker">WHAT WE DO / 01</p>

            <h2>
              Technology built around{" "}
              <span className="gradient-text">your goals.</span>
            </h2>
          </div>

          <p className="section-intro">
            From your first idea to your next stage of growth, explore
            services designed to solve real problems and create practical
            value.
          </p>
        </div>

        <div className="service-grid">
          {services.map((service, index) => (
            <Link
              href={service.href}
              className="service-card reveal"
              key={service.number}
              style={{ animationDelay: `${index * 90}ms` }}
            >
              <div className="service-card-top">
                <span className="service-number">{service.number}</span>

                <span className="service-symbol" aria-hidden="true">
                  {service.symbol}
                </span>
              </div>

              <ServiceVisual type={service.number} />

              <h3>{service.title}</h3>

              <p>{service.description}</p>

              <div className="tag-list">
                {service.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <div className="card-link">
                Explore service <span aria-hidden="true">↗</span>
              </div>
            </Link>
          ))}
        </div>

        <div className="section-bottom-link reveal">
          <Link href="/services" className="text-link">
            View all services <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      {/* About */}

      <section id="about" className="about-section">
        <div className="page-width about-layout">
          <div className="about-art reveal" aria-hidden="true">
            <div className="about-art-frame">
              <div className="about-art-lines" />

              <div className="about-art-center">
                <Image
                  src="/vexora-logo.png"
                  alt=""
                  aria-hidden="true"
                  width={160}
                  height={160}
                  sizes="160px"
                  className="about-logo-image"
                />
              </div>

              <div className="about-data data-a">SYSTEMS / 001</div>
              <div className="about-data data-b">IDEAS INTO IMPACT</div>

              <div className="about-corner corner-a" />
              <div className="about-corner corner-b" />
            </div>
          </div>

          <div className="about-copy reveal">
            <p className="section-kicker">ABOUT VEXORA / 02</p>

            <h2>
              Good technology starts with{" "}
              <span className="gradient-text">understanding.</span>
            </h2>

            <p>
              We combine technical thinking with a clear understanding of
              business needs. Our goal is to recommend and build solutions
              that are useful, secure, and made to support the people who use
              them.
            </p>

            <p>
              Our work connects software, security, infrastructure, data, and
              digital strategy—so technology can work as one coherent system.
            </p>

            <Link href="/about" className="button button-outline">
              Discover VEXORA <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Academy */}

      {isAuthenticated && (
      <section id="academy" className="section page-width academy-section">
        <div className="section-heading reveal">
          <div>
            <p className="section-kicker">VEXORA ACADEMY / 03</p>

            <h2>
              Learn skills.{" "}
              <span className="gradient-text">Build what&apos;s next.</span>
            </h2>
          </div>

          <p className="section-intro">
            Training paths for learners who want to understand technology,
            practise useful skills, and keep developing.
          </p>
        </div>

        <div className="learning-grid">
          {learningPaths.map((path, index) => (
            <article
              className="learning-card reveal"
              key={path.label}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="learning-icon" aria-hidden="true">
                {path.icon}
              </div>

              <p className="learning-label">{path.label}</p>

              <h3>{path.title}</h3>

              <p className="learning-description">
                {path.description}
              </p>

              <Link href="/academy" className="text-link">
                Explore learning path <span aria-hidden="true">↗</span>
              </Link>
            </article>
          ))}
        </div>

        <div className="academy-banner reveal">
          <div>
            <p className="section-kicker">
              YOUR NEXT STEP STARTS HERE
            </p>

            <h3>Ready to start learning with VEXORA?</h3>

            <p>
              Visit the Academy page for training information and
              registration.
            </p>
          </div>

          <div className="academy-actions">
            <Link href="/academy" className="button">
              Explore Academy <span aria-hidden="true">↗</span>
            </Link>

            <Link
              href={STUDENT_FORM_URL}
              className="button button-outline"
              aria-label="Open student registration form"
            >
              Student registration <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* Registration */}

      <section id="registration" className="registration-section">
        <div className="page-width">
          <div className="section-heading reveal">
            <div>
              <p className="section-kicker">LET&apos;S CONNECT / 04</p>

              <h2>
                Choose your{" "}
                <span className="gradient-text">next step.</span>
              </h2>
            </div>

            <p className="section-intro">
              Whether you need a technology partner or want to develop your
              skills, choose the path that fits you.
            </p>
          </div>

          <div className="registration-grid">
            <article className="registration-card client-card reveal">
              <div className="registration-icon" aria-hidden="true">
                ↗
              </div>

              <p className="section-kicker">FOR BUSINESSES</p>

              <h3>Have a project in mind?</h3>

              <p>
                Tell us about your business, project goals, and the challenges
                you want to solve. Share the details through our client inquiry
                form.
              </p>

              <Link href={CLIENT_FORM_URL} className="button">
                Client inquiry form <span aria-hidden="true">→</span>
              </Link>

              <Link href="/client" className="secondary-card-link">
                Visit client area <span aria-hidden="true">→</span>
              </Link>
            </article>

            <article className="registration-card student-card reveal">
              <div className="registration-icon" aria-hidden="true">
                ✳
              </div>

              <p className="section-kicker">FOR LEARNERS</p>

              <h3>Ready to learn and grow?</h3>

              <p>
                Explore technology training and send your registration through
                the student form. Course availability and details are provided
                through the Academy.
              </p>

              <Link href={STUDENT_FORM_URL} className="button">
                Student registration <span aria-hidden="true">→</span>
              </Link>

              {isAuthenticated && (
                <Link href="/academy" className="secondary-card-link">
                  Visit VEXORA Academy <span aria-hidden="true">→</span>
                </Link>
              )}
            </article>
          </div>

          <p className="form-note reveal">
            Submit either form directly on VEXORA. Your submission is saved
            for the team to review in the administration workspace.
          </p>
        </div>
      </section>

      {/* Projects */}

      <section id="projects" className="section page-width projects-section">
        <div className="project-panel reveal">
          <div className="project-panel-copy">
            <p className="section-kicker">BUILT WITH PURPOSE / 05</p>

            <h2>
              Let&apos;s turn a challenge into a{" "}
              <span className="gradient-text">clear plan.</span>
            </h2>

            <p>
              Every project starts with a conversation. Tell us what you need,
              and we can discuss the right scope, priorities, and next steps.
            </p>

            <div className="hero-actions">
              <Link href="/contact" className="button">
                Discuss a project <span aria-hidden="true">↗</span>
              </Link>

              <Link href="/projects" className="button button-outline">
                Explore projects
              </Link>
            </div>
          </div>

          <div className="project-visual" aria-hidden="true">
            <div className="project-ring ring-one" />
            <div className="project-ring ring-two" />
            <div className="project-ring ring-three" />

            <div className="project-cross cross-one" />
            <div className="project-cross cross-two" />

            <div className="project-core">
              <Image
                src="/vexora-logo.png"
                alt=""
                aria-hidden="true"
                width={110}
                height={110}
                sizes="110px"
                className="project-logo-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}

      <section id="contact" className="contact-section">
        <div className="page-width contact-layout">
          <div className="contact-copy reveal">
            <p className="section-kicker">CONTACT / 06</p>

            <h2>
              Let&apos;s build something{" "}
              <span className="gradient-text">meaningful.</span>
            </h2>

            <p>
              Tell us what you&apos;re working on. We&apos;ll help you explore
              a practical next step.
            </p>
          </div>

          <div className="contact-options reveal">
            <a href={`mailto:${EMAIL}`} className="contact-option">
              <span className="contact-option-icon" aria-hidden="true">
                ✉
              </span>

              <span>
                <small>EMAIL</small>
                <strong>{EMAIL}</strong>
              </span>

              <span className="contact-arrow" aria-hidden="true">
                ↗
              </span>
            </a>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="contact-option"
            >
              <span className="contact-option-icon" aria-hidden="true">
                ◉
              </span>

              <span>
                <small>WHATSAPP</small>
                <strong>Chat with VEXORA</strong>
              </span>

              <span className="contact-arrow" aria-hidden="true">
                ↗
              </span>
            </a>

            <Link href="/contact" className="contact-option">
              <span className="contact-option-icon" aria-hidden="true">
                ↗
              </span>

              <span>
                <small>CONTACT PAGE</small>
                <strong>More ways to reach us</strong>
              </span>

              <span className="contact-arrow" aria-hidden="true">
                ↗
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Social */}

      <section
        className="social-section"
        aria-labelledby="social-heading"
      >
        <div className="page-width social-panel reveal">
          <div className="social-copy">
            <p className="section-kicker">
              CONNECT WITH VEXORA / 07
            </p>

            <h2 id="social-heading">
              Stay connected.{" "}
              <span className="gradient-text">
                Follow what&apos;s next.
              </span>
            </h2>

            <p>
              Follow VEXORA across our social channels and stay close to new
              technology, projects, insights, and updates.
            </p>
          </div>

          <div
            className="social-links"
            aria-label="VEXORA social media links"
          >
            {SOCIAL_LINKS.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label={`Open VEXORA ${social.name} in a new tab`}
              >
                <span className="social-icon" aria-hidden="true">
                  <SocialIcon name={social.name} />
                </span>

                <span className="social-link-copy">
                  <strong>{social.name}</strong>
                  <small>OPEN PROFILE</small>
                </span>

                <span className="social-arrow" aria-hidden="true">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {featuredProjects.length > 0 && (
        <section className="section page-width" aria-labelledby="homepage-projects-title">
          <div className="section-heading">
            <p className="eyebrow">SELECTED WORK</p>
            <h2 id="homepage-projects-title">Projects approved for public showcase.</h2>
            <p>Explore selected work published by the VEXORA team.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <article key={project.id} className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition hover:border-blue-400/30">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">{project.status.replaceAll("_", " ")}</p>
                <h3 className="mt-3 text-xl font-semibold text-white">{project.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{project.description || "Project details will be shared soon."}</p>
              </article>
            ))}
          </div>
          <div className="mt-7 text-center"><Link href="/projects" className="button button-small">Explore selected projects <span aria-hidden="true">↗</span></Link></div>
        </section>
      )}

      {publishedEvents.length > 0 && (
        <section className="section page-width" aria-labelledby="homepage-events-title">
          <div className="section-heading">
            <p className="eyebrow">VEXORA CALENDAR</p>
            <h2 id="homepage-events-title">Events that move ideas forward.</h2>
            <p>Explore the latest published VEXORA sessions, workshops and community events.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {publishedEvents.map((event) => (
              <article key={event.id} className="rounded-2xl border border-white/10 bg-white/[0.025] p-6 transition hover:border-blue-400/30">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">{event.event_type}</p>
                <h3 className="mt-3 text-xl font-semibold text-white">{event.title}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{event.description || "More details will be announced soon."}</p>
                <div className="mt-5 space-y-2 text-xs text-slate-500">
                  {event.event_date && <p>{new Intl.DateTimeFormat("en", { day: "2-digit", month: "long", year: "numeric" }).format(new Date(event.event_date + "T12:00:00"))}</p>}
                  {event.start_time && <p>{event.start_time.slice(0, 5)}{event.location ? ` · ${event.location}` : ""}</p>}
                  {!event.start_time && event.location && <p>{event.location}</p>}
                </div>
              </article>
            ))}
          </div>
          <div className="mt-7 text-center"><Link href="/events" className="button button-small">Explore all events <span aria-hidden="true">↗</span></Link></div>
        </section>
      )}

      {/* Footer */}

      <footer className="site-footer">
        <div className="page-width footer-main">
          <Link
            href="/"
            className="footer-brand"
            aria-label="VEXORA home"
          >
            <Image
              src="/vexora-logo.png"
              alt="VEXORA Technology"
              width={160}
              height={60}
              sizes="160px"
              className="footer-logo"
            />
          </Link>

          <p>Technology that moves your business forward.</p>

          <div className="footer-links">
            <Link href="/services">Services</Link>
            <Link href="/about">About</Link>
            {isAuthenticated && <Link href="/academy">Academy</Link>}
            <Link href="/events">Events</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>

        <div className="page-width footer-bottom">
          <span>© 2026 VEXORA Technology. All rights reserved.</span>

          <a href="#top">Back to top ↑</a>
        </div>
      </footer>

      {/* =========================================================
          ALL PAGE CSS
          ========================================================= */}

      <style jsx global>{`
        :root {
          --vx-bg: #05080e;
          --vx-panel: #0b1420;
          --vx-panel-2: #0d1928;
          --vx-blue: #1687ff;
          --vx-blue-bright: #45a5ff;
          --vx-cyan: #69c8ff;
          --vx-silver: #dce7f5;
          --vx-muted: #95a5ba;
          --vx-line: rgba(150, 190, 230, 0.13);
        }

        * {
          box-sizing: border-box;
        }

        html {
          scroll-behavior: smooth;
          scroll-padding-top: 100px;
        }

        body {
          margin: 0;
          background: var(--vx-bg);
        }

        /* =========================================================
           BASE
           ========================================================= */

        .vexora-site {
          position: relative;
          isolation: isolate;
          min-height: 100vh;
          overflow: hidden;
          color: #f5f9ff;
          background:
            radial-gradient(
              circle at 50% -10%,
              rgba(27, 105, 190, 0.2),
              transparent 38%
            ),
            linear-gradient(
              180deg,
              #05080e 0%,
              #070c14 38%,
              #060a11 100%
            );
          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        .vexora-site a {
          -webkit-tap-highlight-color: transparent;
        }

        .page-width {
          width: min(1240px, calc(100% - 48px));
          margin-inline: auto;
        }

        /* =========================================================
           ADVANCED TECHNOLOGY BACKGROUND
           ========================================================= */

        .tech-background {
          position: fixed;
          inset: 0;
          z-index: -10;
          overflow: hidden;
          pointer-events: none;
          background:
            radial-gradient(
              circle at 50% 35%,
              rgba(18, 105, 205, 0.06),
              transparent 42%
            ),
            linear-gradient(
              180deg,
              rgba(3, 7, 13, 0.08),
              rgba(3, 7, 13, 0.68)
            );
        }

        .tech-background::before {
          position: absolute;
          inset: 0;
          content: "";
          background:
            linear-gradient(
              90deg,
              rgba(39, 140, 255, 0.035) 1px,
              transparent 1px
            ),
            linear-gradient(
              rgba(39, 140, 255, 0.035) 1px,
              transparent 1px
            );
          background-size: 90px 90px;
          mask-image: linear-gradient(
            to bottom,
            black,
            rgba(0, 0, 0, 0.78),
            transparent
          );
          animation: backgroundGridMove 24s linear infinite;
        }

        .tech-background::after {
          position: absolute;
          inset: 0;
          content: "";
          background:
            radial-gradient(
              ellipse at center,
              transparent 25%,
              rgba(0, 0, 0, 0.12) 55%,
              rgba(0, 0, 0, 0.78) 100%
            ),
            repeating-linear-gradient(
              0deg,
              rgba(255, 255, 255, 0.012) 0,
              rgba(255, 255, 255, 0.012) 1px,
              transparent 1px,
              transparent 5px
            );
          opacity: 0.7;
        }

        .tech-grid {
          position: absolute;
          inset: -30%;
          opacity: 0.18;
          transform: perspective(800px) rotateX(62deg) translateY(25%);
          transform-origin: center center;
        }

        .tech-grid-a {
          background-image:
            linear-gradient(
              rgba(39, 140, 255, 0.16) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(39, 140, 255, 0.16) 1px,
              transparent 1px
            );
          background-size: 70px 70px;
          animation: gridPerspective 22s linear infinite;
        }

        .tech-grid-b {
          opacity: 0.08;
          background-image:
            linear-gradient(
              rgba(105, 200, 255, 0.18) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(105, 200, 255, 0.18) 1px,
              transparent 1px
            );
          background-size: 140px 140px;
          animation: gridPerspectiveReverse 32s linear infinite;
        }

        .tech-glow {
          position: absolute;
          border-radius: 999px;
          filter: blur(100px);
          opacity: 0.18;
        }

        .tech-glow-a {
          width: 520px;
          height: 520px;
          left: -240px;
          top: 12%;
          background: #006eff;
          animation: glowFloatA 17s ease-in-out infinite alternate;
        }

        .tech-glow-b {
          width: 460px;
          height: 460px;
          right: -220px;
          top: 35%;
          background: #00a9ff;
          animation: glowFloatB 21s ease-in-out infinite alternate;
        }

        .tech-glow-c {
          width: 520px;
          height: 520px;
          left: 30%;
          bottom: -330px;
          background: #135de0;
          opacity: 0.1;
          animation: glowFloatC 19s ease-in-out infinite alternate;
        }

        .tech-scan {
          position: absolute;
          left: -10%;
          width: 120%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(69, 165, 255, 0.7),
            rgba(105, 200, 255, 0.22),
            transparent
          );
          box-shadow:
            0 0 12px rgba(39, 140, 255, 0.4),
            0 0 30px rgba(39, 140, 255, 0.16);
        }

        .tech-scan-a {
          top: 16%;
          animation: scanVertical 9s ease-in-out infinite;
        }

        .tech-scan-b {
          top: 63%;
          opacity: 0.38;
          animation: scanVertical 13s ease-in-out infinite reverse;
        }

        .tech-beam {
          position: absolute;
          width: 2px;
          height: 140%;
          top: -20%;
          background: linear-gradient(
            180deg,
            transparent,
            rgba(69, 165, 255, 0.32),
            rgba(105, 200, 255, 0.06),
            transparent
          );
          filter: blur(0.3px);
          opacity: 0.35;
        }

        .tech-beam-a {
          left: 18%;
          transform: rotate(19deg);
          animation: beamMoveA 12s linear infinite;
        }

        .tech-beam-b {
          left: 53%;
          transform: rotate(-12deg);
          opacity: 0.2;
          animation: beamMoveB 18s linear infinite;
        }

        .tech-beam-c {
          right: 14%;
          transform: rotate(24deg);
          opacity: 0.16;
          animation: beamMoveC 15s linear infinite;
        }

        .tech-network {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0.55;
          mix-blend-mode: screen;
        }

        .network-paths path {
          stroke-dasharray: 18 24 3 32;
          stroke-width: 1;
          animation: networkFlow 13s linear infinite;
        }

        .network-paths path:nth-child(2) {
          animation-duration: 17s;
          animation-direction: reverse;
        }

        .network-paths path:nth-child(3) {
          animation-duration: 21s;
        }

        .network-paths path:nth-child(4) {
          animation-duration: 26s;
          opacity: 0.5;
        }

        .network-packets circle {
          fill: #9bddff;
          stroke: #278cff;
          stroke-width: 2;
          filter: drop-shadow(0 0 8px #278cff);
          animation: packetPulse 2.8s ease-in-out infinite;
        }

        .network-packets circle:nth-child(2n) {
          animation-delay: -0.8s;
        }

        .network-packets circle:nth-child(3n) {
          animation-delay: -1.5s;
        }

        .tech-stars {
          position: absolute;
          inset: 0;
        }

        .tech-star {
          position: absolute;
          width: 2px;
          height: 2px;
          border-radius: 50%;
          background: #a9ddff;
          box-shadow: 0 0 8px #278cff;
          animation: starPulse 3.8s ease-in-out infinite;
        }

        .tech-star:nth-child(3n) {
          width: 3px;
          height: 3px;
        }

        .tech-star-1 {
          left: 8%;
          top: 16%;
        }

        .tech-star-2 {
          left: 17%;
          top: 72%;
          animation-delay: -1s;
        }

        .tech-star-3 {
          left: 26%;
          top: 38%;
          animation-delay: -2.2s;
        }

        .tech-star-4 {
          left: 35%;
          top: 17%;
          animation-delay: -0.8s;
        }

        .tech-star-5 {
          left: 44%;
          top: 79%;
          animation-delay: -1.8s;
        }

        .tech-star-6 {
          left: 52%;
          top: 28%;
          animation-delay: -2.7s;
        }

        .tech-star-7 {
          left: 61%;
          top: 65%;
          animation-delay: -0.4s;
        }

        .tech-star-8 {
          left: 69%;
          top: 18%;
          animation-delay: -1.6s;
        }

        .tech-star-9 {
          left: 77%;
          top: 48%;
          animation-delay: -2.4s;
        }

        .tech-star-10 {
          left: 86%;
          top: 73%;
          animation-delay: -0.9s;
        }

        .tech-star-11 {
          left: 93%;
          top: 28%;
          animation-delay: -2.8s;
        }

        .tech-star-12 {
          left: 12%;
          top: 48%;
          animation-delay: -1.3s;
        }

        .tech-star-13 {
          left: 23%;
          top: 88%;
          animation-delay: -2s;
        }

        .tech-star-14 {
          left: 31%;
          top: 62%;
          animation-delay: -0.5s;
        }

        .tech-star-15 {
          left: 40%;
          top: 46%;
          animation-delay: -2.5s;
        }

        .tech-star-16 {
          left: 49%;
          top: 12%;
          animation-delay: -1.1s;
        }

        .tech-star-17 {
          left: 58%;
          top: 88%;
          animation-delay: -2.1s;
        }

        .tech-star-18 {
          left: 66%;
          top: 37%;
          animation-delay: -0.7s;
        }

        .tech-star-19 {
          left: 74%;
          top: 84%;
          animation-delay: -1.9s;
        }

        .tech-star-20 {
          left: 83%;
          top: 58%;
          animation-delay: -2.9s;
        }

        .tech-star-21 {
          left: 90%;
          top: 11%;
          animation-delay: -1.4s;
        }

        .tech-star-22 {
          left: 5%;
          top: 91%;
          animation-delay: -2.6s;
        }

        .tech-star-23 {
          left: 56%;
          top: 53%;
          animation-delay: -0.3s;
        }

        .tech-star-24 {
          left: 96%;
          top: 92%;
          animation-delay: -1.7s;
        }

        .tech-data {
          position: absolute;
          color: rgba(102, 184, 255, 0.28);
          font:
            8px/1.4
            ui-monospace,
            SFMono-Regular,
            Consolas,
            monospace;
          letter-spacing: 0.16em;
          white-space: nowrap;
          text-transform: uppercase;
        }

        .data-stream-a {
          top: 23%;
          left: -20%;
          animation: dataTravelA 26s linear infinite;
        }

        .data-stream-b {
          top: 55%;
          left: -30%;
          animation: dataTravelB 34s linear infinite;
          animation-delay: -10s;
        }

        .data-stream-c {
          bottom: 18%;
          right: -40%;
          animation: dataTravelC 31s linear infinite;
        }

        .tech-hud {
          position: absolute;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 7px 9px;
          border: 1px solid rgba(105, 200, 255, 0.13);
          border-radius: 6px;
          background: rgba(5, 12, 20, 0.35);
          color: rgba(154, 187, 219, 0.4);
          font:
            7px/1
            ui-monospace,
            SFMono-Regular,
            Consolas,
            monospace;
          letter-spacing: 0.12em;
          backdrop-filter: blur(6px);
        }

        .tech-hud b {
          color: rgba(105, 200, 255, 0.62);
          font-weight: 600;
        }

        .hud-top-left {
          top: 18%;
          left: 2%;
        }

        .hud-top-right {
          top: 25%;
          right: 2%;
        }

        .hud-bottom-left {
          bottom: 15%;
          left: 3%;
        }

        .hud-bottom-right {
          right: 3%;
          bottom: 9%;
        }

        /* =========================================================
           AMBIENT
           ========================================================= */

        .ambient {
          position: absolute;
          z-index: -4;
          pointer-events: none;
          border-radius: 999px;
          filter: blur(120px);
          opacity: 0.14;
        }

        .ambient-one {
          width: 430px;
          height: 430px;
          top: 250px;
          right: -230px;
          background: #006eff;
          animation: ambientFloat 16s ease-in-out infinite alternate;
        }

        .ambient-two {
          width: 380px;
          height: 380px;
          top: 1350px;
          left: -220px;
          background: #00a8ff;
          animation: ambientFloatReverse 20s ease-in-out infinite alternate;
        }

        /* =========================================================
           HEADER
           ========================================================= */

        .site-header {
          position: sticky;
          top: 0;
          z-index: 50;
          border-bottom: 1px solid rgba(220, 235, 255, 0.08);
          background: rgba(5, 8, 14, 0.76);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
        }

        .site-header::after {
          position: absolute;
          left: 0;
          right: 0;
          bottom: -1px;
          height: 1px;
          content: "";
          background: linear-gradient(
            90deg,
            transparent,
            rgba(69, 165, 255, 0.6),
            transparent
          );
          opacity: 0.45;
        }

        .header-inner {
          width: min(1360px, calc(100% - 48px));
          min-height: 86px;
          margin-inline: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 26px;
        }

        .brand {
          position: relative;
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
          text-decoration: none;
        }

        .brand::before {
          position: absolute;
          inset: -15px -22px;
          content: "";
          border-radius: 20px;
          background: radial-gradient(
            circle,
            rgba(39, 140, 255, 0.16),
            transparent 68%
          );
          opacity: 0;
          filter: blur(14px);
          transition: opacity 0.3s ease;
        }

        .brand:hover::before {
          opacity: 1;
        }

        .brand-logo {
          position: relative;
          z-index: 1;
          display: block;
          width: 190px;
          height: auto;
          max-height: 66px;
          object-fit: contain;
          filter: drop-shadow(0 0 6px rgba(39, 140, 255, 0.18));
          animation: logoAura 5s ease-in-out infinite;
        }

        .main-nav {
          display: flex;
          align-items: center;
          gap: clamp(14px, 2vw, 30px);
        }

        .main-nav a,
        .footer-links a {
          color: #b9c5d5;
          font-size: 13px;
          text-decoration: none;
          transition:
            color 0.2s ease,
            transform 0.2s ease;
          white-space: nowrap;
        }

        .main-nav a:hover,
        .footer-links a:hover {
          color: var(--vx-cyan);
        }

        .main-nav .nav-login {
          padding-left: 8px;
        }

        .menu-toggle {
          display: none;
        }

        /* =========================================================
           BUTTONS
           ========================================================= */

        .button {
          position: relative;
          display: inline-flex;
          min-height: 49px;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 0 21px;
          overflow: hidden;
          border: 1px solid #278cff;
          border-radius: 999px;
          background: linear-gradient(
            115deg,
            #1687ff,
            #1763ce
          );
          box-shadow:
            0 8px 28px rgba(22, 135, 255, 0.16),
            inset 0 1px 0 rgba(255, 255, 255, 0.12);
          color: white;
          font-size: 13px;
          font-weight: 700;
          text-align: center;
          text-decoration: none;
          transition:
            transform 0.25s ease,
            box-shadow 0.25s ease,
            border-color 0.25s ease,
            background 0.25s ease;
        }

        .button::before {
          position: absolute;
          inset: 0;
          content: "";
          background: linear-gradient(
            100deg,
            transparent 25%,
            rgba(255, 255, 255, 0.18) 50%,
            transparent 75%
          );
          transform: translateX(-120%);
          transition: transform 0.6s ease;
        }

        .button:hover::before {
          transform: translateX(120%);
        }

        .button:hover {
          transform: translateY(-3px);
          box-shadow:
            0 14px 40px rgba(22, 135, 255, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.14);
        }

        .button > * {
          position: relative;
          z-index: 1;
        }

        .button-small {
          min-height: 41px;
          padding-inline: 16px;
          font-size: 12px;
        }

        .button-outline {
          border-color: rgba(184, 207, 237, 0.25);
          background: rgba(255, 255, 255, 0.025);
          box-shadow: none;
          color: #e2ebf8;
        }

        .button-outline:hover {
          border-color: #278cff;
          background: rgba(39, 140, 255, 0.08);
          box-shadow: 0 8px 28px rgba(22, 135, 255, 0.1);
        }

        /* =========================================================
           HERO
           ========================================================= */

        .hero-section {
          position: relative;
        }

        .hero-inner {
          min-height: 650px;
          padding-block: 104px 94px;
          display: grid;
          grid-template-columns: 1.05fr 0.95fr;
          align-items: center;
          gap: 30px;
        }

        .hero-copy {
          position: relative;
          z-index: 2;
        }

        .eyebrow,
        .section-kicker {
          display: flex;
          align-items: center;
          gap: 10px;
          color: #78baff;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.2em;
        }

        .eyebrow {
          width: fit-content;
          padding: 11px 14px;
          border: 1px solid rgba(132, 185, 242, 0.2);
          border-radius: 999px;
          background: rgba(20, 42, 68, 0.38);
          box-shadow:
            inset 0 0 20px rgba(39, 140, 255, 0.03),
            0 0 25px rgba(39, 140, 255, 0.04);
          backdrop-filter: blur(10px);
        }

        .status-dot {
          width: 7px;
          height: 7px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #56d6a1;
          box-shadow:
            0 0 10px #56d6a1,
            0 0 24px rgba(86, 214, 161, 0.35);
          animation: statusPulse 2s ease-in-out infinite;
        }

        .hero-title {
          margin: 29px 0 0;
          font-size: clamp(48px, 6vw, 82px);
          line-height: 1.03;
          letter-spacing: -0.065em;
          font-weight: 760;
        }

        .gradient-text {
          background: linear-gradient(
            105deg,
            #f2f7ff 3%,
            #8dcaff 43%,
            #278cff 86%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .hero-description {
          max-width: 610px;
          margin: 25px 0 0;
          color: #9ba9bc;
          font-size: 15px;
          line-height: 1.95;
        }

        .hero-actions {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 12px;
          margin-top: 30px;
        }

        .hero-proof {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 43px;
          color: #8b9bb0;
          font-size: 11px;
          line-height: 1.7;
        }

        .proof-line {
          width: 35px;
          height: 1px;
          flex-shrink: 0;
          background: #278cff;
          box-shadow: 0 0 10px rgba(39, 140, 255, 0.55);
        }

        /* =========================================================
           HERO VISUAL
           ========================================================= */

        .hero-visual {
          position: relative;
          min-width: 0;
          min-height: 450px;
          display: grid;
          place-items: center;
          perspective: 800px;
        }

        .visual-orbit {
          position: absolute;
          border: 1px solid rgba(89, 166, 242, 0.23);
          border-radius: 50%;
          transform: rotateX(62deg) rotate(-25deg);
          pointer-events: none;
        }

        .orbit-outer {
          width: min(430px, 95%);
          aspect-ratio: 1;
          animation: orbitSpin 32s linear infinite;
        }

        .orbit-middle {
          width: 340px;
          max-width: 78%;
          aspect-ratio: 1;
          border-style: dashed;
          animation: orbitSpin 24s linear infinite reverse;
        }

        .orbit-inner {
          width: 250px;
          max-width: 58%;
          aspect-ratio: 1;
          border-color: rgba(102, 199, 255, 0.34);
          animation: orbitGlow 4s ease-in-out infinite;
        }

        .visual-core {
          position: relative;
          z-index: 1;
          width: 175px;
          height: 175px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(127, 196, 255, 0.42);
          border-radius: 50%;
          background:
            radial-gradient(
              circle at 35% 20%,
              #173d65,
              #0a1424 65%
            );
          box-shadow:
            0 0 65px rgba(39, 140, 255, 0.22),
            inset 0 0 35px rgba(65, 155, 255, 0.12);
          animation: corePulse 5s ease-in-out infinite;
        }

        .core-logo-image {
          display: block;
          width: 100%;
          height: 100%;
          max-width: 158px;
          max-height: 158px;
          object-fit: contain;
          filter: drop-shadow(0 0 22px rgba(64, 158, 255, 0.25));
          animation: logoBreath 6s ease-in-out infinite;
        }

        .float-chip {
          position: absolute;
          z-index: 2;
          padding: 11px 13px;
          border: 1px solid rgba(145, 190, 239, 0.22);
          border-radius: 10px;
          background: rgba(10, 19, 32, 0.9);
          box-shadow:
            0 14px 40px rgba(0, 0, 0, 0.25),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
          color: #bdcfe5;
          font-size: 8px;
          letter-spacing: 0.13em;
          backdrop-filter: blur(12px);
          animation: chipFloat 5s ease-in-out infinite;
        }

        .float-chip span {
          margin-right: 7px;
          color: #53aaff;
        }

        .chip-code {
          top: 56px;
          left: 2%;
        }

        .chip-security {
          top: 105px;
          right: -1%;
          animation-delay: -1.3s;
        }

        .chip-data {
          bottom: 82px;
          left: 3%;
          animation-delay: -2.2s;
        }

        .chip-network {
          right: 0;
          bottom: 49px;
          animation-delay: -3.1s;
        }

        .visual-spark {
          position: absolute;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #91d7ff;
          box-shadow: 0 0 18px 5px rgba(39, 140, 255, 0.5);
          animation: sparkPulse 2.5s ease-in-out infinite;
        }

        .spark-one {
          top: 20%;
          right: 20%;
        }

        .spark-two {
          left: 17%;
          top: 58%;
          animation-delay: -0.8s;
        }

        .spark-three {
          right: 22%;
          bottom: 16%;
          animation-delay: -1.6s;
        }

        /* =========================================================
           TICKER
           ========================================================= */

        .ticker {
          position: relative;
          overflow: hidden;
          border-block: 1px solid rgba(220, 235, 255, 0.08);
          background: rgba(255, 255, 255, 0.015);
          backdrop-filter: blur(8px);
        }

        .ticker::before,
        .ticker::after {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 110px;
          z-index: 2;
          content: "";
          pointer-events: none;
        }

        .ticker::before {
          left: 0;
          background: linear-gradient(90deg, #060a11, transparent);
        }

        .ticker::after {
          right: 0;
          background: linear-gradient(270deg, #060a11, transparent);
        }

        .ticker-track {
          display: flex;
          width: max-content;
          animation: tickerMove 36s linear infinite;
        }

        .ticker:hover .ticker-track {
          animation-play-state: paused;
        }

        .ticker-group {
          display: flex;
          align-items: center;
          gap: 27px;
          padding: 19px 14px;
          white-space: nowrap;
        }

        .ticker-item {
          display: inline-flex;
          align-items: center;
          gap: 27px;
          color: #8b9bb0;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.18em;
        }

        .ticker-item i {
          width: 5px;
          height: 5px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #278cff;
          box-shadow: 0 0 12px #278cff;
        }

        /* =========================================================
           GENERAL SECTIONS
           ========================================================= */

        .section {
          position: relative;
          padding-block: 115px;
        }

        .section-heading {
          display: flex;
          justify-content: space-between;
          align-items: end;
          gap: 35px;
          margin-bottom: 43px;
        }

        .section-kicker {
          margin: 0 0 17px;
        }

        .section-heading h2,
        .about-copy h2,
        .contact-copy h2 {
          max-width: 730px;
          margin: 0;
          font-size: clamp(34px, 4.2vw, 54px);
          line-height: 1.12;
          letter-spacing: -0.05em;
        }

        .section-intro {
          max-width: 390px;
          margin: 0 0 3px;
          color: #91a0b4;
          font-size: 13px;
          line-height: 1.9;
        }

        /* =========================================================
           SERVICES
           ========================================================= */

        .service-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .service-card {
          position: relative;
          min-width: 0;
          min-height: 305px;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          padding: 25px;
          border: 1px solid rgba(163, 193, 231, 0.13);
          border-radius: 17px;
          background:
            linear-gradient(
              145deg,
              rgba(18, 29, 45, 0.72),
              rgba(9, 14, 23, 0.78)
            );
          color: inherit;
          text-decoration: none;
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.025),
            0 16px 50px rgba(0, 0, 0, 0.08);
          transition:
            transform 0.3s ease,
            border-color 0.3s ease,
            background 0.3s ease,
            box-shadow 0.3s ease;
        }

        .service-card::before {
          position: absolute;
          content: "";
          width: 180px;
          height: 180px;
          top: -120px;
          right: -90px;
          border-radius: 50%;
          background: #278cff;
          filter: blur(70px);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .service-card:hover {
          transform: translateY(-7px);
          border-color: rgba(67, 155, 255, 0.55);
          background:
            linear-gradient(
              145deg,
              rgba(22, 40, 63, 0.86),
              rgba(9, 14, 23, 0.9)
            );
          box-shadow:
            0 22px 60px rgba(0, 0, 0, 0.28),
            0 0 30px rgba(39, 140, 255, 0.05);
        }

        .service-card:hover::before {
          opacity: 0.23;
        }

        .service-card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .service-number {
          color: #66b4ff;
          font-size: 11px;
          letter-spacing: 0.16em;
        }

        .service-symbol {
          display: grid;
          width: 43px;
          height: 43px;
          place-items: center;
          border: 1px solid rgba(88, 165, 244, 0.25);
          border-radius: 12px;
          background: rgba(39, 140, 255, 0.07);
          color: #9bd1ff;
          font-size: 17px;
          box-shadow: 0 0 0 rgba(39, 140, 255, 0);
          animation: iconGlow 3.2s ease-in-out infinite;
          transition:
            transform 0.3s ease,
            border-color 0.3s ease;
        }

        .service-card:hover .service-symbol {
          transform: translateY(-2px) rotate(-4deg);
          border-color: rgba(105, 200, 255, 0.72);
        }

        .service-visual {
          position: relative;
          height: 108px;
          margin-top: 18px;
          padding: 12px 13px;
          overflow: hidden;
          border: 1px solid rgba(116, 174, 235, 0.15);
          border-radius: 12px;
          background:
            linear-gradient(
              135deg,
              rgba(13, 30, 49, 0.92),
              rgba(6, 13, 23, 0.78)
            );
          color: #67baff;
          isolation: isolate;
        }

        .service-visual::after {
          position: absolute;
          inset: 0;
          z-index: -1;
          content: "";
          pointer-events: none;
          background:
            linear-gradient(
              110deg,
              transparent 25%,
              rgba(91, 176, 255, 0.08) 50%,
              transparent 75%
            );
          transform: translateX(-120%);
          animation: visualSweep 5.5s ease-in-out infinite;
        }

        .mini-window-bar {
          display: flex;
          align-items: center;
          gap: 4px;
          height: 13px;
          margin-bottom: 7px;
          border-bottom: 1px solid rgba(143, 190, 242, 0.12);
        }

        .mini-window-bar > i {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #4f9fff;
          opacity: 0.75;
        }

        .mini-window-bar > span {
          margin-left: auto;
          color: #7089a7;
          font:
            8px/1.2
            ui-monospace,
            SFMono-Regular,
            Consolas,
            monospace;
        }

        .code-row {
          display: flex;
          align-items: center;
          gap: 7px;
          height: 13px;
          font:
            8px/1
            ui-monospace,
            SFMono-Regular,
            Consolas,
            monospace;
        }

        .code-row b {
          width: 12px;
          color: #456787;
          font-weight: 400;
        }

        .code-row i {
          display: block;
          height: 3px;
          border-radius: 4px;
          background: linear-gradient(90deg, #278cff, #7bd5ff);
          opacity: 0.76;
          animation: codeFlicker 2.8s ease-in-out infinite alternate;
        }

        .code-short {
          width: 24px;
        }

        .code-medium {
          width: 47px;
        }

        .code-long {
          width: 82px;
        }

        .code-tiny {
          width: 17px;
          background: #8a9cff !important;
        }

        .code-cursor {
          position: absolute;
          right: 22%;
          bottom: 18px;
          width: 2px;
          height: 10px;
          background: #c3e7ff;
          box-shadow: 0 0 9px #278cff;
          animation: cursorBlink 1s steps(2, start) infinite;
        }

        .service-visual-security {
          padding-top: 10px;
          border-color: rgba(62, 206, 159, 0.22);
          color: #7de6c0;
          background:
            radial-gradient(
              ellipse at 85% 0%,
              rgba(16, 111, 91, 0.16),
              transparent 60%
            ),
            #071711;
          font:
            8px/1.5
            ui-monospace,
            SFMono-Regular,
            Consolas,
            monospace;
        }

        .terminal-top {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          padding-bottom: 6px;
          margin-bottom: 6px;
          border-bottom: 1px solid rgba(89, 223, 176, 0.17);
          color: #a0cdbd;
          font-size: 7px;
          letter-spacing: 0.1em;
        }

        .terminal-top i {
          color: #61e6b4;
          font-style: normal;
          animation: terminalBlink 1.8s ease-in-out infinite;
        }

        .terminal-line {
          display: flex;
          gap: 7px;
          white-space: nowrap;
          color: #78b8a4;
          animation: terminalType 4s steps(1, end) infinite;
        }

        .terminal-line b {
          color: #65e5b2;
          font-weight: 600;
        }

        .terminal-line:nth-of-type(3) {
          animation-delay: -1s;
        }

        .terminal-line:nth-of-type(4) {
          animation-delay: -2s;
        }

        .terminal-line:nth-of-type(5) {
          animation-delay: -3s;
        }

        .terminal-success span {
          color: #c1f8e2;
        }

        .terminal-dim {
          opacity: 0.62;
        }

        .terminal-scanline {
          position: absolute;
          top: 0;
          right: 0;
          left: 0;
          height: 1px;
          background: rgba(117, 255, 204, 0.55);
          box-shadow: 0 0 9px rgba(117, 255, 204, 0.4);
          animation: scanDown 4s linear infinite;
          pointer-events: none;
        }

        .service-visual-network {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 5px 10px 7px;
        }

        .service-visual-network svg {
          width: 100%;
          height: 80px;
          overflow: visible;
        }

        .network-lines {
          opacity: 0.45;
        }

        .network-pulses circle {
          fill: #a7dcff;
          stroke: #278cff;
          stroke-width: 2;
          transform-box: fill-box;
          transform-origin: center;
          animation: networkPulse 2.4s ease-in-out infinite;
        }

        .network-pulses circle:nth-child(2n) {
          animation-delay: -0.7s;
        }

        .network-pulses circle:nth-child(3n) {
          animation-delay: -1.4s;
        }

        .network-label {
          position: absolute;
          right: 10px;
          bottom: 6px;
          color: #6487a9;
          font-size: 6px;
          letter-spacing: 0.15em;
        }

        .service-visual-analytics {
          padding: 11px 13px 7px;
        }

        .analytics-head,
        .marketing-metric {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          color: #7e9dbd;
          font-size: 7px;
          letter-spacing: 0.1em;
        }

        .analytics-head b,
        .marketing-metric b {
          color: #83d8ff;
          font-size: 9px;
          letter-spacing: 0;
        }

        .analytics-chart {
          display: flex;
          height: 67px;
          align-items: end;
          gap: 5px;
          padding-top: 6px;
          border-bottom: 1px solid rgba(139, 190, 240, 0.16);
        }

        .analytics-chart i {
          flex: 1;
          min-width: 3px;
          max-height: 56px;
          border-radius: 3px 3px 0 0;
          background:
            linear-gradient(
              180deg,
              #7bd5ff,
              #278cff 72%,
              rgba(39, 140, 255, 0.25)
            );
          transform-origin: bottom;
          animation: barRise 2.8s ease-in-out infinite alternate;
        }

        .analytics-baseline {
          display: flex;
          justify-content: space-between;
          margin-top: 4px;
          color: #607b9b;
          font-size: 6px;
          letter-spacing: 0.08em;
        }

        .service-visual-marketing {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 4px;
        }

        .service-visual-marketing svg {
          width: 100%;
          height: 62px;
          overflow: visible;
        }

        .marketing-line {
          stroke-dasharray: 420;
          stroke-dashoffset: 420;
          animation: drawMarketing 3.6s ease-in-out infinite;
        }

        .marketing-tags {
          display: flex;
          gap: 6px;
        }

        .marketing-tags span {
          padding: 3px 5px;
          border: 1px solid rgba(100, 170, 238, 0.18);
          border-radius: 4px;
          color: #7598bd;
          font-size: 6px;
          letter-spacing: 0.08em;
        }

        .service-card h3 {
          position: relative;
          margin: 25px 0 12px;
          font-size: 19px;
          letter-spacing: -0.025em;
        }

        .service-card > p {
          position: relative;
          margin: 0;
          color: #91a0b4;
          font-size: 12px;
          line-height: 1.85;
        }

        .tag-list {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 18px;
        }

        .tag-list span {
          padding: 6px 8px;
          border: 1px solid rgba(155, 181, 214, 0.12);
          border-radius: 999px;
          color: #a2b0c2;
          font-size: 9px;
        }

        .card-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-top: auto;
          padding-top: 21px;
          color: #b7d9ff;
          font-size: 11px;
        }

        .section-bottom-link {
          margin-top: 26px;
          text-align: right;
        }

        .text-link {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #8ecaff;
          font-size: 12px;
          text-decoration: none;
          transition:
            gap 0.2s ease,
            color 0.2s ease;
        }

        .text-link:hover {
          gap: 15px;
          color: white;
        }

        /* =========================================================
           ABOUT
           ========================================================= */

        .about-section {
          position: relative;
          border-block: 1px solid rgba(220, 235, 255, 0.07);
          background:
            linear-gradient(
              100deg,
              rgba(12, 21, 34, 0.85),
              rgba(8, 13, 22, 0.8)
            );
        }

        .about-layout {
          display: grid;
          grid-template-columns: 0.9fr 1.1fr;
          align-items: center;
          gap: 90px;
          padding-block: 105px;
        }

        .about-art {
          min-height: 390px;
          display: grid;
          place-items: center;
        }

        .about-art-frame {
          position: relative;
          width: min(390px, 100%);
          aspect-ratio: 1;
          display: grid;
          place-items: center;
          overflow: hidden;
          border: 1px solid rgba(113, 181, 249, 0.25);
          border-radius: 25px;
          background:
            radial-gradient(
              circle at center,
              rgba(28, 90, 151, 0.25),
              rgba(8, 14, 24, 0.4) 65%
            );
          box-shadow:
            0 30px 90px rgba(0, 0, 0, 0.28),
            inset 0 1px 0 rgba(255, 255, 255, 0.04);
        }

        .about-art-lines {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(
              rgba(125, 180, 237, 0.12) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(125, 180, 237, 0.12) 1px,
              transparent 1px
            );
          background-size: 28px 28px;
          mask-image: radial-gradient(circle, black, transparent 75%);
          animation: aboutGrid 18s linear infinite;
        }

        .about-art-center {
          position: relative;
          z-index: 1;
          width: 175px;
          height: 175px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(125, 194, 255, 0.45);
          border-radius: 50%;
          background: rgba(9, 19, 33, 0.9);
          box-shadow: 0 0 65px rgba(39, 140, 255, 0.15);
          animation: corePulse 5s ease-in-out infinite;
        }

        .about-logo-image {
          display: block;
          width: 100%;
          height: 100%;
          max-width: 158px;
          max-height: 158px;
          object-fit: contain;
          filter: drop-shadow(0 0 22px rgba(64, 158, 255, 0.24));
        }

        .about-data {
          position: absolute;
          z-index: 2;
          color: #a4bad5;
          font-size: 8px;
          letter-spacing: 0.15em;
        }

        .data-a {
          top: 22px;
          left: 20px;
        }

        .data-b {
          right: 20px;
          bottom: 22px;
        }

        .about-corner {
          position: absolute;
          width: 25px;
          height: 25px;
          border-color: #278cff;
          border-style: solid;
        }

        .corner-a {
          top: 12px;
          right: 12px;
          border-width: 1px 1px 0 0;
        }

        .corner-b {
          bottom: 12px;
          left: 12px;
          border-width: 0 0 1px 1px;
        }

        .about-copy > p:not(.section-kicker) {
          color: #9ba9bc;
          font-size: 13px;
          line-height: 1.95;
        }

        .about-copy .button {
          margin-top: 14px;
        }

        /* =========================================================
           ACADEMY
           ========================================================= */

        .academy-section {
          padding-bottom: 120px;
        }

        .learning-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
        }

        .learning-card {
          min-width: 0;
          padding: 25px;
          border: 1px solid rgba(163, 193, 231, 0.13);
          border-radius: 17px;
          background: rgba(13, 21, 33, 0.68);
          box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.025);
          transition:
            transform 0.3s ease,
            border-color 0.3s ease,
            background 0.3s ease;
        }

        .learning-card:hover {
          transform: translateY(-5px);
          border-color: rgba(67, 155, 255, 0.48);
          background: rgba(18, 34, 53, 0.82);
        }

        .learning-icon {
          display: grid;
          width: 47px;
          height: 47px;
          place-items: center;
          border: 1px solid rgba(88, 165, 244, 0.25);
          border-radius: 13px;
          background: rgba(39, 140, 255, 0.08);
          color: #a4d4ff;
          font-size: 18px;
          animation: iconGlow 3.2s ease-in-out infinite;
        }

        .learning-label {
          margin: 22px 0 9px;
          color: #65b4ff;
          font-size: 9px;
          letter-spacing: 0.17em;
        }

        .learning-card h3 {
          margin: 0;
          font-size: 18px;
          line-height: 1.5;
        }

        .learning-description {
          min-height: 67px;
          color: #91a0b4;
          font-size: 12px;
          line-height: 1.85;
        }

        .learning-card .text-link {
          margin-top: 14px;
        }

        .academy-banner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
          margin-top: 23px;
          padding: 30px;
          border: 1px solid rgba(78, 155, 242, 0.23);
          border-radius: 18px;
          background:
            linear-gradient(
              105deg,
              rgba(17, 47, 79, 0.6),
              rgba(12, 20, 33, 0.65)
            );
        }

        .academy-banner .section-kicker {
          margin-bottom: 10px;
        }

        .academy-banner h3 {
          margin: 0;
          font-size: 22px;
          letter-spacing: -0.03em;
        }

        .academy-banner p:not(.section-kicker) {
          margin: 9px 0 0;
          color: #9ba9bc;
          font-size: 12px;
          line-height: 1.8;
        }

        .academy-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        /* =========================================================
           REGISTRATION
           ========================================================= */

        .registration-section {
          padding-block: 100px;
          border-block: 1px solid rgba(220, 235, 255, 0.07);
          background: rgba(10, 16, 26, 0.72);
        }

        .registration-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
        }

        .registration-card {
          position: relative;
          min-width: 0;
          overflow: hidden;
          padding: 34px;
          border: 1px solid rgba(163, 193, 231, 0.15);
          border-radius: 19px;
          background: #0c1420;
        }

        .registration-card::after {
          position: absolute;
          content: "";
          top: -100px;
          right: -100px;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: #278cff;
          filter: blur(85px);
          opacity: 0.12;
          pointer-events: none;
        }

        .student-card::after {
          background: #63baff;
          opacity: 0.09;
        }

        .registration-icon {
          display: grid;
          width: 52px;
          height: 52px;
          place-items: center;
          margin-bottom: 26px;
          border: 1px solid rgba(91, 170, 255, 0.28);
          border-radius: 15px;
          background: rgba(39, 140, 255, 0.09);
          color: #9bd1ff;
          font-size: 24px;
        }

        .registration-card .section-kicker {
          margin-bottom: 13px;
        }

        .registration-card h3 {
          margin: 0;
          font-size: 28px;
          letter-spacing: -0.04em;
          line-height: 1.25;
        }

        .registration-card > p:not(.section-kicker) {
          min-height: 72px;
          max-width: 500px;
          color: #96a5b9;
          font-size: 13px;
          line-height: 1.9;
        }

        .registration-card .button {
          position: relative;
          z-index: 1;
          margin-top: 10px;
        }

        .secondary-card-link {
          display: block;
          width: fit-content;
          margin-top: 19px;
          color: #a5bdd8;
          font-size: 11px;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .secondary-card-link:hover {
          color: #fff;
        }

        .form-note {
          margin: 18px 0 0;
          color: #8b9bb0;
          font-size: 10px;
          line-height: 1.7;
        }

        /* =========================================================
           PROJECTS
           ========================================================= */

        .projects-section {
          padding-block: 105px;
        }

        .project-panel {
          position: relative;
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: center;
          min-height: 360px;
          overflow: hidden;
          padding: 55px;
          border: 1px solid rgba(105, 171, 243, 0.2);
          border-radius: 24px;
          background:
            linear-gradient(
              110deg,
              #101e30,
              #0a111d 70%
            );
          box-shadow:
            0 30px 90px rgba(0, 0, 0, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.03);
        }

        .project-panel-copy {
          position: relative;
          z-index: 2;
        }

        .project-panel h2 {
          max-width: 650px;
          margin: 0;
          font-size: clamp(32px, 4vw, 48px);
          line-height: 1.12;
          letter-spacing: -0.05em;
        }

        .project-panel-copy > p:not(.section-kicker) {
          max-width: 550px;
          color: #97a7bc;
          font-size: 13px;
          line-height: 1.9;
        }

        .project-visual {
          position: relative;
          min-width: 0;
          min-height: 270px;
          display: grid;
          place-items: center;
        }

        .project-ring {
          position: absolute;
          aspect-ratio: 1;
          border: 1px solid rgba(84, 165, 255, 0.3);
          border-radius: 50%;
        }

        .ring-one {
          width: 240px;
          animation: orbitSpin 30s linear infinite;
        }

        .ring-two {
          width: 190px;
          border-style: dashed;
          animation: orbitSpin 20s linear infinite reverse;
        }

        .ring-three {
          width: 130px;
          border-color: rgba(121, 201, 255, 0.5);
        }

        .project-core {
          position: relative;
          z-index: 1;
          display: grid;
          width: 83px;
          height: 83px;
          place-items: center;
          border: 1px solid rgba(124, 195, 255, 0.55);
          border-radius: 22px;
          background: #102844;
          box-shadow: 0 0 55px rgba(39, 140, 255, 0.22);
          transform: rotate(45deg);
          transition:
            box-shadow 0.3s ease,
            border-color 0.3s ease;
        }

        .project-logo-image {
          display: block;
          width: 110px;
          height: 110px;
          object-fit: contain;
          transform: rotate(-45deg) scale(1.12);
          filter: drop-shadow(0 0 16px rgba(64, 158, 255, 0.3));
        }

        .project-panel:hover .project-core {
          border-color: #69c8ff;
          box-shadow: 0 0 70px rgba(39, 140, 255, 0.36);
        }

        .project-cross {
          position: absolute;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #9bdcff;
          box-shadow: 0 0 18px 5px rgba(39, 140, 255, 0.4);
          animation: packetPulse 2.6s ease-in-out infinite;
        }

        .cross-one {
          top: 18%;
          right: 18%;
        }

        .cross-two {
          left: 18%;
          bottom: 17%;
          animation-delay: -1s;
        }

        /* =========================================================
           CONTACT
           ========================================================= */

        .contact-section {
          padding-block: 95px;
          border-top: 1px solid rgba(220, 235, 255, 0.08);
          background:
            linear-gradient(
              110deg,
              rgba(11, 24, 40, 0.85),
              rgba(7, 10, 16, 0.95)
            );
        }

        .contact-layout {
          display: grid;
          grid-template-columns: 1fr 0.85fr;
          align-items: center;
          gap: 90px;
        }

        .contact-copy > p:not(.section-kicker) {
          max-width: 450px;
          color: #9ba9bc;
          font-size: 13px;
          line-height: 1.9;
        }

        .contact-options {
          display: grid;
          gap: 10px;
        }

        .contact-option {
          position: relative;
          display: flex;
          align-items: center;
          min-width: 0;
          gap: 15px;
          padding: 17px;
          overflow: hidden;
          border: 1px solid rgba(163, 193, 231, 0.14);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.025);
          color: white;
          text-decoration: none;
          transition:
            border-color 0.2s ease,
            transform 0.2s ease,
            background 0.2s ease;
        }

        .contact-option::before {
          position: absolute;
          inset: 0;
          content: "";
          background:
            linear-gradient(
              110deg,
              transparent 20%,
              rgba(111, 190, 255, 0.08) 50%,
              transparent 80%
            );
          transform: translateX(-120%);
          transition: transform 0.65s ease;
          pointer-events: none;
        }

        .contact-option:hover::before {
          transform: translateX(120%);
        }

        .contact-option:hover {
          transform: translateX(4px);
          border-color: rgba(75, 161, 255, 0.5);
          background: rgba(39, 140, 255, 0.06);
        }

        .contact-option-icon {
          position: relative;
          z-index: 1;
          display: grid;
          width: 42px;
          height: 42px;
          flex-shrink: 0;
          place-items: center;
          border: 1px solid rgba(88, 165, 244, 0.22);
          border-radius: 12px;
          color: #9bd1ff;
        }

        .contact-option > span:nth-child(2) {
          position: relative;
          z-index: 1;
          display: grid;
          min-width: 0;
          gap: 5px;
        }

        .contact-option small {
          color: #8aadd4;
          font-size: 8px;
          letter-spacing: 0.18em;
        }

        .contact-option strong {
          overflow-wrap: anywhere;
          color: #d6e3f4;
          font-size: 12px;
          font-weight: 600;
        }

        .contact-arrow {
          position: relative;
          z-index: 1;
          margin-left: auto;
          color: #83c5ff;
        }

        /* =========================================================
           SOCIAL
           ========================================================= */

        .social-section {
          position: relative;
          padding-block: 92px;
          border-top: 1px solid rgba(220, 235, 255, 0.08);
          background:
            linear-gradient(
              180deg,
              rgba(7, 14, 24, 0.72),
              rgba(5, 9, 15, 0.94)
            );
          overflow: hidden;
        }

        .social-section::before {
          position: absolute;
          content: "";
          width: 520px;
          height: 520px;
          top: -280px;
          right: -170px;
          border-radius: 50%;
          background: rgba(39, 140, 255, 0.12);
          filter: blur(100px);
          pointer-events: none;
        }

        .social-panel {
          position: relative;
          display: grid;
          grid-template-columns: 0.82fr 1.18fr;
          gap: 55px;
          align-items: center;
          padding: 42px;
          border: 1px solid rgba(105, 171, 243, 0.18);
          border-radius: 24px;
          background:
            linear-gradient(
              125deg,
              rgba(14, 29, 47, 0.78),
              rgba(7, 13, 22, 0.72)
            );
          box-shadow: 0 30px 90px rgba(0, 0, 0, 0.28);
          overflow: hidden;
        }

        .social-panel::before {
          position: absolute;
          content: "";
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(105, 200, 255, 0.045),
              transparent
            );
          transform: translateX(-100%);
          animation: socialSweep 8s ease-in-out infinite;
        }

        .social-copy {
          position: relative;
          z-index: 1;
        }

        .social-copy h2 {
          max-width: 600px;
          margin: 0;
          font-size: clamp(32px, 4vw, 48px);
          line-height: 1.12;
          letter-spacing: -0.05em;
        }

        .social-copy > p:last-child {
          max-width: 510px;
          margin: 19px 0 0;
          color: #97a7bc;
          font-size: 13px;
          line-height: 1.9;
        }

        .social-links {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .social-link {
          position: relative;
          display: flex;
          min-width: 0;
          min-height: 88px;
          align-items: center;
          gap: 13px;
          padding: 15px;
          overflow: hidden;
          border: 1px solid rgba(163, 193, 231, 0.13);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.025);
          color: white;
          text-decoration: none;
          transition:
            transform 0.3s ease,
            border-color 0.3s ease,
            background 0.3s ease,
            box-shadow 0.3s ease;
        }

        .social-link::after {
          position: absolute;
          content: "";
          inset: 0;
          background:
            linear-gradient(
              115deg,
              transparent 35%,
              rgba(105, 200, 255, 0.08),
              transparent 65%
            );
          transform: translateX(-100%);
          transition: transform 0.5s ease;
          pointer-events: none;
        }

        .social-link:hover {
          transform: translateY(-4px);
          border-color: rgba(69, 165, 255, 0.5);
          background: rgba(39, 140, 255, 0.065);
          box-shadow: 0 16px 42px rgba(0, 0, 0, 0.25);
        }

        .social-link:hover::after {
          transform: translateX(100%);
        }

        .social-icon {
          position: relative;
          z-index: 1;
          display: grid;
          width: 46px;
          height: 46px;
          flex-shrink: 0;
          place-items: center;
          border: 1px solid rgba(88, 165, 244, 0.24);
          border-radius: 13px;
          background: rgba(39, 140, 255, 0.07);
          color: #8fcaff;
          transition:
            transform 0.3s ease,
            border-color 0.3s ease,
            color 0.3s ease,
            background 0.3s ease;
        }

        .social-icon svg {
          width: 20px;
          height: 20px;
        }

        .social-link:hover .social-icon {
          transform: scale(1.06);
          border-color: rgba(105, 200, 255, 0.6);
          background: rgba(39, 140, 255, 0.14);
          color: #ffffff;
        }

        .social-link-copy {
          position: relative;
          z-index: 1;
          display: grid;
          min-width: 0;
          gap: 5px;
        }

        .social-link-copy strong {
          color: #e1ebf8;
          font-size: 12px;
          font-weight: 700;
        }

        .social-link-copy small {
          color: #6885a5;
          font-size: 7px;
          letter-spacing: 0.17em;
        }

        .social-arrow {
          position: relative;
          z-index: 1;
          margin-left: auto;
          color: #74bcff;
          font-size: 15px;
          transition:
            transform 0.3s ease,
            color 0.3s ease;
        }

        .social-link:hover .social-arrow {
          transform: translate(3px, -3px);
          color: #ffffff;
        }

        /* =========================================================
           FOOTER
           ========================================================= */

        .site-footer {
          border-top: 1px solid rgba(220, 235, 255, 0.08);
          background: #06090e;
        }

        .footer-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding-block: 32px;
        }

        .footer-brand {
          display: inline-flex;
          align-items: center;
        }

        .footer-logo {
          display: block;
          width: 160px;
          height: auto;
          max-height: 56px;
          object-fit: contain;
          filter: drop-shadow(0 0 7px rgba(39, 140, 255, 0.15));
        }

        .footer-main > p {
          color: #8b9bb0;
          font-size: 11px;
        }

        .footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 17px;
        }

        .footer-links a {
          font-size: 11px;
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          gap: 20px;
          padding-block: 18px 22px;
          border-top: 1px solid rgba(220, 235, 255, 0.06);
          color: #8797ad;
          font-size: 10px;
        }

        .footer-bottom a {
          color: #a7c5e6;
          text-decoration: none;
          transition: color 0.2s ease;
        }

        .footer-bottom a:hover {
          color: white;
        }

        /* =========================================================
           REVEAL
           ========================================================= */

        .reveal {
          opacity: 1;
          transform: none;
        }

        .motion-ready .reveal:not(.is-visible) {
          opacity: 0;
          transform: translateY(18px);
        }

        .motion-ready .reveal.is-visible {
          opacity: 1;
          transform: translateY(0);
          transition:
            opacity 0.7s ease,
            transform 0.7s cubic-bezier(0.2, 0.75, 0.25, 1);
        }

        /* =========================================================
           FOCUS
           ========================================================= */

        .vexora-site a:focus-visible,
        .vexora-site button:focus-visible {
          outline: 2px solid #69c8ff;
          outline-offset: 5px;
          box-shadow: 0 0 0 5px rgba(39, 140, 255, 0.13);
        }

        .vexora-site ::selection {
          color: #ffffff;
          background: rgba(39, 140, 255, 0.42);
        }

        /* =========================================================
           ANIMATIONS
           ========================================================= */

        @keyframes backgroundGridMove {
          from {
            background-position: 0 0;
          }

          to {
            background-position: 90px 90px;
          }
        }

        @keyframes gridPerspective {
          from {
            background-position: 0 0;
          }

          to {
            background-position: 0 140px;
          }
        }

        @keyframes gridPerspectiveReverse {
          from {
            background-position: 0 0;
          }

          to {
            background-position: 140px 0;
          }
        }

        @keyframes glowFloatA {
          from {
            transform: translate3d(0, 0, 0) scale(1);
          }

          to {
            transform: translate3d(100px, 90px, 0) scale(1.15);
          }
        }

        @keyframes glowFloatB {
          from {
            transform: translate3d(0, 0, 0) scale(1);
          }

          to {
            transform: translate3d(-90px, -70px, 0) scale(1.2);
          }
        }

        @keyframes glowFloatC {
          from {
            transform: translate3d(0, 0, 0) scale(1);
          }

          to {
            transform: translate3d(70px, -50px, 0) scale(1.1);
          }
        }

        @keyframes scanVertical {
          0% {
            transform: translateY(-35vh);
            opacity: 0;
          }

          15% {
            opacity: 0.7;
          }

          50% {
            opacity: 0.3;
          }

          100% {
            transform: translateY(125vh);
            opacity: 0;
          }
        }

        @keyframes beamMoveA {
          from {
            transform: translateX(-18vw) rotate(19deg);
          }

          to {
            transform: translateX(22vw) rotate(19deg);
          }
        }

        @keyframes beamMoveB {
          from {
            transform: translateX(16vw) rotate(-12deg);
          }

          to {
            transform: translateX(-20vw) rotate(-12deg);
          }
        }

        @keyframes beamMoveC {
          from {
            transform: translateX(12vw) rotate(24deg);
          }

          to {
            transform: translateX(-18vw) rotate(24deg);
          }
        }

        @keyframes networkFlow {
          from {
            stroke-dashoffset: 0;
          }

          to {
            stroke-dashoffset: -240;
          }
        }

        @keyframes packetPulse {
          0%,
          100% {
            opacity: 0.45;
            transform: scale(0.8);
          }

          50% {
            opacity: 1;
            transform: scale(1.35);
          }
        }

        @keyframes starPulse {
          0%,
          100% {
            opacity: 0.18;
            transform: scale(0.65);
          }

          50% {
            opacity: 0.9;
            transform: scale(1.35);
          }
        }

        @keyframes dataTravelA {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(155vw);
          }
        }

        @keyframes dataTravelB {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(165vw);
          }
        }

        @keyframes dataTravelC {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-165vw);
          }
        }

        @keyframes logoAura {
          0%,
          100% {
            filter: drop-shadow(
              0 0 3px rgba(39, 140, 255, 0.18)
            );
          }

          50% {
            filter:
              drop-shadow(0 0 11px rgba(105, 200, 255, 0.48))
              drop-shadow(0 0 20px rgba(39, 140, 255, 0.2));
          }
        }

        @keyframes statusPulse {
          0%,
          100% {
            transform: scale(0.8);
            opacity: 0.6;
          }

          50% {
            transform: scale(1.15);
            opacity: 1;
          }
        }

        @keyframes orbitSpin {
          from {
            transform: rotateX(62deg) rotate(-25deg);
          }

          to {
            transform: rotateX(62deg) rotate(335deg);
          }
        }

        @keyframes orbitGlow {
          0%,
          100% {
            opacity: 0.55;
          }

          50% {
            opacity: 1;
            box-shadow: 0 0 30px rgba(39, 140, 255, 0.14);
          }
        }

        @keyframes chipFloat {
          0%,
          100% {
            translate: 0 0;
          }

          50% {
            translate: 0 -10px;
          }
        }

        @keyframes logoBreath {
          0%,
          100% {
            filter: drop-shadow(
              0 0 18px rgba(64, 158, 255, 0.2)
            );
            transform: scale(0.98);
          }

          50% {
            filter: drop-shadow(
              0 0 28px rgba(64, 158, 255, 0.38)
            );
            transform: scale(1.02);
          }
        }

        @keyframes corePulse {
          0%,
          100% {
            box-shadow:
              0 0 50px rgba(39, 140, 255, 0.16),
              inset 0 0 35px rgba(65, 155, 255, 0.1);
          }

          50% {
            box-shadow:
              0 0 85px rgba(39, 140, 255, 0.28),
              inset 0 0 40px rgba(65, 155, 255, 0.18);
          }
        }

        @keyframes sparkPulse {
          0%,
          100% {
            opacity: 0.35;
            transform: scale(0.7);
          }

          50% {
            opacity: 1;
            transform: scale(1.4);
          }
        }

        @keyframes tickerMove {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @keyframes ambientFloat {
          from {
            transform: translate3d(0, 0, 0) scale(1);
          }

          to {
            transform: translate3d(-30px, 45px, 0) scale(1.15);
          }
        }

        @keyframes ambientFloatReverse {
          from {
            transform: translate3d(0, 0, 0) scale(1);
          }

          to {
            transform: translate3d(35px, -50px, 0) scale(1.12);
          }
        }

        @keyframes iconGlow {
          0%,
          100% {
            box-shadow: 0 0 0 rgba(39, 140, 255, 0);
            text-shadow: 0 0 0 rgba(105, 200, 255, 0);
          }

          50% {
            box-shadow: 0 0 20px rgba(39, 140, 255, 0.13);
            text-shadow: 0 0 12px rgba(105, 200, 255, 0.55);
          }
        }

        @keyframes visualSweep {
          0%,
          45% {
            transform: translateX(-120%);
          }

          80%,
          100% {
            transform: translateX(120%);
          }
        }

        @keyframes codeFlicker {
          from {
            opacity: 0.36;
            transform: scaleX(0.86);
            transform-origin: left;
          }

          to {
            opacity: 1;
            transform: scaleX(1);
            transform-origin: left;
          }
        }

        @keyframes cursorBlink {
          to {
            opacity: 0;
          }
        }

        @keyframes terminalBlink {
          50% {
            opacity: 0.35;
          }
        }

        @keyframes terminalType {
          0%,
          20%,
          100% {
            opacity: 1;
          }

          10% {
            opacity: 0.5;
          }
        }

        @keyframes scanDown {
          from {
            transform: translateY(0);
          }

          to {
            transform: translateY(108px);
          }
        }

        @keyframes networkPulse {
          0%,
          100% {
            opacity: 0.6;
            transform: scale(0.85);
          }

          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes barRise {
          from {
            transform: scaleY(0.72);
            opacity: 0.55;
          }

          to {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        @keyframes drawMarketing {
          0% {
            stroke-dashoffset: 420;
          }

          70%,
          100% {
            stroke-dashoffset: 0;
          }
        }

        @keyframes aboutGrid {
          from {
            background-position: 0 0;
          }

          to {
            background-position: 28px 28px;
          }
        }

        @keyframes socialSweep {
          0%,
          55% {
            transform: translateX(-100%);
          }

          80%,
          100% {
            transform: translateX(100%);
          }
        }

        /* =========================================================
           TABLET
           ========================================================= */

        @media (max-width: 1120px) {
          .main-nav {
            gap: 13px;
          }

          .main-nav a {
            font-size: 11px;
          }

          .hero-inner {
            gap: 0;
          }

          .hero-title {
            font-size: clamp(46px, 6vw, 70px);
          }

          .about-layout {
            gap: 48px;
          }

          .project-panel {
            padding: 40px;
          }

          .contact-layout {
            gap: 45px;
          }
        }

        /* =========================================================
           MOBILE NAV + TABLET
           ========================================================= */

        @media (max-width: 820px) {
          .page-width,
          .header-inner {
            width: min(calc(100% - 36px), 650px);
          }

          .header-inner {
            min-height: 75px;
          }

          .brand-logo {
            width: 155px;
            max-height: 56px;
          }

          .menu-toggle {
            display: flex;
            width: 42px;
            height: 42px;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 5px;
            border: 1px solid rgba(163, 193, 231, 0.2);
            border-radius: 12px;
            background: rgba(255, 255, 255, 0.03);
            cursor: pointer;
          }

          .menu-toggle span {
            display: block;
            width: 17px;
            height: 1.5px;
            border-radius: 2px;
            background: #d8e9fb;
            transition:
              transform 0.22s ease,
              opacity 0.22s ease;
          }

          .menu-toggle-open span:first-child {
            transform: translateY(6.5px) rotate(45deg);
          }

          .menu-toggle-open span:nth-child(2) {
            opacity: 0;
          }

          .menu-toggle-open span:last-child {
            transform: translateY(-6.5px) rotate(-45deg);
          }

          .main-nav {
            position: absolute;
            top: calc(100% + 1px);
            left: 0;
            right: 0;
            display: none;
            align-items: stretch;
            gap: 0;
            padding: 12px 18px 18px;
            border-bottom: 1px solid rgba(220, 235, 255, 0.12);
            background: rgba(5, 8, 14, 0.98);
            box-shadow: 0 20px 35px rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(22px);
          }

          .main-nav-open {
            display: flex;
            flex-direction: column;
          }

          .main-nav a,
          .main-nav .nav-login {
            padding: 14px 8px;
            border-bottom: 1px solid rgba(220, 235, 255, 0.06);
            font-size: 13px;
          }

          .main-nav .button {
            width: 100%;
            margin-top: 12px;
            padding: 0 18px;
          }

          .hero-inner {
            min-height: auto;
            grid-template-columns: 1fr;
            padding-block: 75px 55px;
          }

          .hero-copy {
            max-width: 690px;
          }

          .hero-title {
            font-size: clamp(48px, 10vw, 76px);
          }

          .hero-visual {
            min-height: 410px;
            margin-top: 20px;
          }

          .section {
            padding-block: 80px;
          }

          .section-heading {
            align-items: flex-start;
            flex-direction: column;
            gap: 16px;
            margin-bottom: 30px;
          }

          .section-intro {
            max-width: 620px;
          }

          .service-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .service-card {
            min-height: 300px;
            height: auto;
          }

          .service-visual {
            height: 104px;
          }

          .about-layout {
            grid-template-columns: 1fr;
            gap: 25px;
            padding-block: 75px;
          }

          .about-art {
            min-height: 320px;
          }

          .about-art-frame {
            width: min(330px, 100%);
          }

          .learning-grid {
            grid-template-columns: 1fr;
          }

          .learning-description {
            min-height: auto;
          }

          .academy-banner {
            align-items: flex-start;
            flex-direction: column;
          }

          .registration-section {
            padding-block: 75px;
          }

          .registration-grid {
            grid-template-columns: 1fr;
          }

          .registration-card > p:not(.section-kicker) {
            min-height: auto;
          }

          .project-panel {
            grid-template-columns: 1fr;
            padding: 34px;
          }

          .project-visual {
            min-height: 240px;
          }

          .contact-layout {
            grid-template-columns: 1fr;
            gap: 25px;
          }

          .social-panel {
            grid-template-columns: 1fr;
            gap: 30px;
            padding: 30px;
          }

          .footer-main {
            align-items: flex-start;
            flex-direction: column;
            gap: 17px;
          }

          .tech-hud {
            display: none;
          }
        }

        /* =========================================================
           SMALL PHONES
           ========================================================= */

        @media (max-width: 520px) {
          .page-width,
          .header-inner {
            width: calc(100% - 32px);
          }

          .hero-inner {
            padding-top: 55px;
          }

          .eyebrow {
            font-size: 8px;
            letter-spacing: 0.14em;
          }

          .hero-title {
            font-size: clamp(43px, 12vw, 59px);
          }

          .hero-description {
            font-size: 13px;
          }

          .hero-actions {
            align-items: stretch;
            flex-direction: column;
          }

          .hero-actions .button {
            width: 100%;
          }

          .hero-proof {
            align-items: flex-start;
            font-size: 10px;
            line-height: 1.7;
          }

          .hero-visual {
            min-height: 330px;
            margin-inline: -15px;
            transform: scale(0.94);
          }

          .visual-core {
            width: 145px;
            height: 145px;
          }

          .orbit-middle {
            width: 275px;
          }

          .orbit-inner {
            width: 215px;
          }

          .float-chip {
            padding: 9px;
            font-size: 7px;
          }

          .chip-code {
            left: 0;
            top: 25px;
          }

          .chip-security {
            right: 0;
            top: 64px;
          }

          .chip-data {
            left: 0;
            bottom: 48px;
          }

          .chip-network {
            right: 0;
            bottom: 26px;
          }

          .section {
            padding-block: 66px;
          }

          .section-heading h2,
          .about-copy h2,
          .contact-copy h2 {
            font-size: 35px;
          }

          .service-grid {
            grid-template-columns: 1fr;
          }

          .service-card {
            min-height: auto;
          }

          .about-art {
            min-height: 275px;
          }

          .about-art-frame {
            width: 275px;
          }

          .about-art-center {
            width: 145px;
            height: 145px;
          }

          .academy-banner {
            padding: 22px;
          }

          .academy-banner h3 {
            font-size: 20px;
          }

          .academy-actions {
            width: 100%;
            flex-direction: column;
          }

          .academy-actions .button {
            width: 100%;
          }

          .registration-card {
            padding: 25px;
          }

          .registration-card h3 {
            font-size: 24px;
          }

          .project-panel {
            padding: 25px;
          }

          .social-section {
            padding-block: 66px;
          }

          .social-panel {
            width: calc(100% - 32px);
            padding: 23px;
            border-radius: 20px;
          }

          .social-links {
            grid-template-columns: 1fr;
          }

          .social-copy h2 {
            font-size: 35px;
          }

          .social-link {
            min-height: 80px;
          }

          .project-visual {
            min-height: 215px;
          }

          .ring-one {
            width: 200px;
          }

          .ring-two {
            width: 160px;
          }

          .ring-three {
            width: 115px;
          }

          .contact-option {
            gap: 10px;
            padding: 13px;
          }

          .contact-option strong {
            font-size: 10px;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 10px;
          }

          .footer-links {
            gap: 14px;
          }

          .tech-data {
            font-size: 6px;
          }

          .data-stream-a {
            top: 30%;
          }

          .data-stream-b {
            top: 60%;
          }

          .tech-grid {
            opacity: 0.11;
          }

          .tech-network {
            opacity: 0.32;
          }
        }

        /* =========================================================
           REDUCED MOTION
           ========================================================= */

        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }

          .vexora-site *,
          .vexora-site *::before,
          .vexora-site *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }

          .motion-ready .reveal,
          .motion-ready .reveal:not(.is-visible) {
            opacity: 1 !important;
            transform: none !important;
          }
        }
      `}</style>
    </main>
  );
}