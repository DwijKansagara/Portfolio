import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import pg from "pg";

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const port = Number(process.env.PORT || 3000);
const databaseUrl = process.env.DATABASE_URL;
const allowedSites = new Set([
  "portfolio",
  "about",
  "jarvis",
  "lumina",
  "doomsday",
]);
const allowedOrigins = new Set([
  "https://dwij-portfolio.antideploy.com",
  "https://about-me.antideploy.com",
  "https://dwij-jarvis.antideploy.com",
  "https://lumina.antideploy.com",
  "https://doomsday.antideploy.com",
]);

const pool = databaseUrl
  ? new Pool({
      connectionString: databaseUrl,
      ssl: databaseUrl.includes("localhost")
        ? undefined
        : { rejectUnauthorized: false },
      max: 5,
    })
  : null;

let visitorSalt = "";

async function ensureSchema() {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS engagement_config (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS engagement_visitors (
      site TEXT NOT NULL,
      visitor_hash TEXT NOT NULL,
      first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (site, visitor_hash)
    );

    CREATE TABLE IF NOT EXISTS engagement_reactions (
      site TEXT NOT NULL,
      visitor_hash TEXT NOT NULL,
      clicks SMALLINT NOT NULL DEFAULT 0 CHECK (clicks BETWEEN 0 AND 20),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY (site, visitor_hash)
    );
  `);
  await pool.query(
    `INSERT INTO engagement_config (key, value)
     VALUES ('visitor_salt', $1) ON CONFLICT (key) DO NOTHING`,
    [crypto.randomBytes(32).toString("hex")],
  );
  const result = await pool.query(
    `SELECT value FROM engagement_config WHERE key = 'visitor_salt'`,
  );
  visitorSalt = result.rows[0].value;
}

function visitorHash(req, site) {
  const fingerprint = `${site}\n${req.ip || "unknown"}\n${req.get("user-agent") || "unknown"}`;
  return crypto.createHmac("sha256", visitorSalt).update(fingerprint).digest("hex");
}

function setCors(req, res) {
  const origin = req.get("origin");
  if (
    origin &&
    (allowedOrigins.has(origin) || /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin))
  ) {
    res.set("Access-Control-Allow-Origin", origin);
    res.set("Vary", "Origin");
  }
  res.set("Access-Control-Allow-Headers", "Content-Type");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
}

async function readStats(client, site, visitorHash) {
  const result = await client.query(
    `SELECT
      (SELECT COUNT(*)::int FROM engagement_visitors WHERE site = $1) AS visitors,
      (SELECT COALESCE(SUM(clicks), 0)::int FROM engagement_reactions WHERE site = $1) AS likes,
      COALESCE((SELECT clicks FROM engagement_reactions WHERE site = $1 AND visitor_hash = $2), 0)::int AS "yourClicks"`,
    [site, visitorHash],
  );
  return result.rows[0];
}

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(express.json({ limit: "4kb" }));
app.use((req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
    "Cross-Origin-Resource-Policy": "cross-origin",
    "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
    "X-Permitted-Cross-Domain-Policies": "none",
    "Referrer-Policy": "strict-origin-when-cross-origin",
  });
  next();
});

app.options("/api/engagement/*splat", (req, res) => {
  setCors(req, res);
  res.sendStatus(204);
});

app.get("/api/engagement/:site", async (req, res) => {
  setCors(req, res);
  res.set("Cache-Control", "no-store");
  const { site } = req.params;
  if (!allowedSites.has(site)) {
    return res.status(400).json({ error: "Invalid engagement request." });
  }
  if (!pool) {
    return res.status(503).json({ error: "Engagement service is not configured." });
  }
  try {
    const hash = visitorHash(req, site);
    const privacySignal = req.get("sec-gpc") === "1" || req.get("dnt") === "1";
    if (!privacySignal) {
      await pool.query(
        `INSERT INTO engagement_visitors (site, visitor_hash)
         VALUES ($1, $2) ON CONFLICT DO NOTHING`,
        [site, hash],
      );
    }
    return res.json(await readStats(pool, site, hash));
  } catch (error) {
    console.error("engagement read failed", error);
    return res.status(503).json({ error: "Engagement service is temporarily unavailable." });
  }
});

app.post("/api/engagement/:site/like", async (req, res) => {
  setCors(req, res);
  res.set("Cache-Control", "no-store");
  const { site } = req.params;
  if (!allowedSites.has(site)) {
    return res.status(400).json({ error: "Invalid engagement request." });
  }
  if (!pool) {
    return res.status(503).json({ error: "Engagement service is not configured." });
  }
  const client = await pool.connect();
  try {
    const hash = visitorHash(req, site);
    await client.query("BEGIN");
    await client.query(
      `INSERT INTO engagement_visitors (site, visitor_hash)
       VALUES ($1, $2) ON CONFLICT DO NOTHING`,
      [site, hash],
    );
    await client.query(
      `INSERT INTO engagement_reactions (site, visitor_hash, clicks)
       VALUES ($1, $2, 1)
       ON CONFLICT (site, visitor_hash)
       DO UPDATE SET
         clicks = LEAST(20, engagement_reactions.clicks + 1),
         updated_at = NOW()`,
      [site, hash],
    );
    const stats = await readStats(client, site, hash);
    await client.query("COMMIT");
    return res.json(stats);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("engagement write failed", error);
    return res.status(503).json({ error: "The reaction could not be saved." });
  } finally {
    client.release();
  }
});

app.get("/", (_req, res) => {
  res.type("text/plain").send("Dwij engagement service");
});

app.use(
  express.static(path.join(__dirname, "public"), {
    extensions: ["html"],
    maxAge: process.env.NODE_ENV === "production" ? "1h" : 0,
  }),
);

await ensureSchema();
app.listen(port, "0.0.0.0", () => {
  console.log(`Dwij portfolio listening on ${port}`);
});


