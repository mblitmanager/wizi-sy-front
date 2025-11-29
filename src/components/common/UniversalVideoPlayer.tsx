import React from 'react';
import ReactPlayer from 'react-player';
import '../../styles/UniversalVideoPlayer.css';

type Props = {
  url: string;
  controls?: boolean;
};

function isDailymotion(hostname: string) {
  return /(^|\.)dailymotion\.com$|(^|\.)dai\.ly$/.test(hostname);
}

function extractDailymotionId(pathname: string) {
  // match /video/<id> or /hub/.../video/<id>
  const m = pathname.match(/(?:video|hub)\/([A-Za-z0-9_-]+)/i) || pathname.match(/\/([A-Za-z0-9_-]+)$/i);
  return m ? m[1] : null;
}

export default function UniversalVideoPlayer({ url, controls = true }: Props) {
  if (!url) return null;

  let finalUrl = url;
  try {
    const parsed = new URL(url);
    const hostname = parsed.hostname.toLowerCase();

    if (isDailymotion(hostname)) {
      const id = extractDailymotionId(parsed.pathname);
      if (id) {
        finalUrl = `https://www.dailymotion.com/embed/video/${id}`;
      } else {
        // no video id found — do not attempt to embed the site root
        return (
          <div className="universal-player-fallback">
            <p>Cette URL Dailymotion ne peut pas être intégrée.</p>
            <a href={url} target="_blank" rel="noopener noreferrer">Ouvrir dans un nouvel onglet</a>
          </div>
        );
      }
    }
  } catch (e) {
    // invalid URL — let ReactPlayer attempt to play it (it may be a direct stream)
  }

  return (
    <div className="universal-player-wrapper">
      <ReactPlayer
        url={finalUrl}
        controls={controls}
        width="100%"
        height="100%"
      />
    </div>
  );
}
