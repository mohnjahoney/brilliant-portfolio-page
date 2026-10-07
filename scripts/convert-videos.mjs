// Crops and encodes the raw screen recordings in source-videos/ into the
// web-ready clips in public/assets/videos-web/, using scripts/crops.json.
//
// crops.json maps each output path (relative to videos-web/) to its source
// file and the pixels to trim from each edge of the source recording.
//
// Usage: node scripts/convert-videos.mjs [clip-path ...]
//   e.g. node scripts/convert-videos.mjs spoofify-light.mp4
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const inputDir = process.env.INPUT_DIR ?? join(root, "source-videos");
const outputDir = process.env.OUTPUT_DIR ?? join(root, "public/assets/videos-web");
const crops = JSON.parse(readFileSync(join(root, "scripts/crops.json"), "utf8"));

const PRESET = process.env.PRESET ?? "slow";
const SUPPORTING = { maxWidth: 960, crf: 25 };
const FEATURED = { maxWidth: 1600, crf: 19 };

const even = (n) => n - (n % 2);
const only = process.argv.slice(2);

for (const [outPath, { source, size, crop }] of Object.entries(crops)) {
  if (only.length && !only.includes(outPath)) continue;

  const [w, h] = size.split("x").map(Number);
  const { maxWidth, crf } = outPath.startsWith("featured/") ? FEATURED : SUPPORTING;
  // yuv420p needs even dimensions, so round the crop box down to even values.
  const cw = even(w - crop.left - crop.right);
  const ch = even(h - crop.top - crop.bottom);
  const filter = [
    `crop=${cw}:${ch}:${even(crop.left)}:${even(crop.top)}`,
    `scale=w='min(${maxWidth},iw)':h=-2`,
  ].join(",");

  const output = join(outputDir, outPath);
  mkdirSync(dirname(output), { recursive: true });
  console.log(`${source} -> ${outPath} (${cw}x${ch})`);

  execFileSync(
    "ffmpeg",
    [
      "-nostdin", "-y", "-loglevel", "error",
      "-i", join(inputDir, source),
      "-vf", filter,
      "-c:v", "libx264", "-preset", PRESET, "-crf", String(crf),
      "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-an",
      output,
    ],
    { stdio: "inherit" },
  );
}
