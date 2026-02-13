import { ChevronDown, Menu, Search, Settings, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Mock data
const advertisers = [
  "Adventive Testing",
  "Amateur Golf",
  "Apple",
  "beep w",
  "Beginnings",
  "Burger King",
  "Default Advertiser",
  "Designz",
  "Flickr",
  "Groundswell",
  "Her Campus",
];

const builderItems = [
  { label: "Rich Media Ad Builder", href: "/builder/" },
  { label: "Instream Video Ad Builder", href: "/builder/video" },
];

const settingsItems = [
  {
    section: "SETTINGS",
    items: [
      { label: "Personal Settings", href: "#" },
      { label: "API Settings", href: "#" },
      { label: "Users & Permissions", href: "#" },
    ],
  },
  {
    section: "HELP",
    items: [
      { label: "Knowledge Base", href: "#" },
      { label: "Sign Out", href: "#" },
    ],
  },
];

// Dropdown Component
const Dropdown = ({
  trigger,
  children,
  align = "left",
  isOpen = false,
  onToggle,
  closeOnSelect = true,
}: {
  align: "left" | "right";
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onToggle(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onToggle]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: should be interactive */}
      <div onClick={() => onToggle(!isOpen)}>{trigger}</div>
      {/* biome-ignore lint/a11y/noStaticElementInteractions: should be interactive */}
      {isOpen && (
        <div
          className={`absolute top-full mt-1 min-w-[200px] bg-slate-800 border border-slate-700 rounded shadow-lg z-50 ${
            align === "right" ? "right-0" : "left-0"
          }`}
          onClick={() => closeOnSelect && onToggle(false)}
        >
          {children}
        </div>
      )}
    </div>
  );
};

// Advertiser Dropdown with Search
const AdvertiserDropdown = ({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}) => {
  const [search, setSearch] = useState("");
  const filteredAdvertisers = advertisers.filter((a) =>
    a.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Dropdown
      isOpen={isOpen}
      onToggle={onToggle}
      align="right"
      closeOnSelect={false}
      trigger={
        <button
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors px-3 py-2"
          type="button"
        >
          <span>Default Advertiser</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      }
    >
      <div className="p-2 border-b border-slate-700">
        <button
          className="w-full text-center py-2 text-sm font-semibold text-slate-300 hover:text-white tracking-wide"
          type="button"
        >
          NEW ADVERTISER
        </button>
      </div>
      <div className="p-2 border-b border-slate-700">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-b border-slate-600 px-2 py-1 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-slate-400"
          />
          <Search className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500" />
        </div>
      </div>
      <div className="max-h-[250px] overflow-y-auto py-1">
        {filteredAdvertisers.map((advertiser) => (
          <button
            key={advertiser}
            className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
            onClick={() => onToggle(false)}
            type="button"
          >
            {advertiser}
          </button>
        ))}
      </div>
    </Dropdown>
  );
};

// Settings Dropdown
const SettingsDropdown = ({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}) => (
  <Dropdown
    isOpen={isOpen}
    onToggle={onToggle}
    align="right"
    trigger={
      <button
        className="p-2 text-slate-400 hover:text-white transition-colors"
        type="button"
      >
        <Settings />
      </button>
    }
  >
    {settingsItems.map((group, idx) => (
      <div
        key={group.section}
        className={idx > 0 ? "border-t border-slate-700" : ""}
      >
        <div className="px-4 py-2 text-xs font-semibold text-slate-500 tracking-wide">
          {group.section}
        </div>
        {group.items.map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="block px-6 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            {item.label}
          </a>
        ))}
      </div>
    ))}
  </Dropdown>
);

// Builder Dropdown
const BuilderDropdown = ({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: (open: boolean) => void;
}) => (
  <Dropdown
    isOpen={isOpen}
    onToggle={onToggle}
    trigger={
      <button
        className="flex items-center gap-1 px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm tracking-wide"
        type="button"
      >
        BUILDER
        <ChevronDown
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
    }
  >
    {builderItems.map((item) => (
      <a
        key={item.label}
        href={item.href}
        className="block px-4 py-3 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
      >
        {item.label}
      </a>
    ))}
  </Dropdown>
);

