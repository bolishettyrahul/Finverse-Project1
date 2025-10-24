import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Live Market", path: "/market" },
  { name: "Demo Invest", path: "/invest" },
  { name: "Learn", path: "/learn" },
  { name: "About", path: "/about" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="text-2xl font-heading font-bold bg-gradient-neon bg-clip-text text-transparent group-hover:scale-105 transition-transform">
              Finverse
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg transition-all ${
                  location.pathname === link.path
                    ? "text-primary shadow-neon"
                    : "text-muted-foreground hover:text-primary hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button variant="neon" size="sm" asChild>
              <Link to="/invest">Start Demo</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground hover:text-primary transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-2 rounded-lg transition-all ${
                  location.pathname === link.path
                    ? "text-primary bg-white/5 shadow-neon"
                    : "text-muted-foreground hover:text-primary hover:bg-white/5"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="px-4 pt-2">
              <Button variant="neon" size="sm" className="w-full" asChild>
                <Link to="/invest">Start Demo</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
