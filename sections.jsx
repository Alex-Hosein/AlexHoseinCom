// sections.jsx — page sections for AlexHosein.com
// Exports components to window so app.jsx can compose them.

const { useEffect, useRef, useState } = React;

/* ───────────────────────────── Shared primitives ───────────────────────────── */

function Reveal({ children, delay = 0, as: Tag = "div", className = "", ...rest }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { setTimeout(() => el.classList.add("in"), delay); io.unobserve(el); }
      }),
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay]);
  return <Tag ref={ref} className={`reveal ${className}`} {...rest}>{children}</Tag>;
}

function Pill({ children, accent = false }) {
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      padding: "5px 10px",
      fontSize: 11.5, fontFamily: "var(--mono)", letterSpacing: ".02em",
      borderRadius: 999,
      border: "1px solid var(--line-strong)",
      background: accent ? "var(--accent-soft)" : "rgba(255,255,255,0.03)",
      color: accent ? "var(--accent)" : "var(--text-2)",
      whiteSpace: "nowrap",
    }}>
      {accent && <span style={{
        width: 5, height: 5, borderRadius: 999, background: "var(--accent)",
        boxShadow: "0 0 8px var(--accent-glow)"
      }} />}
      {children}
    </span>
  );
}

function Tag({ children }) {
  return (
    <span style={{
      fontFamily: "var(--mono)", fontSize: 10.5,
      letterSpacing: ".06em", textTransform: "uppercase",
      color: "var(--text-3)",
      padding: "3px 8px",
      borderRadius: 5,
      border: "1px solid var(--line)",
      background: "rgba(255,255,255,0.02)",
    }}>{children}</span>
  );
}

/* ───────────────────────────── Top Nav ───────────────────────────── */

function TopNav() {
  const [active, setActive] = useState("about");
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const items = [
    ["about", "About"],
    ["work", "Work"],
    ["projects", "Projects"],
    ["skills", "Skills"],
    ["notes", "Notes"],
    ["contact", "Contact"],
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const ids = items.map(([id]) => id);
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    ids.forEach(id => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
      transition: "background .25s ease, border-color .25s ease, backdrop-filter .25s ease",
      background: scrolled ? "rgba(7,9,14,0.72)" : "transparent",
      backdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
      WebkitBackdropFilter: scrolled ? "blur(14px) saturate(140%)" : "none",
      borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
    }}>
      <div className="container" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        height: 64,
      }}>
        <a href="#top" style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          textDecoration: "none", color: "var(--text)",
        }}>
          <span style={{
            width: 24, height: 24, borderRadius: 7,
            background: "linear-gradient(135deg, var(--accent), color-mix(in oklab, var(--accent) 40%, #5060FF))",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.08) inset, 0 6px 18px -8px var(--accent-glow)",
            display: "grid", placeItems: "center",
            fontFamily: "var(--mono)", fontWeight: 700, fontSize: 12, color: "#04101A",
          }}>A</span>
          <span style={{ fontWeight: 600, letterSpacing: "-0.01em" }}>Alex Hosein</span>
          <span className="eyebrow" style={{ marginLeft: 6, color: "var(--text-3)" }}>v 2026</span>
        </a>

        <div className="nav-links" style={{
          display: "flex", alignItems: "center", gap: 4,
          padding: 4,
          border: "1px solid var(--line)",
          borderRadius: 999,
          background: "rgba(255,255,255,0.02)",
        }}>
          {items.map(([id, label]) => (
            <a key={id} href={`#${id}`} style={{
              padding: "7px 14px",
              fontSize: 13,
              borderRadius: 999,
              textDecoration: "none",
              color: active === id ? "var(--text)" : "var(--text-2)",
              background: active === id ? "rgba(255,255,255,0.06)" : "transparent",
              transition: "color .2s ease, background .2s ease",
            }}>{label}</a>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <a className="btn btn-primary nav-cta" href="#contact">
            Connect
            <svg className="ic" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 8h8M9 5l3 3-3 3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <button
            className="nav-burger"
            aria-label="Menu"
            onClick={() => setOpen(o => !o)}
            style={{
              display: "none",
              width: 38, height: 38, borderRadius: 10,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--line-strong)", color: "var(--text)",
              cursor: "pointer",
            }}>
            <svg viewBox="0 0 20 20" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.6">
              {open
                ? <path d="M5 5l10 10M15 5L5 15" strokeLinecap="round"/>
                : <path d="M3 6h14M3 10h14M3 14h14" strokeLinecap="round"/>}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-menu" style={{
          padding: "8px var(--pad-x) 16px",
          borderTop: "1px solid var(--line)",
          background: "rgba(7,9,14,0.95)",
          backdropFilter: "blur(12px)",
        }}>
          {items.map(([id, label]) => (
            <a key={id} href={`#${id}`} onClick={() => setOpen(false)}
              style={{ display:"block", padding:"12px 0", color: "var(--text)", textDecoration:"none",
                       borderBottom: "1px solid var(--line)", fontSize: 15 }}>{label}</a>
          ))}
        </div>
      )}

      <style>{`
        @media (max-width: 880px){
          .nav-links{ display: none !important; }
          .nav-cta span, .nav-cta{ display: inline-flex; }
        }
        @media (max-width: 720px){
          .nav-burger{ display: inline-flex !important; align-items:center; justify-content:center; }
          .nav-cta{ display: none !important; }
        }
        @media (min-width: 721px){
          .mobile-menu{ display:none !important; }
        }
      `}</style>
    </nav>
  );
}

