import { createClient } from "@supabase/supabase-js";

// Supabase Credentials provided by user
const SUPABASE_URL = "https://jwjinaufgvljianurtni.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_QVyxn4lur-sMs_7hTNPcew_VwfF1MYK";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

export interface LinkItem {
  id?: string;
  name: string;
  url: string;
  desc?: string;
  category: string;
  icon?: string;
  color?: string;
  created_at?: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone: string;
  request_type: string;
  message: string;
  is_read?: boolean;
  created_at?: string;
}

export interface SoftwareItem {
  id?: string;
  title: string;
  description: string;
  download_url: string;
  version: string;
  category: string;
  platform: string;
  file_size?: string;
  icon?: string;
  created_at?: string;
}

export type AdminRole = "super_admin" | "sub_admin";

export interface AdminUser {
  id?: string;
  email: string;
  password?: string;
  name: string;
  role: AdminRole;
  created_at?: string;
}

export type PackageCategory = "internet_only" | "dish_only" | "combo";

export interface PackageItem {
  id?: string;
  name: string;
  category: PackageCategory;
  speed?: string;
  download_speed?: string;
  upload_speed?: string;
  price: number;
  original_price?: number;
  offer_tag?: string;
  connection_charge: number;
  dish_charge: number;
  features: string[];
  popular?: boolean;
  created_at?: string;
}

export interface SiteConfig {
  brand_name?: string;
  hotline: string;
  sales_phone: string;
  support_email: string;
  address: string;
  banner_text: string;
  network_status: string;
  // Custom Pack Pricing Rules (Configurable by Admin)
  custom_min_mbps?: string;
  custom_base_internet_fee?: string;
  custom_price_per_10mbps?: string;
  custom_internet_install_fee?: string;
  custom_dish_install_fee?: string;
  custom_dish_hd_price?: string;
  custom_dish_4k_price?: string;
}

// Default Seed Data
export const DEFAULT_SITE_CONFIG: SiteConfig = {
  brand_name: "FCC NetLink",
  hotline: "+1 (800) 555-0199",
  sales_phone: "+1 (800) 555-0100",
  support_email: "support@netlinkfiber.local",
  address: "NetLink Tower, Suite 400, Enterprise Fiber Hub",
  banner_text: "Experience 1 Gbps Ultra Fiber Speeds & Direct Local FTP / IPTV Servers",
  network_status: "All Systems Operational (99.99%)",
  custom_min_mbps: "10",
  custom_base_internet_fee: "10",
  custom_price_per_10mbps: "3",
  custom_internet_install_fee: "15",
  custom_dish_install_fee: "10",
  custom_dish_hd_price: "10",
  custom_dish_4k_price: "18",
};

export const DEFAULT_PACKAGES: PackageItem[] = [
  {
    name: "Fiber Starter",
    category: "internet_only",
    speed: "50 Mbps",
    download_speed: "50 Mbps",
    upload_speed: "50 Mbps",
    price: 19,
    original_price: 25,
    offer_tag: "24% OFF",
    connection_charge: 20,
    dish_charge: 0,
    features: ["Symmetrical 50 Mbps Fiber", "HD Streaming & Browsing", "BDIX & Local FTP Access", "Free Router Setup"],
  },
  {
    name: "Home Turbo Combo",
    category: "combo",
    speed: "150 Mbps",
    download_speed: "150 Mbps",
    upload_speed: "150 Mbps",
    price: 34,
    original_price: 45,
    offer_tag: "HOT DISCOUNT",
    connection_charge: 15,
    dish_charge: 10,
    features: ["150 Mbps Symmetrical Fiber", "1000+ 4K IPTV Channels", "Low-latency Gaming Route", "Free Dual-Band Router + IPTV Box"],
    popular: true,
  },
  {
    name: "HD Dish TV Premier",
    category: "dish_only",
    speed: "Satellite Dish",
    download_speed: "N/A",
    upload_speed: "N/A",
    price: 12,
    original_price: 18,
    offer_tag: "SAVE ৳6",
    connection_charge: 0,
    dish_charge: 15,
    features: ["500+ Full HD Channels", "Dolby Digital Audio", "Parental Lock Support", "24/7 Satellite NOC Support"],
  },
  {
    name: "Pro Gigabit Combo",
    category: "combo",
    speed: "1 Gbps",
    download_speed: "1 Gbps",
    upload_speed: "1 Gbps",
    price: 79,
    original_price: 99,
    offer_tag: "20% OFF",
    connection_charge: 0,
    dish_charge: 0,
    features: ["1 Gbps Ultra Symmetrical Fiber", "4K Multi-room IPTV Dish", "Unlimited Devices", "Dedicated VIP NOC Support"],
  },
];

