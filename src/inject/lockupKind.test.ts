import { describe, expect, it } from "vitest";
import { classifyHorizontalLockup } from "./lockupKind";

function el(html: string): Element {
  const wrap = document.createElement("div");
  wrap.innerHTML = html.trim();
  return wrap.firstElementChild!;
}

describe("classifyHorizontalLockup", () => {
  it("detects playlist from badge videos count", () => {
    const root = el(`
      <div class="yt-lockup-view-model--horizontal">
        <span class="yt-badge-shape__text">12 videos</span>
      </div>
    `);
    expect(classifyHorizontalLockup(root)).toBe("playlist");
  });

  it("detects mix from badge text", () => {
    const root = el(`
      <div class="yt-lockup-view-model--horizontal">
        <span class="yt-badge-shape__text">Mix</span>
      </div>
    `);
    expect(classifyHorizontalLockup(root)).toBe("mix");
  });

  it("detects mix from href pattern", () => {
    const root = el(`
      <div class="yt-lockup-view-model--horizontal">
        <a class="yt-lockup-view-model-wiz__content-image" href="/watch?v=x&list=RDx&start_radio=1"></a>
      </div>
    `);
    expect(classifyHorizontalLockup(root)).toBe("mix");
  });
});
