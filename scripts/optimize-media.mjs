#!/usr/bin/env node
/**
 * Re-encode source media for the web.
 *
 *   node scripts/optimize-media.mjs images <file-or-dir>... [--replace]
 *   node scripts/optimize-media.mjs videos <file-or-dir>... [--replace]
 *   node scripts/optimize-media.mjs og
 *
 * images: PNG/JPG -> WebP, longest edge capped at 2400 px, alpha kept.
 * videos: MP4/MOV -> silent H.264 MP4, 1280 px wide, ~2.5 Mbps cap, faststart.
 * og:     1200x630 JPEG share images from each project's hero (public/images/og/).
 *
 * Without --replace the output is written next to the source as *.opt.*;
 * with --replace the source is deleted and the output takes its place
 * (images change extension to .webp, so update the paths in src/data/content.ts).
 */
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, renameSync, statSync, unlinkSync, mkdirSync } from "node:fs";
import { extname, join, basename, dirname } from "node:path";
import sharp from "sharp";
import ffmpegPath from "ffmpeg-static";

const MAX_EDGE = 2400;
const WEBP_QUALITY = 80;
const VIDEO_WIDTH = 1280;

const [mode, ...rest] = process.argv.slice(2);
const replace = rest.includes("--replace");
const targets = rest.filter((arg) => !arg.startsWith("--"));

const IMAGE_EXT = new Set([".png", ".jpg", ".jpeg"]);
const VIDEO_EXT = new Set([".mp4", ".mov"]);

function collect(paths, extensions) {
  const files = [];
  for (const path of paths) {
    if (!existsSync(path)) continue;
    if (statSync(path).isDirectory()) {
      for (const entry of readdirSync(path)) files.push(...collect([join(path, entry)], extensions));
    } else if (extensions.has(extname(path).toLowerCase()) && !path.includes(".opt.")) {
      files.push(path);
    }
  }
  return files;
}

const mb = (bytes) => `${(bytes / 1e6).toFixed(2)} MB`;

async function optimizeImage(file) {
  const out = file.replace(/\.(png|jpe?g)$/i, replace ? ".webp" : ".opt.webp");
  await sharp(file)
    .resize({ width: MAX_EDGE, height: MAX_EDGE, fit: "inside", withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY, alphaQuality: 90, effort: 6, smartSubsample: true })
    .toFile(out);
  const before = statSync(file).size;
  const after = statSync(out).size;
  if (replace) unlinkSync(file);
  return [before, after, out];
}

function optimizeVideo(file) {
  const tmp = file.replace(/\.(mp4|mov)$/i, ".opt.mp4");
  execFileSync(ffmpegPath, [
    "-y", "-loglevel", "error", "-i", file,
    "-vf", `scale='min(${VIDEO_WIDTH},iw)':-2`,
    "-c:v", "libx264", "-preset", "slow", "-crf", "27",
    "-maxrate", "2500k", "-bufsize", "5000k",
    "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an",
    tmp,
  ]);
  const before = statSync(file).size;
  const after = statSync(tmp).size;
  let out = tmp;
  if (replace) {
    out = file.replace(/\.mov$/i, ".mp4");
    unlinkSync(file);
    renameSync(tmp, out);
  }
  return [before, after, out];
}

async function makeOgImages() {
  // Node 22.18+ strips TypeScript types on import, so the content file can be read directly.
  const { projects } = await import("../src/data/content.ts");
  const outDir = join("public", "images", "og");
  mkdirSync(outDir, { recursive: true });
  for (const { slug, hero } of projects) {
    const out = join(outDir, `${slug}.jpg`);
    await sharp(join("public", hero))
      .resize(1200, 630, { fit: "cover", position: "attention" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(out);
    console.log(`og  ${out}  ${mb(statSync(out).size)}`);
  }
}

async function main() {
  if (mode === "og") return makeOgImages();
  if (!["images", "videos"].includes(mode) || targets.length === 0) {
    console.error("Usage: node scripts/optimize-media.mjs <images|videos> <file-or-dir>... [--replace] | og");
    process.exit(1);
  }
  const files = collect(targets, mode === "images" ? IMAGE_EXT : VIDEO_EXT);
  let totalBefore = 0;
  let totalAfter = 0;
  for (const file of files) {
    const [before, after, out] = mode === "images" ? await optimizeImage(file) : optimizeVideo(file);
    totalBefore += before;
    totalAfter += after;
    console.log(`${basename(dirname(out))}/${basename(out)}  ${mb(before)} -> ${mb(after)}`);
  }
  console.log(`\n${files.length} files: ${mb(totalBefore)} -> ${mb(totalAfter)}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
