// ================================================
// FILE: components/social/XFeed.jsx
// Robust X (Twitter) timeline embed using the widgets API programmatically.
// - Keeps fallback link visible until timeline successfully mounts.
// - Retries a few times if the widgets API is late to initialize.
// - Avoids duplicate iframes on re-renders.
// - Usage: <XFeed username="SolSphinx" height={520} theme="dark" tweetLimit={5} />
//          or <XFeed href="https://twitter.com/i/lists/123" />
// ================================================
"use client";
import React, { useEffect, useRef, useState } from "react";
import Script from "next/script";

export default function XFeed({ username, href, height = 520, theme = "dark", tweetLimit = 5, chrome = "noheader nofooter noborders transparent" }) {
  const containerRef = useRef(null);
  const [widgetsReady, setWidgetsReady] = useState(false);
  const attemptsRef = useRef(0);
  const timelineHref = href || (username ? `https://twitter.com/${username}` : "https://twitter.com/x");

  // If the script was already loaded by another component/page
  useEffect(() => {
    if (typeof window !== "undefined" && window.twttr?.widgets) {
      setWidgetsReady(true);
    }
  }, []);

  const mountTimeline = async () => {
    const tw = window.twttr?.widgets;
    const target = containerRef.current;
    if (!tw?.createTimeline || !target) return;

    // Remove any previous iframes so we don't duplicate on prop changes
    target.querySelectorAll("iframe.twitter-timeline").forEach((n) => n.remove());

    const opts = { height, theme, chrome, tweetLimit };
    const source = href
      ? { sourceType: "url", url: timelineHref }
      : { sourceType: "profile", screenName: username };

    try {
      await tw.createTimeline(source, target, opts);
      attemptsRef.current = 0; // success
    } catch (e) {
      // Retry up to 3 times with small delays (handles late script init or flaky loads)
      if (attemptsRef.current < 3) {
        attemptsRef.current += 1;
        setTimeout(mountTimeline, 800);
      }
      // Keep fallback visible on failure
      // console.error("X timeline failed:", e);
    }
  };

  useEffect(() => {
    if (widgetsReady) mountTimeline();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widgetsReady, username, href, timelineHref, height, theme, tweetLimit, chrome]);

  return (
    <div className="w-full" style={{ minHeight: height }}>
      {/* Fallback link (rendered until widgets create an iframe) */}
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
