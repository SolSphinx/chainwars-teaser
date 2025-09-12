// ================================================
// FILE: components/social/XFeed.jsx
// Robust X (Twitter) timeline embed using the widgets API programmatically.
// - Works even if the script loaded before/after the anchor is present.
// - Detects script load and (re)creates the timeline, avoids double-initialization.
// - Usage: <XFeed username="SolSphinx" height={520} theme="dark" tweetLimit={5} />
//          or <XFeed href="https://twitter.com/i/lists/123" />
// ================================================
"use client";
import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";

export default function XFeed({ username, href, height = 520, theme = "dark", tweetLimit = 5, chrome = "noheader nofooter noborders transparent" }) {
  const containerRef = useRef(null);
  const [widgetsReady, setWidgetsReady] = useState(false);
  const timelineHref = href || (username ? `https://twitter.com/${username}` : "https://twitter.com/x");

  useEffect(() => {
    if (!widgetsReady) return;
    const target = containerRef.current;
    if (!target || !window.twttr?.widgets?.createTimeline) return;

    // Clear previous iframe if any (avoid duplicates on prop changes)
    target.innerHTML = "";

    const opts = { height, theme, chrome, tweetLimit };
    const source = href
      ? { sourceType: "url", url: timelineHref }
      : { sourceType: "profile", screenName: username };

    window.twttr.widgets
      .createTimeline(source, target, opts)
      .catch(() => {
        // Silent fail: keep the plain link visible as fallback
      });
  }, [widgetsReady, username, href, timelineHref, height, theme, tweetLimit, chrome]);

  return (
    <div className="w-full" style={{ minHeight: height }}>
      {/* Fallback link (rendered until script loads / in no-JS mode) */}
      <div ref={containerRef}>
        <a href={timelineHref} target="_blank" rel="noreferrer noopener">
          Tweets by @{username || "X"}
        </a>
      </div>

      <Script
        id="x-widgets"
        src="https://platform.twitter.com/widgets.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (window.twttr?.widgets) setWidgetsReady(true);
        }}
      />
    </div>
  );
}
