export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 py-8 mt-16 text-zinc-500 text-[11px]">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center md:justify-start">
          <a href="#faq" className="hover:text-zinc-300 transition-colors">FAQ</a>
          <a href="#privacy" className="hover:text-zinc-300 transition-colors">Privacy Policy</a>
          <a href="#cookies" className="hover:text-zinc-300 transition-colors">Cookies</a>
          <a href="#complaints" className="hover:text-zinc-300 transition-colors">Plainte</a>
        </div>
        <div className="text-center md:text-right font-mono tracking-tight text-zinc-600">
          <p>© Tout droit réservé. @om43byONLYMATT 2026</p>
          <a href="mailto:connect@onlymatt.ca" className="text-zinc-400 hover:text-zinc-300 transition-colors block mt-1">
            connect@onlymatt.ca
          </a>
        </div>
      </div>
    </footer>
  );
}
