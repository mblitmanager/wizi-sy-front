import { useEffect, useRef, useState } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

const VITE_API_URL = import.meta.env.VITE_API_URL_MEDIA;
interface Props {
  url: string;
}

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

    // Mettre à jour la source sans redémarrer le player
    if (playerRef.current) {
      playerRef.current.source = {
        type: "video",
        sources: [
          {
            src: `${VITE_API_URL}/${url}`,
            type: "video/mp4",
          },
        ],
      };

      playerRef.current.pause(); // mettre en pause par défaut comme YouTube
    }

    return () => {
      // Ne détruit pas le player à chaque fois, sauf si on démonte complètement
      // playerRef.current?.destroy();
    };
  }, [url]);

  return <video ref={videoRef} className="w-full rounded-lg" />;
}
