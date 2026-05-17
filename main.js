import {
  brilliantPage,
  featuredClips,
  supportingClips,
} from "./brilliant-clips.js";

const title = document.querySelector("#page-title");
const intro = document.querySelector("#page-intro");
const featuredGrid = document.querySelector(".featured-grid");
const supportingGrid = document.querySelector(".supporting-grid");

title.textContent = brilliantPage.title;
const introParagraphs = Array.isArray(brilliantPage.intro)
  ? brilliantPage.intro
  : [brilliantPage.intro];
intro.replaceChildren(...introParagraphs.map(createParagraph));
document.body.classList.toggle("show-intro-cells", brilliantPage.showIntroCells);
document.body.classList.toggle("show-mask-debug", brilliantPage.showMasks);

featuredGrid.append(...featuredClips.map((clip) => createClipCard(clip, "featured")));
supportingGrid.append(...supportingClips.map((clip) => createClipCard(clip, "supporting")));

function createParagraph(text) {
  const paragraph = document.createElement("p");
  paragraph.textContent = text;
  return paragraph;
}

function createClipCard(clip, variant) {
  const article = document.createElement("article");
  article.className = `clip-card clip-card--${variant}`;

  const mediaWrap = document.createElement("div");
  mediaWrap.className = "clip-card__media";
  applyRendering(mediaWrap, clip.rendering);

  const videoFrame = document.createElement("div");
  videoFrame.className = "clip-card__video-frame";

  const video = document.createElement("video");
  video.src = clip.video;
  video.muted = true;
  video.loop = true;
  video.autoplay = true;
  video.playsInline = true;
  video.preload = "metadata";

  const body = document.createElement("div");
  body.className = "clip-card__body";

  const heading = document.createElement("h3");
  heading.textContent = clip.title;

  const caption = document.createElement("p");
  caption.textContent = clip.caption;

  videoFrame.append(video);
  mediaWrap.append(videoFrame);
  body.append(heading, caption);
  article.append(mediaWrap, body);

  return article;
}

function applyRendering(element, rendering = {}) {
  if (rendering.padding !== undefined) {
    applyInsetProperties(element, "--video-padding", rendering.padding);
  }

  if (rendering.scale) {
    element.style.setProperty("--video-scale", rendering.scale);
  }

  if (rendering.x !== undefined) {
    element.style.setProperty("--video-x", `${rendering.x}%`);
  }

  if (rendering.y !== undefined) {
    element.style.setProperty("--video-y", `${rendering.y}%`);
  }

  if (rendering.mask) {
    applyInsetProperties(element, "--mask", rendering.mask);
  }

  element.classList.toggle("clip-card__media--has-mask", Boolean(rendering.mask));
}

function applyInsetProperties(element, prefix, value) {
  if (typeof value === "number") {
    element.style.setProperty(`${prefix}-top`, `${value}%`);
    element.style.setProperty(`${prefix}-right`, `${value}%`);
    element.style.setProperty(`${prefix}-bottom`, `${value}%`);
    element.style.setProperty(`${prefix}-left`, `${value}%`);
    return;
  }

  element.style.setProperty(`${prefix}-top`, `${value.top ?? 0}%`);
  element.style.setProperty(`${prefix}-right`, `${value.right ?? 0}%`);
  element.style.setProperty(`${prefix}-bottom`, `${value.bottom ?? 0}%`);
  element.style.setProperty(`${prefix}-left`, `${value.left ?? 0}%`);
}
