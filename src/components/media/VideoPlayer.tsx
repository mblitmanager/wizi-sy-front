import { useEffect, useRef } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface Props {
  url: string; // exemple : "uploads/medias/1745998203.mp4" ou URL YouTube
  onDuration?: (seconds: number) => void;
}

const VITE_API_URL = import.meta.env.VITE_API_URL;

function extractYoutubeId(url: string): string | null {
  try {
    // shorts
    const shorts = url.match(/(?:youtube\.com\/shorts\/)([\w-]+)/);
    if (shorts && shorts[1]) return shorts[1];
    // watch
    const vParam = url.match(/[?&]v=([\w-]+)/);
    if (vParam && vParam[1]) return vParam[1];
    // youtu.be
    const short = url.match(/youtu\.be\/([\w-]+)/);
    if (short && short[1]) return short[1];
  } catch (_) { }
  return null;
}

function ensureYoutubeApi(): Promise<void> {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }
    const existing = document.getElementById("youtube-iframe-api");
    if (!existing) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.id = "youtube-iframe-api";
      document.body.appendChild(tag);
    }
    const checkReady = () => {
      if (window.YT && window.YT.Player) {
        resolve();
      } else {
        setTimeout(checkReady, 100);
      }
    };
    checkReady();
  });
}

export default function VideoPlayer({ url, onDuration }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);
  const ytProbeRef = useRef<any>(null);
  const isYoutube = !!extractYoutubeId(url);

  useEffect(() => {
    const video = videoRef.current;

    if (!isYoutube) {
      if (video && !playerRef.current) {
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
        });
      }

      if (video) {
        const onMeta = () => {
          if (onDuration && !isNaN(video.duration)) {
            onDuration(Math.floor(video.duration));
          }
        };
        video.addEventListener("loadedmetadata", onMeta);
        video.src = `${VITE_API_URL}/media/stream/${url}`;
        video.load();
        video.pause();
        return () => video.removeEventListener("loadedmetadata", onMeta);
      }
      return;
    }

    // YouTube: charger IFrame API et mesurer durée via un player masqué
    const id = extractYoutubeId(url)!;
    let container: HTMLDivElement | null = null;
    let destroyed = false;

    ensureYoutubeApi().then(() => {
      if (destroyed) return;
      container = document.createElement("div");
      container.style.position = "absolute";
      container.style.width = "0";
      container.style.height = "0";
      container.style.overflow = "hidden";
      container.style.pointerEvents = "none";
      container.id = `yt-probe-${id}-${Date.now()}`;
      document.body.appendChild(container);

      ytProbeRef.current = new window.YT.Player(container.id, {
        videoId: id,
        events: {
          onReady: (e: any) => {
            try {
              const d = e?.target?.getDuration?.();
              if (onDuration && typeof d === "number" && d > 0) {
                onDuration(Math.floor(d));
              }
            } catch (_) { }
            // détruire rapidement pour libérer
            setTimeout(() => {
              try {
                ytProbeRef.current?.destroy?.();
              } catch (_) { }
              if (container && container.parentNode) {
                container.parentNode.removeChild(container);
              }
            }, 0);
          },
        },
      });
    });

    return () => {
      destroyed = true;
      try {
        ytProbeRef.current?.destroy?.();
      } catch (_) { }
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, [url, onDuration, isYoutube]);

  return (
    <div className="w-full aspect-video rounded-lg overflow-hidden">
      {/* Pour YouTube, on n’affiche pas la balise <video>; le player visible est géré par Plyr si non-YouTube */}
      {!isYoutube && (
        <video
          ref={videoRef}
          className="w-full h-full object-contain"
          controls
          playsInline
          preload="metadata">
          <source src={`${VITE_API_URL}/media/stream/${url}`} type="video/mp4" />
          Votre navigateur ne supporte pas la lecture de vidéos HTML5.
        </video>
      )}
      {isYoutube && (
        <div className="w-full h-full bg-black flex items-center justify-center text-white text-sm">
          Lecture YouTube
        </div>
      )}
    </div>
  );
}
