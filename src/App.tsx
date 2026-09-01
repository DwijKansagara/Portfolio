import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useSpring } from "framer-motion"
import { gsap } from "gsap"
import {
  ArrowDownRight,
  ArrowUpRight,
  Mail,
  Menu,
  Moon,
  Send,
  Sun,
  X,
  ExternalLink,
  Users,
  BookOpen,
  UserPlus,
  GitBranch
} from "lucide-react"
import "./App.css"

const projects = [
  {
    number: "01",
    title: "LUMINA AI",
    category: "AI • INTERACTION • MUSIC",
    description:
      "An interactive AI music experience exploring gesture recognition, voice commands and creative interaction.",
    tags: ["AI", "TensorFlow", "JavaScript"],
    link: "https://github.com/DwijKansagara/LUMINA-AI",
    visual: "lumina"
  },
  {
    number: "02",
    title: "J.A.R.V.I.S.",
    category: "AI • PYTHON • AUTOMATION",
    description:
      "A personal AI assistant project exploring voice interaction, intelligent automation and futuristic interfaces.",
    tags: ["Python", "AI", "Automation"],
    link: "https://github.com/DwijKansagara/J.A.R.V.I.S",
    visual: "jarvis"
  },
  {
    number: "03",
    title: "AVENGERS DOOMSDAY",
    category: "WEB • UI • CREATIVE",
    description:
      "A cinematic and interactive web project inspired by the Avengers universe and immersive digital experiences.",
    tags: ["Web", "UI", "Creative"],
    link: "https://github.com/DwijKansagara/avengers-doomsday",
    visual: "avengers"
  }
]

const skills = [
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "AI / Machine Learning",
  "TensorFlow",
  "GitHub",
  "UI / UX",
  "Robotics"
]

type GitHubProfile = {
  login: string
  avatar_url: string
  html_url: string
  name: string | null
  bio: string | null
  public_repos: number
  followers: number
  following: number
}

