import type { UserPreferences } from "../shared/contracts";
import { classifyHorizontalLockup } from "./lockupKind";

const PRIMARY_RESULTS = "#primary .ytd-two-column-search-results-renderer";

function removeAll(nodes: Iterable<Element>): void {
  for (const node of nodes) {
    node.remove();
  }
}

function pruneShelves(prefs: UserPreferences): void {
  if (!prefs.prunePeopleShelf) {
    return;
  }
  const nodes = document.querySelectorAll(
    `${PRIMARY_RESULTS} ytd-shelf-renderer`,
  );
  removeAll(nodes);
}

function pruneHorizontalLists(prefs: UserPreferences): void {
  if (!prefs.pruneHorizontalLists) {
    return;
  }
  const nodes = document.querySelectorAll(
    `${PRIMARY_RESULTS} ytd-horizontal-card-list-renderer`,
  );
  removeAll(nodes);
}

function prunePlaylistAndMixLockups(prefs: UserPreferences): void {
  if (!prefs.prunePlaylistLockups && !prefs.pruneMixLockups) {
    return;
  }
  const lockups = document.querySelectorAll(".yt-lockup-view-model--horizontal");
  for (const item of lockups) {
    const kind = classifyHorizontalLockup(item);
    if (kind === "playlist" && prefs.prunePlaylistLockups) {
      item.remove();
    } else if (kind === "mix" && prefs.pruneMixLockups) {
      item.remove();
    }
  }
}

function pruneShortsShelves(prefs: UserPreferences): void {
  if (!prefs.pruneShortsShelf) {
    return;
  }
  removeAll(
    document.querySelectorAll(
      `${PRIMARY_RESULTS} ytd-reel-shelf-renderer, grid-shelf-view-model`,
    ),
  );
}

function pruneCourseLockups(prefs: UserPreferences): void {
  if (!prefs.pruneCourseLockups) {
    return;
  }
  removeAll(document.querySelectorAll(".yt-lockup-view-model--wrapper"));
}

function pruneChannelCards(prefs: UserPreferences): void {
  if (!prefs.pruneChannelCards) {
    return;
  }
  removeAll(
    document.querySelectorAll(`${PRIMARY_RESULTS} ytd-channel-renderer`),
  );
}

function pruneSecondaryChrome(prefs: UserPreferences): void {
  if (!prefs.pruneSecondarySearchChrome) {
    return;
  }
  removeAll(document.querySelectorAll("ytd-secondary-search-container-renderer"));
}

function stripShortVideoTiles(prefs: UserPreferences): void {
  if (!prefs.stripShortTilesFromResults) {
    return;
  }
  const thumbs = document.querySelectorAll(
    "ytd-video-renderer ytd-thumbnail a#thumbnail[href]",
  );
  for (const anchor of thumbs) {
    const href = anchor.getAttribute("href") ?? "";
    if (href.includes("/shorts/")) {
      const row = anchor.closest("ytd-video-renderer");
      row?.remove();
    }
  }
}

function pruneLivePremiereRows(prefs: UserPreferences): void {
  if (!prefs.pruneLiveAndPremiere) {
    return;
  }
  const badgeTexts = document.querySelectorAll(
    "#badges .yt-badge-shape__text, #badges > div > p",
  );
  for (const el of badgeTexts) {
    const text = el.textContent?.trim() ?? "";
    if (text === "LIVE" || text === "PREMIERE") {
      const row = el.closest("ytd-video-renderer");
      row?.remove();
    }
  }
}

function pruneVerifiedRows(prefs: UserPreferences): void {
  if (!prefs.pruneVerifiedChannels) {
    return;
  }
  const rows = document.querySelectorAll(
    "#primary ytd-item-section-renderer ytd-video-renderer",
  );
  for (const row of rows) {
    const badge = row.querySelector('badge-shape[aria-label="Verified"]');
    if (badge) {
      row.remove();
    }
  }
}

function pruneArtistRows(prefs: UserPreferences): void {
  if (!prefs.pruneArtistChannels) {
    return;
  }
  const rows = document.querySelectorAll(
    "#primary ytd-item-section-renderer ytd-video-renderer",
  );
  for (const row of rows) {
    const badge = row.querySelector(
      'badge-shape[aria-label="Official Artist Channel"]',
    );
    if (badge) {
      row.remove();
    }
  }
}

function pruneChapterRows(prefs: UserPreferences): void {
  if (!prefs.pruneChapterRows) {
    return;
  }
  const metas = document.querySelectorAll("ytd-expandable-metadata-renderer");
  for (const meta of metas) {
    const row = meta.closest("ytd-video-renderer");
    row?.remove();
  }
}

function stripWatchedRows(prefs: UserPreferences): void {
  if (!prefs.stripPreviouslyWatched) {
    return;
  }
  const overlays = document.querySelectorAll(
    "ytd-thumbnail-overlay-resume-playback-renderer",
  );
  for (const overlay of overlays) {
    let row = overlay.closest("ytd-video-renderer");
    if (!row) {
      let walk: Element | null = overlay;
      for (let i = 0; i < 15 && walk; i += 1) {
        walk = walk.parentElement;
        if (walk?.tagName.toLowerCase() === "ytd-video-renderer") {
          row = walk;
          break;
        }
      }
    }
    row?.remove();
  }
}

export function runResultStreamPass(prefs: UserPreferences): void {
  if (!prefs.enabled) {
    return;
  }
  const path = location.pathname;
  if (!path.startsWith("/results")) {
    return;
  }

  pruneShelves(prefs);
  pruneHorizontalLists(prefs);
  prunePlaylistAndMixLockups(prefs);
  pruneShortsShelves(prefs);
  pruneCourseLockups(prefs);
  pruneChannelCards(prefs);
  pruneSecondaryChrome(prefs);
  stripShortVideoTiles(prefs);
  pruneLivePremiereRows(prefs);
  pruneVerifiedRows(prefs);
  pruneArtistRows(prefs);
  pruneChapterRows(prefs);
  stripWatchedRows(prefs);
}
