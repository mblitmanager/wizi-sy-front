import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
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
const VITE_API_URL_MEDIA = import.meta.env.VITE_API_URL_MEDIA;

export default function VideoPlayer({
  url,
  mediaId,
  stagiaireId,
  watchedThreshold = 80,
  subtitleUrl,
  subtitleLanguage = 'fr',
}: Props) {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hasMarkedAsWatched = useRef(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  const markAsWatched = useCallback(async () => {
    if (hasMarkedAsWatched.current) return;

    try {
      await mediaService.markAsWatched(mediaId, stagiaireId);
      hasMarkedAsWatched.current = true;
      window.dispatchEvent(
        new CustomEvent("media-watched", { detail: { mediaId } })
      );
    } catch (error) {
      console.error(
        t("video.mark_watched_error", { defaultValue: "Erreur lors du marquage de la vidéo comme regardée:" }),
        error
      );
    }
  }, [mediaId, stagiaireId, t]);

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

      // Initialize Plyr with enhanced configuration (include i18n labels)
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
        // Provide localized labels for built-in controls
        i18n: {
          play: t('video.controls.play'),
          pause: t('video.controls.pause'),
          mute: t('video.controls.mute'),
          unmute: t('video.controls.unmute'),
          speed: t('video.controls.speed')
        },
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
        // URL from accesseur like /api/media/stream/filename.mp4
        video.src = `${VITE_API_URL}${url}`;
      } else if (url.startsWith('/uploads/')) {
        // Direct public path like /uploads/medias/filename.mp4
        video.src = `${VITE_API_URL_MEDIA}${url}`;
      } else if (url.startsWith('http')) {
        // Already full URL (YouTube, external, etc.)
        video.src = url;
      } else {
        // Filename only - use streaming endpoint
        video.src = `${VITE_API_URL}/media/stream/${url}`;
      }

      // Add subtitle track if available
      if (subtitleUrl) {
        const track = document.createElement('track');
        track.kind = 'captions';
        track.label = subtitleLanguage === 'fr' ? t('video.subtitle_fr_label') : subtitleLanguage;
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
        console.error(t("video.loading_prefs_error"), error);
      }

      // Save player preferences to localStorage
      player.on("volumechange", () => {
        try {
          localStorage.setItem("player-volume", player.volume.toString());
        } catch (error) {
          console.error(t("video.saving_volume_error"), error);
        }
      });

      player.on("ratechange", () => {
        try {
          localStorage.setItem("player-speed", player.speed.toString());
        } catch (error) {
          console.error(t("video.saving_speed_error"), error);
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
  }, [url, mediaId, stagiaireId, watchedThreshold, subtitleUrl, subtitleLanguage, markAsWatched, t]);

  return (
    <div className="relative max-w-full">
      {/* Zoom Controls */}
      {zoomLevel > 1 && (
        <div className="absolute top-2 right-2 z-50 flex gap-2 bg-black/70 rounded-lg p-2">
          <button
            onClick={handleZoomOut}
            className="p-2 bg-white/20 hover:bg-white/30 rounded text-white transition-colors"
            title={t('video.zoom_out')}
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <button
            onClick={handleResetZoom}
            className="px-3 py-2 bg-white/20 hover:bg-white/30 rounded text-white text-sm font-medium transition-colors"
            title={t('video.reset_zoom')}
          >
            {Math.round(zoomLevel * 100)}%
          </button>
          <button
            onClick={handleZoomIn}
            className="p-2 bg-white/20 hover:bg-white/30 rounded text-white transition-colors"
            title={t('video.zoom_in')}
            disabled={zoomLevel >= 2}
          >
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Zoom Controls - Always Visible */}
      {/* <div className="absolute bottom-16 right-2 z-40 flex flex-col gap-1 bg-black/50 rounded-lg p-1">
        <button
          onClick={handleZoomIn}
          className="p-1.5 bg-white/10 hover:bg-white/20 rounded text-white transition-colors disabled:opacity-50"
          title={t('video.zoom_in')}
          disabled={zoomLevel >= 2}
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1.5 bg-white/10 hover:bg-white/20 rounded text-white transition-colors disabled:opacity-50"
          title={t('video.zoom_out')}
          disabled={zoomLevel <= 1}
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div> */}

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
          {t('video.browser_not_supported')}
        </video>
      </div>

      {/* Keyboard Shortcuts Info */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        <span className="inline-block">
          {t('video.shortcuts')}
        </span>
      </div>
    </div>
  );
}
