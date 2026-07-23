import { Link, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchSiteConfig, SiteConfig, DEFAULT_SITE_CONFIG } from "../lib/supabase";
import { 
  Globe, 
  Package, 
  Tv, 
  Download, 
  HelpCircle, 
  PhoneCall, 
  Zap
} from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: Globe },
  { to: "/packages", label: "Fiber & Dish Packages", icon: Package },
  { to: "/entertainment", label: "IPTV Portals", icon: Tv },
  { to: "/software", label: "Software Hub", icon: Download, badge: "4K" },
  { to: "/support", label: "Support", icon: HelpCircle },
  { to: "/contact", label: "Contact NOC", icon: PhoneCall },
] as const;

export function SiteLayout() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  useEffect(() => {
    fetchSiteConfig().then((data) => setConfig(data));

    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0D0E10] text-white selection:bg-[#D2F500] selection:text-black">
      {/* Fixed Top Combined Header Container */}
      <header className="sticky top-0 z-50 w-full shadow-2xl bg-[#0D0E10]">
        {/* Top Announcement Banner - Infinite Right-to-Left Ticker */}
        <div className="bg-[#D2F500] text-black text-xs h-8 overflow-hidden relative shadow-md flex items-center">
          <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
            <div className="flex items-center gap-3 font-black uppercase tracking-wide">
              <Zap className="w-3.5 h-3.5 fill-black flex-shrink-0" />
              <span>{config.banner_text}</span>
              <span className="bg-black px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-[#D2F500] flex-shrink-0">
                ULTRA 4K GIGABIT READY
              </span>
            </div>
            <div className="flex items-center gap-3 font-black uppercase tracking-wide">
              <Zap className="w-3.5 h-3.5 fill-black flex-shrink-0" />
              <span>{config.banner_text}</span>
              <span className="bg-black px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-[#D2F500] flex-shrink-0">
                ULTRA 4K GIGABIT READY
              </span>
            </div>
            <div className="flex items-center gap-3 font-black uppercase tracking-wide">
              <Zap className="w-3.5 h-3.5 fill-black flex-shrink-0" />
              <span>{config.banner_text}</span>
              <span className="bg-black px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-[#D2F500] flex-shrink-0">
                ULTRA 4K GIGABIT READY
              </span>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="bg-[#0D0E10]/95 backdrop-blur-md border-b border-[#24272D] h-[64px] flex items-center">
          <div className="w-full max-w-[1600px] mx-auto flex items-center justify-between px-4 md:px-8">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-10 w-10 rounded-xl bg-[#D2F500] text-black flex items-center justify-center font-black text-xl shadow-[0_0_20px_rgba(210,245,0,0.4)] group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 fill-current" />
            </div>
            <div>
              <span className="font-black text-xl md:text-2xl tracking-tighter uppercase text-white">
                {config.brand_name || "FCC NetLink"}
              </span>
              <p className="text-[9px] text-[#D2F500] font-extrabold -mt-1 tracking-widest uppercase">Fiber Broadband</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1 bg-[#16171A] p-1.5 rounded-2xl border border-white/10 backdrop-blur-md">
            {navItems.map((n) => {
              const Icon = n.icon;
              return (
                <Link
                  key={n.to}
                  to={n.to}
                  className="relative px-4 py-2 rounded-xl text-xs md:text-sm font-extrabold text-neutral-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-2"
                  activeProps={{
                    className: "px-4 py-2 rounded-xl text-xs md:text-sm font-black text-black bg-[#D2F500] shadow-[0_0_15px_rgba(210,245,0,0.4)]",
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{n.label}</span>
                  {"badge" in n && (
                    <span className="ml-0.5 px-1.5 py-0.2 bg-white text-black text-[9px] font-black rounded-full uppercase">
                      {n.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

        </div>
        </div>
      </header>

      {/* Main Page Slot */}
      <main className="flex-1 pb-16 lg:pb-0">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar (Replaces Hamburger Menu) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#0B0C0E]/95 backdrop-blur-xl border-t border-[#24272D] px-1 py-1.5 shadow-[0_-10px_30px_rgba(0,0,0,0.9)]">
        <div className="grid grid-cols-6 items-center justify-between max-w-lg mx-auto">
          {navItems.map((n) => {
            const Icon = n.icon;
            const shortName = n.to === "/" ? "Home" : n.to === "/packages" ? "Plans" : n.to === "/entertainment" ? "IPTV" : n.to === "/software" ? "Software" : n.to === "/support" ? "Support" : "Contact";
            const isActive = n.to === "/" ? currentPath === "/" : currentPath.startsWith(n.to);

            return (
              <Link
                key={n.to}
                to={n.to}
                activeOptions={{ exact: n.to === "/" }}
                className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all gap-0.5 relative group ${
                  isActive
                    ? "text-[#D2F500] font-black bg-[#D2F500]/10 shadow-[0_0_12px_rgba(210,245,0,0.15)]"
                    : "text-neutral-400 font-bold hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? "text-[#D2F500] scale-110" : "text-neutral-400 group-hover:scale-105"}`} />
                <span className="truncate max-w-[50px] text-center leading-tight tracking-tight text-[9px] sm:text-[10px]">
                  {shortName}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[#D2F500] shadow-[0_0_8px_#D2F500] mt-0.5" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Footer */}
      <footer className="bg-[#0B0C0E] border-t border-white/10 text-neutral-400 py-4 sm:py-12 text-[10px] sm:text-xs">
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 grid gap-4 sm:gap-8 grid-cols-2 sm:grid-cols-4">
          {/* Brand Info (Hidden on Mobile View) */}
          <div className="hidden sm:block sm:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-[#D2F500] text-black flex items-center justify-center font-black">
                <Zap className="w-4 h-4 fill-current" />
              </div>
              <span className="font-black text-lg text-white uppercase tracking-tight">{config.brand_name || "FCC NetLink"}</span>
            </div>
            <p className="text-neutral-400 leading-relaxed font-medium text-xs">
              Ultra low-latency fiber broadband, 4K IPTV streams, and local BDIX connectivity.
            </p>
          </div>

          {/* Services Column (Hidden on Mobile View) */}
          <div className="hidden sm:block">
            <h4 className="font-black text-white text-xs uppercase tracking-wider mb-3 text-[#D2F500]">Services</h4>
            <ul className="space-y-2 font-medium">
              <li><Link to="/packages" className="hover:text-white transition-colors">Fiber Broadband</Link></li>
              <li><Link to="/packages" className="hover:text-white transition-colors">Dish Line TV</Link></li>
              <li><Link to="/entertainment" className="hover:text-white transition-colors">IPTV Portals</Link></li>
              <li><Link to="/software" className="hover:text-white transition-colors">Software Hub</Link></li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h4 className="font-black text-white text-[10px] sm:text-xs uppercase tracking-wider mb-1.5 sm:mb-3 text-[#D2F500]">Support</h4>
            <ul className="space-y-1 sm:space-y-2 font-medium">
              <li><Link to="/support" className="hover:text-white transition-colors">FAQs</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Report Issue</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Hotline</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors text-neutral-500">Admin</Link></li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-black text-white text-[10px] sm:text-xs uppercase tracking-wider mb-1.5 sm:mb-3 text-[#D2F500]">Contact</h4>
            <div className="space-y-1 font-mono text-neutral-300 text-[9px] sm:text-xs">
              <div>Hotline: <strong className="text-[#D2F500]">{config.hotline}</strong></div>
              <div>Sales: {config.sales_phone}</div>
              <div className="truncate">Email: {config.support_email}</div>
              <div className="text-neutral-400 font-sans mt-1 truncate hidden sm:block">{config.address}</div>
            </div>
          </div>
        </div>

        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 border-t border-white/10 mt-3 sm:mt-8 pt-3 sm:pt-6 flex flex-row items-center justify-between gap-2 text-[9px] sm:text-[11px] font-medium text-neutral-400">
          <p>© {new Date().getFullYear()} {config.brand_name || "FCC NetLink"}. All rights reserved.</p>
          <div className="text-right">
            Powered by{" "}
            <a
              href="https://mahmudulmashrafe.github.io/"
              target="_blank"
              rel="noreferrer"
              className="text-[#D2F500] hover:underline font-bold"
            >
              Mahmudul Mashrafe
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}