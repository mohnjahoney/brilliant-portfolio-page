// Grabs one still frame from each web clip in public/assets/videos-web/ and
// writes it to public/assets/posters/<name>.jpg for use as the <video> poster.
//
// Frame choice: POSTER_AT (fraction of the clip, default 0.4) unless crops.json
// gives a clip a `posterAt` in seconds.
//
// Usage: node scripts/make-posters.mjs [clip-path ...]
//   e.g. node scripts/make-posters.mjs featured/pythagorean-theorem.mp4
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const videoDir = join(root, "public/assets/videos-web");
const posterDir = join(root, "public/assets/posters");
const crops = JSON.parse(readFileSync(join(root, "scripts/crops.json"), "utf8"));

const FRACTION = Number(process.env.POSTER_AT ?? 0.4);
const MAX_WIDTH = 800;
const only = process.argv.slice(2);

mkdirSync(posterDir, { recursive: true });

for (const [outPath, { posterAt }] of Object.entries(crops)) {
  if (only.length && !only.includes(outPath)) continue;

  const video = join(videoDir, outPath);
  const duration = Number(
    execFileSync("ffprobe", [
      "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", video,
    ]).toString(),
  );
  const time = posterAt ?? duration * FRACTION;
  const poster = join(posterDir, `${basename(outPath, ".mp4")}.jpg`);
  console.log(`${outPath} @ ${time.toFixed(2)}s -> ${basename(poster)}`);

  execFileSync("ffmpeg", [
    "-nostdin", "-y", "-loglevel", "error",
    "-ss", String(time), "-i", video,
    "-frames:v", "1",
    "-vf", `scale=w='min(${MAX_WIDTH},iw)':h=-2`,
    "-q:v", "3",
    poster,
  ]);
}
