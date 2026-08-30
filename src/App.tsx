import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  GitBranch,
  Mail,
  Menu,
  RefreshCw,
  Search,
  Sparkles,
  Star,
  Users,
  X
} from "lucide-react"

type GitHubUser = {
  login: string
  name: string | null
  bio: string | null
  avatar_url: string
  public_repos: number
  followers: number
  following: number
  html_url: string
}

type GitHubRepo = {
  id: number
  name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  language: string | null
  updated_at: string
  topics?: string[]
}

const skills = [
  "Python",
  "JavaScript",
  "TypeScript",
  "React",
  "AI / ML",
  "TensorFlow",
  "GitHub",
  "UI / UX"
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [dark, setDark] = useState(true)
  const [showTop, setShowTop] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [progress, setProgress] = useState(0)

  const [mouse, setMouse] = useState({
    x: 0,
    y: 0
  })

  const [githubUser, setGithubUser] = useState<GitHubUser | null>(null)
  const [githubRepos, setGithubRepos] = useState<GitHubRepo[]>([])
  const [githubLoading, setGithubLoading] = useState(true)
  const [githubError, setGithubError] = useState(false)

  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState("All")

  const [terminalInput, setTerminalInput] = useState("")

  const [terminalLines, setTerminalLines] = useState([
    "DwijOS v4.0 initialized.",
    "GitHub API connection ready.",
    'Type "help" to see available commands.'
  ])

  const loadGitHub = async () => {
    setGithubLoading(true)
    setGithubError(false)

    try {
      const userResponse = await fetch(
        "https://api.github.com/users/DwijKansagara"
      )

      if (!userResponse.ok) {
        throw new Error("User request failed")
      }

      const userData: GitHubUser = await userResponse.json()

      const repoResponse = await fetch(
        "https://api.github.com/users/DwijKansagara/repos?sort=updated&per_page=100"
      )

      if (!repoResponse.ok) {
        throw new Error("Repository request failed")
      }

      const repoData: GitHubRepo[] = await repoResponse.json()

      setGithubUser(userData)
      setGithubRepos(repoData)
    } catch {
      setGithubError(true)
    } finally {
      setGithubLoading(false)
    }
  }

  useEffect(() => {
    loadGitHub()
  }, [])

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMouse({
        x: event.clientX,
        y: event.clientY
      })
    }

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const height =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight

      setProgress(height > 0 ? (scrollTop / height) * 100 : 0)
      setShowTop(scrollTop > 500)

      const sections = [
        "home",
        "about",
        "skills",
        "github",
        "terminal",
        "contact"
      ]

      let current = "home"

      sections.forEach(section => {
        const element = document.getElementById(section)

        if (element && element.getBoundingClientRect().top <= 180) {
          current = section
        }
      })

      setActiveSection(current)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll)

    handleScroll()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth"
    })

    setMenuOpen(false)
  }

  const languages = useMemo(() => {
    const values = githubRepos
      .map(repo => repo.language)
      .filter((language): language is string => Boolean(language))

    return ["All", ...Array.from(new Set(values))]
  }, [githubRepos])

  const filteredRepos = useMemo(() => {
    return githubRepos.filter(repo => {
      const matchesSearch =
        repo.name.toLowerCase().includes(search.toLowerCase()) ||
        (repo.description || "")
          .toLowerCase()
          .includes(search.toLowerCase())

      const matchesFilter =
        filter === "All" || repo.language === filter

      return matchesSearch && matchesFilter
    })
  }, [githubRepos, search, filter])

  const totalStars = githubRepos.reduce(
    (total, repo) => total + repo.stargazers_count,
    0
  )

  const runCommand = (command: string) => {
    const value = command.trim().toLowerCase()

    if (!value) {
      return
    }

    if (value === "clear") {
      setTerminalLines([])
      setTerminalInput("")
      return
    }

    if (value === "help") {
      setTerminalLines(previous => [
        ...previous,
        `> ${command}`,
        "about   → about Dwij",
        "projects → view GitHub projects",
        "skills  → view skills",
        "stats   → GitHub statistics",
        "github  → open GitHub",
        "contact → email",
        "clear   → clear terminal"
      ])

      setTerminalInput("")
      return
    }

    if (value === "github") {
      window.open(
        "https://github.com/DwijKansagara",
        "_blank",
        "noopener,noreferrer"
      )

      setTerminalLines(previous => [
        ...previous,
        `> ${command}`,
        "Opening GitHub..."
      ])

      setTerminalInput("")
      return
    }

    if (value === "about") {
      setTerminalLines(previous => [
        ...previous,
        `> ${command}`,
        "Dwij is a student, developer and AI enthusiast who loves building interactive projects."
      ])

      setTerminalInput("")
      scrollTo("about")
      return
    }

    if (value === "projects") {
      setTerminalLines(previous => [
        ...previous,
        `> ${command}`,
        `${githubRepos.length} GitHub repositories loaded.`
      ])

      setTerminalInput("")
      scrollTo("github")
      return
    }

    if (value === "skills") {
      setTerminalLines(previous => [
        ...previous,
        `> ${command}`,
        skills.join(" • ")
      ])

      setTerminalInput("")
      scrollTo("skills")
      return
    }

    if (value === "stats") {
      const stats = githubUser
        ? `Repos: ${githubUser.public_repos} | Followers: ${githubUser.followers} | Following: ${githubUser.following} | Stars: ${totalStars}`
        : "GitHub data is still loading."

      setTerminalLines(previous => [
        ...previous,
        `> ${command}`,
        stats
      ])

      setTerminalInput("")
      scrollTo("github")
      return
    }

    if (value === "contact") {
      setTerminalLines(previous => [
        ...previous,
        `> ${command}`,
        "Email: kansagara.dwij@gmail.com"
      ])

      setTerminalInput("")
      scrollTo("contact")
      return
    }

    setTerminalLines(previous => [
      ...previous,
      `> ${command}`,
      `Command not found: ${value}`,
      'Type "help" for available commands.'
    ])

    setTerminalInput("")
  }

  return (
    <div className={dark ? "app dark" : "app"}>
      <motion.div
        className="scroll-progress"
        style={{
          width: `${progress}%`
        }}
      />

      <div
        className="cursor-glow"
        style={{
          left: mouse.x,
          top: mouse.y
        }}
      />

      <div className="background-grid" />

      <header className="navbar">
        <button
          className="logo"
          onClick={() => scrollTo("home")}
        >
          D<span>K</span>
        </button>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          {[
            ["home", "Home"],
            ["about", "About"],
            ["skills", "Skills"],
            ["github", "Projects"],
            ["terminal", "Terminal"],
            ["contact", "Contact"]
          ].map(([id, label]) => (
            <button
              key={id}
              className={activeSection === id ? "active" : ""}
              onClick={() => scrollTo(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="nav-actions">
          <button
            className="theme-button"
            onClick={() => setDark(!dark)}
            aria-label="Toggle theme"
          >
            {dark ? "☼" : "☾"}
          </button>

          <button
            className="menu-button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Open menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <main>
        <section id="home" className="hero section">
          <motion.div
            className="hero-content"
            initial={{
              opacity: 0,
              y: 40
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            transition={{
              duration: 0.8
            }}
          >
            <div className="status">
              <span />
              {githubLoading
                ? "Connecting to GitHub"
                : githubError
                  ? "GitHub connection unavailable"
                  : "GitHub connected"}
            </div>

            <p className="eyebrow">
              <Sparkles size={15} />
              Developer • AI Enthusiast • Builder
            </p>

            <h1>
              Hey, I'm <span>Dwij.</span>
              <br />
              I build things
              <br />
              <em>with code & AI.</em>
            </h1>

            <p className="hero-description">
              I'm a student and developer who enjoys turning ideas into
              interactive projects, experimenting with AI, and learning by
              building.
            </p>

            <div className="hero-buttons">
              <button
                className="primary-button"
                onClick={() => scrollTo("github")}
              >
                Explore my projects
                <ArrowUpRight size={18} />
              </button>

              <a
                className="secondary-button"
                href="https://github.com/DwijKansagara"
                target="_blank"
                rel="noreferrer"
              >
                <GitBranch size={18} />
                GitHub
              </a>
            </div>
          </motion.div>

          <motion.div
            className="hero-orbit"
            animate={{
              y: [-10, 10, -10],
              rotate: [0, 2, 0, -2, 0]
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />

            <motion.div
              className="orbit-core"
              animate={{
                rotate: [0, 360]
              }}
              transition={{
                duration: 16,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <span>DK</span>
            </motion.div>
          </motion.div>

          <button
            className="scroll-hint"
            onClick={() => scrollTo("about")}
          >
            <span>Scroll to explore</span>
            <ArrowDown size={16} />
          </button>
        </section>

        <section id="about" className="section about-section">
          <div className="section-heading">
            <p className="section-number">01 / ABOUT</p>
            <h2>A little about me.</h2>
          </div>

          <div className="about-grid">
            <motion.div
              className="about-main"
              initial={{
                opacity: 0,
                x: -40
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              viewport={{
                once: true
              }}
            >
              <p className="big-text">
                I like <span>building things</span> more than just talking
                about them.
              </p>

              <p>
                My interests are around artificial intelligence, software,
                robotics and creative technology. Most of what I learn comes
                from actually making projects and experimenting with ideas.
              </p>

              <p>
                I'm constantly exploring new technologies and looking for
                interesting problems to solve.
              </p>
            </motion.div>

            <motion.div
              className="about-card"
              initial={{
                opacity: 0,
                x: 40
              }}
              whileInView={{
                opacity: 1,
                x: 0
              }}
              viewport={{
                once: true
              }}
              whileHover={{
                y: -8
              }}
            >
              <div className="card-icon">✦</div>

              <h3>Currently exploring</h3>

              <p>
                AI • Machine Learning • Web Development • Robotics • Creative
                Coding
              </p>
            </motion.div>
          </div>
        </section>

        <section id="skills" className="section skills-section">
          <div className="section-heading">
            <p className="section-number">02 / SKILLS</p>
            <h2>Tools I enjoy using.</h2>
          </div>

          <div className="skills-cloud">
            {skills.map((skill, index) => (
              <motion.div
                className="skill"
                key={skill}
                initial={{
                  opacity: 0,
                  scale: 0.7
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1
                }}
                whileHover={{
                  y: -8,
                  scale: 1.08
                }}
                viewport={{
                  once: true
                }}
                transition={{
                  delay: index * 0.06
                }}
              >
                {skill}
              </motion.div>
            ))}
          </div>
        </section>

        <section id="github" className="section github-section">
          <div className="section-heading github-heading">
            <div>
              <p className="section-number">03 / PROJECTS</p>
              <h2>My GitHub universe.</h2>
            </div>

            <button
              className="refresh-button"
              onClick={loadGitHub}
              disabled={githubLoading}
            >
              <RefreshCw
                size={16}
                className={githubLoading ? "spin" : ""}
              />
              Refresh
            </button>
          </div>

          {githubLoading && (
            <div className="github-loading">
              <div className="loading-spinner" />
              <p>Loading repositories from GitHub...</p>
            </div>
          )}

          {githubError && !githubLoading && (
            <div className="github-error">
              <p>Couldn't load GitHub data.</p>

              <button onClick={loadGitHub}>
                Try again
              </button>
            </div>
          )}

          {!githubLoading && !githubError && githubUser && (
            <>
              <div className="github-profile">
                <div className="github-profile-main">
                  <img
                    src={githubUser.avatar_url}
                    alt="Dwij GitHub avatar"
                  />

                  <div>
                    <h3>
                      {githubUser.name || githubUser.login}
                    </h3>

                    <p>@{githubUser.login}</p>

                    <span>
                      {githubUser.bio ||
                        "Developer building interesting things."}
                    </span>
                  </div>
                </div>

                <a
                  href={githubUser.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="github-profile-button"
                >
                  <GitBranch size={17} />
                  View Profile
                  <ArrowUpRight size={16} />
                </a>
              </div>

              <div className="github-stats">
                <div className="github-stat">
                  <GitBranch size={19} />
                  <strong>{githubUser.public_repos}</strong>
                  <span>Repositories</span>
                </div>

                <div className="github-stat">
                  <Users size={19} />
                  <strong>{githubUser.followers}</strong>
                  <span>Followers</span>
                </div>

                <div className="github-stat">
                  <Users size={19} />
                  <strong>{githubUser.following}</strong>
                  <span>Following</span>
                </div>

                <div className="github-stat">
                  <Star size={19} />
                  <strong>{totalStars}</strong>
                  <span>Total Stars</span>
                </div>
              </div>

              <div className="project-controls">
                <div className="project-search">
                  <Search size={18} />

                  <input
                    value={search}
                    onChange={event =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search projects..."
                  />
                </div>

                <div className="project-filters">
                  {languages.slice(0, 8).map(language => (
                    <button
                      key={language}
                      className={
                        filter === language ? "selected" : ""
                      }
                      onClick={() => setFilter(language)}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </div>

              {filteredRepos.length === 0 && (
                <div className="empty-projects">
                  <Search size={25} />
                  <h3>No projects found</h3>
                  <p>Try another search or filter.</p>
                </div>
              )}

              <div className="repo-grid">
                {filteredRepos.slice(0, 12).map((repo, index) => (
                  <motion.a
                    href={repo.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="repo-card"
                    key={repo.id}
                    initial={{
                      opacity: 0,
                      y: 25
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0
                    }}
                    whileHover={{
                      y: -8,
                      scale: 1.015
                    }}
                    viewport={{
                      once: true
                    }}
                    transition={{
                      delay: Math.min(index * 0.05, 0.4)
                    }}
                  >
                    <div className="repo-top">
                      <GitBranch size={19} />

                      <ArrowUpRight size={18} />
                    </div>

                    <h3>{repo.name}</h3>

                    <p>
                      {repo.description ||
                        "A project built by Dwij."}
                    </p>

                    <div className="repo-bottom">
                      <span>
                        {repo.language || "Code"}
                      </span>

                      <span>
                        <Star size={13} />
                        {repo.stargazers_count}
                      </span>

                      <span>
                        Forks {repo.forks_count}
                      </span>
                    </div>
                  </motion.a>
                ))}
              </div>
            </>
          )}
        </section>

        <section id="terminal" className="section terminal-section">
          <div className="section-heading">
            <p className="section-number">04 / TERMINAL</p>
            <h2>Talk to my portfolio.</h2>
          </div>

          <motion.div
            className="terminal-window"
            initial={{
              opacity: 0,
              y: 30
            }}
            whileInView={{
              opacity: 1,
              y: 0
            }}
            viewport={{
              once: true
            }}
          >
            <div className="terminal-header">
              <div className="terminal-dots">
                <span />
                <span />
                <span />
              </div>

              <div className="terminal-title">
                <GitBranch size={15} />
                dwij@portfolio:v4
              </div>
            </div>

            <div className="terminal-body">
              {terminalLines.map((line, index) => (
                <div
                  className={
                    line.startsWith(">")
                      ? "terminal-command"
                      : "terminal-line"
                  }
                  key={`${line}-${index}`}
                >
                  {line}
                </div>
              ))}

              <form
                className="terminal-input-row"
                onSubmit={event => {
                  event.preventDefault()
                  runCommand(terminalInput)
                }}
              >
                <span>visitor@dwij:~$</span>

                <input
                  value={terminalInput}
                  onChange={event =>
                    setTerminalInput(event.target.value)
                  }
                  autoComplete="off"
                  spellCheck={false}
                  aria-label="Terminal command"
                />
              </form>
            </div>
          </motion.div>
        </section>

        <section id="contact" className="section contact-section">
          <motion.div
            className="contact-box"
            initial={{
              opacity: 0,
              scale: 0.95
            }}
            whileInView={{
              opacity: 1,
              scale: 1
            }}
            viewport={{
              once: true
            }}
          >
            <p className="section-number">05 / CONTACT</p>

            <h2>
              Have an idea?
              <br />
              <span>Let's build it.</span>
            </h2>

            <p>
              I'm always interested in learning, collaborating and building
              interesting things.
            </p>

            <div className="social-links">
              <a
                href="mailto:kansagara.dwij@gmail.com"
                className="social-link"
              >
                <Mail size={18} />
                Email
              </a>

              <a
                href="https://github.com/DwijKansagara"
                target="_blank"
                rel="noreferrer"
                className="social-link"
              >
                <GitBranch size={18} />
                GitHub
              </a>

              <a
                href="https://www.instagram.com/dwij.kansagara/"
                target="_blank"
                rel="noreferrer"
                className="social-link"
              >
                Instagram
                <ArrowUpRight size={18} />
              </a>
            </div>
          </motion.div>
        </section>
      </main>

      <footer>
        <span>© {new Date().getFullYear()} Dwij Kansagara</span>
        <span>Built with curiosity + code.</span>
      </footer>

      {showTop && (
        <motion.button
          className="back-top"
          onClick={() => scrollTo("home")}
          initial={{
            opacity: 0,
            scale: 0.7
          }}
          animate={{
            opacity: 1,
            scale: 1
          }}
          aria-label="Back to top"
        >
          <ArrowUp size={18} />
        </motion.button>
      )}
    </div>
  )
}

export default App