export const DEFAULT_LINKS: LinkItem[] = [
  { name: "FTP Media Server", url: "ftp://10.10.10.10", desc: "Local high-speed movie & series server", category: "FTP & Storage", icon: "Server", color: "bg-blue-600" },
  { name: "Live TV Portal", url: "http://tv.netlink.local", desc: "1000+ Full HD & 4K Live IPTV Channels", category: "Live TV & IPTV", icon: "Tv", color: "bg-indigo-600" },
  { name: "Netflix", url: "https://www.netflix.com", desc: "Movies & series streaming", category: "Streaming", icon: "Film", color: "bg-red-600" },
  { name: "YouTube", url: "https://www.youtube.com", desc: "Videos, streams & podcasts", category: "Streaming", icon: "Play", color: "bg-red-500" },
  { name: "Amazon Prime Video", url: "https://www.primevideo.com", desc: "Blockbuster movies & original series", category: "Streaming", icon: "Video", color: "bg-sky-600" },
  { name: "Spotify", url: "https://www.spotify.com", desc: "High quality audio streaming", category: "Music", icon: "Music", color: "bg-green-600" },
  { name: "Speedtest by Ookla", url: "https://www.speedtest.net", desc: "Test your connection bandwidth", category: "Utilities", icon: "Gauge", color: "bg-purple-600" },
  { name: "ISP Self-Care Portal", url: "http://bill.netlink.local", desc: "Pay bills, check usage & manage router", category: "Account", icon: "User", color: "bg-amber-600" },
];

export const DEFAULT_SOFTWARE: SoftwareItem[] = [
  {
    title: "NetLink IPTV Player Pro",
    description: "Official ultra-low latency IPTV & Live TV player optimized for NetWave fiber broadband.",
    download_url: "https://example.com/downloads/netlink-iptv.exe",
    version: "v3.4.1",
    category: "IPTV & Streaming",
    platform: "Windows / macOS",
    file_size: "45.2 MB",
    icon: "Tv",
  },
  {
    title: "NetWave SpeedTest & Diagnostics",
    description: "Advanced ping, jitter, packet loss tracker & network route analyzer.",
    download_url: "https://example.com/downloads/netwave-speedtest.zip",
    version: "v2.1.0",
    category: "Network Tools",
    platform: "Windows / Mac / Linux",
    file_size: "18.6 MB",
    icon: "Activity",
  },
  {
    title: "VLC Media Player",
    description: "Universal open-source multimedia player for network streams and raw video files.",
    download_url: "https://www.videolan.org/vlc/",
    version: "v3.0.21",
    category: "Media Players",
    platform: "Cross-platform",
    file_size: "40.0 MB",
    icon: "PlayCircle",
  },
  {
    title: "NetLink Router Configurator",
    description: "One-click WiFi SSID, security password setup & port-forwarding assistant.",
    download_url: "https://example.com/downloads/router-config.apk",
    version: "v1.8.0",
    category: "ISP Utilities",
    platform: "Android / iOS",
    file_size: "12.4 MB",
    icon: "Sliders",
  },
];

// Helper for local caching
const LOCAL_CONFIG_KEY = "netlink_config_store";
const LOCAL_PACKAGES_KEY = "netlink_packages_store";
const LOCAL_LINKS_KEY = "netlink_links_store";
const LOCAL_SOFTWARE_KEY = "netlink_software_store";
const LOCAL_ADMINS_KEY = "netlink_admins_store";

function getLocal<T>(key: string, defaultVal: T): T {
  if (typeof window === "undefined") return defaultVal;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

function saveLocal<T>(key: string, val: T) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error(`Failed to save key ${key}:`, e);
  }
}

