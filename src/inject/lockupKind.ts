/** Classifies horizontal lockup tiles (playlists vs mixes) for pruning. */

export type LockupKind = "playlist" | "mix" | "unknown";

export function classifyHorizontalLockup(root: Element): LockupKind {
  const badge = root.querySelector(".yt-badge-shape__text");
  if (badge?.textContent) {
    const t = badge.textContent.trim().toLowerCase();
    if (/\d+\s*videos?/i.test(t) || /\d+\s*episodes?/i.test(t)) {
      return "playlist";
    }
    if (t === "mix") {
      return "mix";
    }
  }

  const imgLink = root.querySelector("a.yt-lockup-view-model-wiz__content-image");
  const href = imgLink?.getAttribute("href") ?? "";
  if (href.includes("/playlist?list=")) {
    return "playlist";
  }
  if (
    href.includes("&list=") &&
    !href.includes("list=RD") &&
    !href.includes("&start_radio=1")
  ) {
    return "playlist";
  }
  if (href.includes("&list=RD") && href.includes("&start_radio=1")) {
    return "mix";
  }

  return "unknown";
}
