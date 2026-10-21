/* eslint-disable react/jsx-no-comment-textnodes */
import Image from "next/image";
import Link from "next/link";

const values = [
  {
    number: "01",
    title: "Innovation",
    description:
      "We explore modern technologies and practical ideas to build smarter digital solutions that solve real business problems.",
    icon: "spark",
  },
  {
    number: "02",
    title: "Security by Design",
    description:
      "We treat security, privacy, and reliability as essential foundations—not optional extras added at the end.",
    icon: "shield",
  },
  {
    number: "03",
    title: "Client Partnership",
    description:
      "We listen first, understand each challenge, and shape practical solutions around measurable business goals.",
    icon: "users",
  },
];

const capabilities = [
  {
    number: "01",
    title: "Software Development",
    description:
      "Websites, web applications, and custom software designed around the way your business works.",
    tags: ["Web platforms", "Custom systems", "Integration"],
    href: "/services/software-development",
    visual: "code",
  },
  {
    number: "02",
    title: "Cybersecurity",
    description:
      "Practical security assessments and protection strategies that help reduce digital risk.",
    tags: ["Risk assessment", "Security review", "Protection"],
    href: "/services/cybersecurity",
    visual: "security",
  },
  {
    number: "03",
    title: "Networks & Infrastructure",
    description:
      "Reliable network and infrastructure foundations that keep teams and systems connected.",
    tags: ["Networking", "Infrastructure", "IT solutions"],
    href: "/services/networks-infrastructure",
    visual: "network",
  },
  {
    number: "04",
    title: "Data Analytics",
    description:
      "Clear reporting and useful insights that help turn business data into better decisions.",
    tags: ["Analysis", "Dashboards", "Reporting"],
    href: "/services/data-analytics",
    visual: "data",
  },
  {
    number: "05",
    title: "Digital Marketing",
    description:
      "Thoughtful digital campaigns focused on reaching the right audience and improving performance.",
    tags: ["Digital strategy", "Campaigns", "Optimization"],
    href: "/services/digital-marketing",
    visual: "growth",
  },
];

