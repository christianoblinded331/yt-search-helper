import { DEFAULT_PREFERENCES, type UserPreferences } from "./contracts";

const KEYS = {
  enabled: "sfa_enabled",
  correctionMode: "sfa_correction_mode",
  debugOverlay: "sfa_debug_overlay",
  lastUpdated: "sfa_last_updated",
  urlTuningEnabled: "sfa_url_tuning",
  prunePeopleShelf: "sfa_prune_people_shelf",
  pruneHorizontalLists: "sfa_prune_horizontal_lists",
  pruneMixLockups: "sfa_prune_mix_lockups",
  pruneShortsShelf: "sfa_prune_shorts_shelf",
  stripShortTilesFromResults: "sfa_strip_short_tiles",
  pruneLiveAndPremiere: "sfa_prune_live_premiere",
  prunePlaylistLockups: "sfa_prune_playlist_lockups",
  pruneChannelCards: "sfa_prune_channel_cards",
  pruneCourseLockups: "sfa_prune_course_lockups",
  redirectShortUrlsToWatch: "sfa_redirect_shorts_watch",
  demoteTitlesWithoutQueryTerms: "sfa_demote_query_mismatch",
  stripPreviouslyWatched: "sfa_strip_watched",
  cardBackdropAccent: "sfa_card_backdrop_accent",
  pruneVerifiedChannels: "sfa_prune_verified",
  pruneArtistChannels: "sfa_prune_artist",
  pruneChapterRows: "sfa_prune_chapter",
  pruneSecondarySearchChrome: "sfa_prune_secondary_search",
} as const;

type PartialPrefs = Partial<UserPreferences>;

function readBool(
  raw: Record<string, unknown>,
  key: keyof typeof KEYS,
  fallback: boolean,
): boolean {
  const v = raw[KEYS[key]];
  return typeof v === "boolean" ? v : fallback;
}

export async function readPreferences(): Promise<UserPreferences> {
  const result = await chrome.storage.sync.get(Object.values(KEYS));
  const base = DEFAULT_PREFERENCES;
  return {
    enabled: readBool(result, "enabled", base.enabled),
    correctionMode:
      result[KEYS.correctionMode] === "strict" ? "strict" : "balanced",
    debugOverlay: readBool(result, "debugOverlay", base.debugOverlay),
    lastUpdated:
      typeof result[KEYS.lastUpdated] === "number"
        ? (result[KEYS.lastUpdated] as number)
        : base.lastUpdated,
    urlTuningEnabled: readBool(result, "urlTuningEnabled", base.urlTuningEnabled),
    prunePeopleShelf: readBool(result, "prunePeopleShelf", base.prunePeopleShelf),
    pruneHorizontalLists: readBool(
      result,
      "pruneHorizontalLists",
      base.pruneHorizontalLists,
    ),
    pruneMixLockups: readBool(result, "pruneMixLockups", base.pruneMixLockups),
    pruneShortsShelf: readBool(result, "pruneShortsShelf", base.pruneShortsShelf),
    stripShortTilesFromResults: readBool(
      result,
      "stripShortTilesFromResults",
      base.stripShortTilesFromResults,
    ),
    pruneLiveAndPremiere: readBool(
      result,
      "pruneLiveAndPremiere",
      base.pruneLiveAndPremiere,
    ),
    prunePlaylistLockups: readBool(
      result,
      "prunePlaylistLockups",
      base.prunePlaylistLockups,
    ),
    pruneChannelCards: readBool(
      result,
      "pruneChannelCards",
      base.pruneChannelCards,
    ),
    pruneCourseLockups: readBool(
      result,
      "pruneCourseLockups",
      base.pruneCourseLockups,
    ),
    redirectShortUrlsToWatch: readBool(
      result,
      "redirectShortUrlsToWatch",
      base.redirectShortUrlsToWatch,
    ),
    demoteTitlesWithoutQueryTerms: readBool(
      result,
      "demoteTitlesWithoutQueryTerms",
      base.demoteTitlesWithoutQueryTerms,
    ),
    stripPreviouslyWatched: readBool(
      result,
      "stripPreviouslyWatched",
      base.stripPreviouslyWatched,
    ),
    cardBackdropAccent: readBool(
      result,
      "cardBackdropAccent",
      base.cardBackdropAccent,
    ),
    pruneVerifiedChannels: readBool(
      result,
      "pruneVerifiedChannels",
      base.pruneVerifiedChannels,
    ),
    pruneArtistChannels: readBool(
      result,
      "pruneArtistChannels",
      base.pruneArtistChannels,
    ),
    pruneChapterRows: readBool(result, "pruneChapterRows", base.pruneChapterRows),
    pruneSecondarySearchChrome: readBool(
      result,
      "pruneSecondarySearchChrome",
      base.pruneSecondarySearchChrome,
    ),
  };
}

export async function writePreferences(update: PartialPrefs): Promise<void> {
  const map: Record<string, boolean | string | number> = {
    [KEYS.lastUpdated]: Date.now(),
  };

  const assignBool = (k: keyof typeof KEYS, v: boolean | undefined) => {
    if (v !== undefined) {
      map[KEYS[k]] = Boolean(v);
    }
  };

  assignBool("enabled", update.enabled);
  if (update.correctionMode !== undefined) {
    map[KEYS.correctionMode] = update.correctionMode;
  }
  assignBool("debugOverlay", update.debugOverlay);
  assignBool("urlTuningEnabled", update.urlTuningEnabled);
  assignBool("prunePeopleShelf", update.prunePeopleShelf);
  assignBool("pruneHorizontalLists", update.pruneHorizontalLists);
  assignBool("pruneMixLockups", update.pruneMixLockups);
  assignBool("pruneShortsShelf", update.pruneShortsShelf);
  assignBool("stripShortTilesFromResults", update.stripShortTilesFromResults);
  assignBool("pruneLiveAndPremiere", update.pruneLiveAndPremiere);
  assignBool("prunePlaylistLockups", update.prunePlaylistLockups);
  assignBool("pruneChannelCards", update.pruneChannelCards);
  assignBool("pruneCourseLockups", update.pruneCourseLockups);
  assignBool("redirectShortUrlsToWatch", update.redirectShortUrlsToWatch);
  assignBool("demoteTitlesWithoutQueryTerms", update.demoteTitlesWithoutQueryTerms);
  assignBool("stripPreviouslyWatched", update.stripPreviouslyWatched);
  assignBool("cardBackdropAccent", update.cardBackdropAccent);
  assignBool("pruneVerifiedChannels", update.pruneVerifiedChannels);
  assignBool("pruneArtistChannels", update.pruneArtistChannels);
  assignBool("pruneChapterRows", update.pruneChapterRows);
  assignBool("pruneSecondarySearchChrome", update.pruneSecondarySearchChrome);

  await chrome.storage.sync.set(map);
}
