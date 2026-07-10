import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  CompassIcon,
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

  const handleHomeClick = () => {
    setRegionFilter("All");
    setCategoryFilter("All");
    setQuery("");
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
    { to: "/about", label: "About", icon: MapPin },
  ];

  const MobileNav = () => (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-white hover:bg-white/10">
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
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
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
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <User className="size-4" />
                  My Profile
                </Link>
                <Link
                  to="/my-bookings"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <CalendarCheck className="size-4" />
                  My Bookings
                </Link>
                <Link
                  to="/wishlist"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <Heart className="size-4" />
                  Wishlist
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 text-red-600 hover:text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="size-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link to="/login" onClick={() => setOpen(false)}>Sign In</Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <MobileNav />
            <Link to="/" onClick={handleHomeClick} className="flex items-center gap-2">
              <Mountain className="size-6 text-white" />
              <span className="font-heading text-xl font-bold text-white hidden sm:block">Pakistan Explorer</span>
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

          <div className="flex-1 max-w-md mx-4 hidden lg:block">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search destinations..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white focus:text-foreground focus:border-white/40 h-9"
              />
            </form>
          </div>

          <div className="flex items-center gap-2">
            <form onSubmit={handleSearch} className="relative lg:hidden">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-white/50" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 w-32 sm:w-40 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white focus:text-foreground h-9"
              />
            </form>

            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10 gap-2">
                    <Avatar className="size-7">
                      <AvatarFallback className="bg-white/20 text-white text-xs font-semibold">
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline text-sm">{user?.name?.split(" ")[0]}</span>
                    <ChevronDown className="size-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium">{user?.name}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                      <User className="size-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/my-bookings" className="flex items-center gap-2 cursor-pointer">
                      <CalendarCheck className="size-4" />
                      My Bookings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist" className="flex items-center gap-2 cursor-pointer">
                      <Heart className="size-4" />
                      Wishlist
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                    <LogOut className="size-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-2">
                <Button asChild variant="ghost" className="text-white hover:text-white hover:bg-white/10 hidden sm:flex">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild className="bg-white text-primary hover:bg-white/90 hidden sm:flex">
                  <Link to="/register">Sign Up</Link>
                </Button>
                <Button asChild className="bg-white text-primary hover:bg-white/90 sm:hidden" size="icon">
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