function ArrowUpRight() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
    >
      <path
        d="M7 17 17 7M8 7h9v9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowRight() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-4 w-4"
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
    >
      <path
        d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m19 15 .9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15Z"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
    >
      <path
        d="M12 3 20 6v5.5c0 4.7-3.2 7.8-8 9.5-4.8-1.7-8-4.8-8-9.5V6l8-3Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="m8.5 12 2.2 2.2 4.8-5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
    >
      <circle
        cx="9"
        cy="8"
        r="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M3.5 20v-1.5A5.5 5.5 0 0 1 9 13h1a5.5 5.5 0 0 1 5.5 5.5V20M16 5.5a3 3 0 0 1 0 5.8M17 13a4.5 4.5 0 0 1 3.5 4.4V20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
    >
      <path
        d="M4 7h16M4 12h16M4 17h16"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function TerminalIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
    >
      <path
        d="m5 7 4.5 5L5 17M12.5 17H19"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CapabilityVisual({ type }: { type: string }) {
  if (type === "code") {
    return (
      <div
        className="visual-panel code-visual"
        aria-label="Software development illustration"
      >
        <div className="visual-window-bar">
          <div className="window-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>

          <span className="window-file">
            <TerminalIcon />
            vexora.dev
          </span>

          <span className="window-status">ACTIVE</span>
        </div>

        <div className="code-terminal-header">
          <span>VEXORA / DEVELOPMENT</span>
          <span>BUILD_2026</span>
        </div>

        <div className="code-lines" aria-hidden="true">
          <p>
            <b>01</b>
            <span className="code-blue">const</span>{" "}
            <span className="code-light">future</span> = () =&gt; {"{"}
          </p>

          <p>
            <b>02</b>
            <span className="code-purple"> return</span>{" "}
            <span className="code-green">
              &ldquo;build smarter&rdquo;
            </span>
            ;
          </p>

          <p>
            <b>03</b>
            {"}"}
          </p>

          <p>
            <b>04</b>
            <span className="code-muted">
              // ideas into products
            </span>
          </p>

          <p>
            <b>05</b>
            <span className="code-blue">deploy</span>(future);
            <span className="typing-caret" />
          </p>
        </div>

        <div className="terminal-footer">
          <span className="terminal-online">
            <i />
            SYSTEM READY
          </span>
          <span>0 ERRORS</span>
        </div>
      </div>
    );
  }

  if (type === "security") {
    return (
      <div
        className="visual-panel security-visual"
        aria-label="Cybersecurity illustration"
      >
        <div className="security-heading">
          <span className="security-dot" />
          SECURITY MONITOR
          <span className="ml-auto security-live">LIVE</span>
        </div>

        <div className="security-center">
          <div className="security-ring security-ring-one" />
          <div className="security-ring security-ring-two" />

          <div className="security-shield">
            <ShieldIcon />
          </div>
        </div>

        <div className="security-log">
          <p>
            <span>[OK]</span> Threat monitoring active
          </p>
          <p>
            <span>[OK]</span> Network integrity verified
          </p>
          <p>
            <span>[SCAN]</span> Checking access events...
          </p>
        </div>

        <div className="security-scanline" />
      </div>
    );
  }

  if (type === "network") {
    return (
      <div
        className="visual-panel network-visual"
        aria-label="Network infrastructure illustration"
      >
        <div className="network-heading">
          <span>INFRASTRUCTURE MAP</span>
          <span>NODE STATUS: ONLINE</span>
        </div>

        <svg
          viewBox="0 0 340 180"
          role="img"
          aria-label="Connected network nodes"
          className="network-svg"
        >
          <g className="network-links">
            <path d="M170 85 78 38M170 85 262 38M170 85 65 132M170 85 275 132M78 38 65 132M262 38 275 132M78 38 262 38M65 132 275 132" />
          </g>

          <g className="network-packets" aria-hidden="true">
            <circle cx="120" cy="60" r="2" />
            <circle cx="221" cy="59" r="2" />
            <circle cx="117" cy="111" r="2" />
            <circle cx="226" cy="112" r="2" />
          </g>

          <g className="network-nodes">
            <circle cx="170" cy="85" r="23" className="network-core" />
            <circle cx="78" cy="38" r="11" />
            <circle cx="262" cy="38" r="11" />
            <circle cx="65" cy="132" r="11" />
            <circle cx="275" cy="132" r="11" />
          </g>

          <g className="network-node-labels">
            <text x="170" y="89" textAnchor="middle">
              CORE
            </text>
            <text x="78" y="42" textAnchor="middle">
              01
            </text>
            <text x="262" y="42" textAnchor="middle">
              02
            </text>
            <text x="65" y="136" textAnchor="middle">
              03
            </text>
            <text x="275" y="136" textAnchor="middle">
              04
            </text>
          </g>
        </svg>

        <div className="network-footer">
          <span>
            <i />
            05 NODES CONNECTED
          </span>
          <span>LATENCY 12ms</span>
        </div>
      </div>
    );
  }

  if (type === "data") {
    return (
      <div
        className="visual-panel data-visual"
        aria-label="Data analytics illustration"
      >
        <div className="data-topline">
          <span>PERFORMANCE OVERVIEW</span>
          <b>+24.8%</b>
        </div>

        <div className="data-chart">
          {[34, 52, 43, 69, 57, 82, 64, 96].map((height, index) => (
            <span
              key={index}
              style={
                {
                  "--bar-height": `${height}%`,
                  "--bar-delay": `${index * 90}ms`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        <div className="data-axis">
          <span>WEEK 01</span>
          <span>WEEK 04</span>
          <span>WEEK 08</span>
        </div>

        <div className="data-footer">
          <span>DATA SIGNAL</span>
          <span>
            <i />
            ANALYZING
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="visual-panel growth-visual"
      aria-label="Digital marketing growth illustration"
    >
      <div className="growth-topline">
        <span>CAMPAIGN GROWTH</span>
        <span className="growth-pill">TRENDING ↗</span>
      </div>

      <svg
        viewBox="0 0 340 150"
        role="img"
        aria-label="Rising campaign performance graph"
        className="growth-svg"
      >
        <defs>
          <linearGradient id="growth-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="#1687ff" stopOpacity=".34" />
            <stop offset="100%" stopColor="#1687ff" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          className="growth-grid"
          d="M10 30H330M10 65H330M10 100H330M10 135H330"
        />

        <path
          d="M10 126 52 111 91 116 132 78 173 88 216 54 255 61 294 27 330 17V140H10Z"
          fill="url(#growth-fill)"
        />

        <path
          className="growth-line"
          d="M10 126 52 111 91 116 132 78 173 88 216 54 255 61 294 27 330 17"
        />

        <circle cx="294" cy="27" r="4" className="growth-point" />
      </svg>

      <div className="growth-metrics">
        <span>
          <b>Reach</b>
          <strong>+38%</strong>
        </span>
        <span>
          <b>Engagement</b>
          <strong>+21%</strong>
        </span>
        <span>
          <b>Conversion</b>
          <strong>+16%</strong>
        </span>
      </div>
    </div>
  );
}

export default function AboutPage() {
  return (
    <main className="about-page min-h-screen overflow-hidden bg-[#06090e] text-white">
      <style>{`
        .about-page {
          --about-blue: #1687ff;
          --about-blue-light: #45a5ff;
          --about-white: #f5f7fa;
          --about-muted: #9aa8ba;
          --about-panel: #0a1019;
          --about-border: rgba(120, 170, 220, .14);
          --about-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          position: relative;
          isolation: isolate;
        }

        .about-page::before {
          content: "";
          position: fixed;
          inset: 0;
          z-index: -20;
          pointer-events: none;
          background:
            radial-gradient(
              circle at 15% 10%,
              rgba(22, 135, 255, .07),
              transparent 25%
            ),
            radial-gradient(
              circle at 85% 38%,
              rgba(69, 165, 255, .045),
              transparent 25%
            ),
            #06090e;
        }

        .about-page .about-grid-bg {
          background-image:
            linear-gradient(rgba(69,165,255,.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(69,165,255,.045) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: linear-gradient(
            to bottom,
            black 0%,
            rgba(0,0,0,.85) 45%,
            transparent 100%
          );
          -webkit-mask-image: linear-gradient(
            to bottom,
            black 0%,
            rgba(0,0,0,.85) 45%,
            transparent 100%
          );
        }

        .about-page .ambient-orb {
          pointer-events: none;
          position: absolute;
          border-radius: 999px;
          background: rgba(22, 135, 255, .12);
          filter: blur(90px);
        }

        .about-page .logo-aura {
          position: relative;
          filter: drop-shadow(0 0 12px rgba(22,135,255,.22));
          transition:
            filter .3s ease,
            transform .3s ease;
        }

        .about-page .logo-aura:hover,
        .about-page .logo-aura:focus-visible {
          filter: drop-shadow(0 0 22px rgba(69,165,255,.65));
          transform: translateY(-1px);
        }

        .about-page .eyebrow {
          letter-spacing: .28em;
        }

        .about-page .text-gradient {
          background:
            linear-gradient(
              105deg,
              #ffffff 0%,
              #dbeeff 30%,
              #8fcaff 60%,
              #1687ff 100%
            );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .about-page .scanline-overlay {
          pointer-events: none;
          position: absolute;
          inset: 0;
          z-index: 2;
          opacity: .22;
          background:
            repeating-linear-gradient(
              to bottom,
              transparent 0,
              transparent 3px,
              rgba(255,255,255,.018) 4px
            );
          mix-blend-mode: screen;
        }

        .about-page .hero-terminal {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(92, 169, 236, .2);
          border-radius: 22px;
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(22,135,255,.12),
              transparent 48%
            ),
            linear-gradient(
              145deg,
              rgba(14,25,40,.96),
              rgba(7,13,22,.98)
            );
          box-shadow:
            0 35px 100px rgba(0,0,0,.45),
            inset 0 1px 0 rgba(255,255,255,.035);
        }

        .about-page .hero-terminal::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(
              90deg,
              transparent,
              rgba(69,165,255,.04),
              transparent
            );
          animation: aboutSweep 6s linear infinite;
        }

        .about-page .hero-terminal-bar {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 48px;
          padding: 0 15px;
          border-bottom: 1px solid rgba(255,255,255,.07);
          background: rgba(255,255,255,.018);
          color: #667b91;
          font: 9px var(--about-mono);
          letter-spacing: .12em;
        }

        .about-page .terminal-dots {
          display: flex;
          gap: 5px;
        }

        .about-page .terminal-dots i {
          display: block;
          width: 6px;
          height: 6px;
          border-radius: 999px;
          background: #34485d;
        }

        .about-page .terminal-dots i:first-child {
          background: #55728e;
        }

        .about-page .hero-terminal-title {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .about-page .hero-terminal-title svg {
          color: #45a5ff;
        }

        .about-page .terminal-status {
          margin-left: auto;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          color: #5de0ad;
        }

        .about-page .terminal-status i {
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: #5de0ad;
          box-shadow: 0 0 10px #5de0ad;
          animation: aboutPulse 1.8s ease-in-out infinite;
        }

        .about-page .hero-terminal-body {
          position: relative;
          z-index: 1;
          padding: 19px;
          font: 10px/2 var(--about-mono);
        }

        .about-page .terminal-command {
          color: #45a5ff;
        }

        .about-page .terminal-command span {
          color: #dcecff;
        }

        .about-page .terminal-output {
          margin-top: 9px;
          display: grid;
          gap: 3px;
          color: #71879d;
        }

        .about-page .terminal-output strong {
          color: #dceeff;
          font-weight: 500;
        }

        .about-page .terminal-output .success {
          color: #5de0ad;
        }

        .about-page .terminal-progress {
          height: 4px;
          margin-top: 15px;
          overflow: hidden;
          border-radius: 999px;
          background: rgba(255,255,255,.06);
        }

        .about-page .terminal-progress span {
          display: block;
          width: 76%;
          height: 100%;
          border-radius: inherit;
          background:
            linear-gradient(
              90deg,
              rgba(22,135,255,.2),
              #1687ff,
              #45a5ff
            );
          box-shadow: 0 0 15px rgba(22,135,255,.45);
          animation: aboutProgress 3.5s ease-in-out infinite;
        }

        .about-page .hero-terminal-footer {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1px;
          margin-top: 20px;
          border: 1px solid rgba(255,255,255,.055);
          background: rgba(255,255,255,.055);
        }

        .about-page .hero-terminal-footer span {
          padding: 11px 8px;
          background: rgba(7,13,22,.9);
          color: #52687f;
          text-align: center;
          font: 8px var(--about-mono);
          letter-spacing: .08em;
        }

        .about-page .hero-terminal-footer strong {
          display: block;
          margin-top: 3px;
          color: #c9e7ff;
          font-size: 10px;
        }

        .about-page .visual-panel {
          position: relative;
          min-height: 198px;
          overflow: hidden;
          border: 1px solid rgba(112,174,235,.17);
          border-radius: 16px;
          background:
            radial-gradient(
              ellipse at 50% 0%,
              rgba(22,135,255,.13),
              transparent 65%
            ),
            #090f18;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.025),
            0 14px 40px rgba(0,0,0,.14);
        }

        .about-page .visual-window-bar {
          display: flex;
          align-items: center;
          min-height: 39px;
          gap: 10px;
          padding: 0 12px;
          border-bottom: 1px solid rgba(255,255,255,.07);
          color: #61748a;
          font: 9px var(--about-mono);
        }

        .about-page .window-dots {
          display: flex;
          gap: 5px;
        }

        .about-page .window-dots i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #30475e;
        }

        .about-page .window-dots i:first-child {
          background: #ff6b78;
        }

        .about-page .window-dots i:nth-child(2) {
          background: #ffc56a;
        }

        .about-page .window-dots i:nth-child(3) {
          background: #52d6a0;
        }

        .about-page .window-file {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #7f96ac;
        }

        .about-page .window-file svg {
          width: 13px;
          height: 13px;
          color: #45a5ff;
        }

        .about-page .window-status {
          margin-left: auto;
          color: #4fd6a1;
          font-size: 7px;
          letter-spacing: .14em;
        }

        .about-page .code-terminal-header {
          display: flex;
          justify-content: space-between;
          padding: 9px 12px 0;
          color: #41566d;
          font: 7px var(--about-mono);
          letter-spacing: .12em;
        }

        .about-page .code-lines {
          padding: 7px 12px 4px;
          font: 9px/2 var(--about-mono);
          white-space: nowrap;
        }

        .about-page .code-lines p {
          margin: 0;
        }

        .about-page .code-lines b {
          display: inline-block;
          width: 25px;
          color: #34495f;
          font-weight: 400;
        }

        .about-page .code-blue {
          color: #53b5ff;
        }

        .about-page .code-light {
          color: #e4edf7;
        }

        .about-page .code-purple {
          color: #c6a1ff;
        }

        .about-page .code-green {
          color: #76e2b3;
        }

        .about-page .code-muted {
          color: #53677e;
        }

        .about-page .typing-caret {
          display: inline-block;
          width: 4px;
          height: 11px;
          margin-left: 4px;
          vertical-align: middle;
          background: #45a5ff;
          animation: aboutBlink 1s steps(2,start) infinite;
        }

        .about-page .terminal-footer {
          display: flex;
          justify-content: space-between;
          padding: 5px 12px 11px;
          color: #465c73;
          font: 7px var(--about-mono);
          letter-spacing: .08em;
        }

        .about-page .terminal-online {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #4fd6a1;
        }

        .about-page .terminal-online i {
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: #4fd6a1;
          box-shadow: 0 0 7px #4fd6a1;
        }

        .about-page .security-visual {
          padding: 15px 16px;
          border-color: rgba(60,220,160,.2);
          background:
            radial-gradient(
              ellipse at 50% 35%,
              rgba(23,180,123,.12),
              transparent 60%
            ),
            #07110f;
        }

        .about-page .security-heading {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #86a99d;
          font: 8px var(--about-mono);
          letter-spacing: .12em;
        }

        .about-page .security-heading .security-live {
          color: #4ce0a5;
        }

        .about-page .security-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #4ce0a5;
          box-shadow: 0 0 10px #4ce0a5;
          animation: aboutPulse 1.6s infinite;
        }

        .about-page .security-center {
          position: relative;
          display: grid;
          place-items: center;
          width: 74px;
          height: 74px;
          margin: 8px auto 7px;
        }

        .about-page .security-ring {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(76,224,165,.15);
          border-radius: 50%;
        }

        .about-page .security-ring-one {
          animation: aboutSecurityRing 3s linear infinite;
        }

        .about-page .security-ring-two {
          inset: 9px;
          border-color: rgba(76,224,165,.25);
          border-style: dashed;
          animation: aboutSecurityRingReverse 7s linear infinite;
        }

        .about-page .security-shield {
          position: relative;
          z-index: 2;
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          border: 1px solid rgba(76,224,165,.34);
          border-radius: 15px;
          color: #4ce0a5;
          background: rgba(76,224,165,.045);
          box-shadow:
            0 0 30px rgba(76,224,165,.08),
            inset 0 0 18px rgba(76,224,165,.05);
        }

        .about-page .security-shield svg {
          width: 25px;
          height: 25px;
        }

        .about-page .security-log {
          color: #75958a;
          font: 8px/1.8 var(--about-mono);
        }

        .about-page .security-log p {
          margin: 0;
        }

        .about-page .security-log span {
          color: #4ce0a5;
        }

        .about-page .security-scanline {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 1px;
          background: #4ce0a5;
          opacity: .45;
          box-shadow: 0 0 12px #4ce0a5;
          animation: aboutScan 4s linear infinite;
        }

        .about-page .network-visual {
          background:
            radial-gradient(
              circle at 50% 50%,
              rgba(22,135,255,.12),
              transparent 54%
            ),
            #08101a;
        }

        .about-page .network-heading {
          position: absolute;
          left: 13px;
          right: 13px;
          top: 11px;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          color: #597189;
          font: 7px var(--about-mono);
          letter-spacing: .1em;
        }

        .about-page .network-heading span:last-child {
          color: #53b5ff;
        }

        .about-page .network-svg {
          width: 100%;
          height: 172px;
          margin-top: 15px;
        }

        .about-page .network-links path {
          fill: none;
          stroke: rgba(69,165,255,.36);
          stroke-width: 1.5;
          stroke-dasharray: 5 5;
          animation: aboutDash 12s linear infinite;
        }

        .about-page .network-packets circle {
          fill: #8ed0ff;
          filter: drop-shadow(0 0 5px rgba(69,165,255,.8));
          animation: aboutPacket 3.2s ease-in-out infinite;
        }

        .about-page .network-packets circle:nth-child(2) {
          animation-delay: .7s;
        }

        .about-page .network-packets circle:nth-child(3) {
          animation-delay: 1.3s;
        }

        .about-page .network-packets circle:nth-child(4) {
          animation-delay: 2s;
        }

        .about-page .network-nodes circle {
          fill: #0c2034;
          stroke: #45a5ff;
          stroke-width: 1.5;
          filter: drop-shadow(0 0 5px rgba(69,165,255,.45));
          animation: aboutPulse 2.5s ease-in-out infinite;
        }

        .about-page .network-nodes .network-core {
          fill: #12375b;
          stroke: #78c4ff;
          stroke-width: 2;
        }

        .about-page .network-node-labels {
          fill: #d5ecff;
          font: 8px var(--about-mono);
        }

        .about-page .network-footer {
          position: absolute;
          left: 13px;
          right: 13px;
          bottom: 10px;
          display: flex;
          justify-content: space-between;
          color: #50667c;
          font: 7px var(--about-mono);
        }

        .about-page .network-footer span:first-child {
          display: inline-flex;
          align-items: center;
          gap: 5px;
        }

        .about-page .network-footer i {
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: #4fd6a1;
          box-shadow: 0 0 7px #4fd6a1;
        }

        .about-page .data-visual {
          padding: 17px 16px;
        }

        .about-page .data-topline,
        .about-page .growth-topline {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #8399b1;
          font: 8px var(--about-mono);
          letter-spacing: .1em;
        }

        .about-page .data-topline b {
          color: #5ce0ad;
          font-size: 11px;
        }

        .about-page .data-chart {
          height: 108px;
          display: flex;
          align-items: end;
          gap: 8px;
          padding: 14px 6px 0;
          border-bottom: 1px solid rgba(255,255,255,.09);
          background:
            repeating-linear-gradient(
              to bottom,
              transparent 0,
              transparent 27px,
              rgba(255,255,255,.045) 28px
            );
        }

        .about-page .data-chart span {
          flex: 1;
          height: var(--bar-height);
          transform-origin: bottom;
          border-radius: 4px 4px 0 0;
          background:
            linear-gradient(
              to top,
              #087bff,
              rgba(69,165,255,.48)
            );
          animation: aboutBars .8s ease-out both;
          animation-delay: var(--bar-delay);
          box-shadow: 0 0 12px rgba(22,135,255,.12);
        }

        .about-page .data-axis {
          display: flex;
          justify-content: space-between;
          padding-top: 8px;
          color: #53677e;
          font: 7px var(--about-mono);
        }

        .about-page .data-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 11px;
          color: #435a71;
          font: 7px var(--about-mono);
          letter-spacing: .1em;
        }

        .about-page .data-footer span:last-child {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #5ce0ad;
        }

        .about-page .data-footer i {
          width: 4px;
          height: 4px;
          border-radius: 999px;
          background: #5ce0ad;
          box-shadow: 0 0 7px #5ce0ad;
        }

        .about-page .growth-visual {
          padding: 17px 16px;
        }

        .about-page .growth-pill {
          border: 1px solid rgba(76,224,165,.2);
          border-radius: 99px;
          padding: 4px 7px;
          color: #5ce0ad;
          font-size: 7px;
        }

        .about-page .growth-svg {
          width: 100%;
          height: 112px;
          margin-top: 8px;
          overflow: visible;
        }

        .about-page .growth-grid {
          stroke: rgba(255,255,255,.07);
          stroke-width: 1;
        }

        .about-page .growth-line {
          fill: none;
          stroke: #45a5ff;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 500;
          stroke-dashoffset: 500;
          animation: aboutDraw 2s ease forwards;
        }

        .about-page .growth-point {
          fill: #fff;
          stroke: #1687ff;
          stroke-width: 3;
          animation: aboutPulse 2s infinite;
        }

        .about-page .growth-metrics {
          display: grid;
          grid-template-columns: repeat(3,minmax(0,1fr));
          gap: 6px;
          padding-top: 8px;
        }

        .about-page .growth-metrics span {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .about-page .growth-metrics b {
          color: #637991;
          font: 7px var(--about-mono);
        }

        .about-page .growth-metrics strong {
          color: #dceeff;
          font-size: 12px;
        }

        .about-page .service-card {
          position: relative;
          overflow: hidden;
        }

        .about-page .service-card::after {
          content: "";
          position: absolute;
          top: 0;
          left: -120%;
          width: 70%;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(69,165,255,.8),
            transparent
          );
          transition: left .7s ease;
        }

        .about-page .service-card:hover::after {
          left: 130%;
        }

        .about-page .value-card {
          position: relative;
          overflow: hidden;
        }

        .about-page .value-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 32px;
          height: 1px;
          background: #1687ff;
          box-shadow: 0 0 12px #1687ff;
          transition: width .35s ease;
        }

        .about-page .value-card:hover::before {
          width: 80px;
        }

        .about-page .cta-panel {
          position: relative;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(22,135,255,.18),
              transparent 42%
            ),
            linear-gradient(
              145deg,
              #0b1624,
              #08101a
            );
          box-shadow:
            0 35px 90px rgba(0,0,0,.35),
            inset 0 1px 0 rgba(255,255,255,.035);
        }

        .about-page .cta-panel::before {
          content: "";
          position: absolute;
          inset: 1px;
          border-radius: inherit;
          pointer-events: none;
          background:
            linear-gradient(
              120deg,
              transparent 0%,
              rgba(69,165,255,.06) 45%,
              transparent 60%
            );
          transform: translateX(-100%);
          animation: aboutCtaSweep 6s ease-in-out infinite;
        }

        .about-page .focus-ring:focus-visible,
        .about-page a:focus-visible {
          outline: 2px solid rgba(69,165,255,.9);
          outline-offset: 3px;
        }

        @keyframes aboutBlink {
          50% {
            opacity: 0;
          }
        }

        @keyframes aboutPulse {
          50% {
            opacity: .55;
            transform: scale(.97);
          }
        }

        @keyframes aboutScan {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(198px);
          }
        }

        @keyframes aboutDash {
          to {
            stroke-dashoffset: -100;
          }
        }

        @keyframes aboutBars {
          from {
            transform: scaleY(.08);
            opacity: .4;
          }
          to {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        @keyframes aboutDraw {
          to {
            stroke-dashoffset: 0;
          }
        }

        @keyframes aboutSweep {
          0%,
          55% {
            transform: translateX(-100%);
          }

          75%,
          100% {
            transform: translateX(100%);
          }
        }

        @keyframes aboutProgress {
          0%,
          100% {
            width: 68%;
          }

          50% {
            width: 88%;
          }
        }

        @keyframes aboutSecurityRing {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes aboutSecurityRingReverse {
          to {
            transform: rotate(-360deg);
          }
        }

        @keyframes aboutPacket {
          0%,
          100% {
            opacity: .25;
            transform: scale(.7);
          }

          50% {
            opacity: 1;
            transform: scale(1.35);
          }
        }

        @keyframes aboutCtaSweep {
          0%,
          45% {
            transform: translateX(-100%);
          }

          70%,
          100% {
            transform: translateX(100%);
          }
        }

        @media (max-width: 767px) {
          .about-page .eyebrow {
            letter-spacing: .18em;
          }

          .about-page .hero-terminal-body {
            padding: 15px;
          }

          .about-page .code-lines {
            font-size: 8px;
          }

          .about-page .network-svg {
            height: 160px;
          }

          .about-page .hero-terminal-footer span {
            font-size: 7px;
          }
        }

        @media (max-width: 480px) {
          .about-page .hero-terminal-footer {
            grid-template-columns: 1fr;
          }

          .about-page .hero-terminal-footer span {
            padding: 8px;
          }

          .about-page .visual-panel {
            min-height: 184px;
          }

          .about-page .code-lines {
            overflow-x: auto;
          }

          .about-page .growth-metrics strong {
            font-size: 11px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .about-page *,
          .about-page *::before,
          .about-page *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* Ambient background */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[850px]"
        aria-hidden="true"
      >
        <div className="about-grid-bg absolute inset-0 opacity-80" />
        <div className="ambient-orb -top-20 left-[8%] h-72 w-72" />
        <div className="ambient-orb right-[4%] top-64 h-80 w-80 opacity-50" />
      </div>

      {/* Header */}
      <header className="relative z-30 border-b border-white/[0.08] bg-[#06090e]/85 backdrop-blur-2xl">
        <nav
          className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-4 sm:px-8 lg:px-10"
          aria-label="Primary navigation"
        >
          <Link
            href="/"
            aria-label="VEXORA home"
            className="logo-aura flex shrink-0 items-center"
          >
            <Image
              src="/vexora-logo.png"
              alt="VEXORA Technology"
              width={145}
              height={70}
              priority
              className="h-auto w-[108px] sm:w-[132px]"
            />
          </Link>

          <div className="hidden items-center justify-end gap-7 text-sm text-gray-400 md:flex">
            <Link
              href="/"
              className="transition hover:text-[#45a5ff]"
            >
              Home
            </Link>

            <Link
              href="/services"
              className="transition hover:text-[#45a5ff]"
            >
              Services
            </Link>

            <Link
              href="/about"
              aria-current="page"
              className="relative font-medium text-[#45a5ff]"
            >
              About
              <span className="absolute -bottom-2 left-0 h-px w-full bg-[#1687ff] shadow-[0_0_10px_#1687ff]" />
            </Link>

            <Link
              href="/academy"
              className="transition hover:text-[#45a5ff]"
            >
              Academy
            </Link>

            <Link
              href="/projects"
              className="transition hover:text-[#45a5ff]"
            >
              Projects
            </Link>

            <Link
              href="/contact"
              className="transition hover:text-[#45a5ff]"
            >
              Contact
            </Link>

            <Link
              href="/login"
              className="group inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.025] px-4 py-2 text-gray-200 transition hover:border-[#45a5ff]/50 hover:bg-[#1687ff]/[0.06] hover:text-[#8fcaff]"
            >
              Login
              <ArrowRight />
            </Link>
          </div>

          <details className="relative md:hidden">
            <summary
              aria-label="Open navigation menu"
              className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-gray-300 transition hover:border-[#45a5ff]/50 hover:text-[#45a5ff]"
            >
              <MenuIcon />
            </summary>

            <div className="absolute right-0 top-12 w-[min(290px,calc(100vw-40px))] overflow-hidden rounded-2xl border border-white/10 bg-[#09101a]/95 p-2 shadow-2xl backdrop-blur-2xl">
              <div className="border-b border-white/[0.07] px-3 py-3">
                <p className="font-mono text-[9px] uppercase tracking-[.18em] text-[#45a5ff]">
                  Navigation / VEXORA
                </p>
              </div>

              <div className="grid gap-1 p-1">
                <Link
                  href="/"
                  className="rounded-lg px-3 py-3 text-sm text-gray-300 transition hover:bg-white/[0.04] hover:text-[#45a5ff]"
                >
                  Home
                </Link>

                <Link
                  href="/services"
                  className="rounded-lg px-3 py-3 text-sm text-gray-300 transition hover:bg-white/[0.04] hover:text-[#45a5ff]"
                >
                  Services
                </Link>

                <Link
                  href="/about"
                  aria-current="page"
                  className="rounded-lg bg-[#1687ff]/[0.08] px-3 py-3 text-sm font-medium text-[#45a5ff]"
                >
                  About
                </Link>

                <Link
                  href="/academy"
                  className="rounded-lg px-3 py-3 text-sm text-gray-300 transition hover:bg-white/[0.04] hover:text-[#45a5ff]"
                >
                  Academy
                </Link>

                <Link
                  href="/projects"
                  className="rounded-lg px-3 py-3 text-sm text-gray-300 transition hover:bg-white/[0.04] hover:text-[#45a5ff]"
                >
                  Projects
                </Link>

                <Link
                  href="/contact"
                  className="rounded-lg px-3 py-3 text-sm text-gray-300 transition hover:bg-white/[0.04] hover:text-[#45a5ff]"
                >
                  Contact
                </Link>

                <Link
                  href="/login"
                  className="mt-1 flex items-center justify-between rounded-lg border border-[#1687ff]/20 bg-[#1687ff]/[0.06] px-3 py-3 text-sm font-medium text-[#8fcaff]"
                >
                  Login
                  <ArrowRight />
                </Link>
              </div>
            </div>
          </details>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative isolate border-b border-white/[0.08]">
        <div className="about-grid-bg pointer-events-none absolute inset-0 -z-10 opacity-75" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-[1.08fr_.92fr] lg:gap-16 lg:px-10 lg:py-32">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#1687ff]/20 bg-[#1687ff]/[0.045] px-3 py-1.5 font-mono text-[9px] uppercase tracking-[.18em] text-[#6dbbff]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#45a5ff] shadow-[0_0_10px_#1687ff]" />
              VEXORA / TECHNOLOGY PARTNER
            </div>

            <p className="eyebrow mb-6 flex items-center gap-3 text-xs font-bold uppercase text-[#45a5ff] sm:text-sm">
              <span className="h-px w-8 bg-[#45a5ff] shadow-[0_0_8px_#1687ff]" />
              About VEXORA
            </p>

            <h1 className="max-w-4xl text-4xl font-bold leading-[1.04] tracking-[-.035em] sm:text-5xl lg:text-7xl">
              Technology with purpose.
              <span className="text-gradient mt-3 block">
                Solutions built for what’s next.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
              We bring software engineering, cybersecurity, network
              infrastructure, data analytics, and digital marketing together
              to help businesses build with clarity and move forward with
              confidence.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/services"
                className="group inline-flex items-center gap-3 rounded-lg bg-[#1687ff] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_35px_rgba(22,135,255,.2)] transition hover:-translate-y-0.5 hover:bg-[#0875e5] hover:shadow-[0_0_45px_rgba(22,135,255,.3)]"
              >
                Explore our services
                <span className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight />
                </span>
              </Link>

              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 rounded-lg border border-white/12 bg-white/[0.025] px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-[#45a5ff]/60 hover:bg-[#1687ff]/[0.045] hover:text-[#8fcaff]"
              >
                Start a conversation
                <span className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight />
                </span>
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 font-mono text-[9px] uppercase tracking-[.14em] text-gray-500 sm:text-[10px]">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#45a5ff] shadow-[0_0_10px_#1687ff]" />
                Technology
              </span>

              <span className="h-4 w-px bg-white/10" />

              <span>Strategy</span>

              <span className="h-4 w-px bg-white/10" />

              <span>Growth</span>
            </div>
          </div>

          {/* Technology system panel */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-8 rounded-full bg-[#1687ff]/15 blur-3xl" />

            <div className="hero-terminal">
              <div className="scanline-overlay" />

              <div className="hero-terminal-bar">
                <div className="terminal-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>

                <span className="hero-terminal-title">
                  <TerminalIcon />
                  vexora.system
                </span>

                <span className="terminal-status">
                  <i />
                  ONLINE
                </span>
              </div>

              <div className="hero-terminal-body">
                <p className="terminal-command">
                  $ <span>initialize --vexora-platform</span>
                </p>

                <div className="terminal-output">
                  <div>
                    <span className="success">[OK]</span>{" "}
                    <strong>Software engineering</strong> initialized
                  </div>

                  <div>
                    <span className="success">[OK]</span>{" "}
                    <strong>Cybersecurity</strong> layer active
                  </div>

                  <div>
                    <span className="success">[OK]</span>{" "}
                    <strong>Infrastructure</strong> systems connected
                  </div>

                  <div>
                    <span className="success">[OK]</span>{" "}
                    <strong>Data intelligence</strong> online
                  </div>

                  <div>
                    <span className="success">[OK]</span>{" "}
                    <strong>Digital growth</strong> ready
                  </div>
                </div>

                <div className="terminal-progress" aria-hidden="true">
                  <span />
                </div>

                <div className="hero-terminal-footer">
                  <span>
                    SYSTEM
                    <strong>READY</strong>
                  </span>

                  <span>
                    SIGNAL
                    <strong>STABLE</strong>
                  </span>

                  <span>
                    MODE
                    <strong>BUILD</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who we are */}
      <section className="relative">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-10 lg:py-28">
          <div>
            <p className="eyebrow mb-5 text-xs font-bold uppercase text-[#45a5ff] sm:text-sm">
              Who We Are
            </p>

            <h2 className="max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              A technology partner for a changing world.
            </h2>

            <div className="mt-7 flex items-center gap-3">
              <span className="h-1 w-16 rounded-full bg-[#1687ff] shadow-[0_0_14px_rgba(22,135,255,.55)]" />
              <span className="h-px w-16 bg-white/10" />
            </div>
          </div>

          <div className="space-y-5 text-base leading-8 text-gray-400">
            <p>
              Technology should solve real problems, create opportunities, and
              make businesses more capable of achieving their goals.
            </p>

            <p>
              That belief drives our approach at VEXORA. We bring together
              digital expertise across multiple disciplines to help
              organizations build, protect, and improve their technology.
            </p>

            <p>
              From developing software to strengthening digital security and
              turning data into insights, our focus is on useful solutions,
              thoughtful execution, and long-term value.
            </p>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="border-y border-white/[0.08] bg-white/[0.015]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="eyebrow mb-5 text-xs font-bold uppercase text-[#45a5ff] sm:text-sm">
                What We Do
              </p>

              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Connected expertise. Practical outcomes.
              </h2>

              <p className="mt-5 leading-7 text-gray-400">
                Explore the disciplines we bring together to help businesses
                move forward with confidence.
              </p>
            </div>

            <div className="hidden items-center gap-2 font-mono text-[9px] uppercase tracking-[.14em] text-gray-600 lg:flex">
              <span className="h-px w-8 bg-white/10" />
              VEXORA CAPABILITIES
            </div>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {capabilities.map((item) => (
              <article
                key={item.number}
                className="service-card group rounded-2xl border border-white/[0.09] bg-[#090e15] p-4 transition duration-300 hover:-translate-y-1 hover:border-[#1687ff]/45 hover:bg-[#0a111b] hover:shadow-[0_20px_65px_rgba(0,80,180,.12)] sm:p-5"
              >
                <CapabilityVisual type={item.visual} />

                <div className="flex items-start justify-between gap-4 px-1 pt-5">
                  <div>
                    <p className="font-mono text-xs font-bold tracking-[.2em] text-[#45a5ff]">
                      {item.number}
                    </p>

                    <h3 className="mt-2 text-lg font-semibold">
                      {item.title}
                    </h3>
                  </div>

                  <Link
                    href={item.href}
                    aria-label={`Explore ${item.title}`}
                    className="rounded-full border border-white/10 p-2.5 text-gray-400 transition hover:border-[#1687ff]/50 hover:bg-[#1687ff]/[0.06] hover:text-[#45a5ff] group-hover:border-[#1687ff]/40 group-hover:text-[#45a5ff]"
                  >
                    <ArrowUpRight />
                  </Link>
                </div>

                <p className="px-1 pt-3 text-sm leading-7 text-gray-400">
                  {item.description}
                </p>

                <div className="flex flex-wrap gap-2 px-1 pb-1 pt-4">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/[0.08] bg-white/[0.025] px-2.5 py-1 font-mono text-[9px] text-gray-400 transition group-hover:border-[#1687ff]/15 group-hover:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="eyebrow mb-5 text-xs font-bold uppercase text-[#45a5ff] sm:text-sm">
              What Guides Us
            </p>

            <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
              The principles behind our work.
            </h2>

            <p className="mt-5 max-w-md leading-7 text-gray-400">
              Good technology starts with clear thinking, responsible
              execution, and a real understanding of the people who use it.
            </p>

            <div className="mt-8 hidden items-center gap-3 font-mono text-[9px] uppercase tracking-[.15em] text-gray-600 sm:flex">
              <span className="h-px w-10 bg-white/10" />
              Core operating principles
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {values.map((value) => (
              <article
                key={value.number}
                className="value-card rounded-2xl border border-white/[0.09] bg-[#0a0f17] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#1687ff]/45 hover:bg-[#0b111a]"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold tracking-[.2em] text-[#45a5ff]">
                    {value.number}
                  </span>

                  <span className="text-[#45a5ff]">
                    {value.icon === "spark" ? (
                      <SparkIcon />
                    ) : value.icon === "shield" ? (
                      <ShieldIcon />
                    ) : (
                      <UsersIcon />
                    )}
                  </span>
                </div>

                <h3 className="mt-7 text-lg font-semibold">{value.title}</h3>

                <p className="mt-3 text-sm leading-7 text-gray-400">
                  {value.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="px-5 pb-20 sm:px-8 lg:px-10 lg:pb-28">
        <div className="cta-panel mx-auto max-w-7xl rounded-3xl border border-[#1687ff]/25 px-6 py-12 text-center sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute -right-16 -top-32 h-72 w-72 rounded-full bg-[#1687ff]/20 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-40 -left-16 h-72 w-72 rounded-full bg-[#1687ff]/10 blur-[90px]" />

          <div className="relative z-10">
            <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.025] px-3 py-1.5 font-mono text-[8px] uppercase tracking-[.18em] text-[#63809d]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#45a5ff] shadow-[0_0_8px_#1687ff]" />
              PROJECT / DISCOVERY
            </div>

            <p className="eyebrow text-xs font-bold uppercase text-[#45a5ff] sm:text-sm">
              Let’s Build Something Better
            </p>

            <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">
              Have a challenge in mind? Let’s work on it together.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-7 text-gray-400">
              Tell us what you’re working toward. We’ll help you explore a
              practical path from challenge to solution.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-3 rounded-lg bg-[#1687ff] px-6 py-3.5 text-sm font-semibold shadow-[0_0_30px_rgba(22,135,255,.18)] transition hover:-translate-y-0.5 hover:bg-[#0875e5]"
              >
                Discuss your project
                <span className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight />
                </span>
              </Link>

              <Link
                href="/services"
                className="group inline-flex items-center gap-3 rounded-lg border border-white/15 bg-white/[0.02] px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-[#45a5ff]/60 hover:bg-[#1687ff]/[0.04] hover:text-[#45a5ff]"
              >
                View all services
                <span className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.08] bg-[#05080c]/70">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-7 text-center sm:px-8 md:flex-row md:text-left lg:px-10">
          <Link
            href="/"
            aria-label="VEXORA home"
            className="logo-aura"
          >
            <Image
              src="/vexora-logo.png"
              alt="VEXORA Technology"
              width={112}
              height={54}
              className="h-auto w-24"
            />
          </Link>

          <div className="font-mono text-[9px] uppercase tracking-[.12em] text-gray-600">
            <span className="text-gray-500">© 2026 VEXORA</span>
            <span className="mx-2 text-gray-700">/</span>
            All systems reserved
          </div>

          <div className="flex gap-5 text-xs text-gray-400">
            <Link
              href="/privacy"
              className="transition hover:text-[#45a5ff]"
            >
              Privacy
            </Link>

            <Link
              href="/contact"
              className="transition hover:text-[#45a5ff]"
            >
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}