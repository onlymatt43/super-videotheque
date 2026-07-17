"use client";

import Image from "next/image";

interface MediaItem {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  tags: string[];
}

interface MediaCardProps {
  media: MediaItem;
}

export function MediaCard({ media }: MediaCardProps) {
  const handleClick = () => {
    // Rediriger vers payment-only avec le product_slug basé sur les tags
    const productSlug = media.tags.find(t => t.startsWith("product:"))?.replace("product:", "") || "super-videotheque";
    window.location.href = `https://payment.onlymatt.ca/validate?product=${productSlug}&media_id=${media.id}`;
  };

  return (
    <div
      onClick={handleClick}
      className="group relative aspect-video bg-white/5 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-white/30 transition-all"
    >
      {media.thumbnail_url ? (
        <Image
          src={media.thumbnail_url}
          alt={media.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-white/40">
          <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform">
        <h3 className="text-white font-semibold text-sm sm:text-base line-clamp-2">
          {media.title}
        </h3>
        {media.description && (
          <p className="text-white/70 text-xs sm:text-sm mt-1 line-clamp-2">
            {media.description}
          </p>
        )}
      </div>

      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-white/90 text-black px-3 py-1 rounded-full text-xs font-semibold">
          Voir
        </div>
      </div>
    </div>
  );
}
