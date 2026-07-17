import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: "Super Vidéothèque",
  description: "La collection exclusive de Matt",
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
        
        {/* Subscribe-onlymatt newsletter script */}
        <Script
          src={`${process.env.NEXT_PUBLIC_SUBSCRIBE_URL}/subscribe-button.js`}
          strategy="afterInteractive"
        />
        <Script id="subscribe-config" strategy="afterInteractive">
          {`window.OM_PROJECT_SLUG = 'super-videotheque';`}
        </Script>
      </body>
    </html>
  );
}