// Mobile Side Nav (Left - Navigation)
const MobileNavDrawer = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [builderOpen, setBuilderOpen] = useState(false);

  return (
    <>
      {/* Backdrop */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: should be interactive */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-slate-900 border-r border-slate-700 z-50 transform transition-transform lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <div className="flex items-center gap-3">
            {/* Brand placeholder */}
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center text-white text-xs font-bold">
              A
            </div>
            <span className="text-white font-semibold tracking-wide">
              ADVENTIVE
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white"
            type="button"
          >
            <X />
          </button>
        </div>

        <nav className="p-4">
          <a
            href="/dashboard"
            className="block px-4 py-3 text-white bg-slate-800/50 border-l-2 border-purple-500 mb-1"
          >
            DASHBOARD
          </a>

          {/* Builder with submenu */}
          <div>
            <button
              onClick={() => setBuilderOpen(!builderOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/30 transition-colors"
              type="button"
            >
              <span>BUILDER</span>
              <ChevronDown
                className={`transition-transform ${builderOpen ? "rotate-180" : ""}`}
              />
            </button>
            {builderOpen && (
              <div className="ml-4 border-l border-slate-700">
                {builderItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className="block px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <a
            href="/assets"
            className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/30 transition-colors"
          >
            ASSETS
          </a>
          <a
            href="/campaigns"
            className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/30 transition-colors"
          >
            CAMPAIGNS
          </a>
          <a
            href="/analytics"
            className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/30 transition-colors"
          >
            ANALYTICS
          </a>
        </nav>
      </div>
    </>
  );
};

// Mobile Settings Drawer (Right - Settings & Advertiser)
const MobileSettingsDrawer = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [advertiserSearch, setAdvertiserSearch] = useState("");
  const [advertiserOpen, setAdvertiserOpen] = useState(true);

  const filteredAdvertisers = advertisers.filter((a) =>
    a.toLowerCase().includes(advertiserSearch.toLowerCase()),
  );

  return (
    <>
      {/* Backdrop */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: should be interactive */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-slate-900 border-l border-slate-700 z-50 transform transition-transform lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-700">
          <span className="text-white font-semibold">Settings</span>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white"
            type="button"
          >
            <X />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100%-60px)]">
          {/* Advertiser Section */}
          <div className="border-b border-slate-700">
            <button
              onClick={() => setAdvertiserOpen(!advertiserOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-slate-300"
              type="button"
            >
              <span className="text-xs font-semibold tracking-wide text-slate-500">
                ADVERTISER
              </span>
              <div className="flex items-center gap-2">
                <span className="text-sm">Default Advertiser</span>
                <ChevronDown
                  className={`transition-transform ${advertiserOpen ? "rotate-180" : ""}`}
                />
              </div>
            </button>

            {advertiserOpen && (
              <div className="px-4 pb-4">
                <button
                  className="w-full text-center py-2 mb-2 text-sm font-semibold text-slate-300 hover:text-white tracking-wide border border-slate-600 rounded"
                  type="button"
                >
                  NEW ADVERTISER
                </button>
                <div className="relative mb-2">
                  <input
                    type="text"
                    placeholder="Search"
                    value={advertiserSearch}
                    onChange={(e) => setAdvertiserSearch(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-600 rounded px-3 py-2 text-sm text-slate-300 placeholder-slate-500 focus:outline-none focus:border-slate-400"
                  />
                  <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
                </div>
                <div className="max-h-[150px] overflow-y-auto">
                  {filteredAdvertisers.map((advertiser) => (
                    <button
                      key={advertiser}
                      className="w-full text-left px-2 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors rounded"
                      type="button"
                    >
                      {advertiser}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Settings Sections */}
          {settingsItems.map((group) => (
            <div key={group.section} className="border-b border-slate-700 py-2">
              <div className="px-4 py-2 text-xs font-semibold text-slate-500 tracking-wide">
                {group.section}
              </div>
              {group.items.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="block px-6 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

// Brand Logo Placeholder Component
const BrandLogo = () => (
  <div className="flex items-center gap-3">
    {/* Logo placeholder - replace src with actual logo */}
    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center text-white text-xs font-bold shrink-0">
      {/* Replace this div with: <img src="/path/to/logo.png" alt="Brand" className="w-8 h-8" /> */}
      A
    </div>
    <span className="text-white font-semibold tracking-widest text-sm hidden sm:block">
      ADVENTIVE
    </span>
  </div>
);

// Main Navbar Component
export default function ResponsiveNavbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  const [builderOpen, setBuilderOpen] = useState(false);
  const [advertiserOpen, setAdvertiserOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Close all dropdowns when one opens
  const handleBuilderToggle = (open: boolean) => {
    setBuilderOpen(open);
    if (open) {
      setAdvertiserOpen(false);
      setSettingsOpen(false);
    }
  };

  const handleAdvertiserToggle = (open: boolean) => {
    setAdvertiserOpen(open);
    if (open) {
      setBuilderOpen(false);
      setSettingsOpen(false);
    }
  };

  const handleSettingsToggle = (open: boolean) => {
    setSettingsOpen(open);
    if (open) {
      setBuilderOpen(false);
      setAdvertiserOpen(false);
    }
  };

  return (
    <>
      <nav className="bg-slate-900 border-b border-slate-700 px-4 h-14 flex items-center justify-between">
        {/* Left section */}
        <div className="flex items-center gap-2">
          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileNavOpen(true)}
            className="p-2 text-slate-400 hover:text-white lg:hidden"
            type="button"
          >
            <Menu />
          </button>

          {/* Brand logo */}
          <BrandLogo />

          {/* Desktop navigation */}
          <div className="hidden lg:flex items-center ml-6">
            <a
              href="/dashboard"
              className="px-4 py-2 text-white border-b-2 border-purple-500 text-sm tracking-wide"
            >
              DASHBOARD
            </a>
            <BuilderDropdown
              isOpen={builderOpen}
              onToggle={handleBuilderToggle}
            />
            <a
              href="/assets"
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm tracking-wide"
            >
              ASSETS
            </a>
            <a
              href="/campaigns"
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm tracking-wide"
            >
              CAMPAIGNS
            </a>
            <a
              href="/analytics"
              className="px-4 py-2 text-slate-400 hover:text-white transition-colors text-sm tracking-wide"
            >
              ANALYTICS
            </a>
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1">
          {/* Desktop dropdowns */}
          <div className="hidden lg:flex items-center">
            <AdvertiserDropdown
              isOpen={advertiserOpen}
              onToggle={handleAdvertiserToggle}
            />
            <SettingsDropdown
              isOpen={settingsOpen}
              onToggle={handleSettingsToggle}
            />
          </div>

          {/* Mobile settings cog */}
          <button
            onClick={() => setMobileSettingsOpen(true)}
            className="p-2 text-slate-400 hover:text-white lg:hidden"
            type="button"
          >
            <Settings />
          </button>
        </div>
      </nav>

      {/* Mobile drawers */}
      <MobileNavDrawer
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
      <MobileSettingsDrawer
        isOpen={mobileSettingsOpen}
        onClose={() => setMobileSettingsOpen(false)}
      />
    </>
  );
}
