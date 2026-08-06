#!/usr/bin/env node

import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";
import pixelmatch from "pixelmatch";
import { PNG } from "pngjs";

const HELP = `
Aexo section-motion regression harness

Usage:
  node scripts/section-motion-regression.mjs --route <path> (--selector <css> | --text <exact text>) [options]

Required:
  --route <path>                 Route path, including an optional query string.
  --selector <css>               Common live/local section or anchor selector.
  --text <exact text>            Common live/local exact-text anchor. Whitespace is normalized.

Anchor and crop overrides:
  --live-selector <css>          Live-only anchor selector.
  --local-selector <css>         Local-only anchor selector.
  --live-text <text>             Live-only exact-text anchor.
  --local-text <text>            Local-only exact-text anchor.
  --capture-selector <css>       Common element to crop after positioning the anchor.
  --live-capture-selector <css>  Live-only crop element.
  --local-capture-selector <css> Local-only crop element.
  --scroll-offset <px>           Anchor offset from viewport top (default: 0).

Motion:
  --times <ms,...>               Checkpoints after anchor positioning (default: 0,100,200,300,500,1000,1300).
  --hover-selector <css>         Capture an additional hover state at every checkpoint.
  --live-hover-selector <css>    Live-only hover target.
  --local-hover-selector <css>   Local-only hover target.
  --hover-wait <ms>              Settle time after hover begins (default: 400).

URLs and output:
  --live-origin <url>            Default: https://aexo.framer.website
  --local-origin <url>           Default: http://localhost:3000
  --query <query>                Query appended to both targets.
  --live-query <query>           Query appended only to live.
  --local-query <query>          Query appended only to local.
  --widths <px,...>              Default: 1200,1440. Viewport height is 900.
  --output <directory>           Default: artifacts/section-motion-regression/<route>.
  --threshold <0..1>             Pixelmatch threshold (default: 0.12).
  --timeout <ms>                 Navigation/readiness timeout (default: 60000).
  --browser <path>               Browser executable; defaults to Edge when installed.

Utility:
  --dry-run                      Validate and print the resolved configuration without launching a browser.
  --help                         Show this help.

Examples:
  node scripts/section-motion-regression.mjs --route / --selector "#benefits" --times 0,250,500
  node scripts/section-motion-regression.mjs --route / --text "BENEFITS" --hover-selector "a[href*='cal.com']"
  node scripts/section-motion-regression.mjs --route /pricing --live-text "Pricing" --local-selector "[data-section='pricing']" --local-query "motion=paused&state=revealed"
`.trim();

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) throw new Error(`Unexpected positional argument: ${token}`);
    const [rawKey, inlineValue] = token.slice(2).split(/=(.*)/s, 2);
    const key = rawKey.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
    if (["help", "dryRun"].includes(key)) {
      result[key] = true;
      continue;
    }
    const value = inlineValue ?? argv[++index];
    if (value === undefined || value.startsWith("--")) throw new Error(`Missing value for --${rawKey}`);
    result[key] = value;
  }
  return result;
}

function listOfNumbers(value, fallback, label) {
  const values = value === undefined ? fallback : String(value).split(",").map((item) => Number(item.trim()));
  if (!values.length || values.some((item) => !Number.isFinite(item) || item < 0)) {
    throw new Error(`${label} must be a comma-separated list of non-negative numbers.`);
  }
  return [...new Set(values)];
}

function normalizeQuery(value) {
  if (!value) return "";
  return String(value).replace(/^[?&]+/, "");
}

function appendQueries(url, ...queries) {
  const target = new URL(url);
  for (const query of queries.map(normalizeQuery).filter(Boolean)) {
    const params = new URLSearchParams(query);
    for (const [key, value] of params) target.searchParams.append(key, value);
  }
  return target.href;
}

