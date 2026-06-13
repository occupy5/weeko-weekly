import { createHash } from "crypto";
import { config as loadEnv } from "dotenv";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join, relative } from "path";
import { fileURLToPath } from "url";

type AssetManifestEntry = {
  path: string;
  sha256: string;
  bytes: number;
};

type AgentRunLog = {
  model: string;
  publication?: {
    title?: string;
    summary?: string;
  };
  workflow: unknown[];
  metrics: Record<string, number>;
};

const currentFilePath = fileURLToPath(import.meta.url);
const hardhatRoot = join(dirname(currentFilePath), "..");
const repoRoot = join(hardhatRoot, "..", "..", "..");
loadEnv({ path: join(hardhatRoot, ".env"), quiet: true });

const currentEpisodeRoot = join(repoRoot, "weekly", "_current");
const outputRoot = join(repoRoot, "dapp", "publications", "latest");
const dappProofPath = join(repoRoot, "dapp", "packages", "nextjs", "public", "weeko-proof.json");
const agentRunPath = join(currentEpisodeRoot, "agent-run.json");

const creator = process.env.CREATOR_ADDRESS || "0x0000000000000000000000000000000000000000";
const runLogURI = process.env.RUN_LOG_URI || "ipfs://replace-with-run-log-cid";

if (!existsSync(agentRunPath)) {
  throw new Error(`Agent run log not found at ${agentRunPath}`);
}

const serializedRunLog = readFileSync(agentRunPath, "utf8");
const runLog = JSON.parse(serializedRunLog) as AgentRunLog;
const title = process.env.PUBLICATION_TITLE || runLog.publication?.title || "Untitled Weeko publication";
const summary =
  process.env.PUBLICATION_SUMMARY || runLog.publication?.summary || "A Weeko issue packaged with its Agent run log.";

const assetCandidates = ["source.md", "slides.md", "script.md", "README.md", "agent-run.json"];

const hashFile = (path: string) => {
  const data = readFileSync(path);
  return {
    sha256: createHash("sha256").update(data).digest("hex"),
    bytes: data.byteLength,
  };
};

const assets = assetCandidates
  .map(fileName => join(currentEpisodeRoot, fileName))
  .filter(path => existsSync(path))
  .map(path => {
    const hash = hashFile(path);
    return {
      path: relative(repoRoot, path),
      ...hash,
    } satisfies AssetManifestEntry;
  });

if (assets.length === 0) {
  throw new Error(`No publication assets found in ${currentEpisodeRoot}`);
}

mkdirSync(outputRoot, { recursive: true });

const generatedAt = new Date().toISOString();

const runLogPath = join(outputRoot, "run-log.json");
const workflowHash = `0x${createHash("sha256").update(serializedRunLog).digest("hex")}`;
writeFileSync(runLogPath, serializedRunLog);

const publication = {
  schema: "weeko-publication@0.2.0",
  title,
  creator,
  summary,
  createdAt: generatedAt,
  assets,
  agent: {
    model: runLog.model,
    runLog: runLogURI,
    workflowHash,
    workflow: runLog.workflow,
    metrics: {
      ...runLog.metrics,
      assetCount: assets.length,
    },
  },
};

const publicationPath = join(outputRoot, "publication.json");
const serializedPublication = `${JSON.stringify(publication, null, 2)}\n`;
writeFileSync(publicationPath, serializedPublication);
writeFileSync(dappProofPath, serializedPublication);

console.log(`Publication manifest written to ${relative(repoRoot, publicationPath)}`);
console.log(`Run log written to ${relative(repoRoot, runLogPath)}`);
console.log(`DApp proof snapshot written to ${relative(repoRoot, dappProofPath)}`);
console.log(`Workflow hash: ${workflowHash}`);
