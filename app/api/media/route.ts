import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface ReadOnlyMediaItem {
  id: string;
  title: string;
  description?: string;
  type: string;
  formats?: Record<string, {
    thumbnail_url?: string;
    bunny_url?: string;
  }>;
  tags: string[];
}

export async function GET() {
  const readOnlyUrl = process.env.READ_ONLY_URL;
  const readOnlyKey = process.env.READ_ONLY_SERVICE_KEY;

  if (!readOnlyUrl || !readOnlyKey) {
    return NextResponse.json(
      { error: "Configuration manquante" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(
      `${readOnlyUrl}/api/consumer-read?tag=super-videotheque`,
      {
        headers: {
          Authorization: `Bearer ${readOnlyKey}`,
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      throw new Error(`read-only error: ${res.status}`);
    }

    const data = await res.json();
    const items: ReadOnlyMediaItem[] = data.items || [];

    // Mapper les données pour le frontend
    const mappedItems = items
      .filter((item) => item.type === "video")
      .map((item) => {
        const formats = item.formats || {};
        const firstFormat = Object.values(formats)[0];
        const thumbnailUrl = firstFormat?.thumbnail_url;

        return {
          id: item.id,
          title: item.title,
          description: item.description,
          thumbnail_url: thumbnailUrl,
          tags: item.tags,
        };
      });

    return NextResponse.json({ items: mappedItems });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Erreur de chargement des médias" },
      { status: 500 }
    );
  }
}
