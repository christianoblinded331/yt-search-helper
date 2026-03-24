import { useEffect, useState } from "react";
import type { CorrectionMode, UserPreferences } from "../shared/contracts";
import { DEFAULT_PREFERENCES } from "../shared/contracts";
import { loadPreferences, saveModePreference, savePartial } from "./preferences";
import "./options.css";

function Row(props: {
  label: string;
  helper: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="row">
      <div>
        <div className="row-label">{props.label}</div>
        <div className="row-helper">{props.helper}</div>
      </div>
      <input
        type="checkbox"
        checked={props.checked}
        onChange={(event) => props.onChange(event.target.checked)}
      />
    </label>
  );
}

export default function OptionsApp() {
  const [prefs, setPrefs] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void loadPreferences().then((value) => {
      setPrefs(value);
      setReady(true);
    });
  }, []);

  const patch = async (update: Partial<UserPreferences>) => {
    await savePartial(update);
    setPrefs((previous) => ({ ...previous, ...update }));
  };

  const setMode = async (mode: CorrectionMode) => {
    await saveModePreference(mode);
    setPrefs((previous) => ({ ...previous, correctionMode: mode }));
  };

  return (
    <main className="panel">
      <h1>YT Search Helper</h1>
      <p className="subtitle">
        Filters and normalizes YouTube search. Not affiliated with YouTube or
        Google.
      </p>

      <section className="group">
        <h2 className="section-title">Global</h2>
        <Row
          label="Extension on"
          helper="Turns off every feature below when disabled."
          checked={prefs.enabled}
          onChange={(value) => void patch({ enabled: value })}
        />
        <Row
          label="URL normalization"
          helper="Cleans noisy query parameters and optional strict filter mode."
          checked={prefs.urlTuningEnabled}
          onChange={(value) => void patch({ urlTuningEnabled: value })}
        />
        <Row
          label="Debug toast"
          helper="Brief overlay when a URL redirect runs."
          checked={prefs.debugOverlay}
          onChange={(value) => void patch({ debugOverlay: value })}
        />
        <div className="row-label" style={{ marginTop: 12 }}>
          URL correction mode
        </div>
        <div className="mode-grid">
          <button
            className={prefs.correctionMode === "balanced" ? "active" : ""}
            onClick={() => void setMode("balanced")}
            type="button"
          >
            Balanced
          </button>
          <button
            className={prefs.correctionMode === "strict" ? "active" : ""}
            onClick={() => void setMode("strict")}
            type="button"
          >
            Strict (videos filter)
          </button>
        </div>
      </section>

      <section className="group">
        <h2 className="section-title">Search results</h2>
        <Row
          label="Remove recommendation shelves"
          helper='e.g. “People also watched” style blocks.'
          checked={prefs.prunePeopleShelf}
          onChange={(value) => void patch({ prunePeopleShelf: value })}
        />
        <Row
          label="Remove horizontal card rows"
          helper="Scrolling suggestion strips in the main column."
          checked={prefs.pruneHorizontalLists}
          onChange={(value) => void patch({ pruneHorizontalLists: value })}
        />
        <Row
          label="Remove Shorts shelf blocks"
          helper="Dedicated Shorts rails in results."
          checked={prefs.pruneShortsShelf}
          onChange={(value) => void patch({ pruneShortsShelf: value })}
        />
        <Row
          label="Remove Shorts video tiles"
          helper="Individual Shorts entries mixed into results."
          checked={prefs.stripShortTilesFromResults}
          onChange={(value) => void patch({ stripShortTilesFromResults: value })}
        />
        <Row
          label="Remove live & premiere rows"
          helper="Rows marked LIVE or PREMIERE."
          checked={prefs.pruneLiveAndPremiere}
          onChange={(value) => void patch({ pruneLiveAndPremiere: value })}
        />
        <Row
          label="Remove playlist tiles"
          helper="Playlist-style horizontal cards."
          checked={prefs.prunePlaylistLockups}
          onChange={(value) => void patch({ prunePlaylistLockups: value })}
        />
        <Row
          label="Remove mix tiles"
          helper="Auto-generated mix cards."
          checked={prefs.pruneMixLockups}
          onChange={(value) => void patch({ pruneMixLockups: value })}
        />
        <Row
          label="Remove channel cards"
          helper="Full channel rows in search."
          checked={prefs.pruneChannelCards}
          onChange={(value) => void patch({ pruneChannelCards: value })}
        />
        <Row
          label="Remove course / promo wrappers"
          helper="Large course-style promo tiles."
          checked={prefs.pruneCourseLockups}
          onChange={(value) => void patch({ pruneCourseLockups: value })}
        />
        <Row
          label="Strip secondary search chrome"
          helper="Extra search UI below the main column."
          checked={prefs.pruneSecondarySearchChrome}
          onChange={(value) =>
            void patch({ pruneSecondarySearchChrome: value })
          }
        />
      </section>

      <section className="group">
        <h2 className="section-title">Navigation & display</h2>
        <Row
          label="Open Shorts URLs as normal watch page"
          helper="Turns /shorts/VIDEO into watch?v=VIDEO."
          checked={prefs.redirectShortUrlsToWatch}
          onChange={(value) => void patch({ redirectShortUrlsToWatch: value })}
        />
        <Row
          label="Dim titles that ignore search words"
          helper="Lowers contrast when title/description miss query tokens."
          checked={prefs.demoteTitlesWithoutQueryTerms}
          onChange={(value) =>
            void patch({ demoteTitlesWithoutQueryTerms: value })
          }
        />
        <Row
          label="Highlight result cards"
          helper="Subtle background on each video row."
          checked={prefs.cardBackdropAccent}
          onChange={(value) => void patch({ cardBackdropAccent: value })}
        />
        <Row
          label="Remove already-watched rows"
          helper="Uses resume-progress overlay on thumbnails."
          checked={prefs.stripPreviouslyWatched}
          onChange={(value) => void patch({ stripPreviouslyWatched: value })}
        />
        <Row
          label="Remove verified-channel rows"
          helper="Rows with the verified badge."
          checked={prefs.pruneVerifiedChannels}
          onChange={(value) => void patch({ pruneVerifiedChannels: value })}
        />
        <Row
          label="Remove official artist rows"
          helper="Rows labeled Official Artist Channel."
          checked={prefs.pruneArtistChannels}
          onChange={(value) => void patch({ pruneArtistChannels: value })}
        />
        <Row
          label="Remove expandable chapter rows"
          helper="Rows with chapter metadata expanders."
          checked={prefs.pruneChapterRows}
          onChange={(value) => void patch({ pruneChapterRows: value })}
        />
      </section>

      <nav className="footer-links" aria-label="Author links">
        <a
          href="https://github.com/ykapf"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <span className="footer-links-sep" aria-hidden="true">
          ·
        </span>
        <a
          href="https://www.ykapf.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Website
        </a>
        <span className="footer-links-sep" aria-hidden="true">
          ·
        </span>
        <a
          href="https://buymeacoffee.com/ykapf"
          target="_blank"
          rel="noopener noreferrer"
        >
          Buy me a coffee
        </a>
      </nav>

      <footer className="footer-status">
        {ready ? "Saved automatically" : "Loading preferences..."}
      </footer>
    </main>
  );
}
