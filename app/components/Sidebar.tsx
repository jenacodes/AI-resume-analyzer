import { FileText } from "lucide-react";
import { Link, useRouteLoaderData } from "react-router";
import type { loader } from "~/root";

import { navItems } from "../constants/navigation";

export function Sidebar() {
  const rootData = useRouteLoaderData<typeof loader>("root");
  const user = rootData?.user;

  return (
    <aside className="hidden lg:flex w-64 h-screen fixed left-0 top-0 bg-white border-r-4 border-black flex-col p-6 z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-10 h-10 bg-neo-primary border-4 border-black shadow-neo-sm flex items-center justify-center">
          <FileText className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tighter text-black">
          ResumeAI
        </h1>
      </div>

      <nav className="flex-1 space-y-3">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className="flex items-center gap-3 px-4 py-3 border-2 border-transparent hover:border-black hover:bg-neo-accent hover:shadow-neo-sm transition-all duration-200 group"
          >
            <item.icon className="w-5 h-5 text-black group-hover:scale-110 transition-transform" />
            <span className="font-bold text-black uppercase text-sm tracking-wide">
              {item.label}
            </span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t-4 border-black">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-neo-secondary border-2 border-black flex items-center justify-center">
            <span className="text-sm font-bold text-white">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </span>
          </div>
          <div>
            <p className="text-sm font-bold text-black uppercase">
              {user?.name || "Guest User"}
            </p>
            <p className="text-xs font-mono text-gray-600">
              {user ? "PRO PLAN" : "FREE PLAN"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