// -------------------------------------------------------------
// Site Config Helpers
// -------------------------------------------------------------
export async function fetchSiteConfig(): Promise<SiteConfig> {
  try {
    const { data, error } = await supabase.from("site_config").select("*");
    if (error || !data || data.length === 0) {
      return getLocal(LOCAL_CONFIG_KEY, DEFAULT_SITE_CONFIG);
    }
    const configMap: Record<string, string> = {};
    data.forEach((row: { key: string; value: string }) => {
      configMap[row.key] = row.value;
    });
    return {
      brand_name: configMap.brand_name || DEFAULT_SITE_CONFIG.brand_name,
      hotline: configMap.hotline || DEFAULT_SITE_CONFIG.hotline,
      sales_phone: configMap.sales_phone || DEFAULT_SITE_CONFIG.sales_phone,
      support_email: configMap.support_email || DEFAULT_SITE_CONFIG.support_email,
      address: configMap.address || DEFAULT_SITE_CONFIG.address,
      banner_text: configMap.banner_text || DEFAULT_SITE_CONFIG.banner_text,
      network_status: configMap.network_status || DEFAULT_SITE_CONFIG.network_status,
      custom_min_mbps: configMap.custom_min_mbps || DEFAULT_SITE_CONFIG.custom_min_mbps,
      custom_base_internet_fee: configMap.custom_base_internet_fee || DEFAULT_SITE_CONFIG.custom_base_internet_fee,
      custom_price_per_10mbps: configMap.custom_price_per_10mbps || DEFAULT_SITE_CONFIG.custom_price_per_10mbps,
      custom_internet_install_fee: configMap.custom_internet_install_fee || DEFAULT_SITE_CONFIG.custom_internet_install_fee,
      custom_dish_install_fee: configMap.custom_dish_install_fee || DEFAULT_SITE_CONFIG.custom_dish_install_fee,
      custom_dish_hd_price: configMap.custom_dish_hd_price || DEFAULT_SITE_CONFIG.custom_dish_hd_price,
      custom_dish_4k_price: configMap.custom_dish_4k_price || DEFAULT_SITE_CONFIG.custom_dish_4k_price,
    };
  } catch {
    return getLocal(LOCAL_CONFIG_KEY, DEFAULT_SITE_CONFIG);
  }
}

export async function updateSiteConfig(config: SiteConfig): Promise<boolean> {
  saveLocal(LOCAL_CONFIG_KEY, config);
  try {
    const entries = Object.entries(config).map(([key, value]) => ({
      key,
      value,
      updated_at: new Date().toISOString(),
    }));
    await supabase.from("site_config").upsert(entries);
  } catch (e) {
    console.warn("Could not upsert site_config to Supabase:", e);
  }
  return true;
}

// Helper to normalize package items
function normalizePackage(p: any): PackageItem {
  const nameLower = (p.name || "").toLowerCase();
  const speedLower = (p.speed || "").toLowerCase();

  let cat: PackageCategory = p.category;
  if (!cat || !["internet_only", "dish_only", "combo"].includes(cat)) {
    if (nameLower.includes("dish") || speedLower.includes("dish") || speedLower.includes("satellite") || (p.dish_charge > 0 && p.connection_charge === 0 && !speedLower.includes("mbps"))) {
      cat = "dish_only";
    } else if (p.dish_charge === 0 || nameLower.includes("starter") || nameLower.includes("only internet")) {
      cat = "internet_only";
    } else {
      cat = "combo";
    }
  }

  const download = p.download_speed || p.speed || (cat === "dish_only" ? "N/A" : "100 Mbps");
  const upload = p.upload_speed || p.speed || (cat === "dish_only" ? "N/A" : "100 Mbps");

  return {
    id: p.id,
    name: p.name,
    category: cat,
    speed: p.speed || `${download} / ${upload}`,
    download_speed: download,
    upload_speed: upload,
    price: Number(p.price || 0),
    original_price: p.original_price ? Number(p.original_price) : undefined,
    offer_tag: p.offer_tag || undefined,
    connection_charge: Number(p.connection_charge || 0),
    dish_charge: Number(p.dish_charge || 0),
    features: Array.isArray(p.features) ? p.features : [],
    popular: !!p.popular,
    created_at: p.created_at,
  };
}

