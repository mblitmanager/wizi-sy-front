import { useEffect, useRef } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

interface Props {
  url: string;
}

const VITE_API_URL = import.meta.env.VITE_API_URL;

const isExternalUrl = (url: string): boolean => {
  return url.startsWith("http://") || url.startsWith("https://");
};

const getEmbedUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);

    // YouTube
    if (
      urlObj.hostname.includes("youtube.com") ||
      urlObj.hostname.includes("youtu.be")
    ) {
      const videoId = urlObj.hostname.includes("youtu.be")
        ? urlObj.pathname.slice(1)
        : new URLSearchParams(urlObj.search).get("v");
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
    }

    // LinkedIn
    if (urlObj.hostname.includes("linkedin.com")) {
      const videoId = urlObj.pathname.split("/").pop();
      return videoId
        ? `https://www.linkedin.com/embed/feed/update/${videoId}`
        : null;
    }

    // Dailymotion
    if (urlObj.hostname.includes("dailymotion.com")) {
      const videoId = urlObj.pathname.split("/").pop();
      return videoId
        ? `https://www.dailymotion.com/embed/video/${videoId}`
        : null;
    }

    // Vimeo
    if (urlObj.hostname.includes("vimeo.com")) {
      const videoId = urlObj.pathname.split("/").pop();
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null;
    }

    // Autre URL externe
    return url;
  } catch {
    return null;
  }
};

export default function VideoPlayer({ url }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);

  const isExternal = isExternalUrl(url);
  const embedUrl = isExternal ? getEmbedUrl(url) : null;

  useEffect(() => {
    if (!isExternal && videoRef.current) {
      const video = videoRef.current;

      // Détruire le lecteur précédent s'il existe
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      // Initialiser Plyr
      playerRef.current = new Plyr(video, {
        controls: [
          "play-large",
          "play",
          "progress",
          "current-time",
          "mute",
          "volume",
          "captions",
          "settings",
          "pip",
          "airplay",
          "fullscreen",
        ],
        settings: ["quality", "speed", "loop"],
        quality: {
          default: 1080,
          options: [1080, 720, 480],
        },
        ratio: "16:9",
        volume: 0.5,
      });

      // Charger la vidéo
      video.src = `${VITE_API_URL}/media/stream/${url}`;
      video.load();

      return () => {
        // Nettoyage
        if (playerRef.current) {
          playerRef.current.destroy();
        }
      };
    }
  }, [url, isExternal]);

  // ▶️ Si c'est une vidéo externe (YouTube, Vimeo, etc.)
  if (isExternal && embedUrl) {
    return (
      <div className="w-full aspect-video max-h-[60vh] sm:max-h-none rounded-lg overflow-hidden">
        <iframe
          src={embedUrl}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Video player"
          className="w-full h-full rounded-lg"
        />
      </div>
    );
  }

  // ▶️ Si c’est une vidéo locale
  return (
    <div className="max-w-full aspect-video rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        controls={false}
        playsInline
        preload="metadata">
        <source src={`${VITE_API_URL}/media/stream/${url}`} type="video/mp4" />
        Votre navigateur ne supporte pas la lecture de vidéos HTML5.
      </video>
    </div>
  );
}
