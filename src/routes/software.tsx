import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchSoftware, SoftwareItem } from "../lib/supabase";
import { 
  Download, 
  Search, 
  Tv, 
  Activity, 
  PlayCircle, 
  Sliders, 
  Monitor, 
  ExternalLink,
  CheckCircle2,
  RefreshCw
} from "lucide-react";

export const Route = createFileRoute("/software")({
  head: () => ({
    meta: [
      { title: "Software Center — NetLink Fiber Tools & Downloads" },
      { name: "description", content: "Download official IPTV players, ISP network diagnostics, route analyzers, and router configurators." },
      { property: "og:title", content: "Software Center — NetLink Fiber" },
      { property: "og:description", content: "High performance network utilities, media players, and ISP software." },
    ],
  }),
  component: SoftwarePage,
});

export function SoftwarePage() {
  const [softwareList, setSoftwareList] = useState<SoftwareItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const loadData = async () => {
    setLoading(true);
    const data = await fetchSoftware();
    setSoftwareList(data);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const defaultCats = ["All", "IPTV & Streaming", "Network Tools", "Media Players", "ISP Utilities"];
  const dynamicCats = Array.from(new Set(softwareList.map((s) => s.category).filter(Boolean)));
  const categories = Array.from(new Set([...defaultCats, ...dynamicCats]));

  const filteredSoftware = softwareList.filter((item) => {
    const matchesCategory = selectedCategory === "All" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase()) ||
      item.platform.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
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
                placeholder="Search software, platforms, or tools..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-[#18191D] border border-[#24272D] rounded-xl text-sm text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D2F500]"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 whitespace-nowrap flex-nowrap md:flex-wrap no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all flex-shrink-0 ${
                    selectedCategory === cat
                      ? "bg-[#D2F500] text-black shadow-[0_0_15px_rgba(210,245,0,0.4)]"
                      : "bg-[#18191D] text-neutral-300 hover:bg-[#202227] border border-[#24272D]"
                  }`}
                >
                  {cat}
                </button>
              ))}
              <button
                onClick={loadData}
                className="p-2.5 rounded-xl bg-[#18191D] text-neutral-300 hover:bg-[#202227] border border-[#24272D] flex-shrink-0"
                title="Refresh software"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#D2F500]" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Software Grid */}
      <section className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-12">
        {loading ? (
          <div className="py-20 text-center text-neutral-400 flex flex-col items-center gap-3 font-bold">
            <RefreshCw className="w-8 h-8 animate-spin text-[#D2F500]" />
            <p>Loading software library...</p>
          </div>
        ) : filteredSoftware.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-[#24272D] rounded-2xl p-8 bg-[#18191D]">
            <Download className="w-12 h-12 text-neutral-500 mx-auto mb-3 opacity-50" />
            <h3 className="text-lg font-black text-white uppercase">No software found</h3>
            <p className="text-sm text-neutral-400 mt-1 font-medium">
              Try adjusting your search criteria or category filter.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:gap-4 md:gap-5 grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8">
            {filteredSoftware.map((item) => (
              <a
                key={item.id || item.title}
                href={item.download_url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col items-center text-center cursor-pointer min-w-0 gap-2"
              >
                <div className="w-full aspect-square max-w-[110px] sm:max-w-[130px] md:max-w-[150px] lg:max-w-[170px] rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#252834] to-[#161821] border border-[#353A4A] group-hover:border-[#D2F500] group-hover:bg-[#2A2E3D] group-hover:shadow-[0_0_35px_rgba(210,245,0,0.4)] flex items-center justify-center text-4xl sm:text-5xl md:text-6xl group-hover:scale-105 transition-all overflow-hidden p-3 sm:p-4 shadow-xl flex-shrink-0">
                  {item.icon && (item.icon.startsWith("http") || item.icon.startsWith("data:image")) ? (
                    <img src={item.icon} alt="" className="w-full h-full object-contain filter drop-shadow-[0_0_3px_rgba(255,255,255,0.7)]" />
                  ) : item.icon ? (
                    <span className="drop-shadow-[0_0_12px_rgba(210,245,0,0.5)]">{item.icon}</span>
                  ) : (
                    <Download className="w-12 h-12 sm:w-14 sm:h-14 text-[#D2F500] drop-shadow-[0_0_15px_rgba(210,245,0,0.6)]" />
                  )}
                </div>
                <div className="flex flex-col items-center min-w-0 max-w-full">
                  <span className="font-extrabold text-xs sm:text-sm text-neutral-200 group-hover:text-[#D2F500] transition-colors line-clamp-2 leading-tight text-center max-w-full break-words">
                    {item.title}
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-neutral-400 font-mono font-medium truncate max-w-full mt-0.5">
                    {item.version || item.platform}
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
