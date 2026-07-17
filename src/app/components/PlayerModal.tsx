"use client";
import { useEffect, useRef } from "react";
import { MediaItem } from "@/types";

interface PlayerModalProps {
  video: MediaItem;
  onClose: () => void;
}

export default function PlayerModal({ video, onClose }: PlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

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
          {video.video_url ? (
            <video
              ref={videoRef}
              src={video.video_url}
              controls
              autoPlay
              className="w-full h-full"
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