/* ───────────────────────────── Portrait Slot ───────────────────────────── */

function PortraitSlot() {
  return (
    <div className="card" style={{
      position: "relative",
      aspectRatio: "4 / 5",
      width: "100%",
      maxWidth: 420,
      borderRadius: 20,
      boxShadow: "0 30px 80px -30px rgba(0,0,0,0.6), 0 0 0 1px var(--line) inset",
      overflow: "hidden",
    }}>
      <img src="portrait.png" alt="Alex Hosein" style={{
        width: "100%", height: "100%", objectFit: "cover", display: "block",
      }} />
    </div>
  );
}

/* ───────────────────────────── HERO ───────────────────────────── */

function Hero() {
  return (
    <section id="top" style={{ paddingTop: 140, paddingBottom: 0, borderTop: "0 !important" }}>
      <div className="container">
        <div className="hero-grid" style={{
          display: "grid",
          gridTemplateColumns: "1.25fr 0.85fr",
          gap: "clamp(40px, 6vw, 80px)",
          alignItems: "center",
        }}>
          <div>
            <Reveal>
              <div className="eyebrow">A_HOSEIN / 01 — Index</div>
            </Reveal>
            <Reveal delay={80}>
              <h1 style={{ marginTop: 22 }}>
                Alex<br/>Hosein<span style={{ color: "var(--accent)" }}>.</span>
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <div style={{
                marginTop: 20,
                fontSize: "clamp(17px, 1.7vw, 22px)",
                color: "var(--text)",
                fontWeight: 500,
                letterSpacing: "-0.015em",
              }}>
                Quant Developer<span style={{ color: "var(--text-3)", margin: "0 12px" }}>·</span>
                AI Systems Builder<span style={{ color: "var(--text-3)", margin: "0 12px" }}>·</span>
                Founder
              </div>
            </Reveal>
            <Reveal delay={220}>
              <p className="lede" style={{ marginTop: 28 }}>
                I build software systems across finance, AI, fitness, and automation.
                My work focuses on turning complex workflows into clean, scalable tools.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="row" style={{ marginTop: 32 }}>
                <a className="btn btn-primary" href="#work">
                  View Work
                  <svg className="ic" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="M4 8h8M9 5l3 3-3 3" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </a>
                <a className="btn" href="#about">Read About Me</a>
                <a className="btn btn-ghost" href="https://linkedin.com/in/alex-hosein" target="_blank" rel="noopener">
                  <svg className="ic" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M3.6 14h2.5V6.3H3.6V14zM4.85 5.2a1.45 1.45 0 1 0 0-2.9 1.45 1.45 0 0 0 0 2.9zM14 14h-2.5V9.9c0-1-.02-2.3-1.4-2.3-1.4 0-1.6 1.1-1.6 2.2V14H6V6.3h2.4v1.05h.03c.34-.63 1.16-1.3 2.4-1.3 2.56 0 3.04 1.7 3.04 3.9V14z"/>
                  </svg>
                  Connect on LinkedIn
                </a>
              </div>
            </Reveal>
            <Reveal delay={380}>
              <div className="row" style={{ marginTop: 44, gap: 8 }}>
                <Pill accent>Senior Quantitative Developer</Pill>
                <Pill>Founder of HoZyne</Pill>
                <Pill>Finance + AI + Software</Pill>
                <Pill>Systems Builder</Pill>
              </div>
            </Reveal>
          </div>

          <Reveal delay={140} className="hero-portrait" style={{ justifySelf: "end", width: "100%" }}>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <PortraitSlot />
            </div>
          </Reveal>
        </div>

        {/* hero meta bar */}
        <Reveal delay={500}>
          <div style={{
            marginTop: "clamp(60px, 8vw, 96px)",
            paddingTop: 22, paddingBottom: 22,
            borderTop: "1px solid var(--line)",
            borderBottom: "1px solid var(--line)",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 24,
            fontFamily: "var(--mono)",
            fontSize: 11, color: "var(--text-3)",
            letterSpacing: ".14em", textTransform: "uppercase",
          }} className="hero-meta">
            <div><span style={{ color: "var(--text-2)" }}>Currently</span><br/>Building HoZyne · Vitae</div>
            <div><span style={{ color: "var(--text-2)" }}>Domain</span><br/>Fixed Income · AI · Product</div>
            <div><span style={{ color: "var(--text-2)" }}>Stack</span><br/>C# · Python · TS · AWS</div>
            <div style={{ textAlign: "right" }}><span style={{ color: "var(--text-2)" }}>Status</span><br/>
              <span style={{ color: "var(--accent)" }}>● open to conversations</span>
            </div>
          </div>
        </Reveal>
      </div>

      <style>{`
        @media (max-width: 960px){
          .hero-grid{ grid-template-columns: 1fr !important; }
          .hero-portrait{ order: -1; justify-self: start !important; max-width: 340px; }
        }
        @media (max-width: 600px){
          .hero-meta{ grid-template-columns: 1fr 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ───────────────────────────── ABOUT ───────────────────────────── */

function About() {
  const paragraphs = [
    "I'm a Software Engineer and Senior Quantitative Developer with experience building financial systems, automation tools, and AI-enabled workflows. My background sits at the intersection of markets, engineering, and product thinking.",
    "Outside of my professional work, I'm building HoZyne, a technology company focused on practical software products. I'm also building Vitae, a workout tracking product focused on clean training execution, progress tracking, and performance analytics.",
    "I'm interested in systems that create leverage: financial infrastructure, AI agents, developer tools, fitness platforms, education systems, and products that help people perform better.",
    "When I'm not coding or building, I'm usually training, learning Spanish, studying markets, experimenting with AI tools, or planning the next product.",
  ];

  const facets = [
    ["LOCATION", "Remote · NYC orbit"],
    ["LANGUAGES", "English · Aprendiendo Español"],
    ["FOCUS", "Markets · AI · Product"],
    ["INTERESTS", "Training · Systems · Coding"],
  ];

  return (
    <section id="about">
      <div className="container">
        <Reveal>
          <div className="section-header">
            <div className="section-title-block">
              <div className="section-num">02 — About</div>
              <h2>Engineering at the intersection of <span style={{ color: "var(--accent)" }}>markets, AI, and product.</span></h2>
            </div>
          </div>
        </Reveal>

        <div className="about-grid" style={{
          display: "grid",
          gridTemplateColumns: "1.4fr 1fr",
          gap: "clamp(32px, 5vw, 72px)",
        }}>
          <Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: 20, fontSize: 16.5, lineHeight: 1.7, color: "var(--text-2)" }}>
              {paragraphs.map((p, i) => (
                <p key={i} style={{ color: i === 0 ? "var(--text)" : "var(--text-2)" }}>{p}</p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="card" style={{ padding: 24 }}>
              <div className="eyebrow" style={{ marginBottom: 18 }}>at_a_glance</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
                {facets.map(([k, v]) => (
                  <div key={k} style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "12px 0", borderBottom: "1px dashed var(--line)",
                  }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-3)",
                                   letterSpacing: ".14em" }}>{k}</span>
                    <span style={{ fontSize: 13.5, color: "var(--text)" }}>{v}</span>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 22, display: "flex", flexWrap: "wrap", gap: 6 }}>
                {["systems thinking", "calm execution", "AI-native"].map(t => <Tag key={t}>{t}</Tag>)}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (max-width: 880px){
          .about-grid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ───────────────────────────── TIMELINE / BACKGROUND ───────────────────────────── */

function Timeline() {
  const themes = [
    "Financial systems",
    "Fixed income technology",
    "Automation",
    "Internal tools",
    "Quantitative development",
    "Production-grade software",
    "AI & agentic workflows",
  ];

  const entries = [
    {
      time: "Present",
      role: "Senior Quantitative Developer",
      org: "Fixed Income · FinTech",
      copy: "Building and maintaining software systems in the fixed income and financial technology space, with a focus on reliability, automation, data workflows, and scalable engineering.",
      tags: ["Production systems", "Data workflows", "Reliability"],
    },
    {
      time: "Concurrent",
      role: "Founder · HoZyne",
      org: "Independent",
      copy: "Operating an AI-native software studio building practical products at the intersection of finance, fitness, and developer tooling. Shipping with small teams, AI-leveraged workflows, and strong systems thinking.",
      tags: ["Founder", "Product", "AI-native"],
    },
    {
      time: "Building",
      role: "Builder · Vitae",
      org: "Workout Tracking · Performance",
      copy: "Designing and shipping Vitae — a workout tracking app focused on clean training execution, progressive overload, analytics, and athlete-first ergonomics. Solo-built with AI-leveraged engineering.",
      tags: ["Fitness Tech", "Mobile-first", "Analytics"],
    },
  ];

  return (
    <section id="work">
      <div className="container">
        <Reveal>
          <div className="section-header">
            <div className="section-title-block">
              <div className="section-num">03 — Professional Background</div>
              <h2>A career compounding around <span style={{ color: "var(--accent)" }}>markets, systems, and software.</span></h2>
              <p className="lede">Roles, themes, and the throughlines that connect them. Employer names withheld; the work is what matters.</p>
            </div>
          </div>
        </Reveal>

        <div className="timeline-grid" style={{
          display: "grid",
          gridTemplateColumns: "1fr 320px",
          gap: "clamp(32px, 5vw, 72px)",
          alignItems: "start",
        }}>
          {/* timeline column */}
          <div style={{ position: "relative" }}>
            <div style={{
              position: "absolute", left: 14, top: 8, bottom: 8,
              width: 1, background: "linear-gradient(180deg, var(--accent), transparent 90%)",
              opacity: .35,
            }} />
            {entries.map((e, i) => (
              <Reveal key={i} delay={i * 90}>
                <div style={{
                  position: "relative",
                  padding: "0 0 36px 48px",
                }}>
                  <div style={{
                    position: "absolute", left: 8, top: 10, width: 13, height: 13,
                    borderRadius: 999, background: "var(--bg)",
                    border: "1px solid var(--accent)",
                    boxShadow: "0 0 0 4px rgba(7,9,14,1), 0 0 12px var(--accent-glow)",
                  }} />
                  <div style={{ display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                    <span style={{
                      fontFamily: "var(--mono)", fontSize: 11, letterSpacing: ".14em",
                      textTransform: "uppercase", color: "var(--accent)",
                    }}>{e.time}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-3)" }}>· {e.org}</span>
                  </div>
                  <h3 style={{ marginTop: 8, fontSize: 22, letterSpacing: "-0.02em" }}>{e.role}</h3>
                  <p style={{ marginTop: 10, color: "var(--text-2)", maxWidth: 56 + "ch" }}>{e.copy}</p>
                  <div className="row" style={{ marginTop: 14, gap: 6 }}>
                    {e.tags.map(t => <Tag key={t}>{t}</Tag>)}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* themes column */}
          <Reveal delay={120}>
            <div className="card timeline-themes" style={{ padding: 24, position: "sticky", top: 96 }}>
              <div className="eyebrow" style={{ marginBottom: 16 }}>Throughlines</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {themes.map((t, i) => (
                  <div key={t} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "13px 0",
                    borderTop: i === 0 ? "none" : "1px solid var(--line)",
                    fontSize: 14,
                  }}>
                    <span>{t}</span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--text-3)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px){
          .timeline-grid{ grid-template-columns: 1fr !important; }
          .timeline-themes{ position: static !important; }
        }
      `}</style>
    </section>
  );
}

