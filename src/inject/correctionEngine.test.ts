import { describe, expect, it } from "vitest";
import { resolveSearchState } from "./correctionEngine";
import type { ParsedUrlState, UserPreferences } from "../shared/contracts";
import { DEFAULT_PREFERENCES } from "../shared/contracts";

const baselinePrefs: UserPreferences = { ...DEFAULT_PREFERENCES };

function makeState(partial: Partial<ParsedUrlState>): ParsedUrlState {
  return {
    rawUrl: "https://www.youtube.com/results?search_query=test",
    pageKind: "results",
    searchTerm: "test",
    filters: { search_query: "test" },
    continuationToken: null,
    isShorts: false,
    isResultsPage: true,
    ...partial,
  };
}

describe("resolveSearchState", () => {
  it("redirects shorts surfaces to canonical results", () => {
    const decision = resolveSearchState(
      makeState({
        rawUrl: "https://www.youtube.com/shorts/xyz?search_query=drums",
        pageKind: "shorts",
        isShorts: true,
        isResultsPage: false,
        searchTerm: "drums",
      }),
      baselinePrefs,
    );
    expect(decision.shouldRedirect).toBe(true);
    expect(decision.reasonCode).toBe("shorts_surface");
    expect(decision.targetUrl).toContain("/results?search_query=drums");
  });

  it("skips redirects when disabled", () => {
    const decision = resolveSearchState(makeState({}), {
      ...baselinePrefs,
      enabled: false,
    });
    expect(decision.shouldRedirect).toBe(false);
  });

  it("skips redirects when URL tuning disabled", () => {
    const decision = resolveSearchState(makeState({}), {
      ...baselinePrefs,
      urlTuningEnabled: false,
    });
    expect(decision.shouldRedirect).toBe(false);
  });

  it("canonicalizes noisy params on results page", () => {
    const decision = resolveSearchState(
      makeState({
        rawUrl:
          "https://www.youtube.com/results?search_query=jazz&pp=something&pbjreload=11",
        filters: {
          search_query: "jazz",
          pp: "something",
          pbjreload: "11",
        },
        searchTerm: "jazz",
      }),
      baselinePrefs,
    );
    expect(decision.shouldRedirect).toBe(true);
    expect(decision.reasonCode).toBe("canonical_results");
  });
});
