import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchLinks, LinkItem } from "../lib/supabase";
import { Tv, ExternalLink, RefreshCw, Globe, Search } from "lucide-react";

export const Route = createFileRoute("/entertainment")({
  head: () => ({
    meta: [
      { title: "Entertainment & Media Hub — NetLink Fiber" },
      { name: "description", content: "Direct access to high-speed local FTP servers, IPTV channels, 4K streaming portals, and music." },
      { property: "og:title", content: "Entertainment Hub | NetLink Fiber" },
      { property: "og:description", content: "Quick links to popular streaming, movies, FTP servers, TV, and music platforms." },
    ],
  }),
  component: EntertainmentPage,
});

export function EntertainmentPage() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const loadLinks = async () => {
    setLoading(true);
    const data = await fetchLinks();
    setLinks(data);
    setLoading(false);
  };

  useEffect(() => {
    loadLinks();
  }, []);

  const defaultCats = ["All", "FTP & Storage", "Live TV & IPTV", "Streaming", "Music", "Utilities"];
  const dynamicCats = Array.from(new Set(links.map((l) => l.category).filter(Boolean)));
  const categories = Array.from(new Set([...defaultCats, ...dynamicCats]));

  const filteredLinks = links.filter((l) => {
    const matchesCat = activeCategory === "All" || l.category === activeCategory;
    const matchesSearch =
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.url.toLowerCase().includes(search.toLowerCase()) ||
      (l.desc && l.desc.toLowerCase().includes(search.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-[#141414] text-white">
      {/* Sticky Search & Category Filter Bar */}
      <section className="sticky top-[96px] z-40 bg-[#0B0C0E] border-b border-[#24272D] py-3 text-white shadow-2xl">
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search portals, FTP addresses, or platforms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#18191D] border border-[#24272D] rounded-xl text-sm text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D2F500]"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 whitespace-nowrap flex-nowrap md:flex-wrap no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex-shrink-0 ${
                    activeCategory === cat
                      ? "bg-[#D2F500] text-black shadow-[0_0_15px_rgba(210,245,0,0.4)]"
                      : "bg-[#18191D] text-neutral-300 hover:bg-[#202227] border border-[#24272D]"
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button
                onClick={loadLinks}
                className="p-2.5 rounded-xl bg-[#18191D] text-neutral-300 hover:bg-[#202227] border border-[#24272D] flex-shrink-0"
                title="Refresh links"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#D2F500]" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Grid */}
      <section className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-12">
        {loading ? (
          <div className="py-20 text-center text-neutral-400 flex flex-col items-center gap-3 font-bold">
            <RefreshCw className="w-8 h-8 animate-spin text-[#D2F500]" />
            <p>Loading media portals...</p>
          </div>
        ) : filteredLinks.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-[#24272D] rounded-2xl p-8 bg-[#18191D]">
            <Globe className="w-12 h-12 text-neutral-500 mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-black text-white uppercase">No links found</h3>
            <p className="text-sm text-neutral-400 mt-1 font-medium">
              Add new links in the <a href="/admin" className="text-[#D2F500] underline font-bold">Admin Portal</a>.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4 md:gap-5 grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8">
            {filteredLinks.map((l) => (
              <a
                key={l.id || l.url}
                href={l.url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center text-center cursor-pointer min-w-0 gap-2"
              >
                <div className="w-full aspect-square max-w-[110px] sm:max-w-[130px] md:max-w-[150px] lg:max-w-[170px] rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#252834] to-[#161821] border border-[#353A4A] group-hover:border-[#D2F500] group-hover:bg-[#2A2E3D] group-hover:shadow-[0_0_35px_rgba(210,245,0,0.4)] flex items-center justify-center text-4xl sm:text-5xl md:text-6xl group-hover:scale-105 transition-all overflow-hidden p-3 sm:p-4 shadow-xl flex-shrink-0">
                  {l.icon && (l.icon.startsWith("http") || l.icon.startsWith("data:image")) ? (
                    <img src={l.icon} alt="" className="w-full h-full object-contain filter drop-shadow-[0_0_3px_rgba(255,255,255,0.7)]" />
                  ) : l.icon ? (
                    <span className="drop-shadow-[0_0_12px_rgba(210,245,0,0.5)]">{l.icon}</span>
                  ) : (
                    <Tv className="w-12 h-12 sm:w-14 sm:h-14 text-[#D2F500] drop-shadow-[0_0_15px_rgba(210,245,0,0.6)]" />
                  )}
                </div>
                <span className="font-extrabold text-xs sm:text-sm text-neutral-200 group-hover:text-[#D2F500] transition-colors line-clamp-2 leading-tight text-center max-w-full break-words">
                  {l.name}
                </span>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}