/* ───────────────────────────── SELECTED WORK (Bento) ───────────────────────────── */

function ProjectCard({ project, span, className = "" }) {
  return (
    <Reveal className={`card project-card ${className}`} style={{
      gridColumn: span?.col || "auto",
      gridRow: span?.row || "auto",
      padding: 26,
      display: "flex", flexDirection: "column",
      minHeight: 240,
      cursor: "pointer",
      transition: "transform .25s ease, border-color .25s ease, background .25s ease",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "flex-start",
        gap: 12,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: project.glyphBg || "rgba(255,255,255,0.04)",
          border: "1px solid var(--line-strong)",
          display: "grid", placeItems: "center",
          color: project.glyphColor || "var(--text)",
          fontFamily: "var(--mono)", fontSize: 16, fontWeight: 600,
          letterSpacing: "-0.02em",
        }}>
          {project.glyph}
        </div>
        <span style={{
          fontFamily: "var(--mono)", fontSize: 10.5,
          color: "var(--text-3)", letterSpacing: ".14em", textTransform: "uppercase",
        }}>{project.status}</span>
      </div>

      <div style={{ marginTop: 22, flexGrow: 0 }}>
        <h3 style={{ fontSize: project.large ? 28 : 21, letterSpacing: "-0.02em" }}>{project.title}</h3>
        <p style={{ marginTop: 10, color: "var(--text-2)", fontSize: project.large ? 15.5 : 14.2, maxWidth: "60ch" }}>
          {project.copy}
        </p>
      </div>

      {project.viz && (
        <div style={{ marginTop: 22, flex: 1, minHeight: project.large ? 160 : 120 }}>
          {project.viz}
        </div>
      )}

      <div className="row" style={{ marginTop: 22, gap: 6 }}>
        {project.tags.map(t => <Tag key={t}>{t}</Tag>)}
      </div>

      {project.href ? (
        <a
          href={project.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between", textDecoration: "none" }}
          onClick={e => e.stopPropagation()}
        >
          <span style={{ fontSize: 12, color: "var(--accent)" }}>{project.link}</span>
          <span style={{
            width: 28, height: 28, borderRadius: 999,
            border: "1px solid var(--accent)",
            display: "grid", placeItems: "center",
            color: "var(--accent)",
          }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M5 11l6-6M6 5h5v5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </a>
      ) : (
        <div style={{ marginTop: 18, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 12, color: "var(--text-3)" }}>
            {project.link || "Case study coming soon"}
          </span>
          <span style={{
            width: 28, height: 28, borderRadius: 999,
            border: "1px solid var(--line-strong)",
            display: "grid", placeItems: "center",
            color: "var(--text-2)",
          }}>
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M5 11l6-6M6 5h5v5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      )}
    </Reveal>
  );
}

/* tiny visualizations for bento cards (CSS-only, no fake data slop) */
function VizGrid() {
  return (
    <div style={{
      width: "100%", height: "100%",
      borderRadius: 10, border: "1px solid var(--line)",
      background: `
        repeating-linear-gradient(90deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 28px),
        repeating-linear-gradient(0deg, rgba(255,255,255,0.05) 0 1px, transparent 1px 28px),
        radial-gradient(120px 80px at 70% 30%, var(--accent-soft), transparent 70%)
      `,
      position: "relative", overflow: "hidden",
    }}>
      {/* dotted path */}
      <svg width="100%" height="100%" viewBox="0 0 200 100" preserveAspectRatio="none">
        <path d="M0 80 Q50 70 80 50 T150 30 T200 20" fill="none"
              stroke="var(--accent)" strokeWidth="1.4" strokeDasharray="3 3" opacity=".9"/>
        <circle cx="80" cy="50" r="2.5" fill="var(--accent)"/>
        <circle cx="150" cy="30" r="2.5" fill="var(--accent)"/>
      </svg>
    </div>
  );
}

function VizBars() {
  const bars = [40, 65, 50, 80, 70, 95, 75, 88, 60, 100, 92];
  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", alignItems: "flex-end", gap: 6,
      padding: 8,
      borderRadius: 10, border: "1px solid var(--line)",
      background: "rgba(255,255,255,0.015)",
    }}>
      {bars.map((h, i) => (
        <div key={i} style={{
          flex: 1, height: `${h}%`,
          background: i === bars.length - 1
            ? "linear-gradient(180deg, var(--accent), color-mix(in oklab, var(--accent) 30%, transparent))"
            : "linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04))",
          borderRadius: 3,
          boxShadow: i === bars.length - 1 ? "0 0 12px var(--accent-glow)" : "none",
        }} />
      ))}
    </div>
  );
}

