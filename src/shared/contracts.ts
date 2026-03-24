export type PageKind = "results" | "shorts" | "watch" | "other";

export interface ParsedUrlState {
  rawUrl: string;
  pageKind: PageKind;
  searchTerm: string | null;
  filters: Record<string, string>;
  continuationToken: string | null;
  isShorts: boolean;
  isResultsPage: boolean;
}

export type CorrectionMode = "balanced" | "strict";

export interface UserPreferences {
  enabled: boolean;
  correctionMode: CorrectionMode;
  debugOverlay: boolean;
  lastUpdated: number;
  /** Normalize noisy search URLs (redirect layer). */
  urlTuningEnabled: boolean;
  /** --- Search results (DOM) --- */
  prunePeopleShelf: boolean;
  pruneHorizontalLists: boolean;
  pruneMixLockups: boolean;
  pruneShortsShelf: boolean;
  stripShortTilesFromResults: boolean;
  pruneLiveAndPremiere: boolean;
  prunePlaylistLockups: boolean;
  pruneChannelCards: boolean;
  pruneCourseLockups: boolean;
  redirectShortUrlsToWatch: boolean;
  demoteTitlesWithoutQueryTerms: boolean;
  stripPreviouslyWatched: boolean;
  cardBackdropAccent: boolean;
  pruneVerifiedChannels: boolean;
  pruneArtistChannels: boolean;
  pruneChapterRows: boolean;
  pruneSecondarySearchChrome: boolean;
}

export interface RedirectDecision {
  shouldRedirect: boolean;
  targetUrl: string | null;
  reasonCode: "shorts_surface" | "canonical_results" | "none";
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  enabled: true,
  correctionMode: "balanced",
  debugOverlay: false,
  lastUpdated: Date.now(),
  urlTuningEnabled: true,
  prunePeopleShelf: true,
  pruneHorizontalLists: true,
  pruneMixLockups: true,
  pruneShortsShelf: true,
  stripShortTilesFromResults: true,
  pruneLiveAndPremiere: true,
  prunePlaylistLockups: true,
  pruneChannelCards: true,
  pruneCourseLockups: false,
  redirectShortUrlsToWatch: true,
  demoteTitlesWithoutQueryTerms: false,
  stripPreviouslyWatched: false,
  cardBackdropAccent: false,
  pruneVerifiedChannels: false,
  pruneArtistChannels: false,
  pruneChapterRows: false,
  pruneSecondarySearchChrome: false,
};