// -------------------------------------------------------------
// Packages Helpers
// -------------------------------------------------------------
export async function fetchPackages(): Promise<PackageItem[]> {
  try {
    const { data, error } = await supabase.from("packages").select("*").order("price", { ascending: true });
    if (!error && data) {
      const norm = data.map(normalizePackage);
      saveLocal(LOCAL_PACKAGES_KEY, norm);
      return norm;
    }
  } catch (e) {
    console.warn("Could not fetch packages from Supabase:", e);
  }

  const rawLocal = getLocal<PackageItem[] | null>(LOCAL_PACKAGES_KEY, null);
  if (rawLocal === null) {
    return DEFAULT_PACKAGES.map(normalizePackage);
  }
  return rawLocal.map(normalizePackage);
}

export async function addPackage(item: Omit<PackageItem, "id">): Promise<PackageItem> {
  const download = item.download_speed || item.speed || "100 Mbps";
  const upload = item.upload_speed || item.speed || "100 Mbps";

  const payload: any = {
    name: item.name,
    category: item.category || "combo",
    speed: item.speed || `${download} / ${upload}`,
    download_speed: download,
    upload_speed: upload,
    price: Number(item.price),
    original_price: item.original_price ? Number(item.original_price) : undefined,
    offer_tag: item.offer_tag || undefined,
    connection_charge: Number(item.connection_charge || 0),
    dish_charge: Number(item.dish_charge || 0),
    features: item.features,
    popular: !!item.popular,
  };

  try {
    let { data, error } = await supabase.from("packages").insert([payload]).select().single();
    if (error && (error.message?.includes("column") || error.code === "PGRST204" || error.code === "42703")) {
      const basePayload = { ...payload };
      delete basePayload.original_price;
      delete basePayload.offer_tag;
      const retry = await supabase.from("packages").insert([basePayload]).select().single();
      data = retry.data;
      error = retry.error;
    }
    if (!error && data) {
      const norm = normalizePackage({ ...data, original_price: item.original_price, offer_tag: item.offer_tag });
      const current = getLocal(LOCAL_PACKAGES_KEY, []);
      saveLocal(LOCAL_PACKAGES_KEY, [...current, norm]);
      return norm;
    }
  } catch (e) {
    console.error("Supabase addPackage exception:", e);
  }

  const localItem = normalizePackage({ ...payload, id: Date.now().toString() });
  const current = getLocal(LOCAL_PACKAGES_KEY, []);
  saveLocal(LOCAL_PACKAGES_KEY, [...current, localItem]);
  return localItem;
}

export async function updatePackage(id: string, item: Partial<PackageItem>): Promise<boolean> {
  const payload: any = { ...item };
  delete payload.id;

  try {
    const { error } = await supabase.from("packages").update(payload).eq("id", id);
    if (error && (error.message?.includes("column") || error.code === "PGRST204" || error.code === "42703")) {
      const basePayload = { ...payload };
      delete basePayload.original_price;
      delete basePayload.offer_tag;
      await supabase.from("packages").update(basePayload).eq("id", id);
    }
  } catch (e) {
    console.error("Supabase updatePackage exception:", e);
  }

  const current = getLocal(LOCAL_PACKAGES_KEY, []);
  const updated = current.map((p) => (p.id === id ? normalizePackage({ ...p, ...item }) : p));
  saveLocal(LOCAL_PACKAGES_KEY, updated);
  return true;
}

export async function deletePackage(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("packages").delete().eq("id", id);
    if (error) console.error("Supabase deletePackage error:", error);
  } catch (e) {
    console.error("Supabase deletePackage exception:", e);
  }

  const current = getLocal(LOCAL_PACKAGES_KEY, []);
  saveLocal(LOCAL_PACKAGES_KEY, current.filter((p) => p.id !== id));
  return true;
}

// -------------------------------------------------------------
// Links Helpers
// -------------------------------------------------------------
export async function fetchLinks(): Promise<LinkItem[]> {
  try {
    const { data, error } = await supabase.from("links").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      saveLocal(LOCAL_LINKS_KEY, data);
      return data as LinkItem[];
    }
  } catch (e) {
    console.warn("Could not fetch links from Supabase:", e);
  }
  const rawLocal = getLocal<LinkItem[] | null>(LOCAL_LINKS_KEY, null);
  return rawLocal === null ? DEFAULT_LINKS : rawLocal;
}