function VizCode() {
  return (
    <div style={{
      width: "100%", height: "100%",
      borderRadius: 10, border: "1px solid var(--line)",
      background: "rgba(0,0,0,0.25)",
      padding: 14,
      fontFamily: "var(--mono)", fontSize: 11.5,
      color: "var(--text-2)",
      overflow: "hidden",
    }}>
      <div style={{ color: "var(--text-3)" }}>// agent.run.ts</div>
      <div><span style={{ color: "var(--accent)" }}>const</span> plan = <span style={{ color: "var(--accent)" }}>await</span> claude.plan(brief)</div>
      <div><span style={{ color: "var(--accent)" }}>const</span> code = <span style={{ color: "var(--accent)" }}>await</span> codex.draft(plan)</div>
      <div><span style={{ color: "var(--accent)" }}>const</span> ui&nbsp;&nbsp; = <span style={{ color: "var(--accent)" }}>await</span> v0.compose(code)</div>
      <div><span style={{ color: "var(--text-3)" }}>// → ship</span></div>
    </div>
  );
}

function VizPhone() {
  return (
    <div style={{
      width: "100%", height: "100%",
      display: "grid", placeItems: "center",
      borderRadius: 10, border: "1px solid var(--line)",
      background: "linear-gradient(180deg, rgba(255,255,255,0.025), transparent)",
      padding: 10,
    }}>
      <div style={{
        width: 92, height: "100%", maxHeight: 150,
        borderRadius: 14,
        border: "1px solid var(--line-strong)",
        background: "var(--bg-2)",
        padding: 8,
        display: "flex", flexDirection: "column", gap: 6,
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.6)",
      }}>
        <div style={{ fontFamily: "var(--mono)", fontSize: 8, color: "var(--text-3)", letterSpacing: ".1em" }}>VITAE · TODAY</div>
        {["Squat", "Bench", "Deadlift"].map((n, i) => (
          <div key={n} style={{
            background: "rgba(255,255,255,0.04)", borderRadius: 5,
            padding: "5px 6px", fontSize: 9,
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ color: "var(--text)" }}>{n}</span>
            <span style={{ color: i === 0 ? "var(--accent)" : "var(--text-3)", fontFamily: "var(--mono)" }}>5×5</span>
          </div>
        ))}
        <div style={{ marginTop: "auto", height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 999, overflow:"hidden" }}>
          <div style={{ width: "62%", height: "100%", background: "var(--accent)" }} />
        </div>
      </div>
    </div>
  );
}

