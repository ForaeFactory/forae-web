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
 * og:     1200x630 JPEG share images (public/images/og/), the raster logo and apple-icon.png.
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
  for (const { slug, visuals } of projects) {
    const out = join(outDir, `${slug}.jpg`);
    await sharp(join("public", visuals.hero))
      .resize(1200, 630, { fit: "cover" })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(out);
    console.log(`og  ${out}  ${mb(statSync(out).size)}`);
  }

  // Home page share image: the hero rock, darkened, with the studio name.
  const title = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#050505" fill-opacity="0.55"/>
    <text x="80" y="330" font-family="Arial, Helvetica, sans-serif" font-size="104" font-weight="700" fill="#FAFAFA" letter-spacing="-2">FORAE FACTORY</text>
    <text x="84" y="400" font-family="Georgia, serif" font-size="40" fill="#C6A848">Digital products for the bold</text>
    <text x="84" y="550" font-family="Arial, Helvetica, sans-serif" font-size="24" fill="#FAFAFA" fill-opacity="0.7" letter-spacing="4">CREATIVE STUDIO · AUSTIN, TEXAS</text>
  </svg>`;
  const home = join(outDir, "home.jpg");
  const rock = await sharp(join("public", "images", "hero", "layers", "rock-main.webp"))
    .resize({ height: 630 })
    .toBuffer();
  await sharp({ create: { width: 1200, height: 630, channels: 3, background: "#050505" } })
    .composite([{ input: rock, left: 420, top: 0 }, { input: Buffer.from(title) }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(home);
  console.log(`og  ${home}  ${mb(statSync(home).size)}`);

  // Raster logo for structured data and the Apple touch icon.
  const logo = join("public", "images", "logo", "FF_Logo_gld.svg");
  const logoPng = join("public", "images", "logo", "forae-logo-512.png");
  await sharp(logo, { density: 600 }).resize(512, 512, { fit: "contain", background: "#050505" }).flatten({ background: "#050505" }).png().toFile(logoPng);
  const touchIcon = join("src", "app", "apple-icon.png");
  const mark = await sharp(logo, { density: 600 }).resize(128, 128, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  await sharp({ create: { width: 180, height: 180, channels: 4, background: "#050505" } })
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toFile(touchIcon);
  console.log(`icons  ${logoPng}, ${touchIcon}`);
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
