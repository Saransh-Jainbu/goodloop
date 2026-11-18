import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

// The picture shown when a link to GoodLoop is shared (WhatsApp, LinkedIn, X, Slack...).
export const alt = "GoodLoop: find and join local volunteering opportunities";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          color: "white",
          background: "linear-gradient(135deg, #03130e 0%, #064e3b 55%, #0f8a5f 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 76,
              height: 76,
              borderRadius: 22,
              background: "linear-gradient(135deg, #34d399, #047857)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
            }}
          >
            ♥
          </div>
          <div style={{ fontSize: 48, fontWeight: 700 }}>{SITE_NAME}</div>
        </div>
        <div style={{ fontSize: 88, fontWeight: 800, marginTop: 48, lineHeight: 1.05 }}>{SITE_TAGLINE}</div>
        <div style={{ fontSize: 34, marginTop: 28, color: "#a7f3d0", maxWidth: 900 }}>
          Find and join local volunteering: blood donation camps, food and clothes drives, clean-ups and more.
        </div>
      </div>
    ),
    size,
  );
}