function VizNodes() {
  return (
    <svg viewBox="0 0 200 110" width="100%" height="100%" style={{
      borderRadius: 10, border: "1px solid var(--line)",
      background: "rgba(255,255,255,0.015)",
    }}>
      <g stroke="var(--line-strong)" strokeWidth="1" fill="none">
        <line x1="40" y1="30" x2="100" y2="60"/>
        <line x1="100" y1="60" x2="160" y2="30"/>
        <line x1="40" y1="30" x2="100" y2="90"/>
        <line x1="160" y1="30" x2="100" y2="90"/>
        <line x1="100" y1="60" x2="100" y2="90"/>
      </g>
      <g>
        {[
          [40, 30, "RATES"],
          [100, 60, "RISK"],
          [160, 30, "FLOW"],
          [100, 90, "PnL"],
        ].map(([x, y, label], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={i === 1 ? 8 : 6}
                    fill={i === 1 ? "var(--accent)" : "var(--bg-2)"}
                    stroke="var(--accent)" strokeWidth="1.2"
                    opacity={i === 1 ? 1 : 0.85}/>
            <text x={x} y={y + 22} textAnchor="middle"
                  fontFamily="JetBrains Mono" fontSize="8"
                  fill="var(--text-3)" letterSpacing="0.12em">{label}</text>
          </g>
        ))}
      </g>
    </svg>
  );
}

