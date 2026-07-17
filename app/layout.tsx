import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Super Vidéothèque",
  description: "Collection de vidéos exclusives",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="bg-black text-white antialiased">
        {children}
      </body>
    </html>
  );
}
