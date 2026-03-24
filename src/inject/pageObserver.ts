import { refreshCardBackdrop } from "./cardBackdrop";
import { resolveSearchState } from "./correctionEngine";
import { createNavigationGate } from "./navigationGate";
import { applyQueryTermDemotion } from "./queryDemotion";
import { runResultStreamPass } from "./resultStreamSanitizer";
import { maybeRedirectShortsToWatch } from "./shortsUrlEscape";
import { parseUrlState } from "./urlState";
import { readPreferences } from "../shared/storage";

function isYouTubeHost(hostname: string): boolean {
  return hostname === "www.youtube.com" || hostname === "m.youtube.com";
}

function renderDebugBanner(message: string): void {
  const banner = document.createElement("div");
  banner.textContent = message;
  banner.style.position = "fixed";
  banner.style.bottom = "12px";
  banner.style.right = "12px";
  banner.style.zIndex = "2147483647";
  banner.style.padding = "8px 10px";
  banner.style.background = "#0f172a";
  banner.style.color = "#f8fafc";
  banner.style.borderRadius = "8px";
  banner.style.font = "12px/1.2 sans-serif";
  banner.style.boxShadow = "0 6px 18px rgba(0,0,0,0.25)";
  document.documentElement.appendChild(banner);
  setTimeout(() => banner.remove(), 1800);
}

async function attemptUrlNormalization(rawUrl: string): Promise<void> {
  const currentUrl = new URL(rawUrl);
  if (!isYouTubeHost(currentUrl.hostname)) {
    return;
  }

  const preferences = await readPreferences();
  const state = parseUrlState(rawUrl);
  const decision = resolveSearchState(state, preferences);

  if (!decision.shouldRedirect || !decision.targetUrl) {
    return;
  }

  const gate = createNavigationGate();
  if (!gate.canNavigate(rawUrl, decision.targetUrl)) {
    return;
  }

  if (preferences.debugOverlay) {
    renderDebugBanner(`URL tune: ${decision.reasonCode}`);
  }
  location.replace(decision.targetUrl);
}

let observerActive = false;
let domObserver: MutationObserver | null = null;

async function runResultsPipeline(): Promise<void> {
  const prefs = await readPreferences();
  maybeRedirectShortsToWatch(prefs);
  if (!prefs.enabled || !location.pathname.startsWith("/results")) {
    return;
  }
  runResultStreamPass(prefs);
  applyQueryTermDemotion(prefs);
  refreshCardBackdrop(prefs);
}

function disconnectDomObserver(): void {
  domObserver?.disconnect();
  domObserver = null;
  observerActive = false;
}

function attachDomObserver(): void {
  if (observerActive || !location.pathname.startsWith("/results")) {
    return;
  }

  domObserver = new MutationObserver((records) => {
    for (const record of records) {
      if (record.type !== "childList") {
        continue;
      }
      for (const node of record.addedNodes) {
        if (node.nodeName === "YTD-VIDEO-RENDERER") {
          void runResultsPipeline();
          break;
        }
      }
    }
  });

  domObserver.observe(document, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["src", "href"],
  });
  observerActive = true;
}

async function onResultsSurfaceEnter(): Promise<void> {
  await runResultsPipeline();
  attachDomObserver();
}

function onResultsSurfaceLeave(): void {
  disconnectDomObserver();
}

async function handleRouteTick(): Promise<void> {
  const path = location.pathname;
  if (path.startsWith("/results")) {
    await onResultsSurfaceEnter();
  } else {
    onResultsSurfaceLeave();
  }
  if (path.startsWith("/watch")) {
    const prefs = await readPreferences();
    maybeRedirectShortsToWatch(prefs);
  }
}

export async function bootstrapExtensionSurface(initialHref: string): Promise<void> {
  const host = new URL(initialHref).hostname;
  if (!isYouTubeHost(host)) {
    return;
  }

  const prefs0 = await readPreferences();
  maybeRedirectShortsToWatch(prefs0);
  await attemptUrlNormalization(initialHref);

  document.addEventListener("yt-navigate-start", () => {
    void readPreferences().then((p) => maybeRedirectShortsToWatch(p));
  });

  document.addEventListener("yt-navigate-finish", () => {
    void handleRouteTick();
  });

  const kickDom = () => {
    void handleRouteTick();
  };
  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", kickDom, { once: true });
  } else {
    kickDom();
  }

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync" || Object.keys(changes).length === 0) {
      return;
    }
    void handleRouteTick();
  });
}
