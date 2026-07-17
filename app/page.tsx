import { MediaGrid } from "@/components/MediaGrid";

export default function Home() {
  return (
    <main className="min-h-screen">
      <header className="border-b border-white/10 px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-center">
          Super Vidéothèque
        </h1>
      </header>
      
      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <MediaGrid />
      </section>
    </main>
  );
}