export async function addLink(link: Omit<LinkItem, "id">): Promise<LinkItem> {
  const payload = {
    name: link.name,
    url: link.url,
    desc: link.desc || "",
    category: link.category,
    icon: link.icon || "Globe",
    color: link.color || "bg-blue-600",
  };

  try {
    let { data, error } = await supabase.from("links").insert([payload]).select().single();
    if (error && (error.message?.includes("column") || error.code === "PGRST204" || error.code === "42703")) {
      const basePayload = { ...payload };
      delete (basePayload as any).category;
      const retry = await supabase.from("links").insert([basePayload]).select().single();
      data = retry.data;
      error = retry.error;
    }
    if (!error && data) {
      const norm = { ...data, category: link.category };
      const current = getLocal(LOCAL_LINKS_KEY, []);
      saveLocal(LOCAL_LINKS_KEY, [norm, ...current]);
      return norm as LinkItem;
    }
    console.error("Supabase addLink error:", error);
  } catch (e) {
    console.error("Supabase addLink exception:", e);
  }

  const localItem = { ...link, id: Date.now().toString() };
  const current = getLocal(LOCAL_LINKS_KEY, []);
  saveLocal(LOCAL_LINKS_KEY, [localItem, ...current]);
  return localItem;
}

export async function updateLink(id: string, item: Partial<LinkItem>): Promise<boolean> {
  const payload: any = { ...item };
  delete payload.id;
  try {
    let { error } = await supabase.from("links").update(payload).eq("id", id);
    if (error && (error.message?.includes("column") || error.code === "PGRST204" || error.code === "42703")) {
      const basePayload = { ...payload };
      delete basePayload.category;
      await supabase.from("links").update(basePayload).eq("id", id);
    }
    if (error) console.error("Supabase updateLink error:", error);
  } catch (e) {
    console.error("Supabase updateLink exception:", e);
  }

  const current = getLocal(LOCAL_LINKS_KEY, []);
  const updated = current.map((l) => (String(l.id) === String(id) ? { ...l, ...item } : l));
  saveLocal(LOCAL_LINKS_KEY, updated);
  return true;
}

export async function deleteLink(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("links").delete().eq("id", id);
    if (error) console.error("Supabase deleteLink error:", error);
  } catch (e) {
    console.error("Supabase deleteLink exception:", e);
  }

  const current = getLocal(LOCAL_LINKS_KEY, []);
  saveLocal(LOCAL_LINKS_KEY, current.filter((l) => String(l.id) !== String(id)));
  return true;
}

// -------------------------------------------------------------
// Software Helpers
// -------------------------------------------------------------
export async function fetchSoftware(): Promise<SoftwareItem[]> {
  try {
    const { data, error } = await supabase.from("software").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      saveLocal(LOCAL_SOFTWARE_KEY, data);
      return data as SoftwareItem[];
    }
  } catch (e) {
    console.warn("Could not fetch software from Supabase:", e);
  }
  const rawLocal = getLocal<SoftwareItem[] | null>(LOCAL_SOFTWARE_KEY, null);
  return rawLocal === null ? DEFAULT_SOFTWARE : rawLocal;
}

export async function addSoftware(item: Omit<SoftwareItem, "id">): Promise<SoftwareItem> {
  const payload = {
    title: item.title,
    description: item.description,
    download_url: item.download_url,
    version: item.version,
    category: item.category,
    platform: item.platform,
    file_size: item.file_size || "",
    icon: item.icon || "Download",
  };

  try {
    let { data, error } = await supabase.from("software").insert([payload]).select().single();
    if (error && (error.message?.includes("column") || error.code === "PGRST204" || error.code === "42703")) {
      const basePayload = { ...payload };
      delete (basePayload as any).category;
      const retry = await supabase.from("software").insert([basePayload]).select().single();
      data = retry.data;
      error = retry.error;
    }
    if (!error && data) {
      const norm = { ...data, category: item.category };
      const current = getLocal(LOCAL_SOFTWARE_KEY, []);
      saveLocal(LOCAL_SOFTWARE_KEY, [norm, ...current]);
      return norm as SoftwareItem;
    }
    console.error("Supabase addSoftware error:", error);
  } catch (e) {
    console.error("Supabase addSoftware exception:", e);
  }

  const localItem = { ...item, id: Date.now().toString() };
  const current = getLocal(LOCAL_SOFTWARE_KEY, []);
  saveLocal(LOCAL_SOFTWARE_KEY, [localItem, ...current]);
  return localItem;
}

