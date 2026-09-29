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

    CREATE TABLE IF NOT EXISTS engagement_views (
      site TEXT PRIMARY KEY,
      views BIGINT NOT NULL DEFAULT 0 CHECK (views >= 0)
    );

    INSERT INTO engagement_views (site, views)
    SELECT site, COUNT(*) FROM engagement_visitors GROUP BY site
    ON CONFLICT (site) DO NOTHING;
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
  const browserId = req.get("x-dwij-visitor") || "";
  if (!/^[a-f0-9-]{32,64}$/i.test(browserId)) return null;
  return crypto.createHmac("sha256", visitorSalt).update(`${site}\n${browserId}`).digest("hex");
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
  res.set("Access-Control-Allow-Headers", "Content-Type, X-Dwij-Visitor");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
}

async function readStats(client, site, visitorHash) {
  const result = await client.query(
    `SELECT
      COALESCE((SELECT views::int FROM engagement_views WHERE site = $1), 0) AS visitors,
      (SELECT COALESCE(SUM(clicks), 0)::int FROM engagement_reactions WHERE site = $1) AS likes,
      COALESCE((SELECT clicks FROM engagement_reactions WHERE site = $1 AND visitor_hash = $2), 0)::int AS "yourClicks"`,
    [site, visitorHash],
  );
  return result.rows[0];
}

async function readTotals(client, site) {
  const result = await client.query(
    `SELECT
      COALESCE((SELECT views::int FROM engagement_views WHERE site = $1), 0) AS visitors,
      (SELECT COALESCE(SUM(clicks), 0)::int FROM engagement_reactions WHERE site = $1) AS likes`,
    [site],
  );
  return result.rows[0];
}

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(express.json({ limit: "4kb" }));
app.use((req, res, next) => {
  res.set({
    "Content-Security-Policy": [
      "default-src 'self'",
      "base-uri 'self'",
      "connect-src 'self' https://dwij-signal.vercel.app https://huggingface.co https://*.hf.co https://github.com https://raw.githubusercontent.com",
      "font-src 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "img-src 'self' data:",
      "object-src 'none'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline'",
      "worker-src 'self' blob:",
    ].join("; "),
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
    "Cross-Origin-Resource-Policy": "cross-origin",
    "X-Permitted-Cross-Domain-Policies": "none",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), geolocation=(self), microphone=(), payment=()",
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
    return res.json(await readStats(pool, site, hash));
  } catch (error) {
    console.error("engagement read failed", error);
    return res.status(503).json({ error: "Engagement service is temporarily unavailable." });
  }
});

app.post("/api/engagement/:site/view", async (req, res) => {
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
        `INSERT INTO engagement_views (site, views) VALUES ($1, 1)
         ON CONFLICT (site) DO UPDATE SET views = engagement_views.views + 1`,
        [site],
      );
    }
    return res.json(await readStats(pool, site, hash));
  } catch (error) {
    console.error("engagement view failed", error);
    return res.status(503).json({ error: "The view could not be counted." });
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
    if (!hash) {
      return res.status(400).json({ error: "A browser reaction identifier is required." });
    }
    await client.query("BEGIN");
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

app.get("/badge/:site.svg", async (req, res) => {
  const { site } = req.params;
  if (!allowedSites.has(site)) return res.sendStatus(404);
  if (!pool) return res.sendStatus(503);
  try {
    const { visitors, likes } = await readTotals(pool, site);
    const viewsText = `${Number(visitors).toLocaleString("en-IN")} views`;
    const likeCount = Number(likes);
    const likesText = `${likeCount.toLocaleString("en-IN")} ${likeCount === 1 ? "like" : "likes"}`;
    res.set({
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
    });
    return res.send(`<svg xmlns="http://www.w3.org/2000/svg" width="214" height="30" viewBox="0 0 214 30" role="img" aria-label="${viewsText}, ${likesText}">
      <rect width="214" height="30" rx="6" fill="#11140f"/>
      <circle cx="15" cy="15" r="4" fill="#b8e34f"/>
      <text x="27" y="19" fill="#eef2e8" font-family="Segoe UI,Arial,sans-serif" font-size="12" font-weight="600">${viewsText}</text>
      <path d="M112 9.3c-4-3.5-10 2-6.6 6.5 1.8 2.4 6.6 5.4 6.6 5.4s4.8-3 6.6-5.4c3.4-4.5-2.6-10-6.6-6.5Z" fill="#b8e34f"/>
      <text x="126" y="19" fill="#eef2e8" font-family="Segoe UI,Arial,sans-serif" font-size="12" font-weight="600">${likesText}</text>
    </svg>`);
  } catch (error) {
    console.error("badge render failed", error);
    return res.sendStatus(503);
  }
});

app.use(
  express.static(path.join(__dirname, "dist"), {
    extensions: ["html"],
    maxAge: process.env.NODE_ENV === "production" ? "1h" : 0,
  }),
);

await ensureSchema();
app.listen(port, "0.0.0.0", () => {
  console.log(`Dwij portfolio listening on ${port}`);
});