function Work() {
  const projects = [
    {
      title: "HoZyne",
      copy: "A technology company focused on building practical software systems, AI tools, and digital products.",
      tags: ["Software", "AI", "Systems", "Product"],
      glyph: "H", glyphBg: "var(--accent-soft)", glyphColor: "var(--accent)",
      status: "Operating",
      link: "HoZyne.com",
      href: "https://HoZyne.com",
      viz: <VizGrid />,
      large: true,
    },
    {
      title: "Vitae · Workout Tracker",
      copy: "A modern workout tracking app focused on training logs, progressive overload, analytics, exercise history, and clean client-side workout execution.",
      tags: ["Workout Tracker", "Fitness Tech", "Analytics", "Training Logs"],
      glyph: "V", glyphBg: "rgba(94,234,212,0.10)", glyphColor: "#5EEAD4",
      status: "Live · iOS",
      link: "View on App Store",
      href: "https://apps.apple.com/us/app/vitae-workout-tracker/id6761954056",
      viz: <VizPhone />,
    },
    {
      title: "Quant OS",
      copy: "A long-term learning and research system for institutional finance, quantitative research, derivatives, portfolio theory, optimization, and market structure.",
      tags: ["Finance", "Quant Research", "Learning System", "Python"],
      glyph: "Q", glyphBg: "rgba(177,151,252,0.12)", glyphColor: "#B197FC",
      status: "Ongoing",
      viz: <VizNodes />,
    },
    {
      title: "Research-Grade Prediction Engine",
      copy: "A Python-based modeling and GUI project for data collection, prediction, evaluation, backtesting, and visualization.",
      tags: ["Python", "Modeling", "Data", "Tkinter"],
      glyph: "P", glyphBg: "rgba(251,191,119,0.10)", glyphColor: "#FBBF77",
      status: "R & D",
      viz: <VizBars />,
    },
    {
      title: "AI-Native Builder Workflow",
      copy: "Experiments and systems using AI tools like Claude, Codex, v0, and agentic development workflows to design, generate, test, and ship software faster.",
      tags: ["AI", "Claude", "Codex", "Automation", "Agentic"],
      glyph: "Ai", glyphBg: "rgba(109,217,255,0.10)", glyphColor: "var(--accent)",
      status: "Live system",
      viz: <VizCode />,
    },
  ];

  return (
    <section id="projects">
      <div className="container">
        <Reveal>
          <div className="section-header">
            <div className="section-title-block">
              <div className="section-num">04 — Selected Work</div>
              <h2>Things I've built, ship, and operate.</h2>
            </div>
            <p className="lede" style={{ alignSelf: "flex-end" }}>
              A bento of products, internal systems, and research projects — each
              optimized for leverage, clean execution, and real users.
            </p>
          </div>
        </Reveal>

        <div className="bento" style={{
          display: "grid",
          gridTemplateColumns: "repeat(6, 1fr)",
          gridAutoRows: "minmax(120px, auto)",
          gap: 16,
        }}>
          <ProjectCard project={projects[0]} span={{ col: "span 4", row: "span 2" }} />
          <ProjectCard project={projects[1]} span={{ col: "span 2", row: "span 2" }} />
          <ProjectCard project={projects[2]} span={{ col: "span 3" }} />
          <ProjectCard project={projects[3]} span={{ col: "span 3" }} />
          <ProjectCard project={projects[4]} span={{ col: "span 6" }} />
        </div>
      </div>

      <style>{`
        .project-card:hover{
          border-color: var(--line-strong);
          background: linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.008)) !important;
          transform: translateY(-2px);
        }
        @media (max-width: 1000px){
          .bento{ grid-template-columns: repeat(2, 1fr) !important; }
          .bento > *{ grid-column: span 2 !important; grid-row: auto !important; }
        }
      `}</style>
    </section>
  );
}

/* ───────────────────────────── SKILLS ───────────────────────────── */

