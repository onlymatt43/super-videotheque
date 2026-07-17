export interface MediaItem {
  id: string;
  title: string;
  description?: string;
  thumbnail_url?: string;
  video_url?: string;
  duration?: number;
  tags: string[];
  collection?: {
    name: string;
  };
}
