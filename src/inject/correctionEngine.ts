import type {
  RedirectDecision,
  ParsedUrlState,
  UserPreferences,
} from "../shared/contracts";

const NOISY_QUERY_KEYS = ["pp", "bp", "pbjreload", "app", "start_radio"] as const;

function buildCanonicalUrl(state: ParsedUrlState, mode: UserPreferences["correctionMode"]): string {
  const source = new URL(state.rawUrl);
  const target = new URL("/results", source.origin);

  if (state.searchTerm) {
    target.searchParams.set("search_query", state.searchTerm);
  }

  for (const keepKey of ["hl", "gl"]) {
    const value = source.searchParams.get(keepKey);
    if (value) {
      target.searchParams.set(keepKey, value);
    }
  }

  if (mode === "strict") {
    // Videos-only filter token used by YouTube results pages.
    target.searchParams.set("sp", "EgIQAQ%253D%253D");
  }

  return target.toString();
}

export function resolveSearchState(
  state: ParsedUrlState,
  preferences: UserPreferences,
): RedirectDecision {
  if (!preferences.enabled || !preferences.urlTuningEnabled || !state.searchTerm) {
    return { shouldRedirect: false, targetUrl: null, reasonCode: "none" };
  }

  if (state.isShorts) {
    return {
      shouldRedirect: true,
      targetUrl: buildCanonicalUrl(state, preferences.correctionMode),
      reasonCode: "shorts_surface",
    };
  }

  if (!state.isResultsPage) {
    return { shouldRedirect: false, targetUrl: null, reasonCode: "none" };
  }

  const hasNoisyParams = NOISY_QUERY_KEYS.some((key) => key in state.filters);
  const shouldCanonicalize =
    hasNoisyParams || (preferences.correctionMode === "strict" && state.filters.sp !== "EgIQAQ%253D%253D");

  if (!shouldCanonicalize) {
    return { shouldRedirect: false, targetUrl: null, reasonCode: "none" };
  }

  return {
    shouldRedirect: true,
    targetUrl: buildCanonicalUrl(state, preferences.correctionMode),
    reasonCode: "canonical_results",
  };
}