function App() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem("theme") !== "light"
  })

  const [menuOpen, setMenuOpen] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const [formStatus, setFormStatus] = useState("")
  const [loading, setLoading] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)

  const [githubProfile, setGithubProfile] =
    useState<GitHubProfile | null>(null)

  const [githubLoading, setGithubLoading] = useState(true)

  const nameRef = useRef<HTMLHeadingElement>(null)

  const { scrollYProgress } = useScroll()

  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light")
  }, [dark])

  useEffect(() => {
    let progress = 0

    const interval = setInterval(() => {
      progress += Math.floor(Math.random() * 12) + 4

      if (progress >= 100) {
        progress = 100
        clearInterval(interval)

        setTimeout(() => {
          setLoading(false)
        }, 450)
      }

      setLoadingProgress(progress)
    }, 120)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const fetchGithubProfile = async () => {
      try {
        const response = await fetch(
          "https://api.github.com/users/DwijKansagara"
        )

        if (!response.ok) {
          throw new Error("Could not fetch GitHub profile")
        }

        const data = await response.json()

        setGithubProfile(data)
      } catch (error) {
        console.error(error)
      } finally {
        setGithubLoading(false)
      }
    }

    fetchGithubProfile()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 600)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useEffect(() => {
    if (loading) return

    const timer = setTimeout(() => {
      const letters =
        nameRef.current?.querySelectorAll(".name-letter")

      if (!letters) return

      gsap.fromTo(
        letters,
        {
          y: 100,
          opacity: 0,
          rotateX: -70
        },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          stagger: 0.08,
          duration: 1,
          ease: "power4.out"
        }
      )
    }, 250)

    return () => clearTimeout(timer)
  }, [loading])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth"
    })

    setMenuOpen(false)
  }

  const handleLetterMove = (
    event: React.MouseEvent<HTMLSpanElement>
  ) => {
    const target = event.currentTarget
    const rect = target.getBoundingClientRect()

    const x =
      event.clientX - rect.left - rect.width / 2

    const y =
      event.clientY - rect.top - rect.height / 2

    gsap.to(target, {
      x: x * 0.18,
      y: y * 0.18,
      rotate: x * 0.03,
      duration: 0.3,
      ease: "power2.out"
    })
  }

  const resetLetter = (
    event: React.MouseEvent<HTMLSpanElement>
  ) => {
    gsap.to(event.currentTarget, {
      x: 0,
      y: 0,
      rotate: 0,
      duration: 0.7,
      ease: "elastic.out(1, 0.4)"
    })
  }

  const handleContactSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault()

    const form = event.currentTarget
    const formData = new FormData(form)

    const name = formData.get("name")
    const email = formData.get("email")
    const message = formData.get("message")

    const subject = encodeURIComponent(
      `Portfolio message from ${name}`
    )

    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
    )

    setFormStatus("Opening your email app...")

    window.location.href =
      `mailto:kansagara.dwij@gmail.com?subject=${subject}&body=${body}`

    setTimeout(() => {
      setFormStatus("")
      form.reset()
    }, 2500)
  }

  const renderName = (text: string) =>
    text.split("").map((letter, index) => (
      <span
        className="name-letter"
        key={`${letter}-${index}`}
        onMouseMove={handleLetterMove}
        onMouseLeave={resetLetter}
      >
        {letter}
      </span>
    ))

  return (
    <>
      {loading && (
        <LoadingScreen progress={loadingProgress} />
      )}

      <div className={dark ? "app dark-theme" : "app light-theme"}>
        <motion.div
          className="scroll-progress"
          style={{ scaleX }}
        />

        <div className="background-noise" />
        <div className="background-glow glow-one" />
        <div className="background-glow glow-two" />

        <header className="navbar">
          <button
            className="brand"
            onClick={() => scrollTo("home")}
            aria-label="Go to home"
          >
            D<span>.</span>
          </button>

          <nav
            className={
              menuOpen
                ? "nav-links active"
                : "nav-links"
            }
          >
            <button onClick={() => scrollTo("home")}>
              HOME
            </button>

            <button onClick={() => scrollTo("about")}>
              ABOUT
            </button>

            <button onClick={() => scrollTo("projects")}>
              PROJECTS
            </button>

            <button onClick={() => scrollTo("github")}>
              GITHUB
            </button>

            <button onClick={() => scrollTo("skills")}>
              SKILLS
            </button>

            <button onClick={() => scrollTo("journey")}>
              JOURNEY
            </button>

            <button onClick={() => scrollTo("contact")}>
              CONTACT
            </button>
          </nav>

          <div className="nav-actions">
            <button
              className="theme-button"
              onClick={() => setDark(!dark)}
              aria-label="Toggle theme"
            >
              {dark ? (
                <Sun size={18} />
              ) : (
                <Moon size={18} />
              )}
            </button>

            <button
              className="menu-button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? (
                <X size={21} />
              ) : (
                <Menu size={21} />
              )}
            </button>
          </div>
        </header>

        <main>
          <section id="home" className="hero">
            <div className="hero-grid" />

            <div className="hero-top">
              <div className="availability">
                <span />
                CURRENTLY BUILDING & LEARNING
              </div>

              <div>2026 / INDIA</div>
            </div>

            <div className="hero-content">
              <p className="hero-label">
                DEVELOPER · AI ENTHUSIAST · BUILDER
              </p>

              <h1 ref={nameRef} aria-label="Dwij">
                <span className="name-row single-name">
                  {renderName("DWIJ")}
                </span>
              </h1>
            </div>

            <div className="hero-bottom">
              <p>
                A student who enjoys turning
                <br />
                <strong>
                  ideas into things you can interact with.
                </strong>
              </p>

              <button
                className="explore-button"
                onClick={() => scrollTo("projects")}
              >
                EXPLORE MY WORK
                <ArrowDownRight size={18} />
              </button>
            </div>

            <div className="hero-orb">
              <div className="orb-ring orb-ring-one" />
              <div className="orb-ring orb-ring-two" />

              <div className="orb-core">D</div>
            </div>

            <div className="scroll-side">
              SCROLL TO EXPLORE ↓
            </div>
          </section>

          <section
            id="about"
            className="section about-section"
          >
            <span className="section-index">
              01 / ABOUT
            </span>

            <motion.div
              className="about-content"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7 }}
            >
              <p className="section-kicker">
                A LITTLE ABOUT ME
              </p>

              <h2>
                I learn by
                <br />
                <span>building things.</span>
              </h2>

              <div className="about-text-grid">
                <p>
                  I'm a student and developer who enjoys
                  turning ideas into interactive projects.
                  I'm especially interested in artificial
                  intelligence, software, robotics and
                  creative technology.
                </p>

                <p>
                  Most of what I learn comes from
                  experimenting, breaking things, fixing them
                  and building again. I'm still learning, and
                  that's exactly what makes technology
                  exciting to me.
                </p>
              </div>

              <div className="interest-pills">
                {[
                  "ARTIFICIAL INTELLIGENCE",
                  "CREATIVE CODE",
                  "ROBOTICS",
                  "WEB EXPERIENCES",
                  "EXPERIMENTATION"
                ].map(item => (
                  <span key={item}>{item}</span>
                ))}
              </div>
            </motion.div>
          </section>

          <section className="statement-section">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="statement-icon">✦</div>

              <h2>
                Curiosity is where
                <br />
                <span>every project starts.</span>
              </h2>

              <div className="statement-line" />

              <p>
                THINK · EXPERIMENT · BUILD · IMPROVE
              </p>
            </motion.div>
          </section>

          <section
            id="projects"
            className="section projects-section"
          >
            <div className="projects-header">
              <div>
                <span className="section-index">
                  02 / PROJECTS
                </span>

                <h2>
                  Things I've
                  <br />
                  <span>built so far.</span>
                </h2>
              </div>

              <p>
                A collection of experiments exploring AI,
                interaction, web development and creative
                technology.
              </p>
            </div>

            <div className="projects-list">
              {projects.map((project, index) => (
                <motion.article
                  className="project-card"
                  key={project.title}
                  initial={{ opacity: 0, y: 70 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{
                    once: true,
                    amount: 0.15
                  }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.08
                  }}
                >
                  <div className="project-number">
                    {project.number}
                  </div>

                  <ProjectVisual type={project.visual} />

                  <div className="project-info">
                    <p className="project-category">
                      {project.category}
                    </p>

                    <h3>{project.title}</h3>

                    <p className="project-description">
                      {project.description}
                    </p>

                    <div className="project-footer">
                      <div className="project-tags">
                        {project.tags.map(tag => (
                          <span key={tag}>{tag}</span>
                        ))}
                      </div>

                      <a
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Open ${project.title} on GitHub`}
                      >
                        <ArrowUpRight size={22} />
                      </a>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>
          </section>

          <section
            id="github"
            className="section github-section"
          >
            <div className="github-heading">
              <div>
                <span className="section-index">
                  03 / GITHUB
                </span>

                <h2>
                  Building in
                  <br />
                  <span>public.</span>
                </h2>
              </div>

              <p>
                Follow my journey, explore my projects and
                see what I'm currently building.
              </p>
            </div>

            {githubLoading ? (
              <div className="github-loading">
                <div className="github-loader" />

                <span>
                  FETCHING GITHUB PROFILE...
                </span>
              </div>
            ) : githubProfile ? (
              <motion.div
                className="github-card"
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
              >
                <div className="github-profile-top">
                  <div className="github-avatar-wrap">
                    <img
                      src={githubProfile.avatar_url}
                      alt="Dwij GitHub profile"
                      className="github-avatar"
                    />

                    <span className="github-online-dot" />
                  </div>

                  <div className="github-user-info">
                    <div className="github-icon-row">
                      <GitBranch size={20} />

                      <span>
                        @
                        {githubProfile.login}
                      </span>
                    </div>

                    <h3>
                      {githubProfile.name || "Dwij"}
                    </h3>

                    <p>
                      {githubProfile.bio ||
                        "Developer · AI Enthusiast · Builder"}
                    </p>
                  </div>

                  <a
                    href={githubProfile.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="github-visit"
                  >
                    VISIT PROFILE
                    <ExternalLink size={16} />
                  </a>
                </div>

                <div className="github-stats">
                  <div className="github-stat">
                    <BookOpen size={19} />

                    <strong>
                      {githubProfile.public_repos}
                    </strong>

                    <span>PUBLIC REPOS</span>
                  </div>

                  <div className="github-stat">
                    <Users size={19} />

                    <strong>
                      {githubProfile.followers}
                    </strong>

                    <span>FOLLOWERS</span>
                  </div>

                  <div className="github-stat">
                    <UserPlus size={19} />

                    <strong>
                      {githubProfile.following}
                    </strong>

                    <span>FOLLOWING</span>
                  </div>
                </div>

                <div className="github-card-footer">
                  <span>
                    LIVE DATA FROM GITHUB
                  </span>

                  <a
                    href="https://github.com/DwijKansagara"
                    target="_blank"
                    rel="noreferrer"
                  >
                    github.com/DwijKansagara
                    <ArrowUpRight size={15} />
                  </a>
                </div>
              </motion.div>
            ) : (
              <div className="github-error">
                <GitBranch size={28} />

                <p>
                  GitHub profile couldn't be loaded right
                  now.
                </p>

                <a
                  href="https://github.com/DwijKansagara"
                  target="_blank"
                  rel="noreferrer"
                >
                  VISIT GITHUB
                  <ArrowUpRight size={16} />
                </a>
              </div>
            )}
          </section>

          <section
            id="journey"
            className="section journey-section"
          >
            <span className="section-index">
              04 / JOURNEY
            </span>

            <motion.div
              className="journey-content"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <p className="section-kicker">
                WHAT I'M EXPLORING
              </p>

              <h2>
                Still learning.
                <br />
                <span>Still building.</span>
              </h2>

              <div className="journey-card">
                <span>RIGHT NOW</span>

                <div>
                  <h3>
                    Exploring technology one project at a
                    time.
                  </h3>

                  <p>
                    I'm currently focused on improving my
                    programming skills, experimenting with AI
                    and machine learning, building interactive
                    web experiences and exploring the
                    possibilities of robotics.
                  </p>
                </div>
              </div>

              <div className="journey-stats">
                <div>
                  <strong>AI</strong>

                  <span>
                    EXPLORING INTELLIGENT SYSTEMS
                  </span>
                </div>

                <div>
                  <strong>CODE</strong>

                  <span>
                    LEARNING BY BUILDING
                  </span>
                </div>

                <div>
                  <strong>MAKE</strong>

                  <span>
                    TURNING IDEAS INTO PROJECTS
                  </span>
                </div>
              </div>
            </motion.div>
          </section>

          <section
            id="skills"
            className="section skills-section"
          >
            <div className="skills-heading">
              <span className="section-index">
                05 / SKILLS
              </span>

              <h2>
                Tools I'm
                <br />
                <span>growing with.</span>
              </h2>
            </div>

            <div className="skills-list">
              {skills.map((skill, index) => (
                <motion.div
                  className="skill-row"
                  key={skill}
                  initial={{ opacity: 0, x: 35 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.45,
                    delay: index * 0.05
                  }}
                  whileHover={{ x: 10 }}
                >
                  <span>0{index + 1}</span>

                  <h3>{skill}</h3>

                  <ArrowUpRight size={18} />
                </motion.div>
              ))}
            </div>
          </section>

          <section
            id="contact"
            className="contact-section"
          >
            <div className="contact-top">
              <span>06 / CONTACT</span>

              <span className="contact-status" />
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              Let's build
              <br />
              <span>something cool.</span>
            </motion.h2>

            <div className="contact-layout">
              <div className="contact-info">
                <p>
                  Have an idea, project or something
                  interesting to share? Drop me a message.
                </p>

                <div className="contact-links">
                  <a
                    href="mailto:kansagara.dwij@gmail.com"
                    aria-label="Send email"
                  >
                    <Mail size={18} />
                    EMAIL
                  </a>

                  <a
                    href="https://github.com/DwijKansagara"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Visit GitHub"
                  >
                    <span className="social-symbol">
                      GH
                    </span>

                    GITHUB
                  </a>

                  <a
                    href="https://www.instagram.com/dwij.kansagara/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Visit Instagram"
                  >
                    <span className="social-symbol">
                      IG
                    </span>

                    INSTAGRAM
                  </a>
                </div>
              </div>

              <form
                className="contact-form"
                onSubmit={handleContactSubmit}
              >
                <label>
                  YOUR NAME

                  <input
                    type="text"
                    name="name"
                    placeholder="What should I call you?"
                    required
                  />
                </label>

                <label>
                  YOUR EMAIL

                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                  />
                </label>

                <label>
                  MESSAGE

                  <textarea
                    name="message"
                    placeholder="Tell me what's on your mind..."
                    required
                    rows={5}
                  />
                </label>

                <button
                  type="submit"
                  className="send-button"
                >
                  SEND MESSAGE
                  <Send size={17} />
                </button>

                {formStatus && (
                  <p className="form-status">
                    {formStatus}
                  </p>
                )}
              </form>
            </div>
          </section>
        </main>

        <footer>
          <span>
            © {new Date().getFullYear()} DWIJ
          </span>

          <span>
            BUILT WITH CURIOSITY + CODE.
          </span>
        </footer>

        {showTop && (
          <motion.button
            className="back-top"
            onClick={() => scrollTo("home")}
            aria-label="Back to top"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            ↑
          </motion.button>
        )}
      </div>
    </>
  )
}

function LoadingScreen({
  progress
}: {
  progress: number
}) {
  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="loading-grid" />

      <motion.div
        className="loading-content"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="loading-symbol">
          <span>D</span>
        </div>

        <p className="loading-small">
          PORTFOLIO_2026
        </p>

        <h1>DWIJ</h1>

        <div className="loading-bar-container">
          <div className="loading-bar-track">
            <motion.div
              className="loading-bar-fill"
              animate={{
                width: `${progress}%`
              }}
              transition={{
                duration: 0.25
              }}
            />
          </div>

          <span>{progress}%</span>
        </div>

        <div className="loading-status">
          <span className="loading-dot" />

          {progress < 35 && "INITIALIZING EXPERIENCE..."}
          {progress >= 35 &&
            progress < 70 &&
            "LOADING PROJECTS..."}
          {progress >= 70 &&
            progress < 100 &&
            "ALMOST READY..."}
          {progress === 100 &&
            "WELCOME."}
        </div>
      </motion.div>

      <div className="loading-footer">
        <span>DEVELOPER · AI ENTHUSIAST</span>

        <span>INDIA / 2026</span>
      </div>
    </motion.div>
  )
}

function ProjectVisual({
  type
}: {
  type: string
}) {
  if (type === "lumina") {
    return (
      <div className="project-visual">
        <div className="project-art lumina-art">
          <div className="art-glow" />

          <div className="music-orb">
            <div className="music-ring ring-a" />
            <div className="music-ring ring-b" />
            <div className="music-ring ring-c" />

            <span>♫</span>
          </div>

          <div className="equalizer">
            {Array.from({ length: 18 }).map(
              (_, index) => (
                <span key={index} />
              )
            )}
          </div>

          <span className="art-label">
            AI MUSIC INTERACTION
          </span>
        </div>
      </div>
    )
  }

  if (type === "jarvis") {
    return (
      <div className="project-visual">
        <div className="project-art jarvis-art">
          <div className="hud-circle hud-one" />
          <div className="hud-circle hud-two" />
          <div className="hud-circle hud-three" />

          <div className="hud-line line-one" />
          <div className="hud-line line-two" />

          <div className="jarvis-core">
            <span>AI</span>
          </div>

          <div className="system-data">
            <span>SYSTEM ONLINE</span>
            <span>VOICE READY</span>
            <span>CORE ACTIVE</span>
          </div>

          <span className="art-label">
            INTELLIGENT SYSTEM
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="project-visual">
      <div className="project-art avengers-art">
        <div className="portal portal-one" />
        <div className="portal portal-two" />
        <div className="portal portal-three" />

        <div className="avengers-symbol">
          <span>A</span>
        </div>

        <div className="particle particle-one" />
        <div className="particle particle-two" />
        <div className="particle particle-three" />
        <div className="particle particle-four" />

        <span className="art-label">
          CREATIVE WEB EXPERIENCE
        </span>
      </div>
    </div>
  )
}

export default App