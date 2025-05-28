import { useEffect, useRef } from "react";
import Plyr from "plyr";
import "plyr/dist/plyr.css";

interface Props {
  url: string;
}

const VITE_API_URL = import.meta.env.VITE_API_URL;

const isExternalUrl = (url: string) => {
  return url.startsWith('http://') || url.startsWith('https://');
};

const getEmbedUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    
    // YouTube
    if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
      const videoId = urlObj.hostname.includes('youtu.be') 
        ? urlObj.pathname.slice(1)
        : new URLSearchParams(urlObj.search).get('v');
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // LinkedIn
    if (urlObj.hostname.includes('linkedin.com')) {
      const videoId = urlObj.pathname.split('/').pop();
      return `https://www.linkedin.com/embed/feed/update/${videoId}`;
    }
    
    // Dailymotion
    if (urlObj.hostname.includes('dailymotion.com')) {
      const videoId = urlObj.pathname.split('/').pop();
      return `https://www.dailymotion.com/embed/video/${videoId}`;
    }
    
    // Vimeo
    if (urlObj.hostname.includes('vimeo.com')) {
      const videoId = urlObj.pathname.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }
    
    return url;
  } catch {
    return url;
  }
};

export default function VideoPlayer({ url }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Plyr | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExternalUrl(url)) {
      const embedUrl = getEmbedUrl(url);
      if (containerRef.current) {
        containerRef.current.innerHTML = `
          <iframe
            src="${embedUrl}"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="w-full h-full rounded-lg"
          ></iframe>
        `;
      }
    } else {
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

  if (isExternalUrl(url)) {
    return (
      <div 
        ref={containerRef}
        className="w-full aspect-video max-h-[60vh] sm:max-h-none rounded-lg overflow-hidden"
      />
    );
  }

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