function Skills() {
  const groups = [
    {
      title: "Engineering",
      icon: "{ }",
      copy: "Software architecture, full-stack development, API design, automation, data pipelines.",
      stack: ["C#", "Python", "TypeScript", "SQL", "React", "Angular", "Postgres", "Node"],
    },
    {
      title: "Finance & Quant",
      icon: "Σ",
      copy: "Fixed income systems, financial workflows, market structure, risk and analytics, quantitative tooling.",
      stack: ["Fixed Income", "Risk", "Market Structure", "Quant Research"],
    },
    {
      title: "AI & Product",
      icon: "✶",
      copy: "AI-assisted development, agentic workflows, prompt engineering, product strategy, internal tool design, developer productivity systems.",
      stack: ["Claude", "Codex", "OpenAI", "Agents", "Eval pipelines", "Prompt design"],
    },
    {
      title: "Fitness & Personal Systems",
      icon: "▴",
      copy: "Coaching technology, training systems, performance tracking, health data, habit and progress analytics.",
      stack: ["Training Logs", "Progression", "Wearables", "Health Data", "Habits"],
    },
  ];

  return (
    <section id="skills">
      <div className="container">
        <Reveal>
          <div className="section-header">
            <div className="section-title-block">
              <div className="section-num">05 — Skills & Focus Areas</div>
              <h2>Where I work, and what I work in.</h2>
            </div>
          </div>
        </Reveal>

        <div className="skills-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 16,
        }}>
          {groups.map((g, i) => (
            <Reveal key={g.title} delay={i * 70}>
              <div className="card" style={{ padding: 28, height: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--line-strong)",
                    display: "grid", placeItems: "center",
                    fontFamily: "var(--mono)", fontSize: 16, color: "var(--accent)",
                  }}>{g.icon}</div>
                  <h3 style={{ fontSize: 20 }}>{g.title}</h3>
                </div>
                <p style={{ marginTop: 18, color: "var(--text-2)" }}>{g.copy}</p>
                <div className="row" style={{ marginTop: 20, gap: 6 }}>
                  {g.stack.map(s => <Tag key={s}>{s}</Tag>)}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 800px){
          .skills-grid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ───────────────────────────── HOW I THINK ───────────────────────────── */

function HowIThink() {
  const cards = [
    {
      label: "01",
      title: "Build",
      copy: "I like turning ideas into usable systems quickly, then refining them through real feedback.",
      glyph: (
        <svg viewBox="0 0 32 32" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.4">
          <rect x="6" y="6" width="20" height="20" rx="3"/>
          <path d="M6 13h20M13 13v13"/>
        </svg>
      ),
    },
    {
      label: "02",
      title: "Learn",
      copy: "I study finance, AI, software, Spanish, and performance with a systems-first approach.",
      glyph: (
        <svg viewBox="0 0 32 32" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M4 9l12-5 12 5-12 5L4 9z"/>
          <path d="M9 12v6c0 2 3 4 7 4s7-2 7-4v-6"/>
        </svg>
      ),
    },
    {
      label: "03",
      title: "Compound",
      copy: "I care about habits, infrastructure, and tools that create long-term leverage.",
      glyph: (
        <svg viewBox="0 0 32 32" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.4">
          <path d="M4 26C10 26 14 6 22 6c4 0 6 2 6 6"/>
          <path d="M22 12l4-6 6 4" />
        </svg>
      ),
    },
  ];

  return (
    <section id="how">
      <div className="container">
        <Reveal>
          <div className="section-header">
            <div className="section-title-block">
              <div className="section-num">06 — How I Think</div>
              <h2>A personal operating system.</h2>
              <p className="lede">
                I'm drawn to systems that compound. Code, training, finance, language learning, and business all reward
                the same pattern: <span style={{ color: "var(--text)" }}>clear inputs, consistent execution, feedback loops, and iteration.</span>
              </p>
            </div>
          </div>
        </Reveal>

        <div className="how-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 16,
        }}>
          {cards.map((c, i) => (
            <Reveal key={c.title} delay={i * 90} style={{ display: "flex", flexDirection: "column" }}>
              <div className="card" style={{
                flex: 1,
                padding: 30, minHeight: 240,
                display: "flex", flexDirection: "column", gap: 24,
                position: "relative",
                background: i === 1
                  ? "linear-gradient(180deg, var(--accent-soft), rgba(255,255,255,0.005))"
                  : undefined,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div style={{ color: i === 1 ? "var(--accent)" : "var(--text-2)" }}>{c.glyph}</div>
                  <span style={{
                    fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: ".18em",
                    color: "var(--text-3)",
                  }}>/ {c.label}</span>
                </div>
                <div>
                  <h3 style={{ fontSize: 32, letterSpacing: "-0.03em" }}>{c.title}</h3>
                  <p style={{ marginTop: 12, fontSize: 14.5, color: "var(--text-2)" }}>{c.copy}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 880px){
          .how-grid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* ───────────────────────────── NOTES & IDEAS ───────────────────────────── */

function Notes() {
  const notes = [
    { title: "Building AI-native software workflows", tag: "AI · Workflow", time: "Drafting" },
    { title: "Why fitness coaching needs better tools", tag: "Fitness Tech", time: "Outlined" },
    { title: "Quant finance from an engineer's perspective", tag: "Finance", time: "In progress" },
    { title: "Turning learning into a personal operating system", tag: "Systems", time: "Drafting" },
    { title: "The future of agentic development", tag: "AI · Agents", time: "Researching" },
  ];

  return (
    <section id="notes">
      <div className="container">
        <Reveal>
          <div className="section-header">
            <div className="section-title-block">
              <div className="section-num">07 — Notes & Ideas</div>
              <h2>Writing, in progress.</h2>
              <p className="lede">
                Long-form notes on the systems I work in. Not yet a blog — a working notebook
                of ideas in motion. Posts ship when they're sharp.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="card" style={{ overflow: "hidden" }}>
            {notes.map((n, i) => (
              <a key={n.title} href="#notes" className="note-row" style={{
                display: "grid",
                gridTemplateColumns: "80px 1fr 200px 60px",
                gap: 24,
                alignItems: "center",
                padding: "22px 26px",
                borderTop: i === 0 ? "none" : "1px solid var(--line)",
                textDecoration: "none", color: "var(--text)",
                transition: "background .2s ease, padding .2s ease",
              }}>
                <span style={{
                  fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-3)",
                  letterSpacing: ".18em",
                }}>N · {String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: 17.5, fontWeight: 500, letterSpacing: "-0.015em" }}>{n.title}</span>
                <span style={{
                  fontFamily: "var(--mono)", fontSize: 11.5, color: "var(--text-2)",
                  letterSpacing: ".04em",
                }}>{n.tag}</span>
                <span style={{
                  fontFamily: "var(--mono)", fontSize: 11, color: "var(--accent)",
                  letterSpacing: ".06em", textAlign: "right",
                }}>{n.time}</span>
              </a>
            ))}
          </div>
        </Reveal>
      </div>

      <style>{`
        .note-row:hover{ background: rgba(255,255,255,0.03); padding-left: 32px !important; }
        @media (max-width: 760px){
          .note-row{ grid-template-columns: 60px 1fr !important; }
          .note-row > :nth-child(3), .note-row > :nth-child(4){ display:none; }
        }
      `}</style>
    </section>
  );
}

/* ───────────────────────────── CONTACT ───────────────────────────── */

function Contact() {
  const channels = [
    { label: "LinkedIn",    detail: "linkedin.com/in/alex-hosein", href: "https://linkedin.com/in/alex-hosein", primary: true,
      icon: <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M3.6 14h2.5V6.3H3.6V14zM4.85 5.2a1.45 1.45 0 1 0 0-2.9 1.45 1.45 0 0 0 0 2.9zM14 14h-2.5V9.9c0-1-.02-2.3-1.4-2.3-1.4 0-1.6 1.1-1.6 2.2V14H6V6.3h2.4v1.05h.03c.34-.63 1.16-1.3 2.4-1.3 2.56 0 3.04 1.7 3.04 3.9V14z"/></svg> },
    { label: "Email",       detail: "me@alexhosein.com", href: "mailto:me@AlexHosein.com",
      icon: <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3.5" width="12" height="9" rx="1.2"/><path d="M2.5 4.5l5.5 4 5.5-4" strokeLinecap="round"/></svg> },
    { label: "GitHub",      detail: "github.com/alexhosein", href: "https://github.com/Alex-Hosein/",
      icon: <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor"><path d="M8 1.5a6.5 6.5 0 0 0-2.05 12.67c.32.06.44-.14.44-.31v-1.2c-1.81.4-2.19-.77-2.19-.77-.3-.75-.72-.96-.72-.96-.59-.4.04-.4.04-.4.65.05 1 .67 1 .67.58 1 1.52.71 1.89.54.06-.42.23-.71.41-.87-1.45-.16-2.98-.72-2.98-3.22 0-.71.25-1.29.67-1.75-.07-.16-.29-.83.06-1.73 0 0 .54-.18 1.78.67a6.1 6.1 0 0 1 3.24 0c1.24-.85 1.78-.67 1.78-.67.35.9.13 1.57.07 1.73.41.46.66 1.04.66 1.75 0 2.5-1.53 3.06-2.99 3.22.24.2.45.6.45 1.2v1.78c0 .17.12.38.45.31A6.5 6.5 0 0 0 8 1.5z"/></svg> },
    { label: "X · Twitter", detail: "@TheAlexHosein", href: "https://x.com/TheAlexHosein",
      icon: <svg viewBox="0 0 16 16" width="13" height="13" fill="currentColor"><path d="M11.5 2h2.05L9.05 7.18 14.3 14h-4.13L7.06 9.83 3.47 14H1.42l4.83-5.55L1 2h4.24l2.78 3.79L11.5 2zm-.72 10.78h1.14L4.97 3.15H3.74l7.04 9.63z"/></svg> },
  ];

  return (
    <section id="contact">
      <div className="container">
        <div className="contact-wrap card" style={{
          padding: "clamp(40px, 6vw, 80px)",
          background: `
            radial-gradient(600px 300px at 80% 10%, var(--accent-soft), transparent 60%),
            linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.005))
          `,
        }}>
          <Reveal>
            <div className="section-num">08 — Contact</div>
            <h2 style={{
              marginTop: 18,
              fontSize: "clamp(40px, 6vw, 76px)",
              letterSpacing: "-0.03em",
              lineHeight: 1,
            }}>
              Let's <span style={{ color: "var(--accent)" }}>connect.</span>
            </h2>
            <p className="lede" style={{ marginTop: 24, maxWidth: "56ch" }}>
              I'm always open to conversations around software, AI, finance, fitness technology,
              and interesting systems worth building.
            </p>
          </Reveal>

          <Reveal delay={150}>
            <div className="contact-grid" style={{
              marginTop: 48,
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: 12,
            }}>
              {channels.map(c => (
                <a key={c.label} href={c.href} target="_blank" rel="noopener"
                  className="contact-card"
                  style={{
                    padding: 22,
                    borderRadius: 14,
                    border: "1px solid var(--line-strong)",
                    background: c.primary ? "var(--accent)" : "rgba(255,255,255,0.025)",
                    color: c.primary ? "#06121A" : "var(--text)",
                    textDecoration: "none",
                    display: "flex", flexDirection: "column",
                    gap: 28,
                    minHeight: 150,
                    transition: "transform .2s ease, background .2s ease",
                  }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: c.primary ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.05)",
                    border: c.primary ? "1px solid rgba(0,0,0,0.1)" : "1px solid var(--line-strong)",
                    display: "grid", placeItems: "center",
                    color: c.primary ? "#06121A" : "var(--text)",
                  }}>{c.icon}</div>
                  <div>
                    <div style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.015em" }}>{c.label}</div>
                    <div style={{
                      marginTop: 6, fontFamily: "var(--mono)", fontSize: 11.5,
                      color: c.primary ? "rgba(6,18,26,0.7)" : "var(--text-2)",
                      letterSpacing: ".02em",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>{c.detail}</div>
                  </div>
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        {/* footer */}
        <div style={{
          marginTop: 56,
          paddingTop: 28,
          borderTop: "1px solid var(--line)",
          display: "flex", justifyContent: "space-between", alignItems: "center",
          flexWrap: "wrap", gap: 16,
        }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-3)", letterSpacing: ".14em" }}>
            ALEXHOSEIN.COM © 2026
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--text-3)", letterSpacing: ".14em" }}>
            <span style={{ color: "var(--accent)" }}>●</span> AVAILABLE FOR CONVERSATIONS
          </div>
        </div>
      </div>

      <style>{`
        .contact-card:hover{ transform: translateY(-2px); }
        @media (max-width: 880px){
          .contact-grid{ grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 480px){
          .contact-grid{ grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

/* expose */
Object.assign(window, {
  TopNav, Hero, About, Timeline, Work, Skills, HowIThink, Notes, Contact,
});
