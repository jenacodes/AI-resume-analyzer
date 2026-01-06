import { Link } from "react-router";
import { useState } from "react";
import { FileText, MenuIcon, X } from "lucide-react";
import { navItems } from "../constants/navigation";

const Navbar = () => {
  const [isMobileMenu, setIsMobileMenu] = useState(false);

  return (
    <header className="lg:hidden relative z-40 px-8 pt-6 max-w-7xl space-y-8 bg-white border-b-4 border-black">
      <div className="flex flex-col lg:flex-row justify-between lg:items-end">
        <div className="lg:hidden flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-neo-primary border-4 border-black shadow-neo-sm flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <Link
              to="/"
              className="text-2xl font-black uppercase tracking-tighter text-black"
            >
              ResumeAI
            </Link>
          </div>
          <button
            onClick={() => setIsMobileMenu(!isMobileMenu)}
            className="flex flex-col justify-center items-center w-10 h-10 gap-1.5 p-2 bg-white border-2 border-black shadow-neo-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
          >
            <span
              className={`block w-6 h-0.5 bg-black transition-all duration-300 ${
                isMobileMenu ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-black transition-all duration-300 ${
                isMobileMenu ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-black transition-all duration-300 ${
                isMobileMenu ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenu && (
          <div className="absolute top-20 right-5 w-64 bg-white border-4 border-black shadow-neo-lg p-0 z-50 animate-in slide-in-from-top-2">
            <nav className="flex flex-col">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setIsMobileMenu(false)}
                  className="flex items-center gap-3 px-6 py-4 border-b-2 border-black last:border-b-0 hover:bg-neo-accent transition-colors"
                >
                  <item.icon className="w-5 h-5 text-black" />
                  <span className="font-bold text-black uppercase">
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
