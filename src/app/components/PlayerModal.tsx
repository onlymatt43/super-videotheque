"use client";
import { useEffect, useRef, useState } from "react";
import { MediaItem } from "@/types";
import Hls from "hls.js";

interface PlayerModalProps {
  video: MediaItem;
  onClose: () => void;
}

export default function PlayerModal({ video, onClose }: PlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    if (!videoRef.current || !video.video_url) return;

    const videoEl = videoRef.current;
    const videoUrl = video.video_url;

    // Vérifier si c'est une URL HLS
    if (videoUrl.includes('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
        });
        
        hls.loadSource(videoUrl);
        hls.attachMedia(videoEl);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoEl.play().catch(err => {
            console.error("Erreur de lecture:", err);
            setError("Impossible de lire la vidéo");
          });
        });
        
        hls.on(Hls.Events.ERROR, (event, data) => {
          console.error("Erreur HLS:", data);
          if (data.fatal) {
            setError("Erreur de chargement de la vidéo");
          }
        });
        
        return () => {
          hls.destroy();
        };
      } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
        // Safari natif supporte HLS
        videoEl.src = videoUrl;
        videoEl.play().catch(err => {
          console.error("Erreur de lecture:", err);
          setError("Impossible de lire la vidéo");
        });
      } else {
        setError("Votre navigateur ne supporte pas la lecture HLS");
      }
    } else {
      // Vidéo standard (MP4, etc.)
      videoEl.src = videoUrl;
      videoEl.play().catch(err => {
        console.error("Erreur de lecture:", err);
        setError("Impossible de lire la vidéo");
      });
    }
  }, [video.video_url]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-5xl bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors text-xl font-bold p-1 z-10"
        >
          ✕
        </button>
        <h2 className="text-lg font-bold mb-4 pr-10 truncate text-zinc-100">{video.title}</h2>

        <div className="relative bg-black rounded-xl overflow-hidden border border-zinc-950 aspect-video">
          {error ? (
            <div className="w-full h-full flex items-center justify-center text-zinc-500">
              <p>{error}</p>
            </div>
          ) : video.video_url ? (
            <video
              ref={videoRef}
              controls
              autoPlay
              className="w-full h-full"
              playsInline
            >
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-500">
              <p>Vidéo non disponible</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
