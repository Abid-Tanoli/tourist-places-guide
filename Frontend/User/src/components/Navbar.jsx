import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Menu,
  Search,
  MapPin,
  Compass,
  Heart,
  LogOut,
  User,
  CalendarCheck,
  ChevronDown,
  Mountain,
  BookOpen,
  MessageCircle,
  X,
} from "lucide-react";

const Navbar = ({
  regions = [],
  categories = [],
  regionFilter,
  setRegionFilter,
  categoryFilter,
  setCategoryFilter,
  searchInput,
  setSearchInput,
  handleSearch,
  setQuery,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const mobileSearchRef = useRef(null);

  useEffect(() => {
    if (mobileSearchOpen && mobileSearchRef.current) {
      mobileSearchRef.current.focus();
    }
  }, [mobileSearchOpen]);

  const handleHomeClick = () => {
    if (setRegionFilter) setRegionFilter("All");
    if (setCategoryFilter) setCategoryFilter("All");
    if (setQuery) setQuery("");
    setSearchInput("");
    navigate("/");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
    setOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { to: "/", label: "Explore", icon: Compass },
    { to: "/tours", label: "Tours", icon: Mountain },
    { to: "/booking", label: "Book", icon: CalendarCheck },
    { to: "/feedback", label: "Reviews", icon: MapPin },
    { to: "/blog", label: "Blog", icon: BookOpen },
    { to: "/contact", label: "Contact", icon: MessageCircle },
    { to: "/about", label: "About", icon: MapPin },
  ];

  const FilterControls = ({ compact = false }) => (
    <div className={`flex ${compact ? "flex-row gap-2" : "flex-col gap-3"}`}>
      <div className={compact ? "flex-1" : ""}>
        <label className={`block font-medium text-foreground ${compact ? "sr-only" : "mb-1 text-xs uppercase tracking-wide"}`}>
          Region
        </label>
        <Select value={regionFilter || "All"} onValueChange={(val) => setRegionFilter?.(val)}>
          <SelectTrigger className={compact ? "h-9 text-sm" : ""}>
            <SelectValue placeholder="All Regions" />
          </SelectTrigger>
          <SelectContent>
            {(regions.length ? regions : ["All"]).map((r) => (
              <SelectItem key={r} value={r}>{r === "All" ? "All Regions" : r}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className={compact ? "flex-1" : ""}>
        <label className={`block font-medium text-foreground ${compact ? "sr-only" : "mb-1 text-xs uppercase tracking-wide"}`}>
          Category
        </label>
        <Select value={categoryFilter || "All"} onValueChange={(val) => setCategoryFilter?.(val)}>
          <SelectTrigger className={compact ? "h-9 text-sm" : ""}>
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            {(categories.length ? categories : ["All"]).map((c) => (
              <SelectItem key={c} value={c}>{c === "All" ? "All Categories" : c}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  const MobileNav = () => (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-white hover:bg-white/10 min-h-10 min-w-10">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 bg-white p-0">
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b">
            <Link to="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
              <Mountain className="size-6 text-primary" />
              <span className="font-heading text-xl font-bold text-foreground">Pakistan Explorer</span>
            </Link>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors min-h-11 ${
                  isActive(link.to)
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                <link.icon className="size-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t space-y-3">
            {(setRegionFilter || setCategoryFilter) && (
              <>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground px-1">Filters</p>
                <FilterControls />
                <Separator />
              </>
            )}
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2">
                  <Avatar className="size-9">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{user?.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted min-h-11"
                >
                  <User className="size-4" />
                  My Profile
                </Link>
                <Link
                  to="/my-bookings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted min-h-11"
                >
                  <CalendarCheck className="size-4" />
                  My Bookings
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted min-h-11"
                >
                  <Heart className="size-4" />
                  Wishlist
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-red-600 hover:text-red-600 hover:bg-red-50 min-h-11"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <Button asChild className="w-full bg-primary hover:bg-primary/90 min-h-11">
                  <Link to="/login" onClick={() => setOpen(false)}>Sign In</Link>
                </Button>
                <Button asChild variant="outline" className="w-full min-h-11">
                  <Link to="/register" onClick={() => setOpen(false)}>Create Account</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <nav className="sticky top-0 z-50 bg-primary shadow-lg">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center gap-2 sm:gap-8">
            <MobileNav />
            <Link to="/" onClick={handleHomeClick} className="flex items-center gap-2 shrink-0">
              <Mountain className="size-5 sm:size-6 text-white" />
              <span className="font-heading text-lg font-bold text-white hidden sm:block">Pakistan Explorer</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={link.to === "/" ? handleHomeClick : undefined}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(link.to)
                      ? "bg-white/20 text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden lg:flex items-center gap-3 flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/50" />
              <Input
                type="text"
                placeholder="Search destinations..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white focus:text-foreground focus:border-white/40 h-9"
              />
            </form>
            {(setRegionFilter || setCategoryFilter) && (
              <FilterControls compact />
            )}
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            {!mobileSearchOpen && (
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-white hover:text-white hover:bg-white/10 min-h-10 min-w-10"
                onClick={() => setMobileSearchOpen(true)}
              >
                <Search className="size-4.5" />
              </Button>
            )}
            {mobileSearchOpen && (
              <form onSubmit={(e) => { handleSearch(e); setMobileSearchOpen(false); }} className="relative lg:hidden flex-1 mr-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/50" />
                <Input
                  ref={mobileSearchRef}
                  type="text"
                  placeholder="Search..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-9 pr-9 w-full min-w-[160px] bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white focus:text-foreground h-9"
                />
                <button
                  type="button"
                  onClick={() => { setMobileSearchOpen(false); setSearchInput(""); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white p-1"
                >
                  <X className="size-3.5" />
                </button>
              </form>
            )}

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10 gap-1.5 sm:gap-2 min-h-10 px-2 sm:px-3">
                    <Avatar className="size-7">
                      <AvatarFallback className="bg-white/20 text-white text-xs font-semibold">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm">{user?.name?.split(" ")[0]}</span>
                    <ChevronDown className="size-3 hidden sm:block" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2 cursor-pointer py-2.5">
                      <User className="size-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-bookings" className="flex items-center gap-2 cursor-pointer py-2.5">
                      <CalendarCheck className="size-4" />
                      My Bookings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist" className="flex items-center gap-2 cursor-pointer py-2.5">
                      <Heart className="size-4" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer py-2.5">
                    <LogOut className="size-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Button asChild variant="ghost" className="text-white hover:text-white hover:bg-white/10 hidden sm:flex min-h-10">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild className="bg-white text-primary hover:bg-white/90 hidden sm:flex min-h-10">
                  <Link to="/register">Sign Up</Link>
                </Button>
                <Button asChild className="bg-white text-primary hover:bg-white/90 sm:hidden min-h-10 min-w-10" size="icon">
                  <Link to="/login">
                    <User className="size-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
