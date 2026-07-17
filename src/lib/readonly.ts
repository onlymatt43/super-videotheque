import { MediaItem } from "@/types";

const READ_ONLY_URL = process.env.READ_ONLY_URL;
const READ_ONLY_SERVICE_KEY = process.env.READ_ONLY_SERVICE_KEY;

export async function getMedia(): Promise<MediaItem[]> {
  if (!READ_ONLY_URL || !READ_ONLY_SERVICE_KEY) {
    console.error("Missing READ_ONLY_URL or READ_ONLY_SERVICE_KEY environment variables");
    return [];
  }

  try {
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
      console.error(`Failed to fetch media: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    
    // Transformer les données de read-only en MediaItem
    return data.items.map((item: any) => {
      const formats = item.formats || {};
      
      // Prioriser les formats : 16x9 > 9x16 > 1x1 > preview > default
      const formatOrder = ['16x9', '9x16', '1x1', 'preview', 'default'];
      let selectedFormat: any = null;
      
      for (const key of formatOrder) {
        if (formats[key]) {
          selectedFormat = formats[key];
          break;
        }
      }
      
      // Fallback: prendre le premier format disponible
      if (!selectedFormat) {
        selectedFormat = Object.values(formats)[0] as any;
      }
      
      const videoUrl = selectedFormat?.bunny_url || selectedFormat?.source_url;
      const thumbnailUrl = selectedFormat?.thumbnail_url || item.thumbnail_url;
      
      console.log(`[readonly] Media ${item.id}:`, {
        title: item.title,
        videoUrl,
        thumbnailUrl,
        formats: Object.keys(formats),
      });
      
      return {
        id: item.id,
        title: item.title || "Sans titre",
        description: item.description,
        thumbnail_url: thumbnailUrl,
        video_url: videoUrl,
        duration: item.duration,
        tags: item.tags || [],
        collection: item.collection,
      };
    });
  } catch (error) {
    console.error("Error fetching media:", error);
    return [];
  }
}
