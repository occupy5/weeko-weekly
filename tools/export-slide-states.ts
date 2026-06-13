#!/usr/bin/env bun

import { type ChildProcessWithoutNullStreams, spawn } from 'node:child_process';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import net from 'node:net';
import path from 'node:path';
import { chromium, type Page } from 'playwright-chromium';

interface Args {
	entry: string;
	out: string;
	episode?: string;
	range?: string;
	port: number;
	width: number;
	height: number;
	wait: number;
	clean: boolean;
	executablePath?: string;
}

interface SlideState {
	index: number;
	slide: number;
	click: number;
	clicksTotal: number;
	filename: string;
	path: string;
	url: string;
}

interface SlidevRuntime {
	nav: {
		clicksTotal?: number;
		slides: Array<{
			meta?: {
				__clicksContext?: {
					total?: number;
				};
			};
		}>;
	};
}

type SlidevWindow = Window & {
	__slidev__?: SlidevRuntime;
};

const PROJECT_ROOT = path.resolve(import.meta.dir, '..');
const DEFAULT_CHROME_PATH = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

function parseArgs(argv: string[]): Args {
	const args: Args = {
		entry: 'slides.md',
		out: '',
		port: 3037,
		width: 1920,
		height: 1080,
		wait: 300,
		clean: false,
	};

	for (let i = 0; i < argv.length; i += 1) {
		const arg = argv[i];
		const next = argv[i + 1];

		if (arg === '--entry' && next) {
			args.entry = next;
			i += 1;
		} else if ((arg === '--out' || arg === '-o') && next) {
			args.out = next;
			i += 1;
		} else if ((arg === '--episode' || arg === '-e') && next) {
			args.episode = next;
			i += 1;
		} else if (arg === '--range' && next) {
			args.range = next;
			i += 1;
		} else if (arg === '--port' && next) {
			args.port = Number(next);
			i += 1;
		} else if (arg === '--width' && next) {
			args.width = Number(next);
			i += 1;
		} else if (arg === '--height' && next) {
			args.height = Number(next);
			i += 1;
		} else if (arg === '--wait' && next) {
			args.wait = Number(next);
			i += 1;
		} else if (arg === '--executable-path' && next) {
			args.executablePath = next;
			i += 1;
		} else if (arg === '--clean') {
			args.clean = true;
		} else if (arg === '--help' || arg === '-h') {
			printHelp();
			process.exit(0);
		} else {
			throw new Error(`Unknown argument: ${arg}`);
		}
	}

	if (!Number.isFinite(args.port) || args.port <= 0)
		throw new Error('--port must be a positive number');
	if (!Number.isFinite(args.width) || args.width <= 0)
		throw new Error('--width must be a positive number');
	if (!Number.isFinite(args.height) || args.height <= 0)
		throw new Error('--height must be a positive number');
	if (!Number.isFinite(args.wait) || args.wait < 0)
		throw new Error('--wait must be a non-negative number');

	return args;
}

function printHelp() {
	log(`Export Slidev slide/click states as PNG files.

Usage:
  bun tools/export-slide-states.ts [options]

Options:
  -e, --episode <name>        Episode name. Defaults to slides.md src target.
  -o, --out <dir>             Output directory. Defaults to weekly/<episode>/video/slide-states.
      --entry <file>          Slidev entry file. Default: slides.md.
      --range <range>         Slide range, e.g. 1-4,7,10-12.
      --port <number>         Preferred Slidev port. Default: 3037.
      --width <number>        Screenshot viewport width. Default: 1920.
      --height <number>       Screenshot viewport height. Default: 1080.
      --wait <ms>             Extra wait after navigation. Default: 300.
      --clean                 Remove existing files in the output directory first.
      --executable-path <bin> Browser executable path.
`);
}

function log(message: string) {
	process.stdout.write(`${message}\n`);
}

function logError(error: unknown) {
	const message = error instanceof Error ? error.stack || error.message : String(error);
	process.stderr.write(`${message}\n`);
}

