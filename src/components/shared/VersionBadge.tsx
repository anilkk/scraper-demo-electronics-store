import { VERSION, MODE, RESOLVED } from "@/lib/variant";

/**
 * Demo-only pill. Sits outside the store's product DOM so a scraper can
 * ignore it, and tells the audience which version is live.
 */
export function VersionBadge() {
  const label = VERSION === "v1" ? "v1 · original" : `v2 · redesign · ${MODE}`;
  const bg = VERSION === "v1" ? "#16a34a" : "#dc2626";
  return (
    <div
      id="demo-version-flag"
      title={`STORE_VERSION=${VERSION} BREAK_MODE=${MODE} vocab=${RESOLVED.vocab} urls=${RESOLVED.urls}`}
      style={{ position: "fixed", right: 14, bottom: 14, zIndex: 60, background: bg, color: "#fff", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12, fontWeight: 600, letterSpacing: 0.4, padding: "7px 12px", borderRadius: 999, boxShadow: "0 4px 14px rgba(0,0,0,.28)" }}
    >
      {label}
    </div>
  );
}
