"use client";
import { useState } from "react";
import { MediaItem } from "@/types";
import VideoCard from "./VideoCard";
import PlayerModal from "./PlayerModal";

interface VideoGridProps {
  videos: MediaItem[];
}

export default function VideoGrid({ videos }: VideoGridProps) {
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [filter, setFilter] = useState<string>("All");

  // Extraire les catégories uniques depuis les tags
  const categories = ["All", ...Array.from(new Set(videos.flatMap(v => v.tags.filter(t => !t.startsWith('source:') && !t.startsWith('library:')))))];
  const filtered = filter === "All" ? videos : videos.filter(v => v.tags.includes(filter));

  return (
    <div>
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap border ${
              filter === cat
                ? "bg-white text-black border-white font-bold"
                : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:bg-zinc-900"
            }`}
          >
            {cat === "All" ? "Tout" : cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-800 rounded-2xl">
          <p className="text-zinc-500 text-sm">Aucun élément disponible dans cette section.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-start">
          {filtered.map(video => (
            <VideoCard key={video.id} video={video} onClick={() => setSelected(video)} />
          ))}
        </div>
      )}

      {selected && (
        <PlayerModal
          video={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
}
