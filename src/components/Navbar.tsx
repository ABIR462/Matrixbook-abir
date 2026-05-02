import { Link, useNavigate } from "react-router-dom";
import { LogOut, Sparkles, User as UserIcon, LayoutDashboard, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { Brand } from "./Brand";
import { useState } from "react";

export function Navbar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName = user?.displayName || user?.email || "?";
  const initial = displayName.trim().charAt(0).toUpperCase();
  const avatarUrl = user?.photoURL ?? undefined;

  const navLinks = [
    { label: "Features", href: "/#features", id: "Features" },
    { label: "Templates", href: "/#templates", id: "Templates" },
    { label: "AI Studio", href: "/supernova", id: "Studio" },
  ];

  return (
    <header className="fixed top-0 inset-x-0 z-50 glass-panel border-b border-white/5 neo-blur h-16 md:h-20 flex items-center transition-all duration-300">
      <div className="container flex items-center justify-between px-6 mx-auto">
        <Link to="/" className="flex items-center gap-3 group active:scale-95 transition-transform">
          <Brand size={24} />
        </Link>
 
        <nav className="hidden md:flex items-center gap-8 mono-tag text-neutral-500">
          {navLinks.map(link => (
             <a 
               key={link.id} 
               href={link.href} 
               className="hover:text-indigo-400 transition-colors uppercase tracking-[0.2em] text-[10px] font-bold"
             >
               {link.label}
             </a>
          ))}
          {user && (
            <Link to="/dashboard" className="hover:text-indigo-400 transition-colors uppercase tracking-[0.2em] text-[10px] font-bold">Dash_Storage</Link>
          )}
        </nav>
 
        <div className="flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-xl px-3 py-1.5 border border-white/5 bg-white/[0.03] hover:bg-white/[0.08] transition-all group">
                  <Avatar className="h-6 w-6 rounded-lg">
                    <AvatarImage src={avatarUrl} className="grayscale group-hover:grayscale-0 transition-all" />
                    <AvatarFallback className="bg-neutral-800 text-neutral-400 text-[10px]">
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                  <span className="hidden lg:inline text-[10px] font-sans font-black text-neutral-300 uppercase tracking-widest">
                    {user.displayName || user.email?.split("@")[0]}
                  </span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 glass-panel neo-blur border-white/5 text-neutral-300 rounded-2xl p-2 mt-4 shadow-2xl">
                <DropdownMenuLabel className="text-[10px] text-neutral-500 font-sans font-black uppercase tracking-[0.2em] px-4 py-4 border-b border-white/5 mb-1">
                  ACCESS_NODE // {user.email}
                </DropdownMenuLabel>
                <DropdownMenuItem asChild className="focus:bg-white/[0.05] focus:text-white rounded-xl cursor-pointer p-3 transition-colors mb-1">
                  <Link to="/dashboard" className="flex items-center gap-3 w-full">
                    <LayoutDashboard className="w-4 h-4 text-indigo-400" /> <span className="text-[11px] font-bold uppercase tracking-widest">Workspace</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="focus:bg-white/[0.05] focus:text-white rounded-xl cursor-pointer p-3 transition-colors mb-1">
                  <Link to="/supernova" className="flex items-center gap-3 w-full">
                    <Sparkles className="w-4 h-4 text-indigo-400" /> <span className="text-[11px] font-bold uppercase tracking-widest">Neural OS</span>
                  </Link>
                </DropdownMenuItem>
                <Separator className="my-2 bg-white/5" />
                <DropdownMenuItem
                  className="focus:bg-red-500/10 focus:text-red-500 rounded-xl cursor-pointer p-3 transition-colors"
                  onClick={async () => {
                    await signOut();
                    navigate("/");
                  }}
                >
                  <LogOut className="w-4 h-4 mr-1 ml-0.5" /> <span className="text-[11px] font-bold uppercase tracking-widest">Disconnect</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-6 md:gap-8">
              <Link to="/auth" className="text-neutral-500 hover:text-white text-[10px] uppercase tracking-[0.3em] font-black hidden lg:block transition-colors">
                SIGN_IN
              </Link>
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white border-none rounded-full px-6 h-10 uppercase text-[10px] font-black tracking-[0.2em] shadow-[0_10px_30px_rgba(99,102,241,0.3)] min-w-[140px] active:scale-95 transition-all" asChild>
                <Link to="/auth?mode=signup">
                  Initialize
                </Link>
              </Button>
            </div>
          )}

          {/* Mobile Sheet */}
          <div className="md:hidden">
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="p-2 text-neutral-400 hover:text-white transition-colors">
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] glass-panel neo-blur border-l border-white/5 p-8 flex flex-col pt-20">
                <div className="space-y-8">
                  {navLinks.map(link => (
                    <a 
                      key={link.id} 
                      href={link.href} 
                      onClick={() => setMobileOpen(false)}
                      className="block text-2xl font-sans font-bold tracking-tighter text-neutral-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                  {user && (
                    <Link 
                      to="/dashboard" 
                      onClick={() => setMobileOpen(false)}
                      className="block text-2xl font-sans font-bold tracking-tighter text-neutral-400 hover:text-white transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                  {!user && (
                    <Link 
                      to="/auth" 
                      onClick={() => setMobileOpen(false)}
                      className="block text-2xl font-sans font-bold tracking-tighter text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Sign In
                    </Link>
                  )}
                </div>

                <div className="mt-auto">
                    <p className="text-[10px] font-sans font-black text-neutral-700 uppercase tracking-[0.4em]">MATRIXBOOK_CORE // MOBILE_ACCESS</p>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

function Separator({ className }: { className?: string }) {
  return <div className={`h-px w-full ${className}`} />;
}
