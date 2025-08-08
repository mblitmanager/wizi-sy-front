import { useEffect, useRef } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { mediaService } from "@/services/MediaService";

interface Props {
  url: string;
  mediaId: string;
  stagiaireId: number;
  watchedThreshold?: number;
}

const VITE_API_URL = import.meta.env.VITE_API_URL;

const isExternalUrl = (url: string): boolean => {
  return url.startsWith("http://") || url.startsWith("https://");
};

const getEmbedUrl = (url: string): string | null => {
  try {
    const urlObj = new URL(url);

    if (
      urlObj.hostname.includes("youtube.com") ||
      urlObj.hostname.includes("youtu.be")
    ) {
      // Handle YouTube Shorts
      if (urlObj.pathname.startsWith("/shorts/")) {
        const videoId = urlObj.pathname.split("/")[2];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
      }

      // Handle standard YouTube URLs
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

    // Fallback
    return url;
  } catch {
    return null;
  }
};

export default function VideoPlayer({
  url,
  mediaId,
  stagiaireId,
  watchedThreshold = 80,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);
  const hasMarkedAsWatched = useRef(false); // Pour éviter les appels multiples

  const isExternal = isExternalUrl(url);
  const embedUrl = isExternal ? getEmbedUrl(url) : null;

  const markAsWatched = async () => {
    if (hasMarkedAsWatched.current) return;

    try {
      await mediaService.markAsWatched(mediaId, stagiaireId);
      hasMarkedAsWatched.current = true;
      window.dispatchEvent(
        new CustomEvent("media-watched", { detail: { mediaId } })
      );
      console.log("Vidéo marquée comme regardée");
    } catch (error) {
      console.error(
        "Erreur lors du marquage de la vidéo comme regardée:",
        error
      );
    }
  };

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

      // Écouter les événements de lecture
      const player = playerRef.current;

      const handleTimeUpdate = () => {
        if (!video.duration) return;

        const percentWatched = (video.currentTime / video.duration) * 100;
        if (percentWatched >= watchedThreshold && !hasMarkedAsWatched.current) {
          markAsWatched();
        }
      };

      player.on("timeupdate", handleTimeUpdate);

      return () => {
        // Nettoyage
        player.off("timeupdate", handleTimeUpdate);
        if (playerRef.current) {
          playerRef.current.destroy();
        }
      };
    }
  }, [url, isExternal, mediaId, stagiaireId, watchedThreshold]);

  // Pour les vidéos externes (YouTube, etc.), nous ne pouvons pas suivre précisément la progression
  // donc nous marquons comme vu dès la lecture
  useEffect(() => {
    if (isExternal && embedUrl && !hasMarkedAsWatched.current) {
      const timer = setTimeout(() => {
        markAsWatched();
      }, 5000); // Marquer comme vu après 5 secondes pour les vidéos externes

      return () => clearTimeout(timer);
    }
  }, [isExternal, embedUrl]);

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
