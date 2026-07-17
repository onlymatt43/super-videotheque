import { MediaItem } from "@/types";

const READ_ONLY_URL = process.env.READ_ONLY_URL;
const READ_ONLY_SERVICE_KEY = process.env.READ_ONLY_SERVICE_KEY;

export async function getMedia(): Promise<MediaItem[]> {
  if (!READ_ONLY_URL || !READ_ONLY_SERVICE_KEY) {
    throw new Error("Missing READ_ONLY_URL or READ_ONLY_SERVICE_KEY environment variables");
  }

  const response = await fetch(
    `${READ_ONLY_URL}/api/consumer-read?tag=super-videotheque`,
    {
      headers: {
        Authorization: `Bearer ${READ_ONLY_SERVICE_KEY}`,
      },
      next: { revalidate: 300 },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch media: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  
  // Transformer les données de read-only en MediaItem
  return data.items.map((item: any) => {
    // Extraire la première URL vidéo disponible
    const formats = item.formats || {};
    const firstFormat = Object.values(formats)[0] as any;
    const videoUrl = firstFormat?.bunny_url || firstFormat?.source_url;
    
    return {
      id: item.id,
      title: item.title || "Sans titre",
      description: item.description,
      thumbnail_url: firstFormat?.thumbnail_url,
      video_url: videoUrl,
      duration: item.duration,
      tags: item.tags || [],
      collection: item.collection,
    };
  });
}