async function findCurrentEpisode(entry: string): Promise<string> {
	const content = await readFile(entry, 'utf-8');
	const match = content.match(/src:\s*\.\/weekly\/(.+?)\/slides\.md/);
	if (!match) throw new Error('Cannot infer episode from slides.md. Pass --episode.');
	return match[1];
}

function parseRange(total: number, raw?: string): number[] {
	if (!raw) return Array.from({ length: total }, (_, index) => index + 1);

	const result = new Set<number>();
	for (const part of raw.split(',')) {
		const trimmed = part.trim();
		if (!trimmed) continue;

		const range = trimmed.match(/^(\d+)-(\d+)$/);
		if (range) {
			const start = Number(range[1]);
			const end = Number(range[2]);
			if (start > end) throw new Error(`Invalid range segment: ${trimmed}`);
			for (let no = start; no <= end; no += 1) result.add(no);
			continue;
		}

		const single = Number(trimmed);
		if (!Number.isInteger(single)) throw new Error(`Invalid range segment: ${trimmed}`);
		result.add(single);
	}

	const pages = [...result].sort((a, b) => a - b);
	for (const page of pages) {
		if (page < 1 || page > total) throw new Error(`Slide ${page} is outside 1-${total}`);
	}
	return pages;
}

async function findFreePort(preferred: number): Promise<number> {
	for (let port = preferred; port < preferred + 50; port += 1) {
		if (await isPortFree(port)) return port;
	}
	throw new Error(`No free port found from ${preferred} to ${preferred + 49}`);
}

function isPortFree(port: number): Promise<boolean> {
	return new Promise((resolve) => {
		const server = net.createServer();
		server.once('error', () => resolve(false));
		server.once('listening', () => {
			server.close(() => resolve(true));
		});
		server.listen(port, '127.0.0.1');
	});
}

async function waitForServer(url: string, timeoutMs = 30_000) {
	const start = Date.now();
	while (Date.now() - start < timeoutMs) {
		try {
			const response = await fetch(url);
			if (response.ok) return;
		} catch {
			// Server is not ready yet.
		}
		await sleep(250);
	}
	throw new Error(`Timed out waiting for Slidev server: ${url}`);
}

function startSlidev(entry: string, port: number): ChildProcessWithoutNullStreams {
	const child = spawn('bunx', ['slidev', entry, '--port', String(port), '--log', 'warn'], {
		cwd: PROJECT_ROOT,
		stdio: ['ignore', 'pipe', 'pipe'],
	});

	child.stdout.on('data', (chunk) => process.stdout.write(chunk));
	child.stderr.on('data', (chunk) => process.stderr.write(chunk));

	return child;
}

async function stopSlidev(child: ChildProcessWithoutNullStreams) {
	if (child.exitCode != null) return;

	child.kill('SIGTERM');
	await Promise.race([
		new Promise<void>((resolve) => child.once('exit', () => resolve())),
		sleep(2_000).then(() => {
			if (child.exitCode == null) child.kill('SIGKILL');
		}),
	]);
}