export async function updateSoftware(id: string, item: Partial<SoftwareItem>): Promise<boolean> {
  const payload: any = { ...item };
  delete payload.id;
  try {
    let { error } = await supabase.from("software").update(payload).eq("id", id);
    if (error && (error.message?.includes("column") || error.code === "PGRST204" || error.code === "42703")) {
      const basePayload = { ...payload };
      delete basePayload.category;
      await supabase.from("software").update(basePayload).eq("id", id);
    }
    if (error) console.error("Supabase updateSoftware error:", error);
  } catch (e) {
    console.error("Supabase updateSoftware exception:", e);
  }

  const current = getLocal(LOCAL_SOFTWARE_KEY, []);
  const updated = current.map((s) => (String(s.id) === String(id) ? { ...s, ...item } : s));
  saveLocal(LOCAL_SOFTWARE_KEY, updated);
  return true;
}

export async function deleteSoftware(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("software").delete().eq("id", id);
    if (error) console.error("Supabase deleteSoftware error:", error);
  } catch (e) {
    console.error("Supabase deleteSoftware exception:", e);
  }

  const current = getLocal(LOCAL_SOFTWARE_KEY, []);
  saveLocal(LOCAL_SOFTWARE_KEY, current.filter((s) => s.id !== id));
  return true;
}

// -------------------------------------------------------------
// Admin Users Helpers
// -------------------------------------------------------------
export async function fetchAdminUsers(): Promise<AdminUser[]> {
  try {
    const { data, error } = await supabase.from("admin_users").select("*").order("created_at", { ascending: false });
    if (!error && data) {
      saveLocal(LOCAL_ADMINS_KEY, data);
      return data as AdminUser[];
    }
  } catch {
    // fallback
  }
  return getLocal(LOCAL_ADMINS_KEY, []);
}

export async function addAdminUser(user: Omit<AdminUser, "id">): Promise<AdminUser> {
  const payload = {
    name: user.name,
    email: user.email.trim().toLowerCase(),
    password: user.password || "123456",
    role: user.role,
  };

  try {
    const { data, error } = await supabase.from("admin_users").insert([payload]).select().single();
    if (!error && data) {
      const current = getLocal(LOCAL_ADMINS_KEY, []);
      saveLocal(LOCAL_ADMINS_KEY, [data, ...current]);
      return data as AdminUser;
    }
    console.error("Supabase addAdminUser error:", error);
  } catch (e) {
    console.error("Supabase addAdminUser exception:", e);
  }

  const localItem = { ...payload, id: Date.now().toString() };
  const current = getLocal(LOCAL_ADMINS_KEY, []);
  saveLocal(LOCAL_ADMINS_KEY, [localItem, ...current]);
  return localItem;
}

export async function updateAdminUser(id: string, user: Partial<AdminUser>): Promise<boolean> {
  const payload: any = { ...user };
  delete payload.id;
  if (payload.email) payload.email = payload.email.trim().toLowerCase();

  try {
    const { error } = await supabase.from("admin_users").update(payload).eq("id", id);
    if (error) console.error("Supabase updateAdminUser error:", error);
  } catch (e) {
    console.error("Supabase updateAdminUser exception:", e);
  }

  const current = getLocal(LOCAL_ADMINS_KEY, []);
  const updated = current.map((a) => (a.id === id ? { ...a, ...user } : a));
  saveLocal(LOCAL_ADMINS_KEY, updated);
  return true;
}

export async function deleteAdminUser(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("admin_users").delete().eq("id", id);
    if (error) console.error("Supabase deleteAdminUser error:", error);
  } catch (e) {
    console.error("Supabase deleteAdminUser exception:", e);
  }

  const current = getLocal(LOCAL_ADMINS_KEY, []);
  saveLocal(LOCAL_ADMINS_KEY, current.filter((a) => a.id !== id));
  return true;
}

