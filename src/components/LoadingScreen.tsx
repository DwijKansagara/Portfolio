import { motion } from "framer-motion"

export default function LoadingScreen({
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