async function sleep(ms: number) {
	await new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForSlideReady(page: Page, slideNo: number, wait: number) {
	const slide = page.locator(`[data-slidev-no="${slideNo}"]`);
	await slide.waitFor();

	const loading = slide.locator('.slidev-slide-loading');
	for (let i = 0; i < (await loading.count()); i += 1)
		await loading.nth(i).waitFor({ state: 'detached' });

	const waitForElements = slide.locator('[data-waitfor]');
	for (let i = 0; i < (await waitForElements.count()); i += 1) {
		const element = waitForElements.nth(i);
		const selector = await element.getAttribute('data-waitfor');
		if (selector) await element.locator(selector).waitFor({ state: 'visible' });
	}

	await page.evaluate(() => document.fonts?.ready);
	if (wait) await page.waitForTimeout(wait);
}

async function getClicksTotal(page: Page, slideNo: number): Promise<number> {
	return page.evaluate((no: number) => {
		const nav = (window as SlidevWindow).__slidev__?.nav;
		const slide = nav?.slides?.[no - 1];
		return Number(slide?.meta?.__clicksContext?.total ?? nav?.clicksTotal ?? 0);
	}, slideNo);
}

function slideUrl(baseUrl: string, slideNo: number, click: number): string {
	const url = new URL(`${baseUrl}/${slideNo}`);
	if (click > 0) url.searchParams.set('clicks', String(click));
	return url.toString();
}

async function main() {
	const args = parseArgs(process.argv.slice(2));
	args.entry = path.resolve(PROJECT_ROOT, args.entry);
	args.episode = args.episode ?? (await findCurrentEpisode(args.entry));
	args.out = path.resolve(PROJECT_ROOT, args.out || `weekly/${args.episode}/video/slide-states`);

	const port = await findFreePort(args.port);
	const baseUrl = `http://localhost:${port}`;
	const slidev = startSlidev(args.entry, port);

	try {
		await waitForServer(baseUrl);

		if (args.clean) await rm(args.out, { recursive: true, force: true });
		await mkdir(args.out, { recursive: true });

		const browser = await chromium.launch({
			headless: true,
			executablePath: args.executablePath || DEFAULT_CHROME_PATH,
		});
		const page = await browser.newPage({
			viewport: { width: args.width, height: args.height },
			deviceScaleFactor: 1,
		});

		await page.goto(`${baseUrl}/1`, { waitUntil: 'networkidle' });
		await page.waitForSelector('[data-slidev-no="1"]');
		const totalSlides = await page.evaluate(() => {
			const nav = (window as SlidevWindow).__slidev__?.nav;
			if (!nav) throw new Error('Slidev runtime is not available on window.__slidev__');
			return nav.slides.length;
		});
		const slides = parseRange(totalSlides, args.range);

		const states: SlideState[] = [];
		let index = 1;

		for (const slideNo of slides) {
			const initialUrl = slideUrl(baseUrl, slideNo, 0);
			await page.goto(initialUrl, { waitUntil: 'networkidle' });
			await waitForSlideReady(page, slideNo, args.wait);
			const clicksTotal = await getClicksTotal(page, slideNo);

			for (let click = 0; click <= clicksTotal; click += 1) {
				const url = slideUrl(baseUrl, slideNo, click);
				if (click > 0) {
					await page.goto(url, { waitUntil: 'networkidle' });
					await waitForSlideReady(page, slideNo, args.wait);
				}

				const filename = `${String(slideNo).padStart(3, '0')}-${String(click).padStart(2, '0')}.png`;
				const filepath = path.join(args.out, filename);
				await page.screenshot({ path: filepath, fullPage: false });
				states.push({
					index,
					slide: slideNo,
					click,
					clicksTotal,
					filename,
					path: filepath,
					url,
				});
				index += 1;
			}

			log(`Slide ${slideNo}: exported ${clicksTotal + 1} state(s)`);
		}

		await browser.close();

		const manifest = {
			episode: args.episode,
			entry: args.entry,
			generatedAt: new Date().toISOString(),
			width: args.width,
			height: args.height,
			range: args.range ?? null,
			totalSlides,
			totalStates: states.length,
			states,
		};

		const manifestPath = path.join(args.out, 'manifest.json');
		await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf-8');

		const expected = states.reduce(
			(count, state) => count + (state.click === 0 ? state.clicksTotal + 1 : 0),
			0,
		);
		if (expected !== states.length)
			throw new Error(`State count mismatch: expected ${expected}, got ${states.length}`);

		log(`\nExported ${states.length} state(s) to ${args.out}`);
		log(`Manifest: ${manifestPath}`);
	} finally {
		await stopSlidev(slidev);
	}
}

main().catch((error) => {
	logError(error);
	process.exit(1);
});
