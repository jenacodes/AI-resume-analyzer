import { FileText } from "lucide-react";
import { Link, useRouteLoaderData } from "react-router";
import type { loader } from "~/root";

import { navItems } from "../constants/navigation";

export function Sidebar() {
  const rootData = useRouteLoaderData<typeof loader>("root");
  const user = rootData?.user;

  return (
    <aside className="hidden lg:flex w-64 h-screen fixed left-0 top-0 bg-slate-900/30 backdrop-blur-xl border-r border-white/10 flex-col p-6 z-50">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="w-8 h-8 rounded-lg bg-linear-to-br from-blue-500 to-purple-600 shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center justify-center">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-400 to-purple-400">
          ResumeAI
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.href}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-all duration-300 group"
          >
            <item.icon className="w-5 h-5 group-hover:text-blue-400 group-hover:drop-shadow-[0_0_8px_rgba(96,165,250,0.5)] transition-all" />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/10">
        <div className="flex items-center gap-3 px-2">
          <div className="w-10 h-10 rounded-full bg-linear-to-tr from-purple-500 to-blue-500 p-[2px]">
            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center">
              <span className="text-sm font-bold text-white">
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </span>
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              {user?.name || "Guest User"}
            </p>
            <p className="text-xs text-slate-400">
              {user ? "Pro Plan" : "Free Plan"}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
