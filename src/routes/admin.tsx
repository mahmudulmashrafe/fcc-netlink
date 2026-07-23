import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  fetchLinks,
  addLink,
  updateLink,
  deleteLink,
  LinkItem,
  fetchSoftware,
  addSoftware,
  updateSoftware,
  deleteSoftware,
  SoftwareItem,
  checkAdminSession,
  setAdminSession,
  AdminRole,
  AdminUser,
  fetchAdminUsers,
  addAdminUser,
  updateAdminUser,
  deleteAdminUser,
  loginAdminWithSupabase,
  PackageItem,
  PackageCategory,
  fetchPackages,
  addPackage,
  updatePackage,
  deletePackage,
  SiteConfig,
  fetchSiteConfig,
  updateSiteConfig,
  ContactMessage,
  fetchContactMessages,
  markMessageRead,
  deleteContactMessage,
  fetchFAQs,
  saveFAQs,
  FAQItem,
} from "../lib/supabase";
import {
  ShieldCheck,
  Plus,
  Trash2,
  Globe,
  Download,
  Upload,
  ExternalLink,
  RefreshCw,
  LogOut,
  KeyRound,
  AlertCircle,
  Users,
  Crown,
  UserCheck,
  ShieldAlert,
  Package,
  PhoneCall,
  Save,
  CheckCircle2,
  Edit,
  X,
  Wifi,
  Tv,
  Sparkles,
  ArrowDown,
  ArrowUp,
  MessageSquare,
  Mail,
  Eye,
  EyeOff,
  AlertTriangle,
  HelpCircle,
  SlidersHorizontal,
} from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Portal — NetLink Fiber Management" },
      { name: "description", content: "Manage packages, site contact info, sub-admins, links, and software tools." },
    ],
  }),
  component: AdminPage,
});

