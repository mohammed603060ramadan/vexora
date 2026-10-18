
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const CLIENT_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLSdwOFGJ0DlD6vSoxeJatKi8SPrHKZCZnTR8yMy4CvA0Jly8-g/viewform?usp=dialog";

const STUDENT_FORM_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScxhSiUQJ2gG6w7Mh6nzpd__2Cf7N1qTbLjviyUiWMNmB7HVw/viewform?usp=publish-editor";

const WHATSAPP_URL = "https://wa.me/201115449868";
const EMAIL = "vexore.mr@gmail.com";

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

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".vexora-site");
    if (!root) return;

    const nodes = root.querySelectorAll<HTMLElement>(".reveal");

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (
      reduceMotion ||
      !("IntersectionObserver" in window)
    ) {
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
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />

      {/* Navigation */}
      <header className="site-header">
        <div className="header-inner">
          <Link
            href="/"
            className="brand"
            aria-label="VEXORA homepage"
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
            <Link href="/academy" onClick={closeMenu}>
              Academy
            </Link>
            <Link href="/projects" onClick={closeMenu}>
              Projects
            </Link>
            <Link href="/contact" onClick={closeMenu}>
              Contact
            </Link>
            <Link
              href="/login"
              className="nav-login"
              onClick={closeMenu}
            >
              Login
            </Link>
            <Link
              href="/admin-login"
              className="nav-admin"
              onClick={closeMenu}
              aria-label="Administrator login"
              title="Administrator login"
            >
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span>Admin</span>
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
              data analytics, and digital marketing together to help businesses
              build with clarity and move forward with confidence.
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
              <span className="core-mark">V</span>
              <span className="core-label">VEXORA</span>
              <span className="core-subtitle">TECHNOLOGY</span>
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
              <div className="ticker-group" key={group} aria-hidden={group === 1}>
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
            From your first idea to your next stage of growth, explore services
            designed to solve real problems and create practical value.
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
                <span>V</span>
                <small>THINK · BUILD · SECURE</small>
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
              business needs. Our goal is to recommend and build solutions that
              are useful, secure, and made to support the people who use them.
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
              <p className="learning-description">{path.description}</p>

              <Link href="/academy" className="text-link">
                Explore learning path <span aria-hidden="true">↗</span>
              </Link>
            </article>
          ))}
        </div>

        <div className="academy-banner reveal">
          <div>
            <p className="section-kicker">YOUR NEXT STEP STARTS HERE</p>
            <h3>Ready to start learning with VEXORA?</h3>
            <p>
              Visit the Academy page for training information and registration.
            </p>
          </div>

          <div className="academy-actions">
            <Link href="/academy" className="button">
              Explore Academy <span aria-hidden="true">↗</span>
            </Link>

            <a
              href={STUDENT_FORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="button button-outline"
              aria-label="Open student registration form in a new tab"
            >
              Student registration <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* Registration */}
      <section id="registration" className="registration-section">
        <div className="page-width">
          <div className="section-heading reveal">
            <div>
              <p className="section-kicker">LET&apos;S CONNECT / 04</p>
              <h2>
                Choose your <span className="gradient-text">next step.</span>
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

              <a
                href={CLIENT_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="button"
              >
                Client inquiry form <span aria-hidden="true">↗</span>
              </a>

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

              <a
                href={STUDENT_FORM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="button"
              >
                Student registration <span aria-hidden="true">↗</span>
              </a>

              <Link href="/academy" className="secondary-card-link">
                Visit VEXORA Academy <span aria-hidden="true">→</span>
              </Link>
            </article>
          </div>

          <p className="form-note reveal">
            Registration forms open on Google Forms in a new tab. If a form
            does not open, check its public responder link and sharing settings.
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
              <span>VX</span>
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
              Tell us what you&apos;re working on. We&apos;ll help you explore a
              practical next step.
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

      {/* Footer */}
      <footer className="site-footer">
        <div className="page-width footer-main">
          <Link
            href="/"
            className="footer-brand"
            aria-label="VEXORA homepage"
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
            <Link href="/academy">Academy</Link>
            <Link href="/projects">Projects</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>

        <div className="page-width footer-bottom">
          <span>© 2026 VEXORA Technology. All rights reserved.</span>

          <a href="#top">Back to top ↑</a>
        </div>
      </footer>

      <style jsx global>{`
        :root {
          --vx-bg: #070a10;
          --vx-panel: #0d1420;
          --vx-blue: #278cff;
          --vx-cyan: #69c8ff;
          --vx-silver: #dce7f5;
          --vx-muted: #9ba9bc;
        }

        html {
          scroll-behavior: smooth;
          scroll-padding-top: 100px;
        }

        body {
          margin: 0;
          background: var(--vx-bg);
        }

        .vexora-site {
          position: relative;
          isolation: isolate;
          min-height: 100vh;
          overflow: hidden;
          background:
            radial-gradient(
              ellipse at 50% -10%,
              rgba(27, 103, 190, 0.13),
              transparent 48%
            ),
            var(--vx-bg);
          color: #f7faff;
          font-family: Arial, Helvetica, sans-serif;
        }

        .vexora-site *,
        .vexora-site *::before,
        .vexora-site *::after {
          box-sizing: border-box;
        }

        .vexora-site a {
          -webkit-tap-highlight-color: transparent;
        }

        .page-width {
          width: min(1240px, calc(100% - 48px));
          margin-inline: auto;
        }

        .ambient {
          position: absolute;
          z-index: -1;
          pointer-events: none;
          border-radius: 999px;
          filter: blur(100px);
          opacity: 0.22;
        }

        .ambient-one {
          width: 400px;
          height: 400px;
          top: 160px;
          right: -180px;
          background: #1269d5;
          animation: ambientFloat 14s ease-in-out infinite alternate;
        }

        .ambient-two {
          width: 330px;
          height: 330px;
          top: 1000px;
          left: -180px;
          background: #0b80b9;
          animation: ambientFloat 18s ease-in-out infinite alternate-reverse;
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          z-index: -1;
          pointer-events: none;
          opacity: 0.13;
          background-image:
            linear-gradient(rgba(150, 190, 230, 0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(150, 190, 230, 0.08) 1px, transparent 1px);
          background-size: 62px 62px;
          mask-image: linear-gradient(to bottom, black, transparent 80%);
        }

        /* Header and navigation */

        .site-header {
          position: sticky;
          top: 0;
          z-index: 50;
          border-bottom: 1px solid rgba(220, 235, 255, 0.09);
          background: rgba(7, 10, 16, 0.86);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
        }

        .header-inner {
          width: min(1360px, calc(100% - 48px));
          min-height: 86px;
          margin: auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 26px;
        }

        .brand {
          display: inline-flex;
          align-items: center;
          flex-shrink: 0;
        }

        .brand-logo {
          display: block;
          width: 190px;
          height: auto;
          max-height: 66px;
          object-fit: contain;
          transition: filter 0.25s ease;
        }

        .brand:hover .brand-logo {
          filter: drop-shadow(0 0 10px rgba(69, 165, 255, 0.24));
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
          transition: color 0.2s ease;
          white-space: nowrap;
        }

        .main-nav a:hover,
        .footer-links a:hover {
          color: var(--vx-cyan);
        }

        .main-nav .nav-login {
          padding-left: 8px;
        }

        .main-nav .nav-admin {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 9px 12px;
          border: 1px solid rgba(39, 140, 255, 0.35);
          border-radius: 10px;
          background: rgba(39, 140, 255, 0.08);
          color: #8ecaff;
          font-size: 12px;
          font-weight: 700;
        }

        .main-nav .nav-admin:hover {
          border-color: #278cff;
          background: rgba(39, 140, 255, 0.16);
          color: #ffffff;
        }

        .menu-toggle {
          display: none;
        }

        /* Buttons */

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
          background: linear-gradient(115deg, #1687ff, #1763ce);
          box-shadow: 0 8px 28px rgba(22, 135, 255, 0.16);
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

        .button:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 34px rgba(22, 135, 255, 0.3);
        }

        .button:active {
          transform: translateY(-1px) scale(0.99);
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

        /* Hero */

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
        }

        .status-dot {
          width: 7px;
          height: 7px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #56d6a1;
          box-shadow: 0 0 14px #56d6a1;
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
        }

        /* Animated technology illustration */

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
        }

        .visual-core {
          position: relative;
          z-index: 1;
          width: 175px;
          height: 175px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(127, 196, 255, 0.42);
          border-radius: 50%;
          background: radial-gradient(circle at 35% 20%, #173d65, #0a1424 65%);
          box-shadow:
            0 0 65px rgba(39, 140, 255, 0.22),
            inset 0 0 35px rgba(65, 155, 255, 0.12);
          animation: corePulse 5s ease-in-out infinite;
        }

        .core-mark {
          color: #e6f2ff;
          font-size: 63px;
          line-height: 1;
          font-weight: 800;
          text-shadow: 0 0 30px rgba(77, 174, 255, 0.7);
        }

        .core-label {
          margin-top: 8px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.28em;
        }

        .core-subtitle {
          margin-top: 5px;
          color: #7b9fc5;
          font-size: 7px;
          letter-spacing: 0.35em;
        }

        .float-chip {
          position: absolute;
          z-index: 2;
          padding: 11px 13px;
          border: 1px solid rgba(145, 190, 239, 0.22);
          border-radius: 10px;
          background: rgba(10, 19, 32, 0.9);
          box-shadow: 0 14px 40px rgba(0, 0, 0, 0.25);
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
        }

        .spark-one {
          top: 20%;
          right: 20%;
        }

        .spark-two {
          left: 17%;
          top: 58%;
        }

        .spark-three {
          right: 22%;
          bottom: 16%;
        }

        /* Moving capabilities strip */

        .ticker {
          overflow: hidden;
          border-block: 1px solid rgba(220, 235, 255, 0.08);
          background: rgba(255, 255, 255, 0.015);
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

        /* Section headings */

        .section {
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

        /* Service cards */

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
          background: linear-gradient(
            145deg,
            rgba(18, 29, 45, 0.72),
            rgba(9, 14, 23, 0.78)
          );
          color: inherit;
          text-decoration: none;
          transition:
            transform 0.3s ease,
            border-color 0.3s ease,
            background 0.3s ease;
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
          background: linear-gradient(
            145deg,
            rgba(22, 40, 63, 0.86),
            rgba(9, 14, 23, 0.9)
          );
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

        /* About */

        .about-section {
          position: relative;
          border-block: 1px solid rgba(220, 235, 255, 0.07);
          background: linear-gradient(
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
          background: radial-gradient(
            circle at center,
            rgba(28, 90, 151, 0.25),
            rgba(8, 14, 24, 0.4) 65%
          );
        }

        .about-art-lines {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(125, 180, 237, 0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(125, 180, 237, 0.12) 1px, transparent 1px);
          background-size: 28px 28px;
          mask-image: radial-gradient(circle, black, transparent 75%);
        }

        .about-art-center {
          position: relative;
          z-index: 1;
          width: 175px;
          height: 175px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(125, 194, 255, 0.45);
          border-radius: 50%;
          background: rgba(9, 19, 33, 0.9);
          box-shadow: 0 0 65px rgba(39, 140, 255, 0.15);
        }

        .about-art-center span {
          color: #e4f2ff;
          font-size: 92px;
          font-weight: 800;
          line-height: 1;
        }

        .about-art-center small {
          margin-top: 8px;
          color: #7fbaff;
          font-size: 7px;
          letter-spacing: 0.15em;
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

        /* Academy */

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
          background: linear-gradient(
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

        /* Registration cards */

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

        /* Projects panel */

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
          background: linear-gradient(110deg, #101e30, #0a111d 70%);
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
          color: #e2f2ff;
          font-size: 30px;
          font-weight: 800;
          transform: rotate(45deg);
          transition:
            box-shadow 0.3s ease,
            border-color 0.3s ease;
        }

        .project-core span {
          display: block;
          transform: rotate(-45deg);
          letter-spacing: -0.06em;
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
        }

        .cross-one {
          top: 18%;
          right: 18%;
        }

        .cross-two {
          left: 18%;
          bottom: 17%;
        }

        /* Contact */

        .contact-section {
          padding-block: 95px;
          border-top: 1px solid rgba(220, 235, 255, 0.08);
          background: linear-gradient(
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
          display: flex;
          align-items: center;
          min-width: 0;
          gap: 15px;
          padding: 17px;
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

        .contact-option:hover {
          transform: translateX(4px);
          border-color: rgba(75, 161, 255, 0.5);
          background: rgba(39, 140, 255, 0.06);
        }

        .contact-option-icon {
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
          margin-left: auto;
          color: #83c5ff;
        }

        /* Footer */

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

        /* Scroll reveal: visible by default unless observation is active */

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

        /* Keyboard focus */

        .vexora-site a:focus-visible,
        .vexora-site button:focus-visible {
          outline: 2px solid #69c8ff;
          outline-offset: 4px;
        }

        /* Animations */

        @keyframes orbitSpin {
          from {
            transform: rotateX(62deg) rotate(-25deg);
          }
          to {
            transform: rotateX(62deg) rotate(335deg);
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

        /* Medium screens */

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

        /* Mobile navigation and tablet layout */

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
            background: rgba(7, 10, 16, 0.98);
            box-shadow: 0 20px 35px rgba(0, 0, 0, 0.3);
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

          .footer-main {
            align-items: flex-start;
            flex-direction: column;
            gap: 17px;
          }
        }

        /* Small phones */

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

          .core-mark {
            font-size: 52px;
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

          .about-art-center span {
            font-size: 76px;
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
        }

        /* Accessibility */

        @media (prefers-reduced-motion: reduce) {
          .vexora-site *,
          .vexora-site *::before,
          .vexora-site *::after {
            scroll-behavior: auto !important;
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
