import type { UserPreferences } from "../shared/contracts";

export function maybeRedirectShortsToWatch(prefs: UserPreferences): void {
  if (!prefs.enabled || !prefs.redirectShortUrlsToWatch) {
    return;
  }
  if (!location.pathname.startsWith("/shorts/")) {
    return;
  }
  const id = location.pathname.split("/shorts/")[1]?.split(/[/?#]/)[0];
  if (!id) {
    return;
  }
  window.location.replace(`https://www.youtube.com/watch?v=${id}`);
}
