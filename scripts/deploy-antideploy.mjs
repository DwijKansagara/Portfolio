import { readFile, rm, stat } from "node:fs/promises";
import { homedir, tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve(import.meta.dirname, "..");
const config = JSON.parse(
  await readFile(path.join(homedir(), ".antideploy", "config.json"), "utf8"),
);
const app = JSON.parse(
  await readFile(path.join(root, ".antideploy.json"), "utf8"),
).applicationId;
const archive = path.join(tmpdir(), "portfolio-engagement.tar.gz");

await rm(archive, { force: true });
const tar = spawnSync(
  "tar.exe",
  [
    "-czf",
    archive,
    "--exclude=.git",
    "--exclude=node_modules",
    "--exclude=dist",
    "--exclude=test-results",
    "--exclude=.vite",
    "--exclude=coverage",
    "--exclude=*.log",
    ".",
  ],
  { cwd: root, stdio: "inherit" },
);
if (tar.status !== 0) process.exit(tar.status ?? 1);

const archiveInfo = await stat(archive);
console.log(`Archive: ${(archiveInfo.size / 1024 / 1024).toFixed(2)} MB`);

const form = new FormData();
form.append(
  "archive",
  new Blob([await readFile(archive)], { type: "application/gzip" }),
  "portfolio.tar.gz",
);
const headers = { Authorization: `Bearer ${config.token}` };
const deploy = await fetch(
  `https://antideploy.com/api/v1/deploy?applicationId=${app}`,
  { method: "POST", headers, body: form },
);
if (!deploy.ok) throw new Error(`Deploy failed: ${deploy.status} ${await deploy.text()}`);
const queued = await deploy.json();
if (queued.status === "unchanged") {
  console.log("No deployment needed: source is unchanged.");
  process.exit(0);
}
console.log(`Deployment queued: ${queued.taskId}`);

let previous = "";
const deadline = Date.now() + 15 * 60 * 1000;
while (Date.now() < deadline) {
  const response = await fetch(
    `https://antideploy.com/api/v1/deployments/${queued.taskId}`,
    { headers },
  );
  if (!response.ok) throw new Error(`Status failed: ${response.status}`);
  const result = await response.json();
  if (result.status !== previous) {
    console.log(`Status: ${result.status}`);
    previous = result.status;
  }
  if (result.status === "succeeded") {
    console.log(JSON.stringify(result, null, 2));
    process.exit(0);
  }
  if (result.status === "failed") {
    console.error(JSON.stringify(result, null, 2));
    process.exit(1);
  }
  await new Promise((resolve) => setTimeout(resolve, 5000));
}
throw new Error(`Deployment ${queued.taskId} did not finish within 15 minutes.`);
