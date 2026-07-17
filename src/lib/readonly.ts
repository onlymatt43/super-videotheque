import { MediaItem } from "@/types";

const READ_ONLY_URL = process.env.READ_ONLY_URL;
const READ_ONLY_SERVICE_KEY = process.env.READ_ONLY_SERVICE_KEY;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);
}

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
    
    return data.items.map((item: any) => {
      const formats = item.formats || {};
      
      const formatOrder = ['16x9', '9x16', '1x1', 'preview', 'default'];
      let selectedFormat: any = null;
      
      for (const key of formatOrder) {
        if (formats[key]) {
          selectedFormat = formats[key];
          break;
        }
      }
      
      if (!selectedFormat) {
        selectedFormat = Object.values(formats)[0] as any;
      }
      
      const videoUrl = selectedFormat?.bunny_url || selectedFormat?.source_url;
      const thumbnailUrl = selectedFormat?.thumbnail_url || item.thumbnail_url;
      
      return {
        id: item.id,
        title: item.title || "Sans titre",
        slug: slugify(item.title || "sans-titre"),
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
