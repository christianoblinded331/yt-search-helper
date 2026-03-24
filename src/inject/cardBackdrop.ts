import type { UserPreferences } from "../shared/contracts";

const DARK_CLASS = "sfa-card-surface-dark";
const LIGHT_CLASS = "sfa-card-surface-light";

function ensureBackdropStyles(): void {
  if (document.getElementById("sfa-card-backdrop-style")) {
    return;
  }
  const style = document.createElement("style");
  style.id = "sfa-card-backdrop-style";
  style.textContent = `
    .${DARK_CLASS} { background: #272727; padding: 5px; border-radius: 17px; }
    .${LIGHT_CLASS} { background: #f2f2f2; padding: 5px; border-radius: 17px; }
  `;
  document.head.appendChild(style);
}

export function refreshCardBackdrop(prefs: UserPreferences): void {
  if (!prefs.enabled || !prefs.cardBackdropAccent) {
    const rows = document.querySelectorAll("ytd-video-renderer");
    for (const row of rows) {
      row.classList.remove(DARK_CLASS, LIGHT_CLASS);
    }
    return;
  }
  if (!location.pathname.startsWith("/results")) {
    return;
  }

  ensureBackdropStyles();
  const darkUi = document.documentElement.hasAttribute("dark");
  const rows = document.querySelectorAll(
    "ytd-video-renderer.style-scope.ytd-item-section-renderer",
  );
  for (const row of rows) {
    row.classList.remove(DARK_CLASS, LIGHT_CLASS);
    row.classList.add(darkUi ? DARK_CLASS : LIGHT_CLASS);
  }
}
