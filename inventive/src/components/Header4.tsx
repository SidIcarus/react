import { ChevronDown, Menu, Search, Settings } from "lucide-react";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

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
  {
    label: "Rich Media Ad Builder",
    subLabel: "Create interactive rich media advertisements",
    href: "/builder/",
  },
  {
    label: "Instream Video Ad Builder",
    subLabel: "Build engaging instream video content",
    href: "/builder/video",
  },
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

// Brand Logo Placeholder Component
const BrandLogo = () => (
  <div className="flex items-center gap-3">
    {/* Logo placeholder - replace src with actual logo */}
    <div className="w-24 h-8 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold shrink-0">
      {/* Replace this div with: <img src="/path/to/logo.png" alt="Brand" className="w-8 h-8" /> */}
      INVENTIVE
    </div>
  </div>
);

// Advertiser Dropdown Component
const AdvertiserDropdown = ({
  isOpen,
  onToggleIsOpen,
}: {
  isOpen: boolean;
  onToggleIsOpen: (open: boolean) => void;
}) => {
  const [search, setSearch] = useState("");
  const filteredAdvertisers = advertisers.filter((a) =>
    a.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="text-slate-300 hover:text-white hover:bg-transparent gap-2"
        >
          Default Advertiser
          <ChevronDown
            className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-slate-800 border-slate-700"
      >
        <DropdownMenuItem className="justify-center font-semibold tracking-wide text-slate-300 hover:text-white focus:text-white focus:bg-slate-700">
          NEW ADVERTISER
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-slate-700" />
        <div className="p-2">
          <div className="relative">
            <Input
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-slate-600 text-slate-300 placeholder:text-slate-500 pr-8 focus-visible:ring-slate-500"
            />
            <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          </div>
        </div>
        <DropdownMenuSeparator className="bg-slate-700" />
        <div className="max-h-[200px] overflow-y-auto">
          {filteredAdvertisers.map((advertiser) => (
            <DropdownMenuItem
              key={advertiser}
              className="text-slate-300 hover:text-white focus:text-white focus:bg-slate-700"
            >
              {advertiser}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// Settings Dropdown Component
const SettingsDropdown = () => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" size="icon">
        <Settings className="h-5 w-5" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      {settingsItems.map((group, idx) => (
        <React.Fragment key={group.section}>
          {idx > 0 && <DropdownMenuSeparator />}
          <DropdownMenuLabel className="text-xs font-semibold tracking-wide">
            {group.section}
          </DropdownMenuLabel>
          <DropdownMenuGroup>
            {group.items.map((item) => (
              <DropdownMenuItem key={item.label} className="pl-4">
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </React.Fragment>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

// Desktop Navigation Menu
const DesktopNav = () => (
  <NavigationMenu className="hidden lg:flex ml-6">
    <NavigationMenuList className="gap-0">
      <NavigationMenuItem>
        <NavigationMenuLink
          href="/dashboard"
          className={navigationMenuTriggerStyle()}
        >
          DASHBOARD
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuTrigger className={navigationMenuTriggerStyle()}>
          BUILDER
        </NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="grid w-[280px] gap-1 p-2">
            {builderItems.map((item) => (
              <li key={item.label}>
                <NavigationMenuLink
                  href={item.href}
                  className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus:bg-slate-800 dark:focus:text-slate-50"
                >
                  <div className="text-sm font-medium leading-none">
                    {item.label}
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-snug text-slate-500 dark:text-slate-400">
                    {item.subLabel}
                  </p>
                </NavigationMenuLink>
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink
          href="/assets"
          className={navigationMenuTriggerStyle()}
        >
          ASSETS
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink
          href="/campaigns"
          className={navigationMenuTriggerStyle()}
        >
          CAMPAIGNS
        </NavigationMenuLink>
      </NavigationMenuItem>

      <NavigationMenuItem>
        <NavigationMenuLink
          href="/analytics"
          className={navigationMenuTriggerStyle()}
        >
          ANALYTICS
        </NavigationMenuLink>
      </NavigationMenuItem>
    </NavigationMenuList>
  </NavigationMenu>
);

// Mobile Navigation Sheet (Left)
const MobileNavSheet = () => {
  const [builderOpen, setBuilderOpen] = useState(false);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-white hover:bg-transparent lg:hidden"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-72 bg-slate-900 border-slate-700 p-0"
      >
        <SheetHeader className="p-4 border-b border-slate-700">
          <SheetTitle className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded flex items-center justify-center text-xs font-bold">
              A
            </div>
            <span className="text-white font-semibold tracking-wide">
              ADVENTIVE
            </span>
          </SheetTitle>
        </SheetHeader>

        <nav className="p-4 space-y-1">
          <SheetClose asChild>
            <a
              href="/dashboard"
              className="block px-4 py-3 bg-slate-800/50 border-l-2 border-purple-500 rounded-r"
            >
              DASHBOARD
            </a>
          </SheetClose>

          <Collapsible open={builderOpen} onOpenChange={setBuilderOpen}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-between px-4 py-3 h-auto text-slate-300 hover:text-white hover:bg-slate-800/30"
              >
                BUILDER
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    builderOpen && "rotate-180",
                  )}
                />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="ml-4 border-l border-slate-700">
              {builderItems.map((item) => (
                <SheetClose asChild key={item.label}>
                  <a
                    href={item.href}
                    className="block px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </SheetClose>
              ))}
            </CollapsibleContent>
          </Collapsible>

          <SheetClose asChild>
            <a
              href="/assets"
              className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/30 rounded transition-colors"
            >
              ASSETS
            </a>
          </SheetClose>

          <SheetClose asChild>
            <a
              href="/campaigns"
              className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/30 rounded transition-colors"
            >
              CAMPAIGNS
            </a>
          </SheetClose>

          <SheetClose asChild>
            <a
              href="/analytics"
              className="block px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-800/30 rounded transition-colors"
            >
              ANALYTICS
            </a>
          </SheetClose>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

// Mobile Settings Sheet (Right)
const MobileSettingsSheet = ({
  isAdvertiserOpen,
  onToggleIsAdvertiserOpen,
}: {
  isAdvertiserOpen: boolean;
  onToggleIsAdvertiserOpen: (open: boolean) => void;
}) => {
  const [advertiserSearch, setAdvertiserSearch] = useState("");

  const filteredAdvertisers = advertisers.filter((a) =>
    a.toLowerCase().includes(advertiserSearch.toLowerCase()),
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:text-white hover:bg-transparent lg:hidden"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="w-72 bg-slate-900 border-slate-700 p-0"
      >
        <SheetHeader className="p-4 border-b border-slate-700">
          <SheetTitle className="text-white text-left">Settings</SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto h-[calc(100vh-65px)]">
          {/* Advertiser Section */}
          <div className="border-b border-slate-700">
            <Collapsible
              open={isAdvertiserOpen}
              onOpenChange={onToggleIsAdvertiserOpen}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-between px-4 py-3 h-auto hover:bg-transparent"
                >
                  <span className="text-xs font-semibold tracking-wide text-slate-500">
                    ADVERTISER
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-slate-300">
                      Default Advertiser
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-slate-400 transition-transform",
                        isAdvertiserOpen && "rotate-180",
                      )}
                    />
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="px-4 pb-4 space-y-3">
                <Button
                  variant="outline"
                  className="w-full border-slate-600 text-slate-300 hover:text-white hover:bg-slate-800"
                >
                  NEW ADVERTISER
                </Button>

                <div className="relative">
                  <Input
                    placeholder="Search"
                    value={advertiserSearch}
                    onChange={(e) => setAdvertiserSearch(e.target.value)}
                    className="bg-slate-800 border-slate-600 text-slate-300 placeholder:text-slate-500 pr-8 focus-visible:ring-slate-500"
                  />
                  <Search className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                </div>

                <div className="max-h-[150px] overflow-y-auto space-y-1">
                  {filteredAdvertisers.map((advertiser) => (
                    <SheetClose asChild key={advertiser}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-sm text-slate-300 hover:text-white hover:bg-slate-700 h-auto py-2"
                      >
                        {advertiser}
                      </Button>
                    </SheetClose>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Settings Sections */}
          {settingsItems.map((group) => (
            <div key={group.section} className="border-b border-slate-700 py-2">
              <div className="px-4 py-2 text-xs font-semibold text-slate-500 tracking-wide">
                {group.section}
              </div>
              {group.items.map((item) => (
                <SheetClose asChild key={item.label}>
                  <a
                    href={item.href}
                    className="block px-6 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                  >
                    {item.label}
                  </a>
                </SheetClose>
              ))}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

// Main Navbar Component
export default function Header() {
  const [isAdvertiserOpen, setIsAdvertiserOpen] = useState(true);

  return (
    <nav className="border-b border-slate-700 px-4 h-14 flex items-center justify-between">
      {/* Left section */}
      <div className="flex items-center gap-2">
        <MobileNavSheet />
        <BrandLogo />
        <DesktopNav />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-1">
        {/* Desktop dropdowns */}
        <div className="hidden lg:flex items-center">
          <AdvertiserDropdown
            isOpen={isAdvertiserOpen}
            onToggle={setIsAdvertiserOpen}
          />
          <SettingsDropdown />
        </div>

        {/* Mobile settings */}
        <MobileSettingsSheet
          isAdvertiserOpen={isAdvertiserOpen}
          onToggleIsAdvertiserOpen={setIsAdvertiserOpen}
        />
      </div>
    </nav>
  );
}
