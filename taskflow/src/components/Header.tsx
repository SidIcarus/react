import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, User } from "lucide-react";
import { ActiveTimerIndicator } from "@/components/ActiveTimerIndicator";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/auth";

export function Header() {
  const { user, signout } = useAuth();

  const navigate = useNavigate();

  async function onSignout() {
    signout();
    navigate({ to: "/auth/signin" });
  }

  return (
    <header className="border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <nav className="flex items-center gap-6">
          <Link to="/" className="font-semibold text-lg">
            TaskFlow
          </Link>
          <Link
            to="/projects"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Projects
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <ActiveTimerIndicator />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="size-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {user && (
                <>
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                  <DropdownMenuSeparator />
                </>
              )}
              <DropdownMenuItem onClick={onSignout}>
                <LogOut className="size-4 mr-2" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export default Header;
