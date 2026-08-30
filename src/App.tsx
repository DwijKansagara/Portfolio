import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  ArrowDown,
  ArrowUp,
  ArrowUpRight,
  Mail,
  Menu,
  Sparkles,
  X
} from "lucide-react"

const projects = [
  {
    title: "LUMINA AI",
    description:
      "An interactive AI music experience using gesture recognition and voice commands.",
    tags: ["AI", "TensorFlow", "JavaScript"],
    link: "https://github.com/DwijKansagara"
  },
  {
    title: "J.A.R.V.I.S",
    description:
      "A personal AI assistant project exploring voice interaction and intelligent automation.",
    tags: ["AI", "Python", "Automation"],
    link: "https://github.com/DwijKansagara"
  },
  {
    title: "Avengers Doomsday",
    description:
      "A creative web project focused on interactive design and a cinematic experience.",
    tags: ["Web", "UI", "Creative"],
    link: "https://github.com/DwijKansagara"
  }
]

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

  useEffect(() => {
    const handleScroll = () => {
      setShowTop(window.scrollY > 500)
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth"
    })

    setMenuOpen(false)
  }

  return (
    <div className={dark ? "app dark" : "app"}>
      <div className="background-grid" />

      <header className="navbar">
        <button
          className="logo"
          onClick={() => scrollTo("home")}
          aria-label="Go to home"
        >
          D<span>K</span>
        </button>

        <nav className={menuOpen ? "nav-links open" : "nav-links"}>
          <button onClick={() => scrollTo("home")}>Home</button>
          <button onClick={() => scrollTo("about")}>About</button>
          <button onClick={() => scrollTo("projects")}>Projects</button>
          <button onClick={() => scrollTo("skills")}>Skills</button>
          <button onClick={() => scrollTo("contact")}>Contact</button>
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
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <main>
        <section id="home" className="hero section">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 35 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="status">
              <span />
              Currently building
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
                onClick={() => scrollTo("projects")}
              >
                View my projects
                <ArrowUpRight size={18} />
              </button>

              <a
                className="secondary-button"
                href="https://github.com/DwijKansagara"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
                <ArrowUpRight size={18} />
              </a>
            </div>
          </motion.div>

          <motion.div
            className="hero-orbit"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />

            <div className="orbit-core">
              <span>DK</span>
            </div>
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
            <div className="about-main">
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
            </div>

            <div className="about-card">
              <div className="card-icon">✦</div>

              <h3>Currently exploring</h3>

              <p>
                AI • Machine Learning • Web Development • Robotics • Creative
                Coding
              </p>
            </div>
          </div>
        </section>

        <section id="projects" className="section">
          <div className="section-heading">
            <p className="section-number">02 / PROJECTS</p>
            <h2>Things I've built.</h2>
          </div>

          <div className="projects-grid">
            {projects.map((project, index) => (
              <motion.article
                className="project-card"
                key={project.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1
                }}
              >
                <div className="project-top">
                  <span>0{index + 1}</span>

                  <a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Open ${project.title}`}
                  >
                    <ArrowUpRight size={20} />
                  </a>
                </div>

                <div>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>

                <div className="tags">
                  {project.tags.map(tag => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        <section id="skills" className="section skills-section">
          <div className="section-heading">
            <p className="section-number">03 / SKILLS</p>
            <h2>Tools I enjoy using.</h2>
          </div>

          <div className="skills-cloud">
            {skills.map((skill, index) => (
              <motion.div
                className="skill"
                key={skill}
                initial={{
                  opacity: 0,
                  scale: 0.8
                }}
                whileInView={{
                  opacity: 1,
                  scale: 1
                }}
                viewport={{
                  once: true
                }}
                transition={{
                  delay: index * 0.05
                }}
                whileHover={{
                  y: -7,
                  scale: 1.04
                }}
              >
                {skill}
              </motion.div>
            ))}
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="contact-box">
            <p className="section-number">04 / CONTACT</p>

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
                href="mailto:dwijkansagara150911@gmail.com"
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
                GitHub
                <ArrowUpRight size={18} />
              </a>

              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                className="social-link"
              >
                Instagram
                <ArrowUpRight size={18} />
              </a>

              <a
                href="#"
                className="social-link"
                onClick={event => event.preventDefault()}
              >
                Linkedin
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <span>© {new Date().getFullYear()} Dwij Kansagara</span>
        <span>Built with curiosity + code.</span>
      </footer>

      {showTop && (
        <button
          className="back-top"
          onClick={() => scrollTo("home")}
          aria-label="Back to top"
        >
          <ArrowUp size={18} />
        </button>
      )}
    </div>
  )
}

export default App