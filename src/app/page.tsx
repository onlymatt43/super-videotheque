import { getMedia } from "@/lib/readonly";
import VideoGrid from "./components/VideoGrid";
import Footer from "./components/Footer";

export const revalidate = 300;

export default async function Home() {
  const videos = await getMedia().catch(() => []);

  return (
    <div className="flex-1 flex flex-col justify-between">
      <main className="max-w-7xl w-full mx-auto px-4 md:px-8 pt-16 pb-8">
        <header className="mb-10">
          <h1 className="text-3xl md:text-5xl font-black tracking-tighter uppercase text-white">
            SUPER VIDÉOTHÈQUE
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            La collection exclusive de Matt.
          </p>
        </header>

        <VideoGrid videos={videos} />
      </main>
      <Footer />
    </div>
  );
}