// -------------------------------------------------------------
// Contact Messages Helpers
// -------------------------------------------------------------
export async function fetchContactMessages(): Promise<ContactMessage[]> {
  try {
    const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (!error && data) return data as ContactMessage[];
  } catch {}
  return [];
}

export async function addContactMessage(msg: Omit<ContactMessage, "id">): Promise<ContactMessage> {
  const payload = {
    name: msg.name,
    email: msg.email,
    phone: msg.phone,
    request_type: msg.request_type,
    message: msg.message,
    is_read: false,
  };
  try {
    const { data, error } = await supabase.from("contact_messages").insert([payload]).select().single();
    if (!error && data) return data as ContactMessage;
    console.error("Supabase addContactMessage error:", error);
  } catch (e) {
    console.error("Supabase addContactMessage exception:", e);
  }
  return { ...payload, id: Date.now().toString() };
}

export async function markMessageRead(id: string): Promise<boolean> {
  try {
    await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
  } catch (e) {
    console.error("markMessageRead error:", e);
  }
  return true;
}

export async function deleteContactMessage(id: string): Promise<boolean> {
  try {
    await supabase.from("contact_messages").delete().eq("id", id);
  } catch (e) {
    console.error("deleteContactMessage error:", e);
  }
  return true;
}

// -------------------------------------------------------------
// Strict Authentication Verification against Supabase
// -------------------------------------------------------------
export async function loginAdminWithSupabase(
  email: string,
  pass: string
): Promise<{ success: boolean; role: AdminRole; name?: string; message?: string }> {
  const trimmedEmail = email.trim().toLowerCase();

  // 1. Query Supabase admin_users DB table directly
  try {
    const { data: dbUsers, error: dbError } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", trimmedEmail);

    if (!dbError && dbUsers && dbUsers.length > 0) {
      const dbUser = dbUsers[0];
      if (dbUser.password && dbUser.password !== pass) {
        return { success: false, role: dbUser.role as AdminRole, message: `Incorrect password for ${trimmedEmail}.` };
      }
      return { success: true, role: dbUser.role as AdminRole, name: dbUser.name };
    }
  } catch (e) {
    console.warn("Supabase admin lookup exception:", e);
  }

  // 2. Try Supabase Auth API
  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: trimmedEmail,
      password: pass,
    });

    if (!authError && authData.session) {
      return { success: true, role: "super_admin", name: authData.user?.email };
    }
  } catch {
    // ignore
  }

  // 3. Fallback ONLY if network was offline (check local cache)
  const localAdmins = getLocal(LOCAL_ADMINS_KEY, []);
  const matchedAdmin = localAdmins.find((a) => a.email.trim().toLowerCase() === trimmedEmail);

  if (matchedAdmin) {
    if (matchedAdmin.password && matchedAdmin.password !== pass) {
      return { success: false, role: matchedAdmin.role, message: `Incorrect password for ${trimmedEmail}.` };
    }
    return { success: true, role: matchedAdmin.role, name: matchedAdmin.name };
  }

  return {
    success: false,
    role: "sub_admin",
    message: `No admin account found for email "${email}".`,
  };
}

// Session Management
const ADMIN_ROLE_KEY = "netlink_active_admin_role";
const ADMIN_EMAIL_KEY = "netlink_active_admin_email";

export function checkAdminSession(): { authenticated: boolean; role: AdminRole; email: string } {
  if (typeof window === "undefined") return { authenticated: false, role: "super_admin", email: "" };
  const role = (sessionStorage.getItem(ADMIN_ROLE_KEY) as AdminRole) || "super_admin";
  const email = sessionStorage.getItem(ADMIN_EMAIL_KEY) || "admin@netlink.com";
  const authed = sessionStorage.getItem("netlink_admin_authenticated") === "true";
  return { authenticated: authed, role, email };
}

