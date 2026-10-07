import {
  brilliantPage,
  featuredClips,
  supportingClips,
} from "./brilliant-clips.js";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
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

// Clips play once on load and stop. While hovered or focused they loop; click
// (or Enter/Space) pauses and resumes, and a manual pause survives hover.
function setUpPlayback(target, video, title) {
  let userPaused = false;

  target.tabIndex = 0;
  target.setAttribute("role", "button");
  target.setAttribute("aria-label", `Play or pause: ${title}`);

  const engage = () => {
    video.loop = true;
    if (!userPaused) video.play().catch(() => {});
  };
  const release = () => {
    video.loop = false;
  };
  const toggle = () => {
    if (video.paused || video.ended) {
      userPaused = false;
      video.play().catch(() => {});
    } else {
      userPaused = true;
      video.pause();
    }
  };

  target.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") engage();
  });
  target.addEventListener("pointerleave", (event) => {
    if (event.pointerType === "mouse" && document.activeElement !== target) release();
  });
  target.addEventListener("focus", () => {
    if (target.matches(":focus-visible")) engage();
  });
  target.addEventListener("blur", release);
  target.addEventListener("click", toggle);
  target.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
  });
}

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
  video.loop = false;
  video.autoplay = !prefersReducedMotion.matches;
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
  setUpPlayback(mediaWrap, video, clip.title);
  body.append(heading, caption);
  article.append(mediaWrap, body);

  return article;
}
