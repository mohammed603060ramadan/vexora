import Image from "next/image";
import Link from "next/link";

const COMPANY_WHATSAPP = "201115449868";

const projects = [
  {
    number: "01",
    code: "DEV / 001",
    category: "Software Development",
    title: "Digital Business Platform",
    description:
      "We design and develop modern websites, web applications, internal systems, customer portals, and custom digital platforms built around your business workflow.",
    details:
      "Our software development service covers the full journey from understanding the business requirement to designing the interface, developing the system, integrating APIs and databases, testing the solution, and preparing it for production.",
    services: [
      "Business websites & web platforms",
      "Custom web applications",
      "Customer & employee portals",
      "Database-driven systems",
      "API & third-party integrations",
      "Business workflow automation",
      "Responsive UI/UX development",
      "System maintenance & improvements",
    ],
    tags: ["Web Applications", "UI/UX", "Business Solutions"],
    href: "/services/software-development",
    icon: "code",
    accent: "blue",
  },
  {
    number: "02",
    code: "SEC / 002",
    category: "Cybersecurity",
    title: "Security & Risk Assessment",
    description:
      "We help businesses understand their digital risks, identify weaknesses, strengthen protection, and build a more secure technology environment.",
    details:
      "Our cybersecurity approach focuses on identifying potential attack surfaces and security weaknesses, reviewing configurations and access controls, and helping organizations establish practical security improvements based on their actual risks.",
    services: [
      "Security assessments",
      "Risk analysis",
      "Security configuration reviews",
      "Access & identity controls",
      "Vulnerability assessment",
      "Security awareness guidance",
      "Protection strategy",
      "Security improvement planning",
    ],
    tags: ["Risk Analysis", "Security", "Protection"],
    href: "/services/cybersecurity",
    icon: "shield",
    accent: "green",
  },
  {
    number: "03",
    code: "NET / 003",
    category: "Networks & Infrastructure",
    title: "Connected Infrastructure",
    description:
      "We build reliable network and infrastructure foundations that keep teams, systems, applications, and devices connected and available.",
    details:
      "We help organizations plan, improve, and maintain the technology infrastructure behind their operations, with a focus on reliability, connectivity, performance, scalability, and proper organization.",
    services: [
      "Network planning",
      "LAN & Wi-Fi infrastructure",
      "Network configuration",
      "Server & infrastructure solutions",
      "IT environment optimization",
      "Connectivity improvement",
      "Infrastructure monitoring",
      "Scalable technology architecture",
    ],
    tags: ["Networking", "Infrastructure", "IT"],
    href: "/services/networks-infrastructure",
    icon: "network",
    accent: "cyan",
  },
  {
    number: "04",
    code: "DATA / 004",
    category: "Data Analytics",
    title: "Business Intelligence Dashboard",
    description:
      "We turn business data into understandable dashboards, reports, and insights that help teams monitor performance and make better decisions.",
    details:
      "Our data analytics solutions organize and visualize important business information so decision-makers can understand what is happening, identify patterns, monitor KPIs, and act based on useful information instead of assumptions.",
    services: [
      "Business dashboards",
      "Data visualization",
      "KPI monitoring",
      "Performance reporting",
      "Data analysis",
      "Operational insights",
      "Management reports",
      "Decision-support systems",
    ],
    tags: ["Data Visualization", "Analytics", "Reporting"],
    href: "/services/data-analytics",
    icon: "chart",
    accent: "purple",
  },
  {
    number: "05",
    code: "GROW / 005",
    category: "Digital Marketing",
    title: "Digital Growth Strategy",
    description:
      "We help businesses improve their digital presence through structured strategies, campaigns, audience understanding, and performance optimization.",
    details:
      "Our digital marketing service focuses on building a stronger online presence, reaching the right audience, improving campaign performance, and using measurable results to continuously optimize digital growth.",
    services: [
      "Digital marketing strategy",
      "Audience research",
      "Campaign planning",
      "Social media strategy",
      "Content direction",
      "Performance analysis",
      "Conversion optimization",
      "Digital presence improvement",
    ],
    tags: ["Digital Strategy", "Campaigns", "Optimization"],
    href: "/services/digital-marketing",
    icon: "growth",
    accent: "orange",
  },
  {
    number: "06",
    code: "CORE / 006",
    category: "Integrated Technology",
    title: "Smart Business Ecosystem",
    description:
      "We connect software, infrastructure, security, data, and digital growth into a coordinated technology environment designed around the business.",
    details:
      "For businesses that need more than one technology service, VEXORA can combine multiple disciplines into one coordinated technology strategy instead of treating every system as an isolated project.",
    services: [
      "Technology strategy",
      "System integration",
      "Business automation",
      "Software & infrastructure alignment",
      "Security integration",
      "Data-driven operations",
      "Digital transformation planning",
      "Technology optimization",
    ],
    tags: ["Integration", "Automation", "Technology"],
    href: "/services",
    icon: "core",
    accent: "silver",
  },
];

function ArrowUpRight() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-[18px] w-[18px]"
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
        d="M5 12h13M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-5 w-5"
    >
      <path
        d="M20.2 11.2a8.1 8.1 0 0 1-11.8 7.1L4 20l1.7-4.2a8.1 8.1 0 1 1 14.5-4.6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 8.2c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.5c.1.2.1.4 0 .6l-.5.7c-.1.1-.1.3 0 .5.4.7 1.1 1.4 1.8 1.8.2.1.4.1.5 0l.7-.5c.2-.1.4-.1.6 0l1.5.7c.3.1.4.3.4.5v.5c0 .3 0 .5-.4.7-.3.2-.8.4-1.3.4-1.1 0-2.7-.8-4-2.1-1.3-1.3-2.1-2.9-2.1-4 0-.5.2-1 .4-1.3Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CodeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
      <path
        d="m8 9-3 3 3 3M16 9l3 3-3 3M14 5l-4 14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
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

function NetworkIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
      <circle
        cx="12"
        cy="5"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle
        cx="5"
        cy="18"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <circle
        cx="19"
        cy="18"
        r="2.5"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="m10.8 7.2-4.5 8.4M13.2 7.2l4.5 8.4M7.5 18h9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
      <path
        d="M5 19V9M12 19V5M19 19v-7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <path
        d="M3 19h18"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GrowthIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
      <path
        d="m4 17 5-5 4 3 7-8"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 7h5v5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CoreIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-7 w-7">
      <rect
        x="7"
        y="7"
        width="10"
        height="10"
        rx="1.5"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9.5 1.5v3M14.5 1.5v3M9.5 19.5v3M14.5 19.5v3M1.5 9.5h3M1.5 14.5h3M19.5 9.5h3M19.5 14.5h3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ServiceIcon({ icon }: { icon: string }) {
  if (icon === "code") return <CodeIcon />;
  if (icon === "shield") return <ShieldIcon />;
  if (icon === "network") return <NetworkIcon />;
  if (icon === "chart") return <ChartIcon />;
  if (icon === "growth") return <GrowthIcon />;
  return <CoreIcon />;
}