function joinOrigin(origin, route) {
  const normalizedOrigin = origin.endsWith("/") ? origin : `${origin}/`;
  return new URL(route.replace(/^\//, ""), normalizedOrigin).href;
}

function slug(value) {
  return value
    .replace(/^\/+|\?.*$/g, "")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase() || "home";
}

function filePath(directory, filename) {
  return resolve(directory, filename);
}

function validate(raw) {
  if (!raw.route) throw new Error("--route is required.");
  const commonAnchor = raw.selector || raw.text;
  const liveAnchor = raw.liveSelector || raw.liveText || commonAnchor;
  const localAnchor = raw.localSelector || raw.localText || commonAnchor;
  if (!liveAnchor || !localAnchor) {
    throw new Error("Provide --selector/--text, or both live and local anchor overrides.");
  }
  if (raw.selector && raw.text) throw new Error("Use only one of --selector or --text.");
  if (raw.liveSelector && raw.liveText) throw new Error("Use only one live anchor type.");
  if (raw.localSelector && raw.localText) throw new Error("Use only one local anchor type.");

  const timeout = Number(raw.timeout ?? 60_000);
  const hoverWait = Number(raw.hoverWait ?? 400);
  const scrollOffset = Number(raw.scrollOffset ?? 0);
  const threshold = Number(raw.threshold ?? .12);
  if (![timeout, hoverWait, scrollOffset, threshold].every(Number.isFinite)) throw new Error("Numeric options contain an invalid value.");
  if (timeout <= 0 || hoverWait < 0 || threshold < 0 || threshold > 1) throw new Error("Numeric options are outside their valid range.");

  const routeKey = slug(raw.route);
  const output = resolve(raw.output ?? `artifacts/section-motion-regression/${routeKey}`);
  const liveOrigin = raw.liveOrigin ?? "https://aexo.framer.website";
  const localOrigin = raw.localOrigin ?? "http://localhost:3000";
  const commonQuery = normalizeQuery(raw.query);
  const liveUrl = appendQueries(joinOrigin(liveOrigin, raw.route), commonQuery, raw.liveQuery);
  const localUrl = appendQueries(joinOrigin(localOrigin, raw.route), commonQuery, raw.localQuery);
  const defaultEdge = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

  return {
    route: raw.route,
    routeKey,
    liveUrl,
    localUrl,
    widths: listOfNumbers(raw.widths, [1200, 1440], "--widths"),
    times: listOfNumbers(raw.times, [0, 100, 200, 300, 500, 1000, 1300], "--times"),
    viewportHeight: 900,
    anchor: {
      live: raw.liveSelector ? { type: "selector", value: raw.liveSelector }
        : raw.liveText ? { type: "text", value: raw.liveText }
          : raw.selector ? { type: "selector", value: raw.selector }
            : { type: "text", value: raw.text },
      local: raw.localSelector ? { type: "selector", value: raw.localSelector }
        : raw.localText ? { type: "text", value: raw.localText }
          : raw.selector ? { type: "selector", value: raw.selector }
            : { type: "text", value: raw.text },
    },
    captureSelector: {
      live: raw.liveCaptureSelector ?? raw.captureSelector ?? null,
      local: raw.localCaptureSelector ?? raw.captureSelector ?? null,
    },
    hoverSelector: {
      live: raw.liveHoverSelector ?? raw.hoverSelector ?? null,
      local: raw.localHoverSelector ?? raw.hoverSelector ?? null,
    },
    hoverWait,
    scrollOffset,
    threshold,
    timeout,
    output,
    browserExecutable: raw.browser ?? (existsSync(defaultEdge) ? defaultEdge : null),
  };
}

async function hideExternalFramerBadge(page) {
  // This is the only excluded visual. In-design Framer marks and Aexo content remain untouched.
  await page.addStyleTag({
    content: "#__framer-badge-container, #__framer-badge-container__ { display:none!important; visibility:hidden!important; }",
  }).catch(() => undefined);
}

async function waitForAssets(page, timeout, documentBox = null) {
  await page.waitForLoadState("domcontentloaded", { timeout });
  await page.evaluate(async ({ requestedBox, maximumWait }) => {
    const cap = (promise, milliseconds) => Promise.race([
      promise.catch(() => undefined),
      new Promise((resolveWait) => window.setTimeout(resolveWait, milliseconds)),
    ]);
    const intersects = (rect, box) => {
      const top = rect.top + scrollY;
      const left = rect.left + scrollX;
      return left < box.x + box.width && left + rect.width > box.x
        && top < box.y + box.height && top + rect.height > box.y;
    };

    await cap(document.fonts.ready, Math.min(maximumWait, 5_000));
    const images = [...document.images].filter((image) => {
      if (requestedBox) return intersects(image.getBoundingClientRect(), requestedBox);
      if (image.loading !== "lazy") return true;
      const rect = image.getBoundingClientRect();
      return rect.bottom >= -innerHeight && rect.top <= innerHeight * 2;
    });

    // A section crop may include images that remain far below the viewport.
    // Promote only images inside that crop instead of waiting on every lazy
    // image on a long Framer page.
    if (requestedBox) images.forEach((image) => { image.loading = "eager"; });
    const settleImage = (image) => {
      if (image.complete) return image.decode?.().catch(() => undefined) ?? Promise.resolve();
      return new Promise((resolveImage) => {
        const finish = () => resolveImage();
        image.addEventListener("load", finish, { once: true });
        image.addEventListener("error", finish, { once: true });
      });
    };
    await cap(Promise.all(images.map((image) => cap(settleImage(image), 3_000))), Math.min(maximumWait, 8_000));
  }, { requestedBox: documentBox, maximumWait: Math.max(1_000, timeout - 250) });
  await page.evaluate(() => new Promise((resolveFrame) => requestAnimationFrame(() => requestAnimationFrame(resolveFrame))));
}

async function resolveElement(page, anchor, captureSelector) {
  const result = await page.evaluate(({ requestedAnchor, requestedCapture }) => {
    const normalized = (value) => value.replace(/\s+/g, " ").trim();
    let anchorElement;
    if (requestedAnchor.type === "selector") {
      anchorElement = document.querySelector(requestedAnchor.value);
    } else {
      const expected = normalized(requestedAnchor.value);
      const matches = [...document.querySelectorAll("body *")].filter((element) => {
        if (["SCRIPT", "STYLE", "NOSCRIPT"].includes(element.tagName)) return false;
        return normalized(element.textContent ?? "") === expected;
      });
      anchorElement = matches.sort((left, right) => left.children.length - right.children.length)[0];
    }
    if (!(anchorElement instanceof HTMLElement)) return null;

    let captureElement = requestedCapture ? document.querySelector(requestedCapture) : null;
    if (!(captureElement instanceof HTMLElement)) {
      captureElement = anchorElement.closest("section, [data-section], [data-framer-name^='Section-'], [data-framer-name^='Section']") ?? anchorElement;
    }
    if (!(captureElement instanceof HTMLElement)) return null;

    const anchorRect = anchorElement.getBoundingClientRect();
    const captureRect = captureElement.getBoundingClientRect();
    return {
      anchor: {
        x: anchorRect.x + scrollX,
        y: anchorRect.y + scrollY,
        width: anchorRect.width,
        height: anchorRect.height,
        tag: anchorElement.tagName,
        text: normalized(anchorElement.textContent ?? "").slice(0, 160),
      },
      capture: {
        x: captureRect.x + scrollX,
        y: captureRect.y + scrollY,
        width: captureRect.width,
        height: captureRect.height,
        tag: captureElement.tagName,
        name: captureElement.getAttribute("data-section") ?? captureElement.getAttribute("data-framer-name") ?? captureElement.id ?? null,
      },
    };
  }, { requestedAnchor: anchor, requestedCapture: captureSelector });
  if (!result) throw new Error(`Could not resolve ${anchor.type} anchor: ${anchor.value}`);
  return result;
}

async function setScrollAndWait(page, target, offset, timeout) {
  const targetY = Math.max(0, target.anchor.y - offset);
  await page.evaluate((y) => {
    document.documentElement.style.scrollBehavior = "auto";
    document.body.style.scrollBehavior = "auto";
    window.scrollTo(0, y);
  }, targetY);
  await page.waitForFunction(({ expected, tolerance }) => Math.abs(window.scrollY - expected) <= tolerance, {
    expected: targetY,
    tolerance: 1,
  }, { timeout }).catch(() => undefined);
  await page.evaluate(() => new Promise((resolveStable) => {
    let previous = window.scrollY;
    let stableFrames = 0;
    const check = () => {
      const current = window.scrollY;
      stableFrames = Math.abs(current - previous) < .1 ? stableFrames + 1 : 0;
      previous = current;
      if (stableFrames >= 3) resolveStable();
      else requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  }));
  return page.evaluate(() => window.scrollY);
}

async function preparePage(page, url, anchor, captureSelector, scrollOffset, timeout, live) {
  await page.goto(url, { waitUntil: "domcontentloaded", timeout });
  await waitForAssets(page, timeout);
  if (live) await hideExternalFramerBadge(page);
  const beforeScroll = await resolveElement(page, anchor, captureSelector);
  const scrollY = await setScrollAndWait(page, beforeScroll, scrollOffset, timeout);
  let positioned = await resolveElement(page, anchor, captureSelector);
  await waitForAssets(page, timeout, positioned.capture);
  positioned = await resolveElement(page, anchor, captureSelector);
  return { ...positioned, scrollY, readyAt: Date.now() };
}

async function boundedClip(page, box) {
  const bounds = await page.evaluate(() => ({
    width: Math.max(document.documentElement.scrollWidth, document.body?.scrollWidth ?? 0, innerWidth),
    height: Math.max(document.documentElement.scrollHeight, document.body?.scrollHeight ?? 0, innerHeight),
    scrollX,
    scrollY,
  }));
  // Chromium clips against the screenshot surface rooted at the current
  // scroll position. Convert document coordinates to that surface before
  // clamping so deep sections never point outside the resulting bitmap.
  const relativeX = box.x - bounds.scrollX;
  const relativeY = box.y - bounds.scrollY;
  const surfaceWidth = Math.max(1, bounds.width - bounds.scrollX);
  const surfaceHeight = Math.max(1, bounds.height - bounds.scrollY);
  const x = Math.min(Math.max(0, Math.floor(relativeX)), surfaceWidth - 1);
  const y = Math.min(Math.max(0, Math.floor(relativeY)), surfaceHeight - 1);
  const right = Math.min(surfaceWidth, Math.max(x + 1, Math.ceil(relativeX + box.width)));
  const bottom = Math.min(surfaceHeight, Math.max(y + 1, Math.ceil(relativeY + box.height)));
  return { x, y, width: right - x, height: bottom - y };
}

async function captureSection(page, geometry) {
  const clip = await boundedClip(page, geometry.capture);
  try {
    return await page.screenshot({
      animations: "allow",
      captureBeyondViewport: true,
      clip,
      type: "png",
    });
  } catch (error) {
    throw new Error(`Section capture failed for clip ${JSON.stringify(clip)} from ${JSON.stringify(geometry.capture)}: ${error instanceof Error ? error.message : String(error)}`);
  }
}

function blit(source, target) {
  for (let y = 0; y < source.height; y += 1) {
    const sourceStart = y * source.width * 4;
    const targetStart = y * target.width * 4;
    source.data.copy(target.data, targetStart, sourceStart, sourceStart + source.width * 4);
  }
}

async function compareAndWrite(referenceBuffer, localBuffer, paths, threshold) {
  const rawReference = PNG.sync.read(referenceBuffer);
  const rawLocal = PNG.sync.read(localBuffer);
  const width = Math.max(rawReference.width, rawLocal.width);
  const height = Math.max(rawReference.height, rawLocal.height);
  const reference = new PNG({ width, height });
  const local = new PNG({ width, height });
  blit(rawReference, reference);
  blit(rawLocal, local);
  const diff = new PNG({ width, height });
  const mismatchPixels = pixelmatch(reference.data, local.data, diff.data, width, height, { threshold, alpha: .55 });
  await Promise.all([
    writeFile(paths.reference, PNG.sync.write(reference)),
    writeFile(paths.local, PNG.sync.write(local)),
    writeFile(paths.diff, PNG.sync.write(diff)),
  ]);
  return {
    width,
    height,
    referenceSize: { width: rawReference.width, height: rawReference.height },
    localSize: { width: rawLocal.width, height: rawLocal.height },
    mismatchPixels,
    mismatchPercent: Number((mismatchPixels / (width * height) * 100).toFixed(4)),
  };
}

function outputPaths(config, width, time, state) {
  const stem = `${config.routeKey}-${width}-t${time}-${state}`;
  return {
    reference: filePath(config.output, `${stem}-reference.png`),
    local: filePath(config.output, `${stem}-local.png`),
    diff: filePath(config.output, `${stem}-diff.png`),
  };
}

async function hover(page, selector, timeout) {
  if (!selector) return;
  const target = page.locator(selector).first();
  await target.waitFor({ state: "visible", timeout });
  await target.hover({ timeout });
}

async function run(config) {
  await mkdir(config.output, { recursive: true });
  const launchOptions = { headless: true };
  if (config.browserExecutable) launchOptions.executablePath = config.browserExecutable;
  const browser = await chromium.launch(launchOptions);
  const report = {
    generatedAt: new Date().toISOString(),
    config: {
      ...config,
      output: config.output,
    },
    captures: [],
  };

  try {
    for (const width of config.widths) {
      for (const time of config.times) {
        const context = await browser.newContext({
          viewport: { width, height: config.viewportHeight },
          deviceScaleFactor: 1,
          reducedMotion: "no-preference",
          colorScheme: "dark",
        });
        const livePage = await context.newPage();
        const localPage = await context.newPage();
        const [liveGeometry, localGeometry] = await Promise.all([
          preparePage(livePage, config.liveUrl, config.anchor.live, config.captureSelector.live, config.scrollOffset, config.timeout, true),
          preparePage(localPage, config.localUrl, config.anchor.local, config.captureSelector.local, config.scrollOffset, config.timeout, false),
        ]);

        const checkpointStart = Date.now();
        if (time > 0) await Promise.all([livePage.waitForTimeout(time), localPage.waitForTimeout(time)]);

        for (const state of ["rest", ...(config.hoverSelector.live && config.hoverSelector.local ? ["hover"] : [])]) {
          if (state === "hover") {
            await Promise.all([
              hover(livePage, config.hoverSelector.live, config.timeout),
              hover(localPage, config.hoverSelector.local, config.timeout),
            ]);
            if (config.hoverWait) await Promise.all([
              livePage.waitForTimeout(config.hoverWait),
              localPage.waitForTimeout(config.hoverWait),
            ]);
          }

          const paths = outputPaths(config, width, time, state);
          const [liveCurrentGeometry, localCurrentGeometry] = await Promise.all([
            resolveElement(livePage, config.anchor.live, config.captureSelector.live),
            resolveElement(localPage, config.anchor.local, config.captureSelector.local),
          ]);
          const [referenceBuffer, localBuffer] = await Promise.all([
            captureSection(livePage, liveCurrentGeometry),
            captureSection(localPage, localCurrentGeometry),
          ]);
          const comparison = await compareAndWrite(referenceBuffer, localBuffer, paths, config.threshold);
          const entry = {
            route: config.route,
            width,
            viewportHeight: config.viewportHeight,
            checkpointMilliseconds: time,
            state,
            elapsedMilliseconds: Date.now() - checkpointStart,
            live: { ...liveGeometry, capture: liveCurrentGeometry.capture },
            local: { ...localGeometry, capture: localCurrentGeometry.capture },
            ...comparison,
            files: paths,
          };
          report.captures.push(entry);
          console.log(`${width}px t=${time}ms ${state}: ${comparison.mismatchPercent.toFixed(4)}% (${comparison.mismatchPixels} pixels)`);
        }
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }

  const reportPath = filePath(config.output, "report.json");
  await writeFile(reportPath, JSON.stringify(report, null, 2));
  console.log(`Report: ${reportPath}`);
}

let raw;
try {
  raw = parseArgs(process.argv.slice(2));
  if (raw.help) {
    console.log(HELP);
    process.exit(0);
  }
  const config = validate(raw);
  if (raw.dryRun) {
    console.log(JSON.stringify(config, null, 2));
    process.exit(0);
  }
  await run(config);
} catch (error) {
  console.error(`section-motion-regression: ${error instanceof Error ? error.message : String(error)}`);
  console.error("Run with --help for usage.");
  process.exitCode = 1;
}
