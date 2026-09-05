import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  Camera,
  ImageUp,
  Compass,
  Trophy,
  Bookmark,
  User,
  LogOut,
  Info,
  Menu,
} from "lucide-react";
import type { ComponentType } from "react";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/use-user";
import { signOut } from "@/lib/auth-actions";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavItem = {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

const NAV: NavItem[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/live", label: "Live Check", icon: Camera },
  { to: "/check", label: "Photo Check", icon: ImageUp },
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
  { to: "/saved", label: "Saved", icon: Bookmark },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/about", label: "About", icon: Info },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="drip-aura" aria-hidden="true" />

      {/* Top navbar — single row on every breakpoint, no wrapping, no scroll */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl">
        <div className="mx-auto grid h-[76px] max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-5 sm:px-8">
          {/* LEFT: brand */}
          <Logo />

          {/* CENTER: primary navigation (desktop + tablet) */}
          <nav
            aria-label="Primary"
            className="hidden min-w-0 items-center justify-center gap-5 md:flex xl:gap-7"
          >
            {NAV.map((item) => {
              const active = pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative flex shrink-0 items-center gap-1.5 whitespace-nowrap py-2 text-[0.7rem] uppercase tracking-[0.14em] transition-colors duration-200",
                    active ? "text-accent" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <item.icon className="hidden h-[14px] w-[14px] shrink-0 xl:block" />
                  {item.label}
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -bottom-[1px] left-0 h-[1.5px] w-full origin-left scale-x-0 bg-accent transition-transform duration-200 group-hover:scale-x-100",
                      active && "scale-x-100",
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          {/* RIGHT: auth + primary CTA (desktop + tablet) */}
          <div className="hidden shrink-0 items-center gap-4 md:flex">
            <AuthStatusInline />
            <Link to="/live" className="drip-btn-primary shrink-0 whitespace-nowrap px-4 py-2 text-xs">
              Check My Fit
            </Link>
          </div>

          {/* Mobile: compact CTA + hamburger trigger */}
          <div className="flex shrink-0 items-center gap-2 justify-self-end md:hidden">
            <Link to="/live" className="drip-btn-primary whitespace-nowrap px-3.5 py-2 text-xs">
              Check My Fit
            </Link>
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border text-foreground transition-colors hover:bg-sand"
                >
                  <Menu className="h-4 w-4" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="flex w-[82%] flex-col gap-0 p-0 sm:max-w-xs">
                <SheetHeader className="border-b border-border px-5 py-5 text-left">
                  <SheetTitle className="sr-only">Navigation menu</SheetTitle>
                  <Logo />
                </SheetHeader>

                <nav aria-label="Mobile" className="flex flex-col gap-1 overflow-y-auto px-3 py-4">
                  {NAV.map((item) => {
                    const active = pathname === item.to;
                    return (
                      <SheetClose asChild key={item.to}>
                        <Link
                          to={item.to}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                            active
                              ? "bg-sand text-accent"
                              : "text-foreground hover:bg-sand",
                          )}
                        >
                          <item.icon className="h-4 w-4 shrink-0" />
                          {item.label}
                        </Link>
                      </SheetClose>
                    );
                  })}
                </nav>

                <div className="mt-auto border-t border-border px-5 py-5">
                  <AuthStatusMobile onNavigate={() => setMenuOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="pb-10">{children}</main>
    </div>
  );
}

function AuthStatusInline() {
  const { user, loading } = useUser();

  if (loading) return <div className="h-8 w-16" aria-hidden="true" />;

  if (!user) {
    return (
      <Link
        to="/auth"
        className="whitespace-nowrap text-[0.7rem] uppercase tracking-[0.14em] text-muted-foreground transition-colors hover:text-foreground"
      >
        Sign in
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        to="/profile"
        className="flex max-w-[140px] items-center gap-1.5 truncate text-[0.72rem] text-muted-foreground hover:text-foreground"
      >
        <User className="h-3.5 w-3.5 shrink-0" />
        <span className="truncate">{user.email}</span>
      </Link>
      <button
        type="button"
        onClick={() => void signOut()}
        title="Sign out"
        className="shrink-0 rounded-full border border-border p-1.5 text-muted-foreground transition-colors hover:text-foreground"
      >
        <LogOut className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

function AuthStatusMobile({ onNavigate }: { onNavigate: () => void }) {
  const { user, loading } = useUser();

  if (loading) return <div className="h-9" aria-hidden="true" />;

  if (!user) {
    return (
      <SheetClose asChild>
        <Link
          to="/auth"
          onClick={onNavigate}
          className="flex items-center justify-center rounded-xl border border-border py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-sand"
        >
          Sign in
        </Link>
      </SheetClose>
    );
  }

  return (
    <div className="flex items-center justify-between gap-3">
      <SheetClose asChild>
        <Link
          to="/profile"
          onClick={onNavigate}
          className="flex min-w-0 items-center gap-2 truncate text-sm text-foreground"
        >
          <User className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate">{user.email}</span>
        </Link>
      </SheetClose>
      <button
        type="button"
        onClick={() => void signOut()}
        title="Sign out"
        className="shrink-0 rounded-full border border-border p-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}