import { useEffect, useRef } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

interface Props {
  url: string; // exemple : "uploads/medias/1745998203.mp4"
}

const VITE_API_URL = import.meta.env.VITE_API_URL;

export default function VideoPlayer({ url }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);

  useEffect(() => {
    const video = videoRef.current;

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
      video.src = `${VITE_API_URL}/media/stream/${url}`;
      video.load();
      video.pause();
    }
  }, [url]);

  return (
    <video
      ref={videoRef}
      className="w-full rounded-lg"
      controls
      playsInline
      preload="metadata">
      <source src={`${VITE_API_URL}/media/stream/${url}`} type="video/mp4" />
      Votre navigateur ne supporte pas la lecture de vidéos HTML5.
    </video>
  );
}