export function AdminPage() {
  const [isMounted, setIsMounted] = useState(false);

  // Authentication & Role State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<AdminRole>("super_admin");
  const [currentEmail, setCurrentEmail] = useState<string>("");
  
  // Login Form State
  const [passwordInput, setPasswordInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [authError, setAuthError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);

  // Active Tab State
  const [activeTab, setActiveTab] = useState<"links" | "software" | "packages" | "faqs" | "site_config" | "users" | "messages">("links");

  // Modal Control States
  const [activeModal, setActiveModal] = useState<null | "link" | "software" | "package" | "user" | "faq" | "config_contact" | "config_pricing">(null);
  
  // Confirmation Delete Popup Modal State
  const [confirmDelete, setConfirmDelete] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => Promise<void> | void;
  }>({ isOpen: false, title: "", message: "", onConfirm: () => {} });

  // FAQs State
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loadingFaqs, setLoadingFaqs] = useState(true);
  const [editingFaq, setEditingFaq] = useState<FAQItem | null>(null);
  const [newFaqQ, setNewFaqQ] = useState("");
  const [newFaqA, setNewFaqA] = useState("");

  // Links State
  const [links, setLinks] = useState<LinkItem[]>([]);
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [editingLink, setEditingLink] = useState<LinkItem | null>(null);
  const [newLinkName, setNewLinkName] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [newLinkDesc, setNewLinkDesc] = useState("");
  const [newLinkCategory, setNewLinkCategory] = useState("FTP & Storage");
  const [newLinkIcon, setNewLinkIcon] = useState("");

  // Software State
  const [softwareList, setSoftwareList] = useState<SoftwareItem[]>([]);
  const [loadingSoftware, setLoadingSoftware] = useState(true);
  const [editingSoftware, setEditingSoftware] = useState<SoftwareItem | null>(null);
  const [newSoftwareTitle, setNewSoftwareTitle] = useState("");
  const [newSoftwareDesc, setNewSoftwareDesc] = useState("");
  const [newSoftwareUrl, setNewSoftwareUrl] = useState("");
  const [newSoftwareVersion, setNewSoftwareVersion] = useState("v1.0.0");
  const [newSoftwareCategory, setNewSoftwareCategory] = useState("IPTV & Streaming");
  const [newSoftwarePlatform, setNewSoftwarePlatform] = useState("Windows / Mac");
  const [newSoftwareSize, setNewSoftwareSize] = useState("25.0 MB");
  const [newSoftwareIcon, setNewSoftwareIcon] = useState("");

  // Packages State
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [editingPkg, setEditingPkg] = useState<PackageItem | null>(null);
  const [newPkgName, setNewPkgName] = useState("");
  const [newPkgCategory, setNewPkgCategory] = useState<PackageCategory>("combo");
  const [newPkgDownloadSpeed, setNewPkgDownloadSpeed] = useState("100 Mbps");
  const [newPkgUploadSpeed, setNewPkgUploadSpeed] = useState("100 Mbps");
  const [newPkgPrice, setNewPkgPrice] = useState(29);
  const [newPkgOriginalPrice, setNewPkgOriginalPrice] = useState<number | undefined>(undefined);
  const [newPkgOfferTag, setNewPkgOfferTag] = useState<string>("");
  const [newPkgConnCharge, setNewPkgConnCharge] = useState(15);
  const [newPkgDishCharge, setNewPkgDishCharge] = useState(10);
  const [newPkgFeatures, setNewPkgFeatures] = useState("4K Streaming\nFree Wi-Fi Router\nBDIX Access");
  const [newPkgPopular, setNewPkgPopular] = useState(false);

  // Site Config State
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
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
  });
  const [savingConfig, setSavingConfig] = useState(false);

  // Admin Users State (Super Admin Only)
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [newAdminName, setNewAdminName] = useState("");
  const [newAdminPassword, setNewAdminPassword] = useState("123456");
  const [newAdminRole, setNewAdminRole] = useState<AdminRole>("sub_admin");

  // Contact Messages State
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(true);

  // Toast alert feedback
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  useEffect(() => {
    setIsMounted(true);
    const session = checkAdminSession();
    if (session.authenticated) {
      setIsAuthenticated(true);
      setCurrentRole(session.role);
      setCurrentEmail(session.email);
      loadAll();
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setLoggingIn(true);

    try {
      const result = await loginAdminWithSupabase(emailInput, passwordInput);
      if (result.success) {
        setAdminSession(true, result.role, emailInput);
        setIsAuthenticated(true);
        setCurrentRole(result.role);
        setCurrentEmail(emailInput);
        setPasswordInput("");
        loadAll();
      } else {
        setAuthError(result.message || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setAuthError("Failed to authenticate with Supabase.");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setAdminSession(false);
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  const loadAll = async () => {
    setLoadingLinks(true);
    setLoadingSoftware(true);
    setLoadingPackages(true);
    setLoadingUsers(true);
    setLoadingMessages(true);
    setLoadingFaqs(true);

    const [fetchedLinks, fetchedSoftware, fetchedPackages, fetchedConfig, fetchedUsers, fetchedMessages, fetchedFaqs] = await Promise.all([
      fetchLinks(),
      fetchSoftware(),
      fetchPackages(),
      fetchSiteConfig(),
      fetchAdminUsers(),
      fetchContactMessages(),
      fetchFAQs(),
    ]);

    setLinks(fetchedLinks);
    setSoftwareList(fetchedSoftware);
    setPackages(fetchedPackages);
    if (fetchedConfig) {
      setSiteConfig((prev) => ({ ...prev, ...fetchedConfig }));
    }
    setAdminUsers(fetchedUsers);
    setContactMessages(fetchedMessages);
    setFaqs(fetchedFaqs);

    setLoadingLinks(false);
    setLoadingSoftware(false);
    setLoadingPackages(false);
    setLoadingUsers(false);
    setLoadingMessages(false);
    setLoadingFaqs(false);
  };

  // -------------------------------------------------------------
  // FAQ Handlers
  // -------------------------------------------------------------
  const openAddFaqModal = () => {
    setEditingFaq(null);
    setNewFaqQ("");
    setNewFaqA("");
    setActiveModal("faq");
  };

  const openEditFaqModal = (faq: FAQItem) => {
    setEditingFaq(faq);
    setNewFaqQ(faq.q);
    setNewFaqA(faq.a);
    setActiveModal("faq");
  };

  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFaqQ || !newFaqA) return;

    let updated: FAQItem[];
    if (editingFaq && editingFaq.id) {
      updated = faqs.map((f) => (f.id === editingFaq.id ? { ...f, q: newFaqQ, a: newFaqA } : f));
      setMessage({ text: "Successfully updated support FAQ question!", type: "success" });
    } else {
      const newFaq: FAQItem = { id: String(Date.now()), q: newFaqQ, a: newFaqA };
      updated = [...faqs, newFaq];
      setMessage({ text: "Successfully added new support FAQ question!", type: "success" });
    }
    setFaqs(updated);
    await saveFAQs(updated);
    setActiveModal(null);
  };

  const promptDeleteFaq = (id: string, question: string) => {
    setConfirmDelete({
      isOpen: true,
      title: "Delete Support FAQ?",
      message: `Are you sure you want to delete question "${question}"? It will be removed from the public support page immediately.`,
      onConfirm: async () => {
        const updated = faqs.filter((f) => f.id !== id);
        setFaqs(updated);
        await saveFAQs(updated);
        setMessage({ text: `Deleted FAQ question "${question}".`, type: "success" });
      },
    });
  };

  // -------------------------------------------------------------
  // Link Handlers
  // -------------------------------------------------------------
  const openAddLinkModal = () => {
    setEditingLink(null);
    setNewLinkName("");
    setNewLinkUrl("");
    setNewLinkDesc("");
    setNewLinkCategory("FTP & Storage");
    setNewLinkIcon("");
    setActiveModal("link");
  };

  const openEditLinkModal = (link: LinkItem) => {
    setEditingLink(link);
    setNewLinkName(link.name);
    setNewLinkUrl(link.url);
    setNewLinkDesc(link.desc || "");
    setNewLinkCategory(link.category);
    setNewLinkIcon(link.icon || "");
    setActiveModal("link");
  };

  const handleSaveLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLinkName || !newLinkUrl) return;

    if (editingLink && editingLink.id) {
      const updateData = {
        name: newLinkName,
        url: newLinkUrl,
        desc: newLinkDesc,
        category: newLinkCategory,
        icon: newLinkIcon || "Globe",
      };
      await updateLink(editingLink.id, updateData);
      setLinks(links.map((l) => (l.id === editingLink.id ? { ...l, ...updateData } : l)));
      setMessage({ text: `Successfully updated link "${newLinkName}"!`, type: "success" });
    } else {
      const added = await addLink({
        name: newLinkName,
        url: newLinkUrl,
        desc: newLinkDesc || `Added by ${currentRole}`,
        category: newLinkCategory,
        icon: newLinkIcon || "Globe",
        color: "bg-[#B45309]",
      });
      setLinks([added, ...links]);
      setMessage({ text: `Successfully added link "${added.name}"!`, type: "success" });
    }

    setActiveModal(null);
  };

  const promptDeleteLink = (id: string, name: string) => {
    if (currentRole !== "super_admin") {
      setMessage({ text: "Only Super Admins can delete links.", type: "error" });
      return;
    }
    setActiveModal(null);
    setConfirmDelete({
      isOpen: true,
      title: "Delete Web Link Address",
      message: `Are you sure you want to delete "${name}"? This action will remove the link from the portal.`,
      onConfirm: async () => {
        await deleteLink(id);
        setLinks(links.filter((l) => String(l.id) !== String(id)));
        setMessage({ text: `Successfully deleted link "${name}".`, type: "success" });
        setActiveModal(null);
      },
    });
  };

  // -------------------------------------------------------------
  // Software Handlers
  // -------------------------------------------------------------
  const openAddSoftwareModal = () => {
    setEditingSoftware(null);
    setNewSoftwareTitle("");
    setNewSoftwareUrl("");
    setNewSoftwareDesc("");
    setNewSoftwareVersion("v1.0.0");
    setNewSoftwareCategory("IPTV & Streaming");
    setNewSoftwarePlatform("Windows / Mac");
    setNewSoftwareSize("25.0 MB");
    setNewSoftwareIcon("");
    setActiveModal("software");
  };

  const openEditSoftwareModal = (item: SoftwareItem) => {
    setEditingSoftware(item);
    setNewSoftwareTitle(item.title);
    setNewSoftwareUrl(item.download_url);
    setNewSoftwareDesc(item.description);
    setNewSoftwareVersion(item.version);
    setNewSoftwareCategory(item.category);
    setNewSoftwarePlatform(item.platform);
    setNewSoftwareSize(item.file_size || "25.0 MB");
    setNewSoftwareIcon(item.icon || "");
    setActiveModal("software");
  };

  const handleSaveSoftware = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSoftwareTitle || !newSoftwareUrl) return;

    if (editingSoftware && editingSoftware.id) {
      const updateData = {
        title: newSoftwareTitle,
        description: newSoftwareDesc,
        download_url: newSoftwareUrl,
        version: newSoftwareVersion,
        category: newSoftwareCategory,
        platform: newSoftwarePlatform,
        file_size: newSoftwareSize,
        icon: newSoftwareIcon || "Download",
      };
      await updateSoftware(editingSoftware.id, updateData);
      setSoftwareList(softwareList.map((s) => (s.id === editingSoftware.id ? { ...s, ...updateData } : s)));
      setMessage({ text: `Successfully updated software "${newSoftwareTitle}"!`, type: "success" });
    } else {
      const added = await addSoftware({
        title: newSoftwareTitle,
        description: newSoftwareDesc || "Official tool",
        download_url: newSoftwareUrl,
        version: newSoftwareVersion || "v1.0.0",
        category: newSoftwareCategory,
        platform: newSoftwarePlatform,
        file_size: newSoftwareSize,
        icon: newSoftwareIcon || "Download",
      });
      setSoftwareList([added, ...softwareList]);
      setMessage({ text: `Successfully added software "${added.title}"!`, type: "success" });
    }

    setActiveModal(null);
  };

  const promptDeleteSoftware = (id: string, title: string) => {
    if (currentRole !== "super_admin") {
      setMessage({ text: "Only Super Admins can delete software.", type: "error" });
      return;
    }
    setActiveModal(null);
    setConfirmDelete({
      isOpen: true,
      title: "Delete Software Download",
      message: `Are you sure you want to delete "${title}"? This tool will be removed from the Software Center.`,
      onConfirm: async () => {
        await deleteSoftware(id);
        setSoftwareList(softwareList.filter((s) => String(s.id) !== String(id)));
        setMessage({ text: `Successfully deleted software "${title}".`, type: "success" });
        setActiveModal(null);
      },
    });
  };

  // -------------------------------------------------------------
  // Package Handlers
  // -------------------------------------------------------------
  const openAddPackageModal = () => {
    setEditingPkg(null);
    setNewPkgName("");
    setNewPkgCategory("combo");
    setNewPkgDownloadSpeed("100 Mbps");
    setNewPkgUploadSpeed("100 Mbps");
    setNewPkgPrice(29);
    setNewPkgOriginalPrice(39);
    setNewPkgOfferTag("25% OFF");
    setNewPkgConnCharge(15);
    setNewPkgDishCharge(10);
    setNewPkgFeatures("4K Streaming\nFree Wi-Fi Router\nBDIX Access");
    setNewPkgPopular(false);
    setActiveModal("package");
  };

  const openEditPackageModal = (pkg: PackageItem) => {
    setEditingPkg(pkg);
    setNewPkgName(pkg.name);
    setNewPkgCategory(pkg.category || "combo");
    setNewPkgDownloadSpeed(pkg.download_speed || pkg.speed || "100 Mbps");
    setNewPkgUploadSpeed(pkg.upload_speed || pkg.speed || "100 Mbps");
    setNewPkgPrice(pkg.price);
    setNewPkgOriginalPrice(pkg.original_price);
    setNewPkgOfferTag(pkg.offer_tag || "");
    setNewPkgConnCharge(pkg.connection_charge);
    setNewPkgDishCharge(pkg.dish_charge);
    setNewPkgFeatures(pkg.features.join("\n"));
    setNewPkgPopular(!!pkg.popular);
    setActiveModal("package");
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgName) return;
    const featureArray = newPkgFeatures.split("\n").map((f) => f.trim()).filter(Boolean);

    const speedStr = newPkgCategory === "dish_only" 
      ? "Satellite Dish TV" 
      : `${newPkgDownloadSpeed} / ${newPkgUploadSpeed}`;

    const pkgData: PackageItem = {
      name: newPkgName,
      category: newPkgCategory,
      speed: speedStr,
      download_speed: newPkgCategory === "dish_only" ? "N/A" : newPkgDownloadSpeed,
      upload_speed: newPkgCategory === "dish_only" ? "N/A" : newPkgUploadSpeed,
      price: Number(newPkgPrice),
      original_price: newPkgOriginalPrice ? Number(newPkgOriginalPrice) : undefined,
      offer_tag: newPkgOfferTag || undefined,
      connection_charge: Number(newPkgConnCharge),
      dish_charge: newPkgCategory === "internet_only" ? 0 : Number(newPkgDishCharge),
      features: featureArray,
      popular: newPkgPopular,
    };

    if (editingPkg && editingPkg.id) {
      await updatePackage(editingPkg.id, pkgData);
      setPackages(packages.map((p) => (p.id === editingPkg.id ? { ...p, ...pkgData } : p)));
      setMessage({ text: `Successfully updated package "${newPkgName}"!`, type: "success" });
    } else {
      const added = await addPackage(pkgData);
      setPackages([...packages, added]);
      setMessage({ text: `Successfully added new package "${added.name}"!`, type: "success" });
    }

    setActiveModal(null);
  };

  const promptDeletePackage = (id: string, name: string) => {
    if (currentRole !== "super_admin") {
      setMessage({ text: "Only Super Admins can delete packages.", type: "error" });
      return;
    }
    setActiveModal(null);
    setConfirmDelete({
      isOpen: true,
      title: "Delete Internet / Dish Package",
      message: `Are you sure you want to delete package "${name}"? Customers will no longer be able to select it.`,
      onConfirm: async () => {
        await deletePackage(id);
        setPackages(packages.filter((p) => String(p.id) !== String(id)));
        setMessage({ text: `Successfully deleted package "${name}".`, type: "success" });
        setActiveModal(null);
      },
    });
  };

  // -------------------------------------------------------------
  // Site Config Handlers
  // -------------------------------------------------------------
  const handleSaveSiteConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingConfig(true);
    await updateSiteConfig(siteConfig);
    setSavingConfig(false);
    setMessage({ text: "Site contact & custom package rules saved successfully!", type: "success" });
  };

  // -------------------------------------------------------------
  // Admin User Handlers
  // -------------------------------------------------------------
  const openAddUserModal = () => {
    setEditingUser(null);
    setNewAdminName("");
    setNewAdminEmail("");
    setNewAdminPassword("123456");
    setNewAdminRole("sub_admin");
    setActiveModal("user");
  };

  const openEditUserModal = (u: AdminUser) => {
    setEditingUser(u);
    setNewAdminName(u.name);
    setNewAdminEmail(u.email);
    setNewAdminPassword(u.password || "123456");
    setNewAdminRole(u.role);
    setActiveModal("user");
  };

  const handleSaveAdminUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentRole !== "super_admin") {
      setMessage({ text: "Only Super Admins can add or edit admin users.", type: "error" });
      return;
    }
    if (!newAdminEmail || !newAdminName) return;

    if (editingUser && editingUser.id) {
      await updateAdminUser(editingUser.id, {
        name: newAdminName,
        email: newAdminEmail.trim().toLowerCase(),
        password: newAdminPassword,
        role: newAdminRole,
      });

      setAdminUsers(adminUsers.map((u) => u.id === editingUser.id ? {
        ...u,
        name: newAdminName,
        email: newAdminEmail.trim().toLowerCase(),
        password: newAdminPassword,
        role: newAdminRole,
      } : u));

      setMessage({ text: `Successfully updated admin user "${newAdminName}"!`, type: "success" });
    } else {
      const added = await addAdminUser({
        name: newAdminName,
        email: newAdminEmail.trim().toLowerCase(),
        password: newAdminPassword || "123456",
        role: newAdminRole,
      });

      setAdminUsers([added, ...adminUsers]);
      setMessage({ text: `Successfully created ${newAdminRole === "super_admin" ? "Super Admin" : "Sub Admin"} user "${added.name}"!`, type: "success" });
    }

    setActiveModal(null);
  };

  const promptDeleteAdminUser = (id: string, name: string, role?: string) => {
    if (currentRole !== "super_admin") {
      setMessage({ text: "Only Super Admins can delete users.", type: "error" });
      return;
    }
    if (role === "super_admin") {
      setMessage({ text: "Super Admin accounts cannot be deleted.", type: "error" });
      return;
    }
    setConfirmDelete({
      isOpen: true,
      title: "Revoke Admin Access",
      message: `Are you sure you want to delete admin account "${name}"? They will lose access to the portal immediately.`,
      onConfirm: async () => {
        await deleteAdminUser(id);
        setAdminUsers(adminUsers.filter((u) => u.id !== id));
        setMessage({ text: `Successfully revoked admin access for "${name}".`, type: "success" });
      },
    });
  };

  const promptDeleteMessage = (id: string, name: string) => {
    if (currentRole !== "super_admin") {
      setMessage({ text: "Only Super Admins can delete contact messages.", type: "error" });
      return;
    }
    setConfirmDelete({
      isOpen: true,
      title: "Delete Contact Message",
      message: `Are you sure you want to delete the message from "${name}"?`,
      onConfirm: async () => {
        await deleteContactMessage(id);
        setContactMessages(contactMessages.filter((m) => m.id !== id));
        setMessage({ text: `Deleted message from "${name}".`, type: "success" });
      },
    });
  };

  if (!isMounted) return null;

  // LOGIN SCREEN (MATCHES WEBSITE DARK OBSIDIAN & ELECTRIC NEON LIME PALETTE)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0B0C0E] text-white flex items-center justify-center p-4 selection:bg-[#D2F500] selection:text-black">
        <div className="bg-[#121316] border border-[#24272D] rounded-3xl p-8 md:p-12 max-w-md w-full shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="h-14 w-14 rounded-2xl bg-[#D2F500] text-black flex items-center justify-center mx-auto font-black text-2xl shadow-[0_0_25px_rgba(210,245,0,0.35)]">
              <ShieldCheck className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-2xl font-black tracking-tight uppercase text-white">
              {siteConfig?.brand_name || "FCC NetLink"} <span className="text-[#D2F500]">Admin</span>
            </h1>
            <p className="text-xs text-neutral-400 font-medium">Enter your administrative credentials to access the portal.</p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-400" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase text-neutral-300 mb-1.5">Email Address</label>
              <input
                type="email"
                required
                placeholder="Enter admin email address..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-[#24272D] bg-[#18191D] text-sm text-white placeholder-neutral-500 font-mono focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase text-neutral-300 mb-1.5">Password</label>
              <input
                type="password"
                required
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-[#24272D] bg-[#18191D] text-sm text-white placeholder-neutral-500 focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-4 rounded-xl bg-[#D2F500] hover:bg-[#bce000] text-black font-black text-xs uppercase tracking-wider shadow-[0_0_20px_rgba(210,245,0,0.3)] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              {loggingIn ? <RefreshCw className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              <span>{loggingIn ? "Verifying..." : "Authenticate Admin Access"}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // UNIFIED ADMIN DASHBOARD LAYOUT (ELECTRIC NEON LIME & PITCH DARK OBSIDIAN THEME)
  return (
    <div className="flex h-screen bg-[#0B0C0E] text-white font-sans overflow-hidden selection:bg-[#D2F500] selection:text-black">
      {/* Toast Notification Alert */}
      {message && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl border shadow-xl text-xs font-bold flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-300 ${
            message.type === "success"
              ? "bg-[#18191D] border-emerald-500 text-emerald-400"
              : "bg-[#18191D] border-rose-500 text-rose-400"
          }`}
        >
          {message.type === "success" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col w-[320px] bg-[#121316] border-r border-[#24272D] flex-shrink-0 z-30 shadow-2xl">
        <div className="p-6 border-b border-[#24272D]">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-2xl bg-[#D2F500] text-black flex items-center justify-center font-black text-2xl shadow-lg shadow-[#D2F500]/20">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <span className="font-black text-xl sm:text-2xl tracking-tight text-white">{siteConfig?.brand_name || "FCC NetLink"} <span className="text-[#D2F500]">Admin</span></span>
              <p className="text-xs text-neutral-400 font-black tracking-wider uppercase mt-0.5">Portal Dashboard</p>
            </div>
          </div>
          <div className="mt-3.5">
            {currentRole === "super_admin" ? (
              <span className="px-3.5 py-1 rounded-full bg-[#D2F500]/15 text-[#D2F500] border border-[#D2F500]/30 font-black text-xs uppercase flex items-center gap-2 w-fit">
                <Crown className="w-4 h-4" /> Super Admin
              </span>
            ) : (
              <span className="px-3.5 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 font-black text-xs uppercase flex items-center gap-2 w-fit">
                <UserCheck className="w-4 h-4" /> Sub Admin
              </span>
            )}
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 flex flex-col gap-2 overflow-y-auto">
          <button
            onClick={() => setActiveTab("links")}
            className={`w-full flex items-center gap-4 px-4.5 py-3.5 rounded-2xl text-base sm:text-lg font-black transition-all ${
              activeTab === "links"
                ? "bg-[#D2F500] text-black shadow-lg shadow-[#D2F500]/20"
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Globe className="w-6 h-6 flex-shrink-0" />
            <span>Server Links ({links.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("software")}
            className={`w-full flex items-center gap-4 px-4.5 py-3.5 rounded-2xl text-base sm:text-lg font-black transition-all ${
              activeTab === "software"
                ? "bg-[#D2F500] text-black shadow-lg shadow-[#D2F500]/20"
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Download className="w-6 h-6 flex-shrink-0" />
            <span>Software Hub ({softwareList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("packages")}
            className={`w-full flex items-center gap-4 px-4.5 py-3.5 rounded-2xl text-base sm:text-lg font-black transition-all ${
              activeTab === "packages"
                ? "bg-[#D2F500] text-black shadow-lg shadow-[#D2F500]/20"
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Package className="w-6 h-6 flex-shrink-0" />
            <span>Packages ({packages.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("faqs")}
            className={`w-full flex items-center gap-4 px-4.5 py-3.5 rounded-2xl text-base sm:text-lg font-black transition-all ${
              activeTab === "faqs"
                ? "bg-[#D2F500] text-black shadow-lg shadow-[#D2F500]/20"
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <HelpCircle className="w-6 h-6 flex-shrink-0" />
            <span>Support FAQs ({faqs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("site_config")}
            className={`w-full flex items-center gap-4 px-4.5 py-3.5 rounded-2xl text-base sm:text-lg font-black transition-all ${
              activeTab === "site_config"
                ? "bg-[#D2F500] text-black shadow-lg shadow-[#D2F500]/20"
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <PhoneCall className="w-6 h-6 flex-shrink-0" />
            <span>Site Settings</span>
          </button>

          {currentRole === "super_admin" && (
            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-4 px-4.5 py-3.5 rounded-2xl text-base sm:text-lg font-black transition-all ${
                activeTab === "users"
                  ? "bg-[#D2F500] text-black shadow-lg shadow-[#D2F500]/20"
                  : "text-neutral-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Users className="w-6 h-6 flex-shrink-0" />
              <span>Admin Accounts ({adminUsers.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab("messages")}
            className={`w-full flex items-center gap-4 px-4.5 py-3.5 rounded-2xl text-base sm:text-lg font-black transition-all ${
              activeTab === "messages"
                ? "bg-[#D2F500] text-black shadow-lg shadow-[#D2F500]/20"
                : "text-neutral-400 hover:bg-white/5 hover:text-white"
            }`}
          >
            <MessageSquare className="w-6 h-6 flex-shrink-0" />
            <span>Contact Messages</span>
            {contactMessages.filter((m) => !m.is_read).length > 0 && (
              <span className="ml-auto px-3 py-0.5 rounded-full bg-[#D2F500] text-black text-xs sm:text-sm font-black">
                {contactMessages.filter((m) => !m.is_read).length}
              </span>
            )}
          </button>
        </nav>

        <div className="p-5 border-t border-[#24272D] bg-[#18191D]">
          <div className="text-sm font-mono text-neutral-300 mb-3 truncate px-1 font-extrabold">{currentEmail}</div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-sm sm:text-base font-black transition-all border border-rose-500/30"
          >
            <LogOut className="w-5 h-5" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#121316] border-t border-[#24272D] px-2 py-2 flex items-center justify-around text-neutral-400 shadow-lg">
        <button
          onClick={() => setActiveTab("links")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-black ${
            activeTab === "links" ? "text-black bg-[#D2F500]" : ""
          }`}
        >
          <Globe className="w-5 h-5" />
          <span>Links</span>
        </button>

        <button
          onClick={() => setActiveTab("software")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-black ${
            activeTab === "software" ? "text-black bg-[#D2F500]" : ""
          }`}
        >
          <Download className="w-5 h-5" />
          <span>Apps</span>
        </button>

        <button
          onClick={() => setActiveTab("packages")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-black ${
            activeTab === "packages" ? "text-black bg-[#D2F500]" : ""
          }`}
        >
          <Package className="w-5 h-5" />
          <span>Plans</span>
        </button>

        <button
          onClick={() => setActiveTab("faqs")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-black ${
            activeTab === "faqs" ? "text-black bg-[#D2F500]" : ""
          }`}
        >
          <HelpCircle className="w-5 h-5" />
          <span>FAQs</span>
        </button>

        <button
          onClick={() => setActiveTab("site_config")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-black ${
            activeTab === "site_config" ? "text-black bg-[#D2F500]" : ""
          }`}
        >
          <PhoneCall className="w-5 h-5" />
          <span>Settings</span>
        </button>

        {currentRole === "super_admin" && (
          <button
            onClick={() => setActiveTab("users")}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-black ${
              activeTab === "users" ? "text-black bg-[#D2F500]" : ""
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Users</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab("messages")}
          className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-black ${
            activeTab === "messages" ? "text-black bg-[#D2F500]" : ""
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span>Messages</span>
        </button>
      </div>

      {/* Main Viewport Pane */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#0B0C0E] pb-14 md:pb-0">
        {/* Compact Header Bar */}
        <header className="h-16 sm:h-18 px-5 sm:px-6 border-b border-[#24272D] bg-[#121316] flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {activeTab === "links" && <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-[#D2F500] flex-shrink-0" />}
            {activeTab === "software" && <Download className="w-5 h-5 sm:w-6 sm:h-6 text-[#D2F500] flex-shrink-0" />}
            {activeTab === "packages" && <Package className="w-5 h-5 sm:w-6 sm:h-6 text-[#D2F500] flex-shrink-0" />}
            {activeTab === "faqs" && <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6 text-[#D2F500] flex-shrink-0" />}
            {activeTab === "site_config" && <PhoneCall className="w-5 h-5 sm:w-6 sm:h-6 text-[#D2F500] flex-shrink-0" />}
            {activeTab === "users" && <Users className="w-5 h-5 sm:w-6 sm:h-6 text-[#D2F500] flex-shrink-0" />}
            {activeTab === "messages" && <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-[#D2F500] flex-shrink-0" />}

            <h1 className="text-sm sm:text-base font-bold text-white tracking-wider uppercase truncate">
              {activeTab === "links" && "Web Links & Server Addresses"}
              {activeTab === "software" && "Software & Downloads Hub"}
              {activeTab === "packages" && "Fiber Internet & Dish Packages"}
              {activeTab === "faqs" && "Support Desk FAQs"}
              {activeTab === "site_config" && "Site Settings & Pricing Rules"}
              {activeTab === "users" && "Admin User Accounts"}
              {activeTab === "messages" && "Customer Contact Messages"}
            </h1>
          </div>
        </header>

        {/* Standardized Content Container with Electric Neon Lime Theme */}
        <div className="flex-1 p-3 sm:p-5 md:p-6 overflow-hidden">
          <div className="h-full w-full max-w-[1600px] mx-auto bg-[#0B0C0E] border border-[#24272D] rounded-2xl shadow-xl flex flex-col overflow-hidden">
            
            {/* TAB 1: Contact Messages */}
            {activeTab === "messages" && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
                {loadingMessages ? (
                  <div className="py-16 text-center text-neutral-400 flex flex-col items-center gap-3">
                    <RefreshCw className="w-8 h-8 animate-spin text-[#D2F500]" />
                    <span className="text-sm sm:text-base font-bold">Loading contact messages...</span>
                  </div>
                ) : contactMessages.length === 0 ? (
                  <div className="py-20 text-center text-neutral-400 space-y-2">
                    <MessageSquare className="w-14 h-14 mx-auto opacity-30 text-[#D2F500]" />
                    <p className="font-black text-white text-lg">No contact messages yet</p>
                    <p className="text-sm">User submissions from the contact form will appear here.</p>
                  </div>
                ) : (
                  contactMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-5 sm:p-6 rounded-2xl border transition-all ${
                        msg.is_read
                          ? "border-[#24272D] bg-[#121316] opacity-80"
                          : "border-[#D2F500]/60 bg-[#18191D] shadow-lg shadow-[#D2F500]/5"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <span className="font-black text-base sm:text-lg text-white">{msg.name}</span>
                            <span className="px-3 py-0.5 rounded-full bg-[#D2F500]/15 text-[#D2F500] font-black text-xs uppercase border border-[#D2F500]/30">
                              {msg.request_type}
                            </span>
                            {!msg.is_read && (
                              <span className="px-2.5 py-0.5 rounded-full bg-[#D2F500] text-black text-[10px] font-black uppercase">NEW</span>
                            )}
                          </div>
                          <div className="mt-2 flex items-center gap-4 text-xs sm:text-sm text-neutral-300 font-bold flex-wrap">
                            <span className="font-mono">{msg.email}</span>
                            <span className="font-mono">📞 {msg.phone}</span>
                            {msg.created_at && (
                              <span className="text-xs text-neutral-500 font-normal">{new Date(msg.created_at).toLocaleString()}</span>
                            )}
                          </div>
                          <p className="mt-3 text-sm sm:text-base text-neutral-200 whitespace-pre-wrap leading-relaxed bg-[#0B0C0E] p-4 rounded-xl border border-[#24272D] font-mono">
                            {msg.message}
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          {!msg.is_read ? (
                            <button
                              onClick={async () => {
                                await markMessageRead(msg.id!);
                                setContactMessages(contactMessages.map((m) => (m.id === msg.id ? { ...m, is_read: true } : m)));
                              }}
                              className="p-2.5 rounded-xl border border-[#24272D] hover:bg-[#D2F500] hover:text-black text-neutral-300 transition-colors"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                          ) : (
                            <span className="p-2.5 text-neutral-600">
                              <EyeOff className="w-5 h-5" />
                            </span>
                          )}
                          {currentRole === "super_admin" && (
                            <button
                              onClick={() => promptDeleteMessage(msg.id!, msg.name)}
                              className="p-2.5 rounded-xl border border-rose-500/30 hover:bg-rose-500/20 text-rose-400"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: Web Links Manager */}
            {activeTab === "links" && (
              <div className="flex-1 overflow-y-auto p-3 sm:p-8 grid gap-3 sm:gap-4 md:gap-5 grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 auto-rows-max">
                {loadingLinks ? (
                  <div className="col-span-full py-16 text-center text-neutral-400 text-base font-bold">Loading server links...</div>
                ) : links.length === 0 ? (
                  <div className="col-span-full py-16 text-center text-neutral-400 text-base font-bold">No web links configured yet.</div>
                ) : (
                  links.map((link) => (
                    <div
                      key={link.id || link.url}
                      onClick={() => openEditLinkModal(link)}
                      className="group flex flex-col items-center text-center cursor-pointer min-w-0 gap-2 relative"
                    >
                      <div className="w-full aspect-square max-w-[110px] sm:max-w-[130px] md:max-w-[150px] lg:max-w-[170px] rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#252834] to-[#161821] border border-[#353A4A] group-hover:border-[#D2F500] group-hover:bg-[#2A2E3D] group-hover:shadow-[0_0_35px_rgba(210,245,0,0.4)] flex items-center justify-center text-4xl sm:text-5xl md:text-6xl group-hover:scale-105 transition-all overflow-hidden p-3 sm:p-4 shadow-xl flex-shrink-0">
                        {link.icon && (link.icon.startsWith("http") || link.icon.startsWith("data:image")) ? (
                          <img src={link.icon} alt="" className="w-full h-full object-contain filter drop-shadow-[0_0_3px_rgba(255,255,255,0.7)]" />
                        ) : link.icon ? (
                          <span className="drop-shadow-[0_0_12px_rgba(210,245,0,0.5)]">{link.icon}</span>
                        ) : (
                          <Globe className="w-12 h-12 sm:w-14 sm:h-14 text-[#D2F500] drop-shadow-[0_0_15px_rgba(210,245,0,0.6)]" />
                        )}
                      </div>
                      <span className="font-extrabold text-xs sm:text-sm text-neutral-200 group-hover:text-[#D2F500] transition-colors line-clamp-2 leading-tight text-center max-w-full break-words">
                        {link.name}
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 3: Software Library */}
            {activeTab === "software" && (
              <div className="flex-1 overflow-y-auto p-3 sm:p-8 grid gap-3 sm:gap-4 md:gap-5 grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-7 xl:grid-cols-8 auto-rows-max">
                {loadingSoftware ? (
                  <div className="col-span-full py-16 text-center text-neutral-400 text-base font-bold">Loading software tools...</div>
                ) : softwareList.length === 0 ? (
                  <div className="col-span-full py-16 text-center text-neutral-400 text-base font-bold">No software items listed yet.</div>
                ) : (
                  softwareList.map((item) => (
                    <div
                      key={item.id || item.download_url}
                      onClick={() => openEditSoftwareModal(item)}
                      className="group flex flex-col items-center text-center cursor-pointer min-w-0 gap-2 relative"
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
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 4: Service Packages */}
            {activeTab === "packages" && (
              <div className="flex-1 overflow-y-auto p-3 sm:p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 auto-rows-max">
                {loadingPackages ? (
                  <div className="col-span-full py-16 text-center text-neutral-400 text-base font-bold">Loading service plans...</div>
                ) : packages.length === 0 ? (
                  <div className="col-span-full py-16 text-center text-neutral-400 text-base font-bold">No service packages found.</div>
                ) : (
                  packages.map((pkg) => (
                    <div
                      key={pkg.id || pkg.name}
                      onClick={() => openEditPackageModal(pkg)}
                      className="p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-[#24272D] bg-[#18191D] flex flex-col justify-between hover:border-[#D2F500] hover:shadow-2xl transition-all cursor-pointer group shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1.5 flex-wrap mb-1.5">
                          <span className="font-black text-xs sm:text-lg text-white line-clamp-2 leading-tight break-words group-hover:text-[#D2F500] transition-colors">{pkg.name}</span>
                          <div className="flex items-center gap-1">
                            {pkg.offer_tag && (
                              <span className="px-2 py-0.5 rounded-full bg-[#D2F500] text-black font-black text-[9px] sm:text-xs uppercase flex-shrink-0">
                                {pkg.offer_tag}
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded-full bg-[#D2F500]/15 text-[#D2F500] font-black text-[9px] sm:text-xs uppercase border border-[#D2F500]/30 flex-shrink-0">
                              {pkg.category === "internet_only" ? "Internet" : pkg.category === "dish_only" ? "Dish" : "Combo"}
                            </span>
                          </div>
                        </div>

                        {pkg.category !== "dish_only" && (
                          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-black text-[#D2F500] mt-0.5">
                            <span>⬇ {pkg.download_speed || "100M"}</span>
                            <span>⬆ {pkg.upload_speed || "100M"}</span>
                          </div>
                        )}

                        <div className="text-xl sm:text-3xl font-black text-white mt-2 flex items-baseline gap-1.5 flex-wrap">
                          <span>৳{pkg.price}</span>
                          {pkg.original_price && Number(pkg.original_price) > pkg.price && (
                            <span className="text-xs sm:text-sm text-neutral-400 line-through font-extrabold">৳{pkg.original_price}</span>
                          )}
                          <span className="text-[10px] sm:text-xs text-neutral-400 font-medium">/mo</span>
                        </div>
                      </div>

                      <div className="border-t border-[#24272D] pt-2 mt-2">
                        <div className="text-[10px] text-neutral-400 font-bold truncate">
                          {pkg.category === "internet_only"
                            ? `Setup: ${pkg.connection_charge === 0 ? "Free" : `৳${pkg.connection_charge}`}`
                            : pkg.category === "dish_only"
                            ? `Dish: ${pkg.dish_charge === 0 ? "Free" : `৳${pkg.dish_charge}`}`
                            : `Setup: ৳${pkg.connection_charge} | Dish: ৳${pkg.dish_charge}`}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: Support FAQs */}
            {activeTab === "faqs" && (
              <div className="flex-1 overflow-y-auto p-3 sm:p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 auto-rows-max">
                {loadingFaqs ? (
                  <div className="col-span-full py-16 text-center text-neutral-400 text-base font-bold">Loading support FAQs...</div>
                ) : faqs.length === 0 ? (
                  <div className="col-span-full py-16 text-center text-neutral-400 text-base font-bold">No FAQ questions listed yet. Click + to add questions!</div>
                ) : (
                  faqs.map((faq) => (
                    <div
                      key={faq.id || faq.q}
                      onClick={() => openEditFaqModal(faq)}
                      className="p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-[#24272D] bg-[#18191D] flex flex-col justify-between hover:border-[#D2F500] hover:shadow-2xl transition-all cursor-pointer group shadow-sm"
                    >
                      <div>
                        <div className="flex items-start gap-1.5 mb-1.5">
                          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5 text-[#D2F500] flex-shrink-0 mt-0.5" />
                          <h4 className="font-black text-xs sm:text-base text-white group-hover:text-[#D2F500] transition-colors line-clamp-2">
                            {faq.q}
                          </h4>
                        </div>
                      </div>

                      <div className="border-t border-[#24272D] pt-2 mt-2 flex items-center justify-between">
                        <span className="text-[9px] sm:text-xs font-black text-[#D2F500] uppercase tracking-wider group-hover:underline">Edit FAQ</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 5: Site Settings */}
            {activeTab === "site_config" && (
              <div className="flex-1 overflow-y-auto p-3 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 auto-rows-max">
                {/* Block 1: Contact Settings Summary Card */}
                <div className="bg-[#18191D] border border-[#24272D] rounded-xl sm:rounded-2xl p-4 sm:p-8 flex flex-col justify-between hover:border-[#D2F500] hover:shadow-2xl transition-all">
                  <div>
                    <div className="border-b border-[#24272D] pb-3 mb-4">
                      <h3 className="font-black text-sm sm:text-lg text-white flex items-center gap-2.5">
                        <PhoneCall className="w-5 h-5 text-[#D2F500]" />
                        <span>Site Contact & Header Announcement Settings</span>
                      </h3>
                    </div>
                    <div className="space-y-2 text-xs sm:text-sm text-neutral-300 font-medium">
                      <p><strong className="text-white uppercase font-bold">Brand Name:</strong> {siteConfig?.brand_name || "FCC NetLink"}</p>
                      <p><strong className="text-white uppercase font-bold">Top Banner Text:</strong> {siteConfig?.banner_text || "Not set"}</p>
                      <p><strong className="text-white uppercase font-bold">Hotline:</strong> {siteConfig?.hotline || "Not set"}</p>
                      <p><strong className="text-white uppercase font-bold">Sales Desk Phone:</strong> {siteConfig?.sales_phone || "Not set"}</p>
                      <p><strong className="text-white uppercase font-bold">Support Email:</strong> {siteConfig?.support_email || "Not set"}</p>
                      <p><strong className="text-white uppercase font-bold">Office Address:</strong> {siteConfig?.address || "Not set"}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveModal("config_contact")}
                    className="mt-5 w-full py-3 rounded-xl bg-[#D2F500] hover:bg-[#b8d800] text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-[#D2F500]/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-black" />
                    <span>Configure Contact & Announcement</span>
                  </button>
                </div>

                {/* Block 2: Custom Package Pricing Rules Summary Card */}
                <div className="bg-[#18191D] border border-[#24272D] rounded-xl sm:rounded-2xl p-4 sm:p-8 flex flex-col justify-between hover:border-[#D2F500] hover:shadow-2xl transition-all">
                  <div>
                    <div className="border-b border-[#24272D] pb-3 mb-4">
                      <h3 className="font-black text-sm sm:text-lg text-white flex items-center gap-2.5">
                        <Sparkles className="w-5 h-5 text-[#D2F500]" />
                        <span>Custom Package Calculator Rules & Pricing Rates</span>
                      </h3>
                    </div>
                    <div className="space-y-2 text-xs sm:text-sm text-neutral-300 font-medium">
                      <p><strong className="text-white uppercase font-bold">Min Speed:</strong> {siteConfig?.custom_min_mbps || "10"} Mbps</p>
                      <p><strong className="text-white uppercase font-bold">Base Internet Fee:</strong> ৳{siteConfig?.custom_base_internet_fee || "10"}</p>
                      <p><strong className="text-white uppercase font-bold">Rate per 10 Mbps:</strong> ৳{siteConfig?.custom_price_per_10mbps || "3"}</p>
                      <p><strong className="text-white uppercase font-bold">Internet Install Fee:</strong> ৳{siteConfig?.custom_internet_install_fee || "15"}</p>
                      <p><strong className="text-white uppercase font-bold">Dish HD / 4K Pack:</strong> ৳{siteConfig?.custom_dish_hd_price || "10"} / ৳{siteConfig?.custom_dish_4k_price || "18"}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveModal("config_pricing")}
                    className="mt-5 w-full py-3 rounded-xl bg-[#D2F500] hover:bg-[#b8d800] text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-[#D2F500]/20 flex items-center justify-center gap-2 transition-all"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-black" />
                    <span>Configure Calculator Rules</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 6: Admin Users */}
            {activeTab === "users" && (
              <div className="flex-1 overflow-y-auto p-3 sm:p-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6 auto-rows-max">
                {loadingUsers ? (
                  <div className="col-span-full py-16 text-center text-neutral-400 text-base font-bold">Loading admin accounts...</div>
                ) : (
                  adminUsers.map((user) => (
                    <div
                      key={user.id || user.email}
                      onClick={() => openEditUserModal(user)}
                      className="p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-[#24272D] bg-[#18191D] flex flex-col justify-between hover:border-[#D2F500] hover:shadow-2xl transition-all cursor-pointer group shadow-sm"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1.5 flex-wrap mb-1.5">
                          <span className="font-black text-xs sm:text-lg text-white truncate group-hover:text-[#D2F500] transition-colors">{user.name}</span>
                          {user.role === "super_admin" ? (
                            <span className="px-2 py-0.5 rounded-full bg-[#D2F500]/15 text-[#D2F500] text-[9px] sm:text-xs font-black uppercase border border-[#D2F500]/30 flex-shrink-0">
                              Super Admin
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 text-[9px] sm:text-xs font-black uppercase border border-blue-500/30 flex-shrink-0">
                              Sub Admin
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] sm:text-xs font-mono text-neutral-300 font-bold truncate mt-1">{user.email}</div>
                      </div>

                      <div className="border-t border-[#24272D] pt-2 mt-2 flex items-center justify-between">
                        <span className="text-[9px] sm:text-xs font-black text-[#D2F500] uppercase group-hover:underline">Edit Account</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* POPUP MODAL: Add / Edit Link */}
      {activeModal === "link" && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#18191D] border border-[#24272D] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl flex flex-col max-h-[85vh] overflow-hidden text-white">
            {/* FIXED TOP HEADER */}
            <div className="flex items-center justify-between border-b border-[#24272D] pb-4 flex-shrink-0">
              <div className="flex items-center gap-2.5 font-black text-lg text-white uppercase">
                <Globe className="w-6 h-6 text-[#D2F500]" />
                <span>{editingLink ? "Edit Web Link Address" : "Add New Web Link Address"}</span>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* FORM CONTAINER */}
            <form onSubmit={handleSaveLink} className="flex-1 flex flex-col overflow-hidden min-h-0 pt-4">
              {/* SCROLLABLE FORM BODY */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                <div>
                  <label className="block text-xs sm:text-sm font-black uppercase text-white mb-1.5">Server / Link Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NetLink BDIX Movie Server"
                    value={newLinkName}
                    onChange={(e) => setNewLinkName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm sm:text-base text-white font-semibold focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-black uppercase text-white mb-1.5">Target URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="http://172.16.50.4/movies"
                    value={newLinkUrl}
                    onChange={(e) => setNewLinkUrl(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm sm:text-base text-white font-mono font-bold focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                  />
                </div>

                {/* LINK ICON SELECTOR / UPLOADER */}
                <div className="p-4 rounded-2xl bg-[#0B0C0E] border border-[#24272D] space-y-3">
                  <label className="block text-xs sm:text-sm font-black uppercase text-white">Link Icon / Logo</label>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-[#24272D] flex items-center justify-center bg-[#121316] overflow-hidden flex-shrink-0 shadow-xs">
                      {newLinkIcon && (newLinkIcon.startsWith("http") || newLinkIcon.startsWith("data:image")) ? (
                        <img src={newLinkIcon} alt="Preview" className="w-full h-full object-contain p-1" />
                      ) : newLinkIcon ? (
                        <span className="text-3xl">{newLinkIcon}</span>
                      ) : (
                        <Globe className="w-7 h-7 text-neutral-400" />
                      )}
                    </div>

                    <div className="flex-1 flex items-center gap-2">
                      <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-[#D2F500] hover:bg-[#b8d800] text-black text-xs font-black uppercase flex items-center gap-2 shadow-xs transition-all">
                        <Upload className="w-4 h-4" />
                        <span>Upload Icon / Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setNewLinkIcon(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>

                      {newLinkIcon && (
                        <button
                          type="button"
                          onClick={() => setNewLinkIcon("")}
                          className="px-3 py-2 rounded-xl bg-white/10 text-rose-400 font-bold text-xs hover:bg-rose-500/20 border border-white/10"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Select from Default Icons/Presets */}
                  <div>
                    <div className="text-[11px] font-black text-neutral-400 uppercase mb-1.5">Select from Default Icons:</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {["🌐", "🎬", "📺", "🎮", "🍿", "📁", "⚡", "🚀", "📡", "💻", "🔒", "📥", "🎧", "🔧", "📀", "📶"].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setNewLinkIcon(emoji)}
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center text-xl transition-all ${
                            newLinkIcon === emoji ? "border-[#D2F500] bg-[#D2F500]/20 scale-110 shadow-xs" : "border-[#24272D] bg-[#121316] hover:bg-white/10"
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-black uppercase text-white mb-1.5">Category</label>
                  <div className="space-y-2">
                    <select
                      value={["FTP & Storage", "Live TV & IPTV", "Streaming", "Music", "Utilities"].includes(newLinkCategory) ? newLinkCategory : "custom"}
                      onChange={(e) => {
                        if (e.target.value !== "custom") setNewLinkCategory(e.target.value);
                      }}
                      className="w-full px-4 py-3.5 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm sm:text-base text-white font-bold focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                    >
                      <option value="FTP & Storage">FTP & Storage</option>
                      <option value="Live TV & IPTV">Live TV & IPTV</option>
                      <option value="Streaming">Streaming</option>
                      <option value="Music">Music</option>
                      <option value="Utilities">Utilities</option>
                      <option value="custom">+ Custom Category Name...</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Category name (e.g. FTP & Storage, Streaming, etc.)"
                      value={newLinkCategory}
                      onChange={(e) => setNewLinkCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm text-white focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-black uppercase text-white mb-1.5">Description (Optional)</label>
                  <textarea
                    rows={2}
                    placeholder="Short description of this link or portal..."
                    value={newLinkDesc}
                    onChange={(e) => setNewLinkDesc(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm text-white focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                  />
                </div>
              </div>

              {/* FIXED ACTION FOOTER */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#24272D] mt-4 flex-shrink-0">
                {editingLink && (
                  <button
                    type="button"
                    onClick={() => promptDeleteLink(editingLink.id!, editingLink.name)}
                    className="p-3.5 rounded-xl border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-3.5 rounded-xl border border-[#24272D] text-neutral-300 font-extrabold text-xs sm:text-sm hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-[#D2F500] hover:bg-[#b8d800] text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-[#D2F500]/20"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Add / Edit Software */}
      {activeModal === "software" && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-[#121316]/90 border border-[#D2F500]/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col max-h-[85vh] overflow-hidden text-white">
            {/* FIXED TOP HEADER */}
            <div className="flex items-center justify-between border-b border-[#24272D] pb-4 flex-shrink-0">
              <div className="flex items-center gap-2.5 font-black text-lg text-white uppercase">
                <Download className="w-6 h-6 text-[#D2F500]" />
                <span>{editingSoftware ? "Edit Software Download" : "Add New Software Tool"}</span>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* FORM CONTAINER */}
            <form onSubmit={handleSaveSoftware} className="flex-1 flex flex-col overflow-hidden min-h-0 pt-4">
              {/* SCROLLABLE FORM BODY */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                <div>
                  <label className="block text-xs sm:text-sm font-black uppercase text-white mb-1.5">Software Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. NetLink IPTV Player Pro"
                    value={newSoftwareTitle}
                    onChange={(e) => setNewSoftwareTitle(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm sm:text-base text-white font-semibold focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-black uppercase text-white mb-1.5">Download URL *</label>
                  <input
                    type="url"
                    required
                    placeholder="https://example.com/downloads/setup.exe"
                    value={newSoftwareUrl}
                    onChange={(e) => setNewSoftwareUrl(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm sm:text-base text-white font-mono font-bold focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                  />
                </div>

                {/* SOFTWARE ICON SELECTOR / UPLOADER */}
                <div className="p-4 rounded-2xl bg-[#0B0C0E] border border-[#24272D] space-y-3">
                  <label className="block text-xs sm:text-sm font-black uppercase text-white">Software Icon / App Logo</label>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl border-2 border-dashed border-[#24272D] flex items-center justify-center bg-[#121316] overflow-hidden flex-shrink-0 shadow-xs">
                      {newSoftwareIcon && (newSoftwareIcon.startsWith("http") || newSoftwareIcon.startsWith("data:image")) ? (
                        <img src={newSoftwareIcon} alt="Preview" className="w-full h-full object-contain p-1" />
                      ) : newSoftwareIcon ? (
                        <span className="text-3xl">{newSoftwareIcon}</span>
                      ) : (
                        <Download className="w-7 h-7 text-neutral-400" />
                      )}
                    </div>

                    <div className="flex-1 flex items-center gap-2">
                      <label className="cursor-pointer px-4 py-2.5 rounded-xl bg-[#D2F500] hover:bg-[#b8d800] text-black text-xs font-black uppercase flex items-center gap-2 shadow-xs transition-all">
                        <Upload className="w-4 h-4" />
                        <span>Upload Icon / Logo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => setNewSoftwareIcon(reader.result as string);
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>

                      {newSoftwareIcon && (
                        <button
                          type="button"
                          onClick={() => setNewSoftwareIcon("")}
                          className="px-3 py-2 rounded-xl bg-white/10 text-rose-400 font-bold text-xs hover:bg-rose-500/20 border border-white/10"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Select from Default Icons/Presets */}
                  <div>
                    <div className="text-[11px] font-black text-neutral-400 uppercase mb-1.5">Select from Default Icons:</div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {["💾", "📥", "⚙️", "🔧", "💻", "⚡", "📺", "🎮", "📡", "🚀", "📁", "🔒", "📀", "📶", "🌐", "🛠️"].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => setNewSoftwareIcon(emoji)}
                          className={`w-9 h-9 rounded-xl border flex items-center justify-center text-xl transition-all ${
                            newSoftwareIcon === emoji ? "border-[#D2F500] bg-[#D2F500]/20 scale-110 shadow-xs" : "border-[#24272D] bg-[#121316] hover:bg-white/10"
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-black uppercase text-white mb-1.5">Version</label>
                    <input
                      type="text"
                      placeholder="v2.4.1"
                      value={newSoftwareVersion}
                      onChange={(e) => setNewSoftwareVersion(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm text-white focus:ring-2 focus:ring-[#D2F500] focus:outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs sm:text-sm font-black uppercase text-white mb-1.5">Platform</label>
                    <select
                      value={newSoftwarePlatform}
                      onChange={(e) => setNewSoftwarePlatform(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm text-white font-bold focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                    >
                      <option value="Windows / PC">Windows / PC</option>
                      <option value="Android TV / Mobile">Android TV / Mobile</option>
                      <option value="macOS / Apple">macOS / Apple</option>
                      <option value="Linux / Router OS">Linux / Router OS</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-black uppercase text-white mb-1.5">Category</label>
                  <div className="space-y-2">
                    <select
                      value={["IPTV & Streaming", "Network Tools", "Media Players", "ISP Utilities"].includes(newSoftwareCategory) ? newSoftwareCategory : "custom"}
                      onChange={(e) => {
                        if (e.target.value !== "custom") setNewSoftwareCategory(e.target.value);
                      }}
                      className="w-full px-4 py-3.5 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm sm:text-base text-white font-bold focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                    >
                      <option value="IPTV & Streaming">IPTV & Streaming</option>
                      <option value="Network Tools">Network Tools</option>
                      <option value="Media Players">Media Players</option>
                      <option value="ISP Utilities">ISP Utilities</option>
                      <option value="custom">+ Custom Category Name...</option>
                    </select>

                    <input
                      type="text"
                      placeholder="Category name (e.g. IPTV & Streaming, Network Tools, etc.)"
                      value={newSoftwareCategory}
                      onChange={(e) => setNewSoftwareCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm text-white focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-black uppercase text-white mb-1.5">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of the software features..."
                    value={newSoftwareDesc}
                    onChange={(e) => setNewSoftwareDesc(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm text-white focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                  />
                </div>
              </div>

              {/* FIXED ACTION FOOTER */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#24272D] mt-4 flex-shrink-0">
                {editingSoftware && (
                  <button
                    type="button"
                    onClick={() => promptDeleteSoftware(editingSoftware.id!, editingSoftware.title)}
                    className="p-3.5 rounded-xl border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-3.5 rounded-xl border border-[#24272D] text-neutral-300 font-extrabold text-xs sm:text-sm hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-[#D2F500] hover:bg-[#b8d800] text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-[#D2F500]/20"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Add / Edit Package */}
      {activeModal === "package" && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-[#121316]/90 border border-[#D2F500]/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col max-h-[85vh] overflow-hidden text-white">
            {/* FIXED TOP HEADER */}
            <div className="flex items-center justify-between border-b border-[#24272D] pb-4 flex-shrink-0">
              <div className="flex items-center gap-2.5 font-black text-lg text-white uppercase">
                <Package className="w-6 h-6 text-[#D2F500]" />
                <span>{editingPkg ? "Edit Service Package" : "Add New Service Package"}</span>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* FORM CONTAINER */}
            <form onSubmit={handleSavePackage} className="flex-1 flex flex-col overflow-hidden min-h-0 pt-4">
              {/* SCROLLABLE FORM BODY */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                <div>
                  <label className="block text-xs sm:text-sm font-black uppercase text-white mb-1.5">Category Type *</label>
                  <select
                    value={newPkgCategory}
                    onChange={(e) => setNewPkgCategory(e.target.value as PackageCategory)}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm sm:text-base text-white font-bold focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                  >
                    <option value="internet_only">1. Only Internet (Pure High-Speed Broadband)</option>
                    <option value="dish_only">2. Only Dish TV (Standalone IPTV / Satellite)</option>
                    <option value="combo">3. Internet + Dish Combo (Fiber + Live TV)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-black uppercase text-white mb-1.5">Package Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Home Turbo 100"
                    value={newPkgName}
                    onChange={(e) => setNewPkgName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm sm:text-base text-white font-semibold focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                  />
                </div>

                {newPkgCategory !== "dish_only" && (
                  <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#0B0C0E] border border-[#24272D]">
                    <div>
                      <label className="block text-xs font-black uppercase text-white mb-1">Download Speed *</label>
                      <input
                        type="text"
                        required
                        placeholder="100 Mbps"
                        value={newPkgDownloadSpeed}
                        onChange={(e) => setNewPkgDownloadSpeed(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#24272D] bg-[#121316] text-xs sm:text-sm text-white font-mono focus:ring-2 focus:ring-[#D2F500] focus:outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase text-white mb-1">Upload Speed *</label>
                      <input
                        type="text"
                        required
                        placeholder="100 Mbps"
                        value={newPkgUploadSpeed}
                        onChange={(e) => setNewPkgUploadSpeed(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#24272D] bg-[#121316] text-xs sm:text-sm text-white font-mono focus:ring-2 focus:ring-[#D2F500] focus:outline-none font-bold"
                      />
                    </div>
                  </div>
                )}

                <div className={`grid gap-3 ${newPkgCategory === "combo" ? "grid-cols-3" : "grid-cols-2"}`}>
                  <div>
                    <label className="block text-xs font-black uppercase text-white mb-1">Offer Price (৳) *</label>
                    <input
                      type="number"
                      required
                      value={newPkgPrice}
                      onChange={(e) => setNewPkgPrice(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-xs sm:text-sm text-white font-mono font-bold focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                    />
                  </div>

                  {newPkgCategory !== "dish_only" && (
                    <div>
                      <label className="block text-xs font-black uppercase text-white mb-1">Internet Fee (৳)</label>
                      <input
                        type="number"
                        value={newPkgConnCharge}
                        onChange={(e) => setNewPkgConnCharge(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-xs sm:text-sm text-white font-mono focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                      />
                    </div>
                  )}

                  {newPkgCategory !== "internet_only" && (
                    <div>
                      <label className="block text-xs font-black uppercase text-white mb-1">Dish Fee (৳)</label>
                      <input
                        type="number"
                        value={newPkgDishCharge}
                        onChange={(e) => setNewPkgDishCharge(Number(e.target.value))}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-xs sm:text-sm text-white font-mono focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Discount Offer Fields */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-2xl bg-[#0B0C0E] border border-[#D2F500]/30">
                  <div>
                    <label className="block text-xs font-black uppercase text-[#D2F500] mb-1">Original Price (৳)</label>
                    <input
                      type="number"
                      placeholder="e.g. 39 (Strikethrough)"
                      value={newPkgOriginalPrice || ""}
                      onChange={(e) => setNewPkgOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#24272D] bg-[#121316] text-xs text-white font-mono focus:ring-2 focus:ring-[#D2F500] focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-[#D2F500] mb-1">Offer Tag / Badge</label>
                    <input
                      type="text"
                      placeholder="e.g. 25% OFF / HOT DEAL"
                      value={newPkgOfferTag}
                      onChange={(e) => setNewPkgOfferTag(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-[#24272D] bg-[#121316] text-xs text-white font-mono focus:ring-2 focus:ring-[#D2F500] focus:outline-none font-bold uppercase"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-black uppercase text-white mb-1.5">Features (One per line)</label>
                  <textarea
                    rows={3}
                    value={newPkgFeatures}
                    onChange={(e) => setNewPkgFeatures(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm text-white focus:ring-2 focus:ring-[#D2F500] focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* FIXED ACTION FOOTER */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#24272D] mt-4 flex-shrink-0">
                {editingPkg && (
                  <button
                    type="button"
                    onClick={() => promptDeletePackage(editingPkg.id!, editingPkg.name)}
                    className="p-3.5 rounded-xl border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-3.5 rounded-xl border border-[#24272D] text-neutral-300 font-extrabold text-xs sm:text-sm hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-[#D2F500] hover:bg-[#b8d800] text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-[#D2F500]/20"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Add / Edit Admin User */}
      {activeModal === "user" && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-[#121316]/90 border border-[#D2F500]/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col max-h-[85vh] overflow-hidden text-white">
            {/* FIXED TOP HEADER */}
            <div className="flex items-center justify-between border-b border-[#24272D] pb-4 flex-shrink-0">
              <div className="flex items-center gap-2.5 font-black text-lg text-white uppercase">
                <Users className="w-6 h-6 text-[#D2F500]" />
                <span>{editingUser ? "Edit Sub-Admin Account" : "Add New Admin Account"}</span>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* FORM CONTAINER */}
            <form onSubmit={handleSaveAdminUser} className="flex-1 flex flex-col overflow-hidden min-h-0 pt-4">
              {/* SCROLLABLE FORM BODY */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                <div>
                  <label className="block text-xs sm:text-sm font-black uppercase text-white mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tanvir Hossain"
                    value={newAdminName}
                    onChange={(e) => setNewAdminName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm sm:text-base text-white font-semibold focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-black uppercase text-white mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    placeholder="admin@fccnetlink.com"
                    value={newAdminEmail}
                    onChange={(e) => setNewAdminEmail(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm sm:text-base text-white font-mono font-bold focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-black uppercase text-white mb-1.5">Password *</label>
                  <input
                    type="password"
                    required
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm sm:text-base text-white font-semibold focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-black uppercase text-white mb-1.5">Assign Role</label>
                  <select
                    value={newAdminRole}
                    onChange={(e) => setNewAdminRole(e.target.value as AdminRole)}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm sm:text-base text-white font-bold focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                  >
                    <option value="sub_admin">Sub Admin (Content Creation & Edit Only)</option>
                    <option value="super_admin">Super Admin (Full System Rights & User Management)</option>
                  </select>
                </div>
              </div>

              {/* FIXED ACTION FOOTER */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#24272D] mt-4 flex-shrink-0">
                {editingUser && editingUser.role !== "super_admin" && currentRole === "super_admin" && (
                  <button
                    type="button"
                    onClick={() => {
                      const userId = editingUser.id!;
                      const userName = editingUser.name;
                      const userRole = editingUser.role;
                      setActiveModal(null);
                      promptDeleteAdminUser(userId, userName, userRole);
                    }}
                    className="p-3.5 rounded-xl border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-3.5 rounded-xl border border-[#24272D] text-neutral-300 font-extrabold text-xs sm:text-sm hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-[#D2F500] hover:bg-[#b8d800] text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-[#D2F500]/20"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Add / Edit Support FAQ */}
      {activeModal === "faq" && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-[#121316]/90 border border-[#D2F500]/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col max-h-[85vh] overflow-hidden text-white">
            {/* FIXED TOP HEADER */}
            <div className="flex items-center justify-between border-b border-[#24272D] pb-4 flex-shrink-0">
              <div className="flex items-center gap-2.5 font-black text-lg text-white uppercase">
                <HelpCircle className="w-6 h-6 text-[#D2F500]" />
                <span>{editingFaq ? "Edit Support Question" : "Add New Support Question"}</span>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* FORM CONTAINER */}
            <form onSubmit={handleSaveFaq} className="flex-1 flex flex-col overflow-hidden min-h-0 pt-4">
              {/* SCROLLABLE FORM BODY */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                <div>
                  <label className="block text-xs sm:text-sm font-black uppercase text-white mb-1.5">Question Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. How fast is standard fiber installation?"
                    value={newFaqQ}
                    onChange={(e) => setNewFaqQ(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm sm:text-base text-white font-semibold focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-black uppercase text-white mb-1.5">Detailed Answer *</label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Explain the answer clearly..."
                    value={newFaqA}
                    onChange={(e) => setNewFaqA(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm sm:text-base text-white font-medium focus:ring-2 focus:ring-[#D2F500] focus:outline-none leading-relaxed"
                  />
                </div>
              </div>

              {/* FIXED ACTION FOOTER */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#24272D] mt-4 flex-shrink-0">
                {editingFaq && (
                  <button
                    type="button"
                    onClick={() => {
                      const faqId = editingFaq.id!;
                      const question = editingFaq.q;
                      setActiveModal(null);
                      promptDeleteFaq(faqId, question);
                    }}
                    className="p-3.5 rounded-xl border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-3.5 rounded-xl border border-[#24272D] text-neutral-300 font-extrabold text-xs sm:text-sm hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-[#D2F500] hover:bg-[#b8d800] text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-[#D2F500]/20"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* POPUP MODAL: Site Contact & Header Announcement Settings */}
      {activeModal === "config_contact" && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-[#121316]/90 border border-[#D2F500]/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col max-h-[85vh] overflow-hidden text-white">
            {/* FIXED TOP HEADER */}
            <div className="flex items-center justify-between border-b border-[#24272D] pb-4 flex-shrink-0">
              <div className="flex items-center gap-2.5 font-black text-lg text-white uppercase">
                <PhoneCall className="w-6 h-6 text-[#D2F500]" />
                <span>Site Contact & Header Banner</span>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* FORM CONTAINER */}
            <form onSubmit={async (e) => {
              await handleSaveSiteConfig(e);
              setActiveModal(null);
            }} className="flex-1 flex flex-col overflow-hidden min-h-0 pt-4">
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                <div>
                  <label className="block text-xs sm:text-sm font-black uppercase text-white mb-1.5">Brand Name</label>
                  <input
                    type="text"
                    value={siteConfig?.brand_name || "FCC NetLink"}
                    onChange={(e) => setSiteConfig((prev) => ({ ...prev, brand_name: e.target.value }))}
                    placeholder="e.g. FCC NetLink"
                    className="w-full px-4 py-3 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm text-white font-bold focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-black uppercase text-white mb-1.5">Top Announcement Text</label>
                  <input
                    type="text"
                    value={siteConfig?.banner_text || ""}
                    onChange={(e) => setSiteConfig((prev) => ({ ...prev, banner_text: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm text-white font-semibold focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-black uppercase text-white mb-1.5">Support Hotline</label>
                    <input
                      type="text"
                      value={siteConfig?.hotline || ""}
                      onChange={(e) => setSiteConfig((prev) => ({ ...prev, hotline: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm text-white font-mono font-bold focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black uppercase text-white mb-1.5">Sales Desk Phone</label>
                    <input
                      type="text"
                      value={siteConfig?.sales_phone || ""}
                      onChange={(e) => setSiteConfig((prev) => ({ ...prev, sales_phone: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm text-white font-mono font-bold focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-white mb-1.5">Support Email Address</label>
                  <input
                    type="email"
                    value={siteConfig?.support_email || ""}
                    onChange={(e) => setSiteConfig((prev) => ({ ...prev, support_email: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm text-white font-mono focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-white mb-1.5">Office Address</label>
                  <input
                    type="text"
                    value={siteConfig?.address || ""}
                    onChange={(e) => setSiteConfig((prev) => ({ ...prev, address: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm text-white font-semibold focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-black uppercase text-white mb-1.5">Network Status Text</label>
                  <input
                    type="text"
                    value={siteConfig?.network_status || ""}
                    onChange={(e) => setSiteConfig((prev) => ({ ...prev, network_status: e.target.value }))}
                    className="w-full px-4 py-3 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm text-white font-semibold focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                  />
                </div>
              </div>

              {/* FIXED ACTION FOOTER */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#24272D] mt-4 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-3.5 rounded-xl border border-[#24272D] text-neutral-300 font-extrabold text-xs sm:text-sm hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingConfig}
                  className="flex-1 py-3.5 rounded-xl bg-[#D2F500] hover:bg-[#b8d800] text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-[#D2F500]/20 flex items-center justify-center gap-2"
                >
                  {savingConfig ? <RefreshCw className="w-4 h-4 animate-spin text-black" /> : null}
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* POPUP MODAL: Custom Package Calculator Rules & Pricing Rates */}
      {activeModal === "config_pricing" && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-[#121316]/90 border border-[#D2F500]/30 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col max-h-[85vh] overflow-hidden text-white">
            {/* FIXED TOP HEADER */}
            <div className="flex items-center justify-between border-b border-[#24272D] pb-4 flex-shrink-0">
              <div className="flex items-center gap-2.5 font-black text-lg text-white uppercase">
                <Sparkles className="w-6 h-6 text-[#D2F500]" />
                <span>Calculator Rules & Pricing</span>
              </div>
              <button onClick={() => setActiveModal(null)} className="p-2 rounded-xl hover:bg-white/10 text-neutral-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* FORM CONTAINER */}
            <form onSubmit={async (e) => {
              await handleSaveSiteConfig(e);
              setActiveModal(null);
            }} className="flex-1 flex flex-col overflow-hidden min-h-0 pt-4">
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-black text-white uppercase mb-1">Min Speed (Mbps)</label>
                    <input
                      type="text"
                      value={siteConfig?.custom_min_mbps || "10"}
                      onChange={(e) => setSiteConfig((prev) => ({ ...prev, custom_min_mbps: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm text-white font-mono font-bold focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-white uppercase mb-1">Base Internet (৳)</label>
                    <input
                      type="text"
                      value={siteConfig?.custom_base_internet_fee || "10"}
                      onChange={(e) => setSiteConfig((prev) => ({ ...prev, custom_base_internet_fee: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm text-[#D2F500] font-mono font-bold focus:ring-2 focus:ring-[#D2F500] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-white uppercase mb-1">Rate/10 Mbps (৳)</label>
                    <input
                      type="text"
                      value={siteConfig?.custom_price_per_10mbps || "3"}
                      onChange={(e) => setSiteConfig((prev) => ({ ...prev, custom_price_per_10mbps: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#24272D] bg-[#0B0C0E] text-sm text-white font-mono focus:ring-2 focus:ring-[#D2F500] focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#0B0C0E] border border-[#24272D]">
                  <div>
                    <label className="block text-xs font-black text-white uppercase mb-1">Internet Install Fee (৳)</label>
                    <input
                      type="text"
                      value={siteConfig?.custom_internet_install_fee || "15"}
                      onChange={(e) => setSiteConfig((prev) => ({ ...prev, custom_internet_install_fee: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#24272D] bg-[#121316] text-sm text-white font-mono focus:ring-2 focus:ring-[#D2F500] focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-white uppercase mb-1">Dish Install Fee (৳)</label>
                    <input
                      type="text"
                      value={siteConfig?.custom_dish_install_fee || "10"}
                      onChange={(e) => setSiteConfig((prev) => ({ ...prev, custom_dish_install_fee: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#24272D] bg-[#121316] text-sm text-white font-mono focus:ring-2 focus:ring-[#D2F500] focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#0B0C0E] border border-[#24272D]">
                  <div>
                    <label className="block text-xs font-black text-white uppercase mb-1">Dish 500+ HD Pack (৳)</label>
                    <input
                      type="text"
                      value={siteConfig?.custom_dish_hd_price || "10"}
                      onChange={(e) => setSiteConfig((prev) => ({ ...prev, custom_dish_hd_price: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#24272D] bg-[#121316] text-sm text-white font-mono focus:ring-2 focus:ring-[#D2F500] focus:outline-none font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-white uppercase mb-1">Dish 1000+ 4K Pack (৳)</label>
                    <input
                      type="text"
                      value={siteConfig?.custom_dish_4k_price || "18"}
                      onChange={(e) => setSiteConfig((prev) => ({ ...prev, custom_dish_4k_price: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[#24272D] bg-[#121316] text-sm text-white font-mono focus:ring-2 focus:ring-[#D2F500] focus:outline-none font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* FIXED ACTION FOOTER */}
              <div className="flex items-center gap-3 pt-4 border-t border-[#24272D] mt-4 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="flex-1 py-3.5 rounded-xl border border-[#24272D] text-neutral-300 font-extrabold text-xs sm:text-sm hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingConfig}
                  className="flex-1 py-3.5 rounded-xl bg-[#D2F500] hover:bg-[#b8d800] text-black font-black text-xs sm:text-sm uppercase tracking-wider shadow-md shadow-[#D2F500]/20 flex items-center justify-center gap-2"
                >
                  {savingConfig ? <RefreshCw className="w-4 h-4 animate-spin text-black" /> : null}
                  <span>Save</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL POPUP */}
      {confirmDelete.isOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4">
          <div className="bg-[#121316]/90 border border-rose-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200 text-white">
            <div className="flex items-center gap-3 text-rose-400 font-black text-lg">
              <AlertCircle className="w-6 h-6" />
              <span>{confirmDelete.title}</span>
            </div>

            <p className="text-xs md:text-sm text-neutral-300 leading-relaxed font-medium">
              {confirmDelete.message}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setConfirmDelete({ ...confirmDelete, isOpen: false })}
                className="flex-1 py-3 rounded-xl border border-[#24272D] text-neutral-300 font-bold text-xs hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  await confirmDelete.onConfirm();
                  setConfirmDelete({ ...confirmDelete, isOpen: false });
                }}
                className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs uppercase tracking-wider shadow-md shadow-rose-600/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DYNAMIC FLOATING ACTION BUTTON (FAB) IN BOTTOM-RIGHT */}
      {(activeTab === "links" || activeTab === "software" || activeTab === "packages" || activeTab === "faqs" || (activeTab === "users" && currentRole === "super_admin")) && (
        <button
          onClick={() => {
            if (activeTab === "links") openAddLinkModal();
            else if (activeTab === "software") openAddSoftwareModal();
            else if (activeTab === "packages") openAddPackageModal();
            else if (activeTab === "faqs") openAddFaqModal();
            else if (activeTab === "users" && currentRole === "super_admin") openAddUserModal();
          }}
          className="fixed bottom-20 right-6 md:bottom-10 md:right-10 z-40 w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#D2F500] hover:bg-[#b8d800] text-black shadow-2xl flex items-center justify-center transition-all transform hover:scale-105 active:scale-95 border border-black/20"
        >
          <Plus className="w-6 h-6 stroke-[3] text-black" />
        </button>
      )}
    </div>
  );
}
