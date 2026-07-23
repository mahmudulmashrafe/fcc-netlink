import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { fetchSiteConfig, SiteConfig, DEFAULT_SITE_CONFIG, addContactMessage } from "../lib/supabase";
import { PhoneCall, Mail, MapPin, Clock, Send, CheckCircle2, Sparkles } from "lucide-react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us & Connection Booking — NetLink Fiber" },
      { name: "description", content: "Book a new fiber connection or contact our sales and support engineering desk." },
      { property: "og:title", content: "Contact NetLink Fiber" },
      { property: "og:description", content: "Sales, support, and new connection requests." },
    ],
  }),
  component: ContactPage,
});

export function ContactPage() {
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [requestType, setRequestType] = useState("New Fiber Connection Request");
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    fetchSiteConfig().then((data) => setConfig(data));
  }, []);

  return (
    <div className="w-full min-h-screen bg-[#141414] text-white">
      <section className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-12 grid gap-10 grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-4 space-y-4">
          {[
            { t: "Sales Desk", v: config.sales_phone, s: "Mon–Sat, 8am–9pm", icon: PhoneCall },
            { t: "24/7 Technical NOC", v: config.hotline, s: "Instant hotline support", icon: Clock },
            { t: "Email Support", v: config.support_email, s: "Response in < 1 hour", icon: Mail },
            { t: "Central Operations", v: config.address, s: "Enterprise Fiber Hub", icon: MapPin },
          ].map((c) => {
            const IconComp = c.icon;
            return (
              <div key={c.t} className="rounded-2xl border border-white/10 bg-[#1f1f1f] p-6 shadow-lg flex items-start gap-4 hover:border-red-500/50 transition-all">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-800 text-white flex items-center justify-center font-black flex-shrink-0 shadow-md">
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase font-black tracking-wider text-red-400">{c.t}</div>
                  <div className="mt-1 font-black text-white text-base">{c.v}</div>
                  <div className="text-xs text-neutral-400 mt-0.5 font-medium">{c.s}</div>
                </div>
              </div>
            );
          })}
        </div>

        <form
          className="lg:col-span-8 rounded-3xl border border-white/10 bg-[#1f1f1f] p-8 md:p-10 shadow-2xl"
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitting(true);
            await addContactMessage({
              name,
              email,
              phone,
              request_type: requestType,
              message: messageText
            });
            setSent(true);
            setSubmitting(false);
          }}
        >
          {sent ? (
            <div className="py-16 text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-red-500 mx-auto animate-bounce" />
              <h2 className="text-2xl font-black text-white uppercase">Message & Connection Request Received!</h2>
              <p className="text-neutral-300 max-w-md mx-auto text-sm font-medium">
                Our local area installation manager will contact you within 2 hours to confirm your line setup.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSent(false);
                  setName("");
                  setEmail("");
                  setPhone("");
                  setMessageText("");
                }}
                className="mt-6 rounded-xl border border-white/20 px-6 py-3 text-xs font-black uppercase tracking-wider hover:bg-white/10 text-white transition-all"
              >
                Send Another Inquiry
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-black text-2xl text-white uppercase">New Connection & Inquiry Form</h2>
              <p className="text-sm text-neutral-300 mt-1 mb-6 font-medium">
                Fill out the details below and our team will get back to you right away.
              </p>

              <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                <div>
                  <label className="block text-xs font-black uppercase text-white mb-1.5">Full Name *</label>
                  <input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-xl border border-[#24272D] bg-[#0B0C0E] px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D2F500] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-white mb-1.5">Email Address *</label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full rounded-xl border border-[#24272D] bg-[#0B0C0E] px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D2F500] font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-white mb-1.5">Phone Number *</label>
                  <input
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+880 1700-000000"
                    className="w-full rounded-xl border border-[#24272D] bg-[#0B0C0E] px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D2F500] font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black uppercase text-white mb-1.5">Request Type</label>
                  <select 
                    value={requestType}
                    onChange={(e) => setRequestType(e.target.value)}
                    className="w-full rounded-xl border border-[#24272D] bg-[#0B0C0E] px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D2F500] font-bold"
                  >
                    <option>New Fiber Connection Request</option>
                    <option>Package Speed Upgrade</option>
                    <option>4K IPTV & Dish Connection Addon</option>
                    <option>Enterprise / Dedicated IP Inquiry</option>
                    <option>Technical Support</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-xs font-black uppercase text-white mb-1.5">Installation Address / Message *</label>
                <textarea
                  required
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Provide your building address or detail your support inquiry..."
                  className="w-full rounded-xl border border-[#24272D] bg-[#0B0C0E] px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#D2F500] font-medium leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="mt-6 w-full py-4 rounded-xl bg-[#D2F500] hover:bg-[#b8d800] text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(210,245,0,0.4)] transition-all flex items-center justify-center gap-2"
              >
                {submitting ? <Sparkles className="w-5 h-5 animate-spin text-black" /> : <Send className="w-5 h-5 text-black" />}
                <span>Submit Connection Request</span>
              </button>
            </>
          )}
        </form>
      </section>
    </div>
  );
}