function ServiceVisual({
  icon,
  number,
}: {
  icon: string;
  number: string;
}) {
  if (icon === "code") {
    return (
      <div className="project-visual code-visual">
        <div className="visual-grid" />

        <div className="terminal-window">
          <div className="terminal-top">
            <div className="terminal-dots">
              <i />
              <i />
              <i />
            </div>
            <span>vexora://software</span>
            <b>BUILD</b>
          </div>

          <div className="terminal-content">
            <p>
              <em>01</em>{" "}
              <span className="blue">const</span>{" "}
              <span className="white">platform</span> = {"{"}
            </p>
            <p>
              <em>02</em> &nbsp;&nbsp;
              <span className="purple">security</span>:{" "}
              <span className="green">&quot;enabled&quot;</span>,
            </p>
            <p>
              <em>03</em> &nbsp;&nbsp;
              <span className="purple">scalable</span>:{" "}
              <span className="green">true</span>,
            </p>
            <p>
              <em>04</em> &nbsp;&nbsp;
              <span className="purple">integration</span>:{" "}
              <span className="green">&quot;ready&quot;</span>,
            </p>
            <p>
              <em>05</em> {"};"}
              <span className="cursor" />
            </p>
          </div>
        </div>

        <div className="visual-orb orb-blue" />
        <div className="visual-label">
          <span>01</span>
          APPLICATION ENGINE
        </div>
      </div>
    );
  }

  if (icon === "shield") {
    return (
      <div className="project-visual security-visual">
        <div className="security-grid" />

        <div className="security-scan" />

        <div className="security-center">
          <div className="security-ring ring-one" />
          <div className="security-ring ring-two" />
          <div className="security-shield">
            <ShieldIcon />
          </div>
        </div>

        <div className="security-lines">
          <span>THREAT MONITORING</span>
          <span>ACCESS CONTROL</span>
          <span>RISK ANALYSIS</span>
        </div>

        <div className="visual-label">
          <span>02</span>
          SECURITY OPERATIONS
        </div>
      </div>
    );
  }

  if (icon === "network") {
    return (
      <div className="project-visual network-visual">
        <div className="network-status">
          <span>
            <i />
            NETWORK ONLINE
          </span>
          <b>99.98%</b>
        </div>

        <svg
          viewBox="0 0 360 180"
          className="network-map"
          aria-hidden="true"
        >
          <g className="network-lines">
            <path d="M180 90 75 38M180 90 285 38M180 90 65 142M180 90 295 142M75 38 285 38M65 142 295 142" />
          </g>

          <g className="network-points">
            <circle cx="180" cy="90" r="25" className="core" />
            <circle cx="75" cy="38" r="12" />
            <circle cx="285" cy="38" r="12" />
            <circle cx="65" cy="142" r="12" />
            <circle cx="295" cy="142" r="12" />
          </g>

          <g className="network-text">
            <text x="180" y="94" textAnchor="middle">
              CORE
            </text>
            <text x="75" y="42" textAnchor="middle">
              01
            </text>
            <text x="285" y="42" textAnchor="middle">
              02
            </text>
            <text x="65" y="146" textAnchor="middle">
              03
            </text>
            <text x="295" y="146" textAnchor="middle">
              04
            </text>
          </g>
        </svg>

        <div className="visual-label">
          <span>03</span>
          CONNECTED INFRASTRUCTURE
        </div>
      </div>
    );
  }

  if (icon === "chart") {
    return (
      <div className="project-visual chart-visual">
        <div className="chart-header">
          <span>BUSINESS PERFORMANCE</span>
          <b>+24.8%</b>
        </div>

        <div className="bars">
          {[42, 55, 46, 70, 61, 82, 73, 96].map((height, index) => (
            <span
              key={index}
              style={
                {
                  "--height": `${height}%`,
                  "--delay": `${index * 80}ms`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        <div className="chart-bottom">
          <span>DATA</span>
          <span>ANALYTICS</span>
          <span>INSIGHTS</span>
        </div>

        <div className="visual-label">
          <span>04</span>
          BUSINESS INTELLIGENCE
        </div>
      </div>
    );
  }

  if (icon === "growth") {
    return (
      <div className="project-visual growth-visual">
        <div className="growth-header">
          <span>DIGITAL GROWTH</span>
          <b>LIVE</b>
        </div>

        <svg
          viewBox="0 0 360 170"
          className="growth-chart"
          aria-hidden="true"
        >
          <path d="M15 35H345M15 75H345M15 115H345M15 155H345" />

          <path
            className="growth-area"
            d="M15 143 60 129 101 137 143 98 184 106 226 70 267 80 307 43 345 25V160H15Z"
          />

          <path
            className="growth-line"
            d="M15 143 60 129 101 137 143 98 184 106 226 70 267 80 307 43 345 25"
          />

          <circle cx="345" cy="25" r="5" />
        </svg>

        <div className="growth-stats">
          <span>
            <b>REACH</b>
            <strong>+38%</strong>
          </span>
          <span>
            <b>ENGAGEMENT</b>
            <strong>+21%</strong>
          </span>
          <span>
            <b>CONVERSION</b>
            <strong>+16%</strong>
          </span>
        </div>

        <div className="visual-label">
          <span>05</span>
          DIGITAL GROWTH ENGINE
        </div>
      </div>
    );
  }

  return (
    <div className="project-visual core-visual">
      <div className="core-grid" />

      <div className="core-orbit orbit-a" />
      <div className="core-orbit orbit-b" />
      <div className="core-orbit orbit-c" />

      <div className="core-center">
        <CoreIcon />
        <span>VEXORA</span>
      </div>

      <div className="core-node node-a">DEV</div>
      <div className="core-node node-b">SEC</div>
      <div className="core-node node-c">DATA</div>
      <div className="core-node node-d">NET</div>

      <div className="visual-label">
        <span>06</span>
        INTEGRATED TECHNOLOGY
      </div>
    </div>
  );
}

function whatsappLink(title: string) {
  const message = `Hello VEXORA, I would like to know more about your ${title} service.`;
  return `https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent(
    message
  )}`;
}

export default function ProjectsPage() {
  return (
    <main className="projects-page min-h-screen overflow-hidden bg-[#04070b] text-white">
      <style>{`
        .projects-page {
          --blue: #1687ff;
          --blue-light: #45a5ff;
          --cyan: #6ecbff;
          --green: #4ce0a5;
          --purple: #b994ff;
          --orange: #ffad62;
          --silver: #dce8f8;
          position: relative;
          isolation: isolate;
        }

        .projects-page::before {
          content: "";
          position: fixed;
          inset: 0;
          z-index: 50;
          pointer-events: none;
          opacity: .025;
          background:
            repeating-linear-gradient(
              0deg,
              rgba(255,255,255,.6) 0,
              rgba(255,255,255,.6) 1px,
              transparent 1px,
              transparent 4px
            );
        }

        .projects-page .page-bg {
          position: absolute;
          inset: 0;
          z-index: -10;
          overflow: hidden;
          pointer-events: none;
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(22,135,255,.15),
              transparent 27%
            ),
            radial-gradient(
              circle at 15% 30%,
              rgba(22,135,255,.06),
              transparent 26%
            ),
            radial-gradient(
              circle at 85% 52%,
              rgba(69,165,255,.055),
              transparent 27%
            ),
            #04070b;
        }

        .projects-page .bg-grid {
          position: absolute;
          inset: 0;
          opacity: .55;
          background-image:
            linear-gradient(rgba(69,165,255,.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(69,165,255,.045) 1px, transparent 1px);
          background-size: 54px 54px;
          mask-image: linear-gradient(
            to bottom,
            black,
            black 45%,
            transparent 100%
          );
        }

        .projects-page .bg-grid::after {
          content: "";
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(69,165,255,.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(69,165,255,.02) 1px, transparent 1px);
          background-size: 13px 13px;
        }

        .projects-page .bg-glow {
          position: absolute;
          width: 500px;
          height: 500px;
          border-radius: 50%;
          filter: blur(100px);
          opacity: .12;
        }

        .projects-page .glow-one {
          left: -230px;
          top: 400px;
          background: #1687ff;
        }

        .projects-page .glow-two {
          right: -250px;
          top: 950px;
          background: #45a5ff;
        }

        .projects-page .bg-terminal {
          position: absolute;
          top: 170px;
          right: 4%;
          width: 370px;
          color: rgba(69,165,255,.075);
          font: 9px/2.1 ui-monospace, SFMono-Regular, Menlo, monospace;
          letter-spacing: .08em;
          transform: rotate(4deg);
          mask-image: linear-gradient(
            to bottom,
            transparent,
            black 15%,
            black 65%,
            transparent
          );
        }

        .projects-page .bg-terminal .blue {
          color: rgba(69,165,255,.18);
        }

        .projects-page .bg-stream {
          position: absolute;
          white-space: nowrap;
          color: rgba(69,165,255,.065);
          font: 8px ui-monospace, SFMono-Regular, Menlo, monospace;
          letter-spacing: .18em;
        }

        .projects-page .stream-one {
          top: 280px;
          left: -180px;
          transform: rotate(-7deg);
          animation: projectStream 22s linear infinite;
        }

        .projects-page .stream-two {
          top: 820px;
          right: -240px;
          transform: rotate(6deg);
          animation: projectStreamReverse 25s linear infinite;
        }

        .projects-page .scan-beam {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 1px;
          background: #45a5ff;
          box-shadow: 0 0 18px rgba(69,165,255,.7);
          opacity: .12;
          animation: projectScan 8s linear infinite;
        }

        .projects-page .logo-link {
          display: inline-flex;
          filter: drop-shadow(0 0 14px rgba(22,135,255,.12));
          transition: filter .3s ease, transform .3s ease;
        }

        .projects-page .logo-link:hover {
          filter: drop-shadow(0 0 25px rgba(69,165,255,.45));
          transform: translateY(-1px);
        }

        .projects-page .hero-panel {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(69,165,255,.16);
          background:
            linear-gradient(
              135deg,
              rgba(255,255,255,.035),
              rgba(255,255,255,.008)
            ),
            rgba(5,10,16,.76);
          box-shadow:
            0 30px 100px rgba(0,0,0,.35),
            inset 0 1px 0 rgba(255,255,255,.04);
          backdrop-filter: blur(22px);
        }

        .projects-page .hero-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              110deg,
              transparent 25%,
              rgba(69,165,255,.07) 50%,
              transparent 75%
            );
          transform: translateX(-110%);
          animation: projectSweep 8s ease-in-out infinite;
        }

        .projects-page .hero-visual {
          position: relative;
          min-height: 390px;
          overflow: hidden;
          background:
            radial-gradient(
              circle at 50% 50%,
              rgba(22,135,255,.16),
              transparent 23%
            );
        }

        .projects-page .hero-orbit {
          position: absolute;
          left: 50%;
          top: 50%;
          border: 1px solid rgba(69,165,255,.16);
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        .projects-page .hero-orbit.one {
          width: 155px;
          height: 155px;
          animation: projectOrbit 11s linear infinite;
        }

        .projects-page .hero-orbit.two {
          width: 245px;
          height: 245px;
          border-style: dashed;
          animation: projectOrbitReverse 16s linear infinite;
        }

        .projects-page .hero-orbit.three {
          width: 345px;
          height: 345px;
          opacity: .55;
          animation: projectOrbit 24s linear infinite;
        }

        .projects-page .hero-core {
          position: absolute;
          left: 50%;
          top: 50%;
          display: grid;
          place-items: center;
          width: 98px;
          height: 98px;
          border: 1px solid rgba(120,196,255,.48);
          border-radius: 25px;
          background:
            radial-gradient(
              circle at 50% 35%,
              rgba(69,165,255,.23),
              rgba(4,13,22,.95)
            );
          box-shadow:
            0 0 45px rgba(22,135,255,.22),
            inset 0 0 30px rgba(69,165,255,.08);
          transform: translate(-50%, -50%);
          animation: projectCorePulse 3.5s ease-in-out infinite;
        }

        .projects-page .hero-core img {
          width: 62px;
          height: auto;
        }

        .projects-page .hero-node {
          position: absolute;
          display: grid;
          place-items: center;
          width: 42px;
          height: 42px;
          border: 1px solid rgba(69,165,255,.2);
          border-radius: 13px;
          background: rgba(5,13,22,.86);
          color: #78c4ff;
          font: 7px ui-monospace, SFMono-Regular, monospace;
          letter-spacing: .08em;
          box-shadow: 0 0 25px rgba(22,135,255,.08);
        }

        .projects-page .hero-node-a {
          left: 16%;
          top: 22%;
          animation: projectFloat 5s ease-in-out infinite;
        }

        .projects-page .hero-node-b {
          right: 16%;
          top: 22%;
          animation: projectFloat 5.5s ease-in-out infinite 1s;
        }

        .projects-page .hero-node-c {
          left: 18%;
          bottom: 20%;
          animation: projectFloat 5.2s ease-in-out infinite .5s;
        }

        .projects-page .hero-node-d {
          right: 18%;
          bottom: 20%;
          animation: projectFloat 5.8s ease-in-out infinite 1.3s;
        }

        .projects-page .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1px solid rgba(76,224,165,.17);
          border-radius: 999px;
          padding: 6px 10px;
          color: #5ce0ad;
          background: rgba(76,224,165,.035);
          font: 8px ui-monospace, SFMono-Regular, monospace;
          letter-spacing: .1em;
        }

        .projects-page .status-pill i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #4ce0a5;
          box-shadow: 0 0 9px #4ce0a5;
          animation: projectPulse 1.6s infinite;
        }

        .projects-page .section-label {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #45a5ff;
          font: 9px ui-monospace, SFMono-Regular, monospace;
          font-weight: 700;
          letter-spacing: .22em;
        }

        .projects-page .section-label::before {
          content: "";
          width: 20px;
          height: 1px;
          background: #1687ff;
          box-shadow: 0 0 10px #1687ff;
        }

        .projects-page .project-card {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.075);
          background:
            linear-gradient(
              145deg,
              rgba(255,255,255,.035),
              rgba(255,255,255,.01)
            ),
            #080d14;
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,.025),
            0 20px 55px rgba(0,0,0,.13);
          transition:
            transform .35s ease,
            border-color .35s ease,
            box-shadow .35s ease;
        }

        .projects-page .project-card::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            linear-gradient(
              120deg,
              transparent 25%,
              rgba(69,165,255,.045) 50%,
              transparent 75%
            );
          transform: translateX(-120%);
          transition: transform .8s ease;
        }

        .projects-page .project-card:hover {
          transform: translateY(-7px);
          border-color: rgba(69,165,255,.32);
          box-shadow:
            0 30px 80px rgba(0,45,100,.2),
            inset 0 1px 0 rgba(255,255,255,.04);
        }

        .projects-page .project-card:hover::after {
          transform: translateX(120%);
        }

        .projects-page .project-visual {
          position: relative;
          height: 235px;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.06);
          border-radius: 15px;
          background: #070c13;
        }

        .projects-page .visual-label {
          position: absolute;
          left: 15px;
          right: 15px;
          bottom: 13px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid rgba(255,255,255,.06);
          padding-top: 9px;
          color: #4d647c;
          font: 7px ui-monospace, SFMono-Regular, monospace;
          letter-spacing: .1em;
        }

        .projects-page .visual-label span {
          color: #45a5ff;
        }

        .projects-page .code-visual {
          background:
            radial-gradient(
              circle at 75% 25%,
              rgba(22,135,255,.13),
              transparent 35%
            ),
            #060b12;
        }

        .projects-page .visual-grid,
        .projects-page .core-grid {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(69,165,255,.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(69,165,255,.04) 1px, transparent 1px);
          background-size: 28px 28px;
        }

        .projects-page .terminal-window {
          position: absolute;
          top: 35px;
          left: 28px;
          right: 28px;
          border: 1px solid rgba(69,165,255,.18);
          border-radius: 10px;
          background: rgba(5,12,20,.88);
          box-shadow: 0 20px 45px rgba(0,0,0,.28);
        }

        .projects-page .terminal-top {
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px solid rgba(255,255,255,.06);
          padding: 9px 10px;
          color: #51677d;
          font: 7px ui-monospace, SFMono-Regular, monospace;
        }

        .projects-page .terminal-top b {
          margin-left: auto;
          color: #4ce0a5;
          font-size: 6px;
        }

        .projects-page .terminal-dots {
          display: flex;
          gap: 4px;
        }

        .projects-page .terminal-dots i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #35485b;
        }

        .projects-page .terminal-dots i:first-child {
          background: #df6c7a;
        }

        .projects-page .terminal-dots i:nth-child(2) {
          background: #d7a65b;
        }

        .projects-page .terminal-dots i:nth-child(3) {
          background: #4bc796;
        }

        .projects-page .terminal-content {
          padding: 13px;
          color: #7e92a7;
          font: 8px/2 ui-monospace, SFMono-Regular, Menlo, monospace;
        }

        .projects-page .terminal-content p {
          margin: 0;
        }

        .projects-page .terminal-content em {
          display: inline-block;
          width: 22px;
          color: #34485d;
          font-style: normal;
        }

        .projects-page .terminal-content .blue {
          color: #53b5ff;
        }

        .projects-page .terminal-content .white {
          color: #e4edf7;
        }

        .projects-page .terminal-content .purple {
          color: #bd9cff;
        }

        .projects-page .terminal-content .green {
          color: #6fe1b0;
        }

        .projects-page .cursor {
          display: inline-block;
          width: 4px;
          height: 10px;
          margin-left: 4px;
          vertical-align: middle;
          background: #45a5ff;
          animation: projectBlink 1s steps(2,start) infinite;
        }

        .projects-page .visual-orb {
          position: absolute;
          width: 90px;
          height: 90px;
          right: -20px;
          bottom: -25px;
          border-radius: 50%;
          filter: blur(30px);
        }

        .projects-page .orb-blue {
          background: rgba(22,135,255,.2);
        }

        .projects-page .security-visual {
          background:
            radial-gradient(
              circle at 50% 45%,
              rgba(76,224,165,.11),
              transparent 35%
            ),
            #06100e;
        }

        .projects-page .security-grid {
          position: absolute;
          inset: 0;
          opacity: .22;
          background-image:
            linear-gradient(rgba(76,224,165,.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(76,224,165,.07) 1px, transparent 1px);
          background-size: 26px 26px;
        }

        .projects-page .security-scan {
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 1px;
          background: #4ce0a5;
          box-shadow: 0 0 15px #4ce0a5;
          opacity: .5;
          animation: projectScanSmall 4s linear infinite;
        }

        .projects-page .security-center {
          position: absolute;
          left: 50%;
          top: 48%;
          width: 110px;
          height: 110px;
          transform: translate(-50%, -50%);
        }

        .projects-page .security-ring {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(76,224,165,.2);
          border-radius: 50%;
        }

        .projects-page .ring-one {
          animation: projectOrbit 7s linear infinite;
        }

        .projects-page .ring-two {
          inset: 13px;
          border-style: dashed;
          animation: projectOrbitReverse 9s linear infinite;
        }

        .projects-page .security-shield {
          position: absolute;
          left: 50%;
          top: 50%;
          display: grid;
          place-items: center;
          width: 58px;
          height: 58px;
          border: 1px solid rgba(76,224,165,.35);
          border-radius: 18px;
          color: #4ce0a5;
          background: rgba(5,27,21,.85);
          box-shadow: 0 0 35px rgba(76,224,165,.1);
          transform: translate(-50%, -50%);
        }

        .projects-page .security-lines {
          position: absolute;
          top: 14px;
          left: 15px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          color: #5d8275;
          font: 6px ui-monospace, SFMono-Regular, monospace;
          letter-spacing: .1em;
        }

        .projects-page .network-visual {
          background:
            radial-gradient(
              circle at 50% 50%,
              rgba(22,135,255,.12),
              transparent 35%
            ),
            #060c13;
        }

        .projects-page .network-status {
          position: absolute;
          top: 14px;
          left: 15px;
          right: 15px;
          display: flex;
          justify-content: space-between;
          color: #60788f;
          font: 7px ui-monospace, SFMono-Regular, monospace;
          letter-spacing: .08em;
        }

        .projects-page .network-status span {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #4ce0a5;
        }

        .projects-page .network-status i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #4ce0a5;
          box-shadow: 0 0 8px #4ce0a5;
        }

        .projects-page .network-map {
          position: absolute;
          top: 32px;
          left: 15px;
          width: calc(100% - 30px);
          height: 175px;
        }

        .projects-page .network-lines path {
          fill: none;
          stroke: rgba(69,165,255,.32);
          stroke-width: 1.2;
          stroke-dasharray: 5 5;
          animation: projectDash 12s linear infinite;
        }

        .projects-page .network-points circle {
          fill: #0a1e32;
          stroke: #45a5ff;
          stroke-width: 1.4;
          filter: drop-shadow(0 0 5px rgba(69,165,255,.35));
        }

        .projects-page .network-points .core {
          fill: #12385b;
          stroke: #78c4ff;
          stroke-width: 2;
        }

        .projects-page .network-text {
          fill: #d5ecff;
          font: 7px ui-monospace, SFMono-Regular, monospace;
        }

        .projects-page .chart-visual {
          padding: 17px;
          background:
            radial-gradient(
              ellipse at 50% 0%,
              rgba(185,148,255,.1),
              transparent 55%
            ),
            #090812;
        }

        .projects-page .chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #7d7397;
          font: 8px ui-monospace, SFMono-Regular, monospace;
          letter-spacing: .1em;
        }

        .projects-page .chart-header b {
          color: #72dfb0;
          font-size: 11px;
        }

        .projects-page .bars {
          position: absolute;
          left: 17px;
          right: 17px;
          top: 54px;
          bottom: 48px;
          display: flex;
          align-items: end;
          gap: 8px;
          background:
            repeating-linear-gradient(
              to bottom,
              transparent,
              transparent 30px,
              rgba(255,255,255,.04) 31px
            );
          border-bottom: 1px solid rgba(255,255,255,.07);
        }

        .projects-page .bars span {
          flex: 1;
          height: var(--height);
          transform-origin: bottom;
          border-radius: 4px 4px 0 0;
          background:
            linear-gradient(
              to top,
              #7955d8,
              rgba(185,148,255,.35)
            );
          box-shadow: 0 0 12px rgba(185,148,255,.1);
          animation: projectBars .8s ease-out both;
          animation-delay: var(--delay);
        }

        .projects-page .chart-bottom {
          position: absolute;
          left: 17px;
          right: 17px;
          bottom: 34px;
          display: flex;
          justify-content: space-between;
          color: #514e61;
          font: 6px ui-monospace, SFMono-Regular, monospace;
          letter-spacing: .12em;
        }

        .projects-page .growth-visual {
          padding: 17px;
          background:
            radial-gradient(
              ellipse at 50% 0%,
              rgba(255,173,98,.1),
              transparent 55%
            ),
            #0d0b09;
        }

        .projects-page .growth-header {
          display: flex;
          justify-content: space-between;
          color: #92785f;
          font: 8px ui-monospace, SFMono-Regular, monospace;
          letter-spacing: .1em;
        }

        .projects-page .growth-header b {
          color: #63dca9;
        }

        .projects-page .growth-chart {
          position: absolute;
          left: 15px;
          right: 15px;
          top: 43px;
          width: calc(100% - 30px);
          height: 125px;
        }

        .projects-page .growth-chart > path:first-child {
          fill: none;
          stroke: rgba(255,255,255,.06);
          stroke-width: 1;
        }

        .projects-page .growth-area {
          fill: rgba(255,173,98,.08);
        }

        .projects-page .growth-line {
          fill: none;
          stroke: #ffad62;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 500;
          stroke-dashoffset: 500;
          animation: projectDraw 2s ease forwards;
        }

        .projects-page .growth-chart circle {
          fill: white;
          stroke: #ffad62;
          stroke-width: 3;
          animation: projectPulse 2s infinite;
        }

        .projects-page .growth-stats {
          position: absolute;
          left: 17px;
          right: 17px;
          bottom: 33px;
          display: grid;
          grid-template-columns: repeat(3,1fr);
          gap: 5px;
        }

        .projects-page .growth-stats span {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .projects-page .growth-stats b {
          color: #67584c;
          font: 6px ui-monospace, SFMono-Regular, monospace;
        }

        .projects-page .growth-stats strong {
          color: #f1ddc9;
          font-size: 11px;
        }

        .projects-page .core-visual {
          background:
            radial-gradient(
              circle at 50% 50%,
              rgba(69,165,255,.16),
              transparent 25%
            ),
            #060a10;
        }

        .projects-page .core-orbit {
          position: absolute;
          left: 50%;
          top: 48%;
          border: 1px solid rgba(69,165,255,.16);
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }

        .projects-page .orbit-a {
          width: 110px;
          height: 110px;
          animation: projectOrbit 8s linear infinite;
        }

        .projects-page .orbit-b {
          width: 185px;
          height: 185px;
          border-style: dashed;
          animation: projectOrbitReverse 12s linear infinite;
        }

        .projects-page .orbit-c {
          width: 280px;
          height: 280px;
          opacity: .45;
          animation: projectOrbit 18s linear infinite;
        }

        .projects-page .core-center {
          position: absolute;
          left: 50%;
          top: 48%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          color: #45a5ff;
          transform: translate(-50%, -50%);
          filter: drop-shadow(0 0 15px rgba(22,135,255,.3));
        }

        .projects-page .core-center span {
          color: #7189a0;
          font: 7px ui-monospace, SFMono-Regular, monospace;
          letter-spacing: .16em;
        }

        .projects-page .core-node {
          position: absolute;
          display: grid;
          place-items: center;
          width: 32px;
          height: 32px;
          border: 1px solid rgba(69,165,255,.22);
          border-radius: 9px;
          background: rgba(5,13,22,.85);
          color: #7894ad;
          font: 6px ui-monospace, SFMono-Regular, monospace;
        }

        .projects-page .node-a {
          left: 22%;
          top: 27%;
        }

        .projects-page .node-b {
          right: 22%;
          top: 27%;
        }

        .projects-page .node-c {
          left: 22%;
          bottom: 27%;
        }

        .projects-page .node-d {
          right: 22%;
          bottom: 27%;
        }

        .projects-page .service-icon {
          display: grid;
          place-items: center;
          width: 48px;
          height: 48px;
          border: 1px solid rgba(69,165,255,.18);
          border-radius: 14px;
          color: #45a5ff;
          background: rgba(22,135,255,.045);
          box-shadow: inset 0 1px 0 rgba(255,255,255,.035);
          transition:
            transform .3s ease,
            border-color .3s ease,
            box-shadow .3s ease;
        }

        .projects-page .project-card:hover .service-icon {
          transform: translateY(-2px);
          border-color: rgba(69,165,255,.42);
          box-shadow: 0 0 25px rgba(22,135,255,.11);
        }

        .projects-page .service-icon.green {
          color: #4ce0a5;
          background: rgba(76,224,165,.045);
          border-color: rgba(76,224,165,.17);
        }

        .projects-page .service-icon.cyan {
          color: #6ecbff;
        }

        .projects-page .service-icon.purple {
          color: #b994ff;
          background: rgba(185,148,255,.045);
          border-color: rgba(185,148,255,.17);
        }

        .projects-page .service-icon.orange {
          color: #ffad62;
          background: rgba(255,173,98,.045);
          border-color: rgba(255,173,98,.17);
        }

        .projects-page .service-icon.silver {
          color: #dce8f8;
          background: rgba(220,232,248,.04);
          border-color: rgba(220,232,248,.14);
        }

        .projects-page .details-panel {
          border-top: 1px solid rgba(69,165,255,.12);
          background: rgba(3,8,14,.7);
        }

        .projects-page details[open] .details-arrow {
          transform: rotate(90deg);
        }

        .projects-page .details-arrow {
          transition: transform .25s ease;
        }

        .projects-page .details-summary {
          cursor: pointer;
          list-style: none;
        }

        .projects-page .details-summary::-webkit-details-marker {
          display: none;
        }

        .projects-page .whatsapp-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          border: 1px solid rgba(76,224,165,.25);
          border-radius: 9px;
          background: rgba(76,224,165,.07);
          padding: 11px 15px;
          color: #65e5b2;
          font-size: 12px;
          font-weight: 700;
          transition:
            transform .25s ease,
            border-color .25s ease,
            background .25s ease,
            box-shadow .25s ease;
        }

        .projects-page .whatsapp-button:hover {
          transform: translateY(-1px);
          border-color: rgba(76,224,165,.55);
          background: rgba(76,224,165,.12);
          box-shadow: 0 0 25px rgba(76,224,165,.1);
        }

        .projects-page .cta-panel {
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(69,165,255,.18);
          background:
            radial-gradient(
              circle at 50% 0%,
              rgba(22,135,255,.14),
              transparent 50%
            ),
            rgba(6,12,20,.85);
          box-shadow:
            0 30px 100px rgba(0,0,0,.3),
            inset 0 1px 0 rgba(255,255,255,.035);
        }

        .projects-page .cta-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: .5;
          background-image:
            linear-gradient(rgba(69,165,255,.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(69,165,255,.035) 1px, transparent 1px);
          background-size: 34px 34px;
          mask-image: radial-gradient(circle, black, transparent 70%);
        }

        .projects-page .cta-status {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          border: 1px solid rgba(76,224,165,.18);
          border-radius: 999px;
          padding: 6px 10px;
          color: #5ce0ad;
          background: rgba(76,224,165,.035);
          font: 8px ui-monospace, SFMono-Regular, monospace;
          letter-spacing: .1em;
        }

        .projects-page .cta-status i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #4ce0a5;
          box-shadow: 0 0 9px #4ce0a5;
        }

        @keyframes projectBlink {
          50% { opacity: 0; }
        }

        @keyframes projectPulse {
          50% {
            opacity: .55;
            transform: scale(.97);
          }
        }

        @keyframes projectBars {
          from {
            transform: scaleY(.08);
            opacity: .4;
          }
          to {
            transform: scaleY(1);
            opacity: 1;
          }
        }

        @keyframes projectDraw {
          to { stroke-dashoffset: 0; }
        }

        @keyframes projectOrbit {
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        @keyframes projectOrbitReverse {
          to {
            transform: translate(-50%, -50%) rotate(-360deg);
          }
        }

        @keyframes projectCorePulse {
          50% {
            box-shadow:
              0 0 65px rgba(22,135,255,.32),
              inset 0 0 35px rgba(69,165,255,.12);
          }
        }

        @keyframes projectFloat {
          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes projectDash {
          to {
            stroke-dashoffset: -100;
          }
        }

        @keyframes projectScan {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(100vh);
          }
        }

        @keyframes projectScanSmall {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(235px);
          }
        }

        @keyframes projectSweep {
          0%, 35% {
            transform: translateX(-110%);
          }
          70%, 100% {
            transform: translateX(110%);
          }
        }

        @keyframes projectStream {
          from {
            transform: translateX(-10%) rotate(-7deg);
          }
          to {
            transform: translateX(30%) rotate(-7deg);
          }
        }

        @keyframes projectStreamReverse {
          from {
            transform: translateX(10%) rotate(6deg);
          }
          to {
            transform: translateX(-30%) rotate(6deg);
          }
        }

        @media (max-width: 900px) {
          .projects-page .bg-terminal {
            display: none;
          }

          .projects-page .hero-visual {
            min-height: 350px;
          }

          .projects-page .hero-orbit.three {
            width: 300px;
            height: 300px;
          }
        }

        @media (max-width: 640px) {
          .projects-page .hero-visual {
            min-height: 300px;
          }

          .projects-page .hero-orbit.one {
            width: 125px;
            height: 125px;
          }

          .projects-page .hero-orbit.two {
            width: 195px;
            height: 195px;
          }

          .projects-page .hero-orbit.three {
            width: 260px;
            height: 260px;
          }

          .projects-page .hero-core {
            width: 82px;
            height: 82px;
            border-radius: 21px;
          }

          .projects-page .hero-core img {
            width: 52px;
          }

          .projects-page .hero-node {
            width: 35px;
            height: 35px;
          }

          .projects-page .project-visual {
            height: 220px;
          }

          .projects-page .terminal-window {
            left: 18px;
            right: 18px;
          }

          .projects-page .stream-one,
          .projects-page .stream-two {
            opacity: .45;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .projects-page *,
          .projects-page *::before,
          .projects-page *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      {/* Animated technical background */}
      <div className="page-bg" aria-hidden="true">
        <div className="bg-grid" />
        <div className="bg-glow glow-one" />
        <div className="bg-glow glow-two" />

        <div className="bg-terminal">
          <span>vexora@core:~$</span> initialize --projects
          <br />
          <span className="blue">[SYSTEM]</span> loading service modules...
          <br />
          <span className="blue">[DEV]</span> application engine online
          <br />
          <span className="blue">[SEC]</span> security layer online
          <br />
          <span className="blue">[NET]</span> infrastructure layer online
          <br />
          <span className="blue">[DATA]</span> analytics engine online
          <br />
          <span className="blue">[GROW]</span> growth engine online
          <br />
          <span className="blue">[CORE]</span> integrated technology ready_
        </div>

        <div className="bg-stream stream-one">
          01001010 01000101 01000001 01010100 01000101 01010010 // VEXORA //
          SECURE // BUILD // DATA // NETWORK // 7F A2 91 C4 03 8D FF
        </div>

        <div className="bg-stream stream-two">
          CORE::ONLINE / API::READY / SECURITY::ACTIVE / DATA::STREAMING /
          INFRA::STABLE / GROWTH::TRACKING
        </div>

        <div className="scan-beam" />
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/[0.07] bg-[#04070b]/80 backdrop-blur-2xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 sm:px-8 lg:px-10">
          <Link
            href="/"
            className="logo-link"
            aria-label="VEXORA Technology home"
          >
            <Image
              src="/vexora-logo.png"
              alt="VEXORA Technology"
              width={145}
              height={70}
              priority
              className="h-auto w-[105px] sm:w-[125px]"
            />
          </Link>

          <div className="hidden items-center gap-7 text-[13px] text-gray-400 lg:flex">
            <Link href="/" className="transition hover:text-white">
              Home
            </Link>

            <Link href="/services" className="transition hover:text-white">
              Services
            </Link>

            <Link href="/about" className="transition hover:text-white">
              About
            </Link>

            <Link
              href="/projects"
              aria-current="page"
              className="relative text-[#45a5ff]"
            >
              Projects
              <span className="absolute -bottom-6 left-0 h-px w-full bg-[#1687ff] shadow-[0_0_10px_#1687ff]" />
            </Link>

            <Link href="/academy" className="transition hover:text-white">
              Academy
            </Link>

            <Link href="/contact" className="transition hover:text-white">
              Contact
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2.5 text-xs font-semibold text-gray-300 transition hover:border-[#45a5ff]/40 hover:text-white sm:inline-flex"
            >
              Login
            </Link>

            <Link
              href="/contact"
              className="hidden items-center gap-2 rounded-lg bg-[#1687ff] px-4 py-2.5 text-xs font-semibold text-white shadow-[0_0_25px_rgba(22,135,255,.13)] transition hover:bg-[#0875e5] sm:inline-flex"
            >
              Start a project
              <ArrowUpRight />
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative border-b border-white/[0.07]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[1.05fr_.95fr] lg:px-10 lg:py-28">
          <div className="relative z-10">
            <div className="mb-6">
              <span className="section-label">
                VEXORA / PROJECTS & SERVICES
              </span>
            </div>

            <div className="mb-6 flex flex-wrap items-center gap-3">
              <span className="status-pill">
                <i />
                TECHNOLOGY SYSTEMS ONLINE
              </span>

              <span className="font-mono text-[8px] tracking-[.14em] text-[#52677e]">
                BUILD / PROTECT / CONNECT / GROW
              </span>
            </div>

            <h1 className="max-w-4xl text-4xl font-bold leading-[1.02] tracking-[-.045em] sm:text-6xl lg:text-[72px]">
              Ideas into
              <span className="block bg-gradient-to-r from-white via-[#bfe4ff] to-[#1687ff] bg-clip-text text-transparent">
                digital solutions.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-[#8b9aac] sm:text-lg">
              Explore what VEXORA can build, secure, connect, analyze, and
              improve for your business. Open any service module to see exactly
              what we can provide.
            </p>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/services"
                className="group inline-flex items-center gap-3 rounded-lg bg-[#1687ff] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_0_35px_rgba(22,135,255,.16)] transition hover:-translate-y-0.5 hover:bg-[#0875e5]"
              >
                Explore all services
                <span className="transition-transform group-hover:translate-x-1">
                  <ArrowUpRight />
                </span>
              </Link>

              <a
                href={`https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent(
                  "Hello VEXORA, I would like to discuss a technology project."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.025] px-5 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-[#4ce0a5]/45 hover:text-[#65e5b2]"
              >
                Talk to VEXORA
                <WhatsAppIcon />
              </a>
            </div>
          </div>

          {/* Hero Core */}
          <div className="relative mx-auto w-full max-w-[560px]">
            <div className="hero-panel rounded-[26px] p-2">
              <div className="relative flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
                <div>
                  <p className="font-mono text-[9px] font-bold tracking-[.16em] text-[#dceeff]">
                    VEXORA TECHNOLOGY CORE
                  </p>
                  <p className="mt-1 font-mono text-[7px] tracking-[.12em] text-[#526b82]">
                    PROJECT ECOSYSTEM / 2026
                  </p>
                </div>

                <span className="status-pill">
                  <i />
                  ONLINE
                </span>
              </div>

              <div className="hero-visual">
                <div className="hero-orbit one" />
                <div className="hero-orbit two" />
                <div className="hero-orbit three" />

                <div className="hero-node hero-node-a">
                  SOFTWARE
                </div>

                <div className="hero-node hero-node-b">
                  SECURITY
                </div>

                <div className="hero-node hero-node-c">
                  NETWORK
                </div>

                <div className="hero-node hero-node-d">
                  DATA
                </div>

                <div className="hero-core">
                  <Image
                    src="/vexora-logo.png"
                    alt=""
                    width={90}
                    height={90}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project / Service Modules */}
      <section className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="mb-12 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <span className="section-label">01 / SERVICE MODULES</span>

            <h2 className="mt-5 text-3xl font-bold tracking-[-.03em] sm:text-4xl">
              Technology across disciplines.
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#7e8ea1]">
              Every module below represents a real area of technology that
              VEXORA can provide. Click the service icon or{" "}
              <span className="text-[#45a5ff]">View details</span> to open the
              full service scope.
            </p>
          </div>

          <div className="font-mono text-[8px] tracking-[.14em] text-[#4f657c]">
            {projects.length.toString().padStart(2, "0")} SERVICE SYSTEMS /
            ACTIVE
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <article
              key={project.number}
              id={`project-${project.number}`}
              className="project-card rounded-2xl p-3 sm:p-4"
            >
              <ServiceVisual
                icon={project.icon}
                number={project.number}
              />

              <div className="px-1 pt-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="mb-3 flex items-center gap-3">
                      <Link
                        href={`#project-${project.number}`}
                        aria-label={`Open ${project.title} service details`}
                        title={`Open ${project.title} service details`}
                        className={`service-icon ${project.accent}`}
                      >
                        <ServiceIcon icon={project.icon} />
                      </Link>

                      <span className="font-mono text-[8px] tracking-[.16em] text-[#526a82]">
                        {project.code}
                      </span>
                    </div>

                    <p className="font-mono text-[8px] uppercase tracking-[.13em] text-[#50677f]">
                      {project.category}
                    </p>

                    <h3 className="mt-2 text-xl font-semibold leading-tight tracking-tight text-[#edf6ff]">
                      {project.title}
                    </h3>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-[#7e8ea1]">
                  {project.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/[0.07] bg-white/[0.018] px-2.5 py-1 font-mono text-[8px] text-[#60758b]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Native interactive details — no JS required */}
                <details className="mt-6 overflow-hidden rounded-xl border border-white/[0.07]">
                  <summary className="details-summary flex items-center justify-between gap-3 px-4 py-3.5 text-xs font-semibold text-[#b8c8d9] transition hover:bg-white/[0.025] hover:text-white">
                    <span className="flex items-center gap-2">
                      <span className="font-mono text-[8px] text-[#45a5ff]">
                        DETAILS
                      </span>
                      View service details
                    </span>

                    <span className="details-arrow text-[#45a5ff]">
                      <ArrowRight />
                    </span>
                  </summary>

                  <div className="details-panel px-4 py-5">
                    <p className="text-xs leading-6 text-[#8494a7]">
                      {project.details}
                    </p>

                    <div className="mt-5 grid gap-2 sm:grid-cols-2">
                      {project.services.map((service) => (
                        <div
                          key={service}
                          className="flex items-start gap-2 rounded-lg border border-white/[0.05] bg-white/[0.015] px-3 py-2.5 text-[10px] text-[#8294a8]"
                        >
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#1687ff] shadow-[0_0_7px_rgba(22,135,255,.7)]" />
                          {service}
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.06] pt-5">
                      <div>
                        <p className="font-mono text-[8px] tracking-[.14em] text-[#4f667d]">
                          READY TO DISCUSS THIS SERVICE?
                        </p>

                        <p className="mt-1 text-xs text-[#74869a]">
                          Contact VEXORA directly on WhatsApp and tell us what
                          you need.
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={project.href}
                          className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.025] px-4 py-2.5 text-xs font-semibold text-[#cbd9e7] transition hover:border-[#45a5ff]/40 hover:text-white"
                        >
                          Full service page
                          <ArrowUpRight />
                        </Link>

                        <a
                          href={whatsappLink(project.category)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="whatsapp-button"
                        >
                          <WhatsAppIcon />
                          Contact us on WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </details>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-y border-white/[0.07] bg-white/[0.012]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
          <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:gap-20">
            <div>
              <span className="section-label">02 / PROCESS</span>

              <h2 className="mt-5 text-3xl font-bold leading-tight tracking-[-.03em] sm:text-4xl">
                From challenge
                <span className="block text-[#45a5ff]">
                  to technology.
                </span>
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-[#7e8ea1]">
                We start by understanding the business challenge, then shape
                the right technology path instead of forcing a predefined
                solution.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                {
                  number: "01",
                  title: "Understand",
                  text: "We understand your goals, requirements, users, and current technology environment.",
                },
                {
                  number: "02",
                  title: "Design",
                  text: "We define the appropriate architecture, experience, technology, and implementation direction.",
                },
                {
                  number: "03",
                  title: "Build",
                  text: "We develop and integrate the solution with attention to quality, security, and performance.",
                },
                {
                  number: "04",
                  title: "Improve",
                  text: "We help monitor, optimize, maintain, and evolve the technology as the business grows.",
                },
              ].map((step) => (
                <div
                  key={step.number}
                  className="rounded-xl border border-white/[0.07] bg-[#080d14] p-5"
                >
                  <span className="font-mono text-[9px] tracking-[.15em] text-[#45a5ff]">
                    {step.number}
                  </span>

                  <h3 className="mt-5 text-base font-semibold text-[#e6f1fb]">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-[#73859a]">
                    {step.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 py-20 sm:px-8 lg:px-10 lg:py-28">
        <div className="cta-panel mx-auto max-w-7xl rounded-[26px] px-6 py-14 text-center sm:px-12 lg:px-20 lg:py-20">
          <div className="relative">
            <span className="cta-status">
              <i />
              VEXORA / READY TO CONNECT
            </span>

            <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-bold leading-tight tracking-[-.035em] sm:text-5xl">
              Have a project in mind?
              <span className="block bg-gradient-to-r from-white to-[#45a5ff] bg-clip-text text-transparent">
                Let&apos;s talk technology.
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#7d8fa2] sm:text-base">
              Tell us what you want to build, secure, connect, analyze, or
              improve. Our team can help you find the right technology
              direction.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href={`https://wa.me/${COMPANY_WHATSAPP}?text=${encodeURIComponent(
                  "Hello VEXORA, I would like to discuss a project with your team."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-lg bg-[#1687ff] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_0_35px_rgba(22,135,255,.15)] transition hover:-translate-y-0.5 hover:bg-[#0875e5]"
              >
                <WhatsAppIcon />
                Talk to VEXORA on WhatsApp
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.025] px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-[#45a5ff]/45"
              >
                Open contact page
                <ArrowUpRight />
              </Link>
            </div>

            <p className="mt-6 font-mono text-[8px] tracking-[.14em] text-[#4c637a]">
              WHATSAPP / 01115449868
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.07]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-8 text-center sm:px-8 md:flex-row md:text-left lg:px-10">
          <Link
            href="/"
            className="logo-link"
            aria-label="VEXORA Technology home"
          >
            <Image
              src="/vexora-logo.png"
              alt="VEXORA Technology"
              width={112}
              height={54}
              className="h-auto w-24"
            />
          </Link>

          <div>
            <p className="font-mono text-[8px] tracking-[.14em] text-[#50677e]">
              VEXORA TECHNOLOGY SYSTEMS
            </p>

            <p className="mt-1 text-xs text-gray-600">
              © 2026 VEXORA. All rights reserved.
            </p>
          </div>

          <div className="flex gap-5 text-xs text-gray-500">
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