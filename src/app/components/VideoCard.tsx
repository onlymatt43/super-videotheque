"use client";
import { useState } from "react";
import { MediaItem } from "@/types";

interface VideoCardProps {
  video: MediaItem;
  onClick: () => void;
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  const [hovered, setHovered] = useState<boolean>(false);

  const formatDuration = (secs?: number): string => {
    if (!secs) return "";
    const mins = Math.floor(secs / 60);
    return mins > 0 ? `${mins} min` : `${secs} s`;
  };

  return (
    <div 
      className="group relative bg-zinc-900 rounded-xl overflow-hidden cursor-pointer border border-zinc-800/80 transition-all duration-300 hover:scale-[1.02] hover:border-zinc-700 shadow-md"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <div className="relative w-full bg-black overflow-hidden aspect-video">
        {video.thumbnail_url ? (
          <img 
            src={video.thumbnail_url} 
            alt={video.title} 
            className="w-full h-full object-cover transition-opacity duration-300"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-500">
            <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
        
        {/* Play button - always visible */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
            <svg className="w-8 h-8 text-black ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
        
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-mono tracking-tight text-zinc-300">
            {formatDuration(video.duration)}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-red-500 transition-colors">
          {video.title}
        </h3>
      </div>
    </div>
  );
}
