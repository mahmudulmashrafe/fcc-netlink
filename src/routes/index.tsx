import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchLinks, fetchPackages, fetchSoftware, LinkItem, PackageItem, SoftwareItem } from "../lib/supabase";
import {
  Wifi,
  Zap,
  Shield,
  Download,
  ExternalLink,
  Tv,
  ArrowRight,
  Sparkles,
  Server,
  Activity,
  Play,
  Check,
  ArrowDown,
  ArrowUp,
  SlidersHorizontal,
  Flame
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NetLink Fiber — Unlimited 4K Streaming & Gigabit Broadband" },
      { name: "description", content: "Ultra fast fiber broadband, BDIX local FTP media servers, IPTV channels, software tools, and 24/7 support." },
      { property: "og:title", content: "NetLink Fiber — Netflix Style 4K Streaming & Fiber Internet" },
      { property: "og:description", content: "Blazing fast 1 Gbps fiber internet, live IPTV streaming, local media servers, and software tools." },
    ],
  }),
  component: Index,
});

function Index() {
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [software, setSoftware] = useState<SoftwareItem[]>([]);

  useEffect(() => {
    fetchLinks().then((data) => setLinks(data.slice(0, 8)));
    fetchPackages().then((data) => setPackages(data.slice(0, 4)));
    fetchSoftware().then((data) => setSoftware(data.slice(0, 4)));
  }, []);

  return (
    <div className="w-full bg-[#141414] text-white">
      {/* BILLBOARD HERO SECTION (NETFLIX FLAVOR) */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center py-20 lg:py-28 border-b border-white/10">
        {/* Dark Background Showcase Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-red-950/40 via-[#141414]/90 to-[#141414] opacity-90" />

        {/* Ambient Glowing Spotlights */}
        <div className="absolute -top-40 right-0 w-[600px] h-[600px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 relative z-20 grid gap-12 lg:grid-cols-12 items-center">
          <div className="lg:col-span-8 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-600/20 border border-red-500/40 text-red-400 text-xs font-black uppercase tracking-wider backdrop-blur-md">
              <Flame className="w-4 h-4 text-red-500 animate-pulse" />
              <span>#1 Ultra-Fast Fiber & IPTV Network</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] uppercase">
              Unlimited 4K Streams. <br />
              <span className="bg-gradient-to-r from-red-500 via-rose-400 to-amber-400 bg-clip-text text-transparent">
                Zero Buffering Broadband.
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-neutral-300 max-w-2xl font-normal leading-relaxed">
              Experience symmetrical 1 Gbps fiber broadband, low-latency gaming routes, direct BDIX local FTP servers, and 500+ HD Live IPTV channels.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/packages"
                className="px-8 py-4 rounded-xl bg-[#D2F500] hover:bg-[#b8d800] text-black font-black text-sm md:text-base shadow-[0_0_30px_rgba(210,245,0,0.4)] hover:shadow-[0_0_40px_rgba(210,245,0,0.6)] transition-all flex items-center gap-3 uppercase tracking-wider"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Explore All Plans</span>
              </Link>

              <Link
                to="/packages"
                className="px-8 py-4 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm md:text-base backdrop-blur-md transition-all flex items-center gap-2"
              >
                <SlidersHorizontal className="w-5 h-5 text-[#D2F500]" />
                <span>Custom Package Builder</span>
              </Link>
            </div>
          </div>

          {/* Quick Metrics Cards */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-4">
            {[
              { k: "1 Gbps", v: "Max Fiber Speed", icon: Zap, c: "text-[#D2F500]" },
              { k: "99.99%", v: "Network Uptime", icon: Activity, c: "text-emerald-400" },
              { k: "< 4 ms", v: "Low Latency Route", icon: Wifi, c: "text-[#D2F500]" },
              { k: "500+ HD", v: "IPTV Live Channels", icon: Tv, c: "text-[#D2F500]" },
            ].map((s) => {
              const IconComp = s.icon;
              return (
                <div
                  key={s.v}
                  className="rounded-2xl bg-[#121316] border border-[#24272D] p-5 backdrop-blur-md hover:border-[#D2F500]/50 hover:scale-105 transition-all shadow-xl"
                >
                  <IconComp className={`w-6 h-6 mb-2 ${s.c}`} />
                  <div className="text-2xl md:text-3xl font-black text-white">{s.k}</div>
                  <div className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider mt-1">{s.v}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* NETFLIX ROW 1: TOP TRENDING FIBER & DISH PACKAGES */}
      <section className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-16">
        <div className="flex items-end justify-between flex-wrap gap-4 mb-8 border-b border-white/10 pb-4">
          <div>
            <span className="text-xs font-black uppercase tracking-widest text-[#D2F500] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>Trending Service Plans</span>
            </span>
            <h2 className="text-2xl md:text-4xl font-black text-white mt-1 uppercase tracking-tight">
              Featured Internet & Dish TV Packages
            </h2>
          </div>
          <Link to="/packages" className="text-xs md:text-sm font-extrabold text-[#D2F500] hover:underline flex items-center gap-1">
            <span>View All Plans ({packages.length})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {packages.map((p) => {
            const isInternetOnly = p.category === "internet_only";
            const isDishOnly = p.category === "dish_only";
            const price = Number(p.price || 0);

            return (
              <div
                key={p.id || p.name}
                className="group relative rounded-3xl border border-[#24272D] bg-[#18191D] p-6 flex flex-col justify-between hover:border-[#D2F500] hover:shadow-[0_0_30px_rgba(210,245,0,0.15)] hover:-translate-y-1.5 transition-all duration-300"
              >
                {p.popular && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#D2F500] text-black px-4 py-1 text-[10px] font-black uppercase tracking-widest shadow-lg">
                    POPULAR CHOICE
                  </span>
                )}

                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">{p.name}</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#D2F500]/15 text-[#D2F500] font-extrabold text-[10px] uppercase border border-[#D2F500]/30">
                      {isInternetOnly ? "Internet Only" : isDishOnly ? "Dish Line Only" : "Combo Plan"}
                    </span>
                  </div>

                  {!isDishOnly ? (
                    <div className="mt-2 space-y-2">
                      <div className="text-3xl font-black text-white">{p.download_speed || p.speed || "100 Mbps"}</div>
                      <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                        <div className="p-2 rounded-xl bg-[#0B0C0E] border border-[#24272D] flex items-center gap-1.5">
                          <ArrowDown className="w-3.5 h-3.5 text-[#D2F500]" />
                          <span className="font-extrabold text-neutral-200">{p.download_speed || "100M"}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-[#0B0C0E] border border-[#24272D] flex items-center gap-1.5">
                          <ArrowUp className="w-3.5 h-3.5 text-[#D2F500]" />
                          <span className="font-extrabold text-neutral-200">{p.upload_speed || "100M"}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-2 p-3 rounded-2xl bg-[#D2F500]/10 border border-[#D2F500]/20 flex items-center gap-3">
                      <Tv className="w-7 h-7 text-[#D2F500] flex-shrink-0" />
                      <div>
                        <div className="text-base font-extrabold text-white">Dish Line TV</div>
                        <div className="text-xs text-[#D2F500] font-semibold">500+ HD Channels</div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="text-4xl font-black text-white">৳{price}</span>
                    <span className="text-neutral-400 text-xs font-bold">/month</span>
                  </div>

                  <ul className="mt-5 space-y-2 text-xs font-semibold text-neutral-300">
                    {p.features.slice(0, 3).map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#D2F500] flex-shrink-0 mt-0.5" />
                        <span className="truncate">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to="/packages"
                  className="mt-6 w-full py-3 rounded-xl bg-[#D2F500] hover:bg-[#b8d800] text-black font-extrabold text-xs uppercase tracking-wider text-center transition-all shadow-md group-hover:shadow-[0_0_15px_rgba(210,245,0,0.4)]"
                >
                  Select Package
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* NETFLIX ROW 2: POPULAR LIVE IPTV & MEDIA PORTALS */}
      <section className="bg-[#121316] border-y border-[#24272D] py-16">
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-8 border-b border-[#24272D] pb-4">
            <div>
              <span className="text-xs font-black uppercase tracking-widest text-[#D2F500] flex items-center gap-1.5">
                <Tv className="w-4 h-4" />
                <span>Live IPTV & Local Media Hub</span>
              </span>
              <h2 className="text-2xl md:text-4xl font-black text-white mt-1 uppercase tracking-tight">
                Streaming Portals & BDIX Servers
              </h2>
            </div>
            <Link to="/entertainment" className="text-xs md:text-sm font-extrabold text-[#D2F500] hover:underline flex items-center gap-1">
              <span>View All Media Links →</span>
            </Link>
          </div>

          <div className="grid gap-3 sm:gap-4 md:gap-5 grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8">
            {links.map((l) => (
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
                    <Play className="w-12 h-12 sm:w-14 sm:h-14 text-[#D2F500] fill-current drop-shadow-[0_0_15px_rgba(210,245,0,0.6)]" />
                  )}
                </div>
                <span className="font-extrabold text-xs sm:text-sm text-neutral-200 group-hover:text-[#D2F500] transition-colors line-clamp-2 leading-tight text-center max-w-full break-words">
                  {l.name}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
