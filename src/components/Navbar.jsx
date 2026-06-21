import { IconBrokenEgg } from "./Icons";

export default function Navbar() {
  function goHome() {
    window.location.href = "/";
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-brown-300 bg-white/50 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <button type="button" onClick={goHome} className="focus-egg flex items-center gap-2 rounded-xl" aria-label="Go to EggScan home">
          <IconBrokenEgg size={25} />
          <span className="font-display text-xl font-black text-brown-700">EggScan</span>
        </button>
        <div className="hide-scrollbar flex items-center gap-5 overflow-x-auto pl-4 text-sm font-bold text-brown-500">
          <span className="whitespace-nowrap border-b-2 border-brown-700 py-5 text-brown-700">AnimeRoyale</span>
          <span className="whitespace-nowrap py-5 opacity-70">Egg Universe</span>
        </div>
      </div>
    </nav>
  );
}
