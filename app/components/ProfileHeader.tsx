import { Shield, Mail, MapPin } from "lucide-react";
import { Link } from "react-router";
import { useRouteLoaderData } from "react-router";
import type { loader } from "../root";

export function ProfileHeader() {
  const rootData = useRouteLoaderData<typeof loader>("root");
  const user = rootData?.user;
  return (
    <div className="bg-slate-900/50 border border-white/10 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 md:gap-8 backdrop-blur-xl relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full p-1 bg-linear-to-br from-blue-500 to-purple-600">
          <img
            src="/images/jena.png"
            alt="Profile"
            className="w-full h-full rounded-full object-cover border-4 border-slate-900"
          />
        </div>
        <div className="absolute bottom-1 right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-slate-900" />
      </div>

      {/* User Info */}
      <div className="text-center md:text-left flex-1">
        <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            {user?.name}
          </h1>
          <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/20 flex items-center gap-1">
            <Shield className="w-3 h-3" />
            PRO PLAN
          </span>
        </div>

        <p className="text-slate-400 mb-4 max-w-md mx-auto md:mx-0">
          Senior Software Engineer specializing in React and AI technologies.
        </p>

        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-1.5">
            <Mail className="w-4 h-4" />
            <span>jena@example.com</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>San Francisco, CA</span>
          </div>
        </div>
      </div>

      {/* Edit Button */}
      <Link
        to="/profile/edit"
        className="px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium transition-all hover:scale-105 active:scale-95 text-center"
      >
        Edit Profile
      </Link>
    </div>
  );
}
