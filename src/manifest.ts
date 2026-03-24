import type { ManifestV3Export } from "@crxjs/vite-plugin";

const manifest: ManifestV3Export = {
  manifest_version: 3,
  name: "YT Search Helper",
  description:
    "Cleans up YouTube search results, optional URL tuning, and Shorts handling.",
  version: "1.0.0",
  icons: {
    128: "icon128.png",
    256: "icon128.png",
  },
  permissions: ["storage"],
  host_permissions: ["https://www.youtube.com/*", "https://m.youtube.com/*"],
  background: {
    service_worker: "src/worker/serviceWorkerEntry.ts",
    type: "module",
  },
  action: {
    default_title: "YT Search Helper",
    default_popup: "popup.html",
    default_icon: {
      128: "icon128.png",
      256: "icon128.png",
    },
  },
  options_page: "options.html",
  content_scripts: [
    {
      matches: ["https://www.youtube.com/*", "https://m.youtube.com/*"],
      js: ["src/inject/contentEntry.ts"],
      run_at: "document_start",
    },
  ],
  browser_specific_settings: {
    safari: {
      strict_min_version: "16.4",
    },
    gecko: {
      id: "yt-search-helper@example.org",
    },
  },
};

export default manifest;
