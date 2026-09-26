export function ProjectVisual({ type }: { type: string }) {
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
            {Array.from({ length: 18 }).map((_, index) => (
              <span key={index} />
            ))}
          </div>

          <span className="art-label">AI MUSIC INTERACTION</span>
        </div>
      </div>
    );
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

          <span className="art-label">INTELLIGENT SYSTEM</span>
        </div>
      </div>
    );
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

        <span className="art-label">CREATIVE WEB EXPERIENCE</span>
      </div>
    </div>
  );
}
