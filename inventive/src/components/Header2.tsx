import { useState, useMemo } from "react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Search,
  Settings,
  ChevronDown,
  Plus,
  User,
  Key,
  Users,
  BookOpen,
  LogOut,
} from "lucide-react"

const advertisers = [
  { id: 1, name: "Acme Corporation" },
  { id: 2, name: "TechStart Inc." },
  { id: 3, name: "Global Media Group" },
  { id: 4, name: "Digital Ventures" },
  { id: 5, name: "Creative Solutions Ltd" },
  { id: 6, name: "Marketing Pro Agency" },
  { id: 7, name: "Brand Builders Co" },
]

export default function Header() {
  const [selectedAdvertiser, setSelectedAdvertiser] = useState(advertisers[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [advertiserDropdownOpen, setAdvertiserDropdownOpen] = useState(false)

  const filteredAdvertisers = useMemo(() => {
    if (!searchQuery.trim()) return advertisers
    return advertisers.filter((advertiser) =>
      advertiser.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [searchQuery])

  const handleSignout = () => {
    console.log("Signing out...")
    // Implement your signout logic here
  }

  const handleNewAdvertiser = () => {
    console.log("Creating new advertiser...")
    // Implement new advertiser logic here
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-slate-800 dark:bg-slate-950/95 dark:supports-[backdrop-filter]:bg-slate-950/80">
      <div className="flex h-14 items-center justify-between px-4 md:px-6">
        {/* Left Navigation */}
        <NavigationMenu>
          <NavigationMenuList className="gap-1">
            <NavigationMenuItem>
              <NavigationMenuLink
                href="/dashboard"
                className={navigationMenuTriggerStyle()}
              >
                Dashboard
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Builder</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[280px] gap-1 p-2">
                  <li>
                    <NavigationMenuLink
                      href="/builder/"
                      className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus:bg-slate-800 dark:focus:text-slate-50"
                    >
                      <div className="text-sm font-medium leading-none">
                        Rich Media Ad Builder
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-xs leading-snug text-slate-500 dark:text-slate-400">
                        Create interactive rich media advertisements
                      </p>
                    </NavigationMenuLink>
                  </li>
                  <li>
                    <NavigationMenuLink
                      href="/builder/video"
                      className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 hover:text-slate-900 focus:bg-slate-100 focus:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50 dark:focus:bg-slate-800 dark:focus:text-slate-50"
                    >
                      <div className="text-sm font-medium leading-none">
                        Instream Video Builder
                      </div>
                      <p className="mt-1.5 line-clamp-2 text-xs leading-snug text-slate-500 dark:text-slate-400">
                        Build engaging instream video content
                      </p>
                    </NavigationMenuLink>
                  </li>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="/assets"
                className={navigationMenuTriggerStyle()}
              >
                Assets
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="/campaigns"
                className={navigationMenuTriggerStyle()}
              >
                Campaigns
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink
                href="/analytics"
                className={navigationMenuTriggerStyle()}
              >
                Analytics
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Navigation */}
        <div className="flex items-center gap-2">
          {/* Advertiser Dropdown */}
          <DropdownMenu
            open={advertiserDropdownOpen}
            onOpenChange={setAdvertiserDropdownOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="min-w-[180px] justify-between gap-2"
              >
                <span className="truncate">{selectedAdvertiser.name}</span>
                <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[280px]" align="end">
              <div className="p-2">
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={handleNewAdvertiser}
                >
                  <Plus className="h-4 w-4" />
                  New Advertiser
                </Button>
              </div>
              <DropdownMenuSeparator />
              <div className="p-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500 dark:text-slate-400" />
                  <Input
                    placeholder="Search advertisers..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <DropdownMenuSeparator />
              <div className="max-h-[200px] overflow-y-auto">
                {filteredAdvertisers.length > 0 ? (
                  filteredAdvertisers.map((advertiser) => (
                    <DropdownMenuItem
                      key={advertiser.id}
                      onClick={() => {
                        setSelectedAdvertiser(advertiser)
                        setSearchQuery("")
                        setAdvertiserDropdownOpen(false)
                      }}
                      className={
                        selectedAdvertiser.id === advertiser.id
                          ? "bg-slate-100 dark:bg-slate-800"
                          : ""
                      }
                    >
                      {advertiser.name}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                    No advertisers found
                  </div>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Settings Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]" align="end">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <a href="/settings/personal" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    Personal Settings
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/settings/api" className="flex items-center gap-2 cursor-pointer">
                    <Key className="h-4 w-4" />
                    API Settings
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="/settings/users" className="flex items-center gap-2 cursor-pointer">
                    <Users className="h-4 w-4" />
                    User & Permissions
                  </a>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator />

              <DropdownMenuLabel>Help</DropdownMenuLabel>
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <a href="/help/knowledge-base" className="flex items-center gap-2 cursor-pointer">
                    <BookOpen className="h-4 w-4" />
                    Knowledge Base
                  </a>
                </DropdownMenuItem>
              </DropdownMenuGroup>

              <Separator className="my-2" />

              <DropdownMenuItem
                onClick={handleSignout}
                className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
