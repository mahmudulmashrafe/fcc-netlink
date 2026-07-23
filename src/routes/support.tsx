import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ChevronDown, MessageSquare, Headphones, Search } from "lucide-react";
import { fetchFAQs, FAQItem } from "../lib/supabase";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "Support & Help Desk — NetLink Fiber" },
      { name: "description", content: "Answers to common questions about fiber installation, billing, router config, and troubleshooting." },
      { property: "og:title", content: "Support & Help Desk — NetLink Fiber" },
      { property: "og:description", content: "Answers to common questions about installation, billing, and troubleshooting." },
    ],
  }),
  component: SupportPage,
});

export function SupportPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [search, setSearch] = useState("");
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const filteredFaqs = faqs.filter((f) => {
    const query = search.toLowerCase();
    return f.q.toLowerCase().includes(query) || f.a.toLowerCase().includes(query);
  });

  const loadFaqs = async () => {
    try {
      const data = await fetchFAQs();
      setFaqs(Array.isArray(data) ? data : []);
    } catch {
      setFaqs([]);
    }
  };

  useEffect(() => {
    loadFaqs();
    window.addEventListener("storage", loadFaqs);
    return () => window.removeEventListener("storage", loadFaqs);
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#141414] text-white">
      {/* Sticky Search Bar */}
      <section className="sticky top-[96px] z-40 bg-[#0B0C0E] border-b border-[#24272D] py-3 text-white shadow-2xl">
        <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search help topics or questions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#18191D] border border-[#24272D] rounded-xl text-sm text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#D2F500]"
            />
          </div>
          <span className="text-xs font-extrabold text-[#D2F500] uppercase tracking-wider hidden sm:inline-block">
            {filteredFaqs.length} FAQs Found
          </span>
        </div>
      </section>

      <section className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-16">
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 font-bold">No matching FAQ questions found.</div>
          ) : (
            filteredFaqs.map((f, i) => (
              <div
                key={f.id || f.q}
                className="rounded-2xl border border-[#24272D] bg-[#18191D] shadow-lg hover:border-[#D2F500] transition-all overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left font-black text-base md:text-lg text-white hover:text-[#D2F500] transition-colors gap-4"
                >
                  <span>{f.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-neutral-400 transition-transform duration-200 ${
                      openIndex === i ? "rotate-180 text-[#D2F500]" : ""
                    }`}
                  />
                </button>
                {openIndex === i && (
                  <div className="px-6 pb-6 text-sm text-neutral-300 leading-relaxed border-t border-[#24272D] pt-4 bg-[#0B0C0E] whitespace-pre-wrap font-medium">
                    {f.a}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-16 max-w-4xl mx-auto rounded-3xl border border-[#D2F500]/30 bg-gradient-to-r from-[#0B0C0E] via-[#121316] to-[#18191D] p-8 text-center shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <h3 className="font-black text-xl text-white uppercase">Still need direct assistance?</h3>
            <p className="mt-1 text-sm text-neutral-300 font-medium">Our network NOC engineers are available 24/7 to solve line issues.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="px-6 py-3.5 rounded-xl bg-[#D2F500] hover:bg-[#b8d800] text-black font-black text-xs uppercase tracking-wider shadow-md hover:shadow-[0_0_20px_rgba(210,245,0,0.4)] transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <MessageSquare className="w-4 h-4 text-black" />
              <span>Submit Support Ticket</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}