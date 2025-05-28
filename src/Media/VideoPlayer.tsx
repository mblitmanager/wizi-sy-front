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
        quality: {
          default: 1080,
          options: [1080, 720, 480],
        },
        ratio: "16:9",
        volume: 0.5,
      });
    }

    if (video) {
      video.src = `${VITE_API_URL}/media/stream/${url}`;
      video.load();
      video.pause();
    }
  }, [url]);

  return (
    <div className="max-w-full aspect-video rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-full object-contain"
        controls={false}
        playsInline
        preload="metadata"
      >
        <source
          className="w-full object-contain "
          src={`${VITE_API_URL}/media/stream/${url}`}
          type="video/mp4"
        />
        Votre navigateur ne supporte pas la lecture de vidéos HTML5.
      </video>
    </div>
  );
}

// import { useEffect, useRef } from "react";
// import Plyr from "plyr";
// import "plyr/dist/plyr.css";

// interface Props {
//   url: string; // exemple : "uploads/medias/1745998203.mp4"
// }

// const VITE_API_URL = import.meta.env.VITE_API_URL;

// export default function VideoPlayer({ url }: Props) {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const playerRef = useRef<Plyr | null>(null);

//   useEffect(() => {
//     const video = videoRef.current;

//     if (!video) return;

//     // Détruire le lecteur précédent s'il existe
//     if (playerRef.current) {
//       playerRef.current.destroy();
//     }

//     // Initialiser Plyr
//     playerRef.current = new Plyr(video, {
//       controls: [
//         "play-large",
//         "play",
//         "progress",
//         "current-time",
//         "mute",
//         "volume",
//         "settings",
//         "pip",
//         "fullscreen",
//       ],
//       settings: ["quality", "speed"],
//       ratio: "16:9",
//     });

//     // Mettre à jour la source vidéo
//     video.src = `${VITE_API_URL}/media/stream/${url}`;
//     video.load();

//     return () => {
//       // Nettoyage
//       if (playerRef.current) {
//         playerRef.current.destroy();
//       }
//     };
//   }, [url]);

//   return (
//     <div className="max-w-full aspect-video rounded-lg overflow-hidden">
//       <video
//         ref={videoRef}
//         className="w-full h-full object-contain"
//         controls={false}
//         playsInline
//         preload="metadata"
//       >
//         <source src={`${VITE_API_URL}/media/stream/${url}`} type="video/mp4" />
//         Votre navigateur ne supporte pas la lecture de vidéos HTML5.
//       </video>
//     </div>
//   );
// }
