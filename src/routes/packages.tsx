import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchPackages, fetchSiteConfig, PackageItem, PackageCategory, addContactMessage } from "../lib/supabase";
import { Check, Sparkles, RefreshCw, Wifi, Tv, Layers, ArrowDown, ArrowUp, SlidersHorizontal, Send, CheckCircle2, X, Phone } from "lucide-react";

export const Route = createFileRoute("/packages")({
  head: () => ({
    meta: [
      { title: "Internet & Dish TV Packages — NetLink Fiber" },
      { name: "description", content: "Compare Internet Only, Dish TV Only, and Combo Fiber Broadband packages." },
      { property: "og:title", content: "Internet & Dish TV Packages — NetLink Fiber" },
      { property: "og:description", content: "Compare internet, dish TV, and combo plans with transparent pricing." },
    ],
  }),
  component: PackagesPage,
});

export function PackagesPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<"all" | PackageCategory>("all");

  // Custom Package Calculator Modal State
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [customCategory, setCustomCategory] = useState<PackageCategory>("combo");
  const [siteConfig, setSiteConfig] = useState<any>(null);
  const [customSpeed, setCustomSpeed] = useState<number>(50);
  const [customDishPack, setCustomDishPack] = useState<string>("500_hd");
  
  // Contact details for custom package order
  const [custName, setCustName] = useState("");
  const [custPhone, setCustPhone] = useState("");
  const [custAddress, setCustAddress] = useState("");
  const [sendingOrder, setSendingOrder] = useState(false);
  const [orderSent, setOrderSent] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [pkgs, cfg] = await Promise.all([
        fetchPackages(),
        fetchSiteConfig(),
      ]);
      setPackages(pkgs || []);
      setSiteConfig(cfg || {});
      if (cfg && cfg.custom_min_mbps) {
        setCustomSpeed(Number(cfg.custom_min_mbps));
      }
    } catch (e) {
      console.error("Error loading packages data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Price Calculation Logic for Custom Builder dynamically based on Admin Rules
  const calculateCustomPrice = () => {
    let monthly = 0;
    let internetInstall = 0;
    let dishInstall = 0;

    const baseFee = Number(siteConfig?.custom_base_internet_fee || 10);
    const ratePer10Mbps = Number(siteConfig?.custom_price_per_10mbps || 3);
    const defaultInternetInstall = Number(siteConfig?.custom_internet_install_fee || 15);
    const defaultDishInstall = Number(siteConfig?.custom_dish_install_fee || 10);
    const hdPrice = Number(siteConfig?.custom_dish_hd_price || 10);
    const k4Price = Number(siteConfig?.custom_dish_4k_price || 18);

    if (customCategory !== "dish_only") {
      monthly += baseFee + Math.round((customSpeed / 10) * ratePer10Mbps);
      internetInstall = customSpeed >= 500 ? 0 : defaultInternetInstall;
    }

    if (customCategory !== "internet_only") {
      if (customDishPack === "500_hd") {
        monthly += hdPrice;
        dishInstall = defaultDishInstall;
      } else {
        monthly += k4Price;
        dishInstall = defaultDishInstall + 5;
      }
    }

    const firstMonthTotal = monthly + internetInstall + dishInstall;
    return { monthly, internetInstall, dishInstall, firstMonthTotal };
  };

  const customPriceInfo = calculateCustomPrice();

  const handleShareCustomOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custPhone) return;
    setSendingOrder(true);

    const speedLabel = customCategory === "dish_only" ? "N/A (Dish Only)" : `${customSpeed} Mbps Symmetrical Fiber`;
    const dishLabel = customCategory === "internet_only" ? "No Dish Line" : customDishPack === "500_hd" ? "500+ HD Dish Pack" : "1000+ 4K Dish Pack";

    const customSummary = `CUSTOM PACKAGE ESTIMATE ORDER:
- Category: ${customCategory === "internet_only" ? "Internet Only" : customCategory === "dish_only" ? "Dish Line Only" : "Internet + Dish Combo"}
- Speed: ${speedLabel}
- Dish Line Pack: ${dishLabel}
- Calculated Price: ৳${customPriceInfo.monthly}/mo (First Month Total: ৳${customPriceInfo.firstMonthTotal})
- Customer Phone: ${custPhone}
- Customer Name: ${custName || "Not provided"}
- Customer Address: ${custAddress || "Not provided"}`;

    await addContactMessage({
      name: custName || `Client (${custPhone})`,
      email: "custom_estimate@client.local",
      phone: custPhone,
      request_type: "Custom Package Order",
      message: customSummary,
    });

    setSendingOrder(false);
    setOrderSent(true);
  };

  const filteredPackages = packages.filter((p) => {
    if (activeCategory === "all") return true;
    return p.category === activeCategory;
  });

  return (
    <div className="w-full min-h-screen bg-[#141414] text-white">
      {/* Sticky Package Category Tabs Bar */}
      <section className="sticky top-[96px] z-40 bg-[#0B0C0E] border-b border-[#24272D] py-3 text-white shadow-2xl">
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 whitespace-nowrap flex-nowrap sm:flex-wrap no-scrollbar">
            <button
              onClick={() => setActiveCategory("all")}
              className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-black flex items-center gap-2 transition-all flex-shrink-0 ${
                activeCategory === "all"
                  ? "bg-[#D2F500] text-black shadow-[0_0_20px_rgba(210,245,0,0.4)]"
                  : "text-neutral-400 hover:text-white bg-[#18191D] border border-[#24272D]"
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>All Plans ({packages.length})</span>
            </button>

            <button
              onClick={() => setActiveCategory("internet_only")}
              className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-black flex items-center gap-2 transition-all flex-shrink-0 ${
                activeCategory === "internet_only"
                  ? "bg-[#D2F500] text-black shadow-[0_0_20px_rgba(210,245,0,0.4)]"
                  : "text-neutral-400 hover:text-white bg-[#18191D] border border-[#24272D]"
              }`}
            >
              <Wifi className="w-4 h-4" />
              <span>1. Internet Only</span>
            </button>

            <button
              onClick={() => setActiveCategory("dish_only")}
              className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-black flex items-center gap-2 transition-all flex-shrink-0 ${
                activeCategory === "dish_only"
                  ? "bg-[#D2F500] text-black shadow-[0_0_20px_rgba(210,245,0,0.4)]"
                  : "text-neutral-400 hover:text-white bg-[#18191D] border border-[#24272D]"
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>2. Dish Line Only</span>
            </button>

            <button
              onClick={() => setActiveCategory("combo")}
              className={`px-3.5 py-2 rounded-xl text-xs md:text-sm font-black flex items-center gap-2 transition-all flex-shrink-0 ${
                activeCategory === "combo"
                  ? "bg-[#D2F500] text-black shadow-[0_0_20px_rgba(210,245,0,0.4)]"
                  : "text-neutral-400 hover:text-white bg-[#18191D] border border-[#24272D]"
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>3. Internet + Dish Combo</span>
            </button>
          </div>

          <button
            onClick={() => {
              setOrderSent(false);
              setIsCustomModalOpen(true);
            }}
            className="px-4 py-2 rounded-xl text-xs md:text-sm font-black uppercase tracking-wider flex items-center justify-center gap-2 bg-[#D2F500] hover:bg-[#b8d800] text-black shadow-[0_0_15px_rgba(210,245,0,0.4)] transition-all flex-shrink-0 whitespace-nowrap"
          >
            <SlidersHorizontal className="w-4 h-4 text-black" />
            <span>Customize Plan</span>
          </button>
        </div>
      </section>

      {/* Package Cards List */}
      <section className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-16">
        {loading ? (
          <div className="py-20 text-center text-neutral-400 flex flex-col items-center gap-3 font-bold">
            <RefreshCw className="w-8 h-8 animate-spin text-[#D2F500]" />
            <p>Loading package plans...</p>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="py-16 text-center text-neutral-400 bg-[#18191D] border border-[#24272D] rounded-3xl p-8 max-w-md mx-auto space-y-4">
            <Layers className="w-12 h-12 text-neutral-500/50 mx-auto" />
            <h3 className="text-lg font-black text-white uppercase">No Packages Listed in this Category</h3>
            <p className="text-xs text-neutral-400 font-medium">
              There are currently no pre-set packages in this specific filter. You can build a custom package using our estimator!
            </p>
            <button
              onClick={() => setIsCustomModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-[#D2F500] hover:bg-[#b8d800] text-black font-black text-xs uppercase tracking-wider shadow-md"
            >
              Build Custom Package
            </button>
          </div>
        ) : (
          <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            {filteredPackages.map((p) => {
              const isInternetOnly = p.category === "internet_only";
              const isDishOnly = p.category === "dish_only";

              const connCharge = Number(p.connection_charge || 0);
              const dishCharge = Number(p.dish_charge || 0);
              const price = Number(p.price || 0);
              const withAll = price + (isDishOnly ? 0 : connCharge) + (isInternetOnly ? 0 : dishCharge);

              return (
                <div
                  key={p.id || p.name}
                  className={`relative rounded-3xl p-8 bg-[#1f1f1f] flex flex-col justify-between transition-all ${
                    p.popular ? "border-2 border-[#D2F500] shadow-[0_0_25px_rgba(210,245,0,0.3)] ring-2 ring-[#D2F500]/30" : "border border-white/10 shadow-lg hover:border-[#D2F500]/50"
                  }`}
                >
                  {p.popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-[#D2F500] text-black px-4 py-1 text-xs font-black uppercase tracking-wider shadow-md">
                      Most Popular Choice
                    </span>
                  )}
                  <div>
                    {/* Category Type Badge & Discount Offer Tag */}
                    <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                      <span className="text-xs font-black uppercase tracking-widest text-neutral-400">{p.name}</span>
                      <div className="flex items-center gap-1.5">
                        {p.offer_tag && (
                          <span className="px-2.5 py-0.5 rounded-full bg-[#D2F500] text-black font-black text-[10px] uppercase flex items-center gap-1 shadow-[0_0_10px_rgba(210,245,0,0.4)]">
                            <Sparkles className="w-3 h-3 fill-black" />
                            <span>{p.offer_tag}</span>
                          </span>
                        )}
                        {isInternetOnly ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-sky-500/15 text-sky-400 font-black text-[10px] uppercase flex items-center gap-1 border border-sky-500/30">
                            <Wifi className="w-3 h-3" />
                            <span>Internet</span>
                          </span>
                        ) : isDishOnly ? (
                          <span className="px-2.5 py-0.5 rounded-full bg-purple-500/15 text-purple-400 font-black text-[10px] uppercase flex items-center gap-1 border border-purple-500/30">
                            <Tv className="w-3 h-3" />
                            <span>Dish</span>
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full bg-red-500/15 text-red-400 font-black text-[10px] uppercase flex items-center gap-1 border border-red-500/30">
                            <Sparkles className="w-3 h-3 text-amber-400" />
                            <span>Combo</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Speed Badges */}
                    {!isDishOnly ? (
                      <div className="mt-2 space-y-2">
                        <div className="text-3xl font-black text-white">{p.download_speed || p.speed || "100 Mbps"}</div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2">
                            <div className="p-1 rounded-md bg-[#D2F500] text-black font-bold">
                              <ArrowDown className="w-3 h-3" />
                            </div>
                            <div>
                              <div className="text-[9px] uppercase font-black text-neutral-400">Download</div>
                              <div className="text-xs font-black text-white">{p.download_speed || p.speed || "100 Mbps"}</div>
                            </div>
                          </div>

                          <div className="p-2.5 rounded-xl bg-black/40 border border-white/10 flex items-center gap-2">
                            <div className="p-1 rounded-md bg-[#D2F500] text-black font-bold">
                              <ArrowUp className="w-3 h-3" />
                            </div>
                            <div>
                              <div className="text-[9px] uppercase font-black text-neutral-400">Upload</div>
                              <div className="text-xs font-black text-white">{p.upload_speed || p.speed || "100 Mbps"}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2 p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center gap-3">
                        <Tv className="w-8 h-8 text-purple-400 flex-shrink-0" />
                        <div>
                          <div className="text-lg font-black text-white">Dish Line Connection</div>
                          <div className="text-xs font-bold text-purple-400">500+ Full HD Channels</div>
                        </div>
                      </div>
                    )}

                    {/* Price Breakdown & Discount Strikethrough */}
                    <div className="mt-4 flex items-baseline gap-2 flex-wrap">
                      <span className="text-4xl font-black text-white">৳{price}</span>
                      {p.original_price && Number(p.original_price) > price && (
                        <span className="text-xl text-neutral-400 line-through font-extrabold">৳{p.original_price}</span>
                      )}
                      <span className="text-neutral-400 text-sm font-semibold">/month</span>
                    </div>
                    {p.original_price && Number(p.original_price) > price && (
                      <div className="text-xs font-black text-[#D2F500] mt-1 flex items-center gap-1">
                        🔥 Discount Offer: Save ৳{Number(p.original_price) - price}/mo!
                      </div>
                    )}

                    <div className="mt-5 rounded-2xl bg-black/50 p-4 text-xs space-y-2 font-medium border border-white/5">
                      <div className="flex justify-between">
                        <span className="text-neutral-400">Monthly Plan Charge</span>
                        <span className="font-bold text-white">৳{price}/mo</span>
                      </div>
                      {!isDishOnly && (
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Internet Line Install</span>
                          <span className="font-bold text-emerald-400">
                            {connCharge === 0 ? "FREE" : `৳${connCharge}`}
                          </span>
                        </div>
                      )}
                      {!isInternetOnly && (
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Dish Line Install</span>
                          <span className="font-bold text-emerald-400">
                            {dishCharge === 0 ? "FREE" : `৳${dishCharge}`}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-white/10 pt-2 mt-2 font-black text-white">
                        <span>First Month Total</span>
                        <span className="text-[#D2F500]">৳{withAll}</span>
                      </div>
                    </div>

                    <ul className="mt-6 space-y-3 text-sm font-medium">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-[#D2F500] flex-shrink-0 mt-0.5" />
                          <span className="text-neutral-200">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to="/contact"
                    className="mt-8 w-full py-3.5 rounded-xl text-center font-black text-xs uppercase tracking-wider transition-all bg-[#D2F500] hover:bg-[#b8d800] text-black shadow-[0_0_20px_rgba(210,245,0,0.3)]"
                  >
                    Select {p.name}
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* POPUP MODAL: BUILD & ESTIMATE YOUR CUSTOM PACKAGE */}
      {isCustomModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-[#121316]/90 border border-[#D2F500]/30 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 text-white">
            {/* FIXED TOP HEADER */}
            <div className="flex items-center justify-between border-b border-[#24272D] pb-4 flex-shrink-0">
              <div className="flex items-center gap-2.5 font-black text-lg text-white uppercase tracking-tight">
                <SlidersHorizontal className="w-6 h-6 text-[#D2F500]" />
                <span>Build & Estimate Your Custom Package</span>
              </div>
              <button
                onClick={() => setIsCustomModalOpen(false)}
                className="p-2 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {orderSent ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-[#D2F500] mx-auto animate-bounce" />
                <h3 className="text-2xl font-black text-white uppercase">Custom Estimate Sent to Admin!</h3>
                <p className="text-sm text-neutral-300 max-w-md mx-auto font-medium">
                  Our network manager will review your customized package specs and call your phone number (<strong className="text-[#D2F500]">{custPhone}</strong>) shortly to confirm setup!
                </p>
                <button
                  onClick={() => setIsCustomModalOpen(false)}
                  className="mt-4 px-8 py-3.5 rounded-xl bg-[#D2F500] hover:bg-[#b8d800] text-black font-black text-xs uppercase tracking-wider shadow-md"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <form onSubmit={handleShareCustomOrder} className="flex-1 flex flex-col overflow-hidden min-h-0 pt-4">
                {/* SCROLLABLE FORM BODY */}
                <div className="flex-1 overflow-y-auto space-y-5 pr-1">
                  {/* Category Selection */}
                  <div>
                    <label className="block text-xs font-black uppercase tracking-wider text-neutral-300 mb-2">
                      1. Select Package Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => setCustomCategory("internet_only")}
                        className={`py-3 px-3 rounded-xl text-xs font-black uppercase tracking-wider border transition-all flex items-center justify-center gap-1.5 ${
                          customCategory === "internet_only"
                            ? "bg-[#D2F500] text-black border-[#D2F500] shadow-[0_0_15px_rgba(210,245,0,0.4)]"
                            : "bg-[#0B0C0E] border-[#24272D] text-neutral-300 hover:bg-white/10"
                        }`}
                      >
                        <Wifi className="w-4 h-4" />
                        <span>Internet</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCustomCategory("dish_only")}
                        className={`py-3 px-3 rounded-xl text-xs font-black uppercase tracking-wider border transition-all flex items-center justify-center gap-1.5 ${
                          customCategory === "dish_only"
                            ? "bg-[#D2F500] text-black border-[#D2F500] shadow-[0_0_15px_rgba(210,245,0,0.4)]"
                            : "bg-[#0B0C0E] border-[#24272D] text-neutral-300 hover:bg-white/10"
                        }`}
                      >
                        <Tv className="w-4 h-4" />
                        <span>Dish Only</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setCustomCategory("combo")}
                        className={`py-3 px-3 rounded-xl text-xs font-black uppercase tracking-wider border transition-all flex items-center justify-center gap-1.5 ${
                          customCategory === "combo"
                            ? "bg-[#D2F500] text-black border-[#D2F500] shadow-[0_0_15px_rgba(210,245,0,0.4)]"
                            : "bg-[#0B0C0E] border-[#24272D] text-neutral-300 hover:bg-white/10"
                        }`}
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>Combo</span>
                      </button>
                    </div>
                  </div>

                  {/* Bandwidth Speed Selector (if internet or combo) */}
                  {customCategory !== "dish_only" && (
                    <div className="space-y-2 p-4 rounded-2xl bg-[#0B0C0E] border border-[#24272D]">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-black uppercase tracking-wider text-neutral-300">
                          2. Select Fiber Speed
                        </label>
                        <span className="text-base font-black text-[#D2F500]">
                          {customSpeed >= 1000 ? "1 Gbps" : `${customSpeed} Mbps`} Symmetrical
                        </span>
                      </div>

                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 pt-1">
                        {[10, 20, 50, 100, 200, 500, 1000].map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setCustomSpeed(s)}
                            className={`py-2 rounded-xl text-xs font-black border transition-all ${
                              customSpeed === s
                                ? "bg-[#D2F500] text-black border-[#D2F500] shadow-sm"
                                : "bg-[#121316] border-[#24272D] text-neutral-300 hover:bg-white/10"
                            }`}
                          >
                            {s >= 1000 ? "1 Gbps" : `${s} Mbps`}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dish Channel Pack Selector (if dish or combo) */}
                  {customCategory !== "internet_only" && (
                    <div className="space-y-2 p-4 rounded-2xl bg-[#0B0C0E] border border-[#24272D]">
                      <label className="block text-xs font-black uppercase tracking-wider text-neutral-300 mb-1">
                        Dish TV Channel Pack
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setCustomDishPack("500_hd")}
                          className={`p-3.5 rounded-xl text-left border transition-all ${
                            customDishPack === "500_hd"
                              ? "bg-[#D2F500] text-black border-[#D2F500] shadow-sm"
                              : "bg-[#121316] border-[#24272D] text-neutral-300 hover:bg-white/10"
                          }`}
                        >
                          <div className="font-black text-sm">500+ Full HD Channels</div>
                          <div className="text-xs opacity-80 mt-0.5 font-medium">Standard Setup</div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setCustomDishPack("1000_4k")}
                          className={`p-3.5 rounded-xl text-left border transition-all ${
                            customDishPack === "1000_4k"
                              ? "bg-[#D2F500] text-black border-[#D2F500] shadow-sm"
                              : "bg-[#121316] border-[#24272D] text-neutral-300 hover:bg-white/10"
                          }`}
                        >
                          <div className="font-black text-sm">1000+ 4K Ultra Channels</div>
                          <div className="text-xs opacity-80 mt-0.5 font-medium">Multi-Room Setup</div>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Live Estimation Result Card */}
                  <div className="rounded-2xl border border-[#D2F500]/30 bg-[#0B0C0E] p-4 font-medium text-xs space-y-2">
                    <div className="flex justify-between items-baseline border-b border-[#24272D] pb-2">
                      <span className="font-black text-white uppercase">Calculated Monthly Rate:</span>
                      <span className="text-2xl font-black text-[#D2F500]">৳{customPriceInfo.monthly}<span className="text-xs text-neutral-400 font-normal">/mo</span></span>
                    </div>
                    <div className="flex justify-between text-neutral-300 pt-1">
                      <span>First Month Total (with setup):</span>
                      <span className="font-bold text-white">৳{customPriceInfo.firstMonthTotal}</span>
                    </div>
                  </div>

                  {/* Customer Phone Number & Contact Form */}
                  <div className="space-y-4 pt-2 border-t border-[#24272D]">
                    <div>
                      <label className="block text-xs font-black uppercase text-white mb-1">
                        Phone Number * <span className="text-[#D2F500]">(Required for admin response)</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                        <input
                          type="text"
                          required
                          placeholder="+880 1700-000000"
                          value={custPhone}
                          onChange={(e) => setCustPhone(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm sm:text-base text-white font-mono font-bold focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black uppercase text-white mb-1">Full Name (Optional)</label>
                        <input
                          type="text"
                          placeholder="e.g. Tanvir Hossain"
                          value={custName}
                          onChange={(e) => setCustName(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-xs sm:text-sm text-white focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-black uppercase text-white mb-1">Area / Address (Optional)</label>
                        <input
                          type="text"
                          placeholder="Road, House, Block..."
                          value={custAddress}
                          onChange={(e) => setCustAddress(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-xs sm:text-sm text-white focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* FIXED ACTION FOOTER */}
                <div className="flex items-center gap-3 pt-4 border-t border-[#24272D] mt-4 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsCustomModalOpen(false)}
                    className="flex-1 py-3.5 rounded-xl border border-[#24272D] text-neutral-300 font-extrabold text-xs uppercase hover:bg-white/10 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingOrder}
                    className="flex-1 py-3.5 rounded-xl bg-[#D2F500] hover:bg-[#b8d800] text-black font-black text-xs uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(210,245,0,0.4)] transition-all flex items-center justify-center gap-2"
                  >
                    {sendingOrder ? <RefreshCw className="w-4 h-4 animate-spin text-black" /> : <Send className="w-4 h-4 text-black" />}
                    <span>{sendingOrder ? "Submitting..." : "Send Estimate to Admin"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}