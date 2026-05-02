import { Link, useNavigate } from "react-router-dom";
import { LogOut, Sparkles, User as UserIcon, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Brand } from "./Brand";

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const displayName = user?.displayName || user?.email || "?";
  const initial = displayName.trim().charAt(0).toUpperCase();
  const avatarUrl = user?.photoURL ?? undefined;

  return (
    <header className="fixed top-0 inset-x-0 z-50 glass-panel border-b border-white/5 neo-blur">
      <div className="container flex items-center justify-between h-16 px-6">
        <Link to="/" className="flex items-center gap-3 group">
          <Brand size={28} />
        </Link>
 
        <nav className="hidden md:flex items-center gap-6 mono-tag text-neutral-500">
          <a href="/#features" className="hover:text-neutral-100 transition-colors uppercase tracking-[0.2em] text-[10px]">Log_Features</a>
          <a href="/#templates" className="hover:text-neutral-100 transition-colors uppercase tracking-[0.2em] text-[10px]">Lib_Templates</a>
          {user && (
            <Link to="/dashboard" className="hover:text-neutral-100 transition-colors uppercase tracking-[0.2em] text-[10px]">Dash_Storage</Link>
          )}
        </nav>
 
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-sm px-3 py-1.5 border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 transition-all">
                <Avatar className="h-6 w-6 rounded-sm">
                  <AvatarImage src={avatarUrl} className="grayscale" />
                  <AvatarFallback className="bg-neutral-800 text-neutral-400 text-[10px] rounded-sm">
                    {initial}
                  </AvatarFallback>
                </Avatar>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="hidden sm:inline text-[10px] font-mono font-bold text-neutral-300 uppercase tracking-tight">
                  {user.displayName || user.email?.split("@")[0]}
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-neutral-900 border-neutral-800 text-neutral-300 rounded-sm">
              <DropdownMenuLabel className="text-[10px] text-neutral-500 font-mono uppercase tracking-widest px-2 py-3 border-b border-neutral-800 mb-1">
                Access Layer // {user.email}
              </DropdownMenuLabel>
              <DropdownMenuItem asChild className="focus:bg-neutral-800 focus:text-white rounded-sm cursor-pointer p-2">
                <Link to="/dashboard" className="flex items-center gap-2 w-full">
                  <LayoutDashboard className="w-3.5 h-3.5" /> <span className="mono-tag text-[10px]">Open_Dash</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="focus:bg-neutral-800 focus:text-white rounded-sm cursor-pointer p-2">
                <Link to="/supernova" className="flex items-center gap-2 w-full">
                  <Sparkles className="w-3.5 h-3.5" /> <span className="mono-tag text-[10px]">AI_Studio</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-neutral-800" />
              <DropdownMenuItem
                className="focus:bg-red-500/10 focus:text-red-500 rounded-sm cursor-pointer p-2"
                onClick={async () => {
                  await signOut();
                  navigate("/");
                }}
              >
                <LogOut className="w-3.5 h-3.5 mr-2" /> <span className="mono-tag text-[10px]">Disconnect</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/auth" className="mono-tag text-neutral-500 hover:text-white text-[10px] uppercase tracking-[0.2em] hidden sm:block">
              Entry_Port
            </Link>
            <Button className="bg-indigo-600 hover:bg-indigo-500 text-white border-none rounded-sm px-6 h-9 uppercase text-[10px] font-bold tracking-widest shadow-lg shadow-indigo-500/20" asChild>
              <Link to="/auth?mode=signup">
                Deploy Account
              </Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
