// app.jsx — main composition + Tweaks wiring

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#B197FC",
  "background": "#0E0B1A",
  "showGrid": true,
  "fontScale": 1
}/*EDITMODE-END*/;

// Convert hex → rgba for accent-soft/glow variables
function hexToRgba(hex, a = 1) {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map(c => c + c).join("") : h;
  const r = parseInt(v.slice(0, 2), 16);
  const g = parseInt(v.slice(2, 4), 16);
  const b = parseInt(v.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply theme to :root
  React.useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", t.accent);
    root.style.setProperty("--accent-soft", hexToRgba(t.accent, 0.14));
    root.style.setProperty("--accent-glow", hexToRgba(t.accent, 0.35));
    root.style.setProperty("--bg", t.background);
    document.body.style.fontSize = `${16 * t.fontScale}px`;
  }, [t.accent, t.background, t.fontScale]);

  // Toggle background grid
  React.useEffect(() => {
    const id = "__bg_grid_toggle";
    let style = document.getElementById(id);
    if (!style) {
      style = document.createElement("style");
      style.id = id;
      document.head.appendChild(style);
    }
    style.textContent = t.showGrid ? "" : "body::after{display:none;}";
  }, [t.showGrid]);

  return (
    <React.Fragment>
      <TopNav />
      <main>
        <Hero />
        <About />
        <Timeline />
        <Work />
        <Skills />
        <HowIThink />
        <Notes />
        <Contact />
      </main>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Theme" />
        <TweakColor
          label="Accent"
          value={t.accent}
          options={["#6DD9FF", "#B197FC", "#5EEAD4", "#FBBF77", "#FF7AB6"]}
          onChange={(v) => setTweak("accent", v)}
        />
        <TweakColor
          label="Background"
          value={t.background}
          options={["#07090E", "#0A0E16", "#0E0B1A", "#0B1410", "#101012"]}
          onChange={(v) => setTweak("background", v)}
        />
        <TweakToggle
          label="Ambient grid"
          value={t.showGrid}
          onChange={(v) => setTweak("showGrid", v)}
        />

        <TweakSection label="Typography" />
        <TweakSlider
          label="Font scale"
          value={t.fontScale}
          min={0.9} max={1.15} step={0.01}
          unit="×"
          onChange={(v) => setTweak("fontScale", v)}
        />
      </TweaksPanel>
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
