import { useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { mediaService } from "@/services/MediaService";
import { ZoomIn, ZoomOut } from "lucide-react";

interface Props {
  url: string;
  mediaId: string;
  stagiaireId: number;
  watchedThreshold?: number;
  subtitleUrl?: string;
  subtitleLanguage?: string;
}

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function VideoPlayer({
  url,
  mediaId,
  stagiaireId,
  watchedThreshold = 80,
  subtitleUrl,
  subtitleLanguage = 'fr',
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasMarkedAsWatched = useRef(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const markAsWatched = async () => {
    if (hasMarkedAsWatched.current) return;

    try {
      await mediaService.markAsWatched(mediaId, stagiaireId);
      hasMarkedAsWatched.current = true;
      window.dispatchEvent(
        new CustomEvent("media-watched", { detail: { mediaId } })
      );
    } catch (error) {
      console.error(
        "Erreur lors du marquage de la vidéo comme regardée:",
        error
      );
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 1));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;

      // Destroy previous player if it exists
      if (playerRef.current) {
        playerRef.current.destroy();
      }

      // Initialize Plyr with enhanced configuration
      playerRef.current = new Plyr(video, {
        controls: [
          "play-large",
          "play",
          "progress",
          "current-time",
          "duration",
          "mute",
          "volume",
          "captions",
          "settings",
          "pip",
          "airplay",
          "fullscreen",
        ],
        settings: ["captions", "quality", "speed", "loop"],
        speed: {
          selected: 1,
          options: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
        },
        quality: {
          default: 720,
          options: [1080, 720, 480, 360],
        },
        ratio: "16:9",
        volume: 0.5,
        keyboard: {
          focused: true,
          global: true,
        },
        tooltips: {
          controls: true,
          seek: true,
        },
        captions: {
          active: !!subtitleUrl,
          language: subtitleLanguage,
        },
      });

      // Load the video source
      // If URL already contains the API path, use it directly with base URL
      // Otherwise, construct the streaming URL
      if (url.startsWith('/api/')) {
        video.src = `${VITE_API_URL}${url}`;
      } else if (url.startsWith('http')) {
        video.src = url;
      } else {
        video.src = `${VITE_API_URL}/api/media/stream/${url}`;
      }

      // Add subtitle track if available
      if (subtitleUrl) {
        const track = document.createElement('track');
        track.kind = 'captions';
        track.label = subtitleLanguage === 'fr' ? 'Français' : subtitleLanguage;
        track.srclang = subtitleLanguage;
        // Handle subtitle URL similarly to video URL
        if (subtitleUrl.startsWith('/api/')) {
          track.src = `${VITE_API_URL}${subtitleUrl}`;
        } else if (subtitleUrl.startsWith('http')) {
          track.src = subtitleUrl;
        } else {
          track.src = `${VITE_API_URL}/api/media/subtitle/${subtitleUrl}`;
        }
        track.default = true;
        video.appendChild(track);
      }

      video.load();

      // Listen to playback events
      const player = playerRef.current;

      const handleTimeUpdate = () => {
        if (!video.duration) return;

        const percentWatched = (video.currentTime / video.duration) * 100;
        if (percentWatched >= watchedThreshold && !hasMarkedAsWatched.current) {
          markAsWatched();
        }
      };

      player.on("timeupdate", handleTimeUpdate);

      // Load player preferences from localStorage
      try {
        const savedVolume = localStorage.getItem("player-volume");
        const savedSpeed = localStorage.getItem("player-speed");

        if (savedVolume) {
          player.volume = parseFloat(savedVolume);
        }
        if (savedSpeed) {
          player.speed = parseFloat(savedSpeed);
        }
      } catch (error) {
        console.error("Error loading player preferences:", error);
      }

      // Save player preferences to localStorage
      player.on("volumechange", () => {
        try {
          localStorage.setItem("player-volume", player.volume.toString());
        } catch (error) {
          console.error("Error saving volume:", error);
        }
      });

      player.on("ratechange", () => {
        try {
          localStorage.setItem("player-speed", player.speed.toString());
        } catch (error) {
          console.error("Error saving speed:", error);
        }
      });

      return () => {
        // Cleanup
        player.off("timeupdate", handleTimeUpdate);
        if (playerRef.current) {
          playerRef.current.destroy();
        }
      };
    }
  }, [url, mediaId, stagiaireId, watchedThreshold, subtitleUrl, subtitleLanguage]);

  return (
    <div className="relative max-w-full">
      {/* Zoom Controls */}
      {zoomLevel > 1 && (
        <div className="absolute top-2 right-2 z-50 flex gap-2 bg-black/70 rounded-lg p-2">
          <button
            onClick={handleZoomOut}
            className="p-2 bg-white/20 hover:bg-white/30 rounded text-white transition-colors"
            title="Zoom arrière"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={handleResetZoom}
            className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded text-white text-sm font-medium transition-colors"
            title="Réinitialiser le zoom"
          >
            {Math.round(zoomLevel * 100)}%
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 bg-white/20 hover:bg-white/30 rounded text-white transition-colors"
            title="Zoom avant"
            disabled={zoomLevel >= 2}
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Zoom Controls - Always Visible */}
      <div className="absolute bottom-16 right-2 z-40 flex flex-col gap-1 bg-black/50 rounded-lg p-1">
        <button
          onClick={handleZoomIn}
          className="p-1.5 bg-white/10 hover:bg-white/20 rounded text-white transition-colors disabled:opacity-50"
          title="Zoom avant"
          disabled={zoomLevel >= 2}
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1.5 bg-white/10 hover:bg-white/20 rounded text-white transition-colors disabled:opacity-50"
          title="Zoom arrière"
          disabled={zoomLevel <= 1}
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* Video Container with Zoom */}
      <div
        ref={containerRef}
        className="aspect-video rounded-lg overflow-hidden bg-black"
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: "center center",
          transition: "transform 0.3s ease",
        }}
      >
        <video
          ref={videoRef}
          className="w-full h-full"
          controls={false}
          playsInline
          preload="metadata"
        >
          <source src={`${VITE_API_URL}/media/stream/${url}`} type="video/mp4" />
          Votre navigateur ne supporte pas la lecture de vidéos HTML5.
        </video>
      </div>

      {/* Keyboard Shortcuts Info */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        <span className="inline-block">
          Raccourcis : Espace (play/pause) • ← → (reculer/avancer) • ↑ ↓ (volume) • F (plein écran) • M (muet)
        </span>
      </div>
    </div>
  );
}
