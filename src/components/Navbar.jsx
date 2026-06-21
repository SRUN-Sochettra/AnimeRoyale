import { IconBrokenEgg } from "./Icons";

const links = [
  { name: "Profile Scanner", href: "/" },
  { name: "AnimeRoyale", href: "/", active: true },
  { name: "Commit Shame", href: "/commit-shame" },
  { name: "README Rater", href: "/readme-rater" },
  { name: "Stack Roast", href: "/stack-roast" }
];

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-brown-300 bg-white/50 backdrop-blur-sm">
      <div className="mx-auto flex h-20 max-w-6xl items-center px-4 sm:px-6 lg:px-8">
        <a href="/" className="flex shrink-0 items-center gap-3">
          <IconBrokenEgg size={28} />
          <span className="font-display text-2xl font-black text-brown-700">
            EggScan
          </span>
        </a>

        <div className="hide-scrollbar ml-10 hidden h-full items-center gap-10 overflow-x-auto sm:flex">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={[
                "inline-flex h-full items-center border-b-2 px-1 text-lg font-semibold transition-colors",
                link.active
                  ? "border-brown-700 text-brown-700"
                  : "border-transparent text-brown-500 hover:border-brown-300 hover:text-brown-700"
              ].join(" ")}
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="hide-scrollbar ml-6 flex h-full flex-1 items-center gap-5 overflow-x-auto sm:hidden">
          {links.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={[
                "inline-flex h-full items-center whitespace-nowrap border-b-2 text-sm font-semibold transition-colors",
                link.active
                  ? "border-brown-700 text-brown-700"
                  : "border-transparent text-brown-500 hover:text-brown-700"
              ].join(" ")}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
