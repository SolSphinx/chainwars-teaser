// ================================================
// FILE: components/social/XFeed.jsx
// Official X (Twitter) timeline embed with Next.js Script.
// - Usage in pages/index.js: <XFeed username="SolSphinx" height={520} />
// - You can also pass a full `href` (e.g. a List):
//   <XFeed href="https://twitter.com/i/lists/123" />
// ================================================
import React, { useEffect, useRef } from "react";
import Script from "next/script";

export default function XFeed({ username, href, height = 520, theme = "dark", tweetLimit = 5, chrome = "noheader nofooter noborders transparent" }) {
  const containerRef = useRef(null);
  const timelineHref = href || (username ? `https://twitter.com/${username}` : "https://twitter.com/x");

  useEffect(() => {
    if (typeof window !== "undefined" && window.twttr?.widgets) {
      window.twttr.widgets.load(containerRef.current);
    }
  }, [timelineHref, height, theme, tweetLimit, chrome]);

  return (
    <div ref={containerRef} className="w-full">
      <a
        className="twitter-timeline"
        data-height={height}
        data-theme={theme}
        data-tweet-limit={tweetLimit}
        data-chrome={chrome}
        data-dnt="true"
        href={timelineHref}
      >
        Tweets by @{username || "X"}
      </a>
      <Script
        id="x-widgets"
        src="https://platform.twitter.com/widgets.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (window.twttr?.widgets) {
            window.twttr.widgets.load(containerRef.current);
          }
        }}
      />
    </div>
  );
}
