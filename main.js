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
