"use client";
import { useEffect, useRef, useState } from "react";
import { MediaItem } from "@/types";
import Hls from "hls.js";
import Script from "next/script";

declare global {
  interface Window {
    OM_PAYMENT_PRODUCT_SLUG?: string;
    OM_PAYMENT_OPEN?: () => void;
    __omPaymentLoaded?: boolean;
  }
}

interface PlayerModalProps {
  video: MediaItem;
  onClose: () => void;
}

type Phase = "locked" | "loading" | "playing" | "error";

export default function PlayerModal({ video, onClose }: PlayerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [phase, setPhase] = useState<Phase>("locked");
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  useEffect(() => {
    if (!videoRef.current || !signedUrl) return;

    const videoEl = videoRef.current;

    if (signedUrl.includes('.m3u8')) {
      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true });
        hls.loadSource(signedUrl);
        hls.attachMedia(videoEl);
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          videoEl.play().catch(err => {
            console.error("[HLS] Erreur de lecture:", err);
            setError("Impossible de lire la vidéo");
            setPhase("error");
          });
        });
        
        hls.on(Hls.Events.ERROR, (_event, data) => {
          console.error("[HLS] Erreur HLS:", data);
          if (data.fatal) {
            setError(`Erreur de chargement: ${data.type} - ${data.details}`);
            setPhase("error");
          }
        });
        
        return () => { hls.destroy(); };
      } else if (videoEl.canPlayType('application/vnd.apple.mpegurl')) {
        videoEl.src = signedUrl;
        videoEl.play().catch(err => {
          console.error("[PlayerModal] Erreur de lecture native:", err);
          setError("Impossible de lire la vidéo");
          setPhase("error");
        });
      } else {
        setError("Votre navigateur ne supporte pas la lecture HLS");
        setPhase("error");
      }
    } else {
      videoEl.src = signedUrl;
      videoEl.play().catch(err => {
        console.error("[PlayerModal] Erreur de lecture:", err);
        setError("Impossible de lire la vidéo");
        setPhase("error");
      });
    }
  }, [signedUrl]);

  const handlePaymentSuccess = async () => {
    setPhase("loading");
    setError(null);

    try {
      const res = await fetch("/api/rental", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ movieId: video.id, customerEmail: email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Accès refusé");
        setPhase("error");
        return;
      }

      setSignedUrl(data.signedUrl);
      setPhase("playing");
    } catch (err) {
      console.error("Rental error:", err);
      setError("Erreur de connexion au serveur");
      setPhase("error");
    }
  };

  const openPayment = () => {
    const productTag = video.tags.find(t => t.startsWith('product_slug='));
    const productSlug = productTag ? productTag.split('=')[1] : 'super-videotheque';
    window.OM_PAYMENT_PRODUCT_SLUG = productSlug;
    if (window.OM_PAYMENT_OPEN) {
      window.OM_PAYMENT_OPEN();
    }
  };

  return (
    <>
      <Script
        src={`${process.env.NEXT_PUBLIC_PAYMENT_ONLY_URL || "https://payment.onlymatt.ca"}/payment-button.js`}
        strategy="lazyOnload"
      />
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm animate-fadeIn"
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <div className="relative w-full max-w-5xl bg-zinc-900 rounded-2xl p-6 border border-zinc-800 shadow-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors text-xl font-bold p-1 z-10"
          >
            ✕
          </button>
          <h2 className="text-lg font-bold mb-4 pr-10 truncate text-zinc-100">{video.title}</h2>

          <div className="relative bg-black rounded-xl overflow-hidden border border-zinc-950 aspect-video">
            {phase === "locked" && (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6">
                <svg className="w-16 h-16 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-zinc-400 text-sm text-center">Ce contenu est réservé aux abonnés.</p>
                <div className="flex flex-col gap-3 w-full max-w-xs">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre email"
                    className="px-4 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-white text-sm focus:outline-none focus:border-zinc-500"
                  />
                  <button
                    onClick={openPayment}
                    disabled={!email.includes("@")}
                    className="px-4 py-2 rounded-lg bg-white text-black font-semibold text-sm hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Accéder
                  </button>
                  <button
                    onClick={handlePaymentSuccess}
                    disabled={!email.includes("@")}
                    className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    J'ai déjà acheté
                  </button>
                </div>
                <p className="text-zinc-600 text-xs text-center mt-2">
                  Besoin d'aide?{' '}
                  <a href="mailto:connect@onlymatt.ca" className="text-zinc-400 underline hover:text-zinc-300">
                    connect@onlymatt.ca
                  </a>
                </p>
              </div>
            )}

            {phase === "loading" && (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-zinc-600 border-t-white rounded-full animate-spin" />
              </div>
            )}

            {phase === "error" && (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 p-6">
                <p className="text-zinc-400 text-sm text-center">{error}</p>
                <p className="text-zinc-500 text-xs text-center">
                  Pour obtenir un accès, contactez directement{' '}
                  <a href="mailto:connect@onlymatt.ca" className="text-zinc-300 underline hover:text-white">
                    connect@onlymatt.ca
                  </a>
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setPhase("locked"); setError(null); }}
                    className="px-4 py-2 rounded-lg bg-zinc-800 text-zinc-300 text-sm hover:bg-zinc-700 transition-colors"
                  >
                    Réessayer
                  </button>
                  <button
                    onClick={openPayment}
                    className="px-4 py-2 rounded-lg bg-white text-black font-semibold text-sm hover:bg-zinc-200 transition-colors"
                  >
                    Acheter
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg bg-zinc-900 text-zinc-400 text-sm hover:bg-zinc-800 transition-colors"
                  >
                    Fermer
                  </button>
                </div>
              </div>
            )}

            {phase === "playing" && (
              <video
                ref={videoRef}
                controls
                autoPlay
                className="w-full h-full"
                playsInline
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
