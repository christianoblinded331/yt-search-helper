import { useEffect, useState } from "react";
import { readPreferences, writePreferences } from "../shared/storage";
import "./popup.css";

export default function PopupApp() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    void readPreferences().then((preferences) => setEnabled(preferences.enabled));
  }, []);

  const handleEnabledChange = async (value: boolean) => {
    setEnabled(value);
    await writePreferences({ enabled: value });
  };

  return (
    <main className="popup">
      <h2>YT Search Helper</h2>
      <label className="toggle">
        <span>Correction enabled</span>
        <input
          type="checkbox"
          checked={enabled}
          onChange={(event) => void handleEnabledChange(event.target.checked)}
        />
      </label>
      <button type="button" onClick={() => void chrome.runtime.openOptionsPage()}>
        Open settings
      </button>
    </main>
  );
}