export function setAdminSession(auth: boolean, role: AdminRole = "super_admin", email: string = "admin@netlink.com") {
  if (typeof window === "undefined") return;
  if (auth) {
    sessionStorage.setItem("netlink_admin_authenticated", "true");
    sessionStorage.setItem(ADMIN_ROLE_KEY, role);
    sessionStorage.setItem(ADMIN_EMAIL_KEY, email);
  } else {
    sessionStorage.removeItem("netlink_admin_authenticated");
    sessionStorage.removeItem(ADMIN_ROLE_KEY);
    sessionStorage.removeItem(ADMIN_EMAIL_KEY);
  }
}

// -------------------------------------------------------------
// SUPPORT FAQS MANAGEMENT (Client / LocalStorage persistent)
// -------------------------------------------------------------
export interface FAQItem {
  id?: string;
  q: string;
  a: string;
}

export const DEFAULT_FAQS: FAQItem[] = [
  { id: "1", q: "How fast is standard fiber installation?", a: "Standard fiber optic installation is completed within 24 to 48 hours of ordering, with same-day installation available in active coverage areas." },
  { id: "2", q: "What is the connection & IPTV dish charge?", a: "Starter plans have a small one-time installation setup fee. Pro Gigabit & Family plans include FREE connection and IPTV dish setup." },
  { id: "3", q: "How do I access local FTP media servers and IPTV?", a: "You can find all active local FTP servers and live IPTV streams under our Entertainment Hub page or directly in the Software Center." },
  { id: "4", q: "What happens if my router loses signal?", a: "Contact our 24/7 Technical NOC desk at +1 (800) 555-0199 or submit an inquiry through our Contact page. Average response time is under 15 minutes." },
  { id: "5", q: "Are there long-term contract lock-ins?", a: "No. All NetLink Fiber broadband plans are month-to-month. You can upgrade, downgrade, or pause your service anytime." },
  { id: "6", q: "Can I get a dedicated static IP address?", a: "Yes. Static public IPv4/IPv6 addresses can be requested for home CCTV, VPN servers, or enterprise servers during checkout or via customer care." },
];

export async function fetchFAQs(): Promise<FAQItem[]> {
  try {
    // 1. Try fetching directly from Supabase 'faqs' database table
    const { data: dbData, error: dbError } = await supabase
      .from("faqs")
      .select("*")
      .order("created_at", { ascending: true });

    if (!dbError && dbData && dbData.length > 0) {
      const items: FAQItem[] = dbData.map((row: any) => ({
        id: String(row.id),
        q: row.q || row.question || "",
        a: row.a || row.answer || "",
      }));
      saveLocal("netlink_support_faqs", items);
      return items;
    }

    // 2. Try fetching from Supabase 'site_config' table key 'faqs'
    const { data: configData, error: cfgError } = await supabase
      .from("site_config")
      .select("value")
      .eq("key", "faqs")
      .maybeSingle();

    if (!cfgError && configData && configData.value !== undefined) {
      try {
        const parsed = JSON.parse(configData.value);
        if (Array.isArray(parsed)) {
          saveLocal("netlink_support_faqs", parsed);
          return parsed;
        }
      } catch (e) {
        console.error("Invalid JSON in site_config faqs:", e);
      }
    }
  } catch (e) {
    console.warn("Could not fetch FAQs from Supabase database:", e);
  }

  // 3. Fallback to local storage or empty array if none saved
  return getLocal("netlink_support_faqs", []);
}

export async function saveFAQs(faqs: FAQItem[]): Promise<void> {
  // Update local cache immediately
  saveLocal("netlink_support_faqs", faqs);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("storage"));
  }

  try {
    // 1. Upsert into Supabase 'site_config' table (key: 'faqs', value: JSON array string)
    await supabase.from("site_config").upsert([
      {
        key: "faqs",
        value: JSON.stringify(faqs),
        updated_at: new Date().toISOString(),
      },
    ]);

    // 2. Also try upserting directly into 'faqs' table if created
    const rows = faqs.map((f, i) => ({
      id: f.id || String(Date.now() + i),
      question: f.q,
      answer: f.a,
      q: f.q,
      a: f.a,
      created_at: new Date().toISOString(),
    }));
    await supabase.from("faqs").upsert(rows);
  } catch (e) {
    console.warn("Saved FAQs locally, Supabase sync notice:", e);
  }
}
