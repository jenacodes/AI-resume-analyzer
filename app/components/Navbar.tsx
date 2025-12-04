import { Link } from "react-router";
import { useState } from "react";
import { FileText, MenuIcon, X } from "lucide-react";
import { navItems } from "../constants/navigation";

const Navbar = () => {
  const [isMobileMenu, setIsMobileMenu] = useState(false);

  return (
    <header className="lg:hidden relative z-40 px-8 pt-6 max-w-7xl mx-auto space-y-8 bg-slate-900/80 backdrop-blur-md  shadow-2xl border-b border-white/10">
      <div className="flex flex-col lg:flex-row justify-between lg:items-end">
        <div className="lg:hidden flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <Link
              to="/"
              className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 drop-shadow-lg"
            >
              ResumeAI
            </Link>
          </div>
          <button
            onClick={() => setIsMobileMenu(!isMobileMenu)}
            className="flex flex-col justify-center items-center w-8 h-8 gap-1 p-2 rounded-lg hover:bg-white/10 transition"
          >
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isMobileMenu ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isMobileMenu ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
                isMobileMenu ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenu && (
          <div className="absolute top-20 right-5 w-64 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl lg:hidden z-50 animate-in slide-in-from-top-2">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setIsMobileMenu(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-all"
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
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
