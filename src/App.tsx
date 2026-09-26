import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  MotionConfig,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import {
  ArrowUpRight,
  ArrowDown,
  ArrowRight,
  GitBranch as Github,
  Camera as Instagram,
  Command,
  Menu,
  X,
  Sun,
  Moon,
  Copy,
  Check,
  Terminal,
  Cpu,
  Code2,
  Sparkles,
  Pause,
  Play,
  MapPin,
  Mic2,
  Dog,
  UserRound,
  Volume2,
  VolumeX,
  LocateFixed,
} from "lucide-react";
import { projects, skills } from "./portfolio";
import {
  fetchGitHubActivity,
  formatUpdatedDate,
  type GitHubActivity,
} from "./liveActivity";
import PortfolioAssistant from "./PortfolioAssistant";
import { ProjectVisual } from "./ProjectVisual";
import ParticleSculpture from "./ParticleSculpture";
import "./App.css";

export { ProjectVisual } from "./ProjectVisual";
const email = "kansagara.dwij@gmail.com";
const nav = [
  ["projects", "Categories"],
  ["skills", "Courses"],
  ["playground", "Goodies"],
  ["about", "About"],
] as const;

function Reveal({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.01, margin: "120px 0px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

function DwijAvatar() {
  return (
    <svg
      className="dwij-avatar"
      viewBox="0 0 420 330"
      role="img"
      aria-label="Illustrated avatar of Dwij Kansagara"
    >
      <defs>
        <linearGradient id="avatar-bg" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#242a20" />
          <stop offset="1" stopColor="#11130f" />
        </linearGradient>
      </defs>
      <rect width="420" height="330" rx="28" fill="url(#avatar-bg)" />
      <circle cx="350" cy="58" r="74" fill="var(--accent)" opacity=".12" />
      <path d="M-20 300c91-80 173-83 260-23 64 44 130 39 202-9v83H-20Z" fill="var(--accent)" opacity=".14" />
      <g className="avatar-body">
        <path d="M102 330c8-80 50-116 108-116s101 36 109 116Z" fill="#d3f36b" />
        <path d="M170 211h80v54c-20 22-59 22-80 0Z" fill="#a96849" />
      </g>
      <g className="avatar-head">
        <path d="M131 103c2-61 37-86 82-86 51 0 85 30 84 91l-9 87c-6 48-37 74-78 74-42 0-72-28-77-76Z" fill="#b97855" />
        <path d="M126 123c-8-44 1-91 42-109 40-18 96-8 121 31 15 23 10 62 2 81l-16-54c-32 9-71 0-91-15-4 27-23 51-58 66Z" fill="#171914" />
        <path d="M141 79c18-51 93-70 137-24-39-18-96-5-137 24Z" fill="#2b2e27" />
        <path d="M148 130h53c7 0 12 5 12 12v24c0 7-5 12-12 12h-42c-9 0-16-6-17-15l-3-22c-1-6 3-11 9-11Zm124 0h-53c-7 0-12 5-12 12v24c0 7 5 12 12 12h42c9 0 16-6 17-15l3-22c1-6-3-11-9-11Z" fill="#eef0e8" fillOpacity=".16" stroke="#10120f" strokeWidth="8" />
        <path d="M210 145h8" stroke="#10120f" strokeWidth="7" strokeLinecap="round" />
        <g className="avatar-eyes" fill="#10120f">
          <ellipse cx="177" cy="151" rx="7" ry="9" />
          <ellipse cx="244" cy="151" rx="7" ry="9" />
        </g>
        <path d="M211 154c-4 13-6 25-2 31 3 4 8 5 14 2" fill="none" stroke="#8d533d" strokeWidth="5" strokeLinecap="round" />
        <path d="M189 208c14 9 31 9 45 0" fill="none" stroke="#713b36" strokeWidth="6" strokeLinecap="round" />
      </g>
      <g className="avatar-spark" fill="none" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round">
        <path d="M335 109v28m-14-14h28m-24-10 20 20m0-20-20 20" />
      </g>
      <text x="25" y="42" fill="#eef0e8" fontSize="12" fontFamily="monospace" letterSpacing="3">DWIJ / DRAWN IN CODE</text>
    </svg>
  );
}

function DwijMascot() {
  return (
    <svg
      className="dwij-mascot"
      viewBox="0 0 220 190"
      role="img"
      aria-label="Pixel, Dwij's curious robot dog mascot"
    >
      <g className="mascot-tail">
        <path
          d="M171 122c31-13 39-33 25-47"
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
        />
        <circle cx="197" cy="74" r="8" fill="var(--accent)" />
      </g>
      <g className="mascot-body">
        <rect
          x="63"
          y="87"
          width="109"
          height="72"
          rx="32"
          fill="var(--surface-solid)"
          stroke="currentColor"
          strokeWidth="5"
        />
        <rect
          x="70"
          y="151"
          width="28"
          height="30"
          rx="12"
          fill="var(--surface-solid)"
          stroke="currentColor"
          strokeWidth="5"
        />
        <rect
          x="137"
          y="151"
          width="28"
          height="30"
          rx="12"
          fill="var(--surface-solid)"
          stroke="currentColor"
          strokeWidth="5"
        />
        <path d="M105 112h29l-4 27h-21z" fill="var(--accent)" />
        <circle cx="119" cy="123" r="5" fill="var(--accent-dark)" />
      </g>
      <g className="mascot-head">
        <path
          d="M61 39 43 13c-5-7-15-3-14 6l5 52"
          fill="var(--accent)"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path
          d="m152 38 16-25c5-8 16-4 15 5l-4 55"
          fill="var(--surface-solid)"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <rect
          x="39"
          y="33"
          width="139"
          height="91"
          rx="43"
          fill="var(--surface-solid)"
          stroke="currentColor"
          strokeWidth="5"
        />
        <circle className="mascot-eye" cx="81" cy="72" r="15" fill="#fff" />
        <circle className="mascot-eye" cx="138" cy="72" r="15" fill="#fff" />
        <circle className="mascot-pupil" cx="85" cy="75" r="6" fill="#10120f" />
        <circle
          className="mascot-pupil"
          cx="142"
          cy="75"
          r="6"
          fill="#10120f"
        />
        <path d="M101 93h18l-9 9z" fill="var(--accent)" />
        <path
          d="M110 102c-2 11-13 13-21 7m21-7c2 11 13 13 21 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          className="mascot-antenna"
          d="M108 34V15"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle
          className="mascot-antenna"
          cx="108"
          cy="10"
          r="8"
          fill="var(--accent)"
        />
      </g>
      <g className="mascot-paw">
        <path
          d="M51 112c-25 1-32-22-18-37"
          fill="none"
          stroke="currentColor"
          strokeWidth="13"
          strokeLinecap="round"
        />
        <circle
          cx="31"
          cy="74"
          r="9"
          fill="var(--accent)"
          stroke="currentColor"
          strokeWidth="4"
        />
      </g>
    </svg>
  );
}

function App() {
  const [light, setLight] = useState(() => {
    try {
      return localStorage.getItem("theme") === "light";
    } catch {
      return false;
    }
  });
  const [menu, setMenu] = useState(false);
  const [openNav, setOpenNav] = useState<string | null>(null);
  const [active, setActive] = useState("home");
  const [paused, setPaused] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [distanceStatus, setDistanceStatus] = useState("How far are you from me?");
  const [filter, setFilter] = useState("All work");
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [command, setCommand] = useState("");
  const [formStatus, setFormStatus] = useState("");
  const [activity, setActivity] = useState<GitHubActivity | null>(null);
  const [githubStatus, setGithubStatus] = useState("Connecting to GitHub…");
  const [history, setHistory] = useState([
    {
      command: "hello",
      response:
        "Welcome to my little corner of the internet. Type help to explore.",
    },
  ]);
  const [time, setTime] = useState("");
  const palette = useRef<HTMLDialogElement>(null);
  const terminalBody = useRef<HTMLDivElement>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const soundEnabledRef = useRef(true);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  useEffect(() => {
    document.documentElement.dataset.theme = light ? "light" : "dark";
    try {
      localStorage.setItem("theme", light ? "light" : "dark");
    } catch {
      /* Theme works without storage. */
    }
  }, [light]);
  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);
  useEffect(() => {
    const tick = () =>
      setTime(
        new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
      );
    tick();
    const timer = setInterval(tick, 60000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (palette.current?.open) palette.current.close();
        else palette.current?.showModal();
      }
      if (event.key === "Escape") {
        setMenu(false);
        setOpenNav(null);
      }
      const target = event.target as HTMLElement;
      const soundIndex = ["d", "w", "i", "j"].indexOf(
        event.key.toLowerCase(),
      );
      if (
        soundIndex >= 0 &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName)
      ) {
        playKeySound(soundIndex);
      }
    };
    document.addEventListener("keydown", onKey);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -55% 0px" },
    );
    document
      .querySelectorAll("main section[id]")
      .forEach((section) => observer.observe(section));
    return () => {
      document.removeEventListener("keydown", onKey);
      observer.disconnect();
      clearTimeout(copyTimer.current);
      void audioContext.current?.close();
    };
  }, []);
  useEffect(() => {
    const controller = new AbortController();
    const refresh = () =>
      fetchGitHubActivity(controller.signal)
        .then((result) => {
          setActivity(result);
          setGithubStatus("Live from GitHub");
        })
        .catch(() => {
          if (!controller.signal.aborted)
            setGithubStatus(
              "Live activity unavailable. Explore the repositories on GitHub.",
            );
        });
    void refresh();
    const timer = setInterval(() => void refresh(), 600000);
    return () => {
      controller.abort();
      clearInterval(timer);
    };
  }, []);
  useEffect(() => {
    terminalBody.current?.scrollTo({ top: terminalBody.current.scrollHeight });
  }, [history]);

  function go(id: string) {
    document
      .getElementById(id)
      ?.scrollIntoView({ behavior: reduced ? "instant" : "smooth" });
    setMenu(false);
    setOpenNav(null);
    palette.current?.close();
  }
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setCopyError(false);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyError(true);
    }
  }
  function runCommand(value: string) {
    const cmd = value.trim().toLowerCase();
    if (!cmd) return;
    setCommand("");
    if (cmd === "clear") {
      setHistory([]);
      return;
    }
    const responses: Record<string, string> = {
      help: "Available commands: about · projects · skills · contact · theme · clear",
      about:
        "Dwij Kansagara — student, developer, and curious builder from India. Exploring AI, creative code, and robotics.",
      projects: projects
        .map((p) => p.title + " — " + p.description)
        .join("\n\n"),
      skills: skills.join(" / "),
      contact: email + "\ngithub.com/DwijKansagara",
      theme: "Switching perspective. A fresh coat of pixels.",
      hello: "Hey! Happy you’re here. Try projects to see what I’m building.",
      whoami: "A curious visitor. You’re in good company.",
    };
    if (cmd === "theme") setLight((value) => !value);
    setHistory((old) => [
      ...old.slice(-19),
      {
        command: value.trim(),
        response:
          responses[cmd] ||
          `Command not found: ${value.trim()}. Type help for available commands.`,
      },
    ]);
  }
  function playKeySound(index: number) {
    if (!soundEnabledRef.current) return;
    const AudioContextClass = window.AudioContext;
    const context = audioContext.current ?? new AudioContextClass();
    audioContext.current = context;
    if (context.state === "suspended") void context.resume();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const frequencies = [293.66, 349.23, 440, 587.33];
    oscillator.type = "triangle";
    oscillator.frequency.setValueAtTime(
      frequencies[index],
      context.currentTime,
    );
    oscillator.frequency.exponentialRampToValueAtTime(
      frequencies[index] * 0.92,
      context.currentTime + 0.12,
    );
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.13, context.currentTime + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.18);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.2);
  }
  function calculateDistance() {
    if (!("geolocation" in navigator)) {
      setDistanceStatus("Location isn’t available in this browser.");
      return;
    }
    setDistanceStatus("Finding your distance…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
        const rajkot = { latitude: 22.3, longitude: 70.783333 };
        const latitudeDelta = toRadians(rajkot.latitude - coords.latitude);
        const longitudeDelta = toRadians(rajkot.longitude - coords.longitude);
        const startLatitude = toRadians(coords.latitude);
        const endLatitude = toRadians(rajkot.latitude);
        const haversine =
          Math.sin(latitudeDelta / 2) ** 2 +
          Math.cos(startLatitude) *
            Math.cos(endLatitude) *
            Math.sin(longitudeDelta / 2) ** 2;
        const distance = 6371 * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
        setDistanceStatus(`About ${Math.round(distance).toLocaleString()} km from you`);
      },
      () => setDistanceStatus("Share your location to measure the distance."),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 300000 },
    );
  }
  const visibleProjects = projects.filter(
    (project) =>
      filter === "All work" ||
      (filter === "AI & interaction"
        ? project.visual !== "avengers"
        : project.visual === "avengers"),
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className={`app ${paused ? "motion-paused" : ""}`}>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <motion.div
          className="reading-progress"
          style={{ scaleX: reduced ? scrollYProgress : scaleX }}
        />
        <header className="navbar wrap">
          <a className="brand" href="#home" aria-label="Dwij Kansagara home">
            dwij<span>✳</span>
          </a>
          <nav
            id="navigation"
            className={menu ? "navigation is-open" : "navigation"}
            aria-label="Main navigation"
          >
            {nav.map(([id, label]) => (
              <button
                key={id}
                type="button"
                className={
                  openNav === id
                    ? "nav-menu-button is-active"
                    : "nav-menu-button"
                }
                onClick={() => {
                  setOpenNav(openNav === id ? null : id);
                  if (window.innerWidth <= 800) go(id);
                }}
                aria-current={active === id ? "location" : undefined}
              >
                {label}
              </button>
            ))}
          </nav>
          {openNav && (
            <motion.div
              className="nav-mega"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              role="dialog"
              aria-label={`${nav.find(([id]) => id === openNav)?.[1] ?? "Menu"} menu`}
            >
              {openNav === "projects" && (
                <>
                  <span className="mono">BROWSE THE WORK</span>
                  <button onClick={() => go("projects")}>
                    <b>AI & interaction</b>
                    <small>
                      Voice, gesture, and intelligent systems{" "}
                      <ArrowUpRight size={14} />
                    </small>
                  </button>
                  <button onClick={() => go("projects")}>
                    <b>Creative web</b>
                    <small>
                      Cinematic interfaces and experiments{" "}
                      <ArrowUpRight size={14} />
                    </small>
                  </button>
                </>
              )}
              {openNav === "skills" && (
                <>
                  <span className="mono">LEARNING IN PUBLIC</span>
                  <button onClick={() => go("skills")}>
                    <b>Frontend & interaction</b>
                    <small>
                      React, TypeScript, UI / UX <ArrowUpRight size={14} />
                    </small>
                  </button>
                  <button onClick={() => go("skills")}>
                    <b>AI & experimentation</b>
                    <small>
                      Python, TensorFlow, curious prototypes{" "}
                      <ArrowUpRight size={14} />
                    </small>
                  </button>
                </>
              )}
              {openNav === "playground" && (
                <>
                  <span className="mono">SMALL DELIGHTS</span>
                  <button onClick={() => go("playground")}>
                    <b>Interactive terminal</b>
                    <small>
                      Ask the portfolio a question <Terminal size={14} />
                    </small>
                  </button>
                  <button
                    onClick={() => {
                      setPaused(!paused);
                      setOpenNav(null);
                    }}
                  >
                    <b>{paused ? "Play" : "Pause"} ambient motion</b>
                    <small>
                      Motion respects your preference <Pause size={14} />
                    </small>
                  </button>
                </>
              )}
              {openNav === "about" && (
                <>
                  <span className="mono">A LITTLE CONTEXT</span>
                  <button onClick={() => go("about")}>
                    <b>Dwij Kansagara</b>
                    <small>
                      Rajkot, Gujarat · He/Him <ArrowUpRight size={14} />
                    </small>
                  </button>
                  <button onClick={() => go("contact")}>
                    <b>Start a conversation</b>
                    <small>
                      Have an idea? Let’s make it tangible{" "}
                      <ArrowUpRight size={14} />
                    </small>
                  </button>
                </>
              )}
            </motion.div>
          )}
          <div className="nav-actions">
            <button
              className="command-trigger"
              onClick={() => palette.current?.showModal()}
              aria-label="Open command menu"
            >
              <Command size={15} />
              <span>K</span>
            </button>
            <button
              className="icon-button"
              onClick={() => setLight(!light)}
              aria-label={
                light ? "Switch to dark theme" : "Switch to light theme"
              }
            >
              {light ? <Moon size={17} /> : <Sun size={17} />}
            </button>
            <a className="nav-contact" href="#contact">
              Let’s talk <ArrowUpRight size={15} />
            </a>
            <button
              className="icon-button menu-toggle"
              onClick={() => setMenu(!menu)}
              aria-label={menu ? "Close menu" : "Open menu"}
              aria-expanded={menu}
              aria-controls="navigation"
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </header>
        <main id="main">
          <section id="home" className="hero wrap">
            <div className="hero-topline mono">
              <span>
                <i className="status-dot" /> CURIOUS MIND. ALWAYS BUILDING.
              </span>
              <span>
                INDIA <span className="muted">/</span> {time || "IST"} IST
              </span>
            </div>
            <div className="hero-layout">
              <div className="hero-copy">
                <p className="eyebrow">
                  DWIJ KANSAGARA — DEVELOPER & AI ENTHUSIAST
                </p>
                <motion.h1
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  Curiosity,
                  <br />
                  made
                  <br />
                  <em>tangible.</em>
                  <span className="headline-dot">*</span>
                </motion.h1>
                <p className="hero-description">
                  I turn “what if” into something you can interact with.
                  <br className="desktop-break" /> Exploring the space between
                  code, AI, and imagination.
                </p>
                <div className="hero-buttons">
                  <a className="button primary" href="#projects">
                    Explore my work <ArrowDown size={17} />
                  </a>
                  <a className="text-link" href="#about">
                    A little about me <ArrowUpRight size={17} />
                  </a>
                </div>
              </div>
              <div className="sculpture">
                <span className="sculpture-corner mono">
                  FIG. 001 / AN IDEA TAKING SHAPE
                </span>
                <ParticleSculpture paused={paused} light={light} />
                <div className="sculpture-caption">
                  <span className="mono">CODE, WITH A LITTLE CURIOSITY.</span>
                  <button
                    className="icon-button"
                    onClick={() => setPaused(!paused)}
                    aria-label={
                      paused
                        ? "Play ambient animation"
                        : "Pause ambient animation"
                    }
                  >
                    {paused ? <Play size={14} /> : <Pause size={14} />}
                  </button>
                </div>
              </div>
            </div>
            <div className="hero-footer mono">
              <span>STUDENT BY DAY. BUILDER BY NATURE.</span>
              <a href="#projects">
                SCROLL TO DISCOVER <ArrowDown size={15} />
              </a>
              <span>SELECTED EXPLORATIONS / 2026</span>
            </div>
          </section>
          <div className="profile-world">
            <section
              id="profile-grid"
              className="profile-bento wrap"
              aria-labelledby="profile-title"
            >
              <div className="bento-intro">
                <span className="mono">A FEW COORDINATES</span>
                <h2 id="profile-title">
                  Hi there! I’m Dwij.
                  <br />
                  <span className="serif">Here’s the human bit.</span>
                </h2>
                <p>
                  A student and developer from Rajkot, building playful
                  experiments across AI, interfaces, sound, and robotics.
                </p>
              </div>
            <div className="bento-card bento-location">
              <MapPin size={17} />
              <span className="mono">CURRENTLY IN</span>
              <strong>Rajkot, Gujarat</strong>
              <small>India · GMT+5:30</small>
              <button
                type="button"
                className="distance-button"
                onClick={calculateDistance}
              >
                <LocateFixed size={15} />
                {distanceStatus}
              </button>
            </div>
            <div className="bento-card bento-rainbow">
              <span className="bento-emoji">✳</span>
              <strong>He / Him</strong>
              <small>Straight · curious by default.</small>
            </div>
            <div className="bento-card bento-pronounce">
              <span className="mono">HELLO, I’M</span>
              <strong>Dwij Kansagara</strong>
              <small>
                <Mic2 size={13} /> Say “Dwij” like “Dweej”
              </small>
            </div>
            <div className="bento-card bento-height">
              <UserRound size={18} />
              <strong>6 ft 0.5 in</strong>
              <small>Still growing in code.</small>
            </div>
            <div className="bento-card bento-photo">
              <DwijAvatar />
              <span className="bento-photo-label mono">
                A HUMAN, DRAWN IN CODE
              </span>
            </div>
            <div className="bento-card bento-fact">
              <div className="key-row" aria-label="Playable D W I J sound keys">
                {["D", "W", "I", "J"].map((key, index) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => playKeySound(index)}
                    aria-label={`Play ${key} note`}
                  >
                    {key}
                  </button>
                ))}
              </div>
              <strong>Build. Break. Learn. Repeat.</strong>
              <small>Tap or press D–W–I–J. Your name has a voice.</small>
              <button
                type="button"
                className="sound-toggle"
                onClick={() => setSoundEnabled((enabled) => !enabled)}
                aria-pressed={!soundEnabled}
              >
                {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
                Sound {soundEnabled ? "on" : "off"}
              </button>
            </div>
            <div className="bento-card bento-tech">
              <span className="mono">FAVORITE TOOLS</span>
              <div className="tech-chips">
                <span>React</span>
                <span>Python</span>
                <span>TypeScript</span>
                <span>TensorFlow</span>
                <span>GitHub</span>
              </div>
            </div>
            <div className="bento-card bento-hobbies">
              <span className="mono">OFF THE SCREEN</span>
              <strong>
                Building tiny experiments, exploring AI, music, and robotics.
              </strong>
              <small>There is always another rabbit hole.</small>
            </div>
            <div className="bento-card bento-dog">
              <Dog size={21} />
              <span className="mono">FUN FACT</span>
              <strong>Dog person. No dog. Street dogs still scary.</strong>
              <small>It’s complicated.</small>
            </div>
            <div className="bento-card bento-mascot">
              <DwijMascot />
              <span className="mono">MEET PIXEL</span>
              <strong>A tiny curious companion.</strong>
              <small>Hover or tap for a wave.</small>
            </div>
            </section>
            <div className="discipline-strip" aria-label="Areas of interest">
              <div className="wrap">
                <span>CREATIVE DEVELOPMENT</span>
                <span className="asterisk">✳</span>
                <span>ARTIFICIAL INTELLIGENCE</span>
                <span className="asterisk">✳</span>
                <span>HUMAN INTERACTION</span>
                <span className="asterisk">✳</span>
                <span>ENDLESS CURIOSITY</span>
              </div>
            </div>
          </div>
          <section id="projects" className="section wrap">
            <Reveal>
              <div className="section-label mono">
                <span>01 / SELECTED WORK</span>
                <span>IDEAS → EXPERIMENTS → EXPERIENCES</span>
              </div>
              <div className="section-heading">
                <h2>
                  A few things
                  <br />
                  I’ve <span className="serif">brought to life.</span>
                </h2>
                <p>
                  Different questions. Different mediums.
                  <br />
                  The same drive to make something interesting.
                </p>
              </div>
            </Reveal>
            <div className="project-toolbar">
              <div
                className="filters"
                role="group"
                aria-label="Filter projects"
              >
                {["All work", "AI & interaction", "Creative web"].map(
                  (item) => (
                    <button
                      key={item}
                      aria-pressed={filter === item}
                      onClick={() => setFilter(item)}
                    >
                      {item}
                      {item === "All work" && <span>03</span>}
                    </button>
                  ),
                )}
              </div>
              <span className="mono result-count" aria-live="polite">
                {String(visibleProjects.length).padStart(2, "0")} PROJECTS
              </span>
            </div>
            <div className="projects-grid">
              {visibleProjects.map((project) => (
                <motion.article
                  layout={!reduced}
                  key={project.title}
                  className={`project-card project-${project.visual}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <a
                    className="project-art-link"
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Explore ${project.title} on GitHub`}
                  >
                    <div className="project-art-top mono">
                      <span>EXPERIMENT / {project.number}</span>
                      <span>
                        {project.visual === "lumina"
                          ? "SOUND × GESTURE"
                          : project.visual === "jarvis"
                            ? "VOICE × INTELLIGENCE"
                            : "STORY × INTERACTION"}
                      </span>
                    </div>
                    <ProjectVisual type={project.visual} />
                    <span className="project-view">
                      Explore project <ArrowUpRight size={18} />
                    </span>
                  </a>
                  <div className="project-details">
                    <div className="project-title-row">
                      <h3>
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {project.title}
                        </a>
                      </h3>
                      <ArrowUpRight size={23} />
                    </div>
                    <p>{project.description}</p>
                    <div className="tags">
                      {project.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
            <a
              className="work-footnote"
              href="https://github.com/DwijKansagara"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github size={17} /> More experiments, open source, and works in
              progress{" "}
              <span>
                On GitHub <ArrowUpRight size={16} />
              </span>
            </a>
          </section>
          <section id="about" className="about-section">
            <div className="wrap about-grid">
              <Reveal>
                <span className="mono section-label">
                  02 / THE PERSON BEHIND THE PIXELS
                </span>
                <h2>
                  Less “what if.”
                  <br />
                  More <span className="serif">“let’s try.”</span>
                </h2>
                <div className="about-signature">
                  dwij<span>↗</span>
                </div>
              </Reveal>
              <Reveal className="about-copy">
                <p className="large-copy">
                  Hi, I’m Dwij. A student, developer, and a firm believer that
                  the best way to understand something is to build it.
                </p>
                <p>
                  I’m drawn to technology that makes you feel something: an
                  interface that responds to a gesture, an assistant that
                  understands your voice, a small idea that becomes a whole new
                  experience.
                </p>
                <p>
                  I learn by experimenting, breaking things, and making them
                  better. Right now, that means exploring AI, interactive web
                  experiences, and the possibilities of robotics.
                </p>
                <div className="about-values mono">
                  <span>
                    <Sparkles size={17} /> CURIOSITY FIRST
                  </span>
                  <span>
                    <Code2 size={17} /> LEARN BY DOING
                  </span>
                </div>
              </Reveal>
            </div>
          </section>
          <section id="skills" className="section wrap">
            <Reveal>
              <div className="section-label mono">
                <span>03 / THE TOOLBOX</span>
                <span>ALWAYS A WORK IN PROGRESS</span>
              </div>
              <div className="section-heading">
                <h2>
                  Tools change.
                  <br />
                  <span className="serif">The mindset stays.</span>
                </h2>
                <p>
                  The languages and tools I reach for
                  <br />
                  to take an idea from sketch to screen.
                </p>
              </div>
            </Reveal>
            <div className="stack-grid">
              {[
                {
                  icon: Code2,
                  title: "Build the experience",
                  sub: "FRONTEND & INTERACTION",
                  items: ["JavaScript", "TypeScript", "React", "UI / UX"],
                },
                {
                  icon: Cpu,
                  title: "Explore intelligence",
                  sub: "AI & EXPERIMENTATION",
                  items: ["Python", "AI / Machine Learning", "TensorFlow"],
                },
                {
                  icon: Github,
                  title: "Connect the pieces",
                  sub: "TOOLS & PHYSICAL COMPUTING",
                  items: ["GitHub", "Robotics"],
                },
              ].map(({ icon: Icon, title, sub, items }) => (
                <Reveal className="stack-card" key={title}>
                  <div className="stack-icon">
                    <Icon size={25} />
                  </div>
                  <span className="mono">{sub}</span>
                  <h3>{title}</h3>
                  <div className="stack-items">
                    {items.map((item) => (
                      <span key={item}>
                        <i />
                        {item}
                      </span>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          </section>
          <section id="playground" className="playground wrap">
            <Reveal className="playground-copy">
              <span className="section-label mono">
                04 / A LITTLE INTERACTION
              </span>
              <h2>
                Go ahead.
                <br />
                <span className="serif">Poke around.</span>
              </h2>
              <p>
                For the curious ones who’d rather explore
                <br />
                with a keyboard. Make yourself at home.
              </p>
              <div className="terminal-shortcuts">
                {["about", "projects", "skills", "help"].map((cmd) => (
                  <button key={cmd} onClick={() => runCommand(cmd)}>
                    {cmd}
                    <ArrowUpRight size={13} />
                  </button>
                ))}
              </div>
              <span className="mono terminal-note">
                NO INSTALLATION. JUST A LITTLE DISCOVERY.
              </span>
            </Reveal>
            <Reveal className="terminal-window">
              <div className="terminal-bar">
                <div className="window-dots" aria-hidden="true">
                  <i />
                  <i />
                  <i />
                </div>
                <span className="mono">dwij@portfolio: ~</span>
                <Terminal size={15} />
              </div>
              <div
                className="terminal-body"
                ref={terminalBody}
                role="log"
                aria-live="polite"
                aria-label="Terminal output"
              >
                {history.map((entry, index) => (
                  <div key={index} className="terminal-entry">
                    <p>
                      <span>visitor@dwij</span> <b>~ $</b> {entry.command}
                    </p>
                    <p className="terminal-response">{entry.response}</p>
                  </div>
                ))}
              </div>
              <form
                className="terminal-form"
                onSubmit={(event) => {
                  event.preventDefault();
                  runCommand(command);
                }}
              >
                <label htmlFor="terminal-input">~ $</label>
                <input
                  id="terminal-input"
                  aria-label="Terminal command"
                  autoComplete="off"
                  spellCheck={false}
                  value={command}
                  onChange={(event) => setCommand(event.target.value)}
                  placeholder="Type a command…"
                />
                <button type="submit" aria-label="Run command">
                  <ArrowRight size={18} />
                </button>
              </form>
            </Reveal>
          </section>
          <section id="journey" className="section wrap">
            <div className="journey-layout">
              <Reveal>
                <span className="section-label mono">05 / NEVER FINISHED</span>
                <h2>
                  One question.
                  <br />
                  One experiment.
                  <br />
                  <span className="serif">One step further.</span>
                </h2>
                <p className="journey-intro">
                  No overnight origin story. Just a growing collection of things
                  I’ve tried, things I’ve learned, and things I want to figure
                  out.
                </p>
              </Reveal>
              <div className="timeline">
                {[
                  {
                    label: "THE FOUNDATION",
                    title: "Learning to speak in code.",
                    text: "Programming fundamentals, small experiments, and the satisfaction of making something work.",
                  },
                  {
                    label: "THE EXPLORATION",
                    title: "Making things respond.",
                    text: "Bringing interfaces, music, and voice together through projects like LUMINA AI and J.A.R.V.I.S.",
                  },
                  {
                    label: "RIGHT NOW",
                    title: "Following the next question.",
                    text: "Deepening my understanding of AI and machine learning, polishing web experiences, and exploring robotics.",
                  },
                ].map((step, i) => (
                  <Reveal
                    className={`timeline-step ${i === 2 ? "current" : ""}`}
                    key={step.label}
                  >
                    <span className="timeline-node" />
                    <span className="mono">{step.label}</span>
                    <h3>{step.title}</h3>
                    <p>{step.text}</p>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
          <section id="github" className="github-section wrap">
            <div className="github-heading">
              <div>
                <span className="section-label mono">BUILDING IN PUBLIC</span>
                <h3>The latest from the workbench.</h3>
              </div>
              <a
                className="text-link"
                href="https://github.com/DwijKansagara"
                target="_blank"
                rel="noopener noreferrer"
              >
                @DwijKansagara <ArrowUpRight size={18} />
              </a>
            </div>
            <div className="github-status mono">
              {activity && <i className="status-dot" />}
              {githubStatus}
              {activity && (
                <span>
                  {" "}
                  / {activity.profile.public_repos} PUBLIC REPOSITORIES
                </span>
              )}
            </div>
            {activity && (
              <div className="repo-grid">
                {activity.repositories.slice(0, 3).map((repo) => (
                  <a
                    className="repo-card"
                    key={repo.id}
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <div>
                      <Github size={19} />
                      <ArrowUpRight size={17} />
                    </div>
                    <h4>{repo.name}</h4>
                    <p>
                      {repo.description ||
                        "An ongoing exploration in code. Dive into the repository."}
                    </p>
                    <span className="mono">
                      {repo.language || "SOURCE"}{" "}
                      <span>UPDATED {formatUpdatedDate(repo.updated_at)}</span>
                    </span>
                  </a>
                ))}
              </div>
            )}
          </section>
          <section id="contact" className="contact-section wrap">
            <Reveal>
              <div className="section-label mono">
                <span>06 / YOUR IDEA COULD BE NEXT</span>
                <span>LET’S MAKE SOMETHING INTERESTING</span>
              </div>
              <div className="contact-heading">
                <h2>
                  Good things start
                  <br />
                  with <span className="serif">a conversation.</span>
                </h2>
                <a
                  className="contact-arrow"
                  href={`mailto:${email}`}
                  aria-label="Email Dwij"
                >
                  <ArrowUpRight />
                </a>
              </div>
              <div className="contact-bottom">
                <div>
                  <p>
                    A project, a question, or just a hello.
                    <br />
                    I’d love to hear what’s on your mind.
                  </p>
                  <div className="email-row">
                    <a href={`mailto:${email}`}>{email}</a>
                    <button
                      className="icon-button"
                      onClick={() => void copyEmail()}
                      aria-label={
                        copied ? "Email copied" : "Copy email address"
                      }
                    >
                      {copied ? <Check size={17} /> : <Copy size={17} />}
                    </button>
                  </div>
                  <span className="copy-status" role="status">
                    {copied
                      ? "Email copied to clipboard."
                      : copyError
                        ? "Please select and copy the email address above."
                        : ""}
                  </span>
                </div>
                <div className="social-links">
                  <a
                    href="https://github.com/DwijKansagara"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github size={18} /> GitHub <ArrowUpRight size={16} />
                  </a>
                  <a
                    href="https://www.instagram.com/dwij.kansagara/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Instagram size={18} /> Instagram <ArrowUpRight size={16} />
                  </a>
                </div>
              </div>
              <details className="contact-compose">
                <summary>
                  Prefer to write your message here? <ArrowDown size={16} />
                </summary>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const data = new FormData(event.currentTarget);
                    window.location.href = `mailto:${email}?subject=${encodeURIComponent(`Portfolio message from ${data.get("name")}`)}&body=${encodeURIComponent(`From: ${data.get("name")} <${data.get("email")}>\n\n${data.get("message")}`)}`;
                    setFormStatus(
                      "Your email app will open with this draft. Send it there to deliver your message. If it does not open, copy the email address above. Your message stays here.",
                    );
                  }}
                >
                  <label>
                    Your name
                    <input
                      name="name"
                      required
                      maxLength={120}
                      autoComplete="name"
                    />
                  </label>
                  <label>
                    Your email
                    <input
                      name="email"
                      type="email"
                      required
                      maxLength={254}
                      autoComplete="email"
                    />
                  </label>
                  <label className="full-width">
                    What are you thinking?
                    <textarea
                      name="message"
                      required
                      maxLength={3000}
                      rows={4}
                    />
                  </label>
                  <button className="button primary" type="submit">
                    Open email draft <ArrowUpRight size={17} />
                  </button>
                  <p role="status">
                    {formStatus ||
                      "Opens your email app; nothing is sent automatically."}
                  </p>
                </form>
              </details>
            </Reveal>
          </section>
        </main>
        <footer className="footer wrap">
          <a className="brand" href="#home">
            dwij<span>✳</span>
          </a>
          <p className="mono">
            © {new Date().getFullYear()} DWIJ KANSAGARA
            <br />
            <span>BUILT WITH INTENTION. AND A LOT OF CURIOSITY.</span>
          </p>
          <button className="text-link" onClick={() => go("home")}>
            Back to top <ArrowUpRight size={17} />
          </button>
        </footer>
        <button
          className="mascot-dock"
          type="button"
          onClick={() => go("profile-grid")}
          aria-label="Meet Pixel, Dwij's mascot"
        >
          <DwijMascot />
          <span>Meet Pixel</span>
        </button>
        <PortfolioAssistant />
        <dialog
          className="command-dialog"
          ref={palette}
          aria-labelledby="command-title"
          onClick={(event) => {
            if (event.target === event.currentTarget) palette.current?.close();
          }}
        >
          <div className="command-head">
            <div>
              <span className="mono">TAKE A SHORTCUT</span>
              <h2 id="command-title">Where to?</h2>
            </div>
            <button
              className="icon-button"
              onClick={() => palette.current?.close()}
              aria-label="Close command menu"
            >
              <X size={20} />
            </button>
          </div>
          {[
            ...nav,
            ["github", "GitHub activity"],
            ["contact", "Get in touch"],
          ].map(([id, label], index) => (
            <button className="command-option" key={id} onClick={() => go(id)}>
              <span>
                <span className="mono">0{index + 1}</span>
                {label}
              </span>
              <ArrowUpRight size={17} />
            </button>
          ))}
          <p className="mono">
            TAB TO NAVIGATE · ENTER TO SELECT · ESC TO CLOSE
          </p>
        </dialog>
      </div>
    </MotionConfig>
  );
}
export default App;
