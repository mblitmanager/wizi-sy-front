import { useEffect, useRef, useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { mediaService } from "@/services/MediaService";
import { ZoomIn, ZoomOut, Loader2, AlertCircle } from "lucide-react";

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

const getSafeUrl = (url: string) => {
  if (url.startsWith('http')) return url;
  
  // Clean paths
  const cleanPath = url.startsWith('/') ? url.substring(1) : url;
  const apiRoot = VITE_API_URL.endsWith('/') ? VITE_API_URL.slice(0, -1) : VITE_API_URL;
  const mediaRoot = VITE_API_URL_MEDIA.endsWith('/') ? VITE_API_URL_MEDIA.slice(0, -1) : VITE_API_URL_MEDIA;

  if (url.startsWith('/api/')) {
    // Already has /api/ - use mediaRoot to avoid duplicate /api if apiRoot includes it
    return `${mediaRoot}${url}`;
  } 
  
  if (url.startsWith('/uploads/') || url.startsWith('uploads/')) {
    return `${mediaRoot}/${cleanPath}`;
  }

  // Default to stream endpoint
  return `${apiRoot}/media/stream/${cleanPath}`;
};

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
  const [isBuffering, setIsBuffering] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fitMode, setFitMode] = useState<'contain' | 'cover'>('contain');
  const [isVideoPortrait, setIsVideoPortrait] = useState(false);

  const toggleFitMode = () => setFitMode(prev => prev === 'contain' ? 'cover' : 'contain');

  const markAsWatched = useCallback(async () => {
    if (hasMarkedAsWatched.current) return;
    try {
      await mediaService.markAsWatched(mediaId, stagiaireId);
      hasMarkedAsWatched.current = true;
      window.dispatchEvent(
        new CustomEvent("media-watched", { detail: { mediaId } })
      );
    } catch (err) {
      setError(t("video.mark_watched_error", { defaultValue: "Erreur lors du marquage de la vidéo comme regardée:" }));
      console.error(t("video.mark_watched_error"), err);
    }
  }, [mediaId, stagiaireId, t]);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 1));
  const handleResetZoom = () => setZoomLevel(1);

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    const handleLoadedMetadata = () => {
      setIsVideoPortrait(video.videoHeight > video.videoWidth);
    };
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;
    const video = videoRef.current;

    // Destroy previous player if it exists
    if (playerRef.current) playerRef.current.destroy();

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
    video.src = getSafeUrl(url);

    // Add subtitle track if available
    if (subtitleUrl) {
      const track = document.createElement('track');
      track.kind = 'captions';
      track.label = subtitleLanguage === 'fr' ? t('video.subtitle_fr_label') : subtitleLanguage;
      track.srclang = subtitleLanguage;
      if (subtitleUrl.startsWith('/api/')) {
        track.src = `${VITE_API_URL_MEDIA}${subtitleUrl}`;
      } else if (subtitleUrl.startsWith('http')) {
        track.src = subtitleUrl;
      } else {
        track.src = `${VITE_API_URL}/api/media/subtitle/${subtitleUrl.startsWith('/') ? subtitleUrl.substring(1) : subtitleUrl}`;
      }
      track.default = true;
      video.appendChild(track);
    }

    video.load();

    // Buffering and error events
    const handleWaiting = () => setIsBuffering(true);
    const handlePlaying = () => setIsBuffering(false);
    const handleError = () => {
      setError(t('video.loading_error', { defaultValue: 'Erreur de chargement du flux vidéo.' }));
      setIsBuffering(false);
    };
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);
    video.addEventListener('error', handleError);

    // Listen to playback events
    const player = playerRef.current;
    
    // Progress tracking throttling
    let lastUpdate = 0;
    const UPDATE_INTERVAL = 10000; // 10 seconds

    const handleTimeUpdate = () => {
      if (!video.duration) return;
      const now = Date.now();
      const percentWatched = (video.currentTime / video.duration) * 100;
      
      // Mark as watched
      if (percentWatched >= watchedThreshold && !hasMarkedAsWatched.current) {
        markAsWatched();
      }

      // Send progress update periodically or on significant events
      if (now - lastUpdate > UPDATE_INTERVAL && !video.paused) {
        mediaService.updateProgress(mediaId, Math.floor(video.currentTime), Math.floor(video.duration));
        lastUpdate = now;
      }
    };
    
    // Also update on pause/end to capture final state
    player.on("pause", () => {
        if (video.currentTime > 0) {
            mediaService.updateProgress(mediaId, Math.floor(video.currentTime), Math.floor(video.duration));
        }
    });

    player.on("ended", () => {
        mediaService.updateProgress(mediaId, Math.floor(video.duration), Math.floor(video.duration));
    });

    player.on("timeupdate", handleTimeUpdate);

    // Load player preferences from localStorage
    try {
      const savedVolume = localStorage.getItem("player-volume");
      const savedSpeed = localStorage.getItem("player-speed");
      if (savedVolume) player.volume = parseFloat(savedVolume);
      if (savedSpeed) player.speed = parseFloat(savedSpeed);
    } catch (err) {
      setError(t("video.loading_prefs_error"));
      console.error(t("video.loading_prefs_error"), err);
    }

    // Save player preferences to localStorage
    player.on("volumechange", () => {
      try {
        localStorage.setItem("player-volume", player.volume.toString());
      } catch (err) {
        setError(t("video.saving_volume_error"));
        console.error(t("video.saving_volume_error"), err);
      }
    });
    player.on("ratechange", () => {
      try {
        localStorage.setItem("player-speed", player.speed.toString());
      } catch (err) {
        setError(t("video.saving_speed_error"));
        console.error(t("video.saving_speed_error"), err);
      }
    });

    return () => {
      player.off("timeupdate", handleTimeUpdate);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      video.removeEventListener('error', handleError);
      if (playerRef.current) playerRef.current.destroy();
    };
  }, [url, mediaId, stagiaireId, watchedThreshold, subtitleUrl, subtitleLanguage, markAsWatched, t]);

  return (
    <div className="relative max-w-full">
      {/* Buffering Loader */}
      {isBuffering && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 pointer-events-none">
          <Loader2 className="animate-spin w-12 h-12 text-blue-400" />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 text-white p-6">
          <AlertCircle className="w-10 h-10 mb-2 text-red-400" />
          <span className="text-lg font-semibold mb-2">{t('video.error')}</span>
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Zoom Controls - Always Visible */}
      <div className="absolute bottom-16 right-2 z-40 flex flex-col gap-1 bg-black/50 rounded-lg p-1">
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
        <button
          onClick={handleResetZoom}
          className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded text-white text-xs font-medium transition-colors mt-1"
          title={t('video.reset_zoom')}
        >
          {Math.round(zoomLevel * 100)}%
        </button>
        <button
          onClick={toggleFitMode}
          className={`p-1.5 rounded transition-colors mt-1 ${
            fitMode === 'cover' ? 'bg-[#FFB800] text-black' : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          title={fitMode === 'cover' ? t('video.fit') : t('video.fill')}
        >
          <div className="text-[10px] font-bold">{fitMode === 'cover' ? 'ADAPTER' : 'REMPLIR'}</div>
        </button>
      </div>

      {/* Video Container with Zoom */}
      <div
        ref={containerRef}
        className={`rounded-xl overflow-hidden bg-black shadow-lg border border-gray-900 transition-all duration-300 ${
           isVideoPortrait ? 'aspect-[9/16] max-h-[70vh] mx-auto' : 'aspect-video'
        }`}
        style={{
          transform: `scale(${zoomLevel})`,
          transformOrigin: "center center",
        }}
      >
        <video
          ref={videoRef}
          className="w-full h-full"
          style={{ objectFit: fitMode }}
          controls={false}
          playsInline
          preload="metadata"
        >
          <source src={getSafeUrl(url)} type="video/mp4" />
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
