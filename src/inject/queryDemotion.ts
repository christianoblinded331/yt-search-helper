import type { UserPreferences } from "../shared/contracts";

const STYLE_TAG_ID = "sfa-query-demotion-style";
const MARK_HANDLED = "sfa-handled-query";
const CLASS_SOFT = "sfa-soft-match";

function ensureDemotionStyles(): void {
  if (document.getElementById(STYLE_TAG_ID)) {
    return;
  }
  const style = document.createElement("style");
  style.id = STYLE_TAG_ID;
  style.textContent = `
    .${CLASS_SOFT} { opacity: 0.5; filter: grayscale(100%); transition: opacity 0.2s ease, filter 0.2s ease; }
    .${CLASS_SOFT} .metadata-snippet-container,
    .${CLASS_SOFT} #description-text { display: none !important; }
    .${CLASS_SOFT}:hover { opacity: 1; filter: none; }
    .${CLASS_SOFT}:hover .metadata-snippet-container,
    .${CLASS_SOFT}:hover #description-text { display: block !important; }
  `;
  document.head.appendChild(style);
}

const STOP_WORDS = new Set([
  "a",
  "an",
  "the",
  "is",
  "are",
  "of",
  "in",
  "on",
  "at",
  "for",
  "with",
  "by",
  "and",
  "or",
]);

function tokensFromSearchQuery(raw: string | null): string[] {
  if (!raw) {
    return [];
  }
  return raw
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

export function applyQueryTermDemotion(prefs: UserPreferences): void {
  if (!location.pathname.startsWith("/results")) {
    return;
  }

  if (!prefs.enabled || !prefs.demoteTitlesWithoutQueryTerms) {
    for (const video of document.querySelectorAll("ytd-video-renderer")) {
      video.classList.remove(MARK_HANDLED);
      video.querySelector("#dismissible")?.classList.remove(CLASS_SOFT);
    }
    return;
  }

  ensureDemotionStyles();
  const params = new URLSearchParams(window.location.search);
  const searchQuery = params.get("search_query");
  const keywords = tokensFromSearchQuery(searchQuery);
  if (keywords.length === 0) {
    return;
  }

  const videos = document.querySelectorAll(
    `ytd-video-renderer:not(.${MARK_HANDLED})`,
  );
  for (const video of videos) {
    video.classList.add(MARK_HANDLED);
    const shell = video.querySelector("#dismissible");
    const titleEl = video.querySelector("#video-title");
    if (!shell || !titleEl) {
      continue;
    }
    const titleText = titleEl.textContent?.toLowerCase() ?? "";
    const desc = video.querySelector(".metadata-snippet-text");
    const descText = desc?.textContent?.toLowerCase() ?? "";

    const hasMatch = keywords.some(
      (kw) => titleText.includes(kw) || (descText && descText.includes(kw)),
    );
    shell.classList.toggle(CLASS_SOFT, !hasMatch);
  }